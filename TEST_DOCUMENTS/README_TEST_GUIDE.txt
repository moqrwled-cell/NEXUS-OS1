# دليل تجربة واختبار أداة ContractGuard بالكامل
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
