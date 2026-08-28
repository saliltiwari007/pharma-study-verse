# Pharma Study Verse — Build Roadmap

## Stage 0 — preserved foundation
- Keep the existing `index.html` working.
- Document product architecture and trust boundaries.

## Stage 1 — first usable vertical slice
- Program catalogue data model
- Subject/topic hierarchy
- Student workspace shell
- Assessment data model
- One complete assessment flow with server-authoritative scoring once backend is connected

## Stage 2 — identity and persistence
- Secure authentication
- Role-based authorization: student / teacher / admin
- Persistent profiles and progress
- Audit logging

## Stage 3 — academic operations
- Teacher dashboard
- Student progress reports
- Workload/reporting hooks where applicable
- Content publishing workflow

## Stage 4 — assessment integrity
- Randomized question pools
- Variant delivery
- Attempt/session controls
- Timing and answer-key protection
- Suspicious-attempt review

## Stage 5 — engagement
- Badges
- Levels
- Activity-based rankings
- Carefully designed streak/progress signals

## Stage 6 — expansion
- D.Pharm
- M.Pharm
- Pharm.D
- GPAT and other competitive preparation

## Stage 7 — sustainable monetization
- Non-intrusive advertising surfaces
- Optional premium capabilities
- No monetization mechanism should compromise learning, privacy or assessment integrity.

## Definition of done for each stage
- Works on mobile and desktop.
- Keyboard/focus behavior remains usable.
- No critical console/runtime errors in the changed flow.
- Existing public experience is not unintentionally broken.
- Security-sensitive state is not trusted from the browser.
