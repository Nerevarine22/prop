import Link from 'next/link';
import type { FirmNormalizedProfile, FirmNormalizedProfileV2 } from '@/types/database';
import { FirmEditorialContent } from './FirmEditorialContent';
import { ProprEditorialContent } from './ProprEditorialContent';
import { FirmEditorialHero } from './ProprEditorialHero';
import styles from '@/app/product-lab/page.module.css';

type FirmProfileBodyProps = {
  firm: FirmNormalizedProfile;
  profileOverride?: FirmNormalizedProfileV2;
  editMode?: boolean;
  selectedBlockId?: string | null;
  onProfileChange?: (profile: FirmNormalizedProfileV2) => void;
};

export function FirmProfileBody({ firm, profileOverride, editMode, selectedBlockId, onProfileChange }: FirmProfileBodyProps) {
  return (
    <>
      <FirmEditorialHero firm={firm} profileOverride={profileOverride} />
      {firm.slug === 'propr' || firm.slug === 'sizeprop'
        ? <ProprEditorialContent firm={firm} profileOverride={profileOverride} editMode={editMode} selectedBlockId={selectedBlockId} onProfileChange={onProfileChange} />
        : <FirmEditorialContent firm={firm} profileOverride={profileOverride} editMode={editMode} selectedBlockId={selectedBlockId} onProfileChange={onProfileChange} />}
    </>
  );
}

export function FirmProfileExperience({ firm }: { firm: FirmNormalizedProfile }) {
  return (
    <div className={styles.productPage}>
      <div className={styles.breadcrumbs}><Link href="/prop-firms">Firms</Link><span>/</span><span>{firm.name}</span></div>
      <FirmProfileBody firm={firm} />
    </div>
  );
}
