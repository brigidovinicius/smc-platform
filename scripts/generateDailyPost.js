const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY não encontrada no .env. Configure antes de rodar.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Config geral
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SECTION = "blog";

const TARGET_AUDIENCE =
  "investidores pessoa física, microfundos e founders interessados em comprar ou vender SaaS e outros ativos digitais (sites, apps, newsletters, comunidades), com foco em tickets entre R$ 20 mil e R$ 2 milhões.";

// Função util para chamar IA e esperar JSON
async function callAgent({ system, user }) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.6,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const text = completion.choices[0].message.content.trim();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Erro ao fazer JSON.parse. Resposta bruta:\n", text);
    throw new Error("A resposta da IA não veio em JSON válido.");
  }
}

// 1) Gera briefing SEO focado em público qualificado
async function generateSeoBrief() {
  const system = `
Você é um estrategista de conteúdo e SEO sênior, especialista em ativos digitais e SaaS.
Sua missão é gerar um único tema de artigo focado em público QUALIFICADO:
- investidores que querem comprar SaaS / micro-SaaS
- founders que querem vender seus ativos digitais
- pessoas que pensam em MRR, churn, CAC, LTV, múltiplos de saída
Nunca produza tema genérico tipo "o que é um site".
Responda SEMPRE em JSON válido.
`;

  const user = `
Gere APENAS UM artigo para hoje, com foco em oportunidade real de negócio.

Formato de saída (JSON):

{
  "seo_brief": {
    "topic": "string",
    "objective": "string",
    "search_intent": "informacional | transacional | comparativa",
    "primary_keyword": "string",
    "secondary_keywords": ["string"],
    "semantic_entities": ["string"],
    "title_suggestion": "string",
    "slug_suggestion": "string-em-kebab-case",
    "meta_description_suggestion": "string (máx. 160 caracteres)",
    "outline": [
      {
        "type": "h2",
        "title": "string",
        "description": "o que abordar",
        "children": [
          {
            "type": "h3",
            "title": "string",
            "description": "detalhes"
          }
        ]
      }
    ],
    "paa_questions": ["pergunta 1", "pergunta 2"],
    "image_ideas": ["ideia de imagem 1", "ideia de imagem 2"]
  }
}

Público-alvo:
${TARGET_AUDIENCE}
`;

  return await callAgent({ system, user });
}

// 2) Redator técnico escreve artigo
async function generateArticle(seoBrief) {
  const system = `
Você é um redator técnico sênior de negócios digitais e SaaS.
Escreve para investidores e founders interessados em comprar ou vender ativos digitais.
Texto:
- direto
- prático
- com exemplos concretos
- sem cara de IA
Responda SEMPRE em JSON válido.
`;

  const user = `
Use o seo_brief abaixo para escrever um artigo completo em pt-BR.

seo_brief:
${JSON.stringify(seoBrief.seo_brief, null, 2)}

Formato de saída (JSON):

{
  "article": {
    "title": "string",
    "excerpt": "string (2-3 frases, direto no público alvo)",
    "body_markdown": "string em Markdown com H2, H3, listas e exemplos",
    "estimated_reading_time_minutes": 8
  }
}
`;

  return await callAgent({ system, user });
}

// 3) Otimizador de SEO ajusta meta/slug/FAQ/JSON-LD
async function optimizeArticle(seoBrief, article) {
  const system = `
Você é um especialista em SEO on-page e otimização semântica para Google e IAs.
Sua missão é:
- transformar o artigo em uma peça pronta para ranquear
- manter o texto natural, sem keyword stuffing
Responda SEMPRE em JSON válido.
`;

  const user = `
Otimize o artigo abaixo com base no seo_brief.

seo_brief:
${JSON.stringify(seoBrief.seo_brief, null, 2)}

article:
${JSON.stringify(article.article, null, 2)}

Use o seguinte formato de saída (JSON):

{
  "optimized": {
    "slug": "string-em-kebab-case",
    "meta_title": "string",
    "meta_description": "string",
    "keywords": ["string"],
    "body_markdown": "string (pode incluir seção FAQ ao final)",
    "faq": [
      { "question": "string", "answer": "string" }
    ],
    "json_ld": {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "string",
      "description": "string",
      "url": "string",
      "datePublished": "YYYY-MM-DD",
      "dateModified": "YYYY-MM-DD",
      "keywords": ["string"]
    }
  }
}

A URL deve seguir o padrão:
${BASE_URL}/${SECTION}/slug
`;

  return await callAgent({ system, user });
}

// 4) Gera imagem de capa
async function generateCoverImage(articleTitle, slug) {
  const prompt = `
Crie uma ilustração original, minimalista e moderna para um artigo de blog sobre ativos digitais, SaaS e negócios digitais.

Título do artigo: "${articleTitle}"

Diretrizes OBRIGATÓRIAS:
- estilo: tech premium, futurista, clean
- formas geométricas, gráficos, dashboards, elementos digitais abstratos
- cores principais: azul neon, preto profundo, cinza neutro, detalhes em ciano
- sem logos de marcas reais
- sem produtos reconhecíveis
- sem rostos humanos reais (pode usar silhuetas abstratas ou ícones)
- aparência de ilustração/vetor, não foto realista
- vibe de tecnologia, dados, ativos digitais, transações e crescimento

Formato:
- proporção 16:9
- imagem adequada para ser capa de artigo de blog
`;

  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size: "1792x1024",
  });

  const image_base64 = result.data[0].b64_json;
  const buffer = Buffer.from(image_base64, "base64");

  const imageDir = path.join(process.cwd(), "public", "blog-images", slug);
  const imagePath = path.join(imageDir, "cover.png");

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  fs.writeFileSync(imagePath, buffer);

  const publicPath = `/blog-images/${slug}/cover.png`;

  console.log("🖼  Imagem de capa gerada em:", publicPath);

  return publicPath;
}

// Monta frontmatter YAML
function buildFrontmatter({ seoBrief, article, optimized, coverImagePath }) {
  const today = new Date().toISOString().slice(0, 10);

  const frontmatter = {
    title: article.article.title,
    slug: optimized.optimized.slug || seoBrief.seo_brief.slug_suggestion,
    date: today,
    excerpt: article.article.excerpt,
    metaTitle: optimized.optimized.meta_title,
    metaDescription: optimized.optimized.meta_description,
    keywords: optimized.optimized.keywords || seoBrief.seo_brief.secondary_keywords,
    readingTime: article.article.estimated_reading_time_minutes || 8,
    tags: seoBrief.seo_brief.semantic_entities || [],
    coverImage: coverImagePath || "",
  };

  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((v) => `  - "${String(v).replace(/"/g, '\\"')}"`).join("\n")}`;
      }
      return `${key}: "${String(value).replace(/"/g, '\\"')}"`;
    })
    .join("\n");

  return `---\n${yaml}\n---\n`;
}

// Salva arquivo markdown em content/blog
function savePostFile(frontmatter, optimized, coverImagePath) {
  const today = new Date().toISOString().slice(0, 10);
  const slug = optimized.optimized.slug;
  const filename = `${today}-${slug}.md`;

  const contentDir = path.join(process.cwd(), "content", "blog", "pending");
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  const fullPath = path.join(contentDir, filename);
  const imageMarkdown = coverImagePath ? `![Capa do artigo](${coverImagePath})\n\n` : "";
  const fullContent = `${frontmatter}\n${imageMarkdown}${optimized.optimized.body_markdown}\n`;

  fs.writeFileSync(fullPath, fullContent, "utf-8");

  console.log(`✅ Post gerado (pendente para aprovação): ${fullPath}`);
}

// Pipeline principal
async function main() {
  try {
    console.log("🚀 Gerando briefing SEO...");
    const seoBrief = await generateSeoBrief();

    console.log("✍️ Gerando artigo...");
    const article = await generateArticle(seoBrief);

    console.log("🧠 Otimizando SEO...");
    const optimized = await optimizeArticle(seoBrief, article);

    console.log("🖼  Gerando imagem de capa...");
    const slug = optimized.optimized.slug || seoBrief.seo_brief.slug_suggestion;
    const coverImagePath = await generateCoverImage(article.article.title, slug);

    console.log("🗂 Montando frontmatter...");
    const frontmatter = buildFrontmatter({ seoBrief, article, optimized, coverImagePath });

    console.log("💾 Salvando arquivo...");
    savePostFile(frontmatter, optimized, coverImagePath);

    console.log("🎯 FIM: artigo gerado para público qualificado (investidores + founders).");
  } catch (err) {
    console.error("❌ Erro no pipeline:", err.message);
    process.exit(1);
  }
}

main();
