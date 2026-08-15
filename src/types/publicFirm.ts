import type { EvaluationStep } from './firm';

export interface FirmDirectoryMetric {
  label: string;
  value: string;
  note: string;
}

export interface PublicFirmDirectoryItem {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  tagline: string;
  statusLabel: 'Full profile' | 'Research notes';
  tags: string[];
  metrics: FirmDirectoryMetric[];
  searchText: string;
  evaluationSteps: EvaluationStep[];
  weekendHoldingAllowed?: boolean;
  hasRewards: boolean;
  comparable: boolean;
}
