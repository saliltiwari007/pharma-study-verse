# Product Architecture

## Core modules

1. **Public learning home** — subjects, resources, search and clear calls to action.
2. **Student workspace** — profile, enrolled programs, progress, attempts, badges and level.
3. **Baseline diagnostic** — a low-stakes first measurement of current preparation, domain strengths, weak areas, accuracy and readiness band.
4. **Practice engine** — unlimited learning-oriented practice without competitive ranking.
5. **Assessment engine** — controlled, randomized, server-scored assessments with attempt history and eligible ranking.
6. **Challenge engine** — high-discrimination competitive activities such as EduGames with shared leaderboards.
7. **Teacher workspace** — class/learner visibility, subject progress and academic reports.
8. **Admin workspace** — content, users, roles, publishing and audit controls.
9. **Content Studio** — draft → review → approval → publish workflow, with optional AI assistance.
10. **Program catalogue** — B.Pharm, D.Pharm, M.Pharm, Pharm.D and competitive preparation as separate configurable tracks.
11. **Tools Hub** — transparent calculators, dictionary, professional/career utilities, manufacturing, marketing and research helpers.

## Student learning loop

`Learn → Practice → Baseline/Assess → Identify weak areas → Revise → Reinforce with EduGames → Reassess`

The dashboard should recommend the next action from actual recorded activity instead of becoming another long content page.

## Drug Catcher progression

The pharmacology Drug Catcher is one game with multiple therapeutic-class levels. Students may select a weak class directly or choose the complete five-class challenge.

- **Beginner:** class recognition at relaxed speed.
- **Medium:** class + subclass recognition at moderate speed/density.
- **Expert:** class + subclass recognition at higher speed/density.
- Each class uses a controlled target deck and distractor deck rather than relying on a random stream that can accidentally contain almost no wrong answers.
- Target cards have no visual correctness colour. Explanations appear after a catch so the visual state cannot reveal the answer.
- A completed class receives a local completion mark and a Restart action for revision.
- Shared ranking is reserved for the full challenge and is server-backed when D1 is configured.

## Trust boundaries

The browser is treated as untrusted. Scores, ranks, permissions, approval state, attempt state and protected content must be validated server-side.

## Assessment integrity

The eventual assessment service should support:
- server-issued attempt/session identifiers;
- randomized question selection from controlled pools;
- shuffled options where appropriate;
- server-side timing and scoring;
- attempt limits and cooldowns;
- audit events;
- suspicious-pattern flags for review;
- separation of answer keys from public client payloads.

No anti-cheating mechanism is absolute; the goal is meaningful resistance, auditability and fair assessment rather than a misleading promise of perfect prevention.

## Publishing

AI may assist with drafting, restructuring, tagging or checking content, but publication remains gated by configured approval rules. Human approval is the default for consequential academic content.

## Curriculum source of truth

The B.Pharm 2026 curriculum file is derived from the uploaded **B. Pharm. Syllabus 2026 as Per PCI.pdf**. The syllabus controls course codes, course titles, semester placement, course type, hours, credits and elective options. Detailed topic/question content must be mapped to the source syllabus before being treated as authoritative.

## Delivery rule

Prefer small, tested vertical slices over a large unfinished feature set. Preserve working public pages while backend capabilities are introduced incrementally.
