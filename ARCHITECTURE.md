# Product Architecture

## Core modules

1. **Public learning home** — subjects, resources, search and clear calls to action.
2. **Student workspace** — profile, enrolled programs, progress, attempts, badges and level.
3. **Assessment engine** — question pools, randomized delivery, controlled attempts, server-side scoring and review.
4. **Teacher workspace** — class/learner visibility, subject progress and academic reports.
5. **Admin workspace** — content, users, roles, publishing and audit controls.
6. **Content Studio** — draft → review → approval → publish workflow, with optional AI assistance.
7. **Program catalogue** — B.Pharm, D.Pharm, M.Pharm, Pharm.D and competitive preparation as separate configurable tracks.

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

## Delivery rule

Prefer small, tested vertical slices over a large unfinished feature set. Preserve the current working public page while backend capabilities are introduced incrementally.
