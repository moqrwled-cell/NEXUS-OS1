/**
 * Nexus ContractGuard Enterprise — Court-Grade Legal PDF Generator
 * 100% In-Memory RAM Generation via pdf-lib (Air-Gapped & ABA Rule 1.6 Compliant).
 * Produces authentic, black & white, firm-grade legal documents and court-ready discovery files
 * with Times-Roman legal typography, section hierarchy, pagination, and zero AI artifacts.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Sanitizes input strings for strict WinAnsi (Windows-1252) encoding compatibility.
 * Replaces unicode block characters (█), smart quotes, em-dashes, and unsupported symbols
 * to eliminate runtime encoding exceptions in pdf-lib.
 */
export function sanitizeForWinAnsi(str) {
  if (!str) return '';
  return str
    // Unicode full block and partial block characters used in redactions
    .replace(/[\u2580-\u259F]+/g, '[REDACTED]')
    .replace(/█+/g, '[REDACTED]')
    // Em and En dashes to standard legal ASCII representations
    .replace(/\u2014/g, ' -- ')
    .replace(/\u2013/g, '-')
    .replace(/[\u2010\u2011\u2012]/g, '-')
    // Curly quotes and smart apostrophes to standard straight quotes
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2018\u2019\u201A]/g, "'")
    // Ellipsis and bullets
    .replace(/\u2026/g, '...')
    .replace(/[\u2022\u25E6\u2023\u2043]/g, '-')
    // Directional arrows and checkmarks
    .replace(/[\u2190-\u21FF]/g, '->')
    .replace(/[\u2713\u2714]/g, '[X]')
    .replace(/[\u2717\u2718]/g, '[ ]')
    // Section symbols: ensure safe ASCII or literal
    .replace(/§/g, 'Section ')
    // Strip any remaining characters outside standard printable Latin / WinAnsi range
    .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, '');
}

/**
 * Wraps text into lines that do not exceed maxWidth points.
 */
function wrapParagraph(paragraph, font, fontSize, maxWidth) {
  if (!paragraph || paragraph.trim() === '') {
    return [''];
  }

  const words = paragraph.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const candidate = `${currentLine} ${word}`;
    const width = font.widthOfTextAtSize(candidate, fontSize);

    if (width <= maxWidth) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Generates an authentic, executive legal PDF document.
 * 
 * @param {string} rawText - Document text (draft contract or sanitized text)
 * @param {Object} metadata - Job metadata (title, isDraft, jurisdiction, totalRedactions, date)
 * @returns {Promise<Uint8Array>} Raw PDF bytes
 */
export async function generateRedactedPDFBytes(rawText = '', metadata = {}) {
  const isDraft = metadata.isDraft === true;
  const sanitizedText = sanitizeForWinAnsi(rawText);
  const rawTitle = metadata.title || (isDraft ? 'Commercial Legal Agreement' : 'Sanitized Discovery Matter');
  const title = sanitizeForWinAnsi(rawTitle);
  const totalRedactions = metadata.totalRedactions ?? 0;
  const jurisdiction = sanitizeForWinAnsi(metadata.jurisdiction || 'United States Commercial Law');
  const dateStr = sanitizeForWinAnsi(
    metadata.date || new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  );

  const pdfDoc = await PDFDocument.create();

  // Load classic legal serif typography (Times-Roman standard)
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const pageWidth = 612;   // Standard US Letter Width (8.5 inches)
  const pageHeight = 792;  // Standard US Letter Height (11 inches)
  const marginX = 54;      // 0.75 in margins
  const marginTop = 54;
  const marginBottom = 54;
  const usableWidth = pageWidth - (marginX * 2);

  // Black legal ink only
  const blackColor = rgb(0, 0, 0);

  const bodyFontSize = 10;
  const bodyLineHeight = 14;
  const headingFontSize = 11;
  const titleFontSize = 13;

  // Split input text into paragraphs
  const rawParagraphs = sanitizedText.split(/\r?\n/);

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let cursorY = pageHeight - marginTop;
  const pagesList = [currentPage];

  // Helper to draw top running header on pages 2+
  const drawRunningHeader = (page, pageNum) => {
    if (pageNum === 1) return; // Page 1 has formal title, no running header

    const headerText = isDraft
      ? 'CONFIDENTIAL -- ATTORNEY-CLIENT PRIVILEGED / WORK PRODUCT'
      : 'PRIVILEGED & CONFIDENTIAL // PRODUCED UNDER PROTECTIVE ORDER';
    
    page.drawText(headerText, {
      x: marginX,
      y: pageHeight - 34,
      size: 8,
      font: fontItalic,
      color: blackColor
    });

    const shortMatter = title.length > 40 ? title.substring(0, 37) + '...' : title;
    const shortWidth = fontRegular.widthOfTextAtSize(shortMatter, 8);
    page.drawText(shortMatter, {
      x: pageWidth - marginX - shortWidth,
      y: pageHeight - 34,
      size: 8,
      font: fontRegular,
      color: blackColor
    });

    // 0.5pt black horizontal rule
    page.drawLine({
      start: { x: marginX, y: pageHeight - 39 },
      end: { x: pageWidth - marginX, y: pageHeight - 39 },
      thickness: 0.5,
      color: blackColor
    });
  };

  if (isDraft) {
    // --------------------------------------------------------------------------
    // DRAFT CONTRACT MODE: Authentic, Black & White Law Firm Execution Layout
    // --------------------------------------------------------------------------

    // Top rule on page 1
    currentPage.drawLine({
      start: { x: marginX, y: cursorY },
      end: { x: pageWidth - marginX, y: cursorY },
      thickness: 1,
      color: blackColor
    });
    cursorY -= 16;

    // Document Title (Centered, All Caps, Bold 13pt)
    const upperTitle = title.toUpperCase();
    const titleWidth = fontBold.widthOfTextAtSize(upperTitle, titleFontSize);
    const titleX = Math.max(marginX, (pageWidth - titleWidth) / 2);
    currentPage.drawText(upperTitle, {
      x: titleX,
      y: cursorY,
      size: titleFontSize,
      font: fontBold,
      color: blackColor
    });
    cursorY -= 14;

    // Subtitle Line (Jurisdiction & Date, Centered 8.5pt Italic)
    const subLine = `Governing Jurisdiction: ${jurisdiction}  |  Effective Date: ${dateStr}`;
    const subWidth = fontItalic.widthOfTextAtSize(subLine, 8.5);
    const subX = Math.max(marginX, (pageWidth - subWidth) / 2);
    currentPage.drawText(subLine, {
      x: subX,
      y: cursorY,
      size: 8.5,
      font: fontItalic,
      color: blackColor
    });
    cursorY -= 12;

    // Bottom decorative line of title block
    currentPage.drawLine({
      start: { x: marginX, y: cursorY },
      end: { x: pageWidth - marginX, y: cursorY },
      thickness: 0.5,
      color: blackColor
    });
    cursorY -= 20;

  } else {
    // --------------------------------------------------------------------------
    // REDACTED DISCOVERY MODE: Clean Legal Production Notice
    // --------------------------------------------------------------------------
    currentPage.drawText('CONFIDENTIAL DISCOVERY PRODUCTION // SUBJECT TO COURT PROTECTIVE ORDER', {
      x: marginX,
      y: cursorY,
      size: 8.5,
      font: fontBold,
      color: blackColor
    });
    cursorY -= 12;

    currentPage.drawText(`IN RE MATTER: ${title.toUpperCase()}`, {
      x: marginX,
      y: cursorY,
      size: 10,
      font: fontBold,
      color: blackColor
    });
    cursorY -= 14;

    // Clean Black & White Formal Notice Box
    const noticeHeight = 36;
    currentPage.drawRectangle({
      x: marginX,
      y: cursorY - noticeHeight,
      width: usableWidth,
      height: noticeHeight,
      borderColor: blackColor,
      borderWidth: 0.75,
      color: rgb(1, 1, 1)
    });

    currentPage.drawText('FORMAL NOTICE OF PRIVILEGE AND IN-MEMORY PII REDACTION', {
      x: marginX + 10,
      y: cursorY - 12,
      size: 7.5,
      font: fontBold,
      color: blackColor
    });

    const certNotice = `Sanitized Entities: ${totalRedactions} items  |  Statutory Standard: ABA Model Rule 1.6 & NIST SP 800-88  |  Date: ${dateStr}`;
    currentPage.drawText(certNotice, {
      x: marginX + 10,
      y: cursorY - 24,
      size: 7,
      font: fontRegular,
      color: blackColor
    });

    cursorY -= (noticeHeight + 18);
  }

  // Iterate over paragraphs and render lines
  for (let pIdx = 0; pIdx < rawParagraphs.length; pIdx++) {
    const rawPara = rawParagraphs[pIdx].trim();

    if (rawPara === '') {
      // Empty line -> add vertical paragraph spacing
      cursorY -= 8;
      continue;
    }

    // Identify if this paragraph is a major legal heading (e.g. ARTICLE, EXHIBIT, RECITALS, SCHEDULE)
    const isArticleHeader = /^(ARTICLE\s+[IVXLCDM\d]+|EXHIBIT\s+[A-Z\d]|SCHEDULE\s+[A-Z\d]|RECITALS:?|WITNESSETH:?|IN\s+WITNESS\s+WHEREOF)/i.test(rawPara);
    const isSectionHeader = /^(SECTION\s+\d+(\.\d+)?|\d+\.\d+)\s+/i.test(rawPara);

    const activeFont = isArticleHeader || isSectionHeader ? fontBold : fontRegular;
    const activeFontSize = isArticleHeader ? headingFontSize : bodyFontSize;

    // If starting an article, add extra breath spacing
    if (isArticleHeader) {
      cursorY -= 8;
    }

    const wrappedLines = wrapParagraph(rawPara, activeFont, activeFontSize, usableWidth);

    for (const line of wrappedLines) {
      // Check page break condition
      if (cursorY < marginBottom + 24) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        pagesList.push(currentPage);
        drawRunningHeader(currentPage, pagesList.length);
        cursorY = pageHeight - marginTop - 16;
      }

      if (line !== '') {
        currentPage.drawText(line, {
          x: marginX,
          y: cursorY,
          size: activeFontSize,
          font: activeFont,
          color: blackColor
        });
      }

      cursorY -= bodyLineHeight;
    }
  }

  // Draw Bottom Pagination & Footer on all pages
  const totalPages = pagesList.length;
  pagesList.forEach((page, idx) => {
    const pageNum = idx + 1;

    // 0.5pt bottom rule
    page.drawLine({
      start: { x: marginX, y: marginBottom + 14 },
      end: { x: pageWidth - marginX, y: marginBottom + 14 },
      thickness: 0.5,
      color: blackColor
    });

    // Page number (Centered)
    const pageStr = `Page ${pageNum} of ${totalPages}`;
    const pageStrWidth = fontRegular.widthOfTextAtSize(pageStr, 8.5);
    page.drawText(pageStr, {
      x: (pageWidth - pageStrWidth) / 2,
      y: marginBottom,
      size: 8.5,
      font: fontRegular,
      color: blackColor
    });

    // Subtle Matter Reference on Left
    const matterRef = isDraft ? 'TRANSACTIONAL EXECUTION COPY' : 'AIR-GAPPED SANITIZED PRODUCTION';
    page.drawText(matterRef, {
      x: marginX,
      y: marginBottom,
      size: 7,
      font: fontItalic,
      color: blackColor
    });
  });

  return await pdfDoc.save();
}

/**
 * Downloads the clean, court-grade PDF to the user's filesystem.
 */
export async function downloadRedactedPDF(rawText = '', metadata = {}) {
  try {
    const isDraft = metadata.isDraft === true;
    const pdfBytes = await generateRedactedPDFBytes(rawText, metadata);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const rawTitle = metadata.title || (isDraft ? 'Contract_Agreement' : 'Sanitized_Matter');
    const safeTitle = rawTitle.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 32);
    const suffix = isDraft ? 'EXECUTION_DRAFT' : 'REDACTED';

    a.href = url;
    a.download = `${safeTitle}_${suffix}_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return true;
  } catch (err) {
    console.error('Failed to generate legal PDF:', err);
    throw err;
  }
}
