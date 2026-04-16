# AI Travel Companion

## GitHub Pages readiness

This project can be deployed as a static site to GitHub Pages.

- The frontend is built with Vite and now uses relative asset paths during production builds, which avoids broken asset URLs under a repository subpath.
- Client-side routing uses HashRouter so page refreshes work on GitHub Pages without server-side rewrites.
- Chat remains interactive after deployment because the browser calls the Supabase Edge Function directly. GitHub Pages only hosts the static frontend.

## Required environment variables

Provide these variables at build time:

- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

You can copy the variable names from .env.example.

Do not expose any server-side secrets in the frontend build.

## Build

```bash
npm run build
```

The static output is generated in dist.

## GitHub Pages deployment

This repository includes a GitHub Actions workflow at .github/workflows/deploy-pages.yml.

Before the first deployment:

1. Push this repository to GitHub.
2. Add repository secrets named VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.
3. In GitHub, open Settings > Pages and set Source to GitHub Actions.
4. Push to the main branch or run the workflow manually from the Actions tab.

The workflow now validates both secrets first and then writes them into a temporary .env.production file on the GitHub Actions runner before running the Vite build. This means:

- You do not need to commit .env.
- GitHub does not generate the token for you. You must copy the real Supabase publishable key into the repository secret VITE_SUPABASE_PUBLISHABLE_KEY.
- If either secret is missing, the workflow fails early with a clear error message.

Notes:

- The workflow listens to both main and master. You can remove the unused branch trigger later.
- If .env was ever committed before adding the new .gitignore rule, remove it from tracking before pushing.
- GitHub Pages only hosts the frontend. The Supabase Edge Function must remain deployed separately.
