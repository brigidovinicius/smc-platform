# Monitoramento de crawlers (GPTBot/CCBot)

## Sitemaps expostos
- Sitemap principal: `https://smc-platform.vercel.app/sitemap.xml`
- Sitemap do blog: `https://smc-platform.vercel.app/sitemap-blog`
- O `robots.txt` já libera GPTBot e CCBot e referencia o sitemap principal.

## Checar acessos no Vercel
Use o script `scripts/checkCrawlerLogs.sh` para filtrar logs por GPTBot/CCBot.

Pré-requisitos:
- `VERCEL_TOKEN` com permissões de leitura de logs.
- Opcional: `VERCEL_TEAM` se o projeto estiver em um time específico.
- Opcional: `VERCEL_LOG_ALIAS` (default: `smc-platform.vercel.app`) e `VERCEL_LOG_SINCE` (default: `24h`).

Comando manual:
```bash
VERCEL_TOKEN=xxxx VERCEL_TEAM=team-id bash scripts/checkCrawlerLogs.sh
```

Outros exemplos:
- Últimos 7 dias: `VERCEL_TOKEN=xxxx VERCEL_LOG_SINCE=7d bash scripts/checkCrawlerLogs.sh`
- Aliás customizado: `VERCEL_TOKEN=xxxx VERCEL_LOG_ALIAS=saas-market-cap.vercel.app bash scripts/checkCrawlerLogs.sh`

Automação sugerida:
- Agendar via `cron` (ex.: `0 */6 * * * VERCEL_TOKEN=xxxx VERCEL_TEAM=team-id VERCEL_LOG_SINCE=6h bash /path/scripts/checkCrawlerLogs.sh >> /path/crawler.log`).
