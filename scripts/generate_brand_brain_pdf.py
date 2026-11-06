import asyncio
import os
from playwright.async_api import async_playwright
import fitz

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Nexus ContractGuard™ — Brand Brain</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #030712;
    color: #e5e7eb;
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 10pt;
    line-height: 1.5;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    height: 297mm;
    padding: 16mm 18mm 16mm 18mm;
    position: relative;
    page-break-after: always;
    overflow: hidden;
    background: radial-gradient(circle at 85% 15%, rgba(0, 245, 160, 0.05) 0%, transparent 45%),
                radial-gradient(circle at 15% 85%, rgba(0, 217, 245, 0.04) 0%, transparent 45%),
                #030712;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Header & Footer on Pages 2+ */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 8px;
    margin-bottom: 18px;
    font-size: 7.5pt;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #9ca3af;
  }

  .page-header .brand-tag {
    color: #00F5A0;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }

  .page-footer {
    position: absolute;
    bottom: 10mm;
    left: 18mm;
    right: 18mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 8px;
    font-size: 7pt;
    color: #6b7280;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Cover Page */
  .cover {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20mm 20mm;
    background: radial-gradient(circle at 50% 45%, rgba(0, 245, 160, 0.08) 0%, transparent 60%),
                radial-gradient(circle at 80% 85%, rgba(0, 217, 245, 0.05) 0%, transparent 50%),
                #030712;
  }

  .cover-top-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 245, 160, 0.08);
    border: 1px solid rgba(0, 245, 160, 0.3);
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 7.5pt;
    font-family: 'JetBrains Mono', monospace;
    color: #00F5A0;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    width: fit-content;
  }

  .cover-title-area {
    margin-top: 14px;
  }

  .cover-title-area h1 {
    font-family: 'Cinzel', serif;
    font-size: 32pt;
    font-weight: 900;
    line-height: 1.1;
    color: #ffffff;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  .cover-title-area h1 span {
    background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cover-subtitle {
    font-size: 11pt;
    color: #9ca3af;
    font-weight: 300;
    line-height: 1.5;
    max-width: 580px;
  }

  .cover-centerpiece {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }

  .cover-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin: 14px 0;
  }

  .cover-stat-box {
    background: rgba(17, 24, 39, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 14px;
    border-left: 3px solid #00F5A0;
  }

  .cover-stat-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15pt;
    font-weight: 700;
    color: #ffffff;
  }

  .cover-stat-lbl {
    font-size: 7pt;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
  }

  .cover-meta {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 7.5pt;
    color: #6b7280;
  }

  .cover-meta strong {
    color: #d1d5db;
    display: block;
    margin-bottom: 2px;
    font-size: 8.5pt;
  }

  /* Section Headings */
  .section-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7pt;
    color: #00F5A0;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 4px;
  }

  h2 {
    font-family: 'Cinzel', serif;
    font-size: 17pt;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
  }

  h3 {
    font-size: 10pt;
    font-weight: 600;
    color: #f3f4f6;
    margin: 10px 0 4px 0;
  }

  p {
    color: #9ca3af;
    font-size: 9pt;
    line-height: 1.55;
    margin-bottom: 10px;
  }

  /* Cards & Grids */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 12px;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }

  .card {
    background: rgba(17, 24, 39, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 12px;
  }

  .card.highlight {
    border-color: rgba(0, 245, 160, 0.3);
    background: rgba(0, 245, 160, 0.03);
  }

  .card-title {
    font-size: 9pt;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .card-body {
    font-size: 8pt;
    color: #9ca3af;
    line-height: 1.45;
  }

  /* Color Swatches */
  .color-swatch-box {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #111827;
  }

  .swatch-color {
    height: 44px;
    width: 100%;
    position: relative;
  }

  .swatch-info {
    padding: 8px;
    font-size: 7.5pt;
  }

  .swatch-name {
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 2px;
  }

  .swatch-hex {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7pt;
    color: #00F5A0;
  }

  .swatch-role {
    font-size: 6.5pt;
    color: #6b7280;
    margin-top: 2px;
  }

  /* Comparison Table (Do vs Don't) */
  .audit-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 8pt;
  }

  .audit-table th {
    background: rgba(31, 41, 55, 0.6);
    color: #ffffff;
    padding: 7px 10px;
    text-align: left;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7pt;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .audit-table td {
    padding: 7px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #d1d5db;
    vertical-align: middle;
  }

  .audit-table tr:nth-child(even) td {
    background: rgba(17, 24, 39, 0.3);
  }

  .tag-do {
    color: #00F5A0;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }

  .tag-dont {
    color: #ef4444;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Badge System */
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 6.5pt;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    text-transform: uppercase;
  }

  .badge-emerald {
    background: rgba(0, 245, 160, 0.12);
    color: #00F5A0;
    border: 1px solid rgba(0, 245, 160, 0.3);
  }

  .badge-cyan {
    background: rgba(0, 217, 245, 0.12);
    color: #00D9F5;
    border: 1px solid rgba(0, 217, 245, 0.3);
  }

  .badge-red {
    background: rgba(239, 68, 68, 0.12);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .badge-amber {
    background: rgba(245, 158, 11, 0.12);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  /* Typography Specimens */
  .type-specimen {
    padding: 10px 12px;
    background: rgba(17, 24, 39, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    margin-bottom: 8px;
  }

  .type-family-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7pt;
    color: #00F5A0;
    margin-bottom: 3px;
    text-transform: uppercase;
  }

  .type-sample-display {
    font-family: 'Cinzel', serif;
    font-size: 14pt;
    color: #ffffff;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .type-sample-body {
    font-family: 'Inter', sans-serif;
    font-size: 9.5pt;
    color: #d1d5db;
  }

  .type-sample-mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    color: #00D9F5;
  }
</style>
</head>
<body>

  <!-- ================= PAGE 1: COVER ================= -->
  <div class="page cover">
    <div>
      <div class="cover-top-badge">
        <span>★</span> NEXUS CONTRACTGUARD™ · BRAND BRAIN v2.4
      </div>
      <div class="cover-title-area">
        <h1>NEXUS<br><span>CONTRACTGUARD</span>™</h1>
        <div class="cover-subtitle">
          The Official Brand Architecture, Visual Identity System & Strategic Positioning Doctrine for the World's First Air-Gapped Legal Diligence Workstation.
        </div>
      </div>
    </div>

    <!-- Centerpiece Emblem -->
    <div class="cover-centerpiece">
      <svg width="220" height="220" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00F5A0" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#00D9F5" stop-opacity="0.8"/>
          </linearGradient>
          <radialGradient id="sealCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00F5A0" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke="url(#glowGrad)" stroke-width="1.5" stroke-dasharray="4,2"/>
        <circle cx="100" cy="100" r="88" fill="url(#sealCenter)" stroke="#00F5A0" stroke-width="2"/>
        <circle cx="100" cy="100" r="68" fill="none" stroke="#00D9F5" stroke-width="1.2"/>
        <circle cx="100" cy="100" r="46" fill="#0b0f19" stroke="#00F5A0" stroke-width="1.5"/>
        <!-- 6-ray starburst core -->
        <line x1="100" y1="74" x2="100" y2="126" stroke="#00F5A0" stroke-width="2.5"/>
        <line x1="74" y1="100" x2="126" y2="100" stroke="#00F5A0" stroke-width="2.5"/>
        <line x1="82" y1="82" x2="118" y2="118" stroke="#00D9F5" stroke-width="1.8"/>
        <line x1="82" y1="118" x2="118" y2="82" stroke="#00D9F5" stroke-width="1.8"/>
        <circle cx="100" cy="100" r="5" fill="#ffffff"/>
        <!-- Surrounding Star Nodes -->
        <circle cx="100" cy="20" r="2.5" fill="#00F5A0"/>
        <circle cx="100" cy="180" r="2.5" fill="#00F5A0"/>
        <circle cx="20" cy="100" r="2.5" fill="#00F5A0"/>
        <circle cx="180" cy="100" r="2.5" fill="#00F5A0"/>
      </svg>
    </div>

    <div class="cover-grid">
      <div class="cover-stat-box">
        <div class="cover-stat-val">AIR-GAPPED</div>
        <div class="cover-stat-lbl">Core Technical Thesis</div>
      </div>
      <div class="cover-stat-box">
        <div class="cover-stat-val">0% AI SLOP</div>
        <div class="cover-stat-lbl">Deterministic AST Engine</div>
      </div>
      <div class="cover-stat-box">
        <div class="cover-stat-val">AM-LAW 100</div>
        <div class="cover-stat-lbl">Prestige Institutional Target</div>
      </div>
    </div>

    <div class="cover-meta">
      <div>
        <strong>EXECUTIVE BRAND DIRECTIVE · CONFIDENTIAL & PRIVILEGED</strong>
        Authored for Founders, Product Architects, Growth Teams & Creative Partners.<br>
        Standard Operating Reference for all UI, Marketing, and Print Collateral.
      </div>
      <div style="text-align: right; font-family: 'JetBrains Mono', monospace;">
        <div>DATE: NOVEMBER 2026</div>
        <div>SHA-256: 9E74A2B9C801FF7D</div>
      </div>
    </div>
  </div>

  <!-- ================= PAGE 2: BRAND STRATEGY & CORE DNA ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">Section 01</span>
      <span>Strategic Foundation & Brand DNA</span>
      <span>Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">EXECUTIVE STRATEGY</div>
    <h2>1. Brand Purpose, Vision & Core Doctrine</h2>
    <p>
      Nexus ContractGuard™ was founded on an uncompromising principle: transactional attorneys and corporate counsel should never have to risk legal malpractice or breach client confidentiality under ABA Model Rule 1.6 just to audit a commercial contract.
    </p>

    <div class="grid-2">
      <div class="card highlight">
        <div class="card-title">
          <span style="color:#00F5A0;">●</span> Brand Purpose (The "Why")
        </div>
        <div class="card-body">
          To eradicate catastrophic clerical, financial, and cross-reference defects in high-stakes agreements before closing signatures occur, with absolute client-side memory privacy.
        </div>
      </div>
      <div class="card highlight">
        <div class="card-title">
          <span style="color:#00D9F5;">●</span> Brand Vision (The Future)
        </div>
        <div class="card-body">
          To establish the universal standard for pre-signing legal diligence across all Am-Law 200 firms, Fortune 500 General Counsels, and private equity deal rooms worldwide.
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:10px;">THE CORE FOUR BRAND VALUES</div>
    <div class="grid-4">
      <div class="card">
        <div class="badge badge-emerald" style="margin-bottom:6px;">01. PRIVILEGE</div>
        <div class="card-title">Air-Gap First</div>
        <div class="card-body">
          Zero cloud servers, zero external LLM API transmission. In-browser RAM processing preserves absolute attorney-client privilege.
        </div>
      </div>
      <div class="card">
        <div class="badge badge-cyan" style="margin-bottom:6px;">02. CERTAINTY</div>
        <div class="card-title">Deterministic AST</div>
        <div class="card-body">
          Mathematical parsing and regex verification instead of generative guessing. 0% hallucination probability.
        </div>
      </div>
      <div class="card">
        <div class="badge badge-amber" style="margin-bottom:6px;">03. RIGOR</div>
        <div class="card-title">Forensic Proof</div>
        <div class="card-body">
          Every flag cites statutory doctrine (UCC § 3-114, Restatement § 203) and generates an execution-ready revision rider.
        </div>
      </div>
      <div class="card">
        <div class="badge badge-red" style="margin-bottom:6px;">04. DEFENSE</div>
        <div class="card-title">Pre-Signing Gate</div>
        <div class="card-body">
          We are the last line of defense before closing. Never sign a defective draft or an un-reconciled rider.
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:10px;">BRAND PERSONALITY & ARCHETYPE</div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">The Sovereign Forensic Auditor</div>
      <div class="card-body">
        <strong>Tone Archetype:</strong> Authoritative, meticulous, calm, uncompromising, institutional, and cryptographically sound.<br>
        <strong>What we are NOT:</strong> We are not a whimsical Silicon Valley chatbot, an unvetted AI toy, or an apologetic copilot. We speak with the quiet, formidable authority of a senior transactional partner standing before a Delaware Chancery judge.
      </div>
    </div>

    <div class="section-tag">IDEAL CUSTOMER PROFILE (ICP) MAPPING</div>
    <div class="grid-3">
      <div class="card">
        <div class="card-title">Am-Law 100/200 Partners</div>
        <div class="card-body">Need absolute air-gapped protection; forbidden by firm compliance committees from uploading client drafts to cloud AI.</div>
      </div>
      <div class="card">
        <div class="card-title">In-House General Counsels</div>
        <div class="card-body">Balancing enterprise liability caps against aggressive indemnities; cannot afford a $45k clerical discrepancy in vendor MSAs.</div>
      </div>
      <div class="card">
        <div class="card-title">Boutique & Solo Counsel</div>
        <div class="card-body">Requires the proofreading horsepower of a 5-associate diligence team in under 350ms without recurring SaaS retainer overhead.</div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · BRAND BRAIN</span>
      <span>CONFIDENTIAL · INTERNAL USE ONLY</span>
      <span>PAGE 02</span>
    </div>
  </div>

  <!-- ================= PAGE 3: VISUAL IDENTITY & COLOR ARCHITECTURE ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">Section 02</span>
      <span>Visual Identity & Color System</span>
      <span>Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">COLOR PALETTE ARCHITECTURE</div>
    <h2>2. Chromatic System & Dark Matrix</h2>
    <p>
      The visual identity bridges the gravitas of a traditional Am-Law courtroom with the surgical precision of an air-gapped cryptographic workstation. Deep obsidian voids prevent eye fatigue during midnight deal negotiations, while neon teal and emerald accents direct immediate focus to critical liability items.
    </p>

    <div class="section-tag">PRIMARY BASE HUES (VOID MATRIX)</div>
    <div class="grid-3">
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#030712; border-bottom:1px solid rgba(255,255,255,0.1);"></div>
        <div class="swatch-info">
          <div class="swatch-name">Obsidian Void</div>
          <div class="swatch-hex">#030712</div>
          <div class="swatch-role">Primary canvas & application background</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#0B0F19; border-bottom:1px solid rgba(255,255,255,0.1);"></div>
        <div class="swatch-info">
          <div class="swatch-name">Deep Navy Slate</div>
          <div class="swatch-hex">#0B0F19</div>
          <div class="swatch-role">Containers, modals & floating action docks</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#111827; border-bottom:1px solid rgba(255,255,255,0.1);"></div>
        <div class="swatch-info">
          <div class="swatch-name">Steel Card Surface</div>
          <div class="swatch-hex">#111827</div>
          <div class="swatch-role">Card fills, table headers & input buffers</div>
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:8px;">ACTIVE BRAND ACCENTS (SIGNATURE SIGNALS)</div>
    <div class="grid-4">
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#00F5A0;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Cyber Emerald</div>
          <div class="swatch-hex">#00F5A0</div>
          <div class="swatch-role">Air-Gap verified, CTAs, safe metrics</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#00D9F5;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Electric Cyan</div>
          <div class="swatch-hex">#00D9F5</div>
          <div class="swatch-role">AST parsers, active tabs & links</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#EF4444;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Defect Crimson</div>
          <div class="swatch-hex">#EF4444</div>
          <div class="swatch-role">Broken targets, clerical mismatches</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#F59E0B;"></div>
        <div class="swatch-info">
          <div class="swatch-name">Caution Amber</div>
          <div class="swatch-hex">#F59E0B</div>
          <div class="swatch-role">Missing exhibits, carve-out warnings</div>
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:8px;">GRADIENT & GLASSMORPHISM FORMULAS</div>
    <div class="grid-2">
      <div class="card" style="background:linear-gradient(135deg, rgba(0,245,160,0.1) 0%, rgba(0,217,245,0.1) 100%); border:1px solid rgba(0,245,160,0.3);">
        <div class="card-title">Signature Brand Gradient</div>
        <div class="card-body">
          <code style="font-family:'JetBrains Mono'; font-size:7pt; color:#00F5A0;">linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)</code><br>
          Applied to display text spans, primary CTAs, active indicator rings, and hero emblem lighting.
        </div>
      </div>
      <div class="card" style="background:rgba(17,24,39,0.7); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.08);">
        <div class="card-title">Aero Glassmorphic Surface</div>
        <div class="card-body">
          <code style="font-family:'JetBrains Mono'; font-size:7pt; color:#00D9F5;">backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08)</code><br>
          Floating dock and modal styling that elevates critical controls without occluding underlying contract text.
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:8px;">CONTRAST & ACCESSIBILITY SPECIFICATIONS</div>
    <div class="card">
      <div class="grid-3" style="margin-bottom:0;">
        <div>
          <strong style="color:#ffffff; font-size:8pt;">WCAG AAA Text Contrast:</strong>
          <p style="margin-bottom:0; font-size:7.5pt;">Pure White (#FFFFFF) and Cool Gray (#E5E7EB) against Obsidian Void (#030712) maintain a 18.2:1 contrast ratio.</p>
        </div>
        <div>
          <strong style="color:#ffffff; font-size:8pt;">Print Monochromatic Fallback:</strong>
          <p style="margin-bottom:0; font-size:7.5pt;">Official Diligence Certificates strictly convert to 100% black ink on white stock for court admissibility.</p>
        </div>
        <div>
          <strong style="color:#ffffff; font-size:8pt;">Color Blindness Safety:</strong>
          <p style="margin-bottom:0; font-size:7.5pt;">Every status badge couples color with an explicit semantic icon (✓, ✕, ⚠, ●) and uppercase state text.</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · BRAND BRAIN</span>
      <span>CONFIDENTIAL · INTERNAL USE ONLY</span>
      <span>PAGE 03</span>
    </div>
  </div>

  <!-- ================= PAGE 4: TYPOGRAPHY & LOGOMARK ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">Section 03</span>
      <span>Typography System & Logomark</span>
      <span>Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">TYPOGRAPHIC HEIRARCHY</div>
    <h2>3. Institutional & Forensic Typography</h2>
    <p>
      Typography reflects our dual identity: judicial gravitas and cryptographic rigor. We never use playful, geometric novelty fonts. We combine classical serif authority for headers with high-density monospace for technical verification.
    </p>

    <div class="type-specimen">
      <div class="type-family-name">Display & Hero Headings · Cinzel / Times-Roman (Serif)</div>
      <div class="type-sample-display">Pre-Signing Legal Defense. Never Sign a Defective Contract.</div>
      <p style="margin-top:4px; margin-bottom:0; font-size:7.5pt;">Usage: Landing hero headlines, Diligence Certificate titles, article headings, Am-Law badges. Weight: 700 / 900.</p>
    </div>

    <div class="type-specimen">
      <div class="type-family-name">User Interface & Body Copy · Inter / Plus Jakarta Sans</div>
      <div class="type-sample-body">
        Section 4.1 specifies purchase consideration of $250,000 in words but records $205,000 in numbers, creating an irreconcilable $45,000 clerical shortfall under UCC § 3-114.
      </div>
      <p style="margin-top:4px; margin-bottom:0; font-size:7.5pt;">Usage: Contract text viewers, audit finding descriptions, pricing tables, tooltips, dialogs. Weight: 400 / 500 / 600.</p>
    </div>

    <div class="type-specimen">
      <div class="type-family-name">Technical Proof & Cryptographic Data · JetBrains Mono</div>
      <div class="type-sample-mono">SHA256: cf9acf7bbb77f93475585ed3ee96a33b6dd1642acd01287c9c9b56f3f91325fc [0ms LATENCY]</div>
      <p style="margin-top:4px; margin-bottom:0; font-size:7.5pt;">Usage: Hash fingerprints, execution speeds, AST nodes, Bates numbers, statutory citations. Weight: 400 / 700.</p>
    </div>

    <div class="section-tag" style="margin-top:10px;">THE OFFICIAL FORENSIC DILIGENCE SEAL</div>
    <div class="grid-2">
      <div class="card" style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0B0F19; border:1px solid rgba(0,245,160,0.2); padding:10px;">
        <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="none" stroke="#00F5A0" stroke-width="2" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="#00F5A0" stroke-width="1.2" stroke-dasharray="2,2" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#00F5A0" stroke-width="1.5" />
          <circle cx="100" cy="100" r="48" fill="none" stroke="#00F5A0" stroke-width="1" />
          <!-- Starburst rays in center -->
          <line x1="100" y1="78" x2="100" y2="122" stroke="#00F5A0" stroke-width="2"/>
          <line x1="78" y1="100" x2="122" y2="100" stroke="#00F5A0" stroke-width="2"/>
          <line x1="84" y1="84" x2="116" y2="116" stroke="#00F5A0" stroke-width="1.5"/>
          <line x1="84" y1="116" x2="116" y2="84" stroke="#00F5A0" stroke-width="1.5"/>
          <circle cx="100" cy="100" r="4" fill="#00F5A0" />
        </svg>
        <div style="font-family:'JetBrains Mono'; font-size:6.5pt; color:#00F5A0; margin-top:4px;">
          CONCENTRIC REGISTRAR SEAL
        </div>
      </div>
      <div class="card">
        <div class="card-title">Seal Anatomy & Legal Heritage</div>
        <div class="card-body">
          <strong>Concentric Double-Ring Geometry:</strong> Echoes the 200-year tradition of court-certified notarial and registrar seals.<br>
          <strong>Center 6-Ray Node:</strong> Symbolizes the mathematical convergence of cross-clause AST integrity.<br>
          <strong>Circumference Legal Inscription:</strong> Proves execution within volatile client RAM under ABA Model Rule 1.6.<br>
          <strong>Official Print Rule:</strong> Rendered in deep navy or black ink on formal PDF certificates; never in playful multi-color.
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:8px;">LOGOMARK CLEARSPACE & MISUSE RULES</div>
    <div class="card">
      <div class="grid-2" style="margin-bottom:0;">
        <div class="card-body">
          <strong style="color:#00F5A0;">Clearspace Requirement:</strong> Maintain a minimum padding around the logomark equal to the height of the capital letter "N" in NEXUS (1.5x minimum clearance).
        </div>
        <div class="card-body">
          <strong style="color:#ef4444;">Strictly Prohibited Misuses:</strong> Never skew or rotate the mark, never change the typeface, and never render against bright or non-monochromatic light backdrops.
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · BRAND BRAIN</span>
      <span>CONFIDENTIAL · INTERNAL USE ONLY</span>
      <span>PAGE 04</span>
    </div>
  </div>

  <!-- ================= PAGE 5: VOICE, TONE & ANTI-SLOP DICTIONARY ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">Section 04</span>
      <span>Tone, Voice & Anti-Slop Doctrine</span>
      <span>Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">EDITORIAL STANDARDS</div>
    <h2>4. The Anti-Slop Lexicon: What We Say vs. Never Say</h2>
    <p>
      In high-stakes legal practice, generic AI terminology repels elite corporate counsel. Transactional lawyers fear hallucinations, data leakage, and unauthorized cloud transmission. Our language must remain surgically precise, deterministic, and grounded in legal practice.
    </p>

    <table class="audit-table">
      <thead>
        <tr>
          <th style="width:30%;">NEVER USE (BANNED AI SLOP)</th>
          <th style="width:35%;">OFFICIAL REPLACEMENT</th>
          <th style="width:35%;">STRATEGIC RATIONALE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="tag-dont">✕ "AI Assistant / Chatbot"</span></td>
          <td><span class="tag-do">✓ "Deterministic In-RAM AST Engine"</span></td>
          <td>Lawyers don't want conversational assistants; they want deterministic proof.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "Cloud AI Analysis"</span></td>
          <td><span class="tag-do">✓ "Air-Gapped Client-Side Audit"</span></td>
          <td>Protects ABA Model Rule 1.6 privilege. Zero data ever leaves the machine.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "Magic Redline / Smart Fix"</span></td>
          <td><span class="tag-do">✓ "Statutory Revision Rider Schedule"</span></td>
          <td>Attorneys require formal, signed closing riders, not black-box auto-edits.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "Prompt / Generative Output"</span></td>
          <td><span class="tag-do">✓ "Forensic Pre-Signing Diligence Memo"</span></td>
          <td>Eliminates the fear of generative hallucination or fabricated contract terms.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "Monthly SaaS Subscription"</span></td>
          <td><span class="tag-do">✓ "Perpetual Workstation License"</span></td>
          <td>Firms prefer capital expenditure and perpetual software without vendor lock-in.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "Upload your document"</span></td>
          <td><span class="tag-do">✓ "Load into volatile local memory buffer"</span></td>
          <td>Removes the psychological friction and security anxiety of cloud uploads.</td>
        </tr>
      </tbody>
    </table>

    <div class="section-tag" style="margin-top:10px;">MESSAGING ARCHITECTURE FOR KEY AUDIENCES</div>
    <div class="grid-3">
      <div class="card">
        <div class="card-title">M&A & Deal Counsel</div>
        <div class="card-body">
          <em>"Prevent $45k clerical gaps, missing disclosure exhibits, and broken survival clauses before the 2:00 AM closing call."</em>
        </div>
      </div>
      <div class="card">
        <div class="card-title">General Counsels</div>
        <div class="card-body">
          <em>"Zero cloud transmission. Full compliance with institutional enterprise confidentiality mandates and SEC disclosure rules."</em>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Solo Transactional Lawyers</div>
        <div class="card-body">
          <em>"Audit 80-page contracts with the forensic firepower of an Am-Law 100 diligence army in under 350 milliseconds."</em>
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:10px;">CORE HERO COPY & SOUNDBITES</div>
    <div class="card highlight">
      <div class="grid-2" style="margin-bottom:0;">
        <div class="card-body">
          <strong style="color:#ffffff;">The Primary Headline:</strong><br>
          "Pre-Signing Legal Defense. Never Sign a Defective Contract."
        </div>
        <div class="card-body">
          <strong style="color:#ffffff;">The Technical Guarantee:</strong><br>
          "100% In-Browser RAM execution in under 350ms. Zero cloud servers. Zero data leakage. Absolute client confidentiality."
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · BRAND BRAIN</span>
      <span>CONFIDENTIAL · INTERNAL USE ONLY</span>
      <span>PAGE 05</span>
    </div>
  </div>

  <!-- ================= PAGE 6: PRODUCT ECOSYSTEM & COMMERCIAL ARCHITECTURE ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">Section 05</span>
      <span>Commercial Architecture & Final Seal</span>
      <span>Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">COMMERCIAL PACKAGING & TIERS</div>
    <h2>5. Product Modules & Perpetual Licensing Model</h2>
    <p>
      Nexus ContractGuard™ rejects recurring subscription bloat in favor of institutional perpetual licensing. Once unlocked, the workstation operates completely air-gapped without requiring cloud authentication or telemetry phone-homes.
    </p>

    <div class="grid-2" style="margin-bottom:12px;">
      <div class="card highlight" style="border-left: 4px solid #00F5A0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div class="card-title" style="margin-bottom:0; font-size:10pt;">SOLO COUNSEL LICENSE</div>
          <span class="badge badge-emerald">$199 PERPETUAL</span>
        </div>
        <div class="card-body" style="font-size:7.5pt;">
          <strong>Target:</strong> Solo practitioners, boutique transactional attorneys, contract managers.<br>
          <strong>Included Capabilities:</strong>
          <ul style="margin:4px 0 0 14px; line-height:1.5;">
            <li>Unlimited In-Memory Pre-Signing Audits</li>
            <li>Single Draft AST Integrity & Clerical Parity Engine</li>
            <li>Comparative Myers-Diff Redline Module</li>
            <li>Official Diligence Certificate Generator with Corporate Seal</li>
            <li>1-Workstation Perpetual Offline Access</li>
          </ul>
        </div>
      </div>

      <div class="card highlight" style="border-left: 4px solid #00D9F5;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div class="card-title" style="margin-bottom:0; font-size:10pt;">FIRM ENTERPRISE SUITE</div>
          <span class="badge badge-cyan">$299 PERPETUAL</span>
        </div>
        <div class="card-body" style="font-size:7.5pt;">
          <strong>Target:</strong> Am-Law partner teams, multi-counsel practices, corporate legal departments.<br>
          <strong>Included Capabilities:</strong>
          <ul style="margin:4px 0 0 14px; line-height:1.5;">
            <li>Everything in Solo Counsel License</li>
            <li>Court Bates Stamping & Exhibit Numbering Suite</li>
            <li>Smart PII Redactor (Financial & Identity Scrub)</li>
            <li>Liability & Indemnity Reconciler (Delaware & NY Riders)</li>
            <li>Am-Law 100 Commercial Contract Template Vault</li>
            <li>Multi-seat deployment & customized firm seals</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section-tag">THE 5-IN-1 FORENSIC ENGINES</div>
    <div class="grid-3" style="margin-bottom:12px;">
      <div class="card">
        <div class="card-title">1. Parity & AST</div>
        <div class="card-body">Extracts number-word discrepancies & cross-references.</div>
      </div>
      <div class="card">
        <div class="card-title">2. Myers Diff</div>
        <div class="card-body">High-speed character-level redlining between drafts.</div>
      </div>
      <div class="card">
        <div class="card-title">3. Deed Proofreader</div>
        <div class="card-body">Detects ambiguities, passive covenants & dangling exhibits.</div>
      </div>
    </div>

    <div class="section-tag">BRAND GUARDIAN RATIFICATION & AUTHENTICATION</div>
    <div class="card" style="border: 1px solid rgba(0, 245, 160, 0.4); background: rgba(0, 245, 160, 0.02);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title" style="color:#00F5A0; font-size:9pt;">OFFICIAL BRAND BRAIN GOVERNANCE RATIFICATION</div>
          <p style="font-size:7.5pt; max-width:440px; margin-bottom:6px;">
            This document establishes the inviolable brand identity doctrine of Nexus ContractGuard™. All product interfaces, client-facing certifications, and commercial touchpoints must strictly conform to these standards.
          </p>
          <div style="font-size:7pt; color:#9ca3af; font-family:'JetBrains Mono', monospace;">
            RATIFIED BY: BRAND GUARDIAN & EXECUTIVE COUNCIL<br>
            REGISTERED DOMAIN: WWW.NEXUS-OS.STORE<br>
            SECURITY CLASSIFICATION: CONFIDENTIAL BRAND INTELLECTUAL PROPERTY
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'JetBrains Mono', monospace; font-size:6.5pt; color:#00F5A0; margin-bottom:2px;">
            [AUTHENTIC SEAL RATIFIED]
          </div>
          <div style="width:110px; border-bottom:1px solid #4b5563; padding-bottom:2px; margin-left:auto;">
            <svg width="100" height="24" viewBox="0 0 140 40">
              <path d="M 10 28 Q 30 5, 55 24 T 95 18 T 130 12" fill="none" stroke="#00F5A0" stroke-width="2" />
            </svg>
          </div>
          <div style="font-size:6.5pt; color:#6b7280; font-family:'JetBrains Mono', monospace; margin-top:2px;">
            VERIFIED REGISTRAR
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · BRAND BRAIN</span>
      <span>CONFIDENTIAL · INTERNAL USE ONLY</span>
      <span>PAGE 06</span>
    </div>
  </div>

</body>
</html>
"""

async def generate():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.set_content(HTML_CONTENT, wait_until='networkidle')
        await page.wait_for_timeout(2000)
        
        pdf_path = 'C:/Users/lenovo/.gemini/antigravity/brain/8f15943f-fbf5-4a66-8801-09de08672d63/Nexus_ContractGuard_Brand_Brain.pdf'
        await page.pdf(
            path=pdf_path,
            format='A4',
            print_background=True,
            margin={'top': '0mm', 'bottom': '0mm', 'left': '0mm', 'right': '0mm'}
        )
        print('PDF created successfully at:', pdf_path)
        
        doc = fitz.open(pdf_path)
        print('Total pages generated:', len(doc))
        for i, page_doc in enumerate(doc):
            pix = page_doc.get_pixmap(dpi=150)
            img_path = f'C:/Users/lenovo/.gemini/antigravity/brain/8f15943f-fbf5-4a66-8801-09de08672d63/brand_brain_page_{i+1}_v2.png'
            pix.save(img_path)
            print(f'Rendered page {i+1} screenshot to {img_path}')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(generate())
