#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${IMAGE_NAME:-hercules-android-builder}"
HOST_ARCH="$(uname -m)"
case "$HOST_ARCH" in
  x86_64) DEFAULT_PLATFORM="linux/amd64" ;;
  aarch64|arm64) DEFAULT_PLATFORM="linux/arm64" ;;
  *)
    printf 'Unsupported host architecture for default Docker platform: %s\n' "$HOST_ARCH" >&2
    printf 'Set PLATFORM explicitly, for example PLATFORM=linux/amd64\n' >&2
    exit 1
    ;;
esac
PLATFORM="${PLATFORM:-$DEFAULT_PLATFORM}"
CONTAINER_WORKDIR="/tmp/hercules"
ARTIFACT_DIR="${ARTIFACT_DIR:-$ROOT_DIR/.build-artifacts/android}"
DOCKERFILE_PATH="$ROOT_DIR/Dockerfile.android"

mkdir -p "$ARTIFACT_DIR"

docker buildx build \
  --platform "$PLATFORM" \
  --load \
  --tag "$IMAGE_NAME" \
  --file "$DOCKERFILE_PATH" \
  "$ROOT_DIR"

docker run --rm \
  --platform "$PLATFORM" \
  -v "$ROOT_DIR:/src" \
  -v "$ARTIFACT_DIR:/out" \
  "$IMAGE_NAME" \
  bash -lc "
    set -Eeuo pipefail
    rm -rf '$CONTAINER_WORKDIR'
    mkdir -p '$CONTAINER_WORKDIR'
    rsync -a --delete \
      --exclude .git \
      --exclude node_modules \
      --exclude .build-logs \
      --exclude .build-artifacts \
      --exclude android/.gradle \
      --exclude android/app/build \
      --exclude android/build \
      /src/ '$CONTAINER_WORKDIR'/
    cd '$CONTAINER_WORKDIR'
    npm ci
    npx expo prebuild --platform android --non-interactive
    cat > android/local.properties <<'EOF'
sdk.dir=/opt/android-sdk
cmake.dir=/usr
EOF
    ./android/gradlew --no-daemon assembleRelease
    cp android/app/build/outputs/apk/release/app-release.apk /out/hercules-release.apk
  "

printf 'APK written to %s\n' "$ARTIFACT_DIR/hercules-release.apk"
