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

console.log('Images loaded into base64 successfully.');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>ContractGuard™ — Official Launch Film (Product Reveal)</title>
<style>
  :root {
    --bg-dark: #030712;
    --card-dark: #050A0F;
    --emerald: #10B981;
    --emerald-glow: rgba(16, 185, 129, 0.4);
    --cyan: #00F0FF;
    --cyan-glow: rgba(0, 240, 255, 0.35);
    --crimson: #EF4444;
    --crimson-glow: rgba(239, 68, 68, 0.4);
    --amber: #F59E0B;
    --text-primary: #F9FAFB;
    --text-muted: #9CA3AF;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body {
    background-color: #010408;
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Cinematic Stage Wrapper */
  #stage-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    max-width: 177.78vh; /* 16:9 ratio */
    max-height: 56.25vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #020509;
    box-shadow: 0 0 100px rgba(0,0,0,0.9), 0 0 40px rgba(16,185,129,0.08);
    overflow: hidden;
  }

  /* Stage Canvas & 3D Layer */
  #viewport {
    position: absolute;
    inset: 0;
    overflow: hidden;
    perspective: 1200px;
    background: radial-gradient(circle at 50% 30%, #08171e 0%, #03080d 60%, #010408 100%);
  }

  /* Ambient Particle Canvas */
  #fx-canvas {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
  }

  /* Cinematic Letterbox Bars */
  .letterbox {
    position: absolute;
    left: 0; right: 0;
    height: 4.5%;
    background: #000;
    z-index: 50;
    pointer-events: none;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .letterbox.top { top: 0; }
  .letterbox.bottom { bottom: 0; }

  /* HUD Header */
  .film-header {
    position: absolute;
    top: 6%;
    left: 4%;
    right: 4%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 60;
    pointer-events: none;
  }
  .film-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .film-badge-shield {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--emerald);
    box-shadow: 0 0 16px var(--emerald-glow);
  }
  .film-brand-title {
    font-weight: 800;
    font-size: 15px;
    letter-spacing: -0.02em;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .film-brand-tag {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9px;
    font-weight: 700;
    background: rgba(16, 185, 129, 0.15);
    color: var(--emerald);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .film-status-pill {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 10px;
    color: var(--emerald);
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.25);
    padding: 5px 12px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--emerald);
    box-shadow: 0 0 8px var(--emerald);
    animation: pulse 1.8s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }

  /* Big Floating Super Title */
  .super-title-container {
    position: absolute;
    top: 13%;
    left: 4%;
    right: 4%;
    z-index: 55;
    pointer-events: none;
    text-align: left;
  }
  .super-category {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--emerald);
    margin-bottom: 4px;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.4s ease;
  }
  .super-heading {
    font-size: clamp(22px, 3.2vw, 42px);
    font-weight: 900;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1.08;
    text-shadow: 0 4px 24px rgba(0,0,0,0.8);
    opacity: 0;
    transform: translateY(12px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .super-subtext {
    font-size: clamp(12px, 1.3vw, 16px);
    font-weight: 500;
    color: var(--text-muted);
    margin-top: 6px;
    max-width: 680px;
    line-height: 1.4;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.4s ease 0.1s;
  }

  /* Scene Visual Layers Container */
  .scene-stage {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scene-pane {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transform: scale(0.96) translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .scene-pane.active {
    opacity: 1;
    pointer-events: auto;
    transform: scale(1) translateY(0);
  }

  /* SCENE 1: MACRO PARCHMENT DEFECT */
  .contract-macro-card {
    width: 72%;
    max-width: 900px;
    background: #070e14;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 36px 42px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.05);
    position: relative;
    overflow: hidden;
  }
  .contract-clause-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 12px;
  }
  .contract-body-text {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: clamp(14px, 1.6vw, 20px);
    line-height: 1.7;
    color: #E5E7EB;
  }
  .defect-words {
    background: rgba(16, 185, 129, 0.15);
    color: #6EE7B7;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(16, 185, 129, 0.3);
    font-weight: 700;
  }
  .defect-numbers {
    background: rgba(239, 68, 68, 0.25);
    color: #FCA5A5;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid var(--crimson);
    font-weight: 800;
    box-shadow: 0 0 15px var(--crimson-glow);
    animation: flashNumber 1.2s infinite alternate;
  }
  @keyframes flashNumber {
    0% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 8px var(--crimson-glow); }
    100% { border-color: #EF4444; box-shadow: 0 0 24px rgba(239, 68, 68, 0.8); }
  }
  .laser-scanner-line {
    position: absolute;
    top: 0; bottom: 0; width: 3px;
    background: linear-gradient(180deg, transparent, var(--cyan), transparent);
    box-shadow: 0 0 20px var(--cyan), 0 0 8px #fff;
    left: 0;
    opacity: 0;
  }

  /* SCENE 2: FLOATING AIR-GAPPED LAPTOP */
  .laptop-stage {
    position: relative;
    width: 78%;
    max-width: 960px;
    transform-style: preserve-3d;
    transform: rotateX(10deg) rotateY(-8deg);
    transition: transform 0.8s ease;
  }
  .laptop-bezel {
    background: #0a1118;
    border: 2px solid #1f2937;
    border-radius: 14px;
    padding: 10px 10px 14px 10px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.9), 0 0 50px rgba(16,185,129,0.15);
    position: relative;
  }
  .laptop-screen {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    background: #030712;
    border: 1px solid rgba(255,255,255,0.06);
    aspect-ratio: 16 / 10;
  }
  .laptop-screen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .airgap-halo-ring {
    position: absolute;
    inset: -30px;
    border-radius: 28px;
    border: 2px solid var(--emerald);
    box-shadow: 0 0 50px var(--emerald-glow), inset 0 0 40px rgba(16,185,129,0.2);
    pointer-events: none;
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .airgap-halo-badge {
    position: absolute;
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
    background: #020509;
    border: 1px solid var(--emerald);
    color: #fff;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    font-weight: 800;
    padding: 6px 18px;
    border-radius: 9999px;
    box-shadow: 0 0 20px var(--emerald-glow);
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  /* SCENE 3: 79.8ms VELOCITY AUDIT */
  .audit-cockpit-grid {
    width: 82%;
    max-width: 1060px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .audit-metrics-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }
  .metric-box {
    background: #050A0F;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 14px 18px;
  }
  .metric-box.hazard {
    border-color: rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.04);
  }
  .metric-title {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 10px;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .metric-value-huge {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 32px;
    font-weight: 900;
    color: #fff;
    margin-top: 4px;
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  .metric-value-huge.emerald { color: var(--emerald); }
  .metric-value-huge.crimson { color: var(--crimson); }
  .audit-preview-pane {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    background: #030712;
    max-height: 380px;
  }
  .audit-preview-pane img {
    width: 100%;
    display: block;
  }

  /* SCENE 4: SPLIT REDACTOR & BATES */
  .split-tools-container {
    width: 85%;
    max-width: 1100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .split-card {
    background: #050A0F;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
  }
  .split-card.cyan-accent { border-color: rgba(0, 240, 255, 0.3); }
  .split-card.amber-accent { border-color: rgba(245, 158, 11, 0.3); }
  .split-card-header {
    padding: 10px 16px;
    background: #08121A;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    font-weight: 700;
  }
  .split-card-body {
    padding: 0;
    max-height: 340px;
    overflow: hidden;
  }
  .split-card-body img {
    width: 100%;
    display: block;
  }

  /* SCENE 5: EXECUTIVE MEMO PDF 3D */
  .memo-elevated-stage {
    width: 60%;
    max-width: 780px;
    background: #070e14;
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 16px;
    padding: 32px 40px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.9), 0 0 50px rgba(16,185,129,0.15);
    transform: rotateX(12deg) scale(0.95);
    transition: transform 0.8s ease;
  }
  .memo-header-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgba(16, 185, 129, 0.3);
    padding-bottom: 14px;
    margin-bottom: 20px;
  }
  .memo-stamp-seal {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    color: var(--emerald);
    border: 1px dashed var(--emerald);
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 800;
    text-transform: uppercase;
  }
  .memo-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 13px;
  }

  /* SCENE 6: KINETIC PRICING REVEAL */
  .pricing-reveal-stage {
    width: 82%;
    max-width: 960px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: stretch;
  }
  .pricing-card {
    background: #050A0F;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    transition: transform 0.4s ease, border-color 0.4s ease;
  }
  .pricing-card:hover {
    transform: translateY(-4px);
  }
  .pricing-card.featured {
    border-color: var(--emerald);
    box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 35px rgba(16,185,129,0.2);
    background: radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08) 0%, #050A0F 80%);
  }
  .pricing-badge-popular {
    position: absolute;
    top: -12px;
    right: 20px;
    background: linear-gradient(90deg, #10B981, #00F0FF);
    color: #000;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 9999px;
  }
  .pricing-tier-name {
    font-size: 18px;
    font-weight: 800;
    color: #fff;
  }
  .pricing-tier-sub {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
  }
  .pricing-cost-huge {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 44px;
    font-weight: 900;
    color: #fff;
    margin: 18px 0 4px 0;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
  .pricing-cost-sub {
    font-size: 11px;
    color: var(--emerald);
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-weight: 700;
  }
  .pricing-features-list {
    list-style: none;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
    color: #D1D5DB;
  }
  .pricing-features-list li {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pricing-features-list li::before {
    content: "✓";
    color: var(--emerald);
    font-weight: 800;
  }
  .pricing-cta-button {
    width: 100%;
    padding: 12px 0;
    border-radius: 10px;
    border: none;
    font-weight: 800;
    font-size: 12px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;
  }
  .pricing-cta-button.solo {
    background: #1F2937;
    color: #fff;
  }
  .pricing-cta-button.solo:hover { background: #374151; }
  .pricing-cta-button.firm {
    background: var(--emerald);
    color: #000;
    box-shadow: 0 0 20px rgba(16,185,129,0.35);
  }
  .pricing-cta-button.firm:hover { background: #34D399; }

  /* SUBTITLES & KARAOKE BAR */
  .karaoke-subtitles-bar {
    position: absolute;
    bottom: 12%;
    left: 8%;
    right: 8%;
    text-align: center;
    z-index: 65;
    pointer-events: none;
  }
  .subtitles-text {
    font-size: clamp(14px, 1.8vw, 22px);
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: -0.01em;
    text-shadow: 0 2px 12px rgba(0,0,0,0.9);
    transition: color 0.2s ease;
  }
  .subtitles-text .word-highlight {
    color: #FFFFFF;
    text-shadow: 0 0 16px rgba(255,255,255,0.8), 0 0 30px var(--emerald-glow);
  }

  /* BOTTOM CONTROLLER DOCK */
  .controller-dock {
    position: absolute;
    bottom: 3%;
    left: 4%;
    right: 4%;
    z-index: 70;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(3, 7, 18, 0.85);
    backdrop-blur: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 10px 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    transition: opacity 0.3s ease;
  }
  .timeline-bar-container {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }
  .timeline-progress {
    height: 100%;
    background: linear-gradient(90deg, #10B981, #00F0FF);
    width: 0%;
    border-radius: 9999px;
    box-shadow: 0 0 12px var(--emerald);
  }
  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .controls-left, .controls-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ctrl-btn {
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
  .ctrl-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }
  .ctrl-btn.active {
    color: var(--emerald);
  }
  .time-display {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    color: #9CA3AF;
  }

  /* Scene Chip Navigation */
  .scene-chips {
    display: flex;
    gap: 6px;
  }
  .scene-chip {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 9.5px;
    color: #6B7280;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 3px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .scene-chip:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.2);
  }
  .scene-chip.active {
    color: var(--emerald);
    border-color: var(--emerald);
    background: rgba(16, 185, 129, 0.1);
  }

  /* Big Center Play Overlay */
  #big-play-overlay {
    position: absolute;
    inset: 0;
    z-index: 80;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(2, 5, 9, 0.7);
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: opacity 0.4s ease;
  }
  .play-glow-circle {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.15);
    border: 2px solid var(--emerald);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 40px var(--emerald-glow), inset 0 0 20px rgba(16,185,129,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  #big-play-overlay:hover .play-glow-circle {
    transform: scale(1.08);
    box-shadow: 0 0 60px rgba(16,185,129,0.6);
  }
  .play-triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 14px 0 14px 24px;
    border-color: transparent transparent transparent #ffffff;
    margin-left: 4px;
  }
  .play-prompt-text {
    margin-top: 18px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #E5E7EB;
  }
  .play-prompt-sub {
    font-size: 11px;
    color: var(--text-muted);
    font-family: ui-monospace, SFMono-Regular, monospace;
    margin-top: 4px;
  }
</style>
</head>
<body>

<div id="stage-wrapper">
  
  <!-- Letterbox Bars -->
  <div class="letterbox top"></div>
  <div class="letterbox bottom"></div>

  <!-- Background Particle Effects Canvas -->
  <canvas id="fx-canvas"></canvas>

  <!-- Main Viewport -->
  <div id="viewport">
    
    <!-- Top HUD Header -->
    <div class="film-header">
      <div class="film-brand">
        <div class="film-badge-shield">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div class="film-brand-title">
            ContractGuard™
            <span class="film-brand-tag">Launch Film</span>
          </div>
        </div>
      </div>

      <div class="film-status-pill">
        <span class="status-dot"></span>
        <span id="hud-status-text">AIR-GAPPED IN-RAM SANDBOX · 0 CLOUD</span>
      </div>
    </div>

    <!-- Floating Super Titles -->
    <div class="super-title-container">
      <div id="super-category" class="super-category">STAGE 01 · THE THREAT</div>
      <h1 id="super-heading" class="super-heading">ONE CLERICAL CONTRADICTION.<br>$45,000 IN UNSEEN LIABILITY.</h1>
      <p id="super-subtext" class="super-subtext">A single clerical oversight before closing can cost millions. But pasting privileged terms into cloud AI violates legal ethics.</p>
    </div>

    <!-- Visual Scene Panes -->
    <div class="scene-stage">
      
      <!-- PANE 1: THE MACRO PARCHMENT DEFECT -->
      <div id="pane-1" class="scene-pane active">
        <div class="contract-macro-card">
          <div class="contract-clause-header">
            <span>MASTER ASSET PURCHASE AGREEMENT · § 4.1 CONSIDERATION</span>
            <span>UNEXECUTED DRAFT BUFFER</span>
          </div>
          <div class="contract-body-text">
            4.1 In consideration of the Assets and ongoing services, Buyer shall pay Seller the total purchase price of 
            <span class="defect-words">"Two Hundred Fifty Thousand Dollars"</span> 
            <span class="defect-numbers">($205,000)</span> 
            payable in three equal quarterly installments. Any disputed invoices shall be resolved within thirty (30) days...
          </div>
          <div id="laser-scan" class="laser-scanner-line"></div>
        </div>
      </div>

      <!-- PANE 2: THE 3D AIR-GAPPED LAPTOP -->
      <div id="pane-2" class="scene-pane">
        <div class="laptop-stage">
          <div class="airgap-halo-ring" id="airgap-ring">
            <div class="airgap-halo-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              100% IN-RAM ISOLATION · 0 BYTES TRANSMITTED
            </div>
          </div>
          <div class="laptop-bezel">
            <div class="laptop-screen">
              <img src="${imgCleanCockpit}" alt="ContractGuard Cockpit Clean" />
            </div>
          </div>
        </div>
      </div>

      <!-- PANE 3: 79.8ms VELOCITY AUDIT -->
      <div id="pane-3" class="scene-pane">
        <div class="audit-cockpit-grid">
          <div class="audit-metrics-row">
            <div class="metric-box">
              <div class="metric-title">Execution Velocity</div>
              <div class="metric-value-huge emerald">
                <span id="ticker-ms">79.8</span><span style="font-size: 16px;">ms</span>
              </div>
            </div>
            <div class="metric-box hazard">
              <div class="metric-title">Overall Risk Assessment</div>
              <div class="metric-value-huge crimson">
                91<span style="font-size: 14px; opacity:0.8;">/100</span>
              </div>
            </div>
            <div class="metric-box">
              <div class="metric-title">Verification Engines</div>
              <div class="metric-value-huge" style="color:var(--cyan);">
                5<span style="font-size: 14px; opacity:0.8;">Active</span>
              </div>
            </div>
          </div>
          <div class="audit-preview-pane">
            <img src="${imgAuditRedFlags}" alt="Audit Red Flags" />
          </div>
        </div>
      </div>

      <!-- PANE 4: SPLIT PII & BATES STAMPING -->
      <div id="pane-4" class="scene-pane">
        <div class="split-tools-container">
          <div class="split-card cyan-accent">
            <div class="split-card-header">
              <span style="color:var(--cyan);">SMART PII REDACTOR</span>
              <span style="font-size:9px; background:rgba(0,240,255,0.15); color:var(--cyan); padding:2px 6px; border-radius:4px;">ZERO CLOUD</span>
            </div>
            <div class="split-card-body">
              <img src="${imgPiiRedactor}" alt="Smart PII Redactor" />
            </div>
          </div>

          <div class="split-card amber-accent">
            <div class="split-card-header">
              <span style="color:var(--amber);">COURT BATES STAMPING</span>
              <span style="font-size:9px; background:rgba(245,158,11,0.15); color:var(--amber); padding:2px 6px; border-radius:4px;">PDF-LIB NATIVE</span>
            </div>
            <div class="split-card-body">
              <img src="${imgBatesStamping}" alt="Bates Stamping Suite" />
            </div>
          </div>
        </div>
      </div>

      <!-- PANE 5: 3D CLIENT MEMO DELIVERABLE -->
      <div id="pane-5" class="scene-pane">
        <div class="memo-elevated-stage">
          <div class="memo-header-line">
            <div>
              <h3 style="font-size:18px; font-weight:800; color:#fff;">EXECUTIVE AUDIT MEMORANDUM</h3>
              <p style="font-size:11px; color:var(--text-muted); font-family:ui-monospace,monospace;">CONFIDENTIAL ATTORNEY-CLIENT WORK PRODUCT</p>
            </div>
            <div class="memo-stamp-seal">ABA RULE 1.6 CERTIFIED</div>
          </div>
          <div class="memo-item-row">
            <span>Critical Consideration Discrepancy (§4.1)</span>
            <span style="color:var(--crimson); font-weight:800; font-family:ui-monospace,monospace;">$45,000 EXPOSURE</span>
          </div>
          <div class="memo-item-row">
            <span>Severed Termination Target (§14.2 Omitted)</span>
            <span style="color:var(--amber); font-weight:800; font-family:ui-monospace,monospace;">PROCEDURAL BREACH</span>
          </div>
          <div class="memo-item-row">
            <span>Missing Disclosure Schedules (Exhibit C)</span>
            <span style="color:var(--amber); font-weight:800; font-family:ui-monospace,monospace;">CLOSING CONDITION FAIL</span>
          </div>
          <div class="memo-item-row">
            <span>Undefined Covenants ("Key Personnel" in §3.2)</span>
            <span style="color:var(--cyan); font-weight:800; font-family:ui-monospace,monospace;">AMBIGUOUS SCOPE</span>
          </div>
          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <div style="background:rgba(16,185,129,0.15); border:1px solid var(--emerald); color:var(--emerald); padding:6px 14px; border-radius:8px; font-size:11px; font-family:ui-monospace,monospace; font-weight:700;">
              ✓ READY FOR PARTNER REVIEW
            </div>
          </div>
        </div>
      </div>

      <!-- PANE 6: KINETIC PRICING REVEAL -->
      <div id="pane-6" class="scene-pane">
        <div class="pricing-reveal-stage">
          
          <!-- SOLO PLAN -->
          <div class="pricing-card">
            <div>
              <div class="pricing-tier-name">Solo Practitioner</div>
              <div class="pricing-tier-sub">Independent Counsel & Boutiques</div>
              <div class="pricing-cost-huge">$199<span style="font-size:14px; color:var(--text-muted);">one-time</span></div>
              <div class="pricing-cost-sub">Perpetual Lifetime License · 1 Seat</div>
              <ul class="pricing-features-list">
                <li>100% Air-Gapped In-RAM Engine</li>
                <li>Unlimited Multi-Clause Audits</li>
                <li>Myers LCS Redline Comparative Diff</li>
                <li>In-RAM OCR for Scans & Images</li>
                <li>Offline Native PWA Included</li>
              </ul>
            </div>
            <button class="pricing-cta-button solo" onclick="triggerCheckout('solo')">
              Get Solo License ($199)
            </button>
          </div>

          <!-- FIRM SUITE -->
          <div class="pricing-card featured">
            <div class="pricing-badge-popular">BEST VALUE FOR PRACTICES</div>
            <div>
              <div class="pricing-tier-name" style="color:var(--emerald);">Law Firm Suite</div>
              <div class="pricing-tier-sub">Partners, Associates & Paralegals</div>
              <div class="pricing-cost-huge" style="color:#fff;">$299<span style="font-size:14px; color:var(--text-muted);">one-time</span></div>
              <div class="pricing-cost-sub">Up to 5 Users Lifetime License</div>
              <ul class="pricing-features-list">
                <li>All Solo Practitioner Engines</li>
                <li><strong>Up to 5 Attorney & Team Seats</strong></li>
                <li>Court Bates Stamping Suite (PLTF/DEF)</li>
                <li>Smart Discovery PII Scrubbing</li>
                <li>White-Label Client Executive Memos</li>
              </ul>
            </div>
            <button class="pricing-cta-button firm" onclick="triggerCheckout('firm')">
              Get Law Firm Suite ($299)
            </button>
          </div>

        </div>
      </div>

    </div>

    <!-- Karaoke Subtitles -->
    <div class="karaoke-subtitles-bar">
      <div id="subtitles-display" class="subtitles-text">
        "A single clerical oversight before closing can cost millions."
      </div>
    </div>

  </div>

  <!-- Bottom Player Dock -->
  <div class="controller-dock">
    <div id="timeline-container" class="timeline-bar-container">
      <div id="timeline-progress" class="timeline-progress"></div>
    </div>
    <div class="controls-row">
      <div class="controls-left">
        <button id="btn-play" class="ctrl-btn" title="Play/Pause (Space)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <span id="play-text">Play</span>
        </button>
        <button id="btn-replay" class="ctrl-btn" title="Replay">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
        </button>
        <button id="btn-audio" class="ctrl-btn active" title="Toggle Synthesizer Sound (M)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          <span>Sound ON</span>
        </button>
        <div class="time-display">
          <span id="time-current">00:00</span> / <span id="time-total">00:54</span>
        </div>
      </div>

      <!-- Quick Scene Navigation Chips -->
      <div class="scene-chips">
        <div class="scene-chip active" onclick="seekToScene(0)">1. The Trap</div>
        <div class="scene-chip" onclick="seekToScene(1)">2. Air-Gap</div>
        <div class="scene-chip" onclick="seekToScene(2)">3. 79ms Audit</div>
        <div class="scene-chip" onclick="seekToScene(3)">4. PII & Bates</div>
        <div class="scene-chip" onclick="seekToScene(4)">5. Memo Export</div>
        <div class="scene-chip" onclick="seekToScene(5)">6. $199 / $299</div>
      </div>

      <div class="controls-right">
        <button id="btn-voiceover" class="ctrl-btn" title="Toggle English Voiceover Narration">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x2="16" y1="23" x2="8"/></svg>
          <span id="voiceover-text">Voiceover</span>
        </button>
        <button id="btn-fullscreen" class="ctrl-btn" title="Fullscreen (F)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Big Play Overlay at Start -->
  <div id="big-play-overlay">
    <div class="play-glow-circle">
      <div class="play-triangle"></div>
    </div>
    <div class="play-prompt-text">Watch ContractGuard™ Launch Film</div>
    <div class="play-prompt-sub">54s · Ultra-HD 60FPS · In-RAM Sound Design</div>
  </div>

</div>

<script>
(function() {
  const TOTAL_DURATION = 54.0; // 54 seconds
  let currentTime = 0;
  let isPlaying = false;
  let audioEnabled = true;
  let voiceoverEnabled = true;
  let lastTimestamp = performance.now();

  // Scene Definitions
  const SCENES = [
    {
      index: 0,
      start: 0.0,
      end: 8.5,
      category: "STAGE 01 · THE CATASTROPHIC BLINDSPOT",
      heading: "ONE CLERICAL CONTRADICTION.<br>$45,000 IN UNSEEN LIABILITY.",
      subtext: "A single drafting oversight before closing can cost millions. But pasting privileged M&A terms into cloud AI violates legal ethics.",
      script: "A single drafting discrepancy before closing can cost millions. But pasting privileged M&A terms into cloud AI? That's an ethical violation.",
      paneId: "pane-1"
    },
    {
      index: 1,
      start: 8.5,
      end: 18.0,
      category: "STAGE 02 · AIR-GAPPED ARCHITECTURE",
      heading: "100% IN-BROWSER RAM.<br>ZERO CLOUD TELEMETRY.",
      subtext: "Meet ContractGuard. The world's first 100% air-gapped legal studio. Zero cloud. Zero data leakage. Running entirely inside local RAM.",
      script: "Meet ContractGuard. The air-gapped legal studio built to catch fatal contract defects in local memory—with absolute client confidentiality.",
      paneId: "pane-2"
    },
    {
      index: 2,
      start: 18.0,
      end: 29.0,
      category: "STAGE 03 · VELOCITY & RISK RADAR",
      heading: "79.8ms IN-RAM AUDIT.<br>5 AUTONOMOUS PROOFREADING ENGINES.",
      subtext: "In under eighty milliseconds, five autonomous engines audit cross-references, undefined terms, and financial mismatches with surgical precision.",
      script: "In under eighty milliseconds, five autonomous engines audit cross-references, undefined terms, and financial mismatches with surgical precision.",
      paneId: "pane-3"
    },
    {
      index: 3,
      start: 29.0,
      end: 39.0,
      category: "STAGE 04 · DISCOVERY & COURT SUITE",
      heading: "DETERMINISTIC PII SCRUBBING.<br>COURT-CERTIFIED BATES NUMBERING.",
      subtext: "Scrub privileged banking data automatically. Apply court-certified Bates numbering directly to evidentiary PDFs with zero third-party exposure.",
      script: "Scrub privileged banking data automatically. Apply court-certified Bates numbering directly to evidentiary PDFs with zero third-party exposure.",
      paneId: "pane-4"
    },
    {
      index: 4,
      start: 39.0,
      end: 47.0,
      category: "STAGE 05 · EXECUTIVE CLIENT DELIVERABLES",
      heading: "EXECUTIVE AUDIT MEMORANDUMS.<br>INSTANT AUDIT TRAIL EXPORT.",
      subtext: "Export executive client memos and redline summaries before the ink dries. Defend your client's interests with empirical certainty.",
      script: "Export executive client memos and redline summaries before the ink dries. Defend your client's interests with empirical certainty.",
      paneId: "pane-5"
    },
    {
      index: 5,
      start: 47.0,
      end: 54.0,
      category: "STAGE 06 · PERPETUAL AIR-GAP LICENSE",
      heading: "ZERO MONTHLY SAAS FEES.<br>LIFETIME AIR-GAPPED PERFECTION.",
      subtext: "No monthly subscriptions. Just perpetual, air-gapped protection for your practice. Deploy ContractGuard today.",
      script: "No monthly subscriptions. Just perpetual, air-gapped protection for your firm. Deploy ContractGuard today.",
      paneId: "pane-6"
    }
  ];

  // DOM Elements
  const playOverlay = document.getElementById('big-play-overlay');
  const btnPlay = document.getElementById('btn-play');
  const playText = document.getElementById('play-text');
  const btnReplay = document.getElementById('btn-replay');
  const btnAudio = document.getElementById('btn-audio');
  const btnVoiceover = document.getElementById('btn-voiceover');
  const voiceoverText = document.getElementById('voiceover-text');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const timelineBar = document.getElementById('timeline-container');
  const timelineProgress = document.getElementById('timeline-progress');
  const timeCurrent = document.getElementById('time-current');
  const superCategory = document.getElementById('super-category');
  const superHeading = document.getElementById('super-heading');
  const superSubtext = document.getElementById('super-subtext');
  const subtitlesDisplay = document.getElementById('subtitles-display');
  const sceneChips = document.querySelectorAll('.scene-chip');
  const laserScan = document.getElementById('laser-scan');
  const airgapRing = document.getElementById('airgap-ring');
  const tickerMs = document.getElementById('ticker-ms');

  // Web Audio Synthesizer Engine
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSubBassPulse(freq = 55, duration = 1.2) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
  }

  function playCyberPing() {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
  }

  function playClickFoley() {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch(e) {}
  }

  // Voiceover Speech Synthesis
  let currentSpokenScene = -1;
  function speakSceneScript(sceneIndex) {
    if (!voiceoverEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (sceneIndex < 0 || sceneIndex >= SCENES.length) return;

    const utter = new SpeechSynthesisUtterance(SCENES[sceneIndex].script);
    utter.rate = 1.05;
    utter.pitch = 0.95;
    utter.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Google') || v.name.includes('Daniel')));
    if (englishVoice) utter.voice = englishVoice;

    window.speechSynthesis.speak(utter);
    currentSpokenScene = sceneIndex;
  }

  // Ambient Particles on Canvas
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 45; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedY: -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#10B981';
    for (let p of particles) {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.speedY;
      if (p.y < 0) p.y = canvas.height;
    }
  }

  // Current Scene State Tracking
  let currentActiveSceneIndex = -1;

  function updateStage(t) {
    // Determine active scene
    let activeScene = SCENES.find(s => t >= s.start && t < s.end);
    if (!activeScene) activeScene = SCENES[SCENES.length - 1];

    if (activeScene.index !== currentActiveSceneIndex) {
      currentActiveSceneIndex = activeScene.index;
      
      // Update super titles
      superCategory.style.opacity = '0';
      superHeading.style.opacity = '0';
      superSubtext.style.opacity = '0';

      setTimeout(() => {
        superCategory.innerHTML = activeScene.category;
        superHeading.innerHTML = activeScene.heading;
        superSubtext.innerHTML = activeScene.subtext;

        superCategory.style.opacity = '1';
        superCategory.style.transform = 'translateY(0)';
        superHeading.style.opacity = '1';
        superHeading.style.transform = 'translateY(0)';
        superSubtext.style.opacity = '1';
        superSubtext.style.transform = 'translateY(0)';
      }, 150);

      // Subtitles
      subtitlesDisplay.innerHTML = \`"\${activeScene.script}"\`;

      // Trigger SFX
      playSubBassPulse(activeScene.index === 0 ? 55 : activeScene.index === 2 ? 80 : 65);
      if (isPlaying && voiceoverEnabled) {
        speakSceneScript(activeScene.index);
      }

      // Switch active scene pane
      document.querySelectorAll('.scene-pane').forEach((p, idx) => {
        p.classList.toggle('active', idx === activeScene.index);
      });

      // Update scene chips
      sceneChips.forEach((chip, idx) => {
        chip.classList.toggle('active', idx === activeScene.index);
      });
    }

    // Micro-interactions based on specific time in scene
    if (activeScene.index === 0) {
      // Scene 1: Laser scanner sweep across clause
      const localT = t - activeScene.start;
      const progress = Math.min(1, Math.max(0, localT / 4.0));
      laserScan.style.opacity = progress > 0.1 && progress < 0.95 ? '1' : '0';
      laserScan.style.left = (progress * 100) + '%';
      if (localT > 2.2 && localT < 2.3) playCyberPing();
    } else if (activeScene.index === 1) {
      // Scene 2: Air gap halo ring expansion
      const localT = t - activeScene.start;
      if (localT > 1.0) {
        airgapRing.style.opacity = '1';
        airgapRing.style.transform = 'scale(1)';
      }
    } else if (activeScene.index === 2) {
      // Scene 3: Millisecond counter ticker
      const localT = t - activeScene.start;
      if (localT < 1.5) {
        const val = (Math.random() * 50 + 20).toFixed(1);
        tickerMs.innerText = val;
      } else {
        tickerMs.innerText = '79.8';
      }
    }

    // Timeline bar & time display
    const pct = (t / TOTAL_DURATION) * 100;
    timelineProgress.style.width = pct + '%';

    const curM = Math.floor(t / 60);
    const curS = Math.floor(t % 60);
    timeCurrent.innerText = (curM < 10 ? '0' : '') + curM + ':' + (curS < 10 ? '0' : '') + curS;
  }

  // Animation Loop
  function tick(timestamp) {
    const dt = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    if (isPlaying) {
      currentTime += dt;
      if (currentTime >= TOTAL_DURATION) {
        pauseVideo();
        currentTime = TOTAL_DURATION;
      }
      updateStage(currentTime);
    }
    drawParticles();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Playback Control Functions
  function playVideo() {
    initAudio();
    isPlaying = true;
    playText.innerText = 'Pause';
    playOverlay.style.opacity = '0';
    playOverlay.style.pointerEvents = 'none';
    if (currentSpokenScene !== currentActiveSceneIndex && voiceoverEnabled) {
      speakSceneScript(currentActiveSceneIndex);
    }
    playClickFoley();
  }

  function pauseVideo() {
    isPlaying = false;
    playText.innerText = 'Play';
    if (window.speechSynthesis) window.speechSynthesis.pause();
    playClickFoley();
  }

  function togglePlay() {
    if (isPlaying) pauseVideo();
    else {
      if (currentTime >= TOTAL_DURATION) currentTime = 0;
      playVideo();
    }
  }

  function seekTime(target) {
    currentTime = Math.max(0, Math.min(TOTAL_DURATION, target));
    updateStage(currentTime);
    if (isPlaying && voiceoverEnabled) {
      speakSceneScript(currentActiveSceneIndex);
    }
  }

  window.seekToScene = function(idx) {
    if (idx >= 0 && idx < SCENES.length) {
      seekTime(SCENES[idx].start + 0.1);
      if (!isPlaying) playVideo();
    }
  };

  // Event Listeners
  playOverlay.addEventListener('click', playVideo);
  btnPlay.addEventListener('click', togglePlay);

  btnReplay.addEventListener('click', () => {
    seekTime(0);
    playVideo();
  });

  btnAudio.addEventListener('click', () => {
    initAudio();
    audioEnabled = !audioEnabled;
    btnAudio.classList.toggle('active', audioEnabled);
    btnAudio.querySelector('span').innerText = audioEnabled ? 'Sound ON' : 'Muted';
    playClickFoley();
  });

  btnVoiceover.addEventListener('click', () => {
    voiceoverEnabled = !voiceoverEnabled;
    btnVoiceover.classList.toggle('active', voiceoverEnabled);
    voiceoverText.innerText = voiceoverEnabled ? 'Voiceover ON' : 'Voiceover OFF';
    if (!voiceoverEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    } else if (isPlaying) {
      speakSceneScript(currentActiveSceneIndex);
    }
  });

  timelineBar.addEventListener('click', (e) => {
    const rect = timelineBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seekTime(ratio * TOTAL_DURATION);
  });

  btnFullscreen.addEventListener('click', () => {
    const wrapper = document.getElementById('stage-wrapper');
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowRight') {
      seekTime(currentTime + 5);
    } else if (e.code === 'ArrowLeft') {
      seekTime(currentTime - 5);
    } else if (e.code === 'KeyM') {
      btnAudio.click();
    } else if (e.code === 'KeyF') {
      btnFullscreen.click();
    }
  });

  // Whop Checkout Trigger
  window.triggerCheckout = function(plan) {
    const productId = 'prod_ETdsHhJlU1fMM';
    const returnUrl = encodeURIComponent(window.location.origin + '/welcome?status=success&tool=contractcompare');
    const checkoutUrl = 'https://whop.com/checkout/' + productId + '?return_url=' + returnUrl;
    window.open(checkoutUrl, 'NexusCheckout', 'width=540,height=760,resizable=yes,scrollbars=yes');
  };

  // Initial stage render
  updateStage(0);

})();
</script>

</body>
</html>`;

const outPathLanding = path.join(__dirname, 'public', 'ContractGuard_Launch_Film_Elite.html');
fs.writeFileSync(outPathLanding, htmlContent, 'utf-8');
console.log('Saved to:', outPathLanding);

// Also copy to user's Downloads folder for instant 1-click double-click playback!
const downloadsDir = path.join('C:', 'Users', 'lenovo', 'Downloads');
if (fs.existsSync(downloadsDir)) {
  const outPathDownloads = path.join(downloadsDir, 'ContractGuard_Launch_Film_Elite.html');
  fs.writeFileSync(outPathDownloads, htmlContent, 'utf-8');
  console.log('Saved to Downloads:', outPathDownloads);
}
