import { extractFields, type LandFields } from './verification';

export type ExtractionResult = {
  text: string;
  fields: LandFields;
  confidence: number;
  pages: number;
  method: 'PDF TEXT' | 'OCR IMAGE' | 'PDF OCR' | 'FILENAME';
};

const empty: LandFields = {
  district: '',
  taluk: '',
  village: '',
  survey: '',
  subdivision: '',
  owner: '',
  extentAcres: null,
  documentNumber: '',
  registrationDate: '',
  latitude: null,
  longitude: null
};

export function mergeFields(
  a: LandFields,
  b: Partial<LandFields>
): LandFields {
  return {
    ...a,
    ...b,
    extentAcres: b.extentAcres ?? a.extentAcres
  };
}

/**
 * Load PDF using the legacy PDF.js build.
 *
 * The legacy build is more reliable with Next.js/browser bundling
 * and avoids the worker-loading problem caused by the standard build.
 */
async function loadPdf(buffer: ArrayBuffer) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf');

  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

  return pdfjs.getDocument({
    data: buffer
  }).promise;
}

async function pdfText(
  pdf: any,
  onProgress?: (p: number, msg: string) => void
) {
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(
      10 + Math.round((i / pdf.numPages) * 68),
      `Reading PDF page ${i}/${pdf.numPages}…`
    );

    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const parts = (content.items as any[]).map((x) => {
      const value = String(x.str ?? '');
      return x.hasEOL ? `${value}\n` : `${value} `;
    });

    text += parts.join('').replace(/[ \t]+\n/g, '\n') + '\n';
  }

  return text.trim();
}

async function pdfOcr(
  pdf: any,
  onProgress?: (p: number, msg: string) => void
) {
  const { createWorker } = await import('tesseract.js');

  const worker = await createWorker('eng');

  let text = '';
  let confidenceTotal = 0;

  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      onProgress?.(
        12 + Math.round((i / pdf.numPages) * 72),
        `OCR scanning PDF page ${i}/${pdf.numPages}…`
      );

      const page = await pdf.getPage(i);

      const viewport = page.getViewport({
        scale: 1.7
      });

      const canvas = document.createElement('canvas');

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error(
          'Browser canvas is unavailable for PDF OCR.'
        );
      }

      await page.render({
        canvasContext: ctx,
        viewport
      }).promise;

      const r = await worker.recognize(canvas);

      text += `${r.data.text || ''}\n`;

      confidenceTotal += Number(
        r.data.confidence || 0
      );

      canvas.width = 1;
      canvas.height = 1;
    }
  } finally {
    await worker.terminate();
  }

  return {
    text: text.trim(),
    confidence: pdf.numPages
      ? Math.round(confidenceTotal / pdf.numPages)
      : 0
  };
}

export async function extractDocument(
  file: File,
  onProgress?: (p: number, msg: string) => void
): Promise<ExtractionResult> {
  const ext = file.name.toLowerCase();

  /*
   * IMAGE DOCUMENT
   */
  if (file.type.startsWith('image/')) {
    onProgress?.(
      8,
      'Preparing OCR engine…'
    );

    const { createWorker } = await import('tesseract.js');

    const worker = await createWorker('eng');

    try {
      onProgress?.(
        20,
        'Reading document image…'
      );

      const r = await worker.recognize(file);

      onProgress?.(
        92,
        'Structuring extracted fields…'
      );

      const text = r.data.text || '';

      return {
        text,
        fields: mergeFields(
          empty,
          extractFields(text)
        ),
        confidence: Math.round(
          r.data.confidence || 0
        ),
        pages: 1,
        method: 'OCR IMAGE'
      };
    } finally {
      await worker.terminate();
    }
  }

  /*
   * PDF DOCUMENT
   */
  if (
    file.type === 'application/pdf' ||
    ext.endsWith('.pdf')
  ) {
    const buffer = await file.arrayBuffer();

    onProgress?.(
      5,
      'Opening PDF securely…'
    );

    const pdf = await loadPdf(buffer);

    if (!pdf.numPages) {
      throw new Error(
        'The PDF contains no readable pages.'
      );
    }

    /*
     * First attempt:
     * Extract the existing PDF text layer.
     */
    const text = await pdfText(
      pdf,
      onProgress
    );

    const fields = mergeFields(
      empty,
      extractFields(text)
    );

    const usefulFields = [
      fields.district,
      fields.taluk,
      fields.village,
      fields.survey,
      fields.subdivision,
      fields.owner
    ].filter(
      (v) => String(v ?? '').trim()
    ).length;

    /*
     * If enough land fields were extracted,
     * use normal PDF text extraction.
     */
    if (usefulFields >= 3) {
      onProgress?.(
        96,
        'Land identity extracted successfully.'
      );

      return {
        text,
        fields,
        confidence: 98,
        pages: pdf.numPages,
        method: 'PDF TEXT'
      };
    }

    /*
     * Scanned PDF fallback:
     * Render each PDF page and run OCR.
     */
    onProgress?.(
      82,
      'No usable text layer found — switching to PDF OCR…'
    );

    const ocr = await pdfOcr(
      pdf,
      onProgress
    );

    const ocrFields = mergeFields(
      empty,
      extractFields(ocr.text)
    );

    if (!ocr.text.trim()) {
      throw new Error(
        'PDF opened, but neither text extraction nor OCR returned readable text.'
      );
    }

    onProgress?.(
      96,
      'Structuring OCR-extracted land fields…'
    );

    return {
      text: ocr.text,
      fields: ocrFields,
      confidence: ocr.confidence,
      pages: pdf.numPages,
      method: 'PDF OCR'
    };
  }

  /*
   * FILENAME FALLBACK
   */
  const text = file.name;

  return {
    text,
    fields: mergeFields(
      empty,
      extractFields(text)
    ),
    confidence: 25,
    pages: 1,
    method: 'FILENAME'
  };
}