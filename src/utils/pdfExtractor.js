/**
 * Nexus ContractGuard Enterprise — Air-Gapped PDF Text Extractor
 * 100% In-Browser / Local-First client-side PDF text extraction using pdfjs-dist.
 * Zero external CDN requests, zero telemetry, zero cloud dependencies.
 * Complies with ABA Rule 1.6 client confidentiality.
 */

import * as pdfjsLib from 'pdfjs-dist';
import { recognizeImage } from './ocrEngine.js';

// Configure worker source in browser environments without external network CDNs
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  } catch {
    // If resolution fails, pdfjs falls back to local fake-worker emulation
  }
}

/**
 * Validates if the given file, buffer, or name represents a valid PDF document.
 * 
 * @param {File | Blob | ArrayBuffer | Uint8Array | string} input
 * @returns {boolean}
 */
export function isPDF(input) {
  if (!input) return false;

  // String check (filename or mime-type)
  if (typeof input === 'string') {
    return input.toLowerCase().endsWith('.pdf') || input.toLowerCase() === 'application/pdf';
  }

  // File or Blob check
  if (typeof Blob !== 'undefined' && input instanceof Blob) {
    if (input.type === 'application/pdf') return true;
    if ('name' in input && typeof input.name === 'string' && input.name.toLowerCase().endsWith('.pdf')) {
      return true;
    }
  }

  // Magic byte check (%PDF- => 0x25, 0x50, 0x44, 0x46)
  let bytes = null;
  if (input instanceof Uint8Array) {
    bytes = input;
  } else if (input instanceof ArrayBuffer) {
    bytes = new Uint8Array(input);
  } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer?.(input)) {
    bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }

  if (bytes && bytes.length >= 4) {
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  }

  return false;
}

/**
 * Extracts raw and structured text page-by-page from a PDF document.
 * 
 * @param {File | Blob | ArrayBuffer | Uint8Array} pdfSource - Input PDF data
 * @param {Object} [options]
 * @param {Function} [options.onProgress] - Optional progress callback ({ currentPage, totalPages, percent })
 * @param {boolean} [options.disableFontFace=true] - Disable font face loading for air-gapped speed
 * @returns {Promise<{
 *   fullText: string,
 *   pages: Array<{ pageNumber: number, text: string, wordCount: number }>,
 *   pageCount: number,
 *   totalWords: number,
 *   metadata: Object
 * }>}
 */
export async function extractTextFromPDF(pdfSource, options = {}) {
  if (!pdfSource) {
    throw new Error('PDF extraction error: No PDF source provided.');
  }

  // Convert source to Uint8Array / ArrayBuffer
  let data;
  if (typeof Blob !== 'undefined' && pdfSource instanceof Blob) {
    const ab = await pdfSource.arrayBuffer();
    data = new Uint8Array(ab);
  } else if (pdfSource instanceof Uint8Array) {
    data = pdfSource;
  } else if (pdfSource instanceof ArrayBuffer) {
    data = new Uint8Array(pdfSource);
  } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer?.(pdfSource)) {
    data = new Uint8Array(pdfSource.buffer, pdfSource.byteOffset, pdfSource.byteLength);
  } else {
    throw new Error('PDF extraction error: Unsupported PDF input format.');
  }

  if (!data || data.byteLength === 0) {
    throw new Error('PDF extraction error: Empty PDF data buffer.');
  }

  // Verify PDF magic header (%PDF-)
  if (data.byteLength >= 4) {
    const isPdfHeader = data[0] === 0x25 && data[1] === 0x50 && data[2] === 0x44 && data[3] === 0x46;
    if (!isPdfHeader) {
      throw new Error('PDF extraction error: Invalid PDF header. File is not a valid PDF.');
    }
  }

  const loadingTask = pdfjsLib.getDocument({
    data,
    disableFontFace: options.disableFontFace ?? true,
    useSystemFonts: options.useSystemFonts ?? true,
    isEvalSupported: false // Air-gap & security compliance
  });

  let pdfDoc = null;
  try {
    pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const pages = [];
    let fullTextParts = [];
    let totalWords = 0;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Reconstruct lines preserving paragraph flow and legal clauses
      let pageText = '';
      let lastY = null;

      for (const item of textContent.items) {
        if (!item || typeof item.str !== 'string') continue;

        // When vertical Y position changes significantly, insert newline
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ') && !item.str.startsWith(' ')) {
          pageText += ' ';
        }

        pageText += item.str;
        lastY = item.transform[5];
      }

      let trimmedPageText = pageText.trim();
      let isOcrApplied = false;

      // If page has insufficient text (< 25 chars), it is likely a scanned image/exhibit
      if (trimmedPageText.length < 25 && options.enableOcr !== false) {
        try {
          if (typeof options.onProgress === 'function') {
            options.onProgress({
              currentPage: pageNum,
              totalPages: numPages,
              percent: Math.round(((pageNum - 0.5) / numPages) * 100),
              isOcr: true,
              message: `In-RAM OCR: Scanning page ${pageNum}/${numPages}...`
            });
          }

          const viewport = page.getViewport({ scale: 1.75 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;

          const ocrResult = await recognizeImage(canvas, {
            preprocess: true,
            onProgress: (p) => {
              if (typeof options.onProgress === 'function' && p.userFriendly) {
                options.onProgress({
                  currentPage: pageNum,
                  totalPages: numPages,
                  percent: Math.round(((pageNum - 0.5 + (p.progress || 0) * 0.5) / numPages) * 100),
                  isOcr: true,
                  message: `In-RAM OCR: Page ${pageNum}/${numPages} (${p.userFriendly})`
                });
              }
            }
          });

          if (ocrResult?.text) {
            trimmedPageText = ocrResult.text;
            isOcrApplied = true;
          }

          // Immediately release canvas memory to prevent memory leaks / browser freeze
          canvas.width = 0;
          canvas.height = 0;
        } catch (ocrErr) {
          console.warn(`[ContractGuard OCR] Page ${pageNum} OCR fallback skipped:`, ocrErr);
        }
      }

      const pageWordCount = trimmedPageText ? trimmedPageText.split(/\s+/).length : 0;
      totalWords += pageWordCount;

      pages.push({
        pageNumber: pageNum,
        text: trimmedPageText,
        wordCount: pageWordCount,
        isOcr: isOcrApplied
      });

      if (trimmedPageText) {
        fullTextParts.push(trimmedPageText);
      }

      // Notify caller of progress
      if (typeof options.onProgress === 'function') {
        const percent = Math.round((pageNum / numPages) * 100);
        options.onProgress({
          currentPage: pageNum,
          totalPages: numPages,
          percent,
          isOcr: isOcrApplied,
          message: isOcrApplied 
            ? `Page ${pageNum}/${numPages} processed via In-RAM OCR`
            : `Page ${pageNum}/${numPages} extracted`
        });
      }
    }

    // Retrieve document metadata if available
    let metadata = {};
    try {
      const meta = await pdfDoc.getMetadata();
      metadata = {
        title: meta?.info?.Title || null,
        author: meta?.info?.Author || null,
        producer: meta?.info?.Producer || null,
        creationDate: meta?.info?.CreationDate || null
      };
    } catch {
      // Metadata retrieval is non-critical
    }

    return {
      fullText: fullTextParts.join('\n\n'),
      pages,
      pageCount: numPages,
      totalWords,
      metadata
    };
  } finally {
    if (pdfDoc && typeof pdfDoc.destroy === 'function') {
      try {
        await pdfDoc.destroy();
      } catch {
        // ignore destroy errors
      }
    }
  }
}
