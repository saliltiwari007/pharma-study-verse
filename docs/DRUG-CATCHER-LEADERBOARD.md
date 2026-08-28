# Drug Catcher leaderboard setup

The game now has a server-backed leaderboard endpoint at `/api/game-scores` and a localStorage fallback for offline/dev use.

## Cloudflare Pages + D1

1. Create a Cloudflare D1 database for Pharma Study Verse.
2. Run `functions/api/game-scores.sql` against that database.
3. In the Cloudflare Pages project, open **Settings → Functions → D1 database bindings**.
4. Add the binding name **DB** and select the new D1 database.
5. Redeploy the Pages project.

After the binding is active, completed Drug Catcher runs are stored centrally and the game can show the current Top 10 and the student's rank.

## Important integrity note

The public game is a practice/learning game, not a secure examination. A browser can be tampered with, so this leaderboard should not be treated as an invigilated assessment result. For high-stakes student assessment, move the game scoring to server-issued attempts and server-authoritative scoring as specified in `ARCHITECTURE.md`.
