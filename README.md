# LandGuard AI — Final Hackathon Submission

LandGuard AI is a Tamil Nadu-focused AI-assisted land-document intake and reconciliation prototype. It extracts structured fields from Patta, Chitta, Encumbrance Certificate and Sale Deed submissions, cross-checks them for inconsistencies, explains risk signals, resolves spatial context, stores cases in MongoDB, and keeps human authority as the final decision gate.

## Included

- Sequential document intake: Patta, Chitta, Sale Deed and Encumbrance Certificate
- PDF/image extraction and browser OCR
- Automated cross-document discrepancy matrix
- Explainable field-level mismatch detection
- Risk score and severity engine
- LandTrace spatial review with satellite/street layers
- Official TNGIS viewer links
- MongoDB case storage
- Case management and workflow status
- Case report generation
- Analytics dashboard
- Duplicate/similarity detection
- Audit trail and human-in-the-loop decisions
- Dataset Vault with JSON/CSV export

## Tech Stack

Next.js 15, React 19, TypeScript, Tailwind CSS, Leaflet, MongoDB, PDF.js and Tesseract.js.

## Setup

1. Install Node.js 20+.
2. Extract this project.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Put your MongoDB Atlas connection values in `.env.local`.
6. Run `npm run dev`.
7. Open the local URL shown by Next.js.

## Public prototype workflow

No login or demo credentials are required. The intended flow is:

1. Start a new case.
2. Select a document type.
3. Upload one Patta, Chitta, Sale Deed or Encumbrance Certificate.
4. Extract and review the structured fields.
5. Add the remaining records sequentially.
6. Run the cross-document check.
7. Review the Automated Discrepancy Matrix.
8. Open LandTrace and, when appropriate, hand off to the official TNGIS viewer.
9. Choose APPROVE / HOLD FOR REVIEW / RETURN FOR CORRECTION.
10. Save the case to MongoDB and inspect it in Case Management / Analytics.

The **LOAD JUDGE DEMO** button loads a synthetic scenario for a fast presentation.

## Production safety

- Never commit `.env.local` or database credentials.
- Do not use this prototype to make legal land-registration decisions.
- Exact cadastral boundaries must come from an authorized cadastral/Tamil Nilam/TNGIS source; LandGuard does not fabricate them.
- Use synthetic/de-identified data for demonstrations.
- AI findings are review signals; human authority remains the final decision gate.

## Build validation

Run:

```bash
npm run build
```

Then, if the build succeeds:

```bash
npm start
```

## Disclaimer

LandGuard AI is a hackathon/public prototype and is not an official Government of Tamil Nadu service.
