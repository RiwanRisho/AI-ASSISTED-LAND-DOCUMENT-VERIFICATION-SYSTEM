# LandGuard AI — 3-Minute Judge Demo

## What to show

LandGuard AI follows a simple government-workflow-style sequence:

**Select document → Upload → Extract → Add next record → Reconcile → LandTrace → Decision → MongoDB**

## Clean case

1. Click **NEW CASE**.
2. Select **Patta**.
3. Upload `demo-documents/01_Patta.pdf`.
4. Select **Chitta** and upload `04_Chitta.pdf`.
5. Select **Sale Deed** and upload `02_Sale_Deed.pdf`.
6. Select **Encumbrance Certificate** and upload `03_Encumbrance_Certificate.pdf`.
7. Click **RUN CROSS-DOCUMENT CHECK**.
8. Show the **Automated Discrepancy Matrix** and matching fields.
9. Open **LandTrace** and show the spatial context.
10. Select **APPROVE** and **SAVE CASE TO MONGODB**.

## Discrepancy case

1. Click **NEW CASE**.
2. Upload `01_Patta.pdf`.
3. Upload `06_Mismatch_Ownership.pdf` as the Sale Deed.
4. Run the cross-document check.
5. Show the **Owner / Executant Name** conflict and the red **CRITICAL DISCREPANCY DETECTED** banner.
6. Choose **HOLD FOR REVIEW** or **RETURN FOR CORRECTION**.
7. Save the case and open **Case Management**.

## Survey mismatch case

Use `07_Mismatch_Survey.pdf` as the Encumbrance Certificate with `01_Patta.pdf`.
The expected test signal is a Survey Number conflict.

## Important

All files in `demo-documents/` are synthetic hackathon test data. They are not government-issued records.

LandGuard AI is a public/hackathon prototype, not an official Government of Tamil Nadu service. It does not make a legal land-registration decision and does not fabricate cadastral boundaries.
