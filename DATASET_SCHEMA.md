# LandGuard Dataset Schema

Prototype cases are stored locally in the browser under `landguard-cases` and can be exported as JSON or CSV.

Each case contains:
- `caseId`
- `createdAt`
- `mode`
- `documents[]`
- `result.findings[]`
- `result.risk`
- `result.score`
- `result.recommendation`
- `decision`
- `parcel`

Production recommendation: store only approved/de-identified metadata, retain officer outcomes as ground truth, audit access, encrypt sensitive documents, and evaluate false positives before any model retraining.
