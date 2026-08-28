# Cloudflare deployment

## Current launch target
Pharma Study Verse is a framework-free static HTML site. Cloudflare Pages can deploy the repository directly from GitHub with no build framework required.

### Git integration
- Provider: GitHub
- Repository: `saliltiwari007/pharma-study-verse`
- Production branch: `main`
- Root directory: `/`
- Build command: leave blank (or use `exit 0`)
- Build output directory: `/`

Cloudflare Pages should deploy the top-level `index.html` as the site entry point.

### Wrangler
`wrangler.toml` is intentionally kept in the repository so the Pages configuration can be version-controlled. It declares the project name, root build output directory, compatibility date and disabled Wrangler telemetry.

### Important
Do not add Cloudflare API tokens, account IDs, database IDs, secrets or private credentials to this repository. Secrets belong in Cloudflare's secret/environment configuration.

### Next platform phase
After the public static launch is verified, introduce server-backed features incrementally. Authentication, assessment state, scoring, permissions and other consequential data must remain server-authoritative as defined in `ARCHITECTURE.md`.
