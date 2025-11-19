## Pipeline Contínuo de Conteúdo (24/7)

### Visão Geral
Construiremos uma linha de produção automatizada com seis agentes especializados. O objetivo é publicar diariamente um artigo otimizado para SEO/IA, garantindo cadência e autoridade temática.

### Agente 1 – Trend Analyst Bot
- **Fontes**: Google Trends API, feeds RSS de SaaS/tecnologia, newsletters (ex.: Lenny, SaaStr), changelogs (Stripe, HubSpot, OpenAI), Product Hunt, monitoramento de concorrentes e termos emergentes de “ativos digitais”.
- **Entrega**: 10 temas/dia com metadados (keyword, volume estimado, tendência, oportunidade).
- **Automação**: script Node cronado (07:00 BRT) salvando em `data/trends/YYYY-MM-DD.json`.

### Agente 2 – SEO Mastermind
- **Input**: arquivo gerado pelo Agente 1.
- **Processo**: usa APIs (Semrush, Ahrefs ou serpapi) para avaliar intenção, SERP, dificuldade, People Also Ask, featured snippet.
- **Entrega**: briefing completo (`docs/briefings/YYYY-MM-DD/<slug>.md`) contendo:
  - Título otimizado, H1–H3.
  - Estrutura e CTA.
  - Palavras-chave primárias/secundárias + termos LSI.
  - Links internos sugeridos.
  - Dados para embeddings/IA (clusters semânticos).
- **Automação**: job às 07:05 que varre os 10 temas e seleciona 1–3 (baseado em score de oportunidade).

### Agente 3 – Senior Content Writer (SaaS)
- **Input**: briefing.
- **Processo**: modelo assistido (LLM + prompt com guidelines) gera rascunho de 800–2.500 palavras com exemplos reais, frameworks e storytelling.
- **Entrega**: `drafts/YYYY-MM-DD/<slug>.md`.
- **QA**: incluir seções marcadas (ex.: `## Exemplo real`, `## Framework aplicável`).  
  Rodar checador de originalidade (Copyscape ou GPTZero) antes de avançar.

### Agente 4 – Editor-in-Chief
- **Input**: rascunho.
- **Processo**: roteiros de edição para clareza, coesão, autoridade. Remove redundância e melhora ritmo.
- **Entrega**: `drafts/YYYY-MM-DD/<slug>-edited.md`, destacando alterações (diff ou comentários inline).
- **Checklist**: voz da marca, precisão factual, chamadas claras para ação.

### Agente 5 – SEO Surgeon
- **Input**: versão editada.
- **Tarefas**:
  - Ajustar densidade e semântica.
  - Criar meta title/description, slug, alt text, FAQ, schema JSON-LD.
  - Definir links internos (mínimo 3) e externos de autoridade.
  - Criar bloco FAQ estruturado para rich results.
- **Entrega**: pacote final em `content/blog/<slug>.mdx` com frontmatter:
    ```yaml
    ---
    title: ""
    slug: ""
    date: "YYYY-MM-DD"
    metaTitle: ""
    metaDescription: ""
    tags: []
    coverImage: ""
    alt: ""
    schema: "<script type='application/ld+json'>...</script>"
    faq:
      - question: ""
        answer: ""
    ---
    ```

### Agente 6 – Publisher Bot
- **Input**: arquivo final em `content/blog`.
- **Tarefas**:
  - Criar PR automático no GitHub com slug + data.
  - Atualizar sitemap e feeds.
  - Rodar `npm run build` ou pipeline CI e publicar.
  - Opcional: disparar hooks (Twitter/LinkedIn) com resumo.

### Fluxo Diário (BRT)
| Horário | Agente | Ação |
| ------- | ------ | ---- |
| 07:00   | 1      | Gera temas e salva em `data/trends` |
| 07:05   | 2      | Produz 1–3 briefings priorizados |
| 07:10   | 3      | Gera rascunhos (LLM + revisão humana rápida) |
| 07:15   | 4      | Edita e refina |
| 07:20   | 5      | Otimiza SEO on-page, adiciona schema/FAQ |
| 07:25   | 6      | Publica (git commit + deploy) |

### Requisitos Técnicos
- **Jobs**: usar GitHub Actions ou cron local (pm2) para agendar scripts Node/Python.
- **Dados**: manter histórico (trends, briefings, drafts) para auditoria.
- **LLM**: prompts versionados em `prompts/`.
- **CI/CD**: pipeline que, ao detectar novos arquivos em `content/blog`, roda lint/build e dispara preview + deploy.

### KPIs
- 1 artigo/dia → 30/mês.
- ≥90 keywords novas indexadas.
- Crescimento de tráfego orgânico e melhora em `EEAT`.
- Monitorar indexação via Google Search Console API.

### Próximos Passos
1. Implementar scripts base (Agente 1 e 2) com APIs.
2. Definir prompts e templates para Agentes 3–5.
3. Criar workflow GitHub Actions para o Agente 6.
