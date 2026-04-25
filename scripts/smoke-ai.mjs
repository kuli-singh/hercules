import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env');
const envFile = readFileSync(envPath, 'utf8');

for (const rawLine of envFile.split('\n')) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;
  const index = line.indexOf('=');
  if (index === -1) continue;
  const key = line.slice(0, index).trim();
  const value = line.slice(index + 1).trim();
  if (!(key in process.env)) {
    process.env[key] = value;
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const overrideAiUrl = process.env.EXPO_PUBLIC_HERCULES_AI_URL;

if (!supabaseUrl || !anonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
}

const endpoint = (overrideAiUrl || `${supabaseUrl.replace(/\/+$/, '')}/functions/v1/openai`).replace(/\/+$/, '');
const headers = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
  'Content-Type': 'application/json',
};

const postJson = async (payload) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  }

  return data;
};

const chatResult = await postJson({
  action: 'chat',
  model: 'gpt-4o-mini',
  temperature: 0,
  messages: [
    {
      role: 'system',
      content: 'Return exactly {"exercise":"bench press","set":3,"reps":8,"weight":185,"weightUnit":"lb","notes":"last rep slow"} and nothing else.',
    },
    {
      role: 'user',
      content: 'Bench press set three, eight reps at one eighty five, last rep was slow.',
    },
  ],
});

if (typeof chatResult?.content !== 'string' || !chatResult.content.includes('"exercise"')) {
  throw new Error(`Unexpected chat response: ${JSON.stringify(chatResult)}`);
}

console.log(`AI smoke test passed for ${endpoint}`);
console.log(`chat=${chatResult.content.trim()}`);
