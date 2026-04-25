import { findClosestExercise, getExerciseByLabel } from './exercise-catalog';

export interface ExerciseGuidance {
  label: string;
  eccentricSeconds: number;
  pauseSeconds: number;
  concentricSeconds: number;
  restSeconds: number;
  cue: string;
}

const DEFAULT_REST_SECONDS = 60;

export const getExerciseGuidance = (exercise: string | null | undefined): ExerciseGuidance | null => {
  const exactItem = getExerciseByLabel(exercise);
  const matchedItem = exactItem || findClosestExercise(exercise)?.item || null;

  if (matchedItem) {
    return {
      label: matchedItem.label,
      eccentricSeconds: matchedItem.defaultTempo.eccentric,
      pauseSeconds: matchedItem.defaultTempo.pause,
      concentricSeconds: matchedItem.defaultTempo.concentric,
      restSeconds: matchedItem.defaultRestSeconds,
      cue: matchedItem.cue,
    };
  }

  return {
    label: 'General Strength Work',
    eccentricSeconds: 3,
    pauseSeconds: 1,
    concentricSeconds: 1,
    restSeconds: DEFAULT_REST_SECONDS,
    cue: 'Control the lowering phase, own the transition, and make the working reps look repeatable.',
  };
};
