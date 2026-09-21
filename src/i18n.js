import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "nav_brand": "NexusOS",
      "nav_btn": "Get Enterprise License",
      "hero_status": "LIFETIME DEAL - 2026",
      "hero_title": "Enterprise B2B<br/>Audit & Revenue<br/>Optimization Suite",
      "hero_desc": "Protect your MRR, maximize your ROI, and scale your operations with Zero-Cost local-first software. No recurring fees.",
      "btn_deploy": "View Enterprise Suite",
      "btn_view": "Watch Demo",
      "section_modules_title": "The Nexus Suite",
      "section_modules_desc": "Algorithmic engines built to audit your finances, scrub your data, and protect your legal liabilities.",
      
      "prod_leadscrub_title": "Nexus LeadScrub",
      "prod_leadscrub_price": "$49",
      "modal_leadscrub_pain": "Your sales team is burning time and hurting your domain reputation by emailing invalid, role-based (info@), or free (gmail) accounts.",
      "modal_leadscrub_agitate": "Every bounced email destroys your outreach deliverability. Traditional list scrubbers charge you monthly APIs based on volume.",
      "modal_leadscrub_solve": "LeadScrub is a powerful, locally-hosted algorithm. Instantly purge duplicates, drop high-risk emails, and export a VIP list of B2B decision makers. Zero API costs. Zero data leaks.",
      
      "prod_ecommatch_title": "Nexus EcomMatch",
      "prod_ecommatch_price": "$79",
      "modal_ecommatch_pain": "Are you 100% sure Stripe deposited every single dollar from your Shopify orders? Most businesses suffer from untracked revenue leakage.",
      "modal_ecommatch_agitate": "Manual reconciliation takes hours. Missing just 2% of payouts due to sync errors or hidden fee discrepancies destroys your net margin.",
      "modal_ecommatch_solve": "EcomMatch mathematically cross-references your Shopify CSV against your Stripe CSV. Instantly detect missing payouts, high fee anomalies, and recover your lost MRR.",

      "prod_contractcompare_title": "Nexus Legal-Audit",
      "prod_contractcompare_price": "$99",
      "modal_contractcompare_pain": "Signing B2B contracts is dangerous. Sneaky lawyers hide 'automatic renewals' or 'liquidated damages' in huge walls of text.",
      "modal_contractcompare_agitate": "Missing a single trap can lock you into perpetual liabilities, costing you hundreds of thousands of dollars in litigation.",
      "modal_contractcompare_solve": "Upload any contract. Our algorithmic Legal-Audit engine runs a Deep Risk Audit to instantly flag hidden traps, calculate a Safety Score, and run a precise diff comparison.",
      
      "prod_adspendaudit_title": "Nexus AdSpend-Audit",
      "prod_adspendaudit_price": "$69",
      "modal_adspendaudit_pain": "Your marketing agency is hiding 'Zombie Campaigns' that burn thousands of dollars without generating a single conversion.",
      "modal_adspendaudit_agitate": "Looking at Meta's confusing dashboard hides the truth. If your Cost Per Acquisition (CPA) is higher than your margin, you are bleeding cash daily.",
      "modal_adspendaudit_solve": "Upload your Ads export. The AdSpend-Audit engine mathematically calculates your exact wasted spend, exposes high-CPA losers, and gives you a strict Kill/Scale list to instantly maximize ROI.",
    }
  },
  ar: {
    translation: {
      "nav_brand": "NexusOS",
      "nav_btn": "احصل على الترخيص",
      "hero_status": "نسخة مدى الحياة - 2026",
      "hero_title": "حزمة أدوات<br/>تدقيق الشركات<br/>وتعظيم الأرباح",
      "hero_desc": "احمِ أرباحك الشهرية (MRR)، وارفع العائد على الاستثمار (ROI). برمجيات تعمل محلياً بدون اشتراكات شهرية.",
      "btn_deploy": "استعرض الحزمة",
      "btn_view": "شاهد العرض",
      "section_modules_title": "أدوات Nexus",
      "section_modules_desc": "محركات خوارزمية صُممت لتدقيق أموالك، تنظيف بياناتك، وحمايتك قانونياً.",
      
      "prod_leadscrub_title": "Nexus LeadScrub",
      "prod_leadscrub_price": "$49",
      "modal_leadscrub_pain": "فريق المبيعات يضيع وقته ويدمر سمعة نطاقك بمراسلة إيميلات وهمية أو مجانية (gmail) أو عامة (info@).",
      "modal_leadscrub_agitate": "كل إيميل يرتد يدمر نسبة وصول رسائلك. والأدوات التقليدية لتنظيف القوائم تجبرك على دفع اشتراكات شهرية باهظة.",
      "modal_leadscrub_solve": "أداة LeadScrub هي خوارزمية تعمل محلياً. بضغطة زر تمسح الإيميلات المكررة والخطيرة، وتستخرج لك قائمة B2B لمدراء حقيقيين. صفر تكاليف اشتراك.",
      
      "prod_ecommatch_title": "Nexus EcomMatch",
      "prod_ecommatch_price": "$79",
      "modal_ecommatch_pain": "هل أنت متأكد 100% أن Stripe قام بإيداع كل دولار من مبيعات متجرك في Shopify؟ معظم الشركات تعاني من 'تسرب الإيرادات'.",
      "modal_ecommatch_agitate": "المطابقة اليدوية تأخذ ساعات. فقدان 2% فقط من أموالك بسبب أخطاء المزامنة أو الرسوم المخفية يدمر هامش ربحك (MRR).",
      "modal_ecommatch_solve": "تقوم الأداة بمطابقة ملف مبيعات Shopify مع إيداعات Stripe رياضياً. وتكتشف فوراً الدفعات المفقودة والرسوم المبالغ فيها لتسترد أموالك الضائعة.",

      "prod_contractcompare_title": "Nexus Legal-Audit",
      "prod_contractcompare_price": "$99",
      "modal_contractcompare_pain": "توقيع عقود الـ B2B خطير جداً. المحامون يخبئون فخاخاً مثل 'التجديد التلقائي' أو 'التعويضات القاسية' في جدران من النصوص.",
      "modal_contractcompare_agitate": "تفويت فخ واحد قد يورطك في التزامات أبدية تكلف شركتك مئات الآلاف من الدولارات في المحاكم.",
      "modal_contractcompare_solve": "ارفع أي عقد. محركنا الخوارزمي سيقوم بتدقيق قانوني عميق (Audit) لاكتشاف الفخاخ فوراً، حساب نسبة الأمان، ومقارنة التعديلات بدقة متناهية.",
      
      "prod_adspendaudit_title": "Nexus AdSpend-Audit",
      "prod_adspendaudit_price": "$69",
      "modal_adspendaudit_pain": "وكالة التسويق تخفي عنك حملات 'الزومبي' التي تحرق آلاف الدولارات دون جلب أي مبيعة.",
      "modal_adspendaudit_agitate": "لوحة تحكم فيسبوك مصممة لتشتيتك. إذا كانت تكلفة الاستحواذ (CPA) أعلى من هامش ربحك، فأنت تنزف أموالاً يومياً.",
      "modal_adspendaudit_solve": "ارفع تقرير الإعلانات. سيقوم المحرك بحساب 'الأموال المحترقة' بدقة، ويفضح الحملات الخاسرة، ويعطيك قائمة صارمة بالحملات التي يجب إيقافها لتعظيم العائد (ROI)."
    }
  }
};

const systemLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
const defaultLang = Object.keys(resources).includes(systemLang) ? systemLang : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
