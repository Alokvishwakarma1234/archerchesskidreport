export enum Grade {
  APlus = 'A+',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

export interface StudentData {
  name: string;
  coachName: string;
  batchName: string;
  level: string;
}

export interface SkillEvaluation {
  id: string;
  name: string;
  grade: Grade;
}

export type VerdictStatus = 'READY' | 'ALMOST' | 'NOT_READY';

export interface Verdict {
  score: number;
  status: VerdictStatus;
  label: string;
  colorClass: string;
  icon: string;
}

export interface Batch {
  name: string; // e.g., "TF 5 PM IST"
  level: string; // e.g., "Intermediate"
}

export interface CoachData {
  name: string;
  batches: Batch[];
}