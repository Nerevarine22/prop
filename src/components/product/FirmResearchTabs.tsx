'use client';

import { ModularFirmResearchTabs } from './ModularFirmResearchTabs';
import { getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import type { FirmNormalizedProfile } from '@/types/database';

export function FirmResearchTabs({ firm, offerUrl }: { firm: FirmNormalizedProfile; offerUrl?: string }) {
  return <ModularFirmResearchTabs firm={firm} profile={getFirmModularProfile(firm)} offerUrl={offerUrl} />;
}
