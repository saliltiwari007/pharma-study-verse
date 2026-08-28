# Cloudflare deployment

## Current launch target
Pharma Study Verse is a framework-free static HTML site deployed as a Cloudflare Worker with static assets.

### Wrangler
The repository uses `wrangler.toml` with `worker.js` as the Worker entrypoint and the repository root as static assets.

### Git integration
- Provider: GitHub
- Repository: `saliltiwari007/pharma-study-verse`
- Production branch: `main`
- Root directory: `/`
- Build command: leave blank (or use `npx wrangler deploy` where the deployment system expects a command)

### Drug Catcher leaderboard
The Worker exposes `/api/game-scores`. The game falls back to local device storage if the D1 binding is unavailable.

To enable the real cross-student leaderboard:
1. Create a Cloudflare D1 database.
2. Run `functions/api/game-scores.sql` against it.
3. Bind that database to the Worker with the binding name **DB**.
4. If using `wrangler.toml`, uncomment the `[[d1_databases]]` block and replace `YOUR_D1_DATABASE_ID` with the actual database ID. Do not commit secrets or tokens.
5. Redeploy.

After that, scores are stored centrally and Drug Catcher can show the Top 10 and a student's rank among all named players.

### Important
Do not add Cloudflare API tokens, account IDs, database IDs, secrets or private credentials to this repository. Secrets belong in Cloudflare's secret/environment configuration.

For high-stakes assessment, the browser must not be trusted for scoring. The eventual assessment service should use server-issued attempts and server-authoritative scoring as defined in `ARCHITECTURE.md`.
