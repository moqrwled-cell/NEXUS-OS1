import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  TrendingDown, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  Lock, 
  FileText, 
  AlertTriangle, 
  FileCheck, 
  Cpu, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Scale,
  Search,
  EyeOff,
  Layers,
  Check,
  HelpCircle
} from 'lucide-react';
import Nexus3DNode from './components/Nexus3DNode';
import ContactModal from './components/ContactModal';

const WHOP_CHECKOUT_SOLO = "https://whop.com/nexus-os-85c8/nexus-contract-compare-nda-legal-diff-engine";
const WHOP_CHECKOUT_FIRM = "https://whop.com/nexus-os-85c8/nexus-contract-compare-nda-legal-diff-engine";

export default function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [lang, setLang] = useState(i18n.language || 'ar');
  const isRtl = lang === 'ar';

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    i18n.changeLanguage(lang);
  }, [lang, isRtl, i18n]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Content dictionary for instant, fluid bilingual switching
  const c = {
    ar: {
      brand: "Nexus ContractGuard",
      brandSub: "Enterprise 2.0",
      navCapabilities: "الميزات والقدرات",
      navSecurity: "معيار السرية ABA 1.6",
      navPricing: "الأسعار والتراخيص",
      navFaq: "الأسئلة الشائعة",
      navDemoBtn: "فتح الاستوديو وتجربة الفحص",
      heroBadge: "معزول هوائياً 100% • تدقيق قانوني فوري في الذاكرة المحلية",
      heroTitle1: "حامي العقود القانونية الذكي",
      heroTitle2: "للمحامين والشركات الكبرى",
      heroSubtitle: "اكشف المراجع المكسورة (Section 8.2)، تضارب المبالغ بالأرقام والكلمات، المصطلحات غير المعرفة، وبقايا المسودات السابقة محلياً 100% داخل متصفحك قبل التوقيع — دون أن تغادر كلمة واحدة جهازك.",
      heroCtaPrimary: "🚀 فتح استوديو التدقيق وتجربة الفحص مجاناً",
      heroCtaSecondary: "🔒 شراء رخصة المؤسسات الدائمة ($199)",
      stat1Val: "0ms",
      stat1Lbl: "زمن استجابة السحابة (معالجة بالمتصفح)",
      stat2Val: "100%",
      stat2Lbl: "سرية تامة (متوافق مع ABA Model Rule 1.6)",
      stat3Val: "5 في 1",
      stat3Lbl: "محركات تدقيق متقدمة قبل التوقيع",

      // Problems / High Stakes
      problemsTag: "المخاطر القانونية والمالية الكارثية",
      problemsTitle: "لماذا تكلفك أخطاء العقود اليدوية مئات آلاف الدولارات؟",
      problemsSubtitle: "العين البشرية تجهد بعد ساعات التدقيق، وأدوات السحابة تنتهك سرية العميل. إليك ما يحميك منه ContractGuard:",
      p1Title: "المراجع القانونية المكسورة (Broken Cross-Refs)",
      p1Desc: "إحالة بند التعويض إلى «المادة 14.3» بينما تم تعديلها أو حذفها في المسودة ينسف حمايتك القضائية تماماً.",
      p2Title: "تضارب المبالغ المكتوبة بالأرقام والكلمات",
      p2Desc: "كتابة «عشرة آلاف دولار» وبالأرقام «($100,000)» يخلق نزاعاً قضائياً فورياً وتكاليف تحكيم باهظة.",
      p3Title: "تسريب السرية السحابية (Privilege Leakage)",
      p3Desc: "رفع مسودات الاندماج والاستحواذ لـ ChatGPT أو خوادم خارجية ينتهك التزامات السرية المهنية ويعرضك للمساءلة.",
      p4Title: "بقايا المسودات وفراغات [TBD]",
      p4Desc: "ترك علامات [TBD] أو فراغات «___» أو مصطلحات لم تُعرّف في ملحق التعريفات يمنح الخصم ثغرة استغلال سهلة.",

      // Feature Engines
      enginesTag: "محركات الفحص الخماسية المتطورة",
      enginesTitle: "ترسانة فحص شاملة مدمجة داخل متصفحك",
      enginesSubtitle: "يعمل في أجزاء من الثانية عبر تقنية Web Worker فائقة السرعة على عقود تصل إلى أكثر من 15,000 كلمة.",
      features: [
        {
          title: "كاشف المراجع والملاحق المفقودة",
          sub: "Cross-Reference & Missing Exhibit Hunter",
          desc: "يمسح العقد بالكامل لاستخراج كافة الإحالات (مثل Section 4.2، Exhibit A، Schedule 1) ويتحقق من وجودها الفعلي داخل الوثيقة، مع تنبيه فوري لأي مادة مفقودة أو محذوفة.",
          bullets: ["كشف الإحالات لأقسام محذوفة في المسودة", "التأكد من إرفاق كافة الملاحق والمعارض المذكورة", "فهرسة موضع كل إحالة للوصول الفوري"]
        },
        {
          title: "مدقق المبالغ والتواريخ المتعارضة",
          sub: "Financial Figure-to-Word & Date Discrepancies",
          desc: "يطابق تلقائياً المبالغ المالية المكتوبة نصاً بالأرقام المكتوبة بين أقواس، ويفحص الترتيب الزمني للتواريخ (تاريخ السريان، مهلة الإشعار، وتاريخ الإنهاء) لمنع المفارقات الزمنية.",
          bullets: ["مطابقة الكلمات بالأرقام (Ten Thousand vs $100,000)", "تدقيق التواريخ المستحيلة والتسلسل الزمني", "كشف فترات الإشعار والمدد التعاقدية المتناقضة"]
        },
        {
          title: "صياد المصطلحات وفراغات المسودات",
          sub: "Defined Terms & Boilerplate Residue",
          desc: "يصطاد المصطلحات المكتوبة بحرف كبير (Capitalized Terms) والتي استُخدمت دون تعريف رسمي، ويكشف بقايا المسودات السابقة مثل [TBD] أو [Insert Name] أو الخطوط الفارغة.",
          bullets: ["كشف المصطلحات العائمة غير المعرفة", "اصطياد أقواس [TBD] و [Company Name]", "حماية العقد من بقايا قوالب سابقة غير منقحة"]
        },
        {
          title: "مصفوفة الالتزامات والحقوق التعاقدية",
          sub: "Contractual Obligations Matrix",
          desc: "يستخرج ويصنف بنود العقد بدقة حسب الطرف الملزم ودرجة الإلزام القانوني (Shall / Must / Agrees to / May)، مما يمنحك جدولاً تنفيذياً بالمسؤوليات الملقاة على عاتق كل طرف.",
          bullets: ["فصل التزامات الطرف الأول عن الطرف الثاني", "فرز الالتزامات الصارمة عن الحقوق الاختيارية", "تسليم العميل خارطة طريق واضحة لما يجب فعله"]
        },
        {
          title: "توليد مذكرة العميل التنفيذية بضغطة زر",
          sub: "1-Click Executive Client Memorandum",
          desc: "يحول نتائج التدقيق المعقدة إلى مذكرة قانونية تنفيذية فخمة وجاهزة للمحكمة والعميل بصيغة PDF وطباعة رسمية، متضمنة ملخص المخاطر والملاحظات الحرجة.",
          bullets: ["تقرير رسمي جاهز يحمل توقيعك واسم مكتبك", "مصفوفة ملونة بدرجات الخطورة القانونية", "تصدير فوري بدون اتصال بالإنترنت"]
        }
      ],

      // Live Demo Showcase
      demoTag: "تجربة حية وفورية",
      demoTitle: "شاهد كيف يحمي ContractGuard عقدك في ثوانٍ",
      demoSubtitle: "لا تحتاج لإنشاء حساب أو تثبيت برامج، اضغط لتشغيل بيئة الفحص القانونية فوراً:",
      demoBtn: "فتح الاستوديو وتجربة عقد نموذجي الآن ←",

      // Pricing
      pricingTag: "استثمار لمرة واحدة مدى الحياة",
      pricingTitle: "بدون اشتراكات شهرية، رخصة دائمة تدفع ثمنها مرة واحدة",
      pricingSubtitle: "وفر آلاف الدولارات من تكاليف برمجيات السحابة الشهرية وتجنب مخاطر تسريب البيانات.",
      planSoloName: "رخصة المحامي الفردي (Solo Counsel)",
      planSoloPrice: "$199",
      planSoloOriginal: "$499",
      planSoloDesc: "مثالية للمحامي المستقل، المستشار القانوني الداخلي، والمراجعين.",
      planSoloFeatures: [
        "مقعد محامي دائم (Lifetime License)",
        "فحص وتدقيق غير محدود للعقود والاتفاقيات",
        "كاشف المراجع المكسورة والملاحق المفقودة",
        "مدقق التضارب المالي والتواريخ",
        "صياد المصطلحات وفراغات [TBD]",
        "تصدير مذكرة العميل التنفيذية (HTML & PDF)",
        "معالجة محلية 100% دون خوادم سحابية",
        "تحديثات مجانية لمدى الحياة"
      ],
      planFirmName: "رخصة مكاتب المحاماة (Law Firm Suite)",
      planFirmPrice: "$299",
      planFirmOriginal: "$799",
      planFirmBadge: "الأكثر طلباً للمؤسسات",
      planFirmDesc: "مصممة لمكاتب المحاماة، الإدارات القانونية، والفرق الاستشارية.",
      planFirmFeatures: [
        "حتى 5 مقاعد للفرق القانونية والمساعدين",
        "كافة محركات الفحص الخمسة المتقدمة",
        "مصفوفة الالتزامات والحقوق التعاقدية (Matrix)",
        "تخصيص المذكرات القانونية بشعار واسم المكتب",
        "نظام الترقيم القضائي (Bates Stamping) وطمس البيانات الحساسة",
        "دعم مباشر ذو أولوية وتدريب مخصص",
        "رخصة تجارية كاملة للمؤسسات"
      ],
      btnBuySolo: "شراء رخصة المحامي الفردي ($199)",
      btnBuyFirm: "شراء رخصة مكاتب المحاماة ($299)",
      instantActivation: "تفعيل فوري وآمن عبر Whop بمفتاح أوفلاين مشفر",

      // Security Section
      secTag: "الامتثال والمعايير الأخلاقية",
      secTitle: "لماذا يثق كبار المحامين في Nexus ContractGuard؟",
      secDesc: "تفرض قواعد السلوك المهني (ABA Model Rule 1.6) على المحامين الحفاظ على سرية معلومات الموكلين. استخدام الذكاء الاصطناعي السحابي يعرضك لمخاطر انتهاك السرية المهنية.",
      secPillar1Title: "100% داخل المتصفح (In-Browser)",
      secPillar1Desc: "تتم كافة عمليات التدقيق الرياضي واللغوي في ذاكرة الرام الخاصة بجهازك فقط.",
      secPillar2Title: "صفر إرسال للسيرفرات (Zero-Network)",
      secPillar2Desc: "لا يتم إرسال أي نص، عقد، أو بيانات تعريفية إلى أي خادم خارجي على الإطلاق.",
      secPillar3Title: "لا تدريب على بياناتك (Zero AI Training)",
      secPillar3Desc: "عقودك ومسوداتك الاستراتيجية لا يتم استخدامها أبداً لتدريب أي نماذج ذكاء اصطناعي.",

      // FAQ
      faqTag: "الأسئلة الشائعة",
      faqTitle: "كل ما تحتاج معرفته عن ContractGuard",
      faqs: [
        {
          q: "هل تحتاج الأداة إلى اتصال بالإنترنت للعمل؟",
          a: "لا، تعمل الأداة بالكامل بنظام Local-First داخل متصفحك. يمكنك فصل الإنترنت تماماً وفحص أطول العقود بأمان وسرعة فائقة."
        },
        {
          q: "ما هي صيغ العقود المدعومة في الأداة؟",
          a: "تدعم الأداة ملفات PDF الرقمية، مستندات Word، ولصق النصوص المباشرة مع الحفاظ على التنسيق والترقيم الأصلي."
        },
        {
          q: "كيف يتم تفعيل الرخصة بعد الشراء؟",
          a: "بمجرد إتمام الشراء عبر منصة Whop الآمنة، تستلم مفتاح ترخيص مشفر بالشكل (NX-XXXX-XXXX-XXXX). تدخله في الأداة ليتم فك القفل محلياً لمدى الحياة دون الحاجة لحساب أو اشتراك دوري."
        },
        {
          q: "هل يمكنني تجربة الأداة قبل الشراء؟",
          a: "نعم بالتأكيد! توفر الأداة وضع استكشاف تجريبي (Evaluation Mode) مدمج يتيح لك فحص عقد نموذجي ورؤية قوة الخوارزميات وتوليد التقارير بنفسك قبل إتمام الشراء."
        }
      ],

      // Legacy Tools Drawer
      legacyTag: "أدوات NexusOS السابقة",
      legacyTitle: "هل تبحث عن أدواتنا المتخصصة الأخرى؟",
      legacyDesc: "تتوفر أدواتنا السابقة (تنظيف القوائم وفحص الإعلانات) برخص منفصلة عبر الروابط التالية:",
      legacyLeadScrub: "Nexus LeadScrub (تنظيف القوائم محلياً)",
      legacyEcomMatch: "Nexus EcomMatch (مطابقة مبيعات المتاجر)",
      legacyAdSpend: "Nexus AdSpendAudit (كشف نزيف الإعلانات)",

      footerText: "© 2026 NexusOS Enterprise. مرخصة ومحمية بأنظمة التشفير المحلية المعزولة هوائياً.",
      contactFounder: "تواصل مع الإدارة: nexus.os.store@gmail.com"
    },
    en: {
      brand: "Nexus ContractGuard",
      brandSub: "Enterprise 2.0",
      navCapabilities: "Capabilities",
      navSecurity: "ABA Rule 1.6",
      navPricing: "Pricing & Licenses",
      navFaq: "FAQ",
      navDemoBtn: "Launch Studio & Demo",
      heroBadge: "100% AIR-GAPPED • PRE-SIGNING CONTRACT INTEGRITY ENGINE",
      heroTitle1: "Intelligent Pre-Signing Contract Defense",
      heroTitle2: "For Law Firms & Corporate Counsel",
      heroSubtitle: "Detect broken cross-references (Section 8.2), word-to-number financial contradictions, undefined terms, and leftover boilerplate 100% in-browser before signing — without a single word leaving your device.",
      heroCtaPrimary: "🚀 Launch Studio & Try Evaluation Free",
      heroCtaSecondary: "🔒 Get Lifetime Enterprise License ($199)",
      stat1Val: "0ms",
      stat1Lbl: "Cloud Latency (Instant In-Memory Analysis)",
      stat2Val: "100%",
      stat2Lbl: "Air-Gapped Privacy (ABA Model Rule 1.6 Compliant)",
      stat3Val: "5-in-1",
      stat3Lbl: "Pre-Signing Integrity Audit Engines",

      // Problems
      problemsTag: "Catastrophic Legal & Financial Liabilities",
      problemsTitle: "Why Manual Contract Proofreading Costs Hundreds of Thousands",
      problemsSubtitle: "Human eyes tire after hours of review, while cloud AI leaks client privilege. Here is what ContractGuard protects you against:",
      p1Title: "Broken Section Cross-References",
      p1Desc: "Referencing 'Section 14.3' when that clause was modified or deleted during negotiations completely breaks liability caps in court.",
      p2Title: "Words-to-Numbers Financial Mismatches",
      p2Desc: "Writing 'Ten Thousand Dollars' followed by '($100,000)' leads directly to arbitration and costly malpractice disputes.",
      p3Title: "Cloud Privilege & Confidentiality Leaks",
      p3Desc: "Pasting confidential M&A draft agreements into ChatGPT or external servers violates professional conduct (ABA Model Rule 1.6).",
      p4Title: "Leftover Boilerplate & [TBD] Gaps",
      p4Desc: "Leaving unreplaced [TBD] tags, blank '____' lines, or capitalized terms without definitions hands opposing counsel dangerous loopholes.",

      // Feature Engines
      enginesTag: "5-in-1 Pre-Signing Engines",
      enginesTitle: "Complete Legal Integrity Suite Running In-Browser",
      enginesSubtitle: "Processes 15,000+ word agreements in milliseconds using dedicated non-blocking Web Worker technology.",
      features: [
        {
          title: "Broken Cross-Reference & Exhibit Hunter",
          sub: "Internal Citation & Schedule Verification",
          desc: "Scans the entire contract for every section citation (e.g., Section 4.2, Exhibit B, Schedule 1) and verifies its actual existence, instantly alerting you to orphaned or missing references.",
          bullets: ["Flags citations to deleted or relocated clauses", "Verifies all mentioned Exhibits & Schedules are attached", "Indexes citation locations for instant review"]
        },
        {
          title: "Financial Figure-to-Word & Chronology Auditor",
          sub: "Numerical Contradictions & Date Sequences",
          desc: "Automatically reconciles spelled-out words with parenthetical numerals, and validates timeline logic (effective date, notice periods, and termination windows) to prevent temporal contradictions.",
          bullets: ["Matches words to numbers ('Ten Thousand' vs '$100,000')", "Audits date sequencing and impossible deadlines", "Catches conflicting cure periods and notice triggers"]
        },
        {
          title: "Defined Terms & Boilerplate Residue Hunter",
          sub: "Capitalized Terms & Placeholder Detection",
          desc: "Catches capitalized terms used throughout the document without a formal definition in Section 1, while scrubbing leftover drafting artifacts like [TBD], [Insert Name], or blank lines.",
          bullets: ["Identifies undefined capitalized terms", "Hunts leftover [TBD] and placeholder brackets", "Prevents unedited predecessor contract artifacts"]
        },
        {
          title: "Contractual Obligations & Rights Matrix",
          sub: "Party-by-Party Duty Breakdown",
          desc: "Extracts and categorizes clauses by responsible party and legal force (Shall / Must / Agrees to / May), delivering an executive matrix of obligations for each contracting entity.",
          bullets: ["Separates Party A obligations from Party B", "Distinguishes mandatory covenants from optional rights", "Gives clients an actionable compliance roadmap"]
        },
        {
          title: "1-Click Executive Client Memorandum",
          sub: "Court-Ready White-Label Audit PDF",
          desc: "Translates complex audit telemetry into a polished, executive-ready memorandum for clients and senior partners, complete with risk scores, critical findings, and clean printable layout.",
          bullets: ["Professional white-label memo ready for client delivery", "Color-coded risk severity matrix", "100% offline generation with zero network lag"]
        }
      ],

      // Demo Showcase
      demoTag: "Live Interactive Verification",
      demoTitle: "See ContractGuard Protect Your Contract in Seconds",
      demoSubtitle: "No account required, no installation. Launch the studio to inspect our sample contract or paste your own:",
      demoBtn: "Launch ContractGuard Studio with Sample Contract ←",

      // Pricing
      pricingTag: "One-Time Lifetime Investment",
      pricingTitle: "No Subscriptions. Lifetime Ownership.",
      pricingSubtitle: "Save thousands compared to monthly cloud seat licenses while eliminating client confidentiality risk.",
      planSoloName: "Solo Counsel License",
      planSoloPrice: "$199",
      planSoloOriginal: "$499",
      planSoloDesc: "Ideal for solo attorneys, in-house counsel, and boutique contract reviewers.",
      planSoloFeatures: [
        "1 Lifetime Attorney Seat",
        "Unlimited Contract & NDA Audits",
        "Broken Cross-Reference & Exhibit Hunter",
        "Financial Words-to-Numbers Reconciler",
        "Defined Terms & [TBD] Boilerplate Hunter",
        "Executive Client Memo Export (HTML & PDF)",
        "100% Local-First Engine (Zero Cloud Exposure)",
        "Lifetime Updates with Zero Recurring Fees"
      ],
      planFirmName: "Law Firm & Enterprise Suite",
      planFirmPrice: "$299",
      planFirmOriginal: "$799",
      planFirmBadge: "Most Popular for Teams",
      planFirmDesc: "Engineered for law firms, legal departments, and deal advisory teams.",
      planFirmFeatures: [
        "Up to 5 Attorney & Paralegal Seats",
        "All 5 Advanced Integrity Engines",
        "Contractual Obligations & Rights Matrix",
        "Firm Branding & Custom White-Label Memo",
        "Court-Grade Bates Numbering & PII Redaction",
        "Priority Support & Enterprise Onboarding",
        "Commercial Law Firm Deployment License"
      ],
      btnBuySolo: "Buy Solo Counsel License ($199)",
      btnBuyFirm: "Buy Law Firm Enterprise Suite ($299)",
      instantActivation: "Instant secure activation via Whop with offline cryptographic key",

      // Security
      secTag: "Ethics & Privilege Compliance",
      secTitle: "Why Top Legal Counsel Trust Nexus ContractGuard",
      secDesc: "Under ABA Model Rule 1.6, attorneys have an ethical duty to prevent inadvertent disclosure of confidential client data. Cloud AI processors create unacceptable liability.",
      secPillar1Title: "100% In-Browser Execution",
      secPillar1Desc: "All mathematical, syntactic, and structural audits occur exclusively in your device's memory.",
      secPillar2Title: "Zero-Network Architecture",
      secPillar2Desc: "Not a single word, clause, or metadata token is ever transmitted to an external server.",
      secPillar3Title: "Zero AI Model Training",
      secPillar3Desc: "Your confidential draft agreements and trade secrets are never harvested to train language models.",

      // FAQ
      faqTag: "Frequently Asked Questions",
      faqTitle: "Everything You Need to Know About ContractGuard",
      faqs: [
        {
          q: "Does ContractGuard require an internet connection to run audits?",
          a: "No. The entire engine is engineered Local-First. You can disconnect your Wi-Fi entirely and audit massive contracts in complete isolation."
        },
        {
          q: "What document formats are supported?",
          a: "ContractGuard supports digital PDF files, Word DOCX documents, and direct text paste with full structure and numbering preservation."
        },
        {
          q: "How does license activation work after purchase?",
          a: "Upon checkout through Whop, you receive an offline cryptographically signed license key (NX-XXXX-XXXX-XXXX). Paste it once into the tool to permanently unlock all features without online phone-home calls."
        },
        {
          q: "Can I test the tool before purchasing a license?",
          a: "Yes! ContractGuard includes an interactive Evaluation Mode that preloads sample commercial agreements and demonstrates the full audit pipeline immediately."
        }
      ],

      // Legacy
      legacyTag: "Legacy NexusOS Suites",
      legacyTitle: "Looking for Our Other Specialized Tools?",
      legacyDesc: "Our legacy productivity tools remain accessible under separate licenses below:",
      legacyLeadScrub: "Nexus LeadScrub (Local B2B List Cleaner)",
      legacyEcomMatch: "Nexus EcomMatch (Shopify/Stripe Reconciliation)",
      legacyAdSpend: "Nexus AdSpendAudit (Wasted Ad Spend Detector)",

      footerText: "© 2026 NexusOS Enterprise. Air-gapped and protected by offline local cryptography.",
      contactFounder: "Direct Contact: nexus.os.store@gmail.com"
    }
  };

  const text = c[lang] || c.ar;

  return (
    <div className={`bg-nexus-bg min-h-screen text-white overflow-x-hidden selection:bg-nexus-emerald selection:text-black ${isRtl ? 'font-["Almarai"] rtl' : 'font-sans ltr'}`}>
      
      {/* Background Gradients & Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-nexus-emerald rounded-full mix-blend-screen filter blur-[150px] opacity-15"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-nexus-mint rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      </div>

      {/* Modern B2B Navigation */}
      <nav className="fixed w-full z-50 top-0 py-4 px-6 md:px-12 flex justify-between items-center bg-[#020608]/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-nexus-emerald/10 border border-nexus-emerald/40 flex items-center justify-center text-nexus-emerald shadow-[0_0_20px_rgba(0,255,157,0.2)]">
            <Scale size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl tracking-wider text-white font-extrabold flex items-center gap-2">
              {text.brand}
              <span className="text-[10px] font-bold uppercase tracking-widest bg-nexus-emerald/20 text-nexus-emerald border border-nexus-emerald/40 px-2 py-0.5 rounded-full">
                {text.brandSub}
              </span>
            </span>
          </div>
        </div>
        
        {/* Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-300">
          <button onClick={() => scrollToSection('capabilities')} className="hover:text-nexus-emerald transition-colors">
            {text.navCapabilities}
          </button>
          <button onClick={() => scrollToSection('security')} className="hover:text-nexus-emerald transition-colors">
            {text.navSecurity}
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-nexus-emerald transition-colors">
            {text.navPricing}
          </button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-nexus-emerald transition-colors">
            {text.navFaq}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 liquid-glass px-3.5 py-1.5 rounded-full text-nexus-mint hover:bg-white/5 transition-colors border border-nexus-mint/30 text-xs font-bold"
            >
              <Globe size={15} />
              <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
            </button>
            
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 liquid-glass-strong border border-nexus-emerald/30 rounded-xl overflow-hidden flex flex-col z-50 shadow-2xl"
                >
                  <button
                    onClick={() => { setLang('ar'); setIsLangMenuOpen(false); }}
                    className="text-right px-4 py-2.5 text-xs text-gray-200 hover:bg-nexus-emerald/20 hover:text-white transition-colors"
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => { setLang('en'); setIsLangMenuOpen(false); }}
                    className="text-left px-4 py-2.5 text-xs text-gray-200 hover:bg-nexus-emerald/20 hover:text-white transition-colors"
                  >
                    English
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Launch Studio CTA in Nav */}
          <button 
            onClick={() => navigate('/app/contractcompare')}
            className="bg-nexus-emerald text-black px-5 py-2 rounded-full text-xs md:text-sm font-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,157,0.4)] flex items-center gap-2"
          >
            <span>{text.navDemoBtn}</span>
            <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Dedicated to ContractGuard Enterprise 2.0                 */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center mb-24">
          <div className="flex-1 w-full z-10">
            
            {/* Live Trust Pill */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2 mb-6 border border-nexus-emerald/40 text-nexus-mint text-xs font-bold uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-nexus-emerald animate-pulse"></span>
              <span>{text.heroBadge}</span>
            </motion.div>

            {/* Master Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.15] mb-6 text-white"
            >
              <span>{text.heroTitle1}</span>
              <br />
              <span className="bg-emerald-gradient bg-clip-text text-transparent">
                {text.heroTitle2}
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10"
            >
              {text.heroSubtitle}
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 items-center mb-12"
            >
              <button 
                onClick={() => navigate('/app/contractcompare')}
                className="bg-nexus-emerald text-black px-8 py-4 rounded-2xl font-black text-base hover:bg-white hover:scale-105 transition-all shadow-[0_0_35px_rgba(0,255,157,0.5)] flex items-center gap-3"
              >
                <span>{text.heroCtaPrimary}</span>
                <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
              </button>
              
              <button 
                onClick={() => scrollToSection('pricing')}
                className="liquid-glass border border-nexus-emerald/30 text-white px-7 py-4 rounded-2xl font-bold text-base hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Lock size={16} className="text-nexus-emerald" />
                <span>{text.heroCtaSecondary}</span>
              </button>
            </motion.div>

            {/* Stat Pills */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-xl"
            >
              <div>
                <div className="text-2xl md:text-3xl font-black text-nexus-emerald">{text.stat1Val}</div>
                <div className="text-[11px] md:text-xs text-gray-400 mt-1 leading-snug">{text.stat1Lbl}</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-nexus-mint">{text.stat2Val}</div>
                <div className="text-[11px] md:text-xs text-gray-400 mt-1 leading-snug">{text.stat2Lbl}</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-white">{text.stat3Val}</div>
                <div className="text-[11px] md:text-xs text-gray-400 mt-1 leading-snug">{text.stat3Lbl}</div>
              </div>
            </motion.div>

          </div>

          {/* 3D Brain Visual */}
          <div className="flex-1 w-full relative z-0 flex items-center justify-center min-h-[40vh] lg:min-h-[55vh] drop-shadow-[0_0_60px_rgba(0,255,157,0.25)]">
            <Nexus3DNode />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. HIGH-STAKES PAIN POINTS (Why Manual Review & Cloud AI Fail)             */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-nexus-emerald bg-nexus-emerald/10 border border-nexus-emerald/30 px-3.5 py-1.5 rounded-full">
              {text.problemsTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
              {text.problemsTitle}
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              {text.problemsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="liquid-glass-strong p-8 rounded-3xl border border-red-500/20 relative overflow-hidden group hover:border-red-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-6">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">{text.p1Title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{text.p1Desc}</p>
            </div>

            <div className="liquid-glass-strong p-8 rounded-3xl border border-yellow-500/20 relative overflow-hidden group hover:border-yellow-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-6">
                <TrendingDown size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">{text.p2Title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{text.p2Desc}</p>
            </div>

            <div className="liquid-glass-strong p-8 rounded-3xl border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <EyeOff size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">{text.p3Title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{text.p3Desc}</p>
            </div>

            <div className="liquid-glass-strong p-8 rounded-3xl border border-nexus-emerald/20 relative overflow-hidden group hover:border-nexus-emerald/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-nexus-emerald/10 text-nexus-emerald flex items-center justify-center mb-6">
                <FileCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">{text.p4Title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{text.p4Desc}</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CAPABILITIES / CORE 5 ENGINES DEEP DIVE                                 */}
        {/* ========================================================================= */}
        <section id="capabilities" className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-nexus-mint bg-nexus-mint/10 border border-nexus-mint/30 px-3.5 py-1.5 rounded-full">
              {text.enginesTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
              {text.enginesTitle}
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              {text.enginesSubtitle}
            </p>
          </div>

          {/* Interactive Engine Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Tabs List */}
            <div className="lg:col-span-5 space-y-3">
              {text.features.map((feat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFeatureTab(idx)}
                  className={`w-full text-left ${isRtl ? 'text-right' : 'text-left'} p-5 rounded-2xl transition-all border ${
                    activeFeatureTab === idx
                      ? 'liquid-glass-strong border-nexus-emerald bg-nexus-emerald/10 shadow-[0_0_30px_rgba(0,255,157,0.15)]'
                      : 'liquid-glass border-white/5 hover:border-white/20 text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-base font-bold ${activeFeatureTab === idx ? 'text-white' : 'text-gray-300'}`}>
                      {feat.title}
                    </span>
                    <span className="text-xs font-mono text-nexus-emerald opacity-80">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 block font-mono">
                    {feat.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Feature Active Card */}
            <div className="lg:col-span-7 liquid-glass-strong p-8 md:p-10 rounded-3xl border border-nexus-emerald/40 shadow-[0_0_50px_rgba(0,255,157,0.1)] relative">
              <div className="inline-flex items-center gap-2 bg-nexus-emerald/20 text-nexus-emerald text-xs font-bold px-3 py-1 rounded-full mb-6">
                <Sparkles size={14} />
                <span>{text.features[activeFeatureTab].sub}</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                {text.features[activeFeatureTab].title}
              </h3>
              
              <p className="text-gray-300 text-base leading-relaxed mb-8">
                {text.features[activeFeatureTab].desc}
              </p>

              <div className="space-y-3 border-t border-white/10 pt-6">
                {text.features[activeFeatureTab].bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-200">
                    <div className="w-5 h-5 rounded-full bg-nexus-emerald/20 text-nexus-emerald flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {isRtl ? 'معالجة محلية داخل Web Worker' : 'In-Browser Web Worker Engine'}
                </span>
                <button
                  onClick={() => navigate('/app/contractcompare')}
                  className="text-xs font-bold text-nexus-mint hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>{isRtl ? 'تجربة المحرك عملياً' : 'Test This Engine Live'}</span>
                  <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. LIVE INTERACTIVE AUDIT PROOF CALLOUT                                    */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-28">
          <div className="liquid-glass-strong rounded-3xl p-8 md:p-12 border-2 border-nexus-emerald/40 relative overflow-hidden bg-gradient-to-br from-black/80 via-[#03150d] to-black/80">
            <div className="max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-nexus-emerald bg-nexus-emerald/10 border border-nexus-emerald/30 px-3.5 py-1.5 rounded-full">
                {text.demoTag}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
                {text.demoTitle}
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                {text.demoSubtitle}
              </p>
              
              <button
                onClick={() => navigate('/app/contractcompare')}
                className="bg-nexus-emerald text-black px-8 py-4 rounded-2xl font-black text-base hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,157,0.5)] flex items-center gap-3"
              >
                <span>{text.demoBtn}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. TRANSPARENT B2B PRICING & LIFETIME LICENSES                             */}
        {/* ========================================================================= */}
        <section id="pricing" className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-nexus-emerald bg-nexus-emerald/10 border border-nexus-emerald/30 px-3.5 py-1.5 rounded-full">
              {text.pricingTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
              {text.pricingTitle}
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              {text.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Solo Plan Card */}
            <div className="liquid-glass-strong rounded-3xl p-8 md:p-10 border border-white/10 hover:border-nexus-emerald/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white">{text.planSoloName}</h3>
                    <p className="text-xs text-gray-400 mt-1">{text.planSoloDesc}</p>
                  </div>
                </div>

                <div className="my-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-white">{text.planSoloPrice}</span>
                    <span className="text-base text-gray-500 line-through">{text.planSoloOriginal}</span>
                    <span className="text-xs text-nexus-mint font-bold uppercase tracking-wider">{isRtl ? 'مدى الحياة' : 'Lifetime'}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {isRtl ? 'دفعة واحدة لمرة واحدة فقط • بدون رسوم شهرية' : 'One-time payment • Zero recurring subscriptions'}
                  </p>
                </div>

                <div className="space-y-3.5 border-t border-white/10 pt-6">
                  {text.planSoloFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href={WHOP_CHECKOUT_SOLO}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full liquid-glass border border-nexus-emerald/40 text-white hover:bg-nexus-emerald hover:text-black font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,157,0.15)]"
                >
                  <span>{text.btnBuySolo}</span>
                  <ExternalLink size={16} />
                </a>
                <p className="text-[11px] text-gray-400 text-center mt-3">
                  {text.instantActivation}
                </p>
              </div>
            </div>

            {/* Law Firm Suite (Most Popular) */}
            <div className="liquid-glass-strong rounded-3xl p-8 md:p-10 border-2 border-nexus-emerald shadow-[0_0_60px_rgba(0,255,157,0.2)] relative flex flex-col justify-between bg-gradient-to-b from-[#031d10] to-black/80">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-nexus-emerald text-black text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
                {text.planFirmBadge}
              </div>

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white">{text.planFirmName}</h3>
                    <p className="text-xs text-gray-400 mt-1">{text.planFirmDesc}</p>
                  </div>
                </div>

                <div className="my-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-nexus-emerald">{text.planFirmPrice}</span>
                    <span className="text-base text-gray-500 line-through">{text.planFirmOriginal}</span>
                    <span className="text-xs text-nexus-emerald font-bold uppercase tracking-wider">{isRtl ? 'مدى الحياة' : 'Lifetime'}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {isRtl ? 'ترخيص كامل لفريق العمل • يوفر $1,500 شهرياً' : 'Full team license • Replaces $1,500/mo cloud legal tools'}
                  </p>
                </div>

                <div className="space-y-3.5 border-t border-white/10 pt-6">
                  {text.planFirmFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-100 font-medium">
                      <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href={WHOP_CHECKOUT_FIRM}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-nexus-emerald text-black hover:bg-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(0,255,157,0.4)]"
                >
                  <span>{text.btnBuyFirm}</span>
                  <ExternalLink size={16} />
                </a>
                <p className="text-[11px] text-gray-400 text-center mt-3">
                  {text.instantActivation}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. ETHICS & PRIVACY GUARANTEE (ABA Model Rule 1.6)                         */}
        {/* ========================================================================= */}
        <section id="security" className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="liquid-glass-strong rounded-3xl p-8 md:p-12 border border-nexus-emerald/30 relative">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-nexus-mint bg-nexus-mint/10 border border-nexus-mint/30 px-3.5 py-1.5 rounded-full">
                {text.secTag}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
                {text.secTitle}
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {text.secDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/50 border border-white/10 p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-nexus-emerald/10 text-nexus-emerald flex items-center justify-center mb-4">
                  <Shield size={20} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{text.secPillar1Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{text.secPillar1Desc}</p>
              </div>

              <div className="bg-black/50 border border-white/10 p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-nexus-mint/10 text-nexus-mint flex items-center justify-center mb-4">
                  <Lock size={20} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{text.secPillar2Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{text.secPillar2Desc}</p>
              </div>

              <div className="bg-black/50 border border-white/10 p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <EyeOff size={20} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{text.secPillar3Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{text.secPillar3Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ)                                        */}
        {/* ========================================================================= */}
        <section id="faq" className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-nexus-emerald bg-nexus-emerald/10 border border-nexus-emerald/30 px-3.5 py-1.5 rounded-full">
              {text.faqTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
              {text.faqTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {text.faqs.map((faq, index) => (
              <div 
                key={index}
                className="liquid-glass-strong border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full p-6 text-left ${isRtl ? 'text-right' : 'text-left'} flex items-center justify-between gap-4 font-bold text-base md:text-lg text-white hover:text-nexus-emerald transition-colors`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    className={`transform transition-transform text-nexus-emerald shrink-0 ${activeFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. LEGACY TOOLS DRAWER (Discreet Subordinate Section)                       */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto mb-20">
          <div className="liquid-glass border border-white/5 rounded-2xl p-6 text-center">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              {text.legacyTag}
            </span>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              {text.legacyDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
              <button 
                onClick={() => navigate('/app/leadscrub')}
                className="text-gray-300 hover:text-nexus-mint transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                {text.legacyLeadScrub}
              </button>
              <button 
                onClick={() => navigate('/app/ecommatch')}
                className="text-gray-300 hover:text-nexus-mint transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                {text.legacyEcomMatch}
              </button>
              <button 
                onClick={() => navigate('/app/adspendaudit')}
                className="text-gray-300 hover:text-nexus-mint transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                {text.legacyAdSpend}
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. FOOTER                                                                 */}
        {/* ========================================================================= */}
        <footer className="border-t border-white/10 py-10 px-6 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Scale className="text-nexus-emerald" size={18} />
              <span className="font-bold text-white tracking-wider">{text.brand}</span>
              <span className="text-nexus-emerald font-mono">Enterprise 2.0</span>
            </div>
            <div>{text.footerText}</div>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="hover:text-nexus-emerald transition-colors"
            >
              {text.contactFounder}
            </button>
          </div>
        </footer>

      </main>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        services={[text.brand]}
      />
    </div>
  );
}
