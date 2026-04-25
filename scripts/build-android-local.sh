#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
LOCAL_PROPERTIES_FILE="$ANDROID_DIR/local.properties"
LOG_DIR="$ROOT_DIR/.build-logs"
TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
LOG_FILE="$LOG_DIR/android-build-$TIMESTAMP.log"
ANDROID_SDK_ROOT_DEFAULT="$HOME/Android/Sdk"
CMDLINE_TOOLS_ZIP_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
CMDLINE_TOOLS_ZIP="/tmp/commandlinetools-linux.zip"
CMDLINE_TOOLS_TMP="/tmp/android-cmdline-tools-$TIMESTAMP"
SDK_CMAKE_VERSION="3.22.1"

mkdir -p "$LOG_DIR"

exec > >(tee -a "$LOG_FILE") 2>&1

cleanup() {
  rm -rf "$CMDLINE_TOOLS_TMP"
}

on_error() {
  local exit_code=$?
  local line_no=${1:-unknown}
  echo
  echo "[ERROR] Command failed at line $line_no with exit code $exit_code"
  echo "[ERROR] Full log: $LOG_FILE"
  exit "$exit_code"
}

trap cleanup EXIT
trap 'on_error $LINENO' ERR

log() {
  echo
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $*"
}

accept_android_licenses() {
  set +o pipefail
  yes | sdkmanager --licenses >/dev/null
  local status=$?
  set -o pipefail
  if [[ "$status" -eq 0 || "$status" -eq 141 ]]; then
    return 0
  fi
  return "$status"
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "[ERROR] Required command not found: $cmd"
    exit 1
  fi
}

append_if_missing() {
  local line="$1"
  local file="$2"
  touch "$file"
  if ! grep -Fqx "$line" "$file"; then
    echo "$line" >> "$file"
  fi
}

upsert_local_property() {
  local key="$1"
  local value="$2"
  local file="$3"

  touch "$file"
  if grep -Eq "^${key}=" "$file"; then
    sed -i "s#^${key}=.*#${key}=${value}#" "$file"
  else
    echo "${key}=${value}" >> "$file"
  fi
}

ensure_sdk_cmake_shims() {
  local sdk_cmake_bin_dir="$ANDROID_HOME/cmake/$SDK_CMAKE_VERSION/bin"

  mkdir -p "$sdk_cmake_bin_dir"
  ln -sf /usr/bin/cmake "$sdk_cmake_bin_dir/cmake"
  ln -sf /usr/bin/ninja "$sdk_cmake_bin_dir/ninja"
}

check_ndk_host_toolchain() {
  local ndk_root="$ANDROID_HOME/ndk/27.1.12297006"
  local ndk_clang="$ndk_root/toolchains/llvm/prebuilt/linux-x86_64/bin/clang"

  if [[ ! -x "$ndk_clang" ]]; then
    echo "[ERROR] Expected NDK clang was not found at $ndk_clang"
    exit 1
  fi

  if ! "$ndk_clang" --version >/dev/null 2>&1; then
    echo "[ERROR] Installed Android NDK is not executable on this host: $ndk_clang"
    echo "[ERROR] This machine is $(uname -m), but the installed NDK host toolchain is linux-x86_64."
    echo "[ERROR] Build on an x86_64 Linux host, or replace the NDK with a host-compatible prebuilt if one is available."
    exit 1
  fi
}

detect_java_home() {
  if [[ -n "${JAVA_HOME:-}" && -x "${JAVA_HOME}/bin/java" ]]; then
    echo "$JAVA_HOME"
    return
  fi

  local candidate
  for candidate in \
    "/usr/lib/jvm/java-17-openjdk-amd64" \
    "/usr/lib/jvm/java-17-openjdk" \
    "/usr/lib/jvm/default-java"
  do
    if [[ -x "$candidate/bin/java" ]]; then
      echo "$candidate"
      return
    fi
  done

  if command -v javac >/dev/null 2>&1; then
    local javac_path resolved
    javac_path="$(command -v javac)"
    resolved="$(readlink -f "$javac_path")"
    dirname "$(dirname "$resolved")"
    return
  fi

  echo ""
}

log "Local Hercules Android build started"
log "Root: $ROOT_DIR"
log "Log file: $LOG_FILE"

require_command sudo
require_command wget
require_command unzip
require_command npm

log "Installing base packages"
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk unzip wget cmake ninja-build

JAVA_HOME_DETECTED="$(detect_java_home)"
if [[ -z "$JAVA_HOME_DETECTED" ]]; then
  echo "[ERROR] Could not determine JAVA_HOME after Java installation"
  exit 1
fi

export JAVA_HOME="$JAVA_HOME_DETECTED"
export ANDROID_HOME="${ANDROID_HOME:-$ANDROID_SDK_ROOT_DEFAULT}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

log "JAVA_HOME=$JAVA_HOME"
log "ANDROID_HOME=$ANDROID_HOME"

append_if_missing "export JAVA_HOME=$JAVA_HOME" "$HOME/.bashrc"
append_if_missing 'export ANDROID_HOME=$HOME/Android/Sdk' "$HOME/.bashrc"
append_if_missing 'export ANDROID_SDK_ROOT=$HOME/Android/Sdk' "$HOME/.bashrc"
append_if_missing 'export PATH=$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH' "$HOME/.bashrc"

log "Downloading Android command-line tools"
mkdir -p "$ANDROID_HOME/cmdline-tools" "$CMDLINE_TOOLS_TMP"
wget -O "$CMDLINE_TOOLS_ZIP" "$CMDLINE_TOOLS_ZIP_URL"
unzip -o "$CMDLINE_TOOLS_ZIP" -d "$CMDLINE_TOOLS_TMP"
rm -rf "$ANDROID_HOME/cmdline-tools/latest"
mkdir -p "$ANDROID_HOME/cmdline-tools/latest"
mv "$CMDLINE_TOOLS_TMP"/cmdline-tools/* "$ANDROID_HOME/cmdline-tools/latest/"

require_command sdkmanager

log "Accepting Android SDK licenses"
accept_android_licenses

log "Installing Android SDK packages"
sdkmanager \
  "platform-tools" \
  "platforms;android-36" \
  "build-tools;36.0.0" \
  "ndk;27.1.12297006" \
  "cmake;3.22.1"

log "Installing JavaScript dependencies"
cd "$ROOT_DIR"
npm install

log "Generating native Android project with Expo prebuild"
npx expo prebuild --platform android --non-interactive

upsert_local_property "sdk.dir" "$ANDROID_HOME" "$LOCAL_PROPERTIES_FILE"
upsert_local_property "cmake.dir" "/usr" "$LOCAL_PROPERTIES_FILE"

log "Forcing native host CMake/Ninja shims for Android SDK CMake $SDK_CMAKE_VERSION"
ensure_sdk_cmake_shims

log "Checking toolchain versions"
java -version
sdkmanager --version
cmake --version
ninja --version
check_ndk_host_toolchain

log "Building release APK"
cd "$ANDROID_DIR"
./gradlew assembleRelease

APK_PATH="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"

if [[ ! -f "$APK_PATH" ]]; then
  echo "[ERROR] Build finished without producing APK at $APK_PATH"
  exit 1
fi

log "APK built successfully"
log "APK path: $APK_PATH"
log "APK size:"
ls -lh "$APK_PATH"
log "Build complete"
