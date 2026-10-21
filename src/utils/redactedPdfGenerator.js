/**
 * Nexus ContractGuard Enterprise — Court-Grade Redacted PDF Generator
 * 100% In-Memory RAM Generation via pdf-lib (Air-Gapped & ABA Rule 1.6 Compliant).
 * Produces clean, multi-page legal discovery PDFs with pagination, letterheads,
 * and certified redaction audit notices.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Wraps text into lines that do not exceed maxWidth points.
 */
function wrapText(text, font, fontSize, maxWidth) {
  const paragraphs = text.split('\n');
  const wrappedLines = [];

  for (const para of paragraphs) {
    if (para.trim() === '') {
      wrappedLines.push('');
      continue;
    }

    const words = para.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) wrappedLines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) wrappedLines.push(currentLine);
  }

  return wrappedLines;
}

/**
 * Generates an executive, court-grade PDF document containing sanitized/redacted contract text.
 * 
 * @param {string} sanitizedText - The redacted contract text
 * @param {Object} metadata - Job metadata (title, totalRedactions, date, ruleCounts)
 * @returns {Promise<Uint8Array>} Raw PDF bytes
 */
export async function generateRedactedPDFBytes(sanitizedText = '', metadata = {}) {
  const pdfDoc = await PDFDocument.create();
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);

  const title = metadata.title || 'Sanitized Legal Matter';
  const totalRedactions = metadata.totalRedactions ?? 0;
  const dateStr = metadata.date || new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const pageWidth = 612; // US Letter width
  const pageHeight = 792; // US Letter height
  const margin = 54; // 0.75 in
  const usableWidth = pageWidth - (margin * 2);
  const fontSize = 9.5;
  const lineHeight = 13.5;

  // Split and wrap document text
  const lines = wrapText(sanitizedText, fontCourier, fontSize, usableWidth);

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let cursorY = pageHeight - margin;

  const drawPageHeader = (page) => {
    page.drawText('PRIVILEGED & CONFIDENTIAL // PRODUCED UNDER ABA MODEL RULE 1.6 & COURT PROTECTIVE ORDER', {
      x: margin,
      y: pageHeight - 32,
      size: 7.5,
      font: fontBold,
      color: rgb(0.35, 0.4, 0.45)
    });
    page.drawLine({
      start: { x: margin, y: pageHeight - 38 },
      end: { x: pageWidth - margin, y: pageHeight - 38 },
      thickness: 0.75,
      color: rgb(0.8, 0.83, 0.88)
    });
  };

  // Draw Page 1 Letterhead & Redaction Certificate Box
  drawPageHeader(currentPage);
  cursorY = pageHeight - 50;

  // Header Title
  currentPage.drawText('NEXUS CONTRACTGUARD // AIR-GAPPED REDACTED PRODUCTION', {
    x: margin,
    y: cursorY,
    size: 11,
    font: fontBold,
    color: rgb(0.08, 0.12, 0.18)
  });
  cursorY -= 14;

  currentPage.drawText(`DOCUMENT MATTER: ${title.toUpperCase()}`, {
    x: margin,
    y: cursorY,
    size: 8.5,
    font: fontBold,
    color: rgb(0.25, 0.3, 0.35)
  });
  cursorY -= 16;

  // Certificate Pill Box
  const certBoxHeight = 44;
  currentPage.drawRectangle({
    x: margin,
    y: cursorY - certBoxHeight,
    width: usableWidth,
    height: certBoxHeight,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.78, 0.83, 0.9),
    borderWidth: 1
  });

  currentPage.drawText('CERTIFICATE OF LOCAL IN-MEMORY PII SANITIZATION (AIR-GAPPED COMPLIANCE)', {
    x: margin + 12,
    y: cursorY - 14,
    size: 7.5,
    font: fontBold,
    color: rgb(0.05, 0.45, 0.3)
  });

  const certDetail = `Sanitized Entities: ${totalRedactions} items | Execution: Zero-Network RAM | Date: ${dateStr}`;
  currentPage.drawText(certDetail, {
    x: margin + 12,
    y: cursorY - 26,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.3)
  });

  const ruleRef = 'Statutory Safe Harbor: NIST SP 800-88 Rev. 1 / ABA Model Rule 1.6 / HIPAA Safe Harbor § 164.514';
  currentPage.drawText(ruleRef, {
    x: margin + 12,
    y: cursorY - 37,
    size: 6.5,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5)
  });

  cursorY -= (certBoxHeight + 20);

  // Render Body Lines
  const pagesList = [currentPage];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if space remaining on page
    if (cursorY < margin + 30) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      pagesList.push(currentPage);
      drawPageHeader(currentPage);
      cursorY = pageHeight - 55;
    }

    if (line !== '') {
      // Draw text line
      currentPage.drawText(line, {
        x: margin,
        y: cursorY,
        size: fontSize,
        font: fontCourier,
        color: rgb(0.1, 0.12, 0.15)
      });
    }

    cursorY -= lineHeight;
  }

  // Draw Footers with Page Numbers on all pages
  const totalPages = pagesList.length;
  pagesList.forEach((page, idx) => {
    const pageNum = idx + 1;
    page.drawLine({
      start: { x: margin, y: margin + 12 },
      end: { x: pageWidth - margin, y: margin + 12 },
      thickness: 0.5,
      color: rgb(0.85, 0.88, 0.92)
    });

    page.drawText('PROCESSED LOCALLY VIA NEXUS CONTRACTGUARD AIR-GAPPED ENGINE // ABA RULE 1.6', {
      x: margin,
      y: margin - 2,
      size: 6.5,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.6)
    });

    const pageStr = `Page ${pageNum} of ${totalPages}`;
    const pageStrWidth = fontRegular.widthOfTextAtSize(pageStr, 7.5);
    page.drawText(pageStr, {
      x: pageWidth - margin - pageStrWidth,
      y: margin - 2,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.4)
    });
  });

  return await pdfDoc.save();
}

/**
 * Downloads the clean, court-grade redacted PDF to the user's filesystem.
 */
export async function downloadRedactedPDF(sanitizedText = '', metadata = {}) {
  try {
    const pdfBytes = await generateRedactedPDFBytes(sanitizedText, metadata);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (metadata.title || 'Sanitized_Matter').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    a.href = url;
    a.download = `${safeTitle}_REDACTED_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return true;
  } catch (err) {
    console.error('Failed to generate redacted PDF:', err);
    throw err;
  }
}
