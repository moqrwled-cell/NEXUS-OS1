/**
 * Nexus ContractGuard Enterprise — High-Speed PDF Bates Stamping Suite
 * 100% Client-Side In-Memory Sequential Numbering & Binder via pdf-lib.
 * Compliant with judicial exhibit standards and air-gapped security.
 */
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Merges and applies sequential Bates stamping across multiple PDF files.
 * 
 * @param {Array<File|ArrayBuffer>} files - PDF files to process
 * @param {Object} options - Configuration options
 * @param {string} [options.prefix='EX-'] - Custom Bates prefix
 * @param {number} [options.startNumber=1] - Starting sequence number
 * @param {number} [options.padLength=4] - Zero-padding digit count
 * @param {'bottom-right'|'bottom-center'|'bottom-left'|'top-right'|'top-center'|'top-left'} [options.position='bottom-right'] - Stamp position
 * @param {number} [options.fontSize=10] - Font size in points
 * @param {'black'|'navy'|'red'|'white'} [options.color='black'] - Font color
 * @param {boolean} [options.drawPill=true] - Draw a high-contrast backing pill to ensure visibility on scanned docs
 * @param {Function} [options.onProgress] - Optional progress callback (current, total)
 * @returns {Promise<Object>} Stamped PDF bytes, manifest, range string, and download helper
 */
export async function executeBatesStamping(files = [], options = {}) {
  if (!files || files.length === 0) {
    throw new Error('No PDF files provided for Bates stamping.');
  }

  const prefix = options.prefix !== undefined ? options.prefix : 'EX-';
  const startNumber = Number(options.startNumber) >= 1 ? Number(options.startNumber) : 1;
  const padLength = Math.max(3, Math.min(8, Number(options.padLength) || 4));
  const position = options.position || 'bottom-right';
  const fontSize = Number(options.fontSize) || 10;
  const drawPill = options.drawPill !== false;
  const onProgress = options.onProgress || (() => {});

  const mergedPdf = await PDFDocument.create();
  const helveticaFont = await mergedPdf.embedFont(StandardFonts.HelveticaBold);

  // Map colors
  const colorMap = {
    black: rgb(0.05, 0.05, 0.05),
    navy: rgb(0.05, 0.15, 0.4),
    red: rgb(0.8, 0.1, 0.1),
    white: rgb(0.98, 0.98, 0.98)
  };
  const textColor = colorMap[options.color] || colorMap.black;

  let currentSequence = startNumber;
  let totalPagesProcessed = 0;
  const manifest = [];

  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    const file = files[fileIndex];
    const fileName = file.name || `Document_${fileIndex + 1}.pdf`;

    let arrayBuffer;
    if (file instanceof ArrayBuffer) {
      arrayBuffer = file;
    } else if (file.arrayBuffer) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      throw new Error(`Invalid file input at index ${fileIndex}`);
    }

    const sourceDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageIndices = sourceDoc.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(sourceDoc, pageIndices);

    const docStartBates = `${prefix}${String(currentSequence).padStart(padLength, '0')}`;

    for (let pIdx = 0; pIdx < copiedPages.length; pIdx++) {
      const page = copiedPages[pIdx];
      const { width, height } = page.getSize();

      const stampString = `${prefix}${String(currentSequence).padStart(padLength, '0')}`;
      const textWidth = helveticaFont.widthOfTextAtSize(stampString, fontSize);
      const textHeight = helveticaFont.heightAtSize(fontSize);

      // Margin offsets from page boundary
      const marginX = 28;
      const marginY = 22;

      let x = width - textWidth - marginX;
      let y = marginY;

      switch (position) {
        case 'bottom-left':
          x = marginX;
          y = marginY;
          break;
        case 'bottom-center':
          x = (width - textWidth) / 2;
          y = marginY;
          break;
        case 'bottom-right':
          x = width - textWidth - marginX;
          y = marginY;
          break;
        case 'top-left':
          x = marginX;
          y = height - marginY - textHeight;
          break;
        case 'top-center':
          x = (width - textWidth) / 2;
          y = height - marginY - textHeight;
          break;
        case 'top-right':
          x = width - textWidth - marginX;
          y = height - marginY - textHeight;
          break;
      }

      // Draw high-contrast backdrop pill to avoid stamp getting lost in footers or dark scans
      if (drawPill) {
        const paddingH = 6;
        const paddingV = 3;
        page.drawRectangle({
          x: x - paddingH,
          y: y - paddingV,
          width: textWidth + paddingH * 2,
          height: textHeight + paddingV * 2,
          color: rgb(0.98, 0.98, 0.98),
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 0.5,
          opacity: 0.92
        });
      }

      // Draw Bates text
      page.drawText(stampString, {
        x,
        y,
        size: fontSize,
        font: helveticaFont,
        color: textColor
      });

      mergedPdf.addPage(page);
      currentSequence++;
      totalPagesProcessed++;
      onProgress(totalPagesProcessed, totalPagesProcessed);
    }

    const docEndBates = `${prefix}${String(currentSequence - 1).padStart(padLength, '0')}`;
    manifest.push({
      fileName,
      pagesCount: copiedPages.length,
      startBates: docStartBates,
      endBates: docEndBates
    });
  }

  const finalStart = `${prefix}${String(startNumber).padStart(padLength, '0')}`;
  const finalEnd = `${prefix}${String(currentSequence - 1).padStart(padLength, '0')}`;
  const batesRange = `${finalStart} to ${finalEnd}`;

  const stampedPdfBytes = await mergedPdf.save();

  return {
    stampedPdfBytes,
    totalPages: totalPagesProcessed,
    batesRange,
    manifest,
    download(customFilename) {
      const filename = customFilename || `Bates_${prefix}${startNumber}_to_${currentSequence - 1}.pdf`;
      const blob = new Blob([stampedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };
}
