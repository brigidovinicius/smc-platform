import type { Metadata, Viewport } from 'next';
import { MarketingHomeContent } from './_components/marketing-home-content';
import { StructuredData } from './_components/structured-data';
import { SITE_CONFIG } from '@/lib/site-config';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: 'CounterX – Evaluate, Buy and Sell Digital Assets with Real Data',
  description:
    'CounterX é a plataforma moderna para compra, venda e valuation de ativos SaaS e digitais.',
  keywords: [
    'SaaS marketplace',
    'buy SaaS',
    'sell SaaS',
    'automated valuation',
    'AI due diligence',
    'digital assets M&A',
    'digital assets marketplace',
    'invest in SaaS',
    'ARR multiples',
    'MRR',
    'micro-SaaS',
    'paid newsletters',
    'digital apps',
    'deal room',
    'verified buyers'
  ],
  authors: [{ name: 'CounterX' }],
  creator: 'CounterX',
  publisher: 'CounterX',
  alternates: {
    canonical: SITE_CONFIG.url
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: 'CounterX – The Digital Deal Desk',
    title: 'CounterX – Digital Assets Marketplace with Automated Valuation',
    description:
      'Buy and sell SaaS, newsletters, and apps with verified data. Automated valuation, AI-powered due diligence, and qualified buyers. Over 2,400 active investors.',
    images: [
      {
        url: '/images/hero-dashboard.webp',
        width: 1024,
        height: 1024,
        alt: 'CounterX dashboard showing valuation metrics and digital assets analysis'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CounterX – Digital Assets Marketplace',
    description:
      'Automated valuation, AI-powered due diligence, and verified buyers to trade SaaS and digital assets.',
    images: ['/images/hero-dashboard.webp'],
    creator: SITE_CONFIG.twitter.handle
  },
  verification: {
    // TODO: Add your real Google Search Console code here
    // Get it at: https://search.google.com/search-console
    google: 'ADICIONE_SEU_CODIGO_AQUI'
  }
};

const heroStats = [
  {
    label: 'Assets evaluated',
    value: 326,
    suffix: '+',
    description: 'MRR audited in the last 12 weeks.'
  },
  {
    label: 'Listed volume',
    value: 180,
    prefix: '$',
    suffix: 'M',
    description: 'Inventory available on the marketplace.'
  },
  {
    label: 'Verified buyers',
    value: 2400,
    suffix: '+',
    description: 'Investors, flippers, and funds.'
  },
  {
    label: 'Average time to sale',
    value: 34,
    suffix: ' days',
    description: 'From publish to closing.'
  }
];

const proofLogos = ['Atlas Capital', 'LatAm Operators', 'Orbit Ventures', 'Angels Club', 'Foxter Labs'];

const howItWorks = [
  {
    title: 'List your asset',
    description:
      'Guided, intuitive pitch that organizes your metrics in minutes. Simple interface that standardizes MRR, churn, CAC, and tech stack without complex spreadsheets.',
    highlight: '1 • Intake',
    icon: 'Upload'
  },
  {
    title: 'Get automated valuation',
    description:
      'Intelligent engine analyzes your data and generates a professional dossier ready to present. Valuation based on real market comparables.',
    highlight: '2 • Valuation',
    icon: 'Calculator'
  },
  {
    title: 'Negotiate with qualified buyers',
    description:
      'Streamlined process with verified buyers, digital NDA, and transparent negotiation trail. From first contact to closing.',
    highlight: '3 • Negotiation',
    icon: 'Handshake'
  }
];

const features = [
  {
    title: 'Automated Valuation',
    description:
      'Proprietary model cross-references MRR, churn, CAC, LTV, growth, and sector risks to recommend multiples.',
    icon: 'ChartLine'
  },
  {
    title: 'AI-Powered Due Diligence',
    description:
      'Intelligent checklist flags anomalies in revenue, cohorts, dependencies, and exposes the complete metrics history.',
    icon: 'Brain'
  },
  {
    title: 'Secure Deal Room',
    description:
      'Encrypted uploads, automatic blur, and access logs to share sensitive data only with those who advance.',
    icon: 'Shield'
  },
  {
    title: 'Buyer Network',
    description:
      'Pre-verified funds, aggregators, and flippers with operational agreements and SLAs for proposal submissions.',
    icon: 'Users'
  },
  {
    title: 'Exportable Reports',
    description:
      'Generate PDFs, spreadsheets, and data-room templates in one click to showcase traction and cash usage clearly.',
    icon: 'FileText'
  },
  {
    title: 'Operational Insights',
    description:
      'Alerts on churn, retention, payback, and health score to guide founders before opening a round or sale.',
    icon: 'Zap'
  }
];

const useCases = [
  {
    title: 'SaaS and app founders',
    description: 'Structure critical data, validate valuation, and choose when to open negotiations with the CounterX network.',
    highlight: 'Founders'
  },
  {
    title: 'Investors and buyers',
    description: 'Easy access to standardized, auditable key metrics (MRR, churn, CAC, LTV). Qualified pipeline for fast, informed decisions.',
    highlight: 'Investors'
  },
  {
    title: 'Flippers and operators',
    description: 'Identify underpriced deals, track health scores, and plan turnarounds with complete data.',
    highlight: 'Flippers'
  }
];

const testimonials = [
  {
    quote: 'We reviewed the complete dossier, negotiated in two calls, and closed at 4.3x ARR multiple.',
    author: 'Ana Costa',
    role: 'Founder',
    company: 'BackOffice Pro'
  },
  {
    quote: 'Due diligence automation reduced 70% of the time we spent analyzing micro-SaaS.',
    author: 'Marcos Lima',
    role: 'Investor',
    company: 'Horizon Capital'
  },
  {
    quote: 'The marketplace became the main channel for flipping profitable sites and newsletters.',
    author: 'Juliana Ribeiro',
    role: 'Operator',
    company: 'Digital Asset Lab'
  }
];

const faq = [
  {
    question: 'How is automated valuation calculated?',
    answer:
      'We use multiples based on recent transactions, adjusted for MRR, churn, CAC, LTV, growth, and sector risk. Each input generates a report with justification for the suggested multiple.'
  },
  {
    question: 'Can I list assets that don&apos;t generate recurring revenue yet?',
    answer:
      'Yes. For early-stage assets, we consider GMV, active users, leads, and traction proof. You receive clear guidance on what needs to evolve before opening negotiations.'
  },
  {
    question: 'How are buyers verified?',
    answer:
      'We apply KYC, request proof of funds, and transaction history. We only grant full data access after a confidentiality agreement and platform terms acceptance.'
  },
  {
    question: 'Is there a commission on the sale?',
    answer:
      'We work with a tiered success fee based on transaction size. There&apos;s no cost to list assets; you only pay when you close a deal within CounterX.'
  },
  {
    question: 'Can I negotiate in confidence?',
    answer:
      'Yes. You control who accesses the data room, enable automatic blur, and can sign a digital NDA before revealing critical information.'
  },
  {
    question: 'What markets and models does CounterX cover?',
    answer:
      'B2B/B2C SaaS, mobile apps, marketplaces, paid newsletters, APIs, and digital content platforms. We constantly expand our filters.'
  },
  {
    question: 'How does payment work after closing?',
    answer:
      'We work with escrow instruments and legal partners to custody the value until asset transfers are confirmed.'
  },
  {
    question: 'Can I list multiple assets at the same time?',
    answer:
      'Yes. Each asset receives an independent dossier with its own indicators. We operate with limits only to ensure inventory quality.'
  },
  {
    question: 'Does CounterX provide legal or accounting support?',
    answer:
      'We have specialized partners and ready-made templates for purchase and sale contracts, corporate reorganization, and IP transfer.'
  },
  {
    question: 'What&apos;s the average time to close a sale?',
    answer:
      'The current average is 34 days, but it depends on the ticket size, data quality, and response speed between parties.'
  }
];

const galleryPlaceholders = Array.from({ length: 8 }).map((_, index) => index);

const story = {
  title: 'We built CounterX because founders shouldn&apos;t depend on guesses to price a digital asset.',
  body: 'After seeing dozens of deals stall due to lack of data and standards, we built an infrastructure focused on metrics and governance. The result is clarity for sellers and conviction for buyers.',
  highlights: [
    'Proprietary methodology inspired by AngelList, Pitch.com, and Brazilian operators.',
    'Assisted onboarding process with M&A specialists + AI automations.',
    'Reports that educate founders on what needs to evolve to capture higher multiples.'
  ]
};

const productShots = [
  {
    highlight: 'Metrics insights',
    title: 'Cohort canvas',
    description: 'View retention, expansion, and churn with filters by plan and ticket range.',
    metric: 'Net Revenue Retention · 118%',
    gradient: 'linear-gradient(135deg, #120C2C 0%, #302A73 50%, #5A45B7 100%)'
  },
  {
    highlight: 'Deal room',
    title: 'Documents with blur',
    description: 'Share P&L and contracts with configurable access levels.',
    metric: '16 documents released',
    gradient: 'linear-gradient(135deg, #0F1F3C 0%, #123F6F 50%, #29A4D9 100%)'
  },
  {
    highlight: 'Multiples comparison',
    title: 'Suggested multiples',
    description: 'Compare similar deals in the secondary market and generate valuation arguments.',
    metric: 'Suggested range · 4.1x to 4.5x ARR',
    gradient: 'linear-gradient(135deg, #2D0F3B 0%, #6E0F88 60%, #A855F7 100%)'
  }
];

const security = {
  title: 'Trust layers for negotiating high-value assets.',
  description:
    'We use encryption, auditable logs, and strict access policies to protect financial and strategic data.',
  bullets: [
    'Due diligence with history of metric changes.',
    'KYC and manual verification of operators before releasing data room.',
    'Integration with legal partners and escrow to custody payments.'
  ],
  callouts: [
    {
      highlight: 'Compliance',
      title: 'Auditable logs',
      description: 'We monitor every access and change to asset data.'
    },
    {
      highlight: 'Confidentiality',
      title: 'Blur and digital NDA',
      description: 'Choose the exposure level of each document before releasing.'
    },
    {
      highlight: 'Settlement',
      title: 'Protected escrow',
      description: 'Legal and financial partners provide security for closing.'
    }
  ]
};

export default function MarketingHome() {
  return (
    <>
      <StructuredData faq={faq} />
      <MarketingHomeContent
        heroStats={heroStats}
        proofLogos={proofLogos}
        howItWorks={howItWorks}
        features={features}
        useCases={useCases}
        productShots={productShots}
        testimonials={testimonials}
        faq={faq}
        gallery={galleryPlaceholders}
        story={story}
        security={security}
      />
    </>
  );
}
