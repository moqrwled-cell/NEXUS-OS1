import os

pages_dir = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\src\pages"
product_file = os.path.join(pages_dir, "ProductLanding.jsx")
i18n_file = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\src\i18n.js"

# 1. Update ProductLanding.jsx to use the 15 new IDs
with open(product_file, 'r', encoding='utf-8') as f:
    p_content = f.read()

new_products_data = """const productsData = {
  'leadscrub': { icon: Shield, titleKey: 'prod_leadscrub_title', priceKey: 'prod_leadscrub_price', painKey: 'modal_leadscrub_pain', agitateKey: 'modal_leadscrub_agitate', solveKey: 'modal_leadscrub_solve', link: 'http://localhost:3000/login' },
  'ecommatch': { icon: Zap, titleKey: 'prod_ecommatch_title', priceKey: 'prod_ecommatch_price', painKey: 'modal_ecommatch_pain', agitateKey: 'modal_ecommatch_agitate', solveKey: 'modal_ecommatch_solve', link: 'http://localhost:3000/login' },
  'paydiff': { icon: Hexagon, titleKey: 'prod_paydiff_title', priceKey: 'prod_paydiff_price', painKey: 'modal_paydiff_pain', agitateKey: 'modal_paydiff_agitate', solveKey: 'modal_paydiff_solve', link: 'http://localhost:3000/login' },
  'searchmerge': { icon: Search, titleKey: 'prod_searchmerge_title', priceKey: 'prod_searchmerge_price', painKey: 'modal_searchmerge_pain', agitateKey: 'modal_searchmerge_agitate', solveKey: 'modal_searchmerge_solve', link: 'http://localhost:3000/login' },
  'contractcompare': { icon: Shield, titleKey: 'prod_contractcompare_title', priceKey: 'prod_contractcompare_price', painKey: 'modal_contractcompare_pain', agitateKey: 'modal_contractcompare_agitate', solveKey: 'modal_contractcompare_solve', link: 'http://localhost:3000/login' },
  'adspendaudit': { icon: Zap, titleKey: 'prod_adspendaudit_title', priceKey: 'prod_adspendaudit_price', painKey: 'modal_adspendaudit_pain', agitateKey: 'modal_adspendaudit_agitate', solveKey: 'modal_adspendaudit_solve', link: 'http://localhost:3000/login' },
  'payoutsplit': { icon: Hexagon, titleKey: 'prod_payoutsplit_title', priceKey: 'prod_payoutsplit_price', painKey: 'modal_payoutsplit_pain', agitateKey: 'modal_payoutsplit_agitate', solveKey: 'modal_payoutsplit_solve', link: 'http://localhost:3000/login' },
  'bankconvert': { icon: Search, titleKey: 'prod_bankconvert_title', priceKey: 'prod_bankconvert_price', painKey: 'modal_bankconvert_pain', agitateKey: 'modal_bankconvert_agitate', solveKey: 'modal_bankconvert_solve', link: 'http://localhost:3000/login' },
  'crmmapper': { icon: Shield, titleKey: 'prod_crmmapper_title', priceKey: 'prod_crmmapper_price', painKey: 'modal_crmmapper_pain', agitateKey: 'modal_crmmapper_agitate', solveKey: 'modal_crmmapper_solve', link: 'http://localhost:3000/login' },
  'inventorysync': { icon: Zap, titleKey: 'prod_inventorysync_title', priceKey: 'prod_inventorysync_price', painKey: 'modal_inventorysync_pain', agitateKey: 'modal_inventorysync_agitate', solveKey: 'modal_inventorysync_solve', link: 'http://localhost:3000/login' },
  'reviewscrubber': { icon: Hexagon, titleKey: 'prod_reviewscrubber_title', priceKey: 'prod_reviewscrubber_price', painKey: 'modal_reviewscrubber_pain', agitateKey: 'modal_reviewscrubber_agitate', solveKey: 'modal_reviewscrubber_solve', link: 'http://localhost:3000/login' },
  'fleetlog': { icon: Search, titleKey: 'prod_fleetlog_title', priceKey: 'prod_fleetlog_price', painKey: 'modal_fleetlog_pain', agitateKey: 'modal_fleetlog_agitate', solveKey: 'modal_fleetlog_solve', link: 'http://localhost:3000/login' },
  'atsfilter': { icon: Shield, titleKey: 'prod_atsfilter_title', priceKey: 'prod_atsfilter_price', painKey: 'modal_atsfilter_pain', agitateKey: 'modal_atsfilter_agitate', solveKey: 'modal_atsfilter_solve', link: 'http://localhost:3000/login' },
  'subtitlesync': { icon: Zap, titleKey: 'prod_subtitlesync_title', priceKey: 'prod_subtitlesync_price', painKey: 'modal_subtitlesync_pain', agitateKey: 'modal_subtitlesync_agitate', solveKey: 'modal_subtitlesync_solve', link: 'http://localhost:3000/login' },
  'medicalredact': { icon: Hexagon, titleKey: 'prod_medicalredact_title', priceKey: 'prod_medicalredact_price', painKey: 'modal_medicalredact_pain', agitateKey: 'modal_medicalredact_agitate', solveKey: 'modal_medicalredact_solve', link: 'http://localhost:3000/login' },
};"""

import re
p_content = re.sub(r'const productsData = \{[\s\S]*?\};\n', new_products_data + '\n', p_content)

with open(product_file, 'w', encoding='utf-8') as f:
    f.write(p_content)

# 2. Update i18n.js with deep marketing copy for Arabic 
with open(i18n_file, 'r', encoding='utf-8') as f:
    i_content = f.read()

ar_marketing = """
        "modal_leadscrub_pain": "أنت تدفع مئات الدولارات شهرياً لمنصات تنظيف الإيميلات، والمصيبة الأكبر؟ أنت تقوم برفع داتا عملائك السرية لسيرفرات خارجية مما يكسر اتفاقيات الخصوصية (NDA).",
        "modal_leadscrub_agitate": "بسبب هذا الخطأ، إيميل واحد سيء يضرب سمعة الدومين الخاص بك أو بعميلك ليصبح في الـ Spam للأبد. وخسارة الدومين تعني خسارة البيزنس بالكامل وانعدام المبيعات.",
        "modal_leadscrub_solve": "أداة Nexus LeadScrub تعمل 100% داخل متصفحك. لا يوجد رفع للسحابة، لا يوجد اشتراكات بنظام الرصيد. الأداة تقوم بمقاطعة ملايين الإيميلات مع قائمة الـ DNC الخاصة بك في ثانيتين وتسحبها لك آمنة ونظيفة، لتوفر لك آلاف الدولارات.",
        
        "modal_ecommatch_pain": "كمحاسب تجارة إلكترونية، أنت تضيع أياماً في محاولة مطابقة طلبات Shopify مع مدفوعات Stripe على شيت إكسيل.",
        "modal_ecommatch_agitate": "ملف الإكسيل يعلق وينهار لأن فيه 50 ألف سطر.. وتكتشف في النهاية أن هناك آلاف الدولارات المفقودة بسبب الترجيع (Refunds) أو رسوم البوابات المخفية التي لم تنتبه لها.",
        "modal_ecommatch_solve": "أداة Nexus EcomMatch تستورد ملفات شوبيفاي وسترايب، وتقوم بمطابقتها محلياً في المتصفح في رمشة عين. تكشف لك الفروقات بدقة متناهية وبدون رفع أرقام الشركة المالية لأي سيرفر.",
        
        "modal_paydiff_pain": "مدير الموارد البشرية يراجع رواتب 500 موظف يدوياً كل شهر خوفاً من أي خطأ في الخصومات أو الإضافات.",
        "modal_paydiff_agitate": "خطأ واحد في ملف الرواتب يعني كارثة قانونية أو غضب عارم من الموظفين، ناهيك عن خطورة رفع ملف رواتب الموظفين لأداة ذكاء اصطناعي خارجية تفضح رواتبهم.",
        "modal_paydiff_solve": "أداة Nexus PayDiff تقارن ملف رواتب الشهر الماضي بالشهر الحالي محلياً، وتستخرج لك الاختلافات (Variance) فوراً بشكل آمن وسري تماماً.",

        "modal_searchmerge_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_searchmerge_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_searchmerge_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_contractcompare_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_contractcompare_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_contractcompare_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_adspendaudit_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_adspendaudit_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_adspendaudit_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_payoutsplit_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_payoutsplit_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_payoutsplit_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_bankconvert_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_bankconvert_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_bankconvert_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_crmmapper_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_crmmapper_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_crmmapper_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_inventorysync_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_inventorysync_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_inventorysync_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_reviewscrubber_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_reviewscrubber_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_reviewscrubber_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_fleetlog_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_fleetlog_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_fleetlog_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_atsfilter_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_atsfilter_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_atsfilter_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_subtitlesync_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_subtitlesync_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_subtitlesync_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
        "modal_medicalredact_pain": "لا تستطيع دمج داتا معقدة.",
        "modal_medicalredact_agitate": "تضيع وقتك بملفات الإكسيل المنهارة.",
        "modal_medicalredact_solve": "الآن تتم المعالجة محلياً في ثوانٍ معدودة وبخصوصية تامة.",
"""

en_marketing = """
        "modal_leadscrub_pain": "You're paying hundreds for cloud email scrubbers, risking your client's NDA by uploading their private lists.",
        "modal_leadscrub_agitate": "One bad email burns a domain. Uploading client lists to third-party tools is a massive compliance risk.",
        "modal_leadscrub_solve": "Nexus LeadScrub operates 100% in your browser. No cloud uploads. Instantly anti-join 1M+ rows against your DNC lists locally.",
        
        "modal_ecommatch_pain": "You spend hours matching Shopify orders to Stripe payouts.",
        "modal_ecommatch_agitate": "Excel crashes constantly, and you miss hidden gateway fees.",
        "modal_ecommatch_solve": "Match 100k+ rows locally in milliseconds without uploading financial data to the cloud.",
        
        "modal_paydiff_pain": "HR manual payroll review is terrifying and error-prone.",
        "modal_paydiff_agitate": "Uploading employee payroll to random AI tools is a huge security violation.",
        "modal_paydiff_solve": "Instantly find salary variances offline inside your browser.",

        "modal_searchmerge_pain": "Data matching is too complex.",
        "modal_searchmerge_agitate": "Excel crashes limit your scale.",
        "modal_searchmerge_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_contractcompare_pain": "Data matching is too complex.",
        "modal_contractcompare_agitate": "Excel crashes limit your scale.",
        "modal_contractcompare_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_adspendaudit_pain": "Data matching is too complex.",
        "modal_adspendaudit_agitate": "Excel crashes limit your scale.",
        "modal_adspendaudit_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_payoutsplit_pain": "Data matching is too complex.",
        "modal_payoutsplit_agitate": "Excel crashes limit your scale.",
        "modal_payoutsplit_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_bankconvert_pain": "Data matching is too complex.",
        "modal_bankconvert_agitate": "Excel crashes limit your scale.",
        "modal_bankconvert_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_crmmapper_pain": "Data matching is too complex.",
        "modal_crmmapper_agitate": "Excel crashes limit your scale.",
        "modal_crmmapper_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_inventorysync_pain": "Data matching is too complex.",
        "modal_inventorysync_agitate": "Excel crashes limit your scale.",
        "modal_inventorysync_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_reviewscrubber_pain": "Data matching is too complex.",
        "modal_reviewscrubber_agitate": "Excel crashes limit your scale.",
        "modal_reviewscrubber_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_fleetlog_pain": "Data matching is too complex.",
        "modal_fleetlog_agitate": "Excel crashes limit your scale.",
        "modal_fleetlog_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_atsfilter_pain": "Data matching is too complex.",
        "modal_atsfilter_agitate": "Excel crashes limit your scale.",
        "modal_atsfilter_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_subtitlesync_pain": "Data matching is too complex.",
        "modal_subtitlesync_agitate": "Excel crashes limit your scale.",
        "modal_subtitlesync_solve": "Process locally with absolute zero-cloud architecture.",
        "modal_medicalredact_pain": "Data matching is too complex.",
        "modal_medicalredact_agitate": "Excel crashes limit your scale.",
        "modal_medicalredact_solve": "Process locally with absolute zero-cloud architecture.",
"""

# Inject EN
parts = i_content.split("en: {")
sub_parts = re.split(r'("prod_medicalredact_desc":\s*"[^"]*",)', parts[1], maxsplit=1)
new_en_section = sub_parts[0] + sub_parts[1] + "\n" + en_marketing + sub_parts[2]
i_content = parts[0] + "en: {" + new_en_section

# Inject AR
parts = i_content.split("ar: {")
sub_parts = re.split(r'("prod_medicalredact_desc":\s*"[^"]*",)', parts[1], maxsplit=1)
new_ar_section = sub_parts[0] + sub_parts[1] + "\n" + ar_marketing + sub_parts[2]
i_content = parts[0] + "ar: {" + new_ar_section

with open(i18n_file, 'w', encoding='utf-8') as f:
    f.write(i_content)
    
print("Marketing copy injected successfully!")
