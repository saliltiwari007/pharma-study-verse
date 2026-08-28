# Content Studio

## Purpose

Provide an owner-controlled workspace for building the permanent learning library without exposing a general-purpose AI endpoint to students.

## Author workflow

`Topic → Draft content → Generate assessment assets → Validate → Save draft → Owner approval → Optional AI review → Publish`

### Approval modes

- **Owner only:** publication requires the owner's approval.
- **Two-phase:** owner approval followed by optional AI review/approval, when explicitly enabled.
- AI never silently publishes consequential academic content.

## Asset types

A topic may have independently versioned:
- explanation/notes;
- diagrams or image prompts/assets;
- MCQs;
- true/false;
- fill-in-the-blank;
- matching;
- case/application questions;
- rapid revision cards;
- mini-games/interactive activities;
- practice assessments.

## Library rule

Approved assets become reusable library items. Student activity should consume approved library material and generated variants, rather than calling an unrestricted AI model for every visit.

## AI add-on rule

The internal AI may inspect the approved library and suggest new questions, variants, distractors, tags, difficulty levels or related activities. Suggestions enter the same draft/approval workflow. Existing approved material is never silently replaced.

## Cost-control rule

AI generation is an authoring operation, not the default student-serving path. Cache approved content and variants. This reduces recurring model calls and prevents unnecessary per-student AI cost.

## Quality gates

Before publication, validate:
- curriculum/program/semester/subject/topic mapping;
- factual completeness;
- answer-key consistency;
- duplicate/similar-question detection;
- difficulty and learning objective tags;
- accessibility/readability;
- source/reference metadata where required;
- version and approval audit trail.
