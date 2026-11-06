import asyncio
import os
from playwright.async_api import async_playwright
import fitz

HTML_CONTENT = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>دليل الشعار والهوية البصرية وشبكات التواصل — Nexus ContractGuard™</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&family=Cinzel:wght@600;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

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
    background-color: #ffffff;
    color: #1f2937;
    font-family: 'Cairo', 'Tajawal', sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 9.5pt;
    line-height: 1.55;
    direction: rtl;
    text-align: right;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    height: 297mm;
    padding: 16mm 18mm 16mm 18mm;
    position: relative;
    page-break-after: always;
    overflow: hidden;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
  }

  /* Header & Footer */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #e5e7eb;
    padding-bottom: 8px;
    margin-bottom: 16px;
    font-size: 8pt;
    color: #6b7280;
  }

  .page-header .brand-tag {
    color: #059669;
    font-weight: 800;
  }

  .page-footer {
    position: absolute;
    bottom: 10mm;
    left: 18mm;
    right: 18mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e5e7eb;
    padding-top: 8px;
    font-size: 7.5pt;
    color: #9ca3af;
  }

  /* Cover Page */
  .cover {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20mm 20mm;
    background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
  }

  .cover-top-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    padding: 5px 14px;
    border-radius: 9999px;
    font-size: 8pt;
    font-weight: 700;
    color: #047857;
    width: fit-content;
  }

  .cover-title-area {
    margin-top: 14px;
  }

  .cover-title-area h1 {
    font-size: 28pt;
    font-weight: 900;
    line-height: 1.25;
    color: #111827;
    margin-bottom: 8px;
    direction: ltr;
    text-align: right;
  }

  .cover-title-area h1 span {
    color: #059669;
  }

  .cover-subtitle {
    font-size: 11pt;
    color: #4b5563;
    font-weight: 400;
    line-height: 1.6;
    max-width: 620px;
  }

  .cover-centerpiece {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 16px 0;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
  }

  .cover-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 14px 0;
  }

  .cover-stat-box {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 14px;
    border-right: 3px solid #059669;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }

  .cover-stat-val {
    font-size: 12pt;
    font-weight: 800;
    color: #111827;
  }

  .cover-stat-lbl {
    font-size: 7.5pt;
    color: #6b7280;
    margin-top: 2px;
  }

  .cover-meta {
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 8pt;
    color: #6b7280;
  }

  /* Section Headings */
  .section-tag {
    font-size: 7.5pt;
    color: #059669;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  h2 {
    font-size: 16pt;
    font-weight: 800;
    color: #111827;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1f2937;
    margin: 10px 0 4px 0;
  }

  p {
    color: #4b5563;
    font-size: 9pt;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  /* Grids and Cards */
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
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    text-align: right;
  }

  .card.white-card {
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }

  .card-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .card-body {
    font-size: 8.5pt;
    color: #4b5563;
    line-height: 1.5;
  }

  /* Logo Presentation Boxes */
  .logo-display-box {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 105px;
  }

  .logo-display-box.dark-box {
    background: #030712;
    border-color: #1f2937;
  }

  .logo-caption {
    font-size: 7.5pt;
    font-weight: 700;
    color: #6b7280;
    margin-top: 8px;
  }

  /* Badges */
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 700;
  }

  .badge-emerald {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }

  .badge-blue {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
  }

  .badge-gray {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .badge-cyan {
    background: #f0f9ff;
    color: #0284c7;
    border: 1px solid #bae6fd;
  }

  /* Tables */
  .audit-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 8pt;
    text-align: right;
  }

  .audit-table th {
    background: #f3f4f6;
    color: #111827;
    padding: 8px 10px;
    font-weight: 700;
    font-size: 7.5pt;
    border-bottom: 1.5px solid #d1d5db;
  }

  .audit-table td {
    padding: 7px 10px;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
    vertical-align: middle;
  }

  .audit-table tr:nth-child(even) td {
    background: #f9fafb;
  }

  /* Specimen Boxes */
  .type-specimen {
    padding: 10px 12px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    margin-bottom: 8px;
    text-align: right;
  }

  .type-family-name {
    font-size: 7.5pt;
    color: #059669;
    margin-bottom: 2px;
    font-weight: 700;
  }

  /* Social Media Previews */
  .social-avatar-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px;
  }

  .avatar-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #030712;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1.5px solid #00F5A0;
  }

  .avatar-square {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: #030712;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1.5px solid #00F5A0;
  }

  .banner-preview {
    width: 100%;
    height: 95px;
    background: #030712;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border: 1px solid #1f2937;
  }

  .og-card-preview {
    width: 100%;
    height: 130px;
    background: #030712;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    border: 1px solid #1f2937;
    display: flex;
    padding: 16px;
    gap: 16px;
  }
</style>
</head>
<body>

  <!-- ================= PAGE 1: غلاف كتيب الهوية والشعار (أبيض تحريري) ================= -->
  <div class="page cover">
    <div>
      <div class="cover-top-badge">
        <span>★</span> دليل الأصول البصرية ومجموعة الشعار · WHITE EDITORIAL EDITION
      </div>
      <div class="cover-title-area">
        <h1>NEXUS <span>CONTRACTGUARD™</span></h1>
        <h2 style="font-size:16pt; color:#374151; font-weight:700; margin-bottom:6px;">
          دليل الشعار بجميع أشكاله، منظومة الخطوط، وأصول مواقع التواصل
        </h2>
        <div class="cover-subtitle">
          المرجع البصري والتنفيذي الكامل لكافة أشكال الشعار، الأيقونات المستقلة، الختم القضائي، مقاسات شبكات التواصل الاجتماعي، وأسلوب المحتوى والتسويق لجمهور المحامين.
        </div>
      </div>
    </div>

    <!-- الشعار الرئيسي مدمج في المنتصف داخل إطار أبيض أنيق -->
    <div class="cover-centerpiece">
      <div style="display:flex; align-items:center; gap:16px; direction:ltr;">
        <!-- Logo Glyph SVG -->
        <svg width="56" height="56" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill="#030712" stroke="#059669" stroke-width="2.5" />
          <line x1="50" y1="24" x2="50" y2="76" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="24" y1="50" x2="76" y2="50" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="32" y1="32" x2="68" y2="68" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="32" y1="68" x2="68" y2="32" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="50" cy="50" r="5" fill="#ffffff" />
        </svg>
        <div style="text-align:left;">
          <div style="font-family:'Cinzel', serif; font-size:22pt; font-weight:900; letter-spacing:1.5px; color:#111827; line-height:1;">
            NEXUS
          </div>
          <div style="font-family:'Cairo', sans-serif; font-size:12pt; font-weight:800; color:#059669; letter-spacing:2px; line-height:1.2;">
            CONTRACTGUARD<span style="font-size:9pt; vertical-align:top;">™</span>
          </div>
          <div style="font-family:'JetBrains Mono', monospace; font-size:6.5pt; color:#6b7280; letter-spacing:1px; margin-top:3px;">
            AIR-GAPPED LEGAL AUDIT WORKSTATION
          </div>
        </div>
      </div>
    </div>

    <div class="cover-grid">
      <div class="cover-stat-box">
        <div class="cover-stat-val">5 أشكال للشعار</div>
        <div class="cover-stat-lbl">عرضي، طولي، أيقونة، نصي، وختم</div>
      </div>
      <div class="cover-stat-box">
        <div class="cover-stat-val">أصول شبكات التواصل</div>
        <div class="cover-stat-lbl">أفاتار 1:1، غلاف 3:1، وبطاقات OG</div>
      </div>
      <div class="cover-stat-box">
        <div class="cover-stat-val">معايير النشر الجنائي</div>
        <div class="cover-stat-lbl">قواعد وأسلوب الخطاب القانوني</div>
      </div>
    </div>

    <div class="cover-meta">
      <div>
        <strong>دليل الهوية البصرية الرسمية · النسخة التحريرية البيضاء</strong>
        مصمم للطباعة الورقية الفاخرة، ملفات الشركاء، واستخدام مصممي الجرافيك ومسؤولي التسويق.<br>
        معتمد وفق معايير الحوكمة المؤسسية لـ Nexus OS.
      </div>
      <div style="text-align: left; font-family: 'JetBrains Mono', sans-serif; direction: ltr;">
        <div>DATE: NOVEMBER 2026</div>
        <div>SPEC: BRAND-ASSET-KIT-V2.4</div>
      </div>
    </div>
  </div>

  <!-- ================= PAGE 2: الشعار بجميع أشكاله ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الأول</span>
      <span>أشكال الشعار والمقاسات (Logo Architecture & Lockups)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono'; font-size:7.5pt;">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">الهندسة المتوازنة للشعار</div>
    <h2>1. الشعار بجميع أشكاله وتكويناته الهندسية</h2>
    <p>
      تم تصميم نظام الشعار ليمنح مرونة كاملة في مختلف التطبيقات الرقمية والمطبوعة، مع الحفاظ على بصمة بصرية فورية لا تخطئها عين المحامي أو المستشار القانوني. يرتكز الشعار على أيقونة النجمة السداسية التشفيرية المدمجة مع الدرع الحامي.
    </p>

    <!-- الشبكة الرباعية لأشكال الشعار -->
    <div class="grid-2">
      <!-- 1. الشعار العرضي الأساسي -->
      <div class="logo-display-box">
        <div style="display:flex; align-items:center; gap:12px; direction:ltr;">
          <svg width="38" height="38" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#030712" stroke="#059669" stroke-width="3" />
            <line x1="50" y1="24" x2="50" y2="76" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="24" y1="50" x2="76" y2="50" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="32" y1="32" x2="68" y2="68" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="68" x2="68" y2="32" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
          </svg>
          <div style="text-align:left;">
            <span style="font-family:'Cinzel', serif; font-size:16pt; font-weight:900; color:#111827;">NEXUS </span>
            <span style="font-family:'Cairo', sans-serif; font-size:12pt; font-weight:800; color:#059669;">CONTRACTGUARD™</span>
          </div>
        </div>
        <div class="logo-caption">01. الشعار العرضي الأساسي (Primary Horizontal Lockup)</div>
        <div style="font-size:7pt; color:#9ca3af; margin-top:2px;">لترويسة الموقع، شريط التنقل العلوي، وتوقيع البريد الرسمي</div>
      </div>

      <!-- 2. الشعار الطولي المتعامد -->
      <div class="logo-display-box">
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <svg width="36" height="36" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#030712" stroke="#059669" stroke-width="3" />
            <line x1="50" y1="24" x2="50" y2="76" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="24" y1="50" x2="76" y2="50" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="32" y1="32" x2="68" y2="68" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="68" x2="68" y2="32" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
          </svg>
          <div style="direction:ltr; text-align:center;">
            <div style="font-family:'Cinzel', serif; font-size:13pt; font-weight:900; color:#111827; line-height:1;">NEXUS</div>
            <div style="font-family:'Cairo', sans-serif; font-size:9pt; font-weight:800; color:#059669;">CONTRACTGUARD™</div>
          </div>
        </div>
        <div class="logo-caption">02. الشعار الطولي (Stacked / Vertical Lockup)</div>
        <div style="font-size:7pt; color:#9ca3af; margin-top:2px;">للواجهات المربعة، شاشات البداية Splash، والبطاقات الرأسية</div>
      </div>

      <!-- 3. الأيقونة المستقلة والرمز الهندسي -->
      <div class="logo-display-box">
        <div style="display:flex; align-items:center; gap:16px;">
          <svg width="42" height="42" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#030712" stroke="#059669" stroke-width="3" />
            <line x1="50" y1="24" x2="50" y2="76" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="24" y1="50" x2="76" y2="50" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="32" y1="32" x2="68" y2="68" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="32" y1="68" x2="68" y2="32" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
          </svg>
          <svg width="42" height="42" viewBox="0 0 100 100">
            <rect x="6" y="6" width="88" height="88" rx="20" fill="#030712" stroke="#059669" stroke-width="3" />
            <line x1="50" y1="26" x2="50" y2="74" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="26" y1="50" x2="74" y2="50" stroke="#00F5A0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="33" y1="33" x2="67" y2="67" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="33" y1="67" x2="67" y2="33" stroke="#00D9F5" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
          </svg>
        </div>
        <div class="logo-caption">03. الأيقونة المستقلة (Standalone Icon Glyph)</div>
        <div style="font-size:7pt; color:#9ca3af; margin-top:2px;">أيقونة Favicon للمتصفح، أيقونة تطبيقات سطح المكتب PWA</div>
      </div>

      <!-- 4. الشعار النصي البحت -->
      <div class="logo-display-box">
        <div style="direction:ltr; text-align:center; padding:10px 0;">
          <span style="font-family:'Cinzel', serif; font-size:18pt; font-weight:900; color:#111827; letter-spacing:1px;">NEXUS </span>
          <span style="font-family:'Cairo', sans-serif; font-size:13pt; font-weight:800; color:#111827; letter-spacing:1px;">CONTRACTGUARD™</span>
        </div>
        <div class="logo-caption">04. الشعار النصي البحت (Typographic Wordmark)</div>
        <div style="font-size:7pt; color:#9ca3af; margin-top:2px;">للمستندات القانونية الرسمية، تذييل العقود، والمراسلات القضائية</div>
      </div>
    </div>

    <!-- 5. الختم الدائري القضائي -->
    <div class="section-tag" style="margin-top:8px;">05. الختم الدائري القضائي المعتمد (OFFICIAL CORPORATE SEAL)</div>
    <div class="card white-card" style="display:flex; align-items:center; gap:16px;">
      <div style="flex-shrink:0;">
        <svg width="90" height="90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="95" fill="none" stroke="#111827" stroke-width="2.5" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="#111827" stroke-width="1.2" stroke-dasharray="3,2" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#111827" stroke-width="1.5" />
          <circle cx="100" cy="100" r="48" fill="none" stroke="#111827" stroke-width="1" />
          <line x1="100" y1="78" x2="100" y2="122" stroke="#111827" stroke-width="2"/>
          <line x1="78" y1="100" x2="122" y2="100" stroke="#111827" stroke-width="2"/>
          <line x1="84" y1="84" x2="116" y2="116" stroke="#111827" stroke-width="1.5"/>
          <line x1="84" y1="116" x2="116" y2="84" stroke="#111827" stroke-width="1.5"/>
          <circle cx="100" cy="100" r="4" fill="#111827" />
          <text x="100" y="62" font-family="'Cinzel', serif" font-size="7" font-weight="bold" fill="#111827" text-anchor="middle" letter-spacing="0.5">NEXUS CONTRACTGUARD</text>
          <text x="100" y="146" font-family="'JetBrains Mono', monospace" font-size="6" font-weight="bold" fill="#111827" text-anchor="middle" letter-spacing="0.5">AUTHENTIC SEAL · 2026</text>
        </svg>
      </div>
      <div>
        <div class="card-title">الختم القضائي الدائري للمصادقة وتدقيق الصفقات</div>
        <div class="card-body">
          مخصص حصرياً لشهادات الفحص النافي للجهالة (Pre-Signing Diligence Certificates) ومذكرات التعديل قبل التوقيع. يُطبع بحبر أسود 100% أو كحلي داكن ليحاكي أختام كتاب العدل ومسجلي المحاكم، ويُمنع نهائياً تلوينه بألوان براقة على المستندات الورقية.
        </div>
      </div>
    </div>

    <!-- قواعد المسافات الآمنة والحد الأدنى للحجم -->
    <div class="section-tag" style="margin-top:10px;">المسافة الآمنة والحد الأدنى للحجم (CLEARSPACE & MINIMUM SIZE)</div>
    <div class="grid-2" style="margin-bottom:0;">
      <div class="card">
        <strong style="color:#059669; font-size:8.5pt;">قاعدة المسافة الآمنة (X-Clearance):</strong>
        <p style="margin-bottom:0; font-size:8pt; margin-top:2px;">يجب ترك مسافة فارغة حول الشعار من جميع الجهات تعادل ارتفاع حرف "N" في كلمة NEXUS لمنع تشويش العناصر المحيطة.</p>
      </div>
      <div class="card">
        <strong style="color:#059669; font-size:8.5pt;">الحد الأدنى للمقاس (Minimum Scale):</strong>
        <p style="margin-bottom:0; font-size:8pt; margin-top:2px;">العرض الرقمي الأدنى للشعار العرضي: 120 بكسل. الأيقونة المستقلة: 16 بكسل كحد أدنى. الطباعة الورقية: 25 ملم كحد أدنى لضمان وضوح النصوص الدقيقة.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل الشعار والهوية</span>
      <span>النسخة التحريرية البيضاء</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">PAGE 02</span>
    </div>
  </div>

  <!-- ================= PAGE 3: تطبيقات الألوان والمحظورات ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الثاني</span>
      <span>تطبيقات الألوان والمحظورات (Colorways & Rules)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono'; font-size:7.5pt;">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">مرونة الهوية عبر مختلف الخلفيات والوسائط</div>
    <h2>2. خيارات الألوان والتطبيق على الخلفيات</h2>
    <p>
      لضمان ثبات الهوية في كافة الظروف (الطباعة الورقية، شاشات العرض، المحاكم، والعروض التقديمية)، تم تحديد 4 نسخ لونية رسمية للشعار لا يجوز الخروج عنها.
    </p>

    <!-- 4 بطاقات للتطبيقات اللونية -->
    <div class="grid-2">
      <!-- 1. بالألوان على خلفية بيضاء -->
      <div class="card white-card" style="border: 1.5px solid #059669;">
        <div class="badge badge-emerald" style="margin-bottom:8px;">النسخة الأساسية على الأبيض (Primary on White)</div>
        <div style="background:#ffffff; padding:16px; border-radius:6px; display:flex; justify-content:center; align-items:center; border:1px dashed #d1d5db; min-height:65px;">
          <div style="display:flex; align-items:center; gap:10px; direction:ltr;">
            <svg width="30" height="30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="#030712" stroke="#059669" stroke-width="3" />
              <line x1="50" y1="24" x2="50" y2="76" stroke="#00F5A0" stroke-width="3.5"/>
              <line x1="24" y1="50" x2="76" y2="50" stroke="#00F5A0" stroke-width="3.5"/>
              <circle cx="50" cy="50" r="4" fill="#ffffff" />
            </svg>
            <span style="font-family:'Cinzel', serif; font-size:14pt; font-weight:900; color:#111827;">NEXUS </span>
            <span style="font-family:'Cairo', sans-serif; font-size:11pt; font-weight:800; color:#059669;">CONTRACTGUARD™</span>
          </div>
        </div>
        <div class="card-body" style="margin-top:8px;">
          تستخدم في المراسلات الرسمية البيضاء، عروض المستثمرين، الفواتير، وموقع الشركة في الوضع الفاتح.
        </div>
      </div>

      <!-- 2. النسخة الأحادية السوداء (Black Monochrome) -->
      <div class="card white-card" style="border: 1.5px solid #111827;">
        <div class="badge badge-gray" style="margin-bottom:8px;">النسخة الأحادية السوداء (100% Black Ink)</div>
        <div style="background:#ffffff; padding:16px; border-radius:6px; display:flex; justify-content:center; align-items:center; border:1px dashed #d1d5db; min-height:65px;">
          <div style="display:flex; align-items:center; gap:10px; direction:ltr;">
            <svg width="30" height="30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#111827" stroke-width="3.5" />
              <line x1="50" y1="24" x2="50" y2="76" stroke="#111827" stroke-width="3.5"/>
              <line x1="24" y1="50" x2="76" y2="50" stroke="#111827" stroke-width="3.5"/>
              <circle cx="50" cy="50" r="4" fill="#111827" />
            </svg>
            <span style="font-family:'Cinzel', serif; font-size:14pt; font-weight:900; color:#111827;">NEXUS </span>
            <span style="font-family:'Cairo', sans-serif; font-size:11pt; font-weight:800; color:#111827;">CONTRACTGUARD™</span>
          </div>
        </div>
        <div class="card-body" style="margin-top:8px;">
          مخصصة للطباعة بالأبيض والأسود، إيداعات المحاكم، أجهزة الفاكس، والأختام المنقوشة (Embossing).
        </div>
      </div>

      <!-- 3. النسخة المعكوسة على خلفية داكنة (Inverted Dark) -->
      <div class="card white-card" style="border: 1.5px solid #374151;">
        <div class="badge badge-blue" style="margin-bottom:8px;">النسخة المعكوسة على الداكن (Inverted Dark)</div>
        <div style="background:#030712; padding:16px; border-radius:6px; display:flex; justify-content:center; align-items:center; min-height:65px;">
          <div style="display:flex; align-items:center; gap:10px; direction:ltr;">
            <svg width="30" height="30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="#0b0f19" stroke="#00F5A0" stroke-width="2.5" />
              <line x1="50" y1="24" x2="50" y2="76" stroke="#00F5A0" stroke-width="3.5"/>
              <line x1="24" y1="50" x2="76" y2="50" stroke="#00F5A0" stroke-width="3.5"/>
              <circle cx="50" cy="50" r="4" fill="#ffffff" />
            </svg>
            <span style="font-family:'Cinzel', serif; font-size:14pt; font-weight:900; color:#ffffff;">NEXUS </span>
            <span style="font-family:'Cairo', sans-serif; font-size:11pt; font-weight:800; color:#00F5A0;">CONTRACTGUARD™</span>
          </div>
        </div>
        <div class="card-body" style="margin-top:8px;">
          النسخة المعتمدة لواجهة التطبيق المظلمة (Studio)، موقع الهبوط الحي، وأغلفة شبكات التواصل.
        </div>
      </div>

      <!-- 4. النسخة الخطية البسيطة (Outline Minimal) -->
      <div class="card white-card" style="border: 1.5px solid #0284C7;">
        <div class="badge badge-cyan" style="margin-bottom:8px;">النسخة الخطية البسيطة (Outline Stroke)</div>
        <div style="background:#ffffff; padding:16px; border-radius:6px; display:flex; justify-content:center; align-items:center; border:1px dashed #d1d5db; min-height:65px;">
          <div style="display:flex; align-items:center; gap:10px; direction:ltr;">
            <svg width="30" height="30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#0284c7" stroke-width="2.5" />
              <line x1="50" y1="26" x2="50" y2="74" stroke="#0284c7" stroke-width="2.5"/>
              <line x1="26" y1="50" x2="74" y2="50" stroke="#0284c7" stroke-width="2.5"/>
              <circle cx="50" cy="50" r="3.5" fill="none" stroke="#0284c7" stroke-width="2" />
            </svg>
            <span style="font-family:'Cinzel', serif; font-size:14pt; font-weight:900; color:#0284c7;">NEXUS </span>
            <span style="font-family:'Cairo', sans-serif; font-size:11pt; font-weight:800; color:#0284c7;">CONTRACTGUARD™</span>
          </div>
        </div>
        <div class="card-body" style="margin-top:8px;">
          تستخدم كعلامة مائية خفيفة داخل العقود والصفحات الخلفية لمنع التزوير وحفظ الملكية.
        </div>
      </div>
    </div>

    <!-- جدول المحظورات الصارمة -->
    <div class="section-tag" style="margin-top:10px;">المحظورات الصارمة لتشويه الشعار (STRICT PROHIBITIONS)</div>
    <table class="audit-table">
      <thead>
        <tr>
          <th style="width:30%;">المحظور الشائع (خطأ تصميمي)</th>
          <th style="width:35%;">النتيجة المترتبة</th>
          <th style="width:35%;">الإجراء الصحيح المعتمد</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span style="color:#dc2626; font-weight:700;">✕ تمديد أو ضغط الشعار</span></td>
          <td>تشويه التناسب الذهبي للأيقونة وفقدان الهيبة المؤسسية.</td>
          <td><span style="color:#059669; font-weight:700;">✓ التكبير والتصغير بنسبة متساوية (Shift + Scale)</span></td>
        </tr>
        <tr>
          <td><span style="color:#dc2626; font-weight:700;">✕ تغيير خط كلمة NEXUS</span></td>
          <td>فقدان الطابع القضائي الكلاسيكي المعتمد على خط Cinzel.</td>
          <td><span style="color:#059669; font-weight:700;">✓ استخدام الملفات الموجهة الأصلية (SVG / Vector)</span></td>
        </tr>
        <tr>
          <td><span style="color:#dc2626; font-weight:700;">✕ وضعه على خلفيات فاقعة أو مشوشة</span></td>
          <td>ضعف التباين وصعوبة قراءة الشعار للمحامين.</td>
          <td><span style="color:#059669; font-weight:700;">✓ وضعه على خلفية بيضاء نقية أو داكنة متباينة</span></td>
        </tr>
        <tr>
          <td><span style="color:#dc2626; font-weight:700;">✕ تلوين الختم بألوان نيون</span></td>
          <td>فقدان الختم لقيمته الرسمية وظهوره كملصق هزلي.</td>
          <td><span style="color:#059669; font-weight:700;">✓ حصر الختم بالأسود 100% أو الكحلي الداكن فقط</span></td>
        </tr>
      </tbody>
    </table>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل الشعار والهوية</span>
      <span>النسخة التحريرية البيضاء</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">PAGE 03</span>
    </div>
  </div>

  <!-- ================= PAGE 4: منظومة الخطوط وتفاصيل الهوية ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الثالث</span>
      <span>منظومة الخطوط وتفاصيل الهوية (Typography System)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono'; font-size:7.5pt;">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">الهندسة الطباعية المعتمدة</div>
    <h2>3. منظومة الخطوط والتكامل اللغوي (عربي / إنجليزي)</h2>
    <p>
      تم اختيار عائلة الخطوط بعناية لتحقيق أعلى درجات التوازن بين الهيبة القانونية اللاتينية (Am-Law Standards) والرصانة العربية الحديثة (Modern Legal Arabic). جميع الخطوط مفتوحة المصدر ومتاحة للاستخدام التجاري الكامل.
    </p>

    <!-- 1. خط العناوين اللاتينية الكلاسيكية -->
    <div class="type-specimen">
      <div class="type-family-name">خط العناوين القانونية اللاتينية · Cinzel / Times-Roman (Serif)</div>
      <div style="font-family:'Cinzel', serif; font-size:14pt; font-weight:900; color:#111827; direction:ltr; text-align:left;">
        PRE-SIGNING LEGAL DEFENSE & CONTRACT INTEGRITY
      </div>
      <p style="margin-top:4px; margin-bottom:0; font-size:7.5pt; color:#6b7280;">
        <strong>الاستخدام:</strong> كلمة NEXUS في الشعار، ترويسات الصفقات الكبرى، عناوين الشهادات الصادرة، وشارات الهيبة القضائية. الوزن: 700 / 900.
      </p>
    </div>

    <!-- 2. خط العناوين والواجهات العربية -->
    <div class="type-specimen">
      <div class="type-family-name">خط الواجهات والعناوين العربية · Cairo (Sans-Serif)</div>
      <div style="font-family:'Cairo', sans-serif; font-size:13pt; font-weight:800; color:#111827;">
        دفاعك القانوني الاستباقي قبل التوقيع. لا توقع عقداً مشوباً بعيب أبداً.
      </div>
      <p style="margin-top:4px; margin-bottom:0; font-size:7.5pt; color:#6b7280;">
        <strong>الاستخدام:</strong> عناوين موقع الهبوط، أزرار الإجراءات، بطاقات كشف الثغرات، ورسائل التحذير البارزة. الوزن: 700 / 800 / 900.
      </p>
    </div>

    <!-- 3. خط قراءة نصوص العقود -->
    <div class="type-specimen">
      <div class="type-family-name">خط قراءة المسودات والفقرات الطويلة · Tajawal / Inter</div>
      <div style="font-family:'Tajawal', sans-serif; font-size:9.5pt; color:#374151; line-height:1.6;">
        تم فحص المسودة غير الموقعة محلياً بالكامل عبر محرك الفحص الرياضي الشجري داخل ذاكرة الجهاز دون أي اتصال بخوادم خارجية، بما يضمن الحماية المطلقة لسرية العقد وحصانة المحامي بموجب قواعد السلوك المهني الدولية.
      </div>
      <p style="margin-top:4px; margin-bottom:0; font-size:7.5pt; color:#6b7280;">
        <strong>الاستخدام:</strong> شاشة قراءة ومراجعة مسودات العقود، فقرات الشرح والتحليل، ونصوص ملحق التعديل القانوني. الوزن: 400 / 500.
      </p>
    </div>

    <!-- 4. خط التشفير والبيانات الرياضية -->
    <div class="type-specimen">
      <div class="type-family-name">خط التشفير والبيانات الرياضية · JetBrains Mono (Monospace)</div>
      <div style="font-family:'JetBrains Mono', monospace; font-size:8.5pt; color:#059669; direction:ltr; text-align:left;">
        SHA256: 9e74a2b9c801ff7d084c718b52e3a1f4 [LATENCY: 0.18ms · RAM-ONLY]
      </div>
      <p style="margin-top:4px; margin-bottom:0; font-size:7.5pt; color:#6b7280;">
        <strong>الاستخدام:</strong> بصمات الهاش، سرعة التدقيق بالميلي ثانية، أرقام المواد القانونية، وأرقام بيتس القضائية (Bates Numbers).
      </p>
    </div>

    <!-- سلم الأحجام والمسافات السطرية -->
    <div class="section-tag" style="margin-top:8px;">مقياس السلم الطباعي المعتمد (TYPOGRAPHIC SCALE)</div>
    <div class="grid-4" style="margin-bottom:0;">
      <div class="card">
        <strong style="font-size:8pt; color:#111827;">H1 العناوين الكبرى</strong>
        <div style="font-size:7.5pt; color:#059669; font-weight:700;">28pt - 36pt</div>
        <div style="font-size:7pt; color:#6b7280;">ارتفاع السطر: 1.2</div>
      </div>
      <div class="card">
        <strong style="font-size:8pt; color:#111827;">H2 عناوين الأقسام</strong>
        <div style="font-size:7.5pt; color:#059669; font-weight:700;">16pt - 20pt</div>
        <div style="font-size:7pt; color:#6b7280;">ارتفاع السطر: 1.3</div>
      </div>
      <div class="card">
        <strong style="font-size:8pt; color:#111827;">Body نصوص القراءة</strong>
        <div style="font-size:7.5pt; color:#059669; font-weight:700;">9.5pt - 11pt</div>
        <div style="font-size:7pt; color:#6b7280;">ارتفاع السطر: 1.6</div>
      </div>
      <div class="card">
        <strong style="font-size:8pt; color:#111827;">Data الأرقام والهاش</strong>
        <div style="font-size:7.5pt; color:#059669; font-weight:700;">8pt - 9pt</div>
        <div style="font-size:7pt; color:#6b7280;">ارتفاع السطر: 1.4</div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل الشعار والهوية</span>
      <span>النسخة التحريرية البيضاء</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">PAGE 04</span>
    </div>
  </div>

  <!-- ================= PAGE 5: أصول وتصاميم شبكات التواصل الاجتماعي ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الرابع</span>
      <span>أصول وتصاميم شبكات التواصل (Social Media Assets)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono'; font-size:7.5pt;">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">الحضور الرقمي والرموز المعتمدة</div>
    <h2>4. أصول وقوالب منصات التواصل الاجتماعي</h2>
    <p>
      لضمان حضور احترافي موحد أمام مجتمع المحامين وصناع القرار على منصات (LinkedIn، X/Twitter، GitHub، ومشاركات WhatsApp)، تم تصميم الأصول بالمقاسات المعيارية المعتمدة لكل منصة.
    </p>

    <!-- الأفاتار الدائري والمربع -->
    <div class="section-tag">أفاتار الحسابات الرسمية (PROFILE AVATARS - 1:1 RATIO)</div>
    <div class="grid-2">
      <div class="social-avatar-box">
        <div class="avatar-circle">
          <svg width="24" height="24" viewBox="0 0 100 100">
            <line x1="50" y1="20" x2="50" y2="80" stroke="#00F5A0" stroke-width="5" stroke-linecap="round"/>
            <line x1="20" y1="50" x2="80" y2="50" stroke="#00F5A0" stroke-width="5" stroke-linecap="round"/>
            <line x1="29" y1="29" x2="71" y2="71" stroke="#00D9F5" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="29" y1="71" x2="71" y2="29" stroke="#00D9F5" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="6" fill="#ffffff" />
          </svg>
        </div>
        <div>
          <strong style="font-size:8.5pt; color:#111827;">الأفاتار الدائري (Circular Avatar 400x400px)</strong>
          <p style="margin-bottom:0; font-size:7.5pt; color:#6b7280;">مخصص لحسابات X (Twitter) والصفحات الشخصية على LinkedIn.</p>
        </div>
      </div>

      <div class="social-avatar-box">
        <div class="avatar-square">
          <svg width="24" height="24" viewBox="0 0 100 100">
            <line x1="50" y1="20" x2="50" y2="80" stroke="#00F5A0" stroke-width="5" stroke-linecap="round"/>
            <line x1="20" y1="50" x2="80" y2="50" stroke="#00F5A0" stroke-width="5" stroke-linecap="round"/>
            <line x1="29" y1="29" x2="71" y2="71" stroke="#00D9F5" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="29" y1="71" x2="71" y2="29" stroke="#00D9F5" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="6" fill="#ffffff" />
          </svg>
        </div>
        <div>
          <strong style="font-size:8.5pt; color:#111827;">الأفاتار المربع (Company Logo 300x300px)</strong>
          <p style="margin-bottom:0; font-size:7.5pt; color:#6b7280;">مخصص لصفحة شركة LinkedIn Company Page ومتجر التطبيقات.</p>
        </div>
      </div>
    </div>

    <!-- غلاف الحساب 3:1 -->
    <div class="section-tag" style="margin-top:8px;">غلاف الحساب العريض (PROFILE BANNER / COVER - 3:1 RATIO / 1500x500px)</div>
    <div class="banner-preview">
      <div style="direction:ltr; text-align:left;">
        <div style="font-family:'Cinzel', serif; font-size:13pt; font-weight:900; color:#ffffff; letter-spacing:1px;">
          NEXUS CONTRACTGUARD™
        </div>
        <div style="font-family:'Cairo', sans-serif; font-size:8pt; font-weight:700; color:#00F5A0; margin-top:2px;">
          Pre-Signing Legal Defense · Zero Cloud Exposure · RAM-Only Audit
        </div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:6.5pt; color:#9ca3af; margin-top:4px;">
          ABA MODEL RULE 1.6 PRIVILEGED · 0% CLOUD LEAKAGE · DETERMINISTIC AST
        </div>
      </div>
      <div>
        <svg width="45" height="45" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#00F5A0" stroke-width="2" stroke-dasharray="3,2" />
          <circle cx="50" cy="50" r="38" fill="#0b0f19" stroke="#00D9F5" stroke-width="1.5" />
          <line x1="50" y1="26" x2="50" y2="74" stroke="#00F5A0" stroke-width="3"/>
          <line x1="26" y1="50" x2="74" y2="50" stroke="#00F5A0" stroke-width="3"/>
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
        </svg>
      </div>
    </div>

    <!-- كارت المشاركة الاجتماعية OG Card -->
    <div class="section-tag" style="margin-top:10px;">كارت المشاركة الاجتماعية (OPEN GRAPH SHARE CARD - 1200x630px)</div>
    <div class="og-card-preview">
      <div style="flex:1;">
        <span class="badge badge-emerald" style="margin-bottom:6px; font-size:6.5pt;">PRE-SIGNING LEGAL DEFENSE</span>
        <div style="font-family:'Cairo', sans-serif; font-size:11pt; font-weight:800; color:#ffffff; line-height:1.3; margin-bottom:4px;">
          كشف التناقضات المالية والثغرات القاتلة قبل توقيع العقود بـ 350ms
        </div>
        <p style="font-size:7.5pt; color:#9ca3af; line-height:1.4; margin-bottom:6px;">
          منصة الفحص الجنائي الأولى المخصصة لمكاتب المحاماة بدون سحابة وبدون رفع بيانات العميل.
        </p>
        <div style="font-family:'JetBrains Mono', monospace; font-size:6.5pt; color:#00F5A0; direction:ltr; text-align:left;">
          HTTPS://WWW.NEXUS-OS.STORE/DEMO
        </div>
      </div>
      <div style="width:110px; background:#111827; border-radius:6px; border:1px solid #1f2937; padding:8px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
        <svg width="34" height="34" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="#030712" stroke="#00F5A0" stroke-width="2.5" />
          <line x1="50" y1="24" x2="50" y2="76" stroke="#00F5A0" stroke-width="3.5"/>
          <line x1="24" y1="50" x2="76" y2="50" stroke="#00F5A0" stroke-width="3.5"/>
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
        </svg>
        <span style="font-family:'JetBrains Mono'; font-size:6pt; color:#00F5A0; font-weight:700; margin-top:4px;">100% AIR-GAPPED</span>
        <span style="font-size:5.5pt; color:#6b7280;">RAM ONLY</span>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل الشعار والهوية</span>
      <span>النسخة التحريرية البيضاء</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">PAGE 05</span>
    </div>
  </div>

  <!-- ================= PAGE 6: الأسلوب التسويقي وقواعد النشر ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الخامس</span>
      <span>الأسلوب وصوت المحتوى (Content Voice & Style)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono'; font-size:7.5pt;">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">استراتيجية النشر والمحتوى الموثوق</div>
    <h2>5. أسلوب الخطاب التسويقي ومعادلات النشر للمحامين</h2>
    <p>
      المحامون وشركاء الصفقات يستجيبون فقط للحقائق الملموسة ولغة الأرقام. المحتوى التسويقي لـ Nexus ContractGuard™ يبتعد كلياً عن أسلوب الإعلانات الاستهلاكية الرخيصة ويعتمد أسلوب "التشريح الجنائي للقضايا" (Forensic Teardown).
    </p>

    <!-- الركائز البصرية للصور -->
    <div class="section-tag">القواعد البصرية المعتمدة للصور (VISUAL CONTENT RULES)</div>
    <div class="grid-3">
      <div class="card">
        <strong style="color:#059669; font-size:8pt;">1. لا صور تعبيرية رخيصة</strong>
        <p style="margin-bottom:0; font-size:7.5pt; margin-top:2px;">يُمنع استخدام صور المصافحة باليد، أو ميزان العدالة المستهلك، أو مطرقة القاضي الكرتونية.</p>
      </div>
      <div class="card">
        <strong style="color:#059669; font-size:8pt;">2. لقطات حقيقية من العقود</strong>
        <p style="margin-bottom:0; font-size:7.5pt; margin-top:2px;">اعتمد لقطات شاشة دقيقة توضح التناقض بين الأرقام ($250k مقابل $205k) والمراجع المكسورة.</p>
      </div>
      <div class="card">
        <strong style="color:#059669; font-size:8pt;">3. براهين الإثبات الرقمي</strong>
        <p style="margin-bottom:0; font-size:7.5pt; margin-top:2px;">أبرز سرعة التدقيق (350ms)، وبصمة الـ SHA-256، وإثبات انعدام الاتصال السحابي.</p>
      </div>
    </div>

    <!-- معادلة كتابة المنشور القانوني الرباعية -->
    <div class="section-tag" style="margin-top:8px;">معادلة المنشور القانوني الناجح (THE 4-STEP POST FORMULA)</div>
    <div class="card white-card" style="border-right: 4px solid #059669; margin-bottom:10px;">
      <div class="card-title" style="font-size:9pt;">الهيكل الإلزامي لأي منشور على LinkedIn أو X:</div>
      <div class="card-body" style="font-size:8pt;">
        <strong>1. الخطاف الاستفزازي (The Risk Hook):</strong> طرح ثغرة حقيقية تكلف ملايين (مثلاً: خطأ كتابي بـ 45 ألف دولار كاد يفجر صفقة استحواذ).<br>
        <strong>2. التحليل القانوني الصريح (Statutory Breakdown):</strong> ذكر المادة القانونية (مثل UCC § 3-114 أو سوابق محكمة ديلاوير).<br>
        <strong>3. البراءة التقنية (The Zero-Cloud Remedy):</strong> إثبات كيف يكشف المحرك الثغرة في 350 ميلي ثانية دون إرسال حرف واحد للسحابة.<br>
        <strong>4. الدعوة للإجراء (CTA):</strong> رابط مباشر لتجربة الفحص على الموقع مجاناً (3 audits included).
      </div>
    </div>

    <!-- نموذج منشور جاهز للنشر -->
    <div class="section-tag">نموذج تطبيقي جاهز للنشر (READY-TO-POST COPY TEMPLATE)</div>
    <div class="card" style="background:#f3f4f6; border:1px solid #d1d5db; margin-bottom:12px;">
      <div style="font-size:8pt; color:#111827; line-height:1.5;">
        «في الساعة 2:00 صباحاً قبل جلسة إغلاق صفقة استحواذ، اكتشفنا تضارباً بين كتابة المقابل المالي ($250,000) بالكلمات وتسجيله ($205,000) بالأرقام في المادة 4.1.
        طبقاً للمادة 3-114 من القانون التجاري الأمريكي (UCC)، الكلمات تلغي الأرقام، مما يخلق عجزاً بـ 45 ألف دولار ومخاطرة بدعوى مسؤولية مهنية ضد المكتب.
        محرك Nexus ContractGuard فحص مسودة العقد بالكامل واستخرج التضارب في 220 ميلي ثانية داخل الذاكرة المؤقتة، مع توليد ملحق تعديل فوري جاهز للتوقيع — بدون رفع سطر واحد للسيرفرات السحابية.
        جرب فحص عقودك مجاناً وبأمان مطلق: www.nexus-os.store/demo»
      </div>
    </div>

    <!-- ميثاق الاعتماد المؤسسي -->
    <div class="card white-card" style="border: 1px solid #059669; background: #ecfdf5; padding:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:8.5pt; font-weight:800; color:#065f46;">اعتماد الهوية البصرية ومجموعة الشعار الرسمية</div>
          <div style="font-size:7.5pt; color:#047857; margin-top:2px;">
            معتمد من إدارة المنتجات ومجلس حوكمة العلامة التجارية لشركة Nexus OS · ترخيص دائم ومحمي بحقوق الملكية الفكرية.
          </div>
        </div>
        <div style="text-align:left; direction:ltr;">
          <span style="font-family:'JetBrains Mono'; font-size:6.5pt; color:#059669; font-weight:700;">[VERIFIED ASSET SEAL]</span>
          <div style="width:90px; border-bottom:1px solid #059669; padding-bottom:2px;">
            <svg width="85" height="18" viewBox="0 0 140 40">
              <path d="M 10 28 Q 30 5, 55 24 T 95 18 T 130 12" fill="none" stroke="#059669" stroke-width="2.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل الشعار والهوية</span>
      <span>النسخة التحريرية البيضاء</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">PAGE 06</span>
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
        await page.wait_for_timeout(2500)
        
        pdf_path = 'C:/Users/lenovo/.gemini/antigravity/brain/8f15943f-fbf5-4a66-8801-09de08672d63/Nexus_ContractGuard_Logo_Kit_White.pdf'
        await page.pdf(
            path=pdf_path,
            format='A4',
            print_background=True,
            margin={'top': '0mm', 'bottom': '0mm', 'left': '0mm', 'right': '0mm'}
        )
        print('White Logo Kit PDF created successfully at:', pdf_path)
        
        doc = fitz.open(pdf_path)
        print('Total pages generated:', len(doc))
        for i, page_doc in enumerate(doc):
            pix = page_doc.get_pixmap(dpi=150)
            img_path = f'C:/Users/lenovo/.gemini/antigravity/brain/8f15943f-fbf5-4a66-8801-09de08672d63/logo_kit_page_{i+1}.png'
            pix.save(img_path)
            print(f'Rendered page {i+1} screenshot to {img_path}')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(generate())
