# Hackathon Problem Statement

**AI-Assisted Land Document Verification System**

Land registration in Tamil Nadu is already fully online through TNREGINET — patta, chitta, encumbrance certificate, and sale deed can all be submitted digitally. But once submitted, the actual checking of these documents against each other is still done manually by an officer, which is where mismatches and fraud slip through.

## Expected solution

Build a system that takes a set of submitted land documents and checks them against each other for inconsistencies — mismatched survey numbers, ownership mismatches, missing details, duplicate applications — and flags exactly which documents disagree and why, before the case reaches a human officer for final approval.

## LandGuard implementation

1. Ingest Patta, Chitta, EC and Sale Deed PDFs/images.
2. Extract structured land identity fields using PDF text extraction and OCR fallback.
3. Normalize survey/subdivision/owner/extent/registration fields.
4. Compare every document against the others.
5. Produce field-level evidence showing the documents that disagree.
6. Calculate an explainable risk score.
7. Detect repeated/duplicate application fingerprints.
8. Resolve exact supplied coordinates when present; otherwise provide an explicitly labeled administrative/area-level spatial handoff.
9. Keep human approval as the final decision gate.
10. Persist de-identified case metadata in MongoDB when configured; raw document text is not stored by default.
