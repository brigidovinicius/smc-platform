# SMC — Wiki Git

Guia rápido para colaborar no repositório sem quebrar a linha do tempo ou a segurança. Ajuste conforme a branch base usada pelo time (`main`/`codex-nightly`).

## TL;DR
- Crie branch a partir da base atual: `git fetch origin && git checkout -b feat/<area>-<slug> origin/main`
- Commits sempre em Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`) e com escopo: `feat(feed): estilizar cards`
- Rode pelo menos `npm run lint` (e, se possível, `npm run build`) antes de abrir PR
- Não faça push direto na branch protegida; abra PR com objetivo, mudanças, prints (se UI) e resultado dos comandos
- Nunca versione `.env`/segredos; tudo fica em `.env.local`

## Branches e nomeclatura
- `main` (ou a branch protegida do momento) é a linha estável. Não faça commits direto nela.
- Branches de trabalho: `feat/<area>-<slug>`, `fix/<area>-<slug>`, `chore/<tema>`, `docs/<tema>`, `hotfix/<problema>`.
- Para hotfix crítico, derive de `main`, corrija, abra PR curto e reverta via `git revert` se algo quebrar (evite `reset --hard`).

## Fluxo de trabalho sugerido
1. Atualize a base: `git fetch origin && git checkout main && git pull --rebase`
2. Crie sua branch: `git checkout -b feat/feed-metricas origin/main`
3. Implemente mantendo `.env.local` fora do Git (já está no `.gitignore`).
4. Valide: `npm run lint` e, quando possível, `npm run build`. Para QA manual use `npm run dev` e navegue por `/`, `/auth/login`, `/dashboard`, `/feed`, `/blog`.
5. Commits pequenos e descritivos. Exemplos: `feat(feed): heroi com CTA e métricas`, `fix(auth): corrigir callbackUrl`, `chore(ci): ajustar lint`.
6. Abra PR para a branch base. Preencha: objetivo, lista de mudanças, prints/gifs se UI mudou, resultado dos comandos (`npm run lint`, `npm run build`), impacto em variáveis de ambiente.
7. Prefira `Squash & merge` ou `Rebase & merge` para manter histórico limpo. Sincronize sua branch antes de mergear: `git pull --rebase origin main`.

## Commits
- Formato: `<tipo>(<escopo>): <mensagem>` em português curto. Escopos úteis: `feed`, `auth`, `dashboard`, `blog`, `wizard`, `infra`, `styles`.
- Use `fix:` só para correções; `feat:` para novo comportamento; `chore:` para manutenção; `docs:` para documentação; `refactor:` para melhoria sem mudar comportamento; `test:` para testes.
- Agrupe arquivos relacionados no mesmo commit; evite commits de “WIP” na PR final.

## PRs e revisão
- Conteúdo mínimo: **objetivo**, **mudanças**, **prints/gifs** (UI), **comandos rodados** e **impacto em env/credenciais**.
- Check básico antes de pedir review:
  - [ ] `npm run lint`
  - [ ] (Opcional) `npm run build`
  - [ ] Sem arquivos sensíveis (.env, tokens, chaves)
  - [ ] Breadcrumbs/SEO preservados em rotas públicas (`/blog`, `/feed`)
- Para conflitos, use `git rebase origin/main` e resolva localmente; evite merges com muitos commits irrelevantes.

## Rollback e suporte
- Para desfazer algo já mergeado, use `git revert <hash>` em vez de reescrever histórico.
- Não use `git push --force` na branch protegida. Só force push na sua branch e com cuidado.
- Em caso de deploy quebrado, abra `hotfix/<problema>` e entregue o mínimo para estabilizar.

## Dicas rápidas
- Lembre-se das instruções do AGENTS.md: commits convencionais, middleware protege apenas `/dashboard/**`, blog e feed são públicos, e não versione segredos.
- Quando alterar UX, anexe prints/gifs e mencione impacto responsivo (mobile/desktop).
- Se scripts forem necessários, prefira `npm run lint/build/dev` nativos; evite tools não listadas em `package.json`.
