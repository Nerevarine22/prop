import Link from 'next/link';
import type { FirmNormalizedProfile } from '@/types/database';
import { FirmEditorialContent } from './FirmEditorialContent';
import { ProprEditorialContent } from './ProprEditorialContent';
import { FirmEditorialHero } from './ProprEditorialHero';
import styles from '@/app/product-lab/page.module.css';

export function FirmProfileExperience({ firm }: { firm: FirmNormalizedProfile }) {
  return (
    <div className={styles.productPage}>
      <div className={styles.breadcrumbs}><Link href="/prop-firms">Firms</Link><span>/</span><span>{firm.name}</span></div>
      <FirmEditorialHero firm={firm} />
      {firm.slug === 'propr' ? <ProprEditorialContent firm={firm} /> : <FirmEditorialContent firm={firm} />}
    </div>
  );
}
