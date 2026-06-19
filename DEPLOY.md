# Deploying Mahadev APF to GitHub Pages

The site ships as a **static export** (`next build` → `out/`) and is published by
the workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## One-time setup

1. **Push this branch** (already done) so the workflow exists on GitHub.
2. In the repo on GitHub, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. The site is published from the `main` or `claude/dreamy-curie-dog0h7`
   branch. If you keep working on the feature branch, make sure the
   `github-pages` environment (Settings → Environments) allows it — or merge to
   `main`, which is allowed by default.

That's it. Every push to those branches rebuilds and redeploys automatically.
You can also trigger it manually from the **Actions** tab → *Deploy to GitHub
Pages* → **Run workflow**.

## Your site URL

For a project repository the site is served at a subpath:

```
https://<owner>.github.io/mahadev-apf/
```

The workflow injects that subpath as `PAGES_BASE_PATH` at build time, so all
assets and internal links resolve correctly — no manual config needed.

> Using a custom domain or a `<owner>.github.io` repo instead? The subpath is
> empty there; `configure-pages` detects this and `PAGES_BASE_PATH` resolves to
> `""` automatically.

## Connecting the contact / quote forms (optional)

The static site can't run a server, so enquiries are sent **directly** to the
NestJS backend in [`server/`](server/).

1. Deploy the backend somewhere public (Render, Fly.io, a VPS, etc.).
2. Allow the Pages origin in the backend's `CORS_ORIGIN`
   (e.g. `https://<owner>.github.io`).
3. In GitHub, add a repository **secret** `NEXT_PUBLIC_API_URL` set to the
   backend base URL (e.g. `https://api.mahadevapf.com`).
4. Re-run the deploy. Forms now `POST` to `${NEXT_PUBLIC_API_URL}/api/leads`.

If `NEXT_PUBLIC_API_URL` is unset, forms validate input and show the success
state without persisting — handy for a pure marketing deployment.

## Build it locally

```bash
npm install
npm run build      # outputs the static site to ./out
npx serve out      # preview the exact static build
```
