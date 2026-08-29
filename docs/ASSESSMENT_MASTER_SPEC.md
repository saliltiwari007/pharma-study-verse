# Pharma Study Verse — Assessment Master Specification

## 1. Purpose

The assessment system is a **diagnostic readiness system**. Its primary purpose is to help a student understand their current personal preparation and their relative preparedness among comparable students. It is not merely a marks generator.

Every result should answer two questions:
1. **Personal readiness:** How prepared am I, and where am I strong or weak?
2. **Relative readiness:** If I sit with comparable students, where do I currently stand?

Rank must always be shown with the number of participants and complementary measures such as accuracy, coverage and percentile. A rank is not treated as proof of absolute academic mastery.

## 2. Initial scope

Build the first production assessment track for:
- Programme: B.Pharm
- Structure: semester → subject → unit → topic
- First release: subject-wise diagnostic assessments

The same engine must remain configurable for D.Pharm, M.Pharm, Pharm.D and competitive preparation later; do not hard-code B.Pharm assumptions into the engine.

## 3. Assessment modes

### Practice
- Unlimited/repeatable practice.
- Immediate or configurable feedback.
- Explanations and revision support.
- Does not affect competitive ranking.

### Diagnostic Assessment
- Controlled attempt intended to measure current preparation.
- Randomized approved question pool.
- Server-authoritative scoring when backend is available.
- Result contributes to the student's diagnostic history and eligible ranking.

### Ranked Assessment (later phase)
- Explicitly labelled competitive mode.
- Eligibility, attempt limits and ranking rules are configurable.
- Only valid completed sessions enter the ranked leaderboard.

## 4. Student selection

Student should be able to select:
- Programme
- Semester
- Subject
- Optional unit/topic scope
- Difficulty (where configured)
- Assessment length (where configured)

The student must not be forced to complete unrelated subjects before reaching a weak area. Direct targeted assessment is required for useful diagnosis.

## 5. Question model

Every approved question should support:
- programme
- semester/year
- subject
- unit
- topic
- question text
- question type
- options (where applicable)
- correct answer/key
- explanation
- difficulty
- source/reference
- status: draft → review → approved → published → retired
- version

Question pools must be large enough to reduce repetition. Random selection must be controlled so that a short test does not repeatedly show the same item.

## 6. Assessment rules

The following are configurable per assessment:
- total questions
- time limit
- marks per question
- negative marking
- passing/readiness bands
- maximum attempts
- review-before-submit
- feedback timing
- question/option randomization

Defaults should be conservative and clearly displayed before start. Do not silently change a student's scoring rules.

## 7. Result model

Immediately after a valid completed assessment, show:
- score
- total marks
- percentage
- correct / incorrect / unanswered
- accuracy
- time taken
- subject/unit/topic performance
- strengths
- weak areas
- recommended revision
- comparison with previous valid attempts

Where sufficient population data exists, also show:
- rank
- total participants
- percentile
- score/accuracy relative to cohort

If cohort data is insufficient, say so instead of manufacturing a meaningful rank.

## 8. Fair ranking

Ranking must not be based only on raw score when assessments differ in length or difficulty.

The system should rank only within a clearly defined comparable cohort, e.g. same programme + semester + assessment/version. Practice attempts do not enter ranked results.

Store enough metadata to explain a rank:
- assessment/version
- cohort definition
- attempts considered
- score
- accuracy
- completion status
- timestamp

For ties, use a deterministic documented tie-breaker; do not hide the rule.

## 9. Security and integrity

The browser is untrusted.
- Correct answers must not be exposed before submission.
- Scoring must be server-authoritative for ranked/official diagnostic attempts.
- Create a server-side attempt/session ID.
- Validate the question set and scoring rules server-side.
- Reject incomplete/invalid ranked submissions.
- Apply rate limits and attempt controls.
- Keep audit events for high-value competitive assessments.
- Suspicious patterns may be flagged for review but are not automatically treated as cheating.

## 10. Student history

Maintain a longitudinal diagnostic history so the student can see:
- previous assessments
- best score
- latest score
- trend over time
- topic mastery signals
- weak-topic recurrence
- improvement since previous attempt

Dashboard should surface the most useful next action rather than only displaying numbers.

## 11. Content governance

Approved curriculum/content sources are the factual basis. AI may help draft questions, but generated questions remain draft until human/configured approval. Published question versions should be immutable; revisions create a new version.

## 12. UX principles

- Mobile-first and desktop-compatible.
- Clear assessment instructions before start.
- Progress indicator during test.
- No colour-only correctness cues.
- Accessible controls and readable text.
- No ads/interruption during an active assessment.
- Clear final submission confirmation.
- Clear distinction between practice and ranked/diagnostic modes.

## 13. Recommended implementation order

1. Assessment information architecture and page UX.
2. Question data schema and approved question import.
3. Practice engine.
4. Diagnostic attempt engine.
5. Result analysis.
6. Persistent student history.
7. Cohort rank/percentile.
8. Ranked mode and integrity controls.
9. Teacher/admin review and content publishing.
10. QA, accessibility, security and performance testing.
