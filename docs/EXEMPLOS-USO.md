# 📖 Exemplos de Uso - Componentes Modernos

**Data:** Janeiro 2025

---

## 🎯 Hero na Homepage

```tsx
// app/(marketing)/page.tsx
import { Hero } from '@/components/marketing';

export default function HomePage() {
  return (
    <>
      <Hero
        title="Compre e venda ativos digitais com confiança"
        description="Marketplace profissional para SaaS, newsletters e ativos digitais. Valuation automático, due diligence assistida e transações seguras."
        ctaPrimary={{ label: 'Começar Grátis', href: '/auth/register' }}
        ctaSecondary={{ label: 'Ver Oportunidades', href: '/feed' }}
      />
      {/* Resto do conteúdo */}
    </>
  );
}
```

---

## 🎨 GridBackground em Seções

```tsx
import { GridBackground } from '@/components/marketing';

<section>
  <GridBackground className="py-24">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-8">Nossas Features</h2>
      {/* Conteúdo */}
    </div>
  </GridBackground>
</section>
```

---

## 🔄 Marquee de Logos

```tsx
import { Marquee } from '@/components/marketing';

const logos = [
  '/logos/stripe.svg',
  '/logos/paddle.svg',
  '/logos/shopify.svg',
  // ...
];

<section className="py-16 bg-slate-50">
  <div className="container mx-auto">
    <p className="text-center text-slate-600 mb-8">Confiança de milhares de founders</p>
    <Marquee direction="left" pauseOnHover>
      {logos.map((logo, i) => (
        <img 
          key={i} 
          src={logo} 
          alt="Partner logo" 
          className="h-12 mx-8 opacity-60 hover:opacity-100 transition-opacity"
        />
      ))}
    </Marquee>
  </div>
</section>
```

---

## ✨ FeatureCards

```tsx
import { FeatureCards } from '@/components/marketing';
import { TrendingUp, Shield, Zap, BarChart3, Users, Lock } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Valuation Automático',
    description: 'Cálculo baseado em múltiplos de mercado reais e transações recentes.'
  },
  {
    icon: Shield,
    title: 'Due Diligence Assistida',
    description: 'IA ajuda a preparar seu ativo para venda com checklist completo.'
  },
  {
    icon: Zap,
    title: 'Transações Seguras',
    description: 'Escrow e parceiros jurídicos garantem segurança em cada transação.'
  },
  {
    icon: BarChart3,
    title: 'Métricas em Tempo Real',
    description: 'Acompanhe MRR, churn, CAC e outras métricas críticas.'
  },
  {
    icon: Users,
    title: 'Compradores Verificados',
    description: 'Apenas investidores qualificados com KYC completo.'
  },
  {
    icon: Lock,
    title: 'Negociação em Sigilo',
    description: 'Controle quem acessa seus dados com blur e NDA digital.'
  }
];

<section className="py-24">
  <div className="container mx-auto">
    <h2 className="text-4xl font-bold text-center mb-4">Por que escolher o SMC?</h2>
    <p className="text-center text-slate-600 mb-12">
      Tudo que você precisa para comprar ou vender ativos digitais
    </p>
    <FeatureCards features={features} />
  </div>
</section>
```

---

## 📋 HowItWorks Timeline

```tsx
import { HowItWorks } from '@/components/marketing';

const steps = [
  {
    number: '1',
    title: 'Cadastre seu ativo',
    description: 'Preencha as métricas principais do seu SaaS: MRR, churn, CAC, LTV e crescimento.'
  },
  {
    number: '2',
    title: 'Receba valuation automático',
    description: 'Nossa IA calcula o valor baseado em múltiplos de mercado e transações similares recentes.'
  },
  {
    number: '3',
    title: 'Prepare-se para due diligence',
    description: 'Siga nosso checklist e receba feedback sobre o que melhorar antes de listar.'
  },
  {
    number: '4',
    title: 'Receba propostas',
    description: 'Compradores verificados fazem ofertas pelo seu ativo. Você controla quem acessa os dados.'
  },
  {
    number: '5',
    title: 'Feche o negócio',
    description: 'Escrow garante segurança. Parceiros jurídicos ajudam com documentação.'
  }
];

<section className="py-24 bg-slate-50">
  <div className="container mx-auto max-w-4xl">
    <h2 className="text-4xl font-bold text-center mb-4">Como Funciona</h2>
    <p className="text-center text-slate-600 mb-12">
      Do cadastro à venda em 5 passos simples
    </p>
    <HowItWorks steps={steps} />
  </div>
</section>
```

---

## 🏗️ AppShell no Dashboard

```tsx
// pages/dashboard/index.jsx ou app/(app)/dashboard/page.tsx
import { AppShell } from '@/components/layout/AppShell';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  
  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        {/* Conteúdo do dashboard */}
      </div>
    </AppShell>
  );
}
```

---

## 🎨 Combinando Componentes

```tsx
import { Hero, GridBackground, FeatureCards, HowItWorks } from '@/components/marketing';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Features com Grid Background */}
      <GridBackground>
        <section className="py-24">
          <div className="container mx-auto">
            <FeatureCards features={features} />
          </div>
        </section>
      </GridBackground>
      
      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto">
          <HowItWorks steps={steps} />
        </div>
      </section>
    </>
  );
}
```

---

## 📝 Notas Importantes

### Imports
- Use barrel exports quando possível: `import { Hero } from '@/components/marketing'`
- Ou imports diretos: `import { Hero } from '@/components/marketing/Hero'`

### Responsividade
- Todos os componentes são responsivos por padrão
- Teste em mobile, tablet e desktop

### Animações
- Animações respeitam `prefers-reduced-motion`
- Use `viewport={{ once: true }}` para performance

### Customização
- Todos os componentes aceitam `className` para customização
- Props são tipadas com TypeScript

---

**Status:** ✅ Exemplos prontos para uso!





