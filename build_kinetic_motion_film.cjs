const fs = require('fs');
const path = require('path');

const filmAssetsDir = path.join(__dirname, 'public', 'assets', 'film');

function getBase64Image(filename) {
  const filePath = path.join(filmAssetsDir, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

const imgAuditRedFlags = getBase64Image('audit_red_flags.png');
const imgDefinedTerms = getBase64Image('defined_terms.png');
const imgBatesStamping = getBase64Image('bates_stamping.png');
const imgPiiRedactor = getBase64Image('pii_redactor.png');
const imgCleanCockpit = getBase64Image('clean_cockpit.png');

console.log('Loaded base64 images for kinetic motion film.');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>ContractGuard™ — Kinetic 60FPS Launch Film</title>
<style>
  :root {
    --bg-dark: #020509;
    --emerald: #10B981;
    --emerald-glow: rgba(16, 185, 129, 0.5);
    --cyan: #00F0FF;
    --cyan-glow: rgba(0, 240, 255, 0.45);
    --crimson: #EF4444;
    --crimson-glow: rgba(239, 68, 68, 0.5);
    --amber: #F59E0B;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body {
    background: #010407;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 16:9 Cinema Container */
  #cinema-stage {
    position: relative;
    width: 100vw;
    height: 100vh;
    max-width: 177.78vh;
    max-height: 56.25vw;
    background: #02060b;
    box-shadow: 0 0 120px rgba(0,0,0,0.95), 0 0 50px rgba(16,185,129,0.1);
    overflow: hidden;
    perspective: 1400px;
  }

  /* Ambient Particle Stars Canvas */
  #stars-canvas {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  /* 3D Dynamic Camera Rig */
  #camera-rig {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform-origin: center center;
    transition: transform 0.05s linear;
    z-index: 5;
  }

  /* Screen Shake Wrapper */
  #shake-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  /* Realistic Virtual Mouse Cursor */
  #virtual-cursor {
    position: absolute;
    width: 24px;
    height: 24px;
    z-index: 999;
    pointer-events: none;
    transform: translate(-2px, -2px);
    transition: transform 0.12s cubic-bezier(0.16, 1, 0.3, 1);
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.8));
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  #virtual-cursor svg {
    width: 20px;
    height: 20px;
  }
  .cursor-ripple {
    position: absolute;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid var(--emerald);
    transform: translate(-12px, -12px) scale(0);
    opacity: 0;
    pointer-events: none;
    box-shadow: 0 0 16px var(--emerald);
  }
  .cursor-ripple.active {
    animation: rippleWave 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  }
  @keyframes rippleWave {
    0% { transform: translate(-12px, -12px) scale(0.2); opacity: 1; }
    100% { transform: translate(-12px, -12px) scale(1.6); opacity: 0; }
  }

  /* Top HUD Bar */
  .film-hud-header {
    position: absolute;
    top: 5%;
    left: 4%;
    right: 4%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
    pointer-events: none;
  }
  .hud-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(5, 10, 15, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 14px;
    border-radius: 10px;
  }
  .hud-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--emerald);
    box-shadow: 0 0 10px var(--emerald);
    animation: pulseDot 1.5s infinite;
  }
  @keyframes pulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.75); opacity: 0.4; }
  }

  /* Floating Cinematic Titles */
  .title-teleprompter {
    position: absolute;
    top: 13%;
    left: 4%;
    right: 4%;
    z-index: 90;
    pointer-events: none;
    text-shadow: 0 4px 20px rgba(0,0,0,0.9);
  }
  .tele-label {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    font-weight: 800;
    color: var(--emerald);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .tele-h1 {
    font-size: clamp(24px, 3.2vw, 42px);
    font-weight: 900;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -0.025em;
  }
  .tele-sub {
    font-size: clamp(12px, 1.3vw, 16px);
    color: #9CA3AF;
    margin-top: 6px;
    max-width: 650px;
  }

  /* SCENE LAYERS */
  .scene-canvas-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
  }
  .scene-canvas-layer.active {
    opacity: 1;
    pointer-events: auto;
  }

  /* 3D Interactive Laptop / Cockpit Model */
  .laptop-chassis {
    position: relative;
    width: 82%;
    max-width: 1080px;
    background: #081119;
    border: 2px solid #1E293B;
    border-radius: 16px;
    padding: 10px 10px 18px 10px;
    box-shadow: 0 40px 120px rgba(0,0,0,0.95), 0 0 60px rgba(16,185,129,0.12);
    transform-style: preserve-3d;
  }
  .laptop-screen-display {
    width: 100%;
    aspect-ratio: 16 / 9.8;
    background: #030712;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .laptop-screen-display img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* LIVE ANIMATED OVERLAYS ON TOP OF UI */
  /* Overlay 1: Clause 4.1 Highlight & Laser Reticle */
  .overlay-clause-reticle {
    position: absolute;
    top: 31%;
    left: 23%;
    width: 68%;
    height: 38px;
    border: 2px solid var(--crimson);
    background: rgba(239, 68, 68, 0.15);
    border-radius: 6px;
    box-shadow: 0 0 30px var(--crimson-glow);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 13px;
    color: #fff;
    opacity: 0;
    transform: scale(0.96);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .overlay-clause-reticle.active {
    opacity: 1;
    transform: scale(1);
  }
  .reticle-badge {
    background: var(--crimson);
    color: #fff;
    font-weight: 800;
    font-size: 9.5px;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  /* Overlay 2: Live "Run Integrity Audit" Button */
  .live-action-button {
    position: absolute;
    bottom: 27.5%;
    right: 3.5%;
    background: linear-gradient(90deg, #10B981, #00F0FF);
    color: #000;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-weight: 800;
    font-size: 12px;
    padding: 10px 22px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 0 25px rgba(16,185,129,0.5);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .live-action-button.pressed {
    transform: scale(0.92);
    box-shadow: 0 0 45px rgba(0,240,255,0.8);
  }

  /* Overlay 3: Laser Scan Line */
  .laser-radar-beam {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, transparent, var(--cyan), transparent);
    box-shadow: 0 0 25px var(--cyan), 0 0 10px #fff;
    left: -10px;
    opacity: 0;
    pointer-events: none;
  }

  /* Overlay 4: Live Stamped Risk Badge */
  .live-risk-stamp {
    position: absolute;
    top: 48%;
    left: 23%;
    background: var(--crimson);
    color: #fff;
    padding: 10px 18px;
    border-radius: 12px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 35px var(--crimson-glow);
    border: 2px solid #fff;
    opacity: 0;
    transform: scale(2) rotate(-6deg);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .live-risk-stamp.stamped {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  /* Overlay 5: Cascade Red Hazard Cards */
  .liability-cards-stack {
    position: absolute;
    bottom: 4%;
    left: 22%;
    right: 3%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }
  .hazard-card-item {
    background: rgba(15, 7, 9, 0.92);
    border: 1px solid rgba(239, 68, 68, 0.4);
    border-radius: 8px;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.8);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hazard-card-item.show {
    opacity: 1;
    transform: translateY(0);
  }

  /* Overlay 6: Live PII Black Ink Redaction Sweep */
  .pii-redact-mask-line {
    position: absolute;
    background: #000;
    border-radius: 3px;
    border: 1px solid #374151;
    height: 18px;
    box-shadow: 0 0 10px rgba(0,0,0,0.8);
    width: 0%;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .pii-redact-mask-line.covered {
    width: 100%;
  }

  /* Overlay 7: Hydraulic Bates Stamp Tool */
  .hydraulic-stamp-tool {
    position: absolute;
    bottom: 18%;
    right: 8%;
    background: #FFFFFF;
    color: #000000;
    border: 2px solid #000000;
    padding: 6px 14px;
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 13px;
    font-weight: 900;
    box-shadow: 0 10px 30px rgba(0,0,0,0.9);
    opacity: 0;
    transform: scale(2.4) translateY(-40px);
    transition: all 0.25s cubic-bezier(0.2, 0.9, 0.3, 1);
  }
  .hydraulic-stamp-tool.slammed {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  /* Overlay 8: 3D Client Memo Flyout */
  .flyout-memo-document {
    position: absolute;
    width: 48%;
    max-width: 520px;
    background: #0b151e;
    border: 2px solid var(--emerald);
    border-radius: 14px;
    padding: 24px;
    box-shadow: 0 30px 90px rgba(0,0,0,0.95), 0 0 50px rgba(16,185,129,0.25);
    opacity: 0;
    transform: rotateX(20deg) translateY(60px) scale(0.85);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .flyout-memo-document.elevated {
    opacity: 1;
    transform: rotateX(8deg) translateY(0) scale(1);
  }

  /* Overlay 9: Kinetic Pricing Slabs */
  .pricing-kinetic-container {
    width: 84%;
    max-width: 980px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .pricing-kinetic-container.active {
    opacity: 1;
    transform: scale(1);
  }
  .price-slab {
    background: #050A0F;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    padding: 26px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.9);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .price-slab.featured {
    border-color: var(--emerald);
    background: radial-gradient(circle at 50% 0%, rgba(16,185,129,0.12) 0%, #050A0F 80%);
    box-shadow: 0 20px 70px rgba(0,0,0,0.9), 0 0 30px rgba(16,185,129,0.25);
  }
  .slab-huge-cost {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 46px;
    font-weight: 900;
    color: #fff;
    margin: 12px 0 4px 0;
  }
  .slab-buy-btn {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: none;
    font-weight: 800;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .slab-buy-btn.solo { background: #1E293B; color: #fff; }
  .slab-buy-btn.solo:hover { background: #334155; }
  .slab-buy-btn.firm { background: var(--emerald); color: #000; box-shadow: 0 0 20px var(--emerald-glow); }
  .slab-buy-btn.firm:hover { background: #34D399; }

  /* Subtitles Bar */
  .film-subtitles-bar {
    position: absolute;
    bottom: 12%;
    left: 6%;
    right: 6%;
    text-align: center;
    z-index: 95;
    pointer-events: none;
  }
  .subtitles-box {
    display: inline-block;
    padding: 6px 18px;
    background: rgba(0,0,0,0.7);
    border-radius: 8px;
    backdrop-filter: blur(8px);
    font-size: clamp(14px, 1.8vw, 20px);
    font-weight: 700;
    color: #F3F4F6;
    letter-spacing: -0.01em;
  }

  /* Bottom Controls Dock */
  .cinema-dock {
    position: absolute;
    bottom: 3%;
    left: 4%;
    right: 4%;
    z-index: 110;
    background: rgba(4, 9, 14, 0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 10px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .timeline-track {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }
  .timeline-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #10B981, #00F0FF);
    box-shadow: 0 0 10px var(--emerald);
  }
  .dock-controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dock-btn {
    background: none;
    border: none;
    color: #9CA3AF;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }
  .dock-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
  .dock-btn.active { color: var(--emerald); }

  /* Scene Jump Chips */
  .dock-chips { display: flex; gap: 6px; }
  .dock-chip {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9.5px;
    color: #6B7280;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 3px 8px;
    border-radius: 6px;
    cursor: pointer;
  }
  .dock-chip.active {
    color: var(--emerald);
    border-color: var(--emerald);
    background: rgba(16, 185, 129, 0.1);
  }

  /* Big Play Gate */
  #play-curtain {
    position: absolute;
    inset: 0;
    z-index: 200;
    background: rgba(2, 6, 10, 0.75);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.4s ease;
  }
  .curtain-play-btn {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.18);
    border: 2px solid var(--emerald);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 50px var(--emerald-glow);
    transition: transform 0.3s ease;
  }
  #play-curtain:hover .curtain-play-btn {
    transform: scale(1.1);
  }
</style>
</head>
<body>

<div id="cinema-stage">
  
  <!-- Canvas Particles -->
  <canvas id="stars-canvas"></canvas>

  <!-- Animated Virtual Mouse Cursor -->
  <div id="virtual-cursor">
    <div id="cursor-ripple" class="cursor-ripple"></div>
    <svg viewBox="0 0 24 24" fill="#FFFFFF" stroke="#000000" stroke-width="1.5">
      <path d="M4 3l15 11-7 1-4 6-2-1 3-5-5-1z"/>
    </svg>
  </div>

  <!-- HUD Top Bar -->
  <div class="film-hud-header">
    <div class="hud-badge">
      <span class="hud-dot"></span>
      <span style="font-weight:800; font-size:12px; letter-spacing:-0.01em;">ContractGuard™</span>
      <span style="font-family:ui-monospace,monospace; font-size:9.5px; color:var(--emerald); background:rgba(16,185,129,0.15); padding:1px 6px; border-radius:4px;">PRODUCTIONS</span>
    </div>

    <div class="hud-badge" style="font-family:ui-monospace,monospace; font-size:10px; color:#9CA3AF;">
      <span id="hud-mode-indicator">100% AIR-GAPPED RAM · ZERO CLOUD TELEMETRY</span>
    </div>
  </div>

  <!-- Teleprompter Super Titles -->
  <div class="title-teleprompter">
    <div id="tele-label" class="tele-label">STAGE 01 · THE THREAT</div>
    <h1 id="tele-h1" class="tele-h1">ONE CLERICAL CONTRADICTION.<br>$45,000 IN UNSEEN LIABILITY.</h1>
    <p id="tele-sub" class="tele-sub">A single drafting oversight before closing can cost millions. But pasting privileged terms into cloud AI violates legal ethics.</p>
  </div>

  <!-- 3D Camera Rig & Screen Shake Container -->
  <div id="camera-rig">
    <div id="shake-layer">

      <!-- ============================================================ -->
      <!-- SCENE 1 & 2 & 3: LIVING COCKPIT WITH REAL INTERACTIVE LAYERS -->
      <!-- ============================================================ -->
      <div id="scene-cockpit-group" class="scene-canvas-layer active">
        <div class="laptop-chassis" id="cockpit-chassis">
          
          <div class="laptop-screen-display" id="screen-display-box">
            <!-- Dynamic Background Image (Swaps seamlessly between stages) -->
            <img id="cockpit-img-base" src="${imgCleanCockpit}" alt="ContractGuard Main Interface" />

            <!-- Laser Radar Beam -->
            <div id="laser-beam" class="laser-radar-beam"></div>

            <!-- Overlay: Clause 4.1 Reticle -->
            <div id="clause-reticle" class="overlay-clause-reticle">
              <div><strong>Clause 4.1:</strong> "Two Hundred Fifty Thousand" <strong>≠ ($205,000)</strong></div>
              <div class="reticle-badge">CRITICAL CONTRADICTION</div>
            </div>

            <!-- Live Button for Cursor to Click -->
            <div id="live-run-btn" class="live-action-button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Run Integrity Audit</span>
            </div>

            <!-- Live Stamped Risk Badge -->
            <div id="live-risk-stamp" class="live-risk-stamp">
              <div style="font-size:24px; font-weight:900;">91</div>
              <div style="font-size:9px; font-weight:800; letter-spacing:0.1em;">CRITICAL RISK</div>
            </div>

            <!-- Cascade Red Hazard Cards -->
            <div class="liability-cards-stack">
              <div id="card-1" class="hazard-card-item">
                <span style="color:#FCA5A5; font-weight:700;">⚠ "indemnify and hold harmless"</span>
                <span style="color:var(--emerald); font-family:ui-monospace,monospace; font-weight:600;">Direct Claim Cap Guidance</span>
              </div>
              <div id="card-2" class="hazard-card-item">
                <span style="color:#FCA5A5; font-weight:700;">⚠ "sole discretion"</span>
                <span style="color:var(--cyan); font-family:ui-monospace,monospace; font-weight:600;">Replaced with Commercially Reasonable</span>
              </div>
              <div id="card-3" class="hazard-card-item">
                <span style="color:#FCA5A5; font-weight:700;">⚠ "without notice"</span>
                <span style="color:var(--amber); font-family:ui-monospace,monospace; font-weight:600;">Mandatory 30-Day Cure Period</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SCENE 4: LIVE PII REDACTION & BATES STAMPING -->
      <!-- ============================================================ -->
      <div id="scene-tools-group" class="scene-canvas-layer">
        <div class="laptop-chassis" style="max-width:1040px;">
          <div class="laptop-screen-display" style="aspect-ratio:16/9.5;">
            <img id="tools-img-base" src="${imgPiiRedactor}" alt="PII Redactor and Bates Tool" />

            <!-- Animated Black Redaction Bars Over Banking Numbers -->
            <div id="pii-mask-1" class="pii-redact-mask-line" style="top:52.5%; left:62%; width:0%; max-width:180px;"></div>
            <div id="pii-mask-2" class="pii-redact-mask-line" style="top:57.5%; left:62%; width:0%; max-width:140px;"></div>

            <!-- Live Hydraulic Bates Stamp Tool -->
            <div id="bates-stamp-tool" class="hydraulic-stamp-tool">
              EX-000001
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SCENE 5: 3D CLIENT MEMORANDUM ELEVATION -->
      <!-- ============================================================ -->
      <div id="scene-memo-group" class="scene-canvas-layer">
        <div id="flyout-memo" class="flyout-memo-document">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--emerald); padding-bottom:12px; margin-bottom:16px;">
            <div>
              <h2 style="font-size:17px; font-weight:900; color:#fff;">EXECUTIVE AUDIT MEMORANDUM</h2>
              <p style="font-size:10px; color:#9CA3AF; font-family:ui-monospace,monospace;">ATTORNEY-CLIENT PRIVILEGED WORK PRODUCT</p>
            </div>
            <div style="background:rgba(16,185,129,0.15); border:1px solid var(--emerald); color:var(--emerald); font-family:ui-monospace,monospace; font-size:10px; font-weight:800; padding:4px 8px; border-radius:4px;">
              ABA RULE 1.6 CERTIFIED
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; font-size:12px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
              <span>Financial Variance (§4.1 Consideration)</span>
              <span style="color:var(--crimson); font-family:ui-monospace,monospace; font-weight:800;">$45,000 EXPOSURE</span>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
              <span>Broken Cross-Reference (§14.2 Omitted)</span>
              <span style="color:var(--amber); font-family:ui-monospace,monospace; font-weight:800;">PROCEDURAL BREACH</span>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">
              <span>Missing Disclosure Schedules (Exhibit C)</span>
              <span style="color:var(--cyan); font-family:ui-monospace,monospace; font-weight:800;">CLOSING FAIL</span>
            </div>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-family:ui-monospace,monospace; font-size:10px; color:#9CA3AF;">IN-RAM AUDIT TIMESTAMP: 79.8ms</span>
            <div style="background:var(--emerald); color:#000; font-weight:900; font-size:11px; padding:6px 14px; border-radius:6px; font-family:ui-monospace,monospace;">
              EXPORT UNBRANDED PDF
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SCENE 6: KINETIC PRICING REVEAL & CTA -->
      <!-- ============================================================ -->
      <div id="scene-pricing-group" class="scene-canvas-layer">
        <div id="pricing-kinetic-box" class="pricing-kinetic-container">
          
          <!-- SOLO CARD -->
          <div class="price-slab">
            <div>
              <span style="font-family:ui-monospace,monospace; font-size:11px; color:#9CA3AF; text-transform:uppercase;">INDIVIDUAL COUNSEL</span>
              <h3 style="font-size:20px; font-weight:900; color:#fff; margin-top:2px;">Solo Practitioner</h3>
              <div class="slab-huge-cost">$199<span style="font-size:14px; color:#9CA3AF;">one-time</span></div>
              <p style="font-size:11px; color:var(--emerald); font-family:ui-monospace,monospace; font-weight:700;">Lifetime License · 1 User</p>
              <ul style="list-style:none; margin:16px 0; font-size:12px; color:#D1D5DB; display:flex; flex-direction:column; gap:6px;">
                <li>✓ 100% In-RAM Air-Gapped Engine</li>
                <li>✓ Unlimited Audits & Myers LCS Redlines</li>
                <li>✓ Local In-RAM OCR Scanner</li>
                <li>✓ Offline Native Desktop PWA</li>
              </ul>
            </div>
            <button class="slab-buy-btn solo" onclick="handleCheckout('solo')">
              Get Solo License ($199)
            </button>
          </div>

          <!-- FIRM SUITE CARD -->
          <div class="price-slab featured">
            <div>
              <span style="font-family:ui-monospace,monospace; font-size:11px; color:var(--emerald); font-weight:800; text-transform:uppercase;">BEST VALUE FOR FIRMS</span>
              <h3 style="font-size:20px; font-weight:900; color:#fff; margin-top:2px;">Law Firm Suite</h3>
              <div class="slab-huge-cost" style="color:#fff;">$299<span style="font-size:14px; color:#9CA3AF;">one-time</span></div>
              <p style="font-size:11px; color:var(--emerald); font-family:ui-monospace,monospace; font-weight:700;">Up to 5 Users Lifetime License</p>
              <ul style="list-style:none; margin:16px 0; font-size:12px; color:#D1D5DB; display:flex; flex-direction:column; gap:6px;">
                <li>✓ <strong>Up to 5 Attorney & Team Seats</strong></li>
                <li>✓ Court Bates Stamping Suite (PLTF/DEF)</li>
                <li>✓ Smart Discovery PII Scrubbing</li>
                <li>✓ White-Label Executive Client Memos</li>
              </ul>
            </div>
            <button id="firm-buy-btn" class="slab-buy-btn firm" onclick="handleCheckout('firm')">
              Get Law Firm Suite ($299)
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>

  <!-- Subtitles Karaoke Bar -->
  <div class="film-subtitles-bar">
    <div id="subtitles-box" class="subtitles-box">
      "A single clerical oversight before closing can cost millions."
    </div>
  </div>

  <!-- Cinema Controls Dock -->
  <div class="cinema-dock">
    <div id="dock-timeline-track" class="timeline-track">
      <div id="dock-timeline-fill" class="timeline-fill"></div>
    </div>
    <div class="dock-controls-row">
      <div style="display:flex; align-items:center; gap:12px;">
        <button id="btn-toggle-play" class="dock-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span id="label-play">Play</span>
        </button>
        <button id="btn-toggle-sound" class="dock-btn active">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          <span>Sound ON</span>
        </button>
        <div style="font-family:ui-monospace,monospace; font-size:11px; color:#9CA3AF;">
          <span id="time-text-cur">00:00</span> / <span id="time-text-total">00:46</span>
        </div>
      </div>

      <!-- Direct Scene Chips -->
      <div class="dock-chips">
        <div class="dock-chip active" onclick="seekScene(0)">1. The Trap</div>
        <div class="dock-chip" onclick="seekScene(1)">2. Air-Gap</div>
        <div class="dock-chip" onclick="seekScene(2)">3. 79ms Audit</div>
        <div class="dock-chip" onclick="seekScene(3)">4. PII & Bates</div>
        <div class="dock-chip" onclick="seekScene(4)">5. Memo Export</div>
        <div class="dock-chip" onclick="seekScene(5)">6. $199 / $299</div>
      </div>

      <div style="display:flex; align-items:center; gap:10px;">
        <button id="btn-voiceover" class="dock-btn active">
          <span>Voiceover ON</span>
        </button>
        <button id="btn-fullscreen" class="dock-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Big Play Curtain -->
  <div id="play-curtain">
    <div class="curtain-play-btn">
      <div style="width:0; height:0; border-style:solid; border-width:14px 0 14px 22px; border-color:transparent transparent transparent #fff; margin-left:4px;"></div>
    </div>
    <div style="margin-top:16px; font-weight:800; font-size:16px;">Watch ContractGuard™ 60FPS Launch Film</div>
    <div style="margin-top:4px; font-size:11px; color:#9CA3AF; font-family:ui-monospace,monospace;">Dynamic Camera Motion · Virtual Cursor Foley · 46s</div>
  </div>

</div>

<script>
(function() {
  const TOTAL_DURATION = 46.0;
  let t = 0;
  let isPlaying = false;
  let soundOn = true;
  let voiceOn = true;
  let lastTime = performance.now();

  // Scene Choreography Array
  const BEATS = [
    {
      idx: 0,
      start: 0.0,
      end: 7.5,
      label: "STAGE 01 · THE CATASTROPHIC BLINDSPOT",
      h1: "ONE CLERICAL CONTRADICTION.<br>$45,000 IN UNSEEN LIABILITY.",
      sub: "A single drafting oversight before closing can cost millions. But pasting privileged M&A terms into cloud AI violates legal ethics.",
      script: "A single drafting oversight before closing can cost millions. But pasting privileged M&A terms into cloud AI violates legal ethics.",
    },
    {
      idx: 1,
      start: 7.5,
      end: 15.0,
      label: "STAGE 02 · 100% AIR-GAPPED RAM",
      h1: "LOCAL IN-BROWSER ISOLATION.<br>ZERO CLOUD TELEMETRY.",
      sub: "Meet ContractGuard. The world's first air-gapped legal studio. Zero cloud. Zero data leakage. Running entirely inside local RAM.",
      script: "Meet ContractGuard. The air-gapped legal studio built to catch fatal contract defects in local memory—with absolute client confidentiality.",
    },
    {
      idx: 2,
      start: 15.0,
      end: 26.0,
      label: "STAGE 03 · 79.8ms VELOCITY AUDIT",
      h1: "79.8ms IN-RAM SCANNER.<br>5 AUTONOMOUS DETECTION ENGINES.",
      sub: "In under eighty milliseconds, five autonomous engines audit cross-references, undefined terms, and financial mismatches with surgical precision.",
      script: "In under eighty milliseconds, five autonomous engines audit cross-references, undefined terms, and financial mismatches with surgical precision.",
    },
    {
      idx: 3,
      start: 26.0,
      end: 34.0,
      label: "STAGE 04 · DISCOVERY & BATES SUITE",
      h1: "DETERMINISTIC PII SCRUBBING.<br>COURT-CERTIFIED BATES NUMBERING.",
      sub: "Scrub privileged banking data automatically. Apply court-certified Bates numbering directly to evidentiary PDFs with zero third-party exposure.",
      script: "Scrub privileged banking data automatically. Apply court-certified Bates numbering directly to evidentiary PDFs with zero third-party exposure.",
    },
    {
      idx: 4,
      start: 34.0,
      end: 40.0,
      label: "STAGE 05 · EXECUTIVE CLIENT DELIVERABLES",
      h1: "EXECUTIVE AUDIT MEMORANDUMS.<br>INSTANT AUDIT TRAIL EXPORT.",
      sub: "Export executive client memos and redline summaries before the ink dries. Defend your client's interests with empirical certainty.",
      script: "Export executive client memos and redline summaries before the ink dries. Defend your client's interests with empirical certainty.",
    },
    {
      idx: 5,
      start: 40.0,
      end: 46.0,
      label: "STAGE 06 · PERPETUAL AIR-GAP LICENSE",
      h1: "ZERO MONTHLY SAAS FEES.<br>PERPETUAL ATTORNEY PROTECTION.",
      sub: "No monthly subscriptions. Just perpetual, air-gapped protection for your practice. Deploy ContractGuard today.",
      script: "No monthly subscriptions. Just perpetual, air-gapped protection for your firm. Deploy ContractGuard today.",
    }
  ];

  // DOM Elements
  const stage = document.getElementById('cinema-stage');
  const rig = document.getElementById('camera-rig');
  const shakeLayer = document.getElementById('shake-layer');
  const cursor = document.getElementById('virtual-cursor');
  const ripple = document.getElementById('cursor-ripple');
  const teleLabel = document.getElementById('tele-label');
  const teleH1 = document.getElementById('tele-h1');
  const teleSub = document.getElementById('tele-sub');
  const subtitlesBox = document.getElementById('subtitles-box');
  const trackFill = document.getElementById('dock-timeline-fill');
  const timeCur = document.getElementById('time-text-cur');
  const playCurtain = document.getElementById('play-curtain');
  const btnTogglePlay = document.getElementById('btn-toggle-play');
  const labelPlay = document.getElementById('label-play');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const btnVoiceover = document.getElementById('btn-voiceover');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const chips = document.querySelectorAll('.dock-chip');

  // Dynamic Scene Elements
  const cockpitImg = document.getElementById('cockpit-img-base');
  const laserBeam = document.getElementById('laser-beam');
  const clauseReticle = document.getElementById('clause-reticle');
  const liveRunBtn = document.getElementById('live-run-btn');
  const liveRiskStamp = document.getElementById('live-risk-stamp');
  const card1 = document.getElementById('card-1');
  const card2 = document.getElementById('card-2');
  const card3 = document.getElementById('card-3');
  const piiMask1 = document.getElementById('pii-mask-1');
  const piiMask2 = document.getElementById('pii-mask-2');
  const batesStampTool = document.getElementById('bates-stamp-tool');
  const flyoutMemo = document.getElementById('flyout-memo');
  const pricingBox = document.getElementById('pricing-kinetic-box');
  const firmBuyBtn = document.getElementById('firm-buy-btn');

  // Images Preloaded
  const imgClean = "${imgCleanCockpit}";
  const imgRedFlags = "${imgAuditRedFlags}";
  const imgPii = "${imgPiiRedactor}";
  const imgBates = "${imgBatesStamping}";

  // Web Audio Synthesizer
  let actx = null;
  function getAudio() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }

  function playTone(freq, dur, type='sine', gainVal=0.2) {
    if (!soundOn) return;
    try {
      const a = getAudio();
      const osc = a.createOscillator();
      const g = a.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, a.currentTime);
      g.gain.setValueAtTime(gainVal, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
      osc.connect(g);
      g.connect(a.destination);
      osc.start();
      osc.stop(a.currentTime + dur);
    } catch(e) {}
  }

  function sfxClick() {
    playTone(1200, 0.05, 'square', 0.08);
  }
  function sfxSubImpact() {
    playTone(60, 0.8, 'sine', 0.35);
  }
  function sfxLaser() {
    playTone(900, 0.25, 'triangle', 0.15);
  }
  function sfxStamp() {
    playTone(90, 0.4, 'sawtooth', 0.3);
  }

  // Voiceover Synthesis
  let currentSpoken = -1;
  function speakBeat(idx) {
    if (!voiceOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (idx < 0 || idx >= BEATS.length) return;
    const ut = new SpeechSynthesisUtterance(BEATS[idx].script);
    ut.rate = 1.08;
    ut.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(x => x.lang.startsWith('en') && (x.name.includes('David') || x.name.includes('Natural') || x.name.includes('Google')));
    if (v) ut.voice = v;
    window.speechSynthesis.speak(ut);
    currentSpoken = idx;
  }

  // Camera & Cursor Target Coordinates
  let cam = { x: 0, y: 0, z: 1, rx: 0, ry: 0 };
  let targetCam = { x: 0, y: 0, z: 1, rx: 0, ry: 0 };
  let cur = { x: 500, y: 400 };
  let targetCur = { x: 500, y: 400 };

  function triggerCursorClick(x, y) {
    targetCur.x = x;
    targetCur.y = y;
    setTimeout(() => {
      ripple.classList.remove('active');
      void ripple.offsetWidth; // trigger reflow
      ripple.classList.add('active');
      sfxClick();
    }, 120);
  }

  function triggerScreenShake(intensity = 6) {
    shakeLayer.style.transform = \`translate(\${(Math.random()-0.5)*intensity}px, \${(Math.random()-0.5)*intensity}px)\`;
    setTimeout(() => { shakeLayer.style.transform = 'translate(0, 0)'; }, 60);
  }

  // Kinetic Action Schedule
  let lastBeatIndex = -1;

  function updateFilmState(time) {
    const curBeat = BEATS.find(b => time >= b.start && time < b.end) || BEATS[BEATS.length-1];

    // Beat Switch
    if (curBeat.idx !== lastBeatIndex) {
      lastBeatIndex = curBeat.idx;

      // Teleprompter Update
      teleLabel.innerHTML = curBeat.label;
      teleH1.innerHTML = curBeat.h1;
      teleSub.innerHTML = curBeat.sub;
      subtitlesBox.innerHTML = \`"\${curBeat.script}"\`;

      // Update scene layer visibility
      document.getElementById('scene-cockpit-group').classList.toggle('active', curBeat.idx <= 2);
      document.getElementById('scene-tools-group').classList.toggle('active', curBeat.idx === 3);
      document.getElementById('scene-memo-group').classList.toggle('active', curBeat.idx === 4);
      document.getElementById('scene-pricing-group').classList.toggle('active', curBeat.idx === 5);

      // Chips update
      chips.forEach((c, i) => c.classList.toggle('active', i === curBeat.idx));

      // Voiceover
      if (isPlaying && voiceOn) speakBeat(curBeat.idx);
    }

    // =========================================================================
    // HIGH-ENERGY CHOREOGRAPHY PER SECOND
    // =========================================================================

    // BEAT 1: (0.0s - 7.5s) MACRO TILT-SHIFT INTO DEFECT
    if (time < 7.5) {
      cockpitImg.src = imgClean;
      liveRunBtn.style.display = 'none';
      liveRiskStamp.classList.remove('stamped');
      clauseReticle.classList.remove('active');

      // Camera zooms deep into Clause 4.1 text
      targetCam = { x: -80, y: -40, z: 1.55, rx: 6, ry: -8 };
      
      // Cursor glides to the clause and selects ($205,000)
      if (time < 2.0) {
        targetCur = { x: window.innerWidth * 0.45, y: window.innerHeight * 0.5 };
      } else if (time >= 2.0 && time < 4.5) {
        targetCur = { x: window.innerWidth * 0.58, y: window.innerHeight * 0.42 };
        clauseReticle.classList.add('active');
        // Laser radar beam sweeps across
        laserBeam.style.opacity = '1';
        laserBeam.style.left = ((time - 2.0) / 2.5 * 100) + '%';
        if (time > 2.5 && time < 2.6) sfxLaser();
      } else {
        laserBeam.style.opacity = '0';
      }
    }

    // BEAT 2: (7.5s - 15.0s) THE AIR-GAP REVELATION
    else if (time >= 7.5 && time < 15.0) {
      clauseReticle.classList.remove('active');
      laserBeam.style.opacity = '0';
      liveRunBtn.style.display = 'flex';

      // Camera pulls back to full 3D cockpit
      targetCam = { x: 0, y: 10, z: 1.02, rx: 10, ry: 6 };

      // Cursor glides to top Air-Gap badge
      if (time < 11.0) {
        targetCur = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.22 };
      } else {
        targetCur = { x: window.innerWidth * 0.65, y: window.innerHeight * 0.4 };
        sfxSubImpact();
      }
    }

    // BEAT 3: (15.0s - 26.0s) 79.8ms VELOCITY AUDIT & LIVE CLICK!
    else if (time >= 15.0 && time < 26.0) {
      // Camera zooms on Action Button and Results
      targetCam = { x: 120, y: -30, z: 1.35, rx: 4, ry: -4 };

      // Cursor moves to "Run Integrity Audit"
      if (time >= 15.0 && time < 17.5) {
        cockpitImg.src = imgClean;
        targetCur = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.58 };
      } 
      // THE CLICK MOMENT! (t = 17.5s)
      else if (time >= 17.5 && time < 18.5) {
        liveRunBtn.classList.add('pressed');
        triggerCursorClick(window.innerWidth * 0.68, window.innerHeight * 0.58);
        triggerScreenShake(8);
      } 
      // POST-CLICK: EXPLODING RISK STAMP AND RED CARDS CASCADE
      else {
        liveRunBtn.classList.remove('pressed');
        cockpitImg.src = imgRedFlags;
        liveRiskStamp.classList.add('stamped');

        // Cascade Red Liability Cards
        if (time > 19.5) card1.classList.add('show');
        if (time > 21.0) card2.classList.add('show');
        if (time > 22.5) card3.classList.add('show');

        // Cursor hovers over first red card
        targetCur = { x: window.innerWidth * 0.48, y: window.innerHeight * 0.72 };
      }
    }

    // BEAT 4: (26.0s - 34.0s) PII REDACTION & HYDRAULIC BATES STAMP
    else if (time >= 26.0 && time < 34.0) {
      card1.classList.remove('show');
      card2.classList.remove('show');
      card3.classList.remove('show');

      // Camera zooms onto PII and Bates interface
      targetCam = { x: -40, y: -20, z: 1.25, rx: 6, ry: -5 };

      // Redaction Sweep (t = 27.0s - 30.0s)
      if (time >= 27.5 && time < 30.5) {
        targetCur = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.65 };
        piiMask1.classList.add('covered');
        piiMask2.classList.add('covered');
      }

      // Bates Slam (t = 30.5s - 34.0s)
      if (time >= 30.8) {
        targetCur = { x: window.innerWidth * 0.72, y: window.innerHeight * 0.62 };
        batesStampTool.classList.add('slammed');
        triggerScreenShake(5);
        if (time > 30.8 && time < 30.95) sfxStamp();
      }
    }

    // BEAT 5: (34.0s - 40.0s) 3D MEMORANDUM FLYOUT
    else if (time >= 34.0 && time < 40.0) {
      batesStampTool.classList.remove('slammed');
      piiMask1.classList.remove('covered');
      piiMask2.classList.remove('covered');

      targetCam = { x: 0, y: 0, z: 1.15, rx: 12, ry: 0 };
      flyoutMemo.classList.add('elevated');

      targetCur = { x: window.innerWidth * 0.58, y: window.innerHeight * 0.55 };
    }

    // BEAT 6: (40.0s - 46.0s) KINETIC PRICING SLABS & CALL TO ACTION
    else if (time >= 40.0) {
      flyoutMemo.classList.remove('elevated');

      targetCam = { x: 0, y: 0, z: 0.95, rx: 0, ry: 0 };
      pricingBox.classList.add('active');

      // Cursor moves onto Law Firm Suite ($299) button and pulses
      targetCur = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.68 };
      firmBuyBtn.style.boxShadow = '0 0 35px #10B981';
    }

    // Progress bar update
    const pct = (time / TOTAL_DURATION) * 100;
    trackFill.style.width = pct + '%';

    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    timeCur.innerText = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  // 60FPS Render Loop with Spring Physics Lerp
  function renderFrame(now) {
    const dt = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;

    if (isPlaying) {
      t += dt;
      if (t >= TOTAL_DURATION) {
        t = TOTAL_DURATION;
        pauseVideo();
      }
      updateFilmState(t);
    }

    // Smooth Spring Camera Lerp
    cam.x += (targetCam.x - cam.x) * 0.08;
    cam.y += (targetCam.y - cam.y) * 0.08;
    cam.z += (targetCam.z - cam.z) * 0.08;
    cam.rx += (targetCam.rx - cam.rx) * 0.08;
    cam.ry += (targetCam.ry - cam.ry) * 0.08;

    rig.style.transform = \`translate3d(\${cam.x}px, \${cam.y}px, 0) scale(\${cam.z}) rotateX(\${cam.rx}deg) rotateY(\${cam.ry}deg)\`;

    // Smooth Virtual Cursor Lerp
    cur.x += (targetCur.x - cur.x) * 0.16;
    cur.y += (targetCur.y - cur.y) * 0.16;
    cursor.style.left = cur.x + 'px';
    cursor.style.top = cur.y + 'px';

    drawCanvasStars();
    requestAnimationFrame(renderFrame);
  }
  requestAnimationFrame(renderFrame);

  // Background Ambient Particles
  const starsCanvas = document.getElementById('stars-canvas');
  const sCtx = starsCanvas.getContext('2d');
  function resizeStars() {
    starsCanvas.width = starsCanvas.offsetWidth;
    starsCanvas.height = starsCanvas.offsetHeight;
  }
  window.addEventListener('resize', resizeStars);
  resizeStars();

  const starList = Array.from({ length: 50 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.4 + 0.1,
    alpha: Math.random() * 0.6 + 0.2
  }));

  function drawCanvasStars() {
    sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    sCtx.fillStyle = '#10B981';
    for (let s of starList) {
      sCtx.globalAlpha = s.alpha;
      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sCtx.fill();
      s.y -= s.speed;
      if (s.y < 0) s.y = starsCanvas.height;
    }
  }

  // Playback Controls
  function playVideo() {
    getAudio();
    isPlaying = true;
    labelPlay.innerText = 'Pause';
    playCurtain.style.opacity = '0';
    playCurtain.style.pointerEvents = 'none';
    if (voiceOn) speakBeat(lastBeatIndex);
    sfxClick();
  }

  function pauseVideo() {
    isPlaying = false;
    labelPlay.innerText = 'Play';
    if (window.speechSynthesis) window.speechSynthesis.pause();
    sfxClick();
  }

  function togglePlay() {
    if (isPlaying) pauseVideo();
    else {
      if (t >= TOTAL_DURATION) t = 0;
      playVideo();
    }
  }

  function seekTime(targetSec) {
    t = Math.max(0, Math.min(TOTAL_DURATION, targetSec));
    updateFilmState(t);
    if (isPlaying && voiceOn) speakBeat(lastBeatIndex);
  }

  window.seekScene = function(idx) {
    if (idx >= 0 && idx < BEATS.length) {
      seekTime(BEATS[idx].start + 0.1);
      if (!isPlaying) playVideo();
    }
  };

  playCurtain.addEventListener('click', playVideo);
  btnTogglePlay.addEventListener('click', togglePlay);

  btnToggleSound.addEventListener('click', () => {
    getAudio();
    soundOn = !soundOn;
    btnToggleSound.classList.toggle('active', soundOn);
    btnToggleSound.querySelector('span').innerText = soundOn ? 'Sound ON' : 'Muted';
    sfxClick();
  });

  btnVoiceover.addEventListener('click', () => {
    voiceOn = !voiceOn;
    btnVoiceover.classList.toggle('active', voiceOn);
    btnVoiceover.querySelector('span').innerText = voiceOn ? 'Voiceover ON' : 'Voiceover OFF';
    if (!voiceOn && window.speechSynthesis) window.speechSynthesis.cancel();
    else if (isPlaying) speakBeat(lastBeatIndex);
  });

  document.getElementById('dock-timeline-track').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seekTime(ratio * TOTAL_DURATION);
  });

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      stage.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Whop Seamless Checkout
  window.handleCheckout = function(tier) {
    const productId = 'prod_ETdsHhJlU1fMM';
    const returnUrl = encodeURIComponent(window.location.origin + '/welcome?status=success&tool=contractcompare');
    const checkoutUrl = 'https://whop.com/checkout/' + productId + '?return_url=' + returnUrl;
    window.open(checkoutUrl, 'NexusCheckout', 'width=540,height=760,resizable=yes,scrollbars=yes');
  };

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    else if (e.code === 'ArrowRight') seekTime(t + 4);
    else if (e.code === 'ArrowLeft') seekTime(t - 4);
    else if (e.code === 'KeyM') btnToggleSound.click();
    else if (e.code === 'KeyF') btnFullscreen.click();
  });

  // Initial State
  updateFilmState(0);

})();
</script>

</body>
</html>`;

const outLanding = path.join(__dirname, 'public', 'ContractGuard_Launch_Film_Elite.html');
fs.writeFileSync(outLanding, htmlContent, 'utf-8');
console.log('Saved kinetic motion film to:', outLanding);

const downloadsDir = path.join('C:', 'Users', 'lenovo', 'Downloads');
if (fs.existsSync(downloadsDir)) {
  const outDownloads = path.join(downloadsDir, 'ContractGuard_Launch_Film_Elite.html');
  fs.writeFileSync(outDownloads, htmlContent, 'utf-8');
  console.log('Saved to Downloads:', outDownloads);
}
