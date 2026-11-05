/**
 * Nexus ContractGuard Enterprise — Formal Tax Invoice PDF Generator
 * 
 * Generates an executive, AmLaw 100 / Delaware corporate tax invoice PDF.
 * 100% In-Memory RAM Generation via pdf-lib (Air-Gapped & ABA Rule 1.6 Compliant).
 * 
 * Zero remote API calls, zero server telemetry, instant client-side download.
 */

import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

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

function drawCorporateSeal(page, cx, cy, radius, fonts) {
  const { fontBold, fontRegular } = fonts;
  const sealColor = rgb(0.08, 0.12, 0.22);

  // Outer primary ring
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius,
    borderWidth: 1.5,
    borderColor: sealColor,
  });

  // Second decorative ring
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius - 2,
    borderWidth: 0.6,
    borderColor: sealColor,
  });

  // Inner track
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius - 11,
    borderWidth: 0.7,
    borderColor: sealColor,
  });

  // Top Arc text
  function drawTopArc(text, r, startDeg = 155, endDeg = 25) {
    const chars = text.split('');
    const count = chars.length;
    const span = startDeg - endDeg;
    const step = span / (count - 1);

    for (let i = 0; i < count; i++) {
      const char = chars[i];
      const angleDeg = startDeg - i * step;
      const angleRad = (angleDeg * Math.PI) / 180;
      const w = fontBold.widthOfTextAtSize(char, 4.2);

      const x = cx + r * Math.cos(angleRad);
      const y = cy + r * Math.sin(angleRad);
      const rot = angleDeg - 90;

      page.drawText(char, {
        x: x - w / 2,
        y: y - 2,
        size: 4.2,
        font: fontBold,
        color: sealColor,
        rotate: degrees(rot),
      });
    }
  }

  // Bottom Arc text
  function drawBottomArc(text, r, startDeg = 205, endDeg = 335) {
    const chars = text.split('');
    const count = chars.length;
    const span = endDeg - startDeg;
    const step = span / (count - 1);

    for (let i = 0; i < count; i++) {
      const char = chars[i];
      const angleDeg = startDeg + i * step;
      const angleRad = (angleDeg * Math.PI) / 180;
      const w = fontBold.widthOfTextAtSize(char, 3.8);

      const x = cx + r * Math.cos(angleRad);
      const y = cy + r * Math.sin(angleRad);
      const rot = angleDeg + 90;

      page.drawText(char, {
        x: x - w / 2,
        y: y - 2,
        size: 3.8,
        font: fontBold,
        color: sealColor,
        rotate: degrees(rot),
      });
    }
  }

  drawTopArc('NEXUS CONTRACTGUARD', radius - 7.5);
  drawBottomArc('DELAWARE · OFFICIAL TAX SEAL', radius - 7.5);

  const centerTitle = 'OFFICIAL';
  const tw = fontBold.widthOfTextAtSize(centerTitle, 6.5);
  page.drawText(centerTitle, {
    x: cx - tw / 2,
    y: cy + 3,
    size: 6.5,
    font: fontBold,
    color: sealColor,
  });

  const centerYear = '2026';
  const yw = fontBold.widthOfTextAtSize(centerYear, 5);
  page.drawText(centerYear, {
    x: cx - yw / 2,
    y: cy - 4,
    size: 5,
    font: fontBold,
    color: sealColor,
  });

  const centerSub = 'TAX RECORD';
  const sw = fontRegular.widthOfTextAtSize(centerSub, 4);
  page.drawText(centerSub, {
    x: cx - sw / 2,
    y: cy - 9.5,
    size: 4,
    font: fontRegular,
    color: sealColor,
  });
}

export async function generateTaxInvoicePDFBytes(data = {}) {
  const doc = await PDFDocument.create();
  
  // Embed institutional fonts
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const fontMono = await doc.embedFont(StandardFonts.Courier);
  const fontMonoBold = await doc.embedFont(StandardFonts.CourierBold);

  const fonts = { fontRegular, fontBold, fontItalic, fontMono, fontMonoBold };

  // A4 Dimensions in points: 595.28 x 841.89
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 40;
  const contentWidth = pageWidth - (marginX * 2);

  const page = doc.addPage([pageWidth, pageHeight]);

  const black = rgb(0.06, 0.08, 0.12);
  const darkGray = rgb(0.25, 0.3, 0.38);
  const lightGray = rgb(0.55, 0.6, 0.68);
  const lineGray = rgb(0.85, 0.88, 0.92);
  const emerald = rgb(0.02, 0.58, 0.38);
  const cardBg = rgb(0.97, 0.98, 0.99);

  let y = pageHeight - 40;

  // 1. TOP CORPORATE HEADER
  page.drawText('NEXUS CONTRACTGUARD TECHNOLOGIES INC.', {
    x: marginX,
    y: y,
    size: 13,
    font: fontBold,
    color: black,
  });

  const invTitle = 'OFFICIAL TAX INVOICE';
  const invTitleWidth = fontBold.widthOfTextAtSize(invTitle, 14);
  page.drawText(invTitle, {
    x: pageWidth - marginX - invTitleWidth,
    y: y,
    size: 14,
    font: fontBold,
    color: black,
  });

  y -= 13;

  page.drawText('300 Delaware Avenue, Suite 210 · Wilmington, DE 19801 · United States', {
    x: marginX,
    y: y,
    size: 7.5,
    font: fontRegular,
    color: darkGray,
  });

  const orderId = sanitizeText(data.orderId || 'ORD-94821');
  const invNum = `INVOICE: #INV-${orderId}`;
  const invNumWidth = fontBold.widthOfTextAtSize(invNum, 8.5);
  page.drawText(invNum, {
    x: pageWidth - marginX - invNumWidth,
    y: y,
    size: 8.5,
    font: fontBold,
    color: black,
  });

  y -= 11;

  page.drawText('Authorized Merchant of Record: Whop Inc. · Stripe Payments Network', {
    x: marginX,
    y: y,
    size: 7.5,
    font: fontRegular,
    color: darkGray,
  });

  const currentDate = sanitizeText(data.currentDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
  const currentTime = sanitizeText(data.currentTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const dateStr = `DATE: ${currentDate} ${currentTime} UTC`;
  const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 7.5);
  page.drawText(dateStr, {
    x: pageWidth - marginX - dateWidth,
    y: y,
    size: 7.5,
    font: fontRegular,
    color: darkGray,
  });

  y -= 11;

  page.drawText('Tax Exemption / Corporation ID: US-DEL-984210 · nexus.os.store@gmail.com', {
    x: marginX,
    y: y,
    size: 7.5,
    font: fontRegular,
    color: darkGray,
  });

  // Settled Badge (Right aligned)
  const paidText = 'PAID IN FULL · SETTLED';
  const paidWidth = fontBold.widthOfTextAtSize(paidText, 7.5);
  const badgeX = pageWidth - marginX - paidWidth - 12;
  page.drawRectangle({
    x: badgeX,
    y: y - 3,
    width: paidWidth + 12,
    height: 14,
    color: rgb(0.92, 0.98, 0.95),
    borderColor: emerald,
    borderWidth: 1,
  });
  page.drawText(paidText, {
    x: badgeX + 6,
    y: y,
    size: 7.5,
    font: fontBold,
    color: emerald,
  });

  y -= 14;

  // Solid corporate divider
  page.drawLine({
    start: { x: marginX, y: y },
    end: { x: pageWidth - marginX, y: y },
    thickness: 1.5,
    color: black,
  });

  y -= 18;

  // 2. BILLED TO & ISSUED BY (TWO-COLUMN BOX)
  const colBoxHeight = 62;
  const halfColWidth = (contentWidth - 12) / 2;

  // Left Box (Licensor / Merchant)
  page.drawRectangle({
    x: marginX,
    y: y - colBoxHeight,
    width: halfColWidth,
    height: colBoxHeight,
    color: cardBg,
    borderColor: lineGray,
    borderWidth: 0.8,
  });

  page.drawText('ISSUED BY (LICENSOR & MERCHANT):', {
    x: marginX + 10,
    y: y - 13,
    size: 6.5,
    font: fontBold,
    color: lightGray,
  });
  page.drawText('Nexus ContractGuard Technologies Inc.', {
    x: marginX + 10,
    y: y - 25,
    size: 8.5,
    font: fontBold,
    color: black,
  });
  page.drawText('Air-Gapped Client-Side Diligence Division', {
    x: marginX + 10,
    y: y - 36,
    size: 7.5,
    font: fontRegular,
    color: darkGray,
  });
  page.drawText('Support: nexus.os.store@gmail.com · www.nexus-os.store', {
    x: marginX + 10,
    y: y - 48,
    size: 7.5,
    font: fontRegular,
    color: darkGray,
  });

  // Right Box (Licensee / Workstation)
  const rightBoxX = marginX + halfColWidth + 12;
  page.drawRectangle({
    x: rightBoxX,
    y: y - colBoxHeight,
    width: halfColWidth,
    height: colBoxHeight,
    color: cardBg,
    borderColor: lineGray,
    borderWidth: 0.8,
  });

  page.drawText('LICENSED & BILLED TO (COUNSEL / WORKSTATION):', {
    x: rightBoxX + 10,
    y: y - 13,
    size: 6.5,
    font: fontBold,
    color: lightGray,
  });
  page.drawText('Licensed Legal Practice & Retained Counsel', {
    x: rightBoxX + 10,
    y: y - 25,
    size: 8.5,
    font: fontBold,
    color: black,
  });

  const rawDeviceFp = sanitizeText(data.deviceFp || 'SHA256: HARDWARE-LOCKED-TERMINAL-01');
  const shortFp = rawDeviceFp.length > 34 ? rawDeviceFp.substring(0, 34) + '...' : rawDeviceFp;
  page.drawText(`Terminal Fingerprint: ${shortFp}`, {
    x: rightBoxX + 10,
    y: y - 37,
    size: 7,
    font: fontMono,
    color: black,
  });
  page.drawText('Execution Mode: 100% In-Memory RAM (Air-Gapped)', {
    x: rightBoxX + 10,
    y: y - 48,
    size: 7,
    font: fontBold,
    color: emerald,
  });

  y -= (colBoxHeight + 18);

  // 3. ITEMIZED LINE ITEM TABLE
  const isFirm = data.planTier === 'firm';
  const unitPrice = isFirm ? '299.00' : '199.00';
  const totalAmount = isFirm ? '$299.00 USD' : '$199.00 USD';
  const planTitle = isFirm 
    ? 'Nexus ContractGuard(TM) -- Law Firm Suite (5 Perpetual Seats Bundle)'
    : 'Nexus ContractGuard(TM) -- Solo Practitioner Perpetual License';
    
  const planDesc1 = isFirm
    ? 'Enterprise Air-Gapped Diligence Suite: 5 Dedicated Attorney & Paralegal Seats,'
    : 'Air-Gapped Client-Side Diligence Suite: 1 Master Counsel Seat, 4 Verification Engines,';
  const planDesc2 = isFirm
    ? '4 Verification Engines, Myers Redline, Word (.docx) Rider Export, Future Updates Included.'
    : 'Myers Redline, Word (.docx) Amendment Rider Export, Future Updates Included.';

  // Table Header Bar
  const tableHeaderHeight = 18;
  page.drawRectangle({
    x: marginX,
    y: y - tableHeaderHeight,
    width: contentWidth,
    height: tableHeaderHeight,
    color: black,
  });

  page.drawText('#', { x: marginX + 8, y: y - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('DESCRIPTION & SCOPE', { x: marginX + 30, y: y - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('DURATION', { x: marginX + 305, y: y - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('QTY', { x: marginX + 375, y: y - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('UNIT RATE', { x: marginX + 415, y: y - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('AMOUNT', { x: marginX + 475, y: y - 12, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });

  y -= tableHeaderHeight;

  // Table Row
  const rowHeight = 44;
  page.drawRectangle({
    x: marginX,
    y: y - rowHeight,
    width: contentWidth,
    height: rowHeight,
    color: rgb(1, 1, 1),
    borderColor: lineGray,
    borderWidth: 0.8,
  });

  page.drawText('01', { x: marginX + 8, y: y - 16, size: 8, font: fontBold, color: darkGray });
  
  page.drawText(planTitle, { x: marginX + 30, y: y - 14, size: 8.5, font: fontBold, color: black });
  page.drawText(planDesc1, { x: marginX + 30, y: y - 25, size: 7, font: fontRegular, color: darkGray });
  page.drawText(planDesc2, { x: marginX + 30, y: y - 35, size: 7, font: fontRegular, color: darkGray });

  page.drawText('Perpetual', { x: marginX + 305, y: y - 20, size: 7.5, font: fontRegular, color: black });
  page.drawText('1', { x: marginX + 382, y: y - 20, size: 8, font: fontBold, color: black });
  page.drawText(`$${unitPrice}`, { x: marginX + 418, y: y - 20, size: 8, font: fontRegular, color: black });
  page.drawText(`$${unitPrice}`, { x: marginX + 478, y: y - 20, size: 8.5, font: fontBold, color: black });

  y -= (rowHeight + 12);

  // 4. FINANCIAL SUMMARY BOX (RIGHT-ALIGNED)
  const calcBoxWidth = 210;
  const calcBoxHeight = 62;
  const calcBoxX = pageWidth - marginX - calcBoxWidth;

  // Left Memo
  page.drawText('PAYMENT SETTLEMENT MEMO:', {
    x: marginX,
    y: y - 10,
    size: 7,
    font: fontBold,
    color: darkGray,
  });
  page.drawText('Transaction settled in full through Whop Inc. Authorized Merchant of Record.', {
    x: marginX,
    y: y - 21,
    size: 7,
    font: fontRegular,
    color: darkGray,
  });
  page.drawText('All perpetual license rights and air-gapped forensic keys are vested immediately', {
    x: marginX,
    y: y - 31,
    size: 7,
    font: fontRegular,
    color: darkGray,
  });
  page.drawText('upon payment clearance. Zero recurring SaaS fees.', {
    x: marginX,
    y: y - 41,
    size: 7,
    font: fontRegular,
    color: darkGray,
  });

  // Calc Box Border
  page.drawRectangle({
    x: calcBoxX,
    y: y - calcBoxHeight,
    width: calcBoxWidth,
    height: calcBoxHeight,
    color: rgb(1, 1, 1),
    borderColor: lineGray,
    borderWidth: 0.8,
  });

  // Subtotal
  page.drawText('Subtotal:', { x: calcBoxX + 10, y: y - 14, size: 7.5, font: fontRegular, color: darkGray });
  page.drawText(`$${unitPrice} USD`, { x: calcBoxX + 140, y: y - 14, size: 7.5, font: fontRegular, color: black });

  // Tax
  page.drawText('Tax / VAT (0.00% Digital Export):', { x: calcBoxX + 10, y: y - 26, size: 7, font: fontRegular, color: darkGray });
  page.drawText('$0.00 USD', { x: calcBoxX + 152, y: y - 26, size: 7, font: fontRegular, color: black });

  // Processing Fees
  page.drawText('Merchant Processing Fees:', { x: calcBoxX + 10, y: y - 37, size: 7, font: fontRegular, color: darkGray });
  page.drawText('$0.00 USD', { x: calcBoxX + 152, y: y - 37, size: 7, font: fontRegular, color: black });

  // Total Bar
  page.drawRectangle({
    x: calcBoxX,
    y: y - calcBoxHeight,
    width: calcBoxWidth,
    height: 18,
    color: black,
  });
  page.drawText('TOTAL PAID IN FULL:', { x: calcBoxX + 10, y: y - calcBoxHeight + 5, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText(totalAmount, { x: calcBoxX + 132, y: y - calcBoxHeight + 5, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });

  y -= (calcBoxHeight + 18);

  // 5. SCHEDULE A: CRYPTOGRAPHIC LICENSE KEYS
  const seats = Array.isArray(data.seats) && data.seats.length > 0 
    ? data.seats 
    : [
        {
          seatNumber: 1,
          role: 'Primary Counsel (Admin Workstation)',
          key: sanitizeText(data.primaryKey || 'CG-SOLO-LEGAL-SAMPLE-KEY'),
        }
      ];

  const scheduleHeaderHeight = 16;
  const seatRowHeight = 16;
  const scheduleTotalHeight = scheduleHeaderHeight + (seats.length * seatRowHeight);

  page.drawRectangle({
    x: marginX,
    y: y - scheduleTotalHeight,
    width: contentWidth,
    height: scheduleTotalHeight,
    color: rgb(1, 1, 1),
    borderColor: lineGray,
    borderWidth: 0.8,
  });

  // Schedule Header
  page.drawRectangle({
    x: marginX,
    y: y - scheduleHeaderHeight,
    width: contentWidth,
    height: scheduleHeaderHeight,
    color: rgb(0.95, 0.96, 0.98),
    borderColor: lineGray,
    borderWidth: 0.8,
  });

  page.drawText('SCHEDULE A: CRYPTOGRAPHIC LICENSE KEYS (CLIENT-SIDE AIR-GAPPED)', {
    x: marginX + 8,
    y: y - 11,
    size: 7,
    font: fontBold,
    color: black,
  });

  let seatY = y - scheduleHeaderHeight;
  for (const s of seats) {
    const roleText = `Seat 0${s.seatNumber}: ${sanitizeText(s.role)}`;
    const keyText = sanitizeText(s.key);

    page.drawText(roleText, {
      x: marginX + 10,
      y: seatY - 11,
      size: 7.5,
      font: fontBold,
      color: black,
    });

    page.drawText(keyText, {
      x: marginX + 185,
      y: seatY - 11,
      size: 7.5,
      font: fontMonoBold,
      color: black,
    });

    page.drawText('ACTIVE & BOUND', {
      x: marginX + 430,
      y: seatY - 11,
      size: 6.5,
      font: fontBold,
      color: emerald,
    });

    seatY -= seatRowHeight;
  }

  y -= (scheduleTotalHeight + 20);

  // 6. CORPORATE SEAL & REGISTRAR SIGNATURE BLOCK
  // Seal on Right
  const sealRadius = 38;
  const sealCx = pageWidth - marginX - sealRadius - 10;
  const sealCy = y - 35;
  drawCorporateSeal(page, sealCx, sealCy, sealRadius, fonts);

  // Signature Block
  const sigStartX = marginX;
  const sigStartY = y - 10;

  page.drawText('CRYPTOGRAPHIC ATTESTATION & REGISTRAR RECORD:', {
    x: sigStartX,
    y: sigStartY,
    size: 7,
    font: fontBold,
    color: black,
  });

  page.drawText('OFFICE OF THE REGISTRAR', {
    x: sigStartX,
    y: sigStartY - 11,
    size: 8,
    font: fontBold,
    color: black,
  });

  page.drawText('Nexus Sovereign License Ledger · Department of Integrity', {
    x: sigStartX,
    y: sigStartY - 21,
    size: 7,
    font: fontRegular,
    color: darkGray,
  });

  // Vector Signature
  const sigY = sigStartY - 33;
  const sigBlue = rgb(0.06, 0.16, 0.36);
  page.drawLine({ start: { x: sigStartX + 5, y: sigY + 2 }, end: { x: sigStartX + 25, y: sigY + 10 }, thickness: 1.3, color: sigBlue });
  page.drawLine({ start: { x: sigStartX + 25, y: sigY + 10 }, end: { x: sigStartX + 38, y: sigY - 2 }, thickness: 1.0, color: sigBlue });
  page.drawLine({ start: { x: sigStartX + 38, y: sigY - 2 }, end: { x: sigStartX + 58, y: sigY + 12 }, thickness: 1.2, color: sigBlue });
  page.drawLine({ start: { x: sigStartX + 58, y: sigY + 12 }, end: { x: sigStartX + 85, y: sigY + 2 }, thickness: 0.9, color: sigBlue });
  page.drawLine({ start: { x: sigStartX + 85, y: sigY + 2 }, end: { x: sigStartX + 120, y: sigY + 8 }, thickness: 1.1, color: sigBlue });
  page.drawLine({ start: { x: sigStartX + 15, y: sigY - 3 }, end: { x: sigStartX + 140, y: sigY - 3 }, thickness: 0.7, color: sigBlue });

  page.drawLine({
    start: { x: sigStartX, y: sigStartY - 40 },
    end: { x: sigStartX + 190, y: sigStartY - 40 },
    thickness: 0.8,
    color: black,
  });

  page.drawText('Authorized Registrar · Nexus ContractGuard Technologies Inc.', {
    x: sigStartX,
    y: sigStartY - 49,
    size: 6.5,
    font: fontBold,
    color: black,
  });

  // 7. FOOTER STATUTORY TAX COMPLIANCE NOTICE
  const footerY = 32;
  page.drawLine({
    start: { x: marginX, y: footerY + 15 },
    end: { x: pageWidth - marginX, y: footerY + 15 },
    thickness: 0.8,
    color: lineGray,
  });

  page.drawText('Accounting & Tax Compliance Notice: This document serves as an official tax invoice, receipt, and perpetual license certificate', {
    x: marginX,
    y: footerY + 5,
    size: 6.5,
    font: fontRegular,
    color: darkGray,
  });
  page.drawText('for professional accounting, tax deduction, and compliance audits under standard commercial practices (including ABA Model Rule 1.6).', {
    x: marginX,
    y: footerY - 4,
    size: 6.5,
    font: fontRegular,
    color: darkGray,
  });
  page.drawText('All sales are settled in full through Whop Inc. Authorized Merchant of Record. Maintain in firm closing binders.', {
    x: marginX,
    y: footerY - 13,
    size: 6.5,
    font: fontRegular,
    color: darkGray,
  });

  return await doc.save();
}

export async function downloadTaxInvoicePDF(data = {}) {
  try {
    const pdfBytes = await generateTaxInvoicePDFBytes(data);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeOrder = sanitizeText(data.orderId || 'ORD-ONLINE').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `Nexus_ContractGuard_Tax_Invoice_${safeOrder}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (err) {
    console.error('Failed to download Tax Invoice PDF:', err);
    throw err;
  }
}
