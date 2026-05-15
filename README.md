# Hercules

Hercules is a voice-first strength training logger that turns gym shorthand into structured, session-aware workout data.

It is designed for the moment when typing is the wrong interface: mid-session, under fatigue, between sets, with a timer running. A lifter can say "bench, set two, 185 for five, last rep slow" and Hercules turns that into an editable set card, a clean log entry, and continuity for the next set.

The important detail: Hercules remembers the current exercise block. If the next capture omits context - "same weight for six", "set three, five reps", or just "eight, last one was ugly" - the app can infer the exercise, set number, unit, and row placement from the active block, while surfacing its assumptions for correction.

The product bet is focused: AI should remove friction from capture before it tries to become a coach.

## Product Story

Most fitness apps make the user serve the database. Hercules makes the model serve the lifter.

Gym speech is compact, contextual, and messy. "Top set moved easy", "left shoulder pinchy", "same weight for eight", and "give me ninety" all carry structure, but traditional trackers force the user to translate that structure manually. Hercules does the translation in the moment.

The result is a logging flow that fits the session instead of interrupting it.

## What It Does

- Captures set entries through press-and-hold voice recording.
- Transcribes audio through a server-side AI function.
- Parses exercise, set number, reps, load, unit, and qualitative notes.
- Uses current-session context to infer omitted details like exercise, next set number, and weight unit.
- Preserves useful training context such as pain, effort, tempo, and ambiguity.
- Shows assumption notes when it fills gaps, so inference remains transparent and correctable.
- Lets the user correct parsed output quickly before saving.
- Maintains a logbook grouped by day and exercise block.
- Includes a visible rest timer with preset intervals and audio completion.
- Stores workouts in Supabase and logs client-side failures for diagnosis.

## AI Engineering

Hercules uses a deliberately narrow AI pipeline:

```text
Audio
  -> transcription
  -> gym-speech parser
  -> structured set draft
  -> session-context merge
  -> user correction
  -> Supabase workout record
```

The parser is instructed to extract only one workout row at a time and avoid inventing missing values. It separates structured fields from qualitative notes, then sanitises notes so the log does not duplicate data already captured as reps, load, or set number.

The app then merges the parsed row into the active exercise block. This is where the experience becomes more than transcription:

- If the spoken exercise is missing, Hercules assumes the current exercise.
- If the set number is missing, Hercules fills the next available set row.
- If the weight unit is missing, Hercules carries forward the block's existing unit.
- If the exercise name is fuzzy, Hercules maps it through the exercise catalogue.
- If it makes an assumption, the UI displays that assumption rather than hiding it.

That means the user can speak naturally across a sequence of sets instead of repeating the full schema every time.

Key engineering choices:

- Provider secrets stay off-device behind a Supabase Edge Function or compatible AI proxy.
- `EXPO_PUBLIC_OPENAI_API_KEY` is explicitly rejected at runtime.
- Public Supabase config is treated as runtime config, not secret material.
- Smoke tests verify the AI endpoint before release.
- Parser design is backed by `EVALS.md`, so model behaviour can be tested against real gym shorthand.

## Architecture

```text
Expo React Native app
  -> Audio capture
  -> AI proxy / Supabase Edge Function
  -> structured parser response
  -> correction UI
  -> Supabase workout storage
  -> logbook and timer UI
```

## Product Surfaces

- **Capture** - the primary press-and-hold interaction for spoken sets.
- **Current Block** - the parsed exercise card with editable rows.
- **Timer** - rest timing that stays visible during the session.
- **Exercise Picker** - quick correction and movement replacement.
- **Logbook** - recent workout history grouped into exercise cards.
- **Error Logging** - client-side telemetry persisted for debugging failed AI or storage flows.

## Tech Stack

- Expo 54
- React Native 0.81
- React 19
- TypeScript
- Supabase for workout storage and client error logging
- OpenAI-compatible server-side function for transcription and parsing
- EAS for preview and production updates

## Getting Started

```bash
npm install
cp .env.example .env
npm start
```

Required runtime config:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional AI endpoint override:

```bash
EXPO_PUBLIC_HERCULES_AI_URL=https://your-api.example.com/hercules-ai
```

If `EXPO_PUBLIC_HERCULES_AI_URL` is not set, Hercules calls `${EXPO_PUBLIC_SUPABASE_URL}/functions/v1/openai`.

## Build And Release

```bash
npm run build:apk:preview
npm run update:preview
npm run update:production
```

For local Android builds:

```bash
npm run build:apk:local
npm run build:apk:docker
```

Run `scripts/client-error-logs.sql` before expecting client error logging to persist.

## Supporting Docs

- `DESIGN.md` defines the product thesis and interaction direction.
- `DATA_MODEL.md` lays out the v1 training/session/event model.
- `EVALS.md` captures gym-speech examples and parser expectations.

## Repository Map

- `App.tsx` - capture, correction, timer, and logbook flow
- `lib/openai.ts` - transcription and structured parser client
- `lib/env.ts` - secure runtime configuration checks
- `lib/supabase.ts` - workout persistence and error logging
- `lib/exercise-catalog.ts` - movement matching and aliases
- `ui/` - theme, types, and reusable components
- `scripts/` - Android, EAS, smoke test, and Supabase setup helpers

## Security Posture

- Real `.env` files are ignored.
- `EXPO_PUBLIC_*` values are treated as public runtime config.
- Raw provider secrets must stay on the server-side AI endpoint.
- Runtime checks fail fast if an OpenAI key is accidentally exposed through Expo public env.

## Why This Is Portfolio-Relevant

Hercules demonstrates practical applied AI: speech-to-structure, domain-specific parsing, mobile UX under physical constraints, secure AI proxying, Supabase persistence, parser eval thinking, and a product scope disciplined enough to be useful.
