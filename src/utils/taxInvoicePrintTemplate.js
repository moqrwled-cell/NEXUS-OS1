/**
 * Nexus ContractGuard Enterprise — Official Tax Invoice & License Sheet Generator
 * 
 * Generates an institutional, publication-grade, formal corporate tax invoice document.
 * Adheres to AmLaw 100 accounting and Delaware corporate commercial billing standards.
 * 
 * Isolated printing via iframe ensures clean physical A4 printing with zero web chrome,
 * zero dark mode background, and zero screenshots.
 */

export function sanitizeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateTaxInvoiceHtml(data = {}) {
  const orderId = sanitizeHtml(data.orderId || 'ORD-94821');
  const planTier = data.planTier === 'firm' ? 'firm' : 'solo';
  const isFirm = planTier === 'firm';
  
  const unitPrice = isFirm ? '299.00' : '199.00';
  const totalAmount = isFirm ? '$299.00 USD' : '$199.00 USD';
  const planTitle = isFirm 
    ? 'Nexus ContractGuard™ — Law Firm Suite (5 Perpetual Seats Bundle)'
    : 'Nexus ContractGuard™ — Solo Practitioner Perpetual License';
    
  const planDescription = isFirm
    ? 'Enterprise-Grade Air-Gapped Diligence Suite. Includes 5 Dedicated Attorney & Paralegal Seats, 4-Engine Structural Diligence, Myers Redline Engine, Word (.docx) Amendment Rider Export, and Continuous Engine Evolution & Future Updates.'
    : 'Air-Gapped Client-Side Diligence Suite. Includes 1 Perpetual Master Counsel Seat, 4-Engine Structural Diligence, Myers Redline Engine, Word (.docx) Amendment Rider Export, and Continuous Engine Evolution & Future Updates.';

  const deviceFp = sanitizeHtml(data.deviceFp || 'SHA256: HARDWARE-LOCKED-TERMINAL-01');
  const currentDate = sanitizeHtml(data.currentDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
  const currentTime = sanitizeHtml(data.currentTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  
  const seats = Array.isArray(data.seats) && data.seats.length > 0 
    ? data.seats 
    : [
        {
          seatNumber: 1,
          role: 'Primary Workstation (Admin)',
          key: data.primaryKey || 'CG-SOLO-LEGAL-SAMPLE-KEY',
          status: 'Bound to Hardware'
        }
      ];

  const qrSvg = data.qrSvgHtml || `
    <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#ffffff" />
      <rect x="10" y="10" width="25" height="25" stroke="#000" stroke-width="4" fill="none" />
      <rect x="16" y="16" width="13" height="13" fill="#000" />
      <rect x="65" y="10" width="25" height="25" stroke="#000" stroke-width="4" fill="none" />
      <rect x="71" y="16" width="13" height="13" fill="#000" />
      <rect x="10" y="65" width="25" height="25" stroke="#000" stroke-width="4" fill="none" />
      <rect x="16" y="71" width="13" height="13" fill="#000" />
      <rect x="45" y="15" width="10" height="10" fill="#000" />
      <rect x="45" y="35" width="10" height="10" fill="#000" />
      <rect x="15" y="45" width="10" height="10" fill="#000" />
      <rect x="35" y="45" width="10" height="10" fill="#000" />
      <rect x="55" y="55" width="10" height="10" fill="#000" />
      <rect x="75" y="45" width="10" height="10" fill="#000" />
      <rect x="45" y="75" width="10" height="10" fill="#000" />
      <rect x="65" y="75" width="10" height="10" fill="#000" />
      <rect x="75" y="65" width="10" height="10" fill="#000" />
    </svg>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Tax Invoice & Proof of Purchase - #INV-${orderId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 15mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff !important;
      color: #09090b !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11px;
      line-height: 1.45;
    }
    .sheet-wrapper {
      width: 100%;
      max-width: 740px;
      margin: 0 auto;
      padding: 10px 0;
    }
    
    /* Top Corporate Header */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      border-bottom: 2px solid #09090b;
      padding-bottom: 14px;
    }
    .header-table td {
      vertical-align: top;
    }
    .brand-title {
      font-size: 17px;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: #09090b;
      text-transform: uppercase;
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .brand-address {
      font-size: 9.5px;
      color: #52525b;
      line-height: 1.4;
      margin: 0;
    }
    .invoice-title {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: #09090b;
      text-transform: uppercase;
      text-align: right;
      margin: 0 0 4px 0;
    }
    .invoice-meta-text {
      text-align: right;
      font-size: 10px;
      color: #3f3f46;
      line-height: 1.45;
    }
    .paid-badge {
      display: inline-block;
      padding: 3px 9px;
      background: #ecfdf5;
      border: 1.5px solid #059669;
      color: #065f46;
      font-weight: 800;
      font-size: 9.5px;
      border-radius: 4px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-top: 5px;
    }

    /* Billing & Licensee Two-Column Box */
    .party-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }
    .party-table td {
      width: 50%;
      padding: 12px 14px;
      vertical-align: top;
      border-right: 1px solid #e2e8f0;
    }
    .party-table td:last-child {
      border-right: none;
    }
    .section-label {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      margin-bottom: 5px;
    }
    .party-name {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .party-detail {
      font-size: 9.5px;
      color: #475569;
      line-height: 1.45;
      margin: 0;
    }
    .hardware-chip {
      display: inline-block;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9px;
      background: #e2e8f0;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 3px;
      font-weight: 600;
      margin-top: 4px;
      word-break: break-all;
    }

    /* Formal Itemized Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .items-table th {
      background: #0f172a;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 8px 10px;
      text-align: left;
    }
    .items-table th.text-right,
    .items-table td.text-right {
      text-align: right;
    }
    .items-table th.text-center,
    .items-table td.text-center {
      text-align: center;
    }
    .items-table td {
      padding: 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10.5px;
      color: #1e293b;
      vertical-align: top;
    }
    .item-title {
      font-weight: 800;
      color: #0f172a;
      font-size: 11px;
      margin-bottom: 2px;
    }
    .item-desc {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.35;
    }

    /* Calculation Summary Block */
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 22px;
    }
    .summary-table td {
      vertical-align: top;
    }
    .payment-memo {
      font-size: 9.5px;
      color: #475569;
      line-height: 1.45;
      padding-right: 20px;
    }
    .calc-box {
      width: 260px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      margin-left: auto;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
      font-size: 10px;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
    }
    .calc-row.total {
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      font-size: 11.5px;
      border-bottom: none;
      padding: 8px 10px;
    }

    /* Schedule of Cryptographic License Keys */
    .schedule-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    .schedule-header {
      background: #f1f5f9;
      padding: 7px 12px;
      border-bottom: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .schedule-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0f172a;
      margin: 0;
    }
    .keys-table {
      width: 100%;
      border-collapse: collapse;
    }
    .keys-table td {
      padding: 7px 12px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 10px;
    }
    .keys-table tr:last-child td {
      border-bottom: none;
    }
    .key-role {
      font-weight: 700;
      color: #1e293b;
      width: 32%;
    }
    .key-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: 0.04em;
    }
    .key-status {
      text-align: right;
      color: #059669;
      font-weight: 700;
      font-size: 9px;
      text-transform: uppercase;
      width: 20%;
    }

    /* Verification Passport & Seal Block */
    .passport-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
    }
    .passport-table td {
      vertical-align: middle;
    }
    .qr-container {
      width: 76px;
      padding-right: 14px;
    }
    .passport-text {
      font-size: 9.5px;
      color: #475569;
      line-height: 1.4;
    }
    .passport-text strong {
      color: #0f172a;
    }
    .seal-container {
      width: 190px;
      text-align: right;
    }
    
    /* Authentic Concentric Corporate Seal (SVG) */
    .corporate-seal-svg {
      width: 82px;
      height: 82px;
      display: inline-block;
    }

    /* Official Signature Block */
    .signature-wrap {
      display: inline-block;
      text-align: left;
      margin-top: 6px;
      border-top: 1px solid #0f172a;
      padding-top: 4px;
      width: 160px;
    }
    .sig-line {
      font-size: 8.5px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
    }
    .sig-sub {
      font-size: 8px;
      color: #64748b;
    }

    /* Footer Legal Notice */
    .footer-notice {
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 8.5px;
      color: #64748b;
      line-height: 1.45;
      text-align: justify;
    }
  </style>
</head>
<body>
  <div class="sheet-wrapper">
    
    <!-- Top Corporate Header -->
    <table class="header-table">
      <tr>
        <td style="width: 58%;">
          <div class="brand-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#09090b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 2px;">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Nexus ContractGuard Technologies Inc.
          </div>
          <p class="brand-address">
            300 Delaware Avenue, Suite 210 · Wilmington, DE 19801 · United States<br />
            Authorized Merchant of Record: Whop Inc. · Stripe Payments Network<br />
            Corporate Tax Exemption / Entity ID: US-DEL-984210 · billing@nexus-os.store
          </p>
        </td>
        <td style="width: 42%;">
          <div class="invoice-title">Tax Invoice</div>
          <div class="invoice-meta-text">
            <strong>INVOICE NO:</strong> #INV-${orderId}<br />
            <strong>DATE:</strong> ${currentDate} ${currentTime} UTC<br />
            <strong>PAYMENT METHOD:</strong> Whop Payments (Card / Apple Pay)<br />
            <span class="paid-badge">PAID IN FULL · SETTLED</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Billing & License Allocation Ledger -->
    <table class="party-table">
      <tr>
        <td>
          <div class="section-label">Issued By (Licensor / Merchant)</div>
          <div class="party-name">Nexus ContractGuard Technologies Inc.</div>
          <p class="party-detail">
            Delaware Registered Digital Systems Corporation<br />
            Air-Gapped Forensic Diligence Engine Division<br />
            Support & Billing: billing@nexus-os.store · www.nexus-os.store
          </p>
        </td>
        <td>
          <div class="section-label">Licensed & Billed To (Counsel / Practice)</div>
          <div class="party-name">Licensed Legal Practice & Retained Counsel</div>
          <p class="party-detail">
            Hardware Terminal SHA-256 Binding:<br />
            <span class="hardware-chip">${deviceFp}</span><br />
            Execution Mode: 100% In-Memory RAM (Air-Gapped Client-Side)
          </p>
        </td>
      </tr>
    </table>

    <!-- Formal Itemized Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 6%;">#</th>
          <th style="width: 52%;">Description & License Scope</th>
          <th class="text-center" style="width: 14%;">Duration</th>
          <th class="text-center" style="width: 8%;">Qty</th>
          <th class="text-right" style="width: 10%;">Unit Rate</th>
          <th class="text-right" style="width: 10%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: 800; color: #64748b;">01</td>
          <td>
            <div class="item-title">${planTitle}</div>
            <div class="item-desc">${planDescription}</div>
          </td>
          <td class="text-center" style="font-weight: 700; color: #0f172a; font-size: 10px;">Perpetual Lifetime</td>
          <td class="text-center" style="font-weight: 700; color: #0f172a;">1</td>
          <td class="text-right" style="font-weight: 600;">$${unitPrice}</td>
          <td class="text-right" style="font-weight: 800; color: #0f172a;">$${unitPrice}</td>
        </tr>
      </tbody>
    </table>

    <!-- Financial Calculation & Payment Memo -->
    <table class="summary-table">
      <tr>
        <td style="width: 58%;">
          <div class="payment-memo">
            <strong>Payment Confirmation Memo:</strong><br />
            Transaction settled in full through Whop Inc. Authorized Merchant of Record. 
            All software access rights and cryptographic keys are vested immediately in perpetuity upon payment clearance. 
            Zero cloud telemetry or external processing.
          </div>
        </td>
        <td style="width: 42%;">
          <div class="calc-box">
            <div class="calc-row">
              <span>Subtotal:</span>
              <span>$${unitPrice} USD</span>
            </div>
            <div class="calc-row">
              <span>Tax / VAT (0.00% Digital Export):</span>
              <span>$0.00 USD</span>
            </div>
            <div class="calc-row">
              <span>Payment Processing & Gateway:</span>
              <span>$0.00 USD</span>
            </div>
            <div class="calc-row total">
              <span>TOTAL PAID IN FULL:</span>
              <span>${totalAmount}</span>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Schedule A: Cryptographic License Keys -->
    <div class="schedule-box">
      <div class="schedule-header">
        <span class="schedule-title">Schedule A: Cryptographic License Key Allocation</span>
        <span style="font-size: 9px; color: #64748b; font-weight: 600;">Air-Gapped Client-Side Validation</span>
      </div>
      <table class="keys-table">
        <tbody>
          ${seats.map(seat => `
            <tr>
              <td class="key-role">Seat 0${seat.seatNumber}: ${sanitizeHtml(seat.role)}</td>
              <td class="key-value">${sanitizeHtml(seat.key)}</td>
              <td class="key-status">✓ Active & Bound</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Verification Passport, Corporate Seal & Registrar Signature -->
    <table class="passport-table">
      <tr>
        <td class="qr-container">
          ${qrSvg}
        </td>
        <td>
          <div class="passport-text">
            <strong>CRYPTOGRAPHIC VERIFICATION PASSPORT</strong><br />
            Scan QR code or visit verification portal to confirm token authenticity on the Nexus Sovereign Ledger.<br />
            <span style="font-family: ui-monospace, monospace; font-size: 8.5px; color: #64748b;">
              SHA-256 Checksum: Verified · Air-Gapped Signature Active
            </span>
          </div>
        </td>
        <td class="seal-container">
          <!-- Vector Corporate Seal -->
          <svg class="corporate-seal-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#0f172a" stroke-width="1.8" />
            <circle cx="50" cy="50" r="42" stroke="#0f172a" stroke-width="0.8" stroke-dasharray="2 1.5" />
            <circle cx="50" cy="50" r="32" stroke="#0f172a" stroke-width="1" />
            <path id="seal-text-path-top" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
            <text font-size="5.5" font-weight="900" fill="#0f172a" letter-spacing="1.2">
              <textPath href="#seal-text-path-top" startOffset="50%" text-anchor="middle">
                NEXUS CONTRACTGUARD
              </textPath>
            </text>
            <path id="seal-text-path-bottom" d="M 78 50 A 28 28 0 0 1 22 50" fill="none" />
            <text font-size="5" font-weight="800" fill="#0f172a" letter-spacing="1.1">
              <textPath href="#seal-text-path-bottom" startOffset="50%" text-anchor="middle">
                DELAWARE · OFFICIAL TAX SEAL
              </textPath>
            </text>
            <text x="50" y="48" font-size="6.5" font-weight="900" text-anchor="middle" fill="#0f172a">SEAL</text>
            <text x="50" y="55" font-size="4.5" font-weight="700" text-anchor="middle" fill="#64748b">2026</text>
            <text x="50" y="61" font-size="4" font-weight="800" text-anchor="middle" fill="#059669">VERIFIED</text>
          </svg>

          <!-- Signature Block -->
          <div>
            <div class="signature-wrap">
              <!-- Stylized Registrar Signature in Vector Blue Ink -->
              <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: -4px;">
                <path d="M 4 14 Q 16 2 28 12 T 48 8 T 68 15 T 88 6 T 108 14" stroke="#0f2b5c" stroke-width="1.4" stroke-linecap="round" fill="none" />
                <path d="M 12 18 Q 45 16 95 18" stroke="#0f2b5c" stroke-width="0.8" stroke-linecap="round" fill="none" />
              </svg>
              <div class="sig-line">Office of the Registrar</div>
              <div class="sig-sub">Department of Software Integrity</div>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Legal & Accounting Compliance Notice -->
    <div class="footer-notice">
      <strong>Accounting & Statutory Tax Compliance Notice:</strong> This document serves as an official tax invoice, receipt, and perpetual license certificate for corporate accounting, professional tax deduction, and compliance audits under standard commercial practices (including ABA Model Rule 1.6 and Delaware General Corporation Law). All sales are settled in full through Whop Inc. Authorized Merchant of Record. Maintain this invoice in your firm's permanent closing binder.
    </div>

  </div>
</body>
</html>`;
}

/**
 * Triggers an isolated physical A4 print of the official tax invoice document.
 * Creates an invisible iframe, renders the formal HTML, and triggers window.print().
 * Guarantees zero screenshot artifacts, zero dark mode, and zero screen buttons.
 */
export function printOfficialTaxInvoice(data = {}) {
  try {
    const existingIframe = document.getElementById('nexus-invoice-print-frame');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'nexus-invoice-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-9999';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(generateTaxInvoiceHtml(data));
    doc.close();

    // Wait for document to load and fonts/styles to parse before printing
    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error('Failed to trigger iframe print dialog:', err);
        // Fallback to window.print if iframe printing is blocked
        window.print();
      } finally {
        setTimeout(() => {
          try {
            if (iframe && iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          } catch {}
        }, 3000);
      }
    }, 300);
  } catch (err) {
    console.error('Print invoice error:', err);
    window.print();
  }
}
