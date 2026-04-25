import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { getPublicEnvError, publicEnv } from './env';

let supabase: ReturnType<typeof createClient<any>> | null = null;

const getSupabase = () => {
  if (supabase) {
    return supabase;
  }

  supabase = createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return supabase;
};

export interface ClientErrorLogInput {
  feature: string;
  stage: string;
  message: string;
  errorName?: string | null;
  errorStack?: string | null;
  context?: Record<string, unknown>;
}

export interface WorkoutRecord {
  id: string;
  exercise: string;
  set: number | null;
  reps: number | null;
  weight: number | null;
  notes: string | null;
  created_at: string;
}

export interface InsertWorkoutInput {
  exercise: string;
  set: number | null;
  reps: number | null;
  weight: number | null;
  notes: string;
}

const truncate = (value: string, max = 5000) => (
  value.length > max ? `${value.slice(0, max)}...` : value
);

export async function logClientError(input: ClientErrorLogInput): Promise<void> {
  const configError = getPublicEnvError();
  if (configError) {
    console.warn('[Supabase] Skipping client error log:', configError);
    return;
  }

  const payload = {
    feature: input.feature,
    stage: input.stage,
    message: truncate(input.message, 2000),
    error_name: input.errorName || null,
    error_stack: input.errorStack ? truncate(input.errorStack, 8000) : null,
    context: input.context || {},
  };

  const { error } = await getSupabase()
    .from('client_error_logs')
    .insert([payload]);

  if (error) {
    console.warn('[Supabase] Failed to persist client error log:', error.message);
  }
}

export async function insertWorkout(input: InsertWorkoutInput): Promise<WorkoutRecord | null> {
  const payload = {
    exercise: input.exercise,
    set: input.set,
    reps: input.reps,
    weight: input.weight,
    notes: truncate(input.notes, 2000),
  };

  const { data, error } = await getSupabase()
    .from('workouts')
    .insert([payload])
    .select()
    .single();

  if (error) {
    await logClientError({
      feature: 'workout_capture',
      stage: 'supabase_insert_workout',
      message: error.message,
      errorName: error.code || 'SupabaseWorkoutInsertError',
      context: {
        payload,
        hint: error.hint || null,
        details: error.details || null,
      },
    });
    throw new Error(`Supabase workout insert failed: ${error.message}`);
  }

  return data;
}

export async function fetchRecentWorkouts(): Promise<WorkoutRecord[]> {
  const { data, error } = await getSupabase()
    .from('workouts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    await logClientError({
      feature: 'workout_capture',
      stage: 'supabase_fetch_workouts',
      message: error.message,
      errorName: error.code || 'SupabaseWorkoutFetchError',
      context: {
        hint: error.hint || null,
        details: error.details || null,
      },
    });
    return [];
  }

  return data || [];
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('workouts')
    .delete()
    .eq('id', id);

  if (error) {
    await logClientError({
      feature: 'workout_capture',
      stage: 'supabase_delete_workout',
      message: error.message,
      errorName: error.code || 'SupabaseWorkoutDeleteError',
      context: {
        id,
        hint: error.hint || null,
        details: error.details || null,
      },
    });
    throw new Error(`Supabase workout delete failed: ${error.message}`);
  }
}
