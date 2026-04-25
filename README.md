# Hercules

Voice-first gym logging app focused on fast set capture, rest timing, and daily workout review.

## Standalone app status

This folder is now structured so it can live as its own repository:

- `app.json` and `eas.json` identify Hercules directly.
- `package.json` includes Hercules-specific APK build commands.
- `scripts/build-android-local.sh` builds a release APK from this folder after running Expo prebuild.
- `scripts/build-android-docker.sh` and `Dockerfile.android` provide an isolated Docker APK path.

## Build commands

```bash
npm install
npm run build:apk:preview
```

For a local native build:

```bash
npm run build:apk:local
```

For a Dockerized local build:

```bash
npm run build:apk:docker
```

## OTA updates

After a preview APK is installed, JavaScript-only changes can ship without reinstalling the app.

```bash
npm run update:preview
npm run update:production
```

The installed build must be on the matching EAS channel. GitHub Actions can also publish updates automatically on pushes to `main` when `EXPO_TOKEN` is configured in repo secrets.

## Required setup

- Set `EXPO_PUBLIC_SUPABASE_URL`
- Set `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Deploy the Supabase Edge Function at `openai`, or set `EXPO_PUBLIC_HERCULES_AI_URL` to another compatible server-side endpoint
- Configure Expo/EAS auth if using cloud builds
- Run the SQL in `scripts/client-error-logs.sql` before expecting client error logging to persist

## Environment security

- `EXPO_PUBLIC_*` values are bundled into the Expo client. Treat them as public runtime config, not secrets.
- `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are expected to be public client values.
- Do not put `OPENAI_API_KEY`, Supabase service-role keys, database passwords, or other provider secrets in `EXPO_PUBLIC_*`.
- By default Hercules now calls `${EXPO_PUBLIC_SUPABASE_URL}/functions/v1/openai`, which keeps the OpenAI key on the server side.
- `EXPO_PUBLIC_HERCULES_AI_URL` is optional and only needed if you want Hercules to use a different compatible AI endpoint.
- Keep actual provider secrets only on the server handling the AI requests.
- Start from `.env.example`, keep real `.env` files uncommitted, and rotate any key that has already been shipped in a client build.

## Repo notes

- If you split this into a new git repo, copy the full `hercules/` directory as the repo root.
- The generated `android/` directory is intentionally ignored; local scripts recreate it with `expo prebuild`.
- Supporting docs remain in `DESIGN.md`, `DATA_MODEL.md`, and `EVALS.md`.
