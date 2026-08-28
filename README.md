# Pharma Study Verse

A pharmacy education platform foundation for B.Pharm, D.Pharm, M.Pharm, Pharm.D and competitive-exam preparation.

## Current foundation
- Responsive educational landing page
- Search and subject filtering
- Resource/assessment interaction patterns
- Accessibility-friendly focus states and navigation
- Mobile navigation

## Product direction
The platform is intentionally being developed in layers. Authentication, persistent progress, rankings, assessment integrity, teacher/admin controls and publishing workflows require a secure backend and must not be faked with client-side storage.

## Security principle
Client-side UI is never trusted for scores, ranks, permissions, approval status or consequential assessment state. Those capabilities belong on a server-backed architecture when implemented.

## Development principle
Keep the launch focused: build a genuinely usable core before adding optional complexity.
