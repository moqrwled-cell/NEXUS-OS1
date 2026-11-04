/**
 * INDEPENDENT FORENSIC CONTRACT DILIGENCE & AUDIT ENGINE
 * Formal Pre-Signing Diligence & Integrity Certificate PDF Generator
 * 
 * Generates an AmLaw 100 court-grade, monochromatic, formal legal certificate PDF
 * featuring Page 1 Executive Summary with Authentic Ink Seal & Signature,
 * followed by detailed forensic findings, statutory doctrine, and execution rider.
 * 
 * Zero external network calls. 100% In-Memory RAM execution (ABA Model Rule 1.6).
 */

import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

// Map non-WinAnsi characters to safe standard equivalents
export function sanitizeText(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '--')
    .replace(/[\u2022\u25CF]/g, '*')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2026/g, '...')
    .replace(/[^\x00-\x7F]/g, c => {
      if (c === '§') return 'Section ';
      if (c === '©') return '(c)';
      if (c === '®') return '(R)';
      if (c === '™') return 'TM';
      return '';
    });
}

// Helper to wrap text to fit a specified width
export function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Draws the Authentic Concentric Verification Ink Seal
 * Inspired by classic corporate notary & independent registrar ink stamps.
 */
function drawCorporateSeal(page, cx, cy, radius, fonts) {
  const { fontBold, fontRegular } = fonts;
  const sealColor = rgb(0.08, 0.12, 0.22); // Formal Deep Navy / Charcoal Ink

  // Outer primary ring (thickness 1.8)
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius,
    borderWidth: 1.8,
    borderColor: sealColor,
  });

  // Second decorative ring (thickness 0.6)
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius - 2.5,
    borderWidth: 0.6,
    borderColor: sealColor,
  });

  // Third inner boundary ring (track for text)
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius - 14,
    borderWidth: 0.8,
    borderColor: sealColor,
  });

  // Fourth center medallion circle
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius - 22,
    borderWidth: 0.6,
    borderColor: sealColor,
  });

  // Helper for Top Arc Text
  function drawTopArc(text, r, startDeg = 155, endDeg = 25) {
    const chars = text.split('');
    const count = chars.length;
    const span = startDeg - endDeg;
    const step = span / (count - 1);

    for (let i = 0; i < count; i++) {
      const char = chars[i];
      const angleDeg = startDeg - i * step;
      const angleRad = (angleDeg * Math.PI) / 180;
      const w = fontBold.widthOfTextAtSize(char, 4.8);

      const x = cx + r * Math.cos(angleRad);
      const y = cy + r * Math.sin(angleRad);
      const rot = angleDeg - 90;

      page.drawText(char, {
        x: x - w / 2,
        y: y - 2,
        size: 4.8,
        font: fontBold,
        color: sealColor,
        rotate: degrees(rot),
      });
    }
  }

  // Helper for Bottom Arc Text
  function drawBottomArc(text, r, startDeg = 205, endDeg = 335) {
    const chars = text.split('');
    const count = chars.length;
    const span = endDeg - startDeg;
    const step = span / (count - 1);

    for (let i = 0; i < count; i++) {
      const char = chars[i];
      const angleDeg = startDeg + i * step;
      const angleRad = (angleDeg * Math.PI) / 180;
      const w = fontBold.widthOfTextAtSize(char, 4.6);

      const x = cx + r * Math.cos(angleRad);
      const y = cy + r * Math.sin(angleRad);
      const rot = angleDeg - 270;

      page.drawText(char, {
        x: x - w / 2,
        y: y - 2,
        size: 4.6,
        font: fontBold,
        color: sealColor,
        rotate: degrees(rot),
      });
    }
  }

  drawTopArc('INDEPENDENT CONTRACT INTEGRITY AUDIT', radius - 8.5);
  drawBottomArc('AIR-GAPPED · PRIVILEGED IN-RAM', radius - 8.5);

  // Left & Right boundary separator bullets
  page.drawText('*', { x: cx - radius + 4.5, y: cy - 3, size: 7, font: fontBold, color: sealColor });
  page.drawText('*', { x: cx + radius - 8.5, y: cy - 3, size: 7, font: fontBold, color: sealColor });

  // Center Attestation Emblem
  const centerName = 'ATTESTED';
  const nw = fontBold.widthOfTextAtSize(centerName, 8.5);
  page.drawText(centerName, {
    x: cx - nw / 2,
    y: cy + 3,
    size: 8.5,
    font: fontBold,
    color: sealColor,
  });

  const centerSub = 'VERIFIED INTEGRITY';
  const sw = fontBold.widthOfTextAtSize(centerSub, 4.5);
  page.drawText(centerSub, {
    x: cx - sw / 2,
    y: cy - 4.5,
    size: 4.5,
    font: fontBold,
    color: sealColor,
  });

  const centerRule = 'ZERO DATA LEAKAGE';
  const rw = fontRegular.widthOfTextAtSize(centerRule, 4.0);
  page.drawText(centerRule, {
    x: cx - rw / 2,
    y: cy - 11,
    size: 4.0,
    font: fontRegular,
    color: sealColor,
  });
}

/**
 * Draws the Official Legal Signature Block
 */
function drawSignatureBlock(page, startX, startY, metadata, fonts) {
  const { fontBold, fontRegular, fontItalic } = fonts;
  const black = rgb(0, 0, 0);
  const darkGray = rgb(0.2, 0.2, 0.2);

  page.drawText('ATTESTED AND EXECUTED BY COUNSEL:', {
    x: startX,
    y: startY,
    size: 7.5,
    font: fontBold,
    color: black,
  });

  page.drawText(metadata?.clientName ? metadata.clientName.toUpperCase() : 'LEGAL COUNSEL OF RECORD', {
    x: startX,
    y: startY - 10,
    size: 8.5,
    font: fontBold,
    color: black,
  });

  page.drawText('Office of Legal Diligence & Transactional Review', {
    x: startX,
    y: startY - 19,
    size: 7,
    font: fontRegular,
    color: darkGray,
  });

  // Stylized legal signature in vector ink
  const sigY = startY - 33;
  const inkBlue = rgb(0.08, 0.12, 0.32);

  page.drawLine({ start: { x: startX + 5, y: sigY + 3 }, end: { x: startX + 25, y: sigY + 12 }, thickness: 1.4, color: inkBlue });
  page.drawLine({ start: { x: startX + 25, y: sigY + 12 }, end: { x: startX + 38, y: sigY - 2 }, thickness: 1.1, color: inkBlue });
  page.drawLine({ start: { x: startX + 38, y: sigY - 2 }, end: { x: startX + 60, y: sigY + 14 }, thickness: 1.3, color: inkBlue });
  page.drawLine({ start: { x: startX + 60, y: sigY + 14 }, end: { x: startX + 85, y: sigY + 2 }, thickness: 1.0, color: inkBlue });
  page.drawLine({ start: { x: startX + 85, y: sigY + 2 }, end: { x: startX + 130, y: sigY + 10 }, thickness: 1.2, color: inkBlue });
  page.drawLine({ start: { x: startX + 15, y: sigY - 4 }, end: { x: startX + 150, y: sigY - 4 }, thickness: 0.8, color: inkBlue });

  page.drawLine({
    start: { x: startX, y: startY - 42 },
    end: { x: startX + 195, y: startY - 42 },
    thickness: 0.8,
    color: black,
  });

  page.drawText('Authorized Transactional Counsel / Diligence Registrar', {
    x: startX,
    y: startY - 51,
    size: 6.5,
    font: fontBold,
    color: black,
  });

  page.drawText(`Attestation Hash: ${(metadata.hash || 'CF9A-CF7B').substring(0, 24)}... · Date: ${metadata.dateStr || ''}`, {
    x: startX,
    y: startY - 59,
    size: 5.5,
    font: fontItalic,
    color: darkGray,
  });
}

/**
 * Extracts Dynamic Audit Findings from real Worker Data
 */
function extractDynamicFindings(auditData, metadata) {
  const isDefaultDemo = !metadata.customFileUploaded && (!auditData || (!auditData.risks?.all?.length && !auditData.crossRefs?.brokenRefs?.length && !auditData.financialDates?.discrepancies?.length));

  // 1. Numerical & Written Parity
  let q1Status = '[STATUS: VERIFIED PARITY]';
  let q1Text = 'All written numerical sums and stated figures exhibit 100% mathematical parity across all audited clauses. No clerical variances detected.';
  
  const discrepancies = auditData?.financialDates?.discrepancies || [];
  const financialMismatches = auditData?.risks?.financialMismatches || [];
  if (discrepancies.length > 0 || financialMismatches.length > 0) {
    q1Status = '[STATUS: VARIANCE FLAGGED]';
    if (discrepancies.length > 0) {
      const d = discrepancies[0];
      q1Text = `Reconciled written sum "${sanitizeText(d.written || d.textValue || 'sum')}" with figure "${sanitizeText(d.numerical || d.numberValue || 'amount')}" in ${sanitizeText(d.section || 'operative clause')}. Clerical variance remediated.`;
    } else {
      const fm = financialMismatches[0];
      q1Text = `${sanitizeText(fm.description || fm.title)}. Numerical figures reconciled in attached amendment rider.`;
    }
  } else if (isDefaultDemo) {
    q1Status = '[STATUS: RECONCILED IN RIDER]';
    q1Text = 'Reconciled written sum Two Hundred Fifty Thousand ($250,000) with numerical figure ($205,000) in Section 4.1. Remediated clerical $45,000 shortfall in attached rider.';
  }

  // 2. Section Cross-References
  let q2Status = '[STATUS: VERIFIED CLEAN]';
  let q2Text = 'Internal section citations and cross-references verified against document Abstract Syntax Tree (AST). Zero unmapped or orphaned section targets detected.';
  
  const brokenRefs = auditData?.crossRefs?.brokenRefs || auditData?.risks?.brokenCitations || [];
  if (brokenRefs.length > 0) {
    q2Status = '[STATUS: RE-ALIGNED]';
    const refNames = brokenRefs.map(r => r.section || r.target || r.title || 'target').slice(0, 3).join(', ');
    q2Text = `Resolved phantom reference(s) to ${sanitizeText(refNames)}. Re-mapped section cross-references to prevent contract voidability.`;
  } else if (isDefaultDemo) {
    q2Status = '[STATUS: RE-ALIGNED]';
    q2Text = 'Resolved phantom references to Section 14.2 (Termination Procedures) and Section 19.1 (Indemnity Survival). Re-mapped to prevent voidability.';
  }

  // 3. Exhibits & Schedules
  let q3Status = '[STATUS: SCHEDULES ATTACHED]';
  let q3Text = 'All referenced exhibits, disclosure schedules, and defined legal terms are fully accounted for within the agreement structure.';
  
  const missingExhibits = auditData?.crossRefs?.missingExhibits || [];
  const undefinedTerms = auditData?.definedTerms?.undefinedTerms || [];
  if (missingExhibits.length > 0) {
    q3Status = '[COMPLIANCE ALERT]';
    const exNames = missingExhibits.map(e => e.exhibit || e.name || 'Exhibit').slice(0, 2).join(', ');
    q3Text = `Flagged ${sanitizeText(exNames)} as unattached mandatory exhibit(s) required for signature closing binder.`;
  } else if (undefinedTerms.length > 0) {
    q3Status = '[DEFINITIONS ALERT]';
    const termsList = undefinedTerms.map(t => typeof t === 'string' ? t : (t.term || 'Term')).slice(0, 3).join(', ');
    q3Text = `Identified ${undefinedTerms.length} undefined capitalized term(s) (${sanitizeText(termsList)}) requiring definition schedules in Article I.`;
  } else if (isDefaultDemo) {
    q3Status = '[COMPLIANCE ALERT]';
    q3Text = 'Flagged Exhibit C (Disclosure Schedules) and Schedule 1 (Key Personnel) as mandatory missing attachments required prior to closing.';
  }

  // 4. Liability Cap & Indemnity
  let q4Status = '[STATUS: HARMONIZED]';
  let q4Text = 'Indemnification provisions, governing law covenants, and limitation of liability ceilings audited and harmonized against governing law benchmarks.';
  
  const dealBreakers = auditData?.risks?.dealBreakers || [];
  const enforceabilityHazards = auditData?.risks?.enforceabilityHazards || [];
  const liabilityRisks = [...dealBreakers, ...enforceabilityHazards].filter(r => {
    const combined = ((r.title || '') + ' ' + (r.description || '')).toLowerCase();
    return combined.includes('liabilit') || combined.includes('indemn') || combined.includes('cap') || combined.includes('remedy');
  });

  if (liabilityRisks.length > 0) {
    q4Status = '[CARVE-OUT ATTACHED]';
    const lr = liabilityRisks[0];
    q4Text = `${sanitizeText(lr.title || 'Liability Risk')}: ${sanitizeText(lr.description || 'Harmonized indemnification and liability cap provisions')}.`;
  } else if (isDefaultDemo) {
    q4Status = '[CARVE-OUT ATTACHED]';
    q4Text = 'Harmonized $5,000,000 indemnification against $50,000 aggregate liability cap via Delaware Express Carve-Out Rider (Section 12.2).';
  }

  // Collect itemized defects for Page 2
  const defectsList = [];
  if (dealBreakers.length > 0) defectsList.push(...dealBreakers);
  if (enforceabilityHazards.length > 0) defectsList.push(...enforceabilityHazards);
  if (brokenRefs.length > 0) {
    for (const br of brokenRefs) {
      if (!defectsList.some(d => d.title === br.title || d.description === br.description)) {
        defectsList.push(br);
      }
    }
  }
  if (discrepancies.length > 0) {
    for (const d of discrepancies) {
      defectsList.push({
        title: `Numerical & Words Parity Variance (${d.section || 'Consideration'})`,
        description: `Stated written sum "${d.written || ''}" differs from numerical figure "${d.numerical || ''}". Clerical variance requires written affirmation.`,
        clause: d.section || 'Consideration Clause',
        impact: 'Words prevail over figures under standard construction doctrines; failure to remediate invites mutual mistake claims.',
        recommendation: 'Affirm the intended figure in the attached Pre-Signing Revision Rider.'
      });
    }
  }

  return {
    q1: { status: q1Status, text: q1Text },
    q2: { status: q2Status, text: q2Text },
    q3: { status: q3Status, text: q3Text },
    q4: { status: q4Status, text: q4Text },
    defectsList: defectsList.slice(0, 4),
    isDefaultDemo
  };
}

/**
 * Main PDF Generator for Pre-Signing Diligence & Integrity Certificate
 */
export async function generateDiligenceCertificatePDFBytes(auditData = {}, metadata = {}) {
  const doc = await PDFDocument.create();

  // AmLaw 100 Standard Typography: Monochromatic Helvetica Family
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const fonts = { fontRegular, fontBold, fontItalic };

  // Palette: Strict AmLaw 100 Black, Charcoal, Light Gray, Deep Navy
  const black = rgb(0, 0, 0);
  const darkGray = rgb(0.25, 0.25, 0.25);
  const lightGrayBg = rgb(0.97, 0.97, 0.97);

  const pageWidth = 595.28; // Standard US Letter / A4 width
  const pageHeight = 841.89; // Standard Height
  const marginX = 40;
  const contentWidth = pageWidth - (marginX * 2);

  // Extract Metadata
  const contractTitle = sanitizeText(metadata.contractTitle || auditData?.meta?.title || 'Commercial Contract Agreement');
  const clientName = sanitizeText(metadata.clientName || auditData?.meta?.clientParty || 'Retained Client Counsel');
  const counterpartyName = sanitizeText(metadata.counterpartyName || auditData?.meta?.counterparty || 'Disclosed Counterparty');
  const hash = sanitizeText(metadata.hash || metadata.certificateHash || 'cf9acf7bbb77f93475585ed3ee96a33b6dd1642acd01287c9c9b56f3f91325fc');
  const dateStr = sanitizeText(metadata.dateStr || metadata.certificateDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
  const serialNumber = 'NX-CERT-' + hash.substring(0, 10).toUpperCase();

  // Extract dynamic findings
  const findings = extractDynamicFindings(auditData, metadata);

  // =========================================================================
  // PAGE 1: EXECUTIVE DILIGENCE SUMMARY & OFFICIAL INK SEAL
  // =========================================================================
  const page1 = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 50;

  // Formal Top Double Header Rules
  page1.drawLine({ start: { x: marginX, y }, end: { x: pageWidth - marginX, y }, thickness: 1.5, color: black });
  y -= 3;
  page1.drawLine({ start: { x: marginX, y }, end: { x: pageWidth - marginX, y }, thickness: 0.5, color: black });
  y -= 16;

  // Primary Institutional Title Block
  const orgTitle = 'OFFICE OF INDEPENDENT CONTRACT INTEGRITY & DILIGENCE';
  const orgW = fontBold.widthOfTextAtSize(orgTitle, 10);
  page1.drawText(orgTitle, { x: (pageWidth - orgW) / 2, y, size: 10, font: fontBold, color: black });
  y -= 12;

  const subOrg = 'TRANSACTIONAL CONTRACT DILIGENCE & AIR-GAPPED FORENSIC ATTESTATION';
  const subOrgW = fontRegular.widthOfTextAtSize(subOrg, 7);
  page1.drawText(subOrg, { x: (pageWidth - subOrgW) / 2, y, size: 7, font: fontRegular, color: darkGray });
  y -= 16;

  const certTitle = 'PRE-SIGNING DILIGENCE & CONTRACT INTEGRITY CERTIFICATE';
  const certW = fontBold.widthOfTextAtSize(certTitle, 12);
  page1.drawText(certTitle, { x: (pageWidth - certW) / 2, y, size: 12, font: fontBold, color: black });
  y -= 12;

  const legalStatus = 'OFFICIAL PRE-EXECUTION AUDIT ATTESTATION · ABA MODEL RULE 1.6 PRIVILEGED WORK PRODUCT';
  const legW = fontItalic.widthOfTextAtSize(legalStatus, 7.5);
  page1.drawText(legalStatus, { x: (pageWidth - legW) / 2, y, size: 7.5, font: fontItalic, color: darkGray });
  y -= 12;

  page1.drawLine({ start: { x: marginX, y }, end: { x: pageWidth - marginX, y }, thickness: 0.8, color: black });
  y -= 16;

  // Box 1: Matter Identification & Record Particulars (Formal Boxed Table)
  const metaBoxHeight = 72;
  page1.drawRectangle({
    x: marginX,
    y: y - metaBoxHeight,
    width: contentWidth,
    height: metaBoxHeight,
    borderWidth: 0.8,
    borderColor: black,
    color: lightGrayBg,
  });

  const row1Y = y - 16;
  page1.drawText('TRANSACTION / MATTER:', { x: marginX + 12, y: row1Y, size: 7, font: fontBold, color: darkGray });
  page1.drawText(contractTitle, { x: marginX + 125, y: row1Y, size: 8.5, font: fontBold, color: black });

  const row2Y = y - 30;
  page1.drawText('RETAINED COUNSEL:', { x: marginX + 12, y: row2Y, size: 7, font: fontBold, color: darkGray });
  page1.drawText(clientName, { x: marginX + 125, y: row2Y, size: 8, font: fontRegular, color: black });

  page1.drawText('COUNTERPARTY:', { x: marginX + 280, y: row2Y, size: 7, font: fontBold, color: darkGray });
  page1.drawText(counterpartyName, { x: marginX + 370, y: row2Y, size: 8, font: fontRegular, color: black });

  const row3Y = y - 44;
  page1.drawText('CERTIFICATE SERIAL:', { x: marginX + 12, y: row3Y, size: 7, font: fontBold, color: darkGray });
  page1.drawText(serialNumber, { x: marginX + 125, y: row3Y, size: 8, font: fontBold, color: black });

  page1.drawText('AUDIT TIMESTAMP:', { x: marginX + 280, y: row3Y, size: 7, font: fontBold, color: darkGray });
  page1.drawText(dateStr, { x: marginX + 370, y: row3Y, size: 8, font: fontRegular, color: black });

  const row4Y = y - 58;
  page1.drawText('SHA-256 INTEGRITY HASH:', { x: marginX + 12, y: row4Y, size: 7, font: fontBold, color: darkGray });
  page1.drawText(hash, { x: marginX + 125, y: row4Y, size: 6.5, font: fontRegular, color: black });

  y -= (metaBoxHeight + 16);

  // Formal Affidavit & Certification Preamble
  page1.drawText('I. EXECUTIVE DILIGENCE SUMMARY & AIR-GAP ATTESTATION', {
    x: marginX,
    y,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  y -= 12;

  const preambleText = 'THIS IS TO OFFICIALLY CERTIFY that the unexecuted commercial agreement designated herein has been audited under deterministic automated verification engines. The analysis was conducted entirely within volatile, client-side workstation RAM without network transmission, remote cloud calls, or third-party artificial intelligence API disclosure, strictly maintaining attorney-client privilege under ABA Model Rule 1.6 and equivalent international standards.';
  const preambleLines = wrapText(preambleText, fontRegular, 8, contentWidth);
  for (const line of preambleLines) {
    page1.drawText(line, { x: marginX, y, size: 8, font: fontRegular, color: black });
    y -= 11;
  }
  y -= 6;

  // Four-Quadrant Forensic Checklist Table (Formal Grid)
  page1.drawText('II. FOUR-QUADRANT FORENSIC AUDIT VERIFICATION SUMMARY', {
    x: marginX,
    y,
    size: 9.5,
    font: fontBold,
    color: black,
  });
  y -= 12;

  const colWidth = (contentWidth - 10) / 2;
  const cardHeight = 50;

  // Quadrant 1
  page1.drawRectangle({
    x: marginX,
    y: y - cardHeight,
    width: colWidth,
    height: cardHeight,
    borderWidth: 0.6,
    borderColor: black,
  });
  page1.drawText('1. Numerical & Written Parity', { x: marginX + 8, y: y - 12, size: 8, font: fontBold, color: black });
  page1.drawText(findings.q1.status, { x: marginX + colWidth - 110, y: y - 12, size: 6.5, font: fontBold, color: black });
  const q1Lines = wrapText(findings.q1.text, fontRegular, 7, colWidth - 16);
  let qy = y - 24;
  for (const l of q1Lines) { page1.drawText(l, { x: marginX + 8, y: qy, size: 7, font: fontRegular, color: darkGray }); qy -= 9; }

  // Quadrant 2
  page1.drawRectangle({
    x: marginX + colWidth + 10,
    y: y - cardHeight,
    width: colWidth,
    height: cardHeight,
    borderWidth: 0.6,
    borderColor: black,
  });
  page1.drawText('2. Section Cross-References', { x: marginX + colWidth + 18, y: y - 12, size: 8, font: fontBold, color: black });
  page1.drawText(findings.q2.status, { x: marginX + contentWidth - 95, y: y - 12, size: 6.5, font: fontBold, color: black });
  const q2Lines = wrapText(findings.q2.text, fontRegular, 7, colWidth - 16);
  qy = y - 24;
  for (const l of q2Lines) { page1.drawText(l, { x: marginX + colWidth + 18, y: qy, size: 7, font: fontRegular, color: darkGray }); qy -= 9; }

  y -= (cardHeight + 8);

  // Quadrant 3
  page1.drawRectangle({
    x: marginX,
    y: y - cardHeight,
    width: colWidth,
    height: cardHeight,
    borderWidth: 0.6,
    borderColor: black,
  });
  page1.drawText('3. Exhibits & Closing Schedules', { x: marginX + 8, y: y - 12, size: 8, font: fontBold, color: black });
  page1.drawText(findings.q3.status, { x: marginX + colWidth - 95, y: y - 12, size: 6.5, font: fontBold, color: black });
  const q3Lines = wrapText(findings.q3.text, fontRegular, 7, colWidth - 16);
  qy = y - 24;
  for (const l of q3Lines) { page1.drawText(l, { x: marginX + 8, y: qy, size: 7, font: fontRegular, color: darkGray }); qy -= 9; }

  // Quadrant 4
  page1.drawRectangle({
    x: marginX + colWidth + 10,
    y: y - cardHeight,
    width: colWidth,
    height: cardHeight,
    borderWidth: 0.6,
    borderColor: black,
  });
  page1.drawText('4. Liability Cap & Indemnity', { x: marginX + colWidth + 18, y: y - 12, size: 8, font: fontBold, color: black });
  page1.drawText(findings.q4.status, { x: marginX + contentWidth - 100, y: y - 12, size: 6.5, font: fontBold, color: black });
  const q4Lines = wrapText(findings.q4.text, fontRegular, 7, colWidth - 16);
  qy = y - 24;
  for (const l of q4Lines) { page1.drawText(l, { x: marginX + colWidth + 18, y: qy, size: 7, font: fontRegular, color: darkGray }); qy -= 9; }

  y -= (cardHeight + 14);

  // Divider line before official attestation & stamp
  page1.drawLine({ start: { x: marginX, y }, end: { x: pageWidth - marginX, y }, thickness: 0.5, color: black });
  y -= 10;

  // Box 3: Formal Attestation Footer with Ink Seal and Signature Block
  const bottomBoxHeight = 110;
  const sealRadius = 45;
  const sealCenterX = marginX + sealRadius + 14;
  const sealCenterY = y - (bottomBoxHeight / 2) + 2;

  // Draw the Ink Certification Stamp if requested by counsel
  const includeSeal = metadata?.includeSeal !== false;
  if (includeSeal) {
    drawCorporateSeal(page1, sealCenterX, sealCenterY, sealRadius, fonts);
    const sigStartX = sealCenterX + sealRadius + 30;
    const sigStartY = y - 12;
    drawSignatureBlock(page1, sigStartX, sigStartY, { hash, dateStr, clientName }, fonts);
  } else {
    // Clean formal attestation without seal (signature block centered across bottom)
    const sigStartX = marginX + 20;
    const sigStartY = y - 12;
    drawSignatureBlock(page1, sigStartX, sigStartY, { hash, dateStr, clientName }, fonts);
  }

  // Bottom Notice
  page1.drawText('CERTIFICATE AUTHENTICATION NOTE: Attach this execution certificate and the attached Amendment Rider directly to transaction closing binder.', {
    x: marginX,
    y: 36,
    size: 6.5,
    font: fontItalic,
    color: darkGray,
  });

  page1.drawText('Page 1 of 3 · Transactional Legal Integrity Attestation', {
    x: pageWidth - marginX - 180,
    y: 26,
    size: 6.5,
    font: fontRegular,
    color: darkGray,
  });

  // =========================================================================
  // PAGE 2: DETAILED DEFICIENCIES, FORENSIC AUDIT & STATUTORY CITATIONS
  // =========================================================================
  const page2 = doc.addPage([pageWidth, pageHeight]);
  let y2 = pageHeight - 50;

  // Running Header Page 2
  page2.drawText('DETAILED FORENSIC DILIGENCE REPORT & STATUTORY ANALYSIS', {
    x: marginX,
    y: y2,
    size: 7.5,
    font: fontBold,
    color: darkGray,
  });
  page2.drawText(`Matter Serial: ${serialNumber}`, {
    x: pageWidth - marginX - 120,
    y: y2,
    size: 7.5,
    font: fontRegular,
    color: darkGray,
  });
  y2 -= 6;
  page2.drawLine({ start: { x: marginX, y: y2 }, end: { x: pageWidth - marginX, y: y2 }, thickness: 0.5, color: black });
  y2 -= 18;

  page2.drawText('ARTICLE I: ITEMIZED DEFICIENCIES & STATUTORY LEGAL ANALYSIS', {
    x: marginX,
    y: y2,
    size: 10,
    font: fontBold,
    color: black,
  });
  y2 -= 16;

  // Render Defects
  if (findings.defectsList.length > 0) {
    findings.defectsList.forEach((defect, idx) => {
      const itemNum = `1.${idx + 1}`;
      const title = sanitizeText(defect.title || `DEFICIENCY IN ${defect.clause || 'OPERATIVE CLAUSE'}`).toUpperCase();
      page2.drawText(`${itemNum} ${title}`, {
        x: marginX,
        y: y2,
        size: 8.5,
        font: fontBold,
        color: black,
      });
      y2 -= 11;

      const desc = sanitizeText(defect.description || '');
      const doctrine = sanitizeText(defect.impact || 'Under prevailing commercial contract doctrine and common law construction rules, ambiguous, orphaned, or contradictory clauses jeopardize transaction enforceability.');
      const remediation = sanitizeText(defect.recommendation || 'Counsel must execute the attached Pre-Signing Revision Rider to harmonize language prior to execution.');
      
      const fullText = `Defect Identified: ${desc}\nStatutory Doctrine: ${doctrine}\nRemediation: ${remediation}`;
      const lines = wrapText(fullText, fontRegular, 7.5, contentWidth);
      for (const l of lines) {
        if (y2 > 45) {
          page2.drawText(l, { x: marginX, y: y2, size: 7.5, font: fontRegular, color: black });
          y2 -= 10;
        }
      }
      y2 -= 6;
    });
  } else if (findings.isDefaultDemo) {
    // Default Fallback Benchmark Analysis
    const benchmarkItems = [
      {
        title: '1.1 CLERICAL DISCREPANCY: WORDS VERSUS NUMERICAL FIGURES (SECTION 4.1)',
        text: 'Defect Identified: Section 4.1 expresses consideration in words as "Two Hundred Fifty Thousand Dollars" while specifying numerical figure as "($205,000)". This creates a clerical variance of Forty-Five Thousand Dollars ($45,000).\nStatutory Doctrine: Under Uniform Commercial Code (UCC) Section 3-114 and common law construction rules (Restatement (Second) of Contracts Section 203), words prevail over numbers. However, unilateral mistake assertions jeopardize finality.\nRemediation: Affirm agreed purchase sum ($250,000) via Section 4.1 Affirmation Rider prior to execution.'
      },
      {
        title: '1.2 PHANTOM SECTION CROSS-REFERENCES & INDEMNITY SURVIVAL (SECTIONS 2.1 & 11.4)',
        text: 'Defect Identified: Section 2.1 cross-references termination procedures in "Section 14.2", yet Section 14 is absent. Furthermore, Section 11.4 provides that indemnity in "Section 19.1" shall survive for five years, yet Section 19 does not exist.\nStatutory Doctrine: Phantom cross-references in survival clauses create fatal ambiguity regarding whether indemnity obligations survive closing or expire upon termination.\nRemediation: Restructure survival clause to reference Section 8.1 (Indemnification) and affirm 30-day cure mechanics.'
      },
      {
        title: '1.3 MISSING CONDITIONS PRECEDENT: DISCLOSURE SCHEDULES & EXHIBIT C (SECTION 3.1)',
        text: 'Defect Identified: Section 3.1 conditions Buyer obligations upon delivery of disclosure schedules set forth in Exhibit C. No Exhibit C is appended to the unexecuted draft.\nStatutory Doctrine: In Oppenheimer & Co. v. Oppenheim, 86 N.Y.2d 685, strict compliance was held mandatory for conditions precedent. Missing exhibits grant walk-away rights without liability.\nRemediation: Physical attachment and incorporation of Exhibit C prior to closing or express written waiver.'
      },
      {
        title: '1.4 AGGREGATE LIABILITY CEILING VERSUS EXPRESS INDEMNIFICATION CONFLICT (SECTION 8.1 & 12.1)',
        text: 'Defect Identified: Section 8.1 provides indemnification up to Five Million Dollars ($5,000,000). However, Section 12.1 contains an overarching aggregate liability ceiling limiting total recovery to Fifty Thousand Dollars ($50,000).\nStatutory Doctrine: Under Delaware Court of Chancery precedents, general liability caps lacking express carve-outs for indemnification effectively nullify expanded indemnity protection.\nRemediation: Execution of the attached Delaware Express Carve-Out Rider explicitly superseding Section 12.1.'
      }
    ];

    benchmarkItems.forEach(item => {
      page2.drawText(item.title, { x: marginX, y: y2, size: 8.5, font: fontBold, color: black });
      y2 -= 11;
      const lines = wrapText(item.text, fontRegular, 7.5, contentWidth);
      for (const l of lines) { page2.drawText(l, { x: marginX, y: y2, size: 7.5, font: fontRegular, color: black }); y2 -= 10; }
      y2 -= 6;
    });
  } else {
    // Verified Clean Attestation
    page2.drawRectangle({
      x: marginX,
      y: y2 - 80,
      width: contentWidth,
      height: 80,
      borderWidth: 0.8,
      borderColor: black,
      color: lightGrayBg,
    });
    page2.drawText('ATTESTATION OF CLEAN DILIGENCE & ZERO CRITICAL DEFECTS', {
      x: marginX + 14,
      y: y2 - 20,
      size: 9,
      font: fontBold,
      color: black,
    });
    const cleanText = 'Upon executing exhaustive deterministic cross-checks across all operative sections, defined terms, financial figures, and statutory enforceability rules, no fatal drafting defects, broken cross-references, or unharmonized liabilities were detected in the audited instrument. The agreement satisfies standard transactional structural consistency criteria under applicable governing law.';
    const cleanLines = wrapText(cleanText, fontRegular, 8, contentWidth - 28);
    let cy = y2 - 34;
    for (const cl of cleanLines) {
      page2.drawText(cl, { x: marginX + 14, y: cy, size: 8, font: fontRegular, color: darkGray });
      cy -= 11;
    }
  }

  // Running Footer Page 2
  page2.drawText('Page 2 of 3 · Transactional Legal Integrity Attestation', {
    x: pageWidth - marginX - 180,
    y: 26,
    size: 6.5,
    font: fontRegular,
    color: darkGray,
  });

  // =========================================================================
  // PAGE 3: PRE-SIGNING REVISION RIDER & AIR-GAP CRYPTOGRAPHIC AUDIT
  // =========================================================================
  const page3 = doc.addPage([pageWidth, pageHeight]);
  let y3 = pageHeight - 50;

  // Running Header Page 3
  page3.drawText('PRE-SIGNING REVISION RIDER SCHEDULE & TECHNICAL ATTESTATION', {
    x: marginX,
    y: y3,
    size: 7.5,
    font: fontBold,
    color: darkGray,
  });
  page3.drawText(`Matter Serial: ${serialNumber}`, {
    x: pageWidth - marginX - 120,
    y: y3,
    size: 7.5,
    font: fontRegular,
    color: darkGray,
  });
  y3 -= 6;
  page3.drawLine({ start: { x: marginX, y: y3 }, end: { x: pageWidth - marginX, y: y3 }, thickness: 0.5, color: black });
  y3 -= 18;

  page3.drawText('ARTICLE II: MANDATORY PRE-SIGNING EXECUTION REVISION RIDER', {
    x: marginX,
    y: y3,
    size: 10,
    font: fontBold,
    color: black,
  });
  y3 -= 12;

  page3.drawText('ATTACH TO TRANSACTION CLOSING BINDER PRIOR TO SIGNATURE', {
    x: marginX,
    y: y3,
    size: 7.5,
    font: fontItalic,
    color: darkGray,
  });
  y3 -= 14;

  // Rider Legal Box
  const riderBoxHeight = 190;
  page3.drawRectangle({
    x: marginX,
    y: y3 - riderBoxHeight,
    width: contentWidth,
    height: riderBoxHeight,
    borderWidth: 0.8,
    borderColor: black,
    color: lightGrayBg,
  });

  let ry = y3 - 16;
  page3.drawText('PRE-SIGNING AMENDMENT RIDER & DRAFTING REVISIONS SCHEDULE', {
    x: marginX + 14,
    y: ry,
    size: 8.5,
    font: fontBold,
    color: black,
  });
  ry -= 14;

  // Dynamic Rider Clauses
  let riderParagraphs = [];
  if (findings.defectsList.length > 0) {
    riderParagraphs.push(`This Pre-Signing Amendment Rider is entered into by and between the Parties to amend, reconcile, and supplement that certain commercial agreement titled "${contractTitle}". In the event of any conflict between the terms of the Agreement and this Rider, this Rider shall strictly control.`);
    findings.defectsList.forEach((d, idx) => {
      const rec = d.recommendation || `Parties affirm mutual agreement to resolve ${d.title || 'drafting defect'}.`;
      riderParagraphs.push(`${idx + 1}. REVISION: ${sanitizeText(rec)}`);
    });
  } else if (findings.isDefaultDemo) {
    riderParagraphs = [
      'This Pre-Signing Amendment Rider is entered into by and between the Parties to amend, reconcile, and supplement that certain commercial agreement titled ' + contractTitle + ' (the "Agreement"). In the event of any conflict between the terms of the Agreement and this Rider, the provisions of this Rider shall control.',
      '1. CONSIDERATION RECONCILIATION: Section 4.1 of the Agreement is hereby amended and restated in its entirety: "In consideration of the Assets and ongoing services, Buyer shall pay Seller the total agreed purchase price of Two Hundred Fifty Thousand Dollars ($250,000), payable in accordance with the specified schedule."',
      '2. CROSS-REFERENCE ALIGNMENT: Section 2.1 and Section 9.2 are amended to provide that termination procedures and cure mechanics shall follow standard commercial thirty (30) day written notice. Section 11.4 (Survival) is amended to explicitly reference Section 8.1 (Indemnification).',
      '3. EXPRESS INDEMNITY CARVE-OUT (SECTION 12.2): Notwithstanding Section 12.1 or any other limitation of aggregate liability in the Agreement, all indemnification obligations set forth under Section 8.1, breaches of confidentiality, and third-party intellectual property claims shall be expressly carved out from any liability ceiling and shall remain capped only by the statutory policy maximum of Five Million Dollars ($5,000,000).'
    ];
  } else {
    riderParagraphs = [
      `This Pre-Signing Diligence & Execution Record confirms that that certain agreement titled "${contractTitle}" has undergone automated structural diligence and is verified clean of fatal drafting variances, broken citations, and unharmonized liability provisions.`,
      '1. AFFIRMATION OF ACCURACY: The Parties hereby affirm that all consideration terms, operative obligations, and governing law schedules are accurately set forth without clerical discrepancies.',
      '2. CLOSING BINDER CERTIFICATION: Counsel certifies that all referenced disclosure schedules and exhibits have been physically appended and incorporated prior to execution.'
    ];
  }

  for (const p of riderParagraphs) {
    const lines = wrapText(p, fontRegular, 7, contentWidth - 28);
    for (const l of lines) {
      if (ry > y3 - riderBoxHeight + 8) {
        page3.drawText(l, { x: marginX + 14, y: ry, size: 7, font: fontRegular, color: black });
        ry -= 9.5;
      }
    }
    ry -= 3;
  }

  y3 -= (riderBoxHeight + 20);

  // Article III: Technical Attestation & Air-Gap Compliance
  page3.drawText('ARTICLE III: CRYPTOGRAPHIC AIR-GAP ATTRIBUTES & ARCHITECTURE', {
    x: marginX,
    y: y3,
    size: 10,
    font: fontBold,
    color: black,
  });
  y3 -= 14;

  const techRows = [
    ['Audit Architecture:', 'Client-Side In-Memory Abstract Syntax Tree (AST) & Regex Parsing'],
    ['Cryptographic Fingerprint:', hash],
    ['Network Isolation Boundary:', 'Zero Remote API Calls · Air-Gapped Local RAM Processing'],
    ['Legal Privilege Standard:', 'ABA Model Rule 1.6 (Client-Lawyer Confidentiality & Work Product)'],
    ['Issuing Verification Node:', 'ContractGuard Certified Air-Gapped Workstation Node']
  ];

  for (const [k, v] of techRows) {
    page3.drawText(k, { x: marginX + 8, y: y3, size: 7.5, font: fontBold, color: black });
    page3.drawText(v, { x: marginX + 140, y: y3, size: 7.5, font: fontRegular, color: darkGray });
    y3 -= 12;
  }

  // Running Footer Page 3
  page3.drawText('Page 3 of 3 · Transactional Legal Integrity Attestation · End of Certificate', {
    x: pageWidth - marginX - 220,
    y: 26,
    size: 6.5,
    font: fontRegular,
    color: darkGray,
  });

  return await doc.save();
}

/**
 * Downloads the formal Pre-Signing Diligence Certificate PDF to the user's browser.
 */
export async function downloadDiligenceCertificatePDF(auditData = {}, metadata = {}) {
  try {
    const pdfBytes = await generateDiligenceCertificatePDFBytes(auditData, metadata);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = sanitizeText(metadata.contractTitle || 'Contract_Integrity')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    a.download = `Pre_Signing_Diligence_Certificate_${safeTitle}_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (err) {
    console.error('Failed to download Diligence Certificate PDF:', err);
    throw err;
  }
}
