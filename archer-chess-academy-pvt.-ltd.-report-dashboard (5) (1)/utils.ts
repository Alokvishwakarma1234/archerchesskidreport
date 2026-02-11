import { Grade, SkillEvaluation, Verdict, VerdictStatus, CoachData, Batch } from './types';
import { GRADE_SCORES, VERDICT_THRESHOLD_READY, VERDICT_THRESHOLD_ALMOST, RAW_CSV_DATA } from './constants';

export const calculateTotalScore = (skills: SkillEvaluation[]): number => {
  return skills.reduce((total, skill) => total + GRADE_SCORES[skill.grade], 0);
};

export const getVerdict = (score: number): Verdict => {
  if (score >= VERDICT_THRESHOLD_READY) {
    return {
      score,
      status: 'READY',
      label: 'Tournament Ready',
      colorClass: 'text-green-600 border-green-600 bg-green-50',
      icon: '🟢',
    };
  } else if (score >= VERDICT_THRESHOLD_ALMOST) {
    return {
      score,
      status: 'ALMOST',
      label: 'Almost Ready',
      colorClass: 'text-yellow-600 border-yellow-600 bg-yellow-50',
      icon: '🟡',
    };
  } else {
    return {
      score,
      status: 'NOT_READY',
      label: 'Not Ready',
      colorClass: 'text-red-600 border-red-600 bg-red-50',
      icon: '🔴',
    };
  }
};

// Name normalization map to match the prompt's master list
const COACH_NAME_MAPPING: Record<string, string> = {
  'Aayush': 'Ayush Bharadwaj',
  'Chandresh': 'Chandreesh',
  'Ambarish': 'Ambarnish',
};

export const parseCSVData = (): CoachData[] => {
  const lines = RAW_CSV_DATA.trim().split('\n');
  const coachMap = new Map<string, Batch[]>();

  // Skip header (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle potential quotes in CSV if any, though our data looks clean.
    // Simple split by comma for this specific dataset
    const parts = line.split(',');
    if (parts.length < 4) continue;

    let rawCoachName = parts[1].trim();
    const batchName = parts[2].trim();
    const level = parts[3].trim();

    // Normalize coach name
    const coachName = COACH_NAME_MAPPING[rawCoachName] || rawCoachName;

    if (!coachMap.has(coachName)) {
      coachMap.set(coachName, []);
    }

    const batches = coachMap.get(coachName);
    if (batches) {
      batches.push({ name: batchName, level });
    }
  }

  // Convert Map to array and sort coaches alphabetically
  const result: CoachData[] = Array.from(coachMap.entries()).map(([name, batches]) => ({
    name,
    batches: batches.sort((a, b) => a.name.localeCompare(b.name)),
  }));

  return result.sort((a, b) => a.name.localeCompare(b.name));
};
