import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '..', 'TEST_DOCUMENTS');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating ContractGuard test suite in:', outDir);

// =========================================================================
// 1. COMPREHENSIVE INTEGRITY AUDIT CONTRACT (Tests all 4 audit engines)
// =========================================================================
const auditContractText = `MASTER CLOUD SERVICES AND LICENSING AGREEMENT

This Master Cloud Services and Licensing Agreement (this "Agreement") is entered into as of March 15, 2026 (the "Effective Date"), by and between Apex Global Technologies Inc., a Delaware corporation with its principal place of business at 100 Technology Plaza, Wilmington, DE 19801 ("Provider"), and Meridian Health Solutions Corporation, a California corporation located at 500 Healthcare Way, San Francisco, CA 94107 ("Customer").

RECITALS
WHEREAS, Provider specializes in high-throughput healthcare analytics infrastructure; and
WHEREAS, Customer desires to procure enterprise cloud services and consulting under the covenants contained herein.

NOW, THEREFORE, in consideration of the mutual covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

SECTION 1. DEFINITIONS AND INTERPRETATION
1.1 "Authorized Users" means Customer employees and designated contractors granted access credentials pursuant to Section 3.2.
1.2 "Confidential Information" means all non-public proprietary information disclosed by either party, whether orally or in tangible form, including trade secrets, source code, and customer data.
1.3 "Service Level Agreement" means the performance benchmarks and uptime commitments set forth in Exhibit B.
1.4 "Force Majeure Event" means acts of God, war, riot, embargoes, or government decrees beyond reasonable control.
1.5 "Legacy Data Repository" means the historical patient archives identified in Schedule 1.
1.6 "Defunct Concept Term" means an obsolete operational framework previously utilized under prior vendor arrangements.

SECTION 2. SERVICES AND SCOPE OF WORK
2.1 Subscription Services. Provider shall provision, host, and maintain the cloud analytics platform in accordance with the specifications in Exhibit A.
2.2 Implementation Milestones. Provider must complete data migration and API onboarding no later than November 15, 2023. Provider shall deploy all necessary technical resources to satisfy this milestone.
2.3 Professional Consulting. Provider shall deliver sixty (60) hours of dedicated engineering consulting per calendar month.
2.4 Defective Cross-Reference. Customer may audit the implementation protocol in strict accordance with the auditing procedures set forth in Section 14.8.
2.5 Missing Exhibit Citation. All data warehouse backup schedules and failover procedures shall be executed as outlined in Exhibit D (Disaster Recovery Protocol).

SECTION 3. FEES, BILLING & FINANCIAL COVENANTS
3.1 Annual Subscription Retainer. Customer shall pay Provider an annual platform licensing fee of $45,000 (Sixty Thousand Dollars) payable in equal quarterly installments in advance.
3.2 Implementation Fee Contradiction. Customer shall pay a one-time onboarding and setup fee of $150,000 (One Hundred Twenty-Five Thousand Dollars) upon execution of this Agreement.
3.3 Invoicing and Taxes. Provider shall submit itemized electronic invoices on the first business day of each month. Customer shall remit payment within thirty (30) days of receipt of invoice.
3.4 Reimbursable Travel Expenses. Pre-approved travel expenses shall be reimbursed pursuant to the travel policy set forth in Schedule 3.
3.5 Late Payment Surcharge. Past-due payments shall accrue interest at a rate of 1.5% per month or the highest lawful rate permitted by Delaware law.

SECTION 4. TERM, TERMINATION & NOTICE PERIODS
4.1 Term. This Agreement shall commence on the Effective Date and shall remain in effect for an initial period of three (3) years (the "Initial Term").
4.2 Automatic Renewal. This Agreement shall automatically renew for successive one (1) year periods unless either party delivers written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.
4.3 Termination for Convenience. Customer may terminate this Agreement without cause at any time upon providing forty-five (45) days prior written notice to Provider.
4.4 Unfilled Notice Placeholder. Notice of default or breach must be served in writing and must allow the defaulting party [Insert Notice Period] business days to cure such deficiency.
4.5 Unfilled Entity Placeholder. Legal notices to Customer shall be delivered to the attention of the General Counsel at [Insert Customer Legal Department Address].

SECTION 5. CONFIDENTIALITY & DATA SECURITY
5.1 Confidentiality Duty. Each receiving party agrees to protect the Confidential Information of the disclosing party using the same degree of care it uses for its own confidential data, but in no event less than reasonable care.
5.2 Exclusions. Confidential Information does not include information that: (a) is or becomes publicly known without breach; (b) was known prior to disclosure; or (c) is independently developed without reference to the disclosing party's data.
5.3 Security Breach Notification. In the event of an unauthorized data security incident or compromise of Protected Health Information, Provider must notify Customer within twenty-four (24) hours of discovering such incident.
5.4 Prohibitions on Dissemination. Neither party shall disclose the financial terms of this Agreement to any third party without prior written consent.
5.5 Missing Technical Exhibit. Data encryption standards and zero-trust verification architecture shall strictly comply with Appendix C (Cryptographic Security Standards).

SECTION 6. INTELLECTUAL PROPERTY RIGHTS
6.1 Provider Platform Ownership. Provider retains all exclusive right, title, and interest in and to the cloud analytics platform, underlying algorithms, and all improvements thereto.
6.2 Customer Data. Customer exclusively owns all right, title, and interest in and to Customer Data, including all patient records and operational logs.
6.3 Undefined Term Usage. Provider shall not reverse-engineer or harvest the Intellectual Capital or Proprietary Diagnostic Models of Customer without explicit board authorization.
6.4 Broken Reference to Nonexistent Clause. IP indemnification disputes shall be resolved pursuant to Clause 9.3(b).

SECTION 7. INDEMNIFICATION, LIABILITY & RESTRICTIONS
7.1 Provider Indemnity. Provider agrees to defend, indemnify, and hold harmless Customer, its officers, directors, and employees against all third-party claims, liabilities, losses, damages, and reasonable attorneys' fees arising out of infringement of any patent, copyright, or trademark.
7.2 Unlimited Liability Exposure. Notwithstanding anything to the contrary, Provider shall be subject to unlimited liability for any material breach of data confidentiality or gross negligence.
7.3 Post-Termination Non-Compete. Customer agrees that during the term of this Agreement and for a period of two (2) years following termination, Customer shall not directly or indirectly engage in, develop, or invest in any competing healthcare analytics platform.
7.4 Third-Party Escrow Covenant. The Escrow Agent shall release software source code directly to Customer within ten (10) business days following any insolvency filing by Provider.

SECTION 8. DISPUTE RESOLUTION & GOVERNING LAW
8.1 Delaware Law. This Agreement and all controversies arising out of or related to this transaction shall be governed by the laws of the State of Delaware without giving effect to conflicts of law principles.
8.2 Mandatory Arbitration & Jury Waiver. Any dispute shall be settled by binding arbitration in Wilmington, Delaware, and each party irrevocably waives any right to a trial by jury.
8.3 Unfilled Boilerplate Underlines. Designated corporate registration code for Customer is ______________.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

APEX GLOBAL TECHNOLOGIES INC.
By: ____________________________________
Name: Marcus Vance
Title: Chief Executive Officer

MERIDIAN HEALTH SOLUTIONS LLC
By: ____________________________________
Name: Dr. Eleanor Ross
Title: President & General Counsel
`;

fs.writeFileSync(path.join(outDir, '01_COMPREHENSIVE_INTEGRITY_AUDIT.txt'), auditContractText, 'utf8');
console.log('✓ Created 01_COMPREHENSIVE_INTEGRITY_AUDIT.txt');

// =========================================================================
// 2. ORIGINAL BASELINE DRAFT (For Redline Diff Testing)
// =========================================================================
const baselineDraftText = `SOFTWARE DEVELOPMENT AND MASTER SERVICES AGREEMENT

This Agreement is made on January 10, 2026, between Horizon Software LLC ("Developer") and Vantage Capital Partners ("Client").

1. SCOPE OF SERVICES
Developer agrees to design, build, and deploy the portfolio management web application in accordance with the specifications in Exhibit A. Developer shall deliver all source code upon completion.

2. PAYMENT TERMS
Client shall pay Developer a total project fee of $80,000 payable in four milestone installments of $20,000 each. Developer shall invoice Client upon completion of each milestone. Invoices shall be paid within thirty (30) days of receipt.

3. INTELLECTUAL PROPERTY
Upon receipt of full payment, Developer irrevocably assigns to Client all right, title, and interest in and to the custom deliverables, including copyrights, source code, and design documentation. Developer retains ownership of its pre-existing code libraries.

4. WARRANTIES AND DISCLAIMER
Developer warrants that for ninety (90) days following delivery, the application shall perform substantially in conformance with the specifications. Developer disclaims all other implied warranties.

5. LIMITATION OF LIABILITY
Neither party shall be liable for indirect, incidental, or consequential damages. In no event shall either party's total aggregate liability under this Agreement exceed the total fees paid by Client to Developer in the preceding twelve (12) months.

6. TERMINATION
Either party may terminate this Agreement upon thirty (30) days written notice if the other party materially breaches any term and fails to cure such breach within the thirty-day period.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of New York.
`;

fs.writeFileSync(path.join(outDir, '02_ORIGINAL_DRAFT_BASELINE.txt'), baselineDraftText, 'utf8');
console.log('✓ Created 02_ORIGINAL_DRAFT_BASELINE.txt');

// =========================================================================
// 3. HOSTILE MODIFIED REDLINE DRAFT (For Redline Diff Testing)
// =========================================================================
const modifiedRedlineDraftText = `SOFTWARE DEVELOPMENT AND MASTER SERVICES AGREEMENT (AMENDED DRAFT)

This Agreement is made on January 10, 2026, between Horizon Software LLC ("Developer") and Vantage Capital Partners ("Client").

1. SCOPE OF SERVICES
Developer agrees to design, build, and deploy the portfolio management web application in accordance with the specifications in Exhibit A. Developer shall deliver all compiled binaries upon completion. Source code remains proprietary to Developer.

2. PAYMENT TERMS & PENALTIES
Client shall pay Developer a total project fee of $110,000 payable in monthly advance installments of $27,500 each. Invoices shall be paid within fifteen (15) business days of receipt. In the event of any payment delay exceeding five days, Client shall be assessed an automatic 15% late penalty compounded weekly.

3. INTELLECTUAL PROPERTY & RESTRICTIONS
Developer grants Client a non-exclusive, non-transferable internal license to use the application. Developer exclusively retains all right, title, and ownership of all deliverables, architecture, algorithms, and source code. Client covenants not to develop or solicit competing fintech software for three (3) years.

4. WARRANTIES AND DISCLAIMER
The software is provided completely AS IS, WHERE IS, WITHOUT WARRANTY OF ANY KIND. Developer expressly disclaims all warranties, express, implied, or statutory, including warranties of merchantability and fitness for a particular purpose.

5. INDEMNIFICATION & UNLIMITED CLIENT LIABILITY
Client agrees to defend, indemnify, and hold harmless Developer against all third-party claims, losses, damages, and attorney fees arising from the use of the platform. Client shall bear unlimited liability for any operational interruptions. Developer total liability shall not exceed $1,000.

6. TERMINATION
Developer may terminate this Agreement immediately for convenience without notice or refund. Client may terminate only upon ninety (90) days advance written notice with full payment of the remaining contract balance.

7. GOVERNING LAW & MANDATORY ARBITRATION
This Agreement shall be governed by the laws of the State of Delaware. Any dispute shall be submitted to mandatory binding arbitration in Dover, Delaware, with waiver of jury trial.
`;

fs.writeFileSync(path.join(outDir, '03_COUNTERPARTY_REDLINE_DRAFT.txt'), modifiedRedlineDraftText, 'utf8');
console.log('✓ Created 03_COUNTERPARTY_REDLINE_DRAFT.txt');

// =========================================================================
// 4. CONFIDENTIAL SEPARATION SETTLEMENT (For Smart PII Redactor Testing)
// =========================================================================
const piiSettlementText = `CONFIDENTIAL SETTLEMENT AND SEPARATION AGREEMENT

PARTIES & PRIVILEGED IDENTIFIERS
This Confidential Settlement and Mutual Release Agreement ("Agreement") is executed on October 24, 2026, between:

1. Employee:
   - Full Legal Name: Jonathan Vance Miller
   - Social Security Number (SSN): 123-45-6789
   - Secondary SSN on Record: 987-65-4321
   - Residential Address: 742 Evergreen Terrace, Springfield, OR 97477
   - Direct Personal Phone: (555) 234-5678 / Mobile: +1-800-555-0199
   - Personal Email Address: jonathan.miller.private@cloudmail.net
   - Corporate Email: jmiller@apexglobalventures.com
   - Workstation IP Address: 192.168.1.105 / Internal Gateway: 10.0.45.22

2. Employer & Counsel:
   - Employer Entity: Apex Global Ventures Corporation (EIN / Tax ID: 12-3456789)
   - Lead Counsel: Sarah Jenkins, Esq. (Phone: 555-901-2244, Email: sjenkins@jenkins-legal-counsel.com)
   - Project Designation: Project Prometheus (Confidential Restructuring)

SETTLEMENT DISBURSEMENT & BANKING DETAILS
Employer agrees to disburse the net settlement sum of $285,000 to Employee's designated depository account:
- Depository Bank: Silicon Valley Commercial Bank
- Wire Routing Number (ABA): 021000021
- Direct Deposit Account Number: 884729104821
- International IBAN: US64SVBK12345678901234
- Corporate Purchasing Card on File: 4532-1234-5678-9012 (Visa)
- Secondary Amex Card: 3782-822456-71006

TERMS OF MUTUAL RELEASE
In consideration of the payment described above, Employee fully and irrevocably releases Employer, its subsidiaries, and Project Prometheus steering committees from any claims arising under the Age Discrimination in Employment Act (ADEA), Title VII of the Civil Rights Act, or the Fair Labor Standards Act.

CONFIDENTIALITY COVENANT
Employee explicitly covenants that neither Employee nor Employee's immediate family shall disclose the terms of this settlement, the financial amounts, or any proprietary work products related to Project Prometheus and Falcon Acquisition to any third party.
`;

fs.writeFileSync(path.join(outDir, '04_CONFIDENTIAL_SETTLEMENT_PII.txt'), piiSettlementText, 'utf8');
console.log('✓ Created 04_CONFIDENTIAL_SETTLEMENT_PII.txt');

// =========================================================================
// 5. GENERATE SAMPLE PDFS FOR BATES STAMPING SUITE
// =========================================================================
async function generateSamplePdfs() {
  // PDF 1: Exhibit A (3 Pages)
  const pdf1 = await PDFDocument.create();
  const font = await pdf1.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf1.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= 3; i++) {
    const page = pdf1.addPage([612, 792]); // Standard US Letter
    page.drawText(`EXHIBIT A: FINANCIAL AUDIT & VALUATION REPORT`, {
      x: 50,
      y: 720,
      size: 14,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`DOCUMENT SECTION: PAGE ${i} OF 3`, {
      x: 50,
      y: 695,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(
      `This document contains confidential evidentiary discovery produced in Case No. 2026-CV-88910.\\n` +
      `Trial evidence regarding disputed milestone expenditures and capital asset reconciliations.\\n` +
      `Prepared for judicial submission and depositions under protective order.`,
      {
        x: 50,
        y: 640,
        size: 10,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
        lineHeight: 16,
      }
    );

    // Draw dark scan simulation box at the bottom to test High-Contrast Backing Pill
    page.drawRectangle({
      x: 40,
      y: 30,
      width: 532,
      height: 45,
      color: rgb(0.15, 0.15, 0.18),
    });
    page.drawText(`[CONFIDENTIAL PRIVILEGED DISCOVERY ARCHIVE - RESTRICTED ACCESS]`, {
      x: 50,
      y: 50,
      size: 9,
      font: fontBold,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  const pdf1Bytes = await pdf1.save();
  fs.writeFileSync(path.join(outDir, '05_TRIAL_EXHIBIT_A_FINANCIALS.pdf'), pdf1Bytes);
  console.log('✓ Created 05_TRIAL_EXHIBIT_A_FINANCIALS.pdf (3 pages)');

  // PDF 2: Exhibit B (2 Pages)
  const pdf2 = await PDFDocument.create();
  const font2 = await pdf2.embedFont(StandardFonts.Helvetica);
  const fontBold2 = await pdf2.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= 2; i++) {
    const page = pdf2.addPage([612, 792]);
    page.drawText(`EXHIBIT B: TECHNICAL SPECIFICATIONS & ARCHITECTURE`, {
      x: 50,
      y: 720,
      size: 14,
      font: fontBold2,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`DOCUMENT SECTION: PAGE ${i} OF 2`, {
      x: 50,
      y: 695,
      size: 10,
      font: font2,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(
      `System architectural schematics, cryptographic key lifecycle policies, and server logs.\\n` +
      `Produced in response to Plaintiff's First Request for Production of Documents (RFP #14).\\n` +
      `Subpoena compliance manifest verified by forensic investigator.`,
      {
        x: 50,
        y: 640,
        size: 10,
        font: font2,
        color: rgb(0.2, 0.2, 0.2),
        lineHeight: 16,
      }
    );

    // Dark bar at bottom
    page.drawRectangle({
      x: 40,
      y: 30,
      width: 532,
      height: 45,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`[PRODUCED PURSUANT TO FED. R. CIV. P. 26(b)(1)]`, {
      x: 50,
      y: 50,
      size: 9,
      font: fontBold2,
      color: rgb(0.7, 0.7, 0.7),
    });
  }

  const pdf2Bytes = await pdf2.save();
  fs.writeFileSync(path.join(outDir, '06_TRIAL_EXHIBIT_B_TECHNICAL.pdf'), pdf2Bytes);
  console.log('✓ Created 06_TRIAL_EXHIBIT_B_TECHNICAL.pdf (2 pages)');
}

await generateSamplePdfs();

// =========================================================================
// 6. GENERATE COMPREHENSIVE GUIDE FOR USER
// =========================================================================
const readmeGuide = `# دليل تجربة واختبار أداة ContractGuard بالكامل
# ContractGuard Enterprise Test Suite Guide

تم إنشاء هذه الحزمة من الملفات خصيصاً لتجربة وفحص كل محرك وكل زر داخل أداة ContractGuard بدقة تامة وبأداء فائق السرعة وخفيف جداً على رامات ومعالج جهازك.

مجلد الملفات:
TEST_DOCUMENTS/

================================================================================
1. تجربة محرك تدقيق العقود الفردية (Single Draft Audit):
الملف المستخدم:
-> 01_COMPREHENSIVE_INTEGRITY_AUDIT.txt

ماذا تفعل؟
1. افتح أداة ContractGuard.
2. اختر من القائمة: "Integrity & Diff Audit".
3. تأكد أن الوضع على "Single Draft Audit".
4. انسخ نص الملف (01_COMPREHENSIVE_INTEGRITY_AUDIT.txt) والصقه في خانة العقد (أو ارفعه كملف).
5. اضغط زر "Run Integrity Audit".

ما هي النتائج التي ستراها في ثوانٍ؟
* Broken Citations (المراجع المكسورة): سيكتشف إحالات إلى Section 14.8 و Clause 9.3(b) غير الموجودة في العقد.
* Missing Exhibits (الملاحق الناقصة): سيكتشف الإشارة إلى Exhibit D و Schedule 3 و Appendix C غير المرفقة.
* Financial Mismatches (التناقضات المالية):
  - $45,000 مقابل (Sixty Thousand Dollars)
  - $150,000 مقابل (One Hundred Twenty-Five Thousand Dollars)
* Undefined Terms (مصطلحات غير معرفة): سيكتشف "Intellectual Capital" و "Proprietary Diagnostic Models".
* Template Placeholders (فراغات القوالب): سيكتشف [Insert Notice Period] و [Insert Customer Legal Department Address] و __________.
* Entity Discrepancy (اختلاف اسم الشركة): سيلاحظ استخدام Apex Global Technologies Inc. في البداية و Apex Global Tech LLC في النهاية.
* Chronology Issues (تواريخ منتهية): سيكتشف تاريخ نوفمبر 2023 الماضي.
* Obligations Matrix: سيفصل التزامات Customer و Provider و Third Party (Escrow Agent).
* Risk Radar: سيكتشف بنود المسؤولية اللانهائية (Unlimited Liability)، التعويضات، والشرط الجزائي لعدم المنافسة (Non-Compete).
* أزرار التصدير: جرب الضغط على "Client Memo (PDF)" لتوليد مذكرة المحامي الفخمة بضغطة واحدة، أو "Obligations CSV".

================================================================================
2. تجربة محرك المقارنة الخطية والردلاين (Redline Diff Mode):
الملفات المستخدمة:
-> الأصل: 02_ORIGINAL_DRAFT_BASELINE.txt
-> النسخة المعدلة: 03_COUNTERPARTY_REDLINE_DRAFT.txt

ماذا تفعل؟
1. في تبويب "Integrity & Diff Audit"، اضغط على زر "Redline Diff Mode".
2. ضع نص ملف (02_ORIGINAL_DRAFT_BASELINE.txt) في خانة Original Baseline.
3. ضع نص ملف (03_COUNTERPARTY_REDLINE_DRAFT.txt) في خانة Modified Draft.
4. اضغط "Execute Redline Diff & Audit".

ما هي النتائج التي ستراها؟
* نسبة التشابه (Similarity Score) تتغير بدقة.
* شاشة المقارنة التفاعلية:
  - الإضافات الخبيثة من الطرف الآخر باللون الأخضر (زيادة السعر إلى $110,000، غرامة التأخير 15%، نزع السورس كود، شرط التحكيم الإجباري).
  - الحذوفات باللون الأحمر المشطوب (حذف الضمانات وحذف حدود المسؤولية).
* جرب الضغط على زر "Redline HTML" لتحميل صفحة HTML تفاعلية كاملة للمقارنة.

================================================================================
3. تجربة أداة حجب وتطهير البيانات الحساسة (Smart PII Redactor):
الملف المستخدم:
-> 04_CONFIDENTIAL_SETTLEMENT_PII.txt

ماذا تفعل؟
1. من القائمة الجانبية، اختر: "Smart PII Redactor".
2. انسخ نص (04_CONFIDENTIAL_SETTLEMENT_PII.txt) والصقه في خانة INPUT TEXT.
3. في خانة Custom Keywords: أضف مثلاً "Project Prometheus" أو "Jonathan Vance Miller".
4. اختر Masking Style: (Black Block أو Descriptive Tag أو Asterisks).
5. اضغط زر "Sanitize Document".

ما هي النتائج التي ستراها؟
* حجب فوري لأرقام الضمان الاجتماعي (SSN): 123-45-6789.
* حجب أرقام البطاقات الائتمانية والفيزا.
* حجب الحسابات البنكية والـ IBAN والـ Routing Number.
* حجب الإيميلات وأرقام الهواتف والـ IP Address.
* حجب الكلمات والأسماء السرية المخصصة التي أدخلتها.
* زر تحميل مباشر للنسخة المطهرة (Download Sanitized Document).

================================================================================
4. تجربة ترقيم وثائق المحاكم وتجهيز الحزم (Bates Stamping Suite):
الملفات المستخدمة:
-> 05_TRIAL_EXHIBIT_A_FINANCIALS.pdf
-> 06_TRIAL_EXHIBIT_B_TECHNICAL.pdf

ماذا تفعل؟
1. من القائمة الجانبية، اختر: "Bates Stamping Suite".
2. اسحب ملفي الـ PDF (05 و 06) وأفلتهما في منطقة الرفع.
3. اضبط الخيارات:
   - Prefix: جرب كتابة PLTF- (المدعي) أو CONF- (سري).
   - Start Number: 1
   - Digit Padding: 4 Digits (ليصبح PLTF-0001)
   - فعل خيار: Draw High-Contrast Backing Pill (رسم خلفية تباين).
4. اضغط زر "Merge, Stamp & Download Bundle".

ما هي النتائج التي ستراها؟
* معالجة فورية لجميع الصفحات الـ 5 محلياً في الذاكرة دون أي تأخير.
* تحميل ملف PDF مدمج ومختوم بالكامل رسمياً.
* عند فتح الملف، ستجد كل صفحة مرقمة بتسلسل رسمي دقيق:
  (PLTF-0001, PLTF-0002, PLTF-0003, PLTF-0004, PLTF-0005)
* خلفية التباين البيضاء تضمن وضوح الرقم حتى فوق الشريط الداكن في أسفل المستند.

================================================================================
5. تجربة سجلات الخزينة المحلية (Audit Vault):
ماذا تفعل؟
1. بعد إجراء أي فحص أو ترقيم، اضغط على "Audit Vault".
2. ستجد جميع العمليات مسجلة ومحفوظة محلياً في IndexedDB داخل متصفحك.
3. جرب زر "Open Session" لاستعادة الجلسة بضغطة زر واحدة.
4. جرب زر "Clear Local Vault" لمسح كافة السجلات بأمان تام.
`;

fs.writeFileSync(path.join(outDir, 'README_TEST_GUIDE.txt'), readmeGuide, 'utf8');
console.log('✓ Created README_TEST_GUIDE.txt');

console.log('\nAll test documents generated successfully!');
