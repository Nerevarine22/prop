import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Read .env.local manually for seed execution
const envPath = path.resolve(process.cwd(), '.env.local');
const envVars = {};

if (fs.existsSync(envPath)) {
  const envFileContent = fs.readFileSync(envPath, 'utf8');
  envFileContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.join('=').trim();
    }
  });
}

const firebaseConfig = {
  apiKey: envVars['NEXT_PUBLIC_FIREBASE_API_KEY'],
  authDomain: envVars['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
  projectId: envVars['NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
  storageBucket: envVars['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: envVars['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
  appId: envVars['NEXT_PUBLIC_FIREBASE_APP_ID'],
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('your_api_key')) {
  console.error('❌ Please fill in your real Firebase API keys inside .env.local first!');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MOCK_PROP_FIRMS = [
  {
    id: 'firm-1',
    slug: 'propr',
    name: 'Propr',
    logo: '/logos/fundingpips-clover.png',
    tagline: 'Flagship Crypto Prop Trading & Real-Time Transparency Platform.',
    description: 'Propr is the premier flagship crypto prop firm offering industry-leading profit splits up to 90%, seamless cTrader & MT5 integration, and instant crypto payouts.',
    rating: 4.9,
    reviewCount: 1420,
    featured: true,
    trending: true,
    badge: 'Flagship 2026',
    profitSplit: 'Up to 90%',
    maxDrawdown: '10% Maximum',
    dailyDrawdown: '5% Daily',
    profitTarget: '8% Phase 1 / 5% Phase 2',
    minCapital: 5000,
    maxCapital: 300000,
    cryptoLeverage: '1:100',
    evaluationSteps: ['2-Step', '1-Step'],
    platforms: ['cTrader', 'MT5', 'Match-Trader'],
    payoutFrequency: 'Bi-Weekly / 5 Days Fast Track',
    newsTradingAllowed: true,
    weekendHoldingAllowed: true,
    eaAllowed: true,
    noTimeLimit: true,
    cryptoPairsCount: 65,
    yearEstablished: 2024,
    headquarters: 'Zug, Switzerland',
    trustScore: 99,
    accountTiers: [
      { accountSize: 5000, price: 32, profitTarget: '8%', maxDrawdown: '10%', dailyDrawdown: '5%' },
      { accountSize: 100000, price: 399, profitTarget: '8%', maxDrawdown: '10%', dailyDrawdown: '5%' }
    ],
    verifiedCoupon: {
      id: 'c1',
      firmId: 'firm-1',
      firmName: 'Propr',
      code: 'PROPHUB20',
      discount: '20% OFF + 90% Split',
      description: 'Exclusive 20% discount on all challenge tiers.',
      verified: true,
      highlight: true
    }
  },
  {
    id: 'firm-2',
    slug: 'breakout-prop',
    name: 'Breakout Prop',
    logo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=120&auto=format&fit=crop&q=80',
    tagline: 'Direct Crypto Execution Engine & 95% Profit Payouts.',
    description: 'Breakout Prop provides direct liquidity engine access for crypto traders.',
    rating: 4.8,
    reviewCount: 890,
    featured: true,
    profitSplit: 'Up to 95%',
    maxDrawdown: '12% Static',
    dailyDrawdown: '6% Daily',
    profitTarget: '10% Single Phase',
    minCapital: 10000,
    maxCapital: 400000,
    cryptoLeverage: '1:50',
    evaluationSteps: ['1-Step', 'Instant Funding'],
    platforms: ['Bybit', 'cTrader', 'TradeLocker'],
    payoutFrequency: 'On-Demand Crypto Payouts',
    newsTradingAllowed: true,
    weekendHoldingAllowed: true,
    eaAllowed: true,
    noTimeLimit: true,
    cryptoPairsCount: 85,
    yearEstablished: 2023,
    headquarters: 'Zug, Switzerland',
    trustScore: 95,
    verifiedCoupon: {
      id: 'c2',
      firmId: 'firm-2',
      firmName: 'Breakout Prop',
      code: 'BREAKOUT15',
      discount: '15% OFF + Free Retry',
      description: 'Get 15% discount on 1-Step Evaluation.',
      verified: true,
      highlight: true
    }
  },
  {
    id: 'firm-3',
    slug: 'bybit-prop',
    name: 'Bybit Prop Hub',
    logo: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=120&auto=format&fit=crop&q=80',
    tagline: 'Enterprise Crypto Trading Power & Institutional Liquidity.',
    description: 'Backed by tier-1 crypto exchange infrastructure.',
    rating: 4.9,
    reviewCount: 2150,
    featured: true,
    trending: true,
    profitSplit: '85% - 90%',
    maxDrawdown: '8% Trailing',
    dailyDrawdown: '4% Daily',
    profitTarget: '8% Phase 1',
    minCapital: 25000,
    maxCapital: 500000,
    cryptoLeverage: '1:50',
    evaluationSteps: ['2-Step'],
    platforms: ['Bybit', 'MT5'],
    payoutFrequency: 'Weekly USDT / USDC',
    newsTradingAllowed: true,
    weekendHoldingAllowed: true,
    eaAllowed: false,
    noTimeLimit: true,
    cryptoPairsCount: 120,
    yearEstablished: 2024,
    headquarters: 'Singapore',
    trustScore: 99,
    verifiedCoupon: {
      id: 'c3',
      firmId: 'firm-3',
      firmName: 'Bybit Prop Hub',
      code: 'BYBITPRO26',
      discount: '10% OFF + Double Capital',
      description: '10% discount on evaluation.',
      verified: true
    }
  }
];

async function seed() {
  console.log('🚀 Seeding Firestore database with initial prop firm cards...');
  for (const firm of MOCK_PROP_FIRMS) {
    const docRef = doc(db, 'firms', firm.id);
    await setDoc(docRef, firm, { merge: true });
    console.log(`✅ Uploaded firm: ${firm.name} (${firm.slug})`);
  }
  console.log('🎉 Firestore database seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
