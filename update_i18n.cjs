const fs = require('fs');
const path = require('path');

const appFilePath = path.join(__dirname, 'src', 'App.jsx');
const i18nFilePath = path.join(__dirname, 'src', 'i18n.js');

const products = [
  { id: 'leadscrub', icon: 'ShieldCheck', titleKey: 'prod_leadscrub_title', priceKey: 'prod_leadscrub_price', descKey: 'prod_leadscrub_desc', link: 'http://localhost:3000/dashboard/leadscrub' },
  { id: 'ecommatch', icon: 'DollarSign', titleKey: 'prod_ecommatch_title', priceKey: 'prod_ecommatch_price', descKey: 'prod_ecommatch_desc', link: 'http://localhost:3000/dashboard/ecommatch' },
  { id: 'paydiff', icon: 'Users', titleKey: 'prod_paydiff_title', priceKey: 'prod_paydiff_price', descKey: 'prod_paydiff_desc', link: 'http://localhost:3000/dashboard/paydiff' },
  { id: 'searchmerge', icon: 'Search', titleKey: 'prod_searchmerge_title', priceKey: 'prod_searchmerge_price', descKey: 'prod_searchmerge_desc', link: 'http://localhost:3000/dashboard/searchmerge' },
  { id: 'contractcompare', icon: 'FileText', titleKey: 'prod_contractcompare_title', priceKey: 'prod_contractcompare_price', descKey: 'prod_contractcompare_desc', link: 'http://localhost:3000/dashboard/contractcompare' },
  { id: 'adspendaudit', icon: 'BarChart', titleKey: 'prod_adspendaudit_title', priceKey: 'prod_adspendaudit_price', descKey: 'prod_adspendaudit_desc', link: 'http://localhost:3000/dashboard/adspendaudit' },
  { id: 'payoutsplit', icon: 'Music', titleKey: 'prod_payoutsplit_title', priceKey: 'prod_payoutsplit_price', descKey: 'prod_payoutsplit_desc', link: 'http://localhost:3000/dashboard/payoutsplit' },
  { id: 'bankconvert', icon: 'FileSpreadsheet', titleKey: 'prod_bankconvert_title', priceKey: 'prod_bankconvert_price', descKey: 'prod_bankconvert_desc', link: 'http://localhost:3000/dashboard/bankconvert' },
  { id: 'crmmapper', icon: 'Database', titleKey: 'prod_crmmapper_title', priceKey: 'prod_crmmapper_price', descKey: 'prod_crmmapper_desc', link: 'http://localhost:3000/dashboard/crmmapper' },
  { id: 'inventorysync', icon: 'Package', titleKey: 'prod_inventorysync_title', priceKey: 'prod_inventorysync_price', descKey: 'prod_inventorysync_desc', link: 'http://localhost:3000/dashboard/inventorysync' },
  { id: 'reviewscrubber', icon: 'Star', titleKey: 'prod_reviewscrubber_title', priceKey: 'prod_reviewscrubber_price', descKey: 'prod_reviewscrubber_desc', link: 'http://localhost:3000/dashboard/reviewscrubber' },
  { id: 'fleetlog', icon: 'Truck', titleKey: 'prod_fleetlog_title', priceKey: 'prod_fleetlog_price', descKey: 'prod_fleetlog_desc', link: 'http://localhost:3000/dashboard/fleetlog' },
  { id: 'atsfilter', icon: 'Briefcase', titleKey: 'prod_atsfilter_title', priceKey: 'prod_atsfilter_price', descKey: 'prod_atsfilter_desc', link: 'http://localhost:3000/dashboard/atsfilter' },
  { id: 'subtitlesync', icon: 'Video', titleKey: 'prod_subtitlesync_title', priceKey: 'prod_subtitlesync_price', descKey: 'prod_subtitlesync_desc', link: 'http://localhost:3000/dashboard/subtitlesync' },
  { id: 'medicalredact', icon: 'Activity', titleKey: 'prod_medicalredact_title', priceKey: 'prod_medicalredact_price', descKey: 'prod_medicalredact_desc', link: 'http://localhost:3000/dashboard/medicalredact' }
];

// 1. Update App.jsx to use keys again
let appContent = fs.readFileSync(appFilePath, 'utf8');

const productsReplacement = `  const products = [
` + products.map(p => `    { id: '${p.id}', icon: Search, titleKey: '${p.titleKey}', priceKey: '${p.priceKey}', descKey: '${p.descKey}', link: '${p.link}' }`).join(',\n') + `
  ];`;

// Replace the array
appContent = appContent.replace(/const products = \[[\s\S]*?link: 'http:\/\/localhost:3000\/dashboard\/medicalredact'\s*\}\s*\];/, productsReplacement);
// Fix the mapping variables back to `t()`
appContent = appContent.replace(/p\.hardcodedTitle/g, 't(p.titleKey)');
appContent = appContent.replace(/p\.hardcodedPrice/g, 't(p.priceKey)');
appContent = appContent.replace(/p\.hardcodedDesc/g, 't(p.descKey)');

fs.writeFileSync(appFilePath, appContent);

// 2. We don't have to inject directly into i18n.js using regex, which is prone to breaking. 
// I will just read i18n.js, find where "prod_lead_title" is, and inject the 15 tools there.
let i18nContent = fs.readFileSync(i18nFilePath, 'utf8');

const enKeys = `
      "prod_leadscrub_title": "Nexus LeadScrub",
      "prod_leadscrub_price": "$49/mo",
      "prod_leadscrub_desc": "B2B Cold Email DNC Cleaner. Instantly scrub millions of emails locally. 100% private, zero cloud uploads. The ultimate domain protection.",
      
      "prod_ecommatch_title": "Nexus EcomMatch",
      "prod_ecommatch_price": "$79/mo",
      "prod_ecommatch_desc": "Shopify vs Stripe Reconciliation. Stop losing hours to Excel crashes. Match payments in milliseconds offline.",
      
      "prod_paydiff_title": "Nexus PayDiff",
      "prod_paydiff_price": "$99/mo",
      "prod_paydiff_desc": "Payroll Variance Auditor for HR. Instantly spot salary anomalies with absolute local-first employee data security.",
      
      "prod_searchmerge_title": "Nexus SearchMerge",
      "prod_searchmerge_price": "$39/mo",
      "prod_searchmerge_desc": "SEO Data Combiner. Merge GSC and Ahrefs data without cloud limits.",
      
      "prod_contractcompare_title": "Nexus Contract-Compare",
      "prod_contractcompare_price": "$59/mo",
      "prod_contractcompare_desc": "Legal Document Diff Tool. Find hidden contract changes instantly.",
      
      "prod_adspendaudit_title": "Nexus AdSpend-Audit",
      "prod_adspendaudit_price": "$29/mo",
      "prod_adspendaudit_desc": "Multi-Platform Ad Aggregator. Combine Facebook and Google reports locally.",
      
      "prod_payoutsplit_title": "Nexus Payout-Split",
      "prod_payoutsplit_price": "$99/mo",
      "prod_payoutsplit_desc": "Royalties Splitter for Record Labels. Calculate artist splits automatically.",
      
      "prod_bankconvert_title": "Nexus Bank-Convert",
      "prod_bankconvert_price": "$49/mo",
      "prod_bankconvert_desc": "PDF Bank Statement to CSV. Instant parsing, 100% offline.",
      
      "prod_crmmapper_title": "Nexus CRM-Mapper",
      "prod_crmmapper_price": "$79/mo",
      "prod_crmmapper_desc": "Salesforce to HubSpot CSV Mapper. Migrate CRM data safely.",
      
      "prod_inventorysync_title": "Nexus Inventory-Sync",
      "prod_inventorysync_price": "$59/mo",
      "prod_inventorysync_desc": "Barcode vs System Matcher. Spot missing stock immediately.",
      
      "prod_reviewscrubber_title": "Nexus Review-Scrubber",
      "prod_reviewscrubber_price": "$39/mo",
      "prod_reviewscrubber_desc": "Trustpilot Sentiment Filter. Clean review data in seconds.",
      
      "prod_fleetlog_title": "Nexus Fleet-Log",
      "prod_fleetlog_price": "$89/mo",
      "prod_fleetlog_desc": "GPS vs Fuel CSV Matcher. Stop fleet fuel theft.",
      
      "prod_atsfilter_title": "Nexus ATS-Filter",
      "prod_atsfilter_price": "$49/mo",
      "prod_atsfilter_desc": "Resume Keyword Matcher. Process thousands of resumes locally.",
      
      "prod_subtitlesync_title": "Nexus Subtitle-Sync",
      "prod_subtitlesync_price": "$29/mo",
      "prod_subtitlesync_desc": "SRT Time Aligner for Video Editors. Fix audio delays.",
      
      "prod_medicalredact_title": "Nexus Medical-Redact",
      "prod_medicalredact_price": "$99/mo",
      "prod_medicalredact_desc": "Patient Name Redactor. 100% HIPAA compliant local redaction.",
`;

const arKeys = `
      "prod_leadscrub_title": "Nexus LeadScrub",
      "prod_leadscrub_price": "$49/شهرياً",
      "prod_leadscrub_desc": "أداة تنظيف إيميلات وكالات التسويق. قم بتنظيف ملايين الإيميلات المحظورة (DNC) محلياً بدون رفع بيانات عملائك للسحابة.",
      
      "prod_ecommatch_title": "Nexus EcomMatch",
      "prod_ecommatch_price": "$79/شهرياً",
      "prod_ecommatch_desc": "مطابقة تقارير شوبيفاي مع سترايب للمحاسبين. وفر ساعات من العمل اليدوي ومطابقة آمنة بنسبة 100%.",
      
      "prod_paydiff_title": "Nexus PayDiff",
      "prod_paydiff_price": "$99/شهرياً",
      "prod_paydiff_desc": "مقارنة الرواتب لشركات الـ HR. اكتشف أي تغير في الرواتب بضغطة زر مع ضمان سرية معلومات الموظفين.",
      
      "prod_searchmerge_title": "Nexus SearchMerge",
      "prod_searchmerge_price": "$39/شهرياً",
      "prod_searchmerge_desc": "أداة لدمج بيانات SEO (GSC و Ahrefs) للمسوقين.",
      
      "prod_contractcompare_title": "Nexus Contract-Compare",
      "prod_contractcompare_price": "$59/شهرياً",
      "prod_contractcompare_desc": "أداة مقارنة العقود القانونية للمحامين، آمنة ومحلية.",
      
      "prod_adspendaudit_title": "Nexus AdSpend-Audit",
      "prod_adspendaudit_price": "$29/شهرياً",
      "prod_adspendaudit_desc": "دمج تقارير إعلانات فيسبوك وجوجل محلياً.",
      
      "prod_payoutsplit_title": "Nexus Payout-Split",
      "prod_payoutsplit_price": "$99/شهرياً",
      "prod_payoutsplit_desc": "توزيع أرباح الفنانين لشركات الإنتاج الموسيقي.",
      
      "prod_bankconvert_title": "Nexus Bank-Convert",
      "prod_bankconvert_price": "$49/شهرياً",
      "prod_bankconvert_desc": "تحويل الكشوفات البنكية من PDF إلى CSV محلياً.",
      
      "prod_crmmapper_title": "Nexus CRM-Mapper",
      "prod_crmmapper_price": "$79/شهرياً",
      "prod_crmmapper_desc": "مطابقة داتا Salesforce مع HubSpot لنقل البيانات.",
      
      "prod_inventorysync_title": "Nexus Inventory-Sync",
      "prod_inventorysync_price": "$59/شهرياً",
      "prod_inventorysync_desc": "مطابقة الجرد والمخازن لاكتشاف النواقص.",
      
      "prod_reviewscrubber_title": "Nexus Review-Scrubber",
      "prod_reviewscrubber_price": "$39/شهرياً",
      "prod_reviewscrubber_desc": "فلترة وتحليل تقييمات Trustpilot بسرعة فائقة.",
      
      "prod_fleetlog_title": "Nexus Fleet-Log",
      "prod_fleetlog_price": "$89/شهرياً",
      "prod_fleetlog_desc": "مطابقة استهلاك الوقود مع GPS لشركات الشحن.",
      
      "prod_atsfilter_title": "Nexus ATS-Filter",
      "prod_atsfilter_price": "$49/شهرياً",
      "prod_atsfilter_desc": "فلترة السير الذاتية بالكلمات المفتاحية محلياً.",
      
      "prod_subtitlesync_title": "Nexus Subtitle-Sync",
      "prod_subtitlesync_price": "$29/شهرياً",
      "prod_subtitlesync_desc": "مطابقة وتصحيح توقيتات الترجمة (SRT).",
      
      "prod_medicalredact_title": "Nexus Medical-Redact",
      "prod_medicalredact_price": "$99/شهرياً",
      "prod_medicalredact_desc": "حذف أسماء المرضى من التقارير الطبية بسرية تامة.",
`;

// Insert after "section_modules_desc": "...",
i18nContent = i18nContent.replace(/("section_modules_desc":\s*"[^"]*",)/, "$1\n" + enKeys);

// Do the same for Arabic
// Wait, Arabic section has "section_modules_desc": "...",
// I will just replace the specific AR match
i18nContent = i18nContent.replace(/("section_modules_desc":\s*"أدوات قوية، خاصة، وتعمل محلياً لعملك\.",)/, "$1\n" + arKeys);

fs.writeFileSync(i18nFilePath, i18nContent);
console.log("Translation keys injected!");
