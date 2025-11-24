export const blogPosts = [
  {
    slug: 'how-to-evaluate-saas-before-buying',
    title: 'How to Evaluate a SaaS Business Before Buying: A Complete Due Diligence Guide',
    excerpt:
      'A practical checklist to understand if a SaaS has sufficient traction, product-market fit, and metrics before closing any acquisition. Learn what to look for in MRR, churn, growth, and operations.',
    date: '2024-10-15',
    readingTime: '8 min',
    tags: ['due diligence', 'investment', 'SaaS', 'acquisition'],
    coverImage:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    content: `### Initial Checklist

**Understand the problem**: What problem does the SaaS solve, and is it still relevant today? Validate market demand and competitive positioning.

**Map paying customers**: Identify who your customers are and which segments have the highest retention. Analyze customer cohorts to understand lifetime value patterns.

### Essential Metrics

**Revenue metrics**: Gather information about MRR, ARR, growth trends, and revenue composition. Look for consistent growth patterns over 6-12 months to see if the business is accelerating or decelerating.

**Churn analysis**: Monthly and annual churn rates are critical. Low churn (<5%) indicates strong product-market fit, while high churn (>10%) is a red flag.

**Unit economics**: Calculate CAC (Customer Acquisition Cost), LTV (Lifetime Value), and payback periods. A healthy LTV:CAC ratio is 3:1 or higher.

### Team and Operations

**Current team assessment**: Talk to the current team and understand operational risks. Identify key personnel dependencies and succession planning needs.

**Technology and integrations**: List critical integrations and vendors to avoid surprises during handover. Assess code quality, infrastructure, and scalability.

**Process documentation**: Evaluate if processes are documented and can be transferred. Look for automation opportunities and operational efficiency.`
  },
  {
    slug: 'why-digital-assets-are-the-new-real-estate',
    title: 'Why Digital Assets Are the New Real Estate: The Future of Alternative Investments',
    excerpt:
      'SaaS, apps, and newsletters have transformed into assets with predictable cash flow. Discover why investors are diversifying into digital assets and how they compare to traditional real estate investments.',
    date: '2024-09-02',
    readingTime: '6 min',
    tags: ['digital assets', 'micro acquisitions', 'trends', 'investment'],
    coverImage:
      'https://images.unsplash.com/photo-1501163268664-3fdf329d019f?auto=format&fit=crop&w=1200&q=80',
    content: `### Scalable Cash Flow

A well-managed digital asset can sell 24/7 without depending on physical presence. With automated onboarding processes, margins tend to be much higher than traditional real estate investments.

Digital assets offer recurring revenue models that scale without proportional cost increases, making them attractive for portfolio diversification.

### Global Liquidity

Markets like SMC allow you to list and trade projects from anywhere in the world. This reduces friction and increases the number of interested buyers, creating a more efficient marketplace.

Unlike real estate, which is location-dependent, digital assets can be transferred instantly and accessed globally, making them highly liquid investments.

### Intelligent Portfolio Diversification

Diversifying between SaaS, apps, and newsletters protects against regional economic cycles. Additionally, you can quickly reinvest in growth or new complementary assets, creating a dynamic investment strategy.

Digital assets offer lower barriers to entry, faster transaction times, and the ability to build a diversified portfolio with smaller capital requirements compared to traditional real estate.`
  }
];

export const getAllPosts = () =>
  [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getPostBySlug = (slug) => blogPosts.find((post) => post.slug === slug);
