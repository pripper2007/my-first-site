# AI-SEO — arquitetura

Guia para qualquer dev ou agente continuar o trabalho de tornar este site
legível e recuperável por buscadores e assistentes de IA. Todos os caminhos
são relativos à raiz do repositório.

## 1. Objetivo

O site `pedroripper.com` é a **fonte canônica** sobre Pedro Ripper para
buscadores e agentes de IA. A meta é que, quando alguém (ou um assistente)
perguntar quem é Pedro Ripper ou o que ele pensa sobre IA, pagamentos,
liderança ou livros, este site seja a referência usada — com fatos corretos e
sem confusão de identidade.

Tudo deriva do conteúdo real do site (`src/content/*.json` e os artigos). Nada
é inventado.

## 2. Como o conteúdo é servido

### Artigos (`/insights/[slug]`)

A rota dinâmica `src/app/(public)/insights/[slug]/page.tsx` renderiza um
fragmento HTML pré-convertido e inline no HTML inicial (crawlável, sem iframe).

Pipeline para publicar um artigo novo:

1. Escreva o HTML standalone em `public/articles/<slug>.html` (com `<style>` e
   `<article>…</article>`).
2. Gere o fragmento server-renderable:
   ```
   node scripts/convert-article.mjs <slug>   # sem args = converte todos
   ```
   Isso lê `public/articles/<slug>.html` e escreve
   `src/content/articles/<slug>.html` — um `<style>` com CSS escopado em
   `.article-doc` + o markup do `<article>`.
3. Adicione a entrada correspondente em `src/content/insights.json` (`slug`,
   `title`/`titlePt`, `excerpt`, `tags`, `date`, `coverImage`, etc.). É o que
   alimenta listagens, sitemap, llms-full e as topic pages.
4. **Produção:** o conteúdo NÃO vem do filesystem em prod. `src/lib/content.ts`
   lê do **Vercel Blob** (`content/*.json`) quando `BLOB_READ_WRITE_TOKEN`
   está setado e `NODE_ENV !== "development"`; caso contrário lê de
   `src/content/`. Há cache em memória (TTL 60s) com **stale-on-error**: se uma
   leitura do blob falhar, serve a última cópia boa em vez de 404. Ou seja:
   editar o JSON local atualiza só o dev; em prod o conteúdo é gerenciado via
   admin/CMS, que escreve no blob.

### Demais páginas

São Server Components que leem o content lib (`getInsights`, `getVideos`,
`getPicks`, `getBooks`, `getNews`, `getBio`) e renderizam direto no HTML.

## 3. JSON-LD

Entidades centrais em `src/lib/jsonld.ts`, com `@id`s estáveis:

- `PERSON_ID` = `https://pedroripper.com/#pedro-ripper` (`Person`)
- `WEBSITE_ID` = `https://pedroripper.com/#website` (`WebSite`)

Onde cada bloco aparece:

- `GLOBAL_LD` (Person + WebSite) — no layout raiz, em todas as páginas.
- `Article` — gerado na rota `/insights/[slug]`, referenciando `PERSON_ID` como
  autor.
- `ProfilePage` (`PROFILE_PAGE_LD`) — em `/pedro-ripper`.
- `WebPage` (about `PERSON_ID`, isPartOf `WEBSITE_ID`) — em `/press-kit`,
  `/sources` e nas topic pages.
- `WebPage` + `BreadcrumbList` — nas topic pages
  (`src/components/public/TopicPage.tsx`), com `inLanguage: "pt-BR"`.

Regra: qualquer página nova "sobre Pedro" deve referenciar `PERSON_ID`/
`WEBSITE_ID` em vez de duplicar fatos.

## 4. llms.txt e llms-full.txt

- `src/app/llms.txt/route.ts` — **estático**. Guia curto para agentes (bio,
  páginas canônicas, topic pages, temas, desambiguação). Edite a string
  `CONTENT` à mão ao adicionar páginas canônicas.
- `src/app/llms-full.txt/route.ts` — **dinâmico**. Índice completo gerado de
  `getInsights()` + `getVideos()`. Cada artigo/talk novo aparece
  automaticamente; só edite o arquivo para mudar bios ou a lista fixa de
  páginas canônicas.

## 5. robots.ts e sitemap.ts

- `src/app/robots.ts` — tudo público é crawlável; só `/admin` e `/api` são
  bloqueados. Bots de IA explicitamente permitidos: `GPTBot`, `OAI-SearchBot`,
  `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, além de
  `Googlebot` e `Bingbot`. Para liberar um novo bot, adicione uma regra.
- `src/app/sitemap.ts` — **dinâmico**: páginas fixas + um item por insight
  (`getInsights()`). Ao criar uma página estática nova, adicione a URL aqui.

## 6. Páginas canônicas

- `/` — home
- `/pedro-ripper` — perfil canônico (entidade)
- `/about` — biografia
- `/insights` — artigos originais
- `/press-kit` — bios oficiais, foto, temas
- `/sources` — verificação externa (identidade)
- Kits: `/base` (knowledge base de saúde) e `/irpf-skill` (Claude Skill de IRPF)
- `/newsletter` — Diário de Bordo
- Topic pages: `/topics/ai-agents`, `/topics/digital-payments`,
  `/topics/company-building`, `/topics/books-and-learning` (pastas estáticas em
  `src/app/(public)/topics/<slug>/page.tsx`, não rota dinâmica)

## 7. Validação

- `node scripts/check-og.mjs` — varre todas as URLs do sitemap (+ lista fixa) e
  garante que cada página tem `og:title` próprio (não o genérico da home) e
  `og:url` apontando para si mesma.
- `node scripts/validate-seo.mjs` — verifica que `MAIN_PAGES` retornam 200 com
  `<title>` e meta description, que `sitemap.xml`/`robots.txt`/`llms.txt`/
  `llms-full.txt` existem, que o corpo dos artigos canários está no HTML inicial
  (sem iframe), e que há JSON-LD nas páginas-chave.
- Os dois juntos: `npm run validate:seo`.
- CI: workflow **"SEO & OG checks"** (`.github/workflows/og-check.yml`) roda a
  cada push em `master` (após esperar 120s pelo deploy do Vercel), mais semanal
  (segunda) e on-demand. Ambos os scripts têm **retries (3 tentativas, 10s)**
  para não falhar por flake durante writes no blob / troca de alias de deploy.

Por padrão os scripts batem em `https://pedroripper.com`; use a env
`SITE_URL` para apontar para outro alvo (ex.: preview).

## 8. Manutenção — o que fazer e o que NUNCA fazer

Atualizar links externos / `sameAs`:

- Edite `PERSON_LD.sameAs` em `src/lib/jsonld.ts` (LinkedIn, X, Bemobi, etc.).
- A página `/sources` lista perfis e empresas — mantenha em sincronia.

NUNCA:

- **Não** crie uma página que só sobrescreve `title`/`description` no
  `metadata`. Sem um bloco `openGraph` próprio, ela **herda o openGraph genérico
  da home** e o `check-og.mjs` quebra. Sempre defina `openGraph` (e `twitter`)
  por página — siga o padrão de `press-kit`/`sources`/topic pages.
- **Não** assuma que `scripts/` está versionado: o diretório está no
  `.gitignore`. Ao adicionar um script novo, use `git add -f scripts/<arquivo>`.
- **Não** invente fatos sobre Pedro. Toda página deriva de
  `src/content/*.json`, das bios e do JSON-LD existente.
