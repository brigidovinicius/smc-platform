'use client';

import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    question: 'Como funciona a avaliação automática?',
    answer: 'Nossa metodologia utiliza múltiplos de mercado baseados em receita recorrente (MRR/ARR), churn rate, CAC, LTV, crescimento e riscos setoriais. O algoritmo cruza seus dados com transações recentes do mercado secundário para recomendar uma faixa de valuation justa.'
  },
  {
    question: 'É seguro conectar minhas métricas?',
    answer: 'Sim, utilizamos criptografia de ponta a ponta e acesso apenas de leitura às suas contas Stripe, Paddle ou outras plataformas de pagamento. Você mantém controle total sobre quais dados compartilhar e com quem.'
  },
  {
    question: 'Quanto tempo leva para fechar uma venda?',
    answer: 'A média atual é de 34 dias, desde a publicação da oferta até o closing. O tempo varia conforme o ticket, qualidade dos dados apresentados e velocidade de resposta entre as partes envolvidas.'
  },
  {
    question: 'Existe comissão sobre a venda?',
    answer: 'Trabalhamos com success fee escalonado conforme o tamanho da transação. Não há custo para listar ativos; você só paga quando fecha negócio dentro da plataforma SMC.'
  },
  {
    question: 'Posso negociar em sigilo?',
    answer: 'Sim. Você controla quem acessa o data-room, habilita blur automático em documentos sensíveis e pode assinar NDA digital antes de revelar informações críticas sobre receitas e operações.'
  },
  {
    question: 'Quais tipos de ativos posso listar?',
    answer: 'Aceitamos SaaS B2B/B2C, apps mobile, marketplaces, newsletters pagas, APIs e plataformas de conteúdo digital. Expandimos os filtros constantemente conforme o mercado evolui.'
  },
  {
    question: 'Como funciona o pagamento após o closing?',
    answer: 'Trabalhamos com instrumentos de escrow e parceiros jurídicos para custodiar o valor até que as transferências de ativos sejam confirmadas. O processo é seguro e auditável.'
  },
  {
    question: 'O SMC fornece suporte jurídico ou contábil?',
    answer: 'Temos parceiros especializados e templates prontos para contratos de compra e venda, reorganização societária e transferência de IP. Oferecemos orientação, mas recomendamos consulta jurídica específica para cada transação.'
  },
  {
    question: 'Posso listar vários ativos ao mesmo tempo?',
    answer: 'Sim. Cada ativo recebe um dossiê independente e tem indicadores próprios. Operamos com limites apenas para garantir qualidade do inventário e experiência dos compradores.'
  },
  {
    question: 'Como os compradores são verificados?',
    answer: 'Aplicamos KYC, pedimos prova de fundos e histórico de operações. Só liberamos acesso completo aos dados após acordo de confidencialidade e aceite dos termos da plataforma.'
  }
];

function FAQItem({ item, index }: { item: typeof faqItems[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-slate-900 pr-8">{item.question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-6 pb-6"
        >
          <p className="text-slate-600 leading-relaxed">{item.answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <MarketingPageLayout
      title="Perguntas Frequentes"
      description="Tire suas dúvidas sobre o SaaS Market Cap e como funciona nossa plataforma"
      showHero={true}
    >
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem key={item.question} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
