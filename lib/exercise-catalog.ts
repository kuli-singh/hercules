import { exerciseCatalog, ExerciseCatalogItem } from '../src/config/exercise-catalog';

export interface ExerciseMatch {
  item: ExerciseCatalogItem;
  confidence: 'high' | 'medium' | 'low';
  matchedFrom: string;
}

const normalizeText = (value: string) => (
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
);

const tokenize = (value: string) => normalizeText(value).split(' ').filter(Boolean);

const GENERIC_ALIAS_TOKENS = new Set([
  'bench',
  'curl',
  'curls',
  'dip',
  'dips',
  'extension',
  'extensions',
  'fly',
  'press',
  'pushdown',
  'pressdown',
  'pulldown',
  'raise',
  'raises',
  'rollout',
  'row',
  'rows',
  'squat',
  'squats',
]);

const levenshtein = (a: string, b: string) => {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

export const getExerciseCatalog = () => exerciseCatalog;

export const getExerciseByLabel = (label: string | null | undefined): ExerciseCatalogItem | null => {
  const normalized = normalizeText(label || '');
  if (!normalized) return null;
  return exerciseCatalog.find((item) => normalizeText(item.label) === normalized) || null;
};

export const findClosestExercise = (rawExercise: string | null | undefined): ExerciseMatch | null => {
  const normalizedInput = normalizeText(rawExercise || '');
  if (!normalizedInput) return null;

  const inputTokens = tokenize(normalizedInput);
  const inputTokenSet = new Set(inputTokens);

  for (const item of exerciseCatalog) {
    for (const alias of [item.label, ...item.aliases]) {
      const normalizedAlias = normalizeText(alias);
      if (normalizedInput === normalizedAlias) {
        return {
          item,
          confidence: 'high',
          matchedFrom: alias,
        };
      }
    }
  }

  let best: { item: ExerciseCatalogItem; alias: string; distance: number; score: number } | null = null;

  for (const item of exerciseCatalog) {
    for (const alias of [item.label, ...item.aliases]) {
      const normalizedAlias = normalizeText(alias);
      const aliasTokens = tokenize(normalizedAlias);
      const aliasTokenSet = new Set(aliasTokens);
      const sharedTokenCount = aliasTokens.filter((token) => inputTokens.includes(token)).length;
      const sharedTokenRatio = sharedTokenCount / Math.max(aliasTokens.length, 1);
      const inputCoverageRatio = sharedTokenCount / Math.max(inputTokens.length, 1);
      const distance = levenshtein(normalizedInput, normalizedAlias);
      const normalizedLength = Math.max(normalizedInput.length, normalizedAlias.length, 1);
      const distanceRatio = distance / normalizedLength;
      const aliasHasGenericShape = aliasTokens.every((token) => GENERIC_ALIAS_TOKENS.has(token));
      const onlyMatchedGenericTokens = aliasHasGenericShape
        && sharedTokenCount > 0
        && aliasTokens.every((token) => inputTokenSet.has(token))
        && inputTokens.every((token) => aliasTokenSet.has(token));
      const phraseMatch = (
        aliasTokens.length > 1
        && (
          normalizedInput.includes(normalizedAlias)
          || normalizedAlias.includes(normalizedInput)
        )
      );

      const score = (
        (phraseMatch ? 320 : 0)
        + (sharedTokenRatio * 240)
        + (inputCoverageRatio * 180)
        + (sharedTokenCount * 22)
        + (aliasTokens.length > 1 && inputTokens.length > 1 ? 18 : 0)
        - (distanceRatio * 120)
        - (Math.abs(aliasTokens.length - inputTokens.length) * 12)
        - (aliasHasGenericShape ? 90 : 0)
        - (onlyMatchedGenericTokens ? 140 : 0)
      );

      if (!best || score > best.score || (score === best.score && distance < best.distance)) {
        best = { item, alias, distance, score };
      }
    }
  }

  if (!best) return null;

  const normalizedAlias = normalizeText(best.alias);
  const ratio = best.distance / Math.max(normalizedInput.length, normalizedAlias.length, 1);
  const bestAliasTokens = tokenize(normalizedAlias);
  const bestAliasHasGenericShape = bestAliasTokens.every((token) => GENERIC_ALIAS_TOKENS.has(token));
  const confidence = best.score >= 360
    ? 'high'
    : best.score >= 250
      ? 'medium'
      : best.score >= 190
        ? 'low'
        : null;

  if (
    confidence
    && ratio <= 0.45
    && !(bestAliasHasGenericShape && confidence === 'low')
  ) {
    return {
      item: best.item,
      confidence,
      matchedFrom: best.alias,
    };
  }

  return null;
};
