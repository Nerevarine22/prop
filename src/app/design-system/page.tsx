import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Database,
  FileSearch,
  Info,
  Search,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Metric } from '@/components/ui/Metric';
import { RuleRow } from '@/components/ui/RuleRow';
import { SelectField } from '@/components/ui/SelectField';
import { TextInput } from '@/components/ui/TextInput';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Design system lab',
  description: 'Private visual testing surface for the PropHub design system.',
  robots: { index: false, follow: false },
};

const palette = [
  { name: 'Accent', value: '#615FFF', className: styles.swatchAccent },
  { name: 'Surface', value: '#262626', className: styles.swatchSurface },
  { name: 'Border / hover', value: '#3A3A3A', className: styles.swatchBorder },
  { name: 'Accent soft', value: '#A3B3FF', className: styles.swatchSoft },
  { name: 'Accent tint', value: '#E0E3FF', className: styles.swatchTint },
];

const metrics = [
  { label: 'Challenge', value: '$79', note: 'From' },
  { label: 'Profit split', value: '90%', note: 'Up to' },
  { label: 'Max drawdown', value: '8%', note: 'Static' },
];

export default function DesignSystemPage() {
  return (
    <div className={styles.lab}>
      <div className={styles.shell}>
        <nav className={styles.labNav} aria-label="Design lab navigation">
          <Link className={styles.labNavActive} href="/design-system">
            Candidate A components
          </Link>
          <Link href="/design-system/directions">Page directions</Link>
          <Link href="/design-system/cards">Card stress test</Link>
          <Link href="/design-system/home">Home prototype</Link>
        </nav>

        <header className={styles.intro}>
          <div>
            <div className={styles.kicker}>PropHub design lab · Candidate A</div>
            <h1>Accessible crypto research, without the noise.</h1>
            <p>
              A private testing surface for color, typography and decision-focused components.
              Nothing on this page is a final production choice.
            </p>
          </div>
          <div className={styles.directionCard}>
            <span>Direction</span>
            <strong>Approachable first</strong>
            <small>Research depth when the trader asks for it.</small>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="palette-heading">
          <div className={styles.sectionHeading}>
            <div>
              <span>01</span>
              <h2 id="palette-heading">Color candidate</h2>
            </div>
            <p>Flat graphite surfaces with a restrained violet-blue accent.</p>
          </div>
          <div className={styles.paletteGrid}>
            {palette.map((color) => (
              <div className={`${styles.swatch} ${color.className}`} key={color.value}>
                <span>{color.name}</span>
                <strong>{color.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="type-heading">
          <div className={styles.sectionHeading}>
            <div>
              <span>02</span>
              <h2 id="type-heading">Typography</h2>
            </div>
            <p>Space Grotesk for clarity and personality. Mono only for technical identifiers.</p>
          </div>
          <div className={styles.typePanel}>
            <div className={styles.typeDisplay}>
              <span>Display · 64 / 0.98</span>
              <strong>Choose with context.</strong>
            </div>
            <div className={styles.typeSamples}>
              <div>
                <span>Heading</span>
                <h3>Rules should be easy to understand.</h3>
              </div>
              <div>
                <span>Body</span>
                <p>
                  Compare challenge structure, payout conditions and reward programs before
                  committing capital.
                </p>
              </div>
              <div className={styles.dataSample}>
                <span>Data and identifiers</span>
                <strong>90% · 8% · 14 days</strong>
                <code>0x71F2...A93C</code>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="controls-heading">
          <div className={styles.sectionHeading}>
            <div>
              <span>03</span>
              <h2 id="controls-heading">Controls</h2>
            </div>
            <p>Clear actions and filters without neon, glow or unnecessary decoration.</p>
          </div>
          <div className={styles.controlPanel}>
            <div className={styles.buttonRow}>
              <Button>
                Compare firms <ArrowRight aria-hidden="true" />
              </Button>
              <Button variant="secondary">
                View full rules
              </Button>
              <Button variant="quiet">
                See sources
              </Button>
              <Button variant="secondary" disabled>
                Loading data
              </Button>
            </div>
            <div className={styles.formRow}>
              <TextInput label="Search firms" placeholder="Name, platform or feature" type="search" icon={<Search aria-hidden="true" />} />
              <SelectField label="Evaluation" defaultValue="all" icon={<SlidersHorizontal aria-hidden="true" />}>
                <option value="all">All models</option>
                <option value="one-step">1-Step</option>
                <option value="two-step">2-Step</option>
              </SelectField>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="status-heading">
          <div className={styles.sectionHeading}>
            <div>
              <span>04</span>
              <h2 id="status-heading">Trust and status</h2>
            </div>
            <p>Brand color stays separate from research confidence and material risk.</p>
          </div>
          <div className={styles.statusGrid}>
            <article className={`${styles.statusCard} ${styles.statusDemo}`}>
              <Database aria-hidden="true" />
              <div><Badge tone="warning"><Database aria-hidden="true" /> Demo data</Badge><span>Sample content, not independently verified.</span></div>
            </article>
            <article className={`${styles.statusCard} ${styles.statusReported}`}>
              <FileSearch aria-hidden="true" />
              <div><Badge tone="info"><FileSearch aria-hidden="true" /> Reported</Badge><span>Published by the firm or a named source.</span></div>
            </article>
            <article className={`${styles.statusCard} ${styles.statusVerified}`}>
              <BadgeCheck aria-hidden="true" />
              <div><Badge tone="positive"><BadgeCheck aria-hidden="true" /> Verified</Badge><span>Method, source and review date are available.</span></div>
            </article>
            <article className={`${styles.statusCard} ${styles.statusRisk}`}>
              <ShieldAlert aria-hidden="true" />
              <div><Badge tone="danger">Material risk</Badge><span>This condition may affect payout eligibility.</span></div>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="components-heading">
          <div className={styles.sectionHeading}>
            <div>
              <span>05</span>
              <h2 id="components-heading">Decision components</h2>
            </div>
            <p>A quick-decision layer with a path to deeper research.</p>
          </div>
          <div className={styles.componentGrid}>
            <article className={styles.firmCard}>
              <div className={styles.firmTopline}>
                <div className={styles.firmIdentity}>
                  <div className={styles.firmMark}>S</div>
                  <div>
                    <span>Sample firm</span>
                    <h3>Signal Funded</h3>
                  </div>
                </div>
                <span className={styles.demoBadge}><Database aria-hidden="true" /> Demo</span>
              </div>
              <p className={styles.firmSummary}>
                A simple evaluation model with flexible platforms and a reported points program.
              </p>
              <div className={styles.metricGrid}>
                {metrics.map((metric) => (
                  <Metric key={metric.label} label={metric.label} value={metric.value} note={metric.note} />
                ))}
              </div>
              <div className={styles.tagRow}>
                <Badge>1-Step</Badge><Badge>cTrader</Badge><Badge tone="warning">Points reported</Badge>
              </div>
              <div className={styles.cardActions}>
                <Button>View research <ArrowRight aria-hidden="true" /></Button>
                <Button variant="secondary">Compare</Button>
              </div>
            </article>

            <div className={styles.researchStack}>
              <article className={styles.calloutCard}>
                <Info aria-hidden="true" />
                <div>
                  <span>At a glance</span>
                  <strong>Good flexibility, but confirm the consistency rule.</strong>
                  <p>The quick layer summarizes the decision. Detailed rules remain one step away.</p>
                </div>
              </article>
              <article className={styles.ruleCard}>
                <RuleRow
                  label="Daily loss limit"
                  value="4%"
                  description="Calculated from the higher of starting balance or equity at the daily reset."
                  emphasis
                />
                <button type="button">View full rule and source <ArrowRight aria-hidden="true" /></button>
              </article>
              <article className={styles.tintCard}>
                <span>Light accent surface</span>
                <strong>Use sparingly for explanation, not every promotion.</strong>
              </article>
            </div>
          </div>
        </section>

        <footer className={styles.labFooter}>
          <span>Candidate A · 08 Aug 2026</span>
          <p>Review the feeling first. Token values and components can change independently.</p>
        </footer>
      </div>
    </div>
  );
}
