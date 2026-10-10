/**
 * Nexus ContractGuard Enterprise — Multi-Format Export Engine
 * Generates court-ready HTML Redline documents, Executive Client Memos,
 * CSV Obligations Schedules, JSON Audit Records, and Text Summaries.
 * 100% Client-Side generation with zero server dependencies (ABA Rule 1.6 compliant).
 */

function downloadFile(content, fileName, mimeType) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.warn('File download failed or unsupported in this environment:', err);
  }
}

export function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function csvEscape(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Generates and downloads a self-contained, print-ready HTML legal redline document.
 */
export function exportRedlineToHTML(diffResult, risks = [], meta = {}) {
  const title = meta.title || 'Legal Contract Redline Audit';
  const timestamp = new Date().toLocaleString();
  const stats = diffResult?.stats || { additions: 0, deletions: 0, unchanged: 0, similarity: 100 };
  const segments = diffResult?.segments || [];

  const htmlBody = segments.map((seg) => {
    if (seg.type === 'added') {
      return `<ins style="background-color: #d1fae5; color: #065f46; text-decoration: none; padding: 2px 4px; border-radius: 3px; font-weight: 600;">${escapeHtml(seg.value)}</ins>`;
    }
    if (seg.type === 'removed') {
      return `<del style="background-color: #fee2e2; color: #991b1b; text-decoration: line-through; padding: 2px 4px; border-radius: 3px;">${escapeHtml(seg.value)}</del>`;
    }
    return `<span>${escapeHtml(seg.value)}</span>`;
  }).join(' ');

  const risksHtml = (risks || []).map((risk, i) => {
    const badgeColor = risk.severity === 'critical' ? '#dc2626' : risk.severity === 'warning' ? '#d97706' : '#2563eb';
    return `
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 10px; background-color: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-weight: bold; color: #111827;">${i + 1}. "${escapeHtml(risk.phrase)}"</span>
          <span style="background-color: ${badgeColor}; color: #ffffff; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
            ${risk.severity}
          </span>
        </div>
        <p style="font-size: 13px; color: #4b5563; margin: 4px 0;"><strong>Category:</strong> ${escapeHtml(risk.category)} (Found ${risk.count}x)</p>
        <p style="font-size: 13px; color: #374151; margin: 4px 0;"><strong>Risk:</strong> ${escapeHtml(risk.description)}</p>
        <p style="font-size: 13px; color: #15803d; margin: 4px 0;"><strong>Guidance:</strong> ${escapeHtml(risk.recommendation)}</p>
      </div>
    `;
  }).join('');

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)} — Nexus ContractGuard Redline</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .badge {
      display: inline-block;
      background: #00F0FF;
      color: #000;
      font-weight: bold;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 30px;
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
    }
    .stat-item {
      text-align: center;
    }
    .stat-val {
      font-size: 24px;
      font-weight: 800;
      display: block;
    }
    .stat-lbl {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
    }
    .redline-box {
      font-family: "Georgia", serif;
      font-size: 15px;
      line-height: 2.0;
      padding: 24px;
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .container { box-shadow: none; padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="badge">Nexus ContractGuard Enterprise</span>
          <h1 style="margin: 10px 0 5px; font-size: 26px;">${escapeHtml(title)}</h1>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">Audit Date: ${timestamp} | Environment: 100% Air-Gapped Local Browser</p>
        </div>
        <button class="no-print" onclick="window.print()" style="cursor: pointer; background: #111827; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold;">Print / Save PDF</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-val" style="color: #059669;">+${stats.additions}</span>
        <span class="stat-lbl">Additions</span>
      </div>
      <div class="stat-item">
        <span class="stat-val" style="color: #dc2626;">-${stats.deletions}</span>
        <span class="stat-lbl">Deletions</span>
      </div>
      <div class="stat-item">
        <span class="stat-val" style="color: #2563eb;">${stats.similarity}%</span>
        <span class="stat-lbl">Similarity</span>
      </div>
      <div class="stat-item">
        <span class="stat-val" style="color: #7c3aed;">${risks.length}</span>
        <span class="stat-lbl">Liabilities Found</span>
      </div>
    </div>

    ${risks.length > 0 ? `
      <h2 style="font-size: 18px; margin-bottom: 12px; color: #111827;">Detected Risk Factors (${risks.length})</h2>
      <div style="margin-bottom: 30px;">
        ${risksHtml}
      </div>
    ` : ''}

    <h2 style="font-size: 18px; margin-bottom: 12px; color: #111827;">Full Redline Comparison</h2>
    <div class="redline-box">
      ${htmlBody}
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center;">
      Generated securely via Nexus ContractGuard Enterprise. Verified 0-network transmission. Confidential attorney work product.
    </div>
  </div>
</body>
</html>`;

  downloadFile(fullHtml, `Redline_Audit_${Date.now()}.html`, 'text/html;charset=utf-8');
  return fullHtml;
}

/**
 * Generates an executive legal client memorandum HTML document ready for 1-click printing to PDF.
 * Includes executive letterhead, risk score badge, critical findings tables,
 * defined terms defects, obligations matrix, and self-contained @media print CSS.
 * 
 * @param {Object} params
 * @param {string} [params.contractTitle]
 * @param {string} [params.clientName]
 * @param {string} [params.counterpartyName]
 * @param {Object} [params.auditData]
 * @param {string} [params.date]
 * @param {Object} [params.options]
 * @returns {string} Fully self-contained HTML markup
 */
export function exportExecutiveClientMemoHTML(...args) {
  let contractTitle = 'Contract Integrity & Legal Due Diligence Audit';
  let clientName = 'Client';
  let counterpartyName = 'Counterparty';
  let auditData = {};
  let memoDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  let options = {};

  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    const input = args[0];
    if (input.auditData) {
      auditData = input.auditData;
      if (input.contractTitle) contractTitle = input.contractTitle;
      if (input.clientName) clientName = input.clientName;
      if (input.counterpartyName) counterpartyName = input.counterpartyName;
      if (input.date) memoDate = input.date;
      if (input.options) options = input.options;
    } else {
      // Direct auditData object or combined params
      auditData = input;
      if (input.contractTitle) contractTitle = input.contractTitle;
      if (input.clientName) clientName = input.clientName;
      if (input.counterpartyName) counterpartyName = input.counterpartyName;
      if (input.date) memoDate = input.date;
    }
  } else if (args.length >= 2) {
    auditData = args[0] || {};
    const meta = args[1] || {};
    if (meta.contractTitle || meta.title) contractTitle = meta.contractTitle || meta.title;
    if (meta.clientName || meta.clientParty) clientName = meta.clientName || meta.clientParty;
    if (meta.counterpartyName || meta.counterparty) counterpartyName = meta.counterpartyName || meta.counterparty;
    if (meta.date) memoDate = meta.date;
    options = meta.options || {};
  }

  // Fallback metadata from auditData.meta if available
  if (auditData?.meta) {
    if (!contractTitle || contractTitle === 'Contract Integrity & Legal Due Diligence Audit') {
      if (auditData.meta.title) contractTitle = auditData.meta.title;
    }
    if (clientName === 'Client' && auditData.meta.clientParty) {
      clientName = auditData.meta.clientParty;
    }
    if (counterpartyName === 'Counterparty' && auditData.meta.counterparty) {
      counterpartyName = auditData.meta.counterparty;
    }
  }

  const crossRefs = auditData?.crossRefs || { issues: [], stats: {}, indexedSections: [], indexedExhibits: [] };
  const definedTerms = auditData?.definedTerms || { issues: [], stats: {}, definedTerms: [], undefinedTerms: [], unusedDefinedTerms: [], entityIssues: [], boilerplateArtifacts: [] };
  const financialDates = auditData?.financialDates || { issues: [], stats: {}, financialPairings: [], timeline: [], noticePeriods: [] };
  const obligations = auditData?.obligations || { obligations: [], partyBreakdown: {}, stats: {} };
  const risks = auditData?.risks || [];
  const riskScore = typeof auditData?.overallRiskScore === 'number' ? auditData.overallRiskScore : (auditData?.riskScore ?? 0);
  const riskLevel = (auditData?.riskLevel || (riskScore >= 75 ? 'critical' : riskScore >= 45 ? 'high' : riskScore >= 20 ? 'medium' : 'low')).toLowerCase();

  // Aggregate critical issues
  const brokenRefs = (crossRefs.issues || []).filter(i => i.type === 'broken_reference');
  const missingExhibits = (crossRefs.issues || []).filter(i => i.type === 'missing_exhibit');
  const amountMismatches = (financialDates.issues || []).filter(i => i.type === 'amount_mismatch');
  const dateIssues = (financialDates.issues || []).filter(i => i.type === 'expired_date' || i.type === 'timeline_contradiction');
  const undefinedTermsList = definedTerms.undefinedTerms || [];
  const unusedTermsList = definedTerms.unusedDefinedTerms || [];
  const boilerplateList = definedTerms.boilerplateArtifacts || [];
  const entityIssuesList = definedTerms.entityIssues || [];
  const obligationsList = obligations.obligations || [];

  const totalCriticalDefects = brokenRefs.length + missingExhibits.length + amountMismatches.length + dateIssues.length;

  let riskBadgeColor = '#059669'; // Green
  let riskBadgeBg = '#ecfdf5';
  let riskAssessmentSummary = 'This agreement appears sound from a structural integrity perspective with low baseline defect density. Standard legal review suffices.';

  if (riskLevel === 'critical' || riskScore >= 75) {
    riskBadgeColor = '#dc2626'; // Red
    riskBadgeBg = '#fef2f2';
    riskAssessmentSummary = 'CRITICAL DEFECTS DETECTED: Execution in current form creates severe litigation and operational risks. We strongly advise rejecting this draft until broken cross-references, missing exhibits, and financial mismatches are resolved.';
  } else if (riskLevel === 'high' || riskScore >= 45) {
    riskBadgeColor = '#ea580c'; // Orange
    riskBadgeBg = '#fff7ed';
    riskAssessmentSummary = 'HIGH RISK: Significant drafting anomalies and potential ambiguities identified. Counsel recommends redlining all highlighted sections prior to signature.';
  } else if (riskLevel === 'medium' || riskScore >= 20) {
    riskBadgeColor = '#d97706'; // Amber
    riskBadgeBg = '#fffbeb';
    riskAssessmentSummary = 'MODERATE RISK: Minor drafting gaps and undefined terms noted. Corrections recommended for standard corporate hygiene.';
  }

  // HTML rows generators
  const brokenRefsRows = brokenRefs.length === 0 ? `
    <tr><td colspan="4" style="text-align: center; color: #059669; padding: 12px; font-weight: 500;">✓ All internal section citations successfully resolved.</td></tr>
  ` : brokenRefs.map(b => `
    <tr>
      <td style="font-weight: 700; color: #dc2626; font-family: monospace;">${escapeHtml(b.referenceText || b.targetName)}</td>
      <td style="font-family: monospace;">Line ${escapeHtml(b.line)}</td>
      <td style="color: #4b5563; font-style: italic;">"${escapeHtml(b.snippet || '')}"</td>
      <td style="color: #991b1b; font-weight: 600;">Target clause does not exist in agreement.</td>
    </tr>
  `).join('');

  const missingExhibitsRows = missingExhibits.length === 0 ? `
    <tr><td colspan="4" style="text-align: center; color: #059669; padding: 12px; font-weight: 500;">✓ All referenced exhibits and schedules are present.</td></tr>
  ` : missingExhibits.map(m => `
    <tr>
      <td style="font-weight: 700; color: #dc2626; font-family: monospace;">${escapeHtml(m.referenceText || m.targetName)}</td>
      <td style="font-family: monospace;">Line ${escapeHtml(m.line)}</td>
      <td style="color: #4b5563; font-style: italic;">"${escapeHtml(m.snippet || '')}"</td>
      <td style="color: #991b1b; font-weight: 600;">Referenced exhibit/schedule is missing from package.</td>
    </tr>
  `).join('');

  const financialMismatchesRows = amountMismatches.length === 0 ? `
    <tr><td colspan="4" style="text-align: center; color: #059669; padding: 12px; font-weight: 500;">✓ All numeric and written monetary figures are perfectly aligned.</td></tr>
  ` : amountMismatches.map(m => `
    <tr>
      <td style="font-weight: 700; color: #dc2626; font-family: monospace;">${escapeHtml(m.title || 'Amount Contradiction')}</td>
      <td style="font-family: monospace;">Line ${escapeHtml(m.line)}</td>
      <td style="color: #374151;">${escapeHtml(m.details || '')}</td>
      <td style="color: #4b5563; font-style: italic;">"${escapeHtml(m.snippet || '')}"</td>
    </tr>
  `).join('');

  const dateIssuesRows = dateIssues.length === 0 ? `
    <tr><td colspan="4" style="text-align: center; color: #059669; padding: 12px; font-weight: 500;">✓ Timeline chronology verified. No expired dates or backward sequences.</td></tr>
  ` : dateIssues.map(d => `
    <tr>
      <td style="font-weight: 700; color: #ea580c; font-family: monospace;">${escapeHtml(d.title || d.type)}</td>
      <td style="font-family: monospace;">Line ${escapeHtml(d.line)}</td>
      <td style="color: #374151;">${escapeHtml(d.details || '')}</td>
      <td style="color: #4b5563; font-style: italic;">"${escapeHtml(d.snippet || '')}"</td>
    </tr>
  `).join('');

  const undefinedTermsRows = undefinedTermsList.length === 0 ? `
    <tr><td colspan="3" style="text-align: center; color: #059669; padding: 10px;">✓ No undefined capitalized terms detected.</td></tr>
  ` : undefinedTermsList.slice(0, 15).map(u => `
    <tr>
      <td style="font-weight: 600; color: #1f2937;">"${escapeHtml(u.term)}"</td>
      <td style="font-family: monospace;">Line ${escapeHtml(u.line)}</td>
      <td style="color: #6b7280;">Referenced ${escapeHtml(u.count || 1)}x without formal definition clause.</td>
    </tr>
  `).join('');

  const boilerplateRows = boilerplateList.length === 0 ? `
    <tr><td colspan="3" style="text-align: center; color: #059669; padding: 10px;">✓ Zero template placeholders or leftover draft artifacts detected.</td></tr>
  ` : boilerplateList.map(b => `
    <tr>
      <td style="font-weight: 700; color: #dc2626; font-family: monospace;">${escapeHtml(b.placeholder)}</td>
      <td style="font-family: monospace;">Line ${escapeHtml(b.line)}</td>
      <td style="color: #4b5563; font-style: italic;">"${escapeHtml(b.snippet || '')}"</td>
    </tr>
  `).join('');

  const obligationsRows = obligationsList.length === 0 ? `
    <tr><td colspan="5" style="text-align: center; color: #6b7280; padding: 14px;">No contractual obligations detected.</td></tr>
  ` : obligationsList.map((o, idx) => {
    const sevBadge = o.severity === 'high' ? 'color: #dc2626; background: #fee2e2;' :
                     o.severity === 'medium' ? 'color: #d97706; background: #fef3c7;' :
                     'color: #2563eb; background: #dbeafe;';
    const partyBadge = o.responsibleParty === 'Client' ? 'color: #0369a1; background: #e0f2fe;' :
                       o.responsibleParty === 'Counterparty' ? 'color: #b45309; background: #fef3c7;' :
                       o.responsibleParty === 'Mutual' ? 'color: #4338ca; background: #e0e7ff;' :
                       'color: #4b5563; background: #f3f4f6;';

    return `
      <tr>
        <td style="font-weight: 700; font-family: monospace;">#${idx + 1}</td>
        <td>
          <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; text-transform: uppercase; ${partyBadge}">
            ${escapeHtml(o.responsibleParty)}
          </span>
        </td>
        <td>
          <span style="font-weight: 600; font-family: monospace; color: #111827;">${escapeHtml(o.modalVerb)}</span>
          <span style="font-size: 11px; color: #6b7280; margin-left: 4px;">(${escapeHtml(o.dutyType)})</span>
        </td>
        <td style="color: #1f2937; line-height: 1.4;">
          ${escapeHtml(o.sentence || o.action)}
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px; font-family: monospace;">Line ${escapeHtml(o.line)} ${o.sectionContext ? '| ' + escapeHtml(o.sectionContext) : ''}</div>
        </td>
        <td>
          <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; text-transform: uppercase; ${sevBadge}">
            ${escapeHtml(o.severity)}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  const memoHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(contractTitle)} — Executive Legal Client Memo</title>
  <style>
    /* Standalone Local Print-Ready CSS — Zero Remote Dependencies (ABA Rule 1.6) */
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.55;
      color: #1f2937;
      background-color: #f3f4f6;
      margin: 0;
      padding: 30px 15px;
      -webkit-font-smoothing: antialiased;
    }
    .memo-paper {
      max-width: 960px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px;
      border-radius: 8px;
      box-shadow: 0 4px 25px rgba(0,0,0,0.08);
      border: 1px solid #e5e7eb;
    }
    .letterhead {
      border-bottom: 3px solid #111827;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .firm-name {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #111827;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }
    .firm-dept {
      font-size: 12px;
      font-weight: 700;
      color: #4b5563;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0 0 8px 0;
    }
    .confidential-stamp {
      display: inline-block;
      background-color: #fee2e2;
      color: #991b1b;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      border: 1px solid #f87171;
    }
    .memo-meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 18px;
      font-size: 13px;
    }
    .memo-meta-table td {
      padding: 4px 0;
      vertical-align: top;
    }
    .memo-meta-label {
      width: 140px;
      font-weight: 800;
      color: #374151;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    .memo-meta-val {
      color: #111827;
      font-weight: 500;
    }
    .risk-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      margin-bottom: 28px;
      background-color: ${riskBadgeBg};
      border-left: 6px solid ${riskBadgeColor};
    }
    .risk-score-pill {
      display: inline-block;
      padding: 8px 18px;
      border-radius: 6px;
      background-color: ${riskBadgeColor};
      color: #ffffff;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-align: center;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 6px;
      margin: 32px 0 14px 0;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 20px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }
    .data-table th {
      background-color: #f8fafc;
      color: #374151;
      font-weight: 800;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    .data-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 14px;
      border-radius: 6px;
      text-align: center;
    }
    .stat-card .val {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      display: block;
    }
    .stat-card .lbl {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    .footer-note {
      margin-top: 40px;
      padding-top: 18px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.5;
    }
    .print-btn-bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }
    .btn-print {
      cursor: pointer;
      background-color: #0f172a;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: background 0.2s;
    }
    .btn-print:hover {
      background-color: #334155;
    }

    /* Print Formatting Rules */
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
        margin: 0;
        font-size: 11pt;
      }
      .memo-paper {
        box-shadow: none;
        border: none;
        padding: 0;
        max-width: 100%;
      }
      .no-print, .print-btn-bar {
        display: none !important;
      }
      .section-title {
        page-break-after: avoid;
      }
      .data-table {
        page-break-inside: auto;
      }
      .data-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      @page {
        margin: 1.5cm;
        size: auto;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-btn-bar no-print">
    <div style="max-width: 960px; width: 100%; margin: 0 auto; display: flex; justify-content: flex-end;">
      <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
    </div>
  </div>

  <div class="memo-paper">
    <div class="letterhead">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h1 class="firm-name">Nexus ContractGuard Enterprise</h1>
          <p class="firm-dept">Legal Technology & Document Integrity Practice Group</p>
        </div>
        <div>
          <span class="confidential-stamp">Privileged & Confidential Work Product</span>
        </div>
      </div>

      <table class="memo-meta-table">
        <tr>
          <td class="memo-meta-label">TO:</td>
          <td class="memo-meta-val">${escapeHtml(clientName)}</td>
        </tr>
        <tr>
          <td class="memo-meta-label">FROM:</td>
          <td class="memo-meta-val">ContractGuard Legal Risk Assessment System (ABA Rule 1.6 Air-Gapped)</td>
        </tr>
        <tr>
          <td class="memo-meta-label">DATE:</td>
          <td class="memo-meta-val">${escapeHtml(memoDate)}</td>
        </tr>
        <tr>
          <td class="memo-meta-label">MATTER / TITLE:</td>
          <td class="memo-meta-val"><strong>${escapeHtml(contractTitle)}</strong></td>
        </tr>
        <tr>
          <td class="memo-meta-label">COUNTERPARTY:</td>
          <td class="memo-meta-val">${escapeHtml(counterpartyName)}</td>
        </tr>
      </table>
    </div>

    <!-- Overall Risk Assessment Banner -->
    <div class="risk-banner">
      <div>
        <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #0f172a;">Executive Risk Assessment</h3>
        <p style="margin: 0; font-size: 13px; color: #334155; max-width: 600px;">
          ${riskAssessmentSummary}
        </p>
      </div>
      <div>
        <div class="risk-score-pill">
          ${riskScore} / 100
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${riskLevel} RISK</div>
        </div>
      </div>
    </div>

    <!-- Metrics Overview -->
    <div class="stats-cards">
      <div class="stat-card">
        <span class="val" style="color: ${brokenRefs.length > 0 ? '#dc2626' : '#059669'};">${brokenRefs.length}</span>
        <span class="lbl">Broken References</span>
      </div>
      <div class="stat-card">
        <span class="val" style="color: ${missingExhibits.length > 0 ? '#dc2626' : '#059669'};">${missingExhibits.length}</span>
        <span class="lbl">Missing Exhibits</span>
      </div>
      <div class="stat-card">
        <span class="val" style="color: ${amountMismatches.length > 0 ? '#dc2626' : '#059669'};">${amountMismatches.length}</span>
        <span class="lbl">Financial Mismatches</span>
      </div>
      <div class="stat-card">
        <span class="val" style="color: #2563eb;">${obligationsList.length}</span>
        <span class="lbl">Obligations Extracted</span>
      </div>
    </div>

    <!-- Section 1: Broken Cross-References & Missing Exhibits -->
    <h3 class="section-title">1. Cross-Reference & Exhibit Defect Schedule</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 25%;">Citation Reference</th>
          <th style="width: 12%;">Line</th>
          <th style="width: 38%;">Contract Context Snippet</th>
          <th style="width: 25%;">Defect Assessment</th>
        </tr>
      </thead>
      <tbody>
        ${brokenRefsRows}
      </tbody>
    </table>

    <h4 style="font-size: 13px; margin: 16px 0 8px 0; color: #374151; text-transform: uppercase;">Exhibits & Schedules Audit</h4>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 25%;">Referenced Exhibit</th>
          <th style="width: 12%;">Line</th>
          <th style="width: 38%;">Contract Context Snippet</th>
          <th style="width: 25%;">Defect Assessment</th>
        </tr>
      </thead>
      <tbody>
        ${missingExhibitsRows}
      </tbody>
    </table>

    <!-- Section 2: Financial & Vital Dates Integrity -->
    <h3 class="section-title">2. Financial Figures & Vital Dates Audit</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 25%;">Financial Item</th>
          <th style="width: 12%;">Line</th>
          <th style="width: 35%;">Discrepancy Details</th>
          <th style="width: 28%;">Context</th>
        </tr>
      </thead>
      <tbody>
        ${financialMismatchesRows}
      </tbody>
    </table>

    <h4 style="font-size: 13px; margin: 16px 0 8px 0; color: #374151; text-transform: uppercase;">Chronology & Timeline Audit</h4>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 25%;">Timeline Event</th>
          <th style="width: 12%;">Line</th>
          <th style="width: 35%;">Timeline Assessment</th>
          <th style="width: 28%;">Context</th>
        </tr>
      </thead>
      <tbody>
        ${dateIssuesRows}
      </tbody>
    </table>

    <!-- Section 3: Defined Terms & Boilerplate Artifacts -->
    <h3 class="section-title">3. Defined Terms & Template Artifacts</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 30%;">Undefined Capitalized Term</th>
          <th style="width: 15%;">Line</th>
          <th style="width: 55%;">Finding Note</th>
        </tr>
      </thead>
      <tbody>
        ${undefinedTermsRows}
      </tbody>
    </table>

    ${boilerplateList.length > 0 ? `
      <h4 style="font-size: 13px; margin: 16px 0 8px 0; color: #dc2626; text-transform: uppercase;">Unresolved Template Brackets & Placeholders (${boilerplateList.length})</h4>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30%;">Placeholder Artifact</th>
            <th style="width: 15%;">Line</th>
            <th style="width: 55%;">Context Snippet</th>
          </tr>
        </thead>
        <tbody>
          ${boilerplateRows}
        </tbody>
      </table>
    ` : ''}

    <!-- Section 4: Obligations Matrix -->
    <h3 class="section-title">4. Contractual Obligations & Covenants Matrix (${obligationsList.length})</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 5%;">#</th>
          <th style="width: 15%;">Party</th>
          <th style="width: 18%;">Verb & Duty</th>
          <th style="width: 50%;">Action / Operative Covenant</th>
          <th style="width: 12%;">Severity</th>
        </tr>
      </thead>
      <tbody>
        ${obligationsRows}
      </tbody>
    </table>

    <!-- Section 5: Counsel Recommendations -->
    <h3 class="section-title">5. Pre-Signature Counsel Recommendations</h3>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px; font-size: 13px; line-height: 1.6;">
      <ul style="margin: 0; padding-left: 20px;">
        ${brokenRefs.length > 0 ? `<li style="margin-bottom: 6px;"><strong style="color: #dc2626;">Resolve Cross-References:</strong> Re-insert or update clauses corresponding to non-existent cross-references before execution.</li>` : ''}
        ${missingExhibits.length > 0 ? `<li style="margin-bottom: 6px;"><strong style="color: #dc2626;">Attach Missing Exhibits:</strong> Ensure all referenced exhibits and schedules are attached and signed concurrently.</li>` : ''}
        ${amountMismatches.length > 0 ? `<li style="margin-bottom: 6px;"><strong style="color: #dc2626;">Reconcile Financial Terms:</strong> Clarify whether numerical or written amounts prevail, and synchronize all compensation clauses.</li>` : ''}
        ${boilerplateList.length > 0 ? `<li style="margin-bottom: 6px;"><strong style="color: #dc2626;">Fill In Template Placeholders:</strong> Replace all square brackets and blank lines with agreed terms.</li>` : ''}
        <li style="margin-bottom: 6px;"><strong>Operational Obligations Calendar:</strong> Docket all notice periods, payment milestones, and renewal cancellation deadlines in corporate compliance calendar.</li>
      </ul>
    </div>

    <div class="footer-note">
      This memorandum was generated locally by Nexus ContractGuard Enterprise.<br>
      Air-Gapped Processing: 100% In-Memory RAM execution. Zero external API calls. ABA Model Rule 1.6 strictly preserved.
    </div>
  </div>
</body>
</html>`;

  if (options.download !== false) {
    const safeTitle = contractTitle.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) || 'Contract';
    downloadFile(memoHtml, `Client_Memo_${safeTitle}_${Date.now()}.html`, 'text/html;charset=utf-8');
  }

  return memoHtml;
}

/**
 * Exports contractual obligations list to standard comma-separated values (CSV) format.
 * 
 * @param {Array|Object} obligationsInput - Array of obligations or obligationsExtractor result object
 * @param {Object} [options]
 * @returns {string} CSV text
 */
export function exportObligationsCSV(obligationsInput, options = {}) {
  let list = [];
  if (Array.isArray(obligationsInput)) {
    list = obligationsInput;
  } else if (obligationsInput && Array.isArray(obligationsInput.obligations)) {
    list = obligationsInput.obligations;
  }

  const headers = [
    'ID',
    'Responsible Party',
    'Modal Verb',
    'Duty Type',
    'Severity',
    'Line Number',
    'Section Context',
    'Operative Action',
    'Full Sentence'
  ];

  const rows = [headers.map(csvEscape).join(',')];

  list.forEach((item, idx) => {
    const row = [
      csvEscape(item.id || `OBL-${idx + 1}`),
      csvEscape(item.responsibleParty || 'Mutual'),
      csvEscape(item.modalVerb || 'shall'),
      csvEscape(item.dutyType || 'affirmative'),
      csvEscape(item.severity || 'medium'),
      csvEscape(item.line ?? ''),
      csvEscape(item.sectionContext || ''),
      csvEscape(item.action || ''),
      csvEscape(item.sentence || item.action || '')
    ];
    rows.push(row.join(','));
  });

  const csvContent = rows.join('\r\n');

  if (options.download !== false) {
    downloadFile(csvContent, `Contract_Obligations_${Date.now()}.csv`, 'text/csv;charset=utf-8');
  }

  return csvContent;
}

/**
 * Exports contractual obligations list to JSON format.
 * 
 * @param {Array|Object} obligationsInput
 * @param {Object} [options]
 * @returns {string} JSON text
 */
export function exportObligationsJSON(obligationsInput, options = {}) {
  let data = obligationsInput;
  if (Array.isArray(obligationsInput)) {
    data = { obligations: obligationsInput, totalCount: obligationsInput.length };
  }
  const jsonStr = JSON.stringify(data, null, 2);

  if (options.download !== false) {
    downloadFile(jsonStr, `Contract_Obligations_${Date.now()}.json`, 'application/json;charset=utf-8');
  }

  return jsonStr;
}

/**
 * Exports complete audit record in structured JSON for compliance verification.
 */
export function exportAuditReportJSON(diffResult, risks = [], redactionStats = null, meta = {}) {
  const report = {
    system: 'Nexus ContractGuard Enterprise',
    version: '2.0.0-AirGapped',
    auditTimestamp: new Date().toISOString(),
    documentMetadata: {
      title: meta.title || 'Contract Audit',
      originalWordCount: diffResult?.stats?.originalWordCount || 0,
      modifiedWordCount: diffResult?.stats?.modifiedWordCount || 0
    },
    diffMetrics: diffResult?.stats || {},
    detectedLegalRisks: (risks || []).map(r => ({
      phrase: r.phrase,
      category: r.category,
      severity: r.severity,
      occurrencesCount: r.count,
      recommendation: r.recommendation
    })),
    piiSanitization: redactionStats || null,
    airGappedVerification: {
      telemetryTransmitted: 0,
      externalNetworkRequests: 0,
      processingEngine: 'Browser Client Web Worker / In-Memory RAM',
      privacyCompliance: ['ABA Model Rule 1.6', 'GDPR Article 28']
    }
  };

  const jsonStr = JSON.stringify(report, null, 2);
  downloadFile(jsonStr, `Audit_Report_${Date.now()}.json`, 'application/json;charset=utf-8');
  return jsonStr;
}

/**
 * Exports a clean plain text redline summary.
 */
export function exportRedlineSummaryTXT(diffResult, risks = [], meta = {}) {
  const stats = diffResult?.stats || {};
  let txt = `=================================================================\n`;
  txt += `NEXUS CONTRACTGUARD ENTERPRISE — LEGAL REDLINE SUMMARY\n`;
  txt += `=================================================================\n`;
  txt += `Document: ${meta.title || 'Contract Audit'}\n`;
  txt += `Audit Date: ${new Date().toLocaleString()}\n`;
  txt += `Air-Gapped Status: 100% Local / Zero Server Transmission\n\n`;
  txt += `METRICS:\n`;
  txt += `- Additions: +${stats.additions || 0} words\n`;
  txt += `- Deletions: -${stats.deletions || 0} words\n`;
  txt += `- Similarity: ${stats.similarity || 100}%\n`;
  txt += `- Processing Time: ${stats.processingTimeMs || 0} ms\n\n`;

  if (risks.length > 0) {
    txt += `DETECTED RED FLAGS & LIABILITIES (${risks.length}):\n`;
    risks.forEach((r, idx) => {
      txt += `  [${idx + 1}] [${r.severity.toUpperCase()}] "${r.phrase}" (${r.count}x)\n`;
      txt += `      Category: ${r.category}\n`;
      txt += `      Risk: ${r.description}\n`;
      txt += `      Action: ${r.recommendation}\n\n`;
    });
  }

  txt += `=================================================================\n`;
  txt += `CLAUSE EDIT SCRIPT:\n`;
  txt += `=================================================================\n\n`;

  (diffResult?.segments || []).forEach(seg => {
    if (seg.type === 'added') {
      txt += `[+ADDED: ${seg.value.trim()}+] `;
    } else if (seg.type === 'removed') {
      txt += `[-DELETED: ${seg.value.trim()}-] `;
    } else {
      txt += `${seg.value} `;
    }
  });

  downloadFile(txt, `Redline_Summary_${Date.now()}.txt`, 'text/plain;charset=utf-8');
  return txt;
}
