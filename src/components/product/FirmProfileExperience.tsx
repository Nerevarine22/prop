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
};

export function FirmProfileBody({ firm, profileOverride, editMode, selectedBlockId }: FirmProfileBodyProps) {
  return (
    <>
      <FirmEditorialHero firm={firm} profileOverride={profileOverride} />
      {firm.slug === 'propr'
        ? <ProprEditorialContent firm={firm} />
        : <FirmEditorialContent firm={firm} profileOverride={profileOverride} editMode={editMode} selectedBlockId={selectedBlockId} />}
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
