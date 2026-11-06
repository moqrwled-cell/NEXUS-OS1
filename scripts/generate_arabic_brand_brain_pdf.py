import asyncio
import os
from playwright.async_api import async_playwright
import fitz

HTML_CONTENT = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>دليل هوية العلامة التجارية — Nexus ContractGuard™ (Brand Brain)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');

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
    font-family: 'Cairo', 'Tajawal', sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 10pt;
    line-height: 1.6;
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
    background: radial-gradient(circle at 15% 15%, rgba(0, 245, 160, 0.05) 0%, transparent 45%),
                radial-gradient(circle at 85% 85%, rgba(0, 217, 245, 0.04) 0%, transparent 45%),
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
    margin-bottom: 16px;
    font-size: 8pt;
    letter-spacing: 0.5px;
    color: #9ca3af;
  }

  .page-header .brand-tag {
    color: #00F5A0;
    font-weight: 700;
    font-family: 'Cairo', sans-serif;
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
    font-size: 7.5pt;
    color: #6b7280;
    font-family: 'Cairo', 'JetBrains Mono', sans-serif;
  }

  /* Cover Page */
  .cover {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20mm 20mm;
    background: radial-gradient(circle at 50% 40%, rgba(0, 245, 160, 0.08) 0%, transparent 60%),
                radial-gradient(circle at 20% 80%, rgba(0, 217, 245, 0.05) 0%, transparent 50%),
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
    font-size: 8pt;
    font-weight: 700;
    color: #00F5A0;
    width: fit-content;
  }

  .cover-title-area {
    margin-top: 14px;
  }

  .cover-title-area h1 {
    font-size: 30pt;
    font-weight: 900;
    line-height: 1.2;
    color: #ffffff;
    margin-bottom: 8px;
    direction: ltr;
    text-align: right;
  }

  .cover-title-area h1 span {
    background: linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cover-subtitle {
    font-size: 11.5pt;
    color: #9ca3af;
    font-weight: 400;
    line-height: 1.6;
    max-width: 620px;
  }

  .cover-centerpiece {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 18px 0;
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
    border-right: 3px solid #00F5A0;
    text-align: right;
  }

  .cover-stat-val {
    font-size: 13pt;
    font-weight: 800;
    color: #ffffff;
  }

  .cover-stat-lbl {
    font-size: 7.5pt;
    color: #9ca3af;
    margin-top: 4px;
  }

  .cover-meta {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 8pt;
    color: #6b7280;
  }

  .cover-meta strong {
    color: #d1d5db;
    display: block;
    margin-bottom: 2px;
    font-size: 9pt;
  }

  /* Section Headings */
  .section-tag {
    font-family: 'JetBrains Mono', 'Cairo', monospace;
    font-size: 7.5pt;
    color: #00F5A0;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
    font-weight: 700;
  }

  h2 {
    font-size: 17pt;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #f3f4f6;
    margin: 10px 0 4px 0;
  }

  p {
    color: #9ca3af;
    font-size: 9pt;
    line-height: 1.6;
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
    text-align: right;
  }

  .card.highlight {
    border-color: rgba(0, 245, 160, 0.3);
    background: rgba(0, 245, 160, 0.03);
  }

  .card-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .card-body {
    font-size: 8.5pt;
    color: #9ca3af;
    line-height: 1.5;
  }

  /* Color Swatches */
  .color-swatch-box {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #111827;
    text-align: right;
  }

  .swatch-color {
    height: 44px;
    width: 100%;
    position: relative;
  }

  .swatch-info {
    padding: 8px;
    font-size: 8pt;
  }

  .swatch-name {
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 2px;
  }

  .swatch-hex {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    color: #00F5A0;
    direction: ltr;
    display: inline-block;
  }

  .swatch-role {
    font-size: 7pt;
    color: #6b7280;
    margin-top: 2px;
  }

  /* Comparison Table (Do vs Don't) */
  .audit-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 8.5pt;
    text-align: right;
  }

  .audit-table th {
    background: rgba(31, 41, 55, 0.6);
    color: #ffffff;
    padding: 8px 10px;
    font-weight: 700;
    font-size: 7.5pt;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .audit-table td {
    padding: 8px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #d1d5db;
    vertical-align: middle;
  }

  .audit-table tr:nth-child(even) td {
    background: rgba(17, 24, 39, 0.3);
  }

  .tag-do {
    color: #00F5A0;
    font-weight: 700;
  }

  .tag-dont {
    color: #ef4444;
    font-weight: 700;
  }

  /* Badge System */
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 700;
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
    text-align: right;
  }

  .type-family-name {
    font-size: 7.5pt;
    color: #00F5A0;
    margin-bottom: 3px;
    font-weight: 700;
  }

  .type-sample-display {
    font-size: 13pt;
    color: #ffffff;
    font-weight: 800;
  }

  .type-sample-body {
    font-size: 9.5pt;
    color: #d1d5db;
  }

  .type-sample-mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    color: #00D9F5;
    direction: ltr;
    display: block;
    text-align: left;
  }
</style>
</head>
<body>

  <!-- ================= PAGE 1: الغلاف الرسمي ================= -->
  <div class="page cover">
    <div>
      <div class="cover-top-badge">
        <span>★</span> دليل العقل الاستراتيجي وهندسة الهوية · الإصدار 2.4
      </div>
      <div class="cover-title-area">
        <h1>NEXUS <span>CONTRACTGUARD™</span></h1>
        <div class="cover-subtitle">
          الدستور الشامل لهوية العلامة التجارية، استراتيجية التموضع، نظام التصميم البصري، وقواعد الخطاب القانوني لأول منصة تدقيق عقود معزولة سحابياً في العالم.
        </div>
      </div>
    </div>

    <!-- الشعار والختم المركزي المعقد -->
    <div class="cover-centerpiece">
      <svg width="210" height="210" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glowGradAr" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00F5A0" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#00D9F5" stop-opacity="0.85"/>
          </linearGradient>
          <radialGradient id="sealCenterAr" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00F5A0" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke="url(#glowGradAr)" stroke-width="1.5" stroke-dasharray="4,2"/>
        <circle cx="100" cy="100" r="88" fill="url(#sealCenterAr)" stroke="#00F5A0" stroke-width="2"/>
        <circle cx="100" cy="100" r="68" fill="none" stroke="#00D9F5" stroke-width="1.2"/>
        <circle cx="100" cy="100" r="46" fill="#0b0f19" stroke="#00F5A0" stroke-width="1.5"/>
        <!-- أشعة النجمة المتطورة -->
        <line x1="100" y1="74" x2="100" y2="126" stroke="#00F5A0" stroke-width="2.5"/>
        <line x1="74" y1="100" x2="126" y2="100" stroke="#00F5A0" stroke-width="2.5"/>
        <line x1="82" y1="82" x2="118" y2="118" stroke="#00D9F5" stroke-width="1.8"/>
        <line x1="82" y1="118" x2="118" y2="82" stroke="#00D9F5" stroke-width="1.8"/>
        <circle cx="100" cy="100" r="5" fill="#ffffff"/>
        <!-- العقد الخارجية -->
        <circle cx="100" cy="20" r="2.5" fill="#00F5A0"/>
        <circle cx="100" cy="180" r="2.5" fill="#00F5A0"/>
        <circle cx="20" cy="100" r="2.5" fill="#00F5A0"/>
        <circle cx="180" cy="100" r="2.5" fill="#00F5A0"/>
      </svg>
    </div>

    <div class="cover-grid">
      <div class="cover-stat-box">
        <div class="cover-stat-val">عزل سحابي 100%</div>
        <div class="cover-stat-lbl">الأطروحة التقنية الأساسية</div>
      </div>
      <div class="cover-stat-box">
        <div class="cover-stat-val">0% هلوسة ذكاء اصطناعي</div>
        <div class="cover-stat-lbl">محرك تدقيق شجري حتمي (AST)</div>
      </div>
      <div class="cover-stat-box">
        <div class="cover-stat-val">معايير AM-LAW 100</div>
        <div class="cover-stat-lbl">مخصص لكبرى مكاتب المحاماة</div>
      </div>
    </div>

    <div class="cover-meta">
      <div>
        <strong>وثيقة استراتيجية سرية وخاصة بالمشروع · BRAND BRAIN</strong>
        مُعدّة للمؤسسين، ومطوري الواجهات، وفرق النمو والتسويق، والشركاء القانونيين.<br>
        المرجع القياسي المعتمد لكافة الواجهات، والشهادات، وحملات البيع.
      </div>
      <div style="text-align: left; font-family: 'JetBrains Mono', sans-serif; direction: ltr;">
        <div>DATE: NOVEMBER 2026</div>
        <div>SHA-256: 9E74A2B9C801FF7D</div>
      </div>
    </div>
  </div>

  <!-- ================= PAGE 2: الاستراتيجية والحمض النووي ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الأول</span>
      <span>الجوهر الاستراتيجي والحمض النووي (Brand DNA)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">الأساس الاستراتيجي والمهمة الوجودية</div>
    <h2>1. الهدف الوجودي، الرؤية، والمبادئ الحاكمة</h2>
    <p>
      تأسست منصة Nexus ContractGuard™ على مبدأ قطعي لا يقبل المساومة: لا ينبغي أبداً لمحامي الصفقات أو المستشار القانوني للشركات أن يضطر للمخاطرة بالمسؤولية المهنية والتعويضات أو خرق سرية العميل المحمية قانونياً (ABA Model Rule 1.6) لمجرد فحص وتدقيق عقد تجاري.
    </p>

    <div class="grid-2">
      <div class="card highlight">
        <div class="card-title">
          <span style="color:#00F5A0;">●</span> الهدف الوجودي (Brand Purpose)
        </div>
        <div class="card-body">
          القضاء التام على الثغرات المالية والكتابية والمراجع التبادلية المعطلة في العقود قبل جلسة التوقيع والإغلاق، مع الحفاظ المطلق على سرية العقد داخل ذاكرة الجهاز دون اتصال خارجي.
        </div>
      </div>
      <div class="card highlight">
        <div class="card-title">
          <span style="color:#00D9F5;">●</span> الرؤية المستقبلية (Brand Vision)
        </div>
        <div class="card-body">
          أن نصبح المعيار السيادي الأول المعتمد للفحص النافي للجهالة القانونية قبل التوقيع في كافة مكاتب Am-Law 200 وغرف صفقات الاستحواذ والاندماج حول العالم.
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:10px;">القيم الأربع الجوهرية (THE CORE FOUR)</div>
    <div class="grid-4">
      <div class="card">
        <div class="badge badge-emerald" style="margin-bottom:6px;">01. السرية المطلقة</div>
        <div class="card-title">Air-Gap أولاً</div>
        <div class="card-body">
          صفر خوادم سحابية، وصفر إرسال لنماذج الذكاء الاصطناعي الخارجية. الفحص يتم في ذاكرة المتصفح (RAM) للحفاظ على الحصانة القضائية.
        </div>
      </div>
      <div class="card">
        <div class="badge badge-cyan" style="margin-bottom:6px;">02. اليقين الرياضي</div>
        <div class="card-title">تدقيق حتمي (AST)</div>
        <div class="card-body">
          استخراج رياضي للأرقام والمراجع بدلاً من التخمين التوليدي. نسبة الهلوسة 0%، ومطابقة دقيقة بنسبة 100%.
        </div>
      </div>
      <div class="card">
        <div class="badge badge-amber" style="margin-bottom:6px;">03. السند القانوني</div>
        <div class="card-title">استناد للتشريعات</div>
        <div class="card-body">
          كل ثغرة تدعم بنص تشريعي صريح (UCC § 3-114 وقواعد Restatement) مع توليد ملحق تعديل فوري جاهز للتوقيع.
        </div>
      </div>
      <div class="card">
        <div class="badge badge-red" style="margin-bottom:6px;">04. الحماية الصارمة</div>
        <div class="card-title">بوابة ما قبل التوقيع</div>
        <div class="card-body">
          نحن خط الدفاع الأخير للمحامي قبل الإغلاق: "لا توقع عقداً مشوباً بعيب أو ملحقاً غير مسوّى أبداً".
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:10px;">شخصية العلامة التجارية ونمطها (BRAND ARCHETYPE)</div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">المحقق القانوني السيادي (The Sovereign Forensic Auditor)</div>
      <div class="card-body">
        <strong>نمط الشخصية:</strong> موثوق، فائق التدقيق، هادئ، حاسم، مؤسسي وذو خلفية قضائية صارمة ومدعومة بالأدلة الرقمية.<br>
        <strong>ما لسنا عليه أبداً:</strong> لسنا روبوت محادثة هزلي (Chatbot)، ولسنا تطبيق ذكاء اصطناعي تجريبي، ولا نعتذر أو نخمن. نتحدث بثقة شريك صفقات متمرس يقف للدفاع أمام قاضي محكمة ديلاوير.
      </div>
    </div>

    <div class="section-tag">خريطة العملاء المستهدفين (ICP)</div>
    <div class="grid-3">
      <div class="card">
        <div class="card-title">شركاء كبرى مكاتب المحاماة</div>
        <div class="card-body">يحظر عليهم بموجب قرارات لجان الامتثال رفع مسودات العملاء للذكاء الاصطناعي السحابي، ويبحثون عن عزل مطلق.</div>
      </div>
      <div class="card">
        <div class="card-title">المستشارون العامون للشركات</div>
        <div class="card-body">يراقبون سقوف المسؤولية ومخاطر التعويض؛ لا يقبلون تمرير تضارب بـ 45 ألف دولار في عقود الشراء.</div>
      </div>
      <div class="card">
        <div class="card-title">المحامون الأفراد والمستقلون</div>
        <div class="card-body">يحصلون على قوة تدقيق تعادل فريقاً كاملاً من 5 محامين متدربين خلال 350 ميلي ثانية وبترخيص دائم بدون اشتراكات مرهقة.</div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل العقل الاستراتيجي</span>
      <span>وثيقة سرية للاستخدام الداخلي فقط</span>
      <span>صفحة 02</span>
    </div>
  </div>

  <!-- ================= PAGE 3: الهوية البصرية ونظام الألوان ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الثاني</span>
      <span>الهوية البصرية ونظام الألوان (Visual System)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">هندسة الألوان والبيئة الداكنة</div>
    <h2>2. مصفوفة الألوان والواجهات السيبرانية</h2>
    <p>
      تجمع الهوية البصرية بين هيبة قاعات المحاكم الرفيعة ودقة محطات العمل التشفيرية المعزولة. يوفر السواد الحالك (Obsidian Void) راحة بصرية فائقة للمحامين أثناء فحص العقود في ساعات الليل المتأخرة، بينما توجه تدرجات الأخضر الزمردي والسيان العين مباشرة نحو المخاطر المالية ونقاط الخطر.
    </p>

    <div class="section-tag">الألوان الأساسية للخلفيات والأسطح (VOID MATRIX)</div>
    <div class="grid-3">
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#030712; border-bottom:1px solid rgba(255,255,255,0.1);"></div>
        <div class="swatch-info">
          <div class="swatch-name">أسود الفضاء السيبراني</div>
          <div class="swatch-hex">#030712</div>
          <div class="swatch-role">الخلفية الرئيسية للتطبيق وموقع الهبوط</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#0B0F19; border-bottom:1px solid rgba(255,255,255,0.1);"></div>
        <div class="swatch-info">
          <div class="swatch-name">كحلي داكن عميق</div>
          <div class="swatch-hex">#0B0F19</div>
          <div class="swatch-role">الحاويات، النوافذ المنبثقة، والألواح العائمة</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#111827; border-bottom:1px solid rgba(255,255,255,0.1);"></div>
        <div class="swatch-info">
          <div class="swatch-name">رمادي حديدي للبطاقات</div>
          <div class="swatch-hex">#111827</div>
          <div class="swatch-role">بطاقات الإدخال، ترويسة الجداول، ومحرر النصوص</div>
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:8px;">ألوان التنبيه والإشارات الحيوية (SIGNATURE SIGNALS)</div>
    <div class="grid-4">
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#00F5A0;"></div>
        <div class="swatch-info">
          <div class="swatch-name">أخضر زمردي سيبراني</div>
          <div class="swatch-hex">#00F5A0</div>
          <div class="swatch-role">العزل المؤكد، أزرار الشراء، الحالات الآمنة</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#00D9F5;"></div>
        <div class="swatch-info">
          <div class="swatch-name">أزرق سيان كهربائي</div>
          <div class="swatch-hex">#00D9F5</div>
          <div class="swatch-role">محرك الفحص، التبويبات النشطة، والروابط</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#EF4444;"></div>
        <div class="swatch-info">
          <div class="swatch-name">أحمر الثغرات الحرجة</div>
          <div class="swatch-hex">#EF4444</div>
          <div class="swatch-role">المراجع المكسورة، التضارب المالي في الأرقام</div>
        </div>
      </div>
      <div class="color-swatch-box">
        <div class="swatch-color" style="background:#F59E0B;"></div>
        <div class="swatch-info">
          <div class="swatch-name">عنبري التحذير والملاحق</div>
          <div class="swatch-hex">#F59E0B</div>
          <div class="swatch-role">الملاحق الناقصة، بنود التعويض غير المتطابقة</div>
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:8px;">معادلات التدرج والزجاج الشفاف (GRADIENTS & GLASS)</div>
    <div class="grid-2">
      <div class="card" style="background:linear-gradient(135deg, rgba(0,245,160,0.1) 0%, rgba(0,217,245,0.1) 100%); border:1px solid rgba(0,245,160,0.3);">
        <div class="card-title">التدرج اللوني المميز للعلامة</div>
        <div class="card-body">
          <code style="font-family:'JetBrains Mono'; font-size:7pt; color:#00F5A0; direction:ltr; display:inline-block;">linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)</code><br>
          يستخدم في نصوص العناوين الرئيسية، وأزرار الحث على الشراء (CTA)، وحلقات التأكيد، وإضاءة الشعار.
        </div>
      </div>
      <div class="card" style="background:rgba(17,24,39,0.7); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.08);">
        <div class="card-title">تأثير الزجاج الشفاف (Glassmorphism)</div>
        <div class="card-body">
          <code style="font-family:'JetBrains Mono'; font-size:7pt; color:#00D9F5; direction:ltr; display:inline-block;">backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08)</code><br>
          يطبق على شريط الأدوات العائم ومودال الشهادة لإبراز الأدوات دون حجب نصوص العقد الأصلية.
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:8px;">معايير التباين والطباعة الكلاسيكية المعتمدة</div>
    <div class="card">
      <div class="grid-3" style="margin-bottom:0;">
        <div>
          <strong style="color:#ffffff; font-size:8.5pt;">تباين فائق معتمد (WCAG AAA):</strong>
          <p style="margin-bottom:0; font-size:8pt;">النصوص باللون الأبيض النقي (#FFFFFF) والرمادي الفاتح (#E5E7EB) تحقق نسبة تباين 18.2:1 مقابل الخلفية الداكنة.</p>
        </div>
        <div>
          <strong style="color:#ffffff; font-size:8.5pt;">التحول الأحادي للشهادات (B&W):</strong>
          <p style="margin-bottom:0; font-size:8pt;">شهادات الفحص الرسمية (PDF) تتحول تلقائياً إلى اللونين الأبيض والأسود الكلاسيكي لضمان حجيتها الرسمية أمام المحاكم.</p>
        </div>
        <div>
          <strong style="color:#ffffff; font-size:8.5pt;">أمان عمى الألوان:</strong>
          <p style="margin-bottom:0; font-size:8pt;">كل شارة تنبيه تُرفق برمز هندسي دلالي مستقل (✓, ✕, ⚠, ●) ونص صريح باللغة الإنجليزية الكبيرة لضمان فهمها دون الاعتماد على اللون وحده.</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل العقل الاستراتيجي</span>
      <span>وثيقة سرية للاستخدام الداخلي فقط</span>
      <span>صفحة 03</span>
    </div>
  </div>

  <!-- ================= PAGE 4: الخطوط والختم الرسمي ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الثالث</span>
      <span>الخطوط والختم المؤسسي (Typography & Seal)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">التسلسل الهرمي للخطوط</div>
    <h2>3. منظومة الخطوط والختم المؤسسي المعتمد</h2>
    <p>
      تعكس خطوطنا الهوية المزدوجة للمنتج: هيبة القضاء القانوني والدقة التشفيرية الصارمة. لا نستخدم إطلاقاً خطوطاً هزلية أو استعراضية، بل نعتمد الخطوط الكلاسيكية الرصينة للعناوين والخطوط البرمجية الأحادية (Monospace) للبيانات المشفرة.
    </p>

    <div class="type-specimen">
      <div class="type-family-name">خط العناوين الرسمية والهيبة القضائية · Cinzel / Times-Roman (Serif)</div>
      <div class="type-sample-display" style="direction:ltr; text-align:left;">Pre-Signing Legal Defense. Never Sign a Defective Contract.</div>
      <p style="margin-top:4px; margin-bottom:0; font-size:8pt;">الاستخدام: الترويسة الرئيسية لموقع الهبوط، عنوان شهادة الفحص الرسمية، عناوين البنود، وشارات Am-Law. الوزن: 700 / 900.</p>
    </div>

    <div class="type-specimen">
      <div class="type-family-name">خط واجهات الاستخدام والنصوص التفصيلية · Inter / Cairo / Plus Jakarta Sans</div>
      <div class="type-sample-body">
        تحدد المادة 4.1 المقابل المالي بمبلغ 250,000 دولار كتابةً، بينما تسجل 205,000 دولار بالأرقام، مما يخلق عجزاً كتابياً بقيمة 45,000 دولار طبقاً للمادة 3-114 من القانون التجاري الموحد.
      </div>
      <p style="margin-top:4px; margin-bottom:0; font-size:8pt;">الاستخدام: قراءة نصوص العقود، كروت الثغرات، جداول الأسعار، رسائل التأكيد والتعليمات. الوزن: 400 / 600 / 700.</p>
    </div>

    <div class="type-specimen">
      <div class="type-family-name">خط الإثبات الرقمي وبصمات التشفير · JetBrains Mono (Monospace)</div>
      <div class="type-sample-mono">SHA256: cf9acf7bbb77f93475585ed3ee96a33b6dd1642acd01287c9c9b56f3f91325fc [0ms LATENCY]</div>
      <p style="margin-top:4px; margin-bottom:0; font-size:8pt;">الاستخدام: بصمات الهاش الرقمية، سرعة المعالجة بالميلي ثانية، عقد الشجرة البرمجية AST، وأرقام بيتس القضائية.</p>
    </div>

    <div class="section-tag" style="margin-top:10px;">تشريح الختم الدائري الرسمي (THE OFFICIAL CORPORATE SEAL)</div>
    <div class="grid-2">
      <div class="card" style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0B0F19; border:1px solid rgba(0,245,160,0.2); padding:10px;">
        <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="none" stroke="#00F5A0" stroke-width="2" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="#00F5A0" stroke-width="1.2" stroke-dasharray="2,2" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#00F5A0" stroke-width="1.5" />
          <circle cx="100" cy="100" r="48" fill="none" stroke="#00F5A0" stroke-width="1" />
          <!-- أشعة النجمة المركزية -->
          <line x1="100" y1="78" x2="100" y2="122" stroke="#00F5A0" stroke-width="2"/>
          <line x1="78" y1="100" x2="122" y2="100" stroke="#00F5A0" stroke-width="2"/>
          <line x1="84" y1="84" x2="116" y2="116" stroke="#00F5A0" stroke-width="1.5"/>
          <line x1="84" y1="116" x2="116" y2="84" stroke="#00F5A0" stroke-width="1.5"/>
          <circle cx="100" cy="100" r="4" fill="#00F5A0" />
        </svg>
        <div style="font-family:'JetBrains Mono'; font-size:7pt; color:#00F5A0; margin-top:4px;">
          CONCENTRIC REGISTRAR SEAL
        </div>
      </div>
      <div class="card">
        <div class="card-title">الدلالة القانونية والتاريخية للختم</div>
        <div class="card-body">
          <strong>الحلقتان المتحدتا المركز:</strong> تحاكيان التقاليد العريقة لأختام المحاكم والمسجلين العقاريين الممتدة لأكثر من 200 عام.<br>
          <strong>نجمة العقد المركزية (6 أشعة):</strong> ترمز إلى الالتقاء الرياضي الحتمي لكافة البنود والمراجع المتشابكة في العقد.<br>
          <strong>نص الإقرار الدائري المقوس:</strong> يثبت أن التدقيق تم في ذاكرة الجهاز المؤقتة وفق المعيار 1.6 دون خرق لسرية الموكل.<br>
          <strong>قاعدة الطباعة الرسمية:</strong> يطبع بحبر كحلي داكن أو أسود على الشهادات، ويحظر تلوينه بألوان براقة عند التصدير.
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:8px;">قواعد المسافات الآمنة وحظر التشويه</div>
    <div class="card">
      <div class="grid-2" style="margin-bottom:0;">
        <div class="card-body">
          <strong style="color:#00F5A0;">المسافة المحمية (Clearspace):</strong> يجب الحفاظ على فراغ دائري حول الشعار لا يقل عن 1.5 ضعف ارتفاع حرف "N" في كلمة NEXUS.
        </div>
        <div class="card-body">
          <strong style="color:#ef4444;">المحظورات الصارمة:</strong> يُمنع تدوير الشعار أو تمديده، ويُمنع تغيير خط كلمة NEXUS، ويُمنع وضعه على خلفيات فاقعة تفقد هيبته.
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل العقل الاستراتيجي</span>
      <span>وثيقة سرية للاستخدام الداخلي فقط</span>
      <span>صفحة 04</span>
    </div>
  </div>

  <!-- ================= PAGE 5: قاموس مكافحة الحشو ولغة الخطاب ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الرابع</span>
      <span>نبرة الصوت ومحاربة الحشو (Anti-Slop Lexicon)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">المعايير التحريرية وقاموس المصطلحات القانونية المعتمدة</div>
    <h2>4. قاموس مكافحة الحشو: ما نقوله وما نمنعه نهائياً</h2>
    <p>
      في المعاملات القانونية ذات القيمة العالية، تنفر مصطلحات الذكاء الاصطناعي العامة كبار المحامين لأنها تثير مخاوف الهلوسة وتسريب البيانات السحابية. لذلك صممنا قاموساً صارماً يستبدل الكلمات المبتذلة بالمفاهيم الهندسية والقضائية الموثوقة.
    </p>

    <table class="audit-table">
      <thead>
        <tr>
          <th style="width:30%;">ممنوع نهائياً (مصطلحات مبتذلة)</th>
          <th style="width:35%;">المصطلح الرسمي البديل</th>
          <th style="width:35%;">السبب الاستراتيجي</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="tag-dont">✕ "مساعد ذكاء اصطناعي / روبوت"</span></td>
          <td><span class="tag-do">✓ "محرك تدقيق شجري حتمي (AST)"</span></td>
          <td>المحامي لا يريد "روبوت يسولف معه"، بل أداة رياضية تقدم براهين قاطعة.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "تحليل سحابي بالذكاء الاصطناعي"</span></td>
          <td><span class="tag-do">✓ "تدقيق معزول محلياً (Air-Gapped)"</span></td>
          <td>يحمي سرية العميل وحصانة العمل القانوني وفق المادة 1.6 من قواعد السلوك.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "تعديل سحري بضغطة زر"</span></td>
          <td><span class="tag-do">✓ "جدول ملحق تعديل قانوني جاهز للتوقيع"</span></td>
          <td>المحامي يطلب ملحقاً بصيغة قانونية يوقع عليه الأطراف، وليس تعديلاً عشوائياً.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "مخرجات ونصوص مولدة (Prompts)"</span></td>
          <td><span class="tag-do">✓ "مذكرة فحص نافي للجهالة موثقة قانونياً"</span></td>
          <td>يقضي على رعب المحامي من الهلوسة أو اختلاق شروط وهمية غير موجودة.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "اشتراك شهري متكرر (SaaS)"</span></td>
          <td><span class="tag-do">✓ "ترخيص دائم لمحطة العمل (Perpetual)"</span></td>
          <td>تفضل مكاتب المحاماة أصول البرمجيات الدائمة بدلاً من نزيف الاشتراكات الشهرية.</td>
        </tr>
        <tr>
          <td><span class="tag-dont">✕ "ارفع ملفك إلى السيرفر"</span></td>
          <td><span class="tag-do">✓ "تحميل في ذاكرة الجهاز المؤقتة فقط"</span></td>
          <td>يزيل تماماً الحاجز النفسي والخوف من تسريب مسودات الصفقات السرية.</td>
        </tr>
      </tbody>
    </table>

    <div class="section-tag" style="margin-top:10px;">رسائل البيع الموجهة لكل شريحة</div>
    <div class="grid-3">
      <div class="card">
        <div class="card-title">محامو صفقات الاستحواذ (M&A)</div>
        <div class="card-body">
          <em>"اكشف تضارب الـ 45 ألف دولار والملاحق الناقصة قبل جلسة إغلاق الصفقة الساعة 2:00 فجراً."</em>
        </div>
      </div>
      <div class="card">
        <div class="card-title">المستشارون العامون للشركات</div>
        <div class="card-body">
          <em>"صفر خروج للبيانات خارج جهازك. توافق تام مع معايير السرية المؤسسية ومتطلبات الإفصاح المالي."</em>
        </div>
      </div>
      <div class="card">
        <div class="card-title">المحامون المستقلون والمكاتب الفردية</div>
        <div class="card-body">
          <em>"دقق عقوداً من 80 صفحة بقوة كتيبة تدقيق كاملة في كبرى المكاتب خلال 350 ميلي ثانية فقط."</em>
        </div>
      </div>
    </div>

    <div class="section-tag" style="margin-top:10px;">الشعارات الرسمية والوعود التسويقية الحاكمة</div>
    <div class="card highlight">
      <div class="grid-2" style="margin-bottom:0;">
        <div class="card-body">
          <strong style="color:#ffffff;">الشعار التسويقي الرئيسي (Hero Headline):</strong><br>
          "دفاعك القانوني قبل التوقيع. لا توقع عقداً مشوباً بعيب أبداً."
        </div>
        <div class="card-body">
          <strong style="color:#ffffff;">الضمانة الفنية الصارمة:</strong><br>
          "معالجة 100% داخل ذاكرة المتصفح في أقل من 350 ميلي ثانية. صفر خوادم سحابية. صفر تسريب للبيانات."
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل العقل الاستراتيجي</span>
      <span>وثيقة سرية للاستخدام الداخلي فقط</span>
      <span>صفحة 05</span>
    </div>
  </div>

  <!-- ================= PAGE 6: المحركات، الباقات، والاعتماد ================= -->
  <div class="page">
    <div class="page-header">
      <span class="brand-tag">القسم الخامس</span>
      <span>الباقات التجارية والاعتماد الرسمي (Pricing & Ratification)</span>
      <span style="direction:ltr; font-family:'JetBrains Mono';">Nexus ContractGuard™</span>
    </div>

    <div class="section-tag">هندسة التسعير والترخيص المؤسسي الدائم</div>
    <h2>5. محركات الفحص ونموذج الترخيص الدائم</h2>
    <p>
      يرفض نظام Nexus ContractGuard™ نموذج الاشتراكات الشهرية المرهقة لصالح الترخيص الدائم المؤسسي (Perpetual License). بمجرد تفعيل المفتاح، تعمل محطة العمل بالكامل دون الحاجة لاتصال بالإنترنت ودون أي إرسال للبيانات للخارج.
    </p>

    <div class="grid-2" style="margin-bottom:12px;">
      <div class="card highlight" style="border-right: 4px solid #00F5A0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div class="card-title" style="margin-bottom:0; font-size:10pt;">
            رخصة المحامي الفرد · Solo License
          </div>
          <span class="badge badge-emerald" style="direction:ltr;">$199 PERPETUAL</span>
        </div>
        <div class="card-body" style="font-size:8pt;">
          <strong>الفئة المستهدفة:</strong> المحامون المستقلون، المستشارون المنفردون، ومدراء العقود.<br>
          <strong>المميزات المشمولة:</strong>
          <ul style="margin:4px 16px 0 0; line-height:1.6;">
            <li>تدقيق غير محدود لمسودات العقود داخل الذاكرة</li>
            <li>محرك مطابقة الأرقام المكتوبة بالمبالغ الرقمية وكشف الفروقات</li>
            <li>وحدة المقارنة التفاضلية (Myers-Diff) بين نسختين</li>
            <li>مُولّد شهادات التدقيق الرسمية (PDF) مع الختم والتوقيع الرقمي</li>
            <li>رخصة استخدام دائمة على جهاز واحد أوفلاين مدى الحياة</li>
          </ul>
        </div>
      </div>

      <div class="card highlight" style="border-right: 4px solid #00D9F5;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div class="card-title" style="margin-bottom:0; font-size:10pt;">
            حزمة مكاتب المحاماة · Firm Suite
          </div>
          <span class="badge badge-cyan" style="direction:ltr;">$299 PERPETUAL</span>
        </div>
        <div class="card-body" style="font-size:8pt;">
          <strong>الفئة المستهدفة:</strong> فرق الشركاء، مكاتب المحاماة المتعددة، والإدارات القانونية للشركات.<br>
          <strong>المميزات المشمولة:</strong>
          <ul style="margin:4px 16px 0 0; line-height:1.6;">
            <li>كافة مميزات رخصة المحامي الفرد بالكامل</li>
            <li>جناح الترقيم القضائي (Bates Stamping) وترقيم الملاحق</li>
            <li>أداة التعتيم الذكي للبيانات الحساسة والشخصية (PII Redactor)</li>
            <li>محرك مطابقة سقوف المسؤولية مع ملاحق ديلاوير ونيويورك</li>
            <li>مكتبة نماذج العقود القياسية الخاصة بـ Am-Law 100</li>
            <li>تثبيت متعدد للمقاعد مع إمكانية إضافة ختم مخصص للمكتب</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section-tag">المحركات الخمسة المتكاملة في النظام</div>
    <div class="grid-3" style="margin-bottom:12px;">
      <div class="card">
        <div class="card-title">1. التدقيق الحسابي والشجري</div>
        <div class="card-body">كشف العجز المالي وتناقض الأرقام مع الحروف والمراجع المعطلة.</div>
      </div>
      <div class="card">
        <div class="card-title">2. المقارنة التفاضلية Myers</div>
        <div class="card-body">مقارنة حرفية فائقة السرعة لكشف التعديلات الخبيثة بين المسودات.</div>
      </div>
      <div class="card">
        <div class="card-title">3. التدقيق اللغوي والشكلي</div>
        <div class="card-body">كشف الغموض اللغوي، التعهدات المبنية للمجهول، والملاحق المنسية.</div>
      </div>
    </div>

    <div class="section-tag">وثيقة الاعتماد والختم الرسمي لهوية المشروع</div>
    <div class="card" style="border: 1px solid rgba(0, 245, 160, 0.4); background: rgba(0, 245, 160, 0.02);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title" style="color:#00F5A0; font-size:9.5pt;">إقرار حوكمة واعتماد هوية المشروع (Brand Brain Governance)</div>
          <p style="font-size:8pt; max-width:440px; margin-bottom:6px;">
            تحدد هذه الوثيقة الدستور الثابت لهوية Nexus ContractGuard™. وتلتزم كافة واجهات المنتج، والشهادات الصادرة، وحملات التسويق بالتوافق التام مع هذه المبادئ القياسية.
          </p>
          <div style="font-size:7.5pt; color:#9ca3af; font-family:'Cairo', sans-serif;">
            جهة الاعتماد: مجلس القيادة وحارس العلامة التجارية (Brand Guardian)<br>
            النطاق الرسمي المعتمد: WWW.NEXUS-OS.STORE<br>
            درجة السرية: ملكية فكرية واستراتيجية خاصة بالمشروع
          </div>
        </div>
        <div style="text-align:left; direction:ltr;">
          <div style="font-family:'JetBrains Mono'; font-size:6.5pt; color:#00F5A0; margin-bottom:2px;">
            [OFFICIAL BRAND SEAL RATIFIED]
          </div>
          <div style="width:110px; border-bottom:1px solid #4b5563; padding-bottom:2px;">
            <svg width="100" height="24" viewBox="0 0 140 40">
              <path d="M 10 28 Q 30 5, 55 24 T 95 18 T 130 12" fill="none" stroke="#00F5A0" stroke-width="2" />
            </svg>
          </div>
          <div style="font-size:6.5pt; color:#6b7280; font-family:'JetBrains Mono'; margin-top:2px;">
            VERIFIED REGISTRAR
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>NEXUS CONTRACTGUARD™ · دليل العقل الاستراتيجي</span>
      <span>وثيقة سرية للاستخدام الداخلي فقط</span>
      <span>صفحة 06</span>
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
        
        pdf_path = 'C:/Users/lenovo/.gemini/antigravity/brain/8f15943f-fbf5-4a66-8801-09de08672d63/Nexus_ContractGuard_Brand_Brain_Arabic.pdf'
        await page.pdf(
            path=pdf_path,
            format='A4',
            print_background=True,
            margin={'top': '0mm', 'bottom': '0mm', 'left': '0mm', 'right': '0mm'}
        )
        print('Arabic PDF created successfully at:', pdf_path)
        
        doc = fitz.open(pdf_path)
        print('Total pages generated:', len(doc))
        for i, page_doc in enumerate(doc):
            pix = page_doc.get_pixmap(dpi=150)
            img_path = f'C:/Users/lenovo/.gemini/antigravity/brain/8f15943f-fbf5-4a66-8801-09de08672d63/brand_brain_ar_page_{i+1}.png'
            pix.save(img_path)
            print(f'Rendered page {i+1} screenshot to {img_path}')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(generate())
