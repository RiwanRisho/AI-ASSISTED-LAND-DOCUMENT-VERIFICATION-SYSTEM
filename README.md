# LandGuard AI — Final Hackathon Submission

**🚀 Live Demo:** https://landguard-ai-opal.vercel.app

LandGuard AI is a Tamil Nadu-focused AI-assisted land-document intake and reconciliation prototype. It extracts structured fields from Patta, Chitta, Encumbrance Certificate and Sale Deed submissions, cross-checks them for inconsistencies, explains risk signals, resolves spatial context, stores cases in MongoDB, and keeps human authority as the final decision gate.

## 🚀 LandGuard AI — Live Demo

👉 **https://landguard-ai-opal.vercel.app**

Open the live application directly in your browser. No installation or login is required for the public prototype.

## Included

- Sequential document intake: Patta, Chitta, Sale Deed and Encumbrance Certificate
- PDF/image document extraction
- Browser-based OCR using Tesseract.js
- Automated cross-document discrepancy matrix
- Explainable field-level mismatch detection
- Risk score and severity engine
- LandTrace spatial review with satellite/street map layers
- Official TNGIS viewer hand-off links
- MongoDB case storage
- Case management and workflow status
- Case report generation
- Analytics dashboard
- Duplicate/similarity detection
- Audit trail
- Human-in-the-loop decision workflow
- Dataset Vault with JSON/CSV export

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Leaflet
- MongoDB Atlas
- PDF.js
- Tesseract.js
- Node.js
- Vercel

## Public Prototype Workflow

No login or demo credentials are required.

The intended workflow is:

1. Start a new case.
2. Select a document type.
3. Upload one Patta, Chitta, Sale Deed or Encumbrance Certificate.
4. Extract and review the structured fields.
5. Add the remaining records sequentially.
6. Run the cross-document check.
7. Review the Automated Discrepancy Matrix.
8. Open LandTrace for spatial context.
9. When appropriate, hand off to the official TNGIS viewer.
10. Choose APPROVE / HOLD FOR REVIEW / RETURN FOR CORRECTION.
11. Save the case to MongoDB.
12. Inspect the case through Case Management and Analytics.

The **LOAD JUDGE DEMO** button can be used to quickly load a synthetic demonstration scenario during a presentation.

## Core Features

### Document Intelligence

Extracts important land attributes such as:

- District
- Taluk
- Village
- Survey Number
- Sub-Division
- Owner / Executant Name
- Land Extent
- Document Number
- Registration Date
- Geographic coordinates when available

### Cross-Document Reconciliation

LandGuard AI compares information across submitted records and identifies conflicts such as:

- Survey number mismatch
- Sub-division mismatch
- Ownership/name mismatch
- Land extent mismatch
- Property address mismatch
- Encumbrance-related discrepancies

The system highlights the specific field and documents involved instead of simply returning a generic verification failure.

### Automated Discrepancy Matrix

The reconciliation view provides:

- Survey Number
- Sub-Division
- Property Address
- Land Extent
- Owner / Executant Name
- MATCH / CONFLICT status
- Audit diagnostics
- Review notes

### LandTrace

LandTrace provides spatial context for a land record.

When valid geographic coordinates are available, the location can be visualized on map and satellite layers.

For authoritative cadastral verification, the system provides a hand-off toward the official GIS environment rather than fabricating parcel boundaries.

### Case Management

Cases can be stored with:

- Case ID
- Document information
- Extracted fields
- Reconciliation results
- Risk information
- Decision status
- Assigned officer / intake identity
- Timestamps
- Audit information

### Analytics

The dashboard provides an overview of:

- Total cases
- Document intake
- Detected discrepancies
- Critical issues
- Case outcomes
- Review activity

### Dataset Vault

The Dataset Vault supports demonstration and testing data, including:

- Clean cases
- Ownership mismatches
- Survey-number mismatches
- Subdivision conflicts
- Encumbrance discrepancies

The bundled demonstration records are synthetic hackathon data.

## Setup

1. Install Node.js 20+.
2. Clone or extract this project.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Add your MongoDB Atlas connection values.
6. Run `npm run dev`.
7. Open the local URL shown by Next.js.

Example environment configuration:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB=landguard