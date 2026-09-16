import os, re

app_file = 'src/App.jsx'
landing_file = 'src/pages/ProductLanding.jsx'
i18n_file = 'src/i18n.js'

with open(app_file, 'r', encoding='utf-8') as f: app_content = f.read()
with open(landing_file, 'r', encoding='utf-8') as f: landing_content = f.read()
with open(i18n_file, 'r', encoding='utf-8') as f: i18n_content = f.read()

# 1. Update i18n.js translations (both AR and EN)
en_translations = '''
      "prod_leadscrub_title": "Nexus LeadScrub",
      "prod_leadscrub_price": "",
      "prod_leadscrub_desc": "B2B List Cleaner (Local-First). Never ruin your email deliverability again.",
      "modal_leadscrub_pain": "Are you tired of paying /mo for email verifiers just to clean your lists?",
      "modal_leadscrub_agitate": "Uploading your proprietary lead lists to third-party servers is a massive security risk.",
      "modal_leadscrub_solve": "Nexus LeadScrub is a completely local-first list cleaning engine. It processes hundreds of thousands of rows instantly inside your browser memory.",
      
      "prod_ecommatch_title": "Nexus EcomMatch",
      "prod_ecommatch_price": "",
      "prod_ecommatch_desc": "Shopify & Stripe Reconciliation. Stop bleeding money and find missing payouts instantly.",
      "modal_ecommatch_pain": "E-commerce owners waste days trying to match Shopify orders with Stripe payouts on Excel.",
      "modal_ecommatch_agitate": "Did Stripe take a hidden fee? Did a payout fail? You are losing money without knowing it.",
      "modal_ecommatch_solve": "Upload your Store CSV and Gateway CSV. Our algorithm instantly finds perfect matches, mismatched amounts, and missing payouts locally.",
      
      "prod_contractcompare_title": "Nexus Contract-Compare",
      "prod_contractcompare_price": "",
      "prod_contractcompare_desc": "NDA & Legal Diff Engine. Never miss a hidden clause again.",
      "modal_contractcompare_pain": "Lawyers constantly send NDAs back and forth. Did they sneak in a clause changing your liability?",
      "modal_contractcompare_agitate": "Uploading confidential MSAs to random cloud diff tools is a direct NDA violation.",
      "modal_contractcompare_solve": "Paste the Original and Revised contract. It instantly highlights every single addition (green) and deletion (red) 100% offline.",
      
      "prod_adspendaudit_title": "Nexus AdSpend Audit",
      "prod_adspendaudit_price": "",
      "prod_adspendaudit_desc": "Wasted Budget Detector. Kill unprofitable ads before they drain your bank account.",
      "modal_adspendaudit_pain": "Media buyers waste thousands on Facebook and Google Ads campaigns that generate zero return.",
      "modal_adspendaudit_agitate": "Checking every ad set manually is exhausting, and giving third-party tools access to your Ad Account is risky.",
      "modal_adspendaudit_solve": "Upload your raw Ads Manager CSV. Our local engine instantly identifies budget-draining campaigns and generates a Kill List.",
      
      "prod_webdesign_title": "Custom Web Architecture",
      "prod_webdesign_price": "Contact Us",
      "prod_webdesign_desc": "High-performance corporate websites and landing pages.",
      "modal_webdesign_pain": "Your current website looks outdated and fails to convert visitors into clients.",
      "modal_webdesign_agitate": "A slow, generic template website destroys your credibility in front of high-ticket clients.",
      "modal_webdesign_solve": "We design and develop modern, lightning-fast web architectures tailored precisely to your brand's unique identity.",
      
      "prod_companysetup_title": "Full Company Setup & Branding",
      "prod_companysetup_price": "Contact Us",
      "prod_companysetup_desc": "Complete visual identity, logo, colors, and website architecture.",
      "modal_companysetup_pain": "Starting a new business without a cohesive brand identity makes you invisible in the market.",
      "modal_companysetup_agitate": "Patching together a logo from Fiverr and a template website leads to a cheap, untrustworthy brand image.",
      "modal_companysetup_solve": "We provide an end-to-end company setup: powerful branding, custom logos, color psychology, and a premium website."
'''

ar_translations = '''
      "prod_leadscrub_title": "مُنظف قوائم العملاء LeadScrub",
      "prod_leadscrub_price": "",
      "prod_leadscrub_desc": "نظف قوائم الإيميلات الضخمة محلياً وبثوانٍ لتحافظ على قوة إرسالك.",
      "modal_leadscrub_pain": "هل تعبت من دفع 100$ شهرياً لمواقع تنظيف الإيميلات؟",
      "modal_leadscrub_agitate": "رفع قوائم عملائك السرية لسيرفرات خارجية يعتبر مخاطرة أمنية كبيرة.",
      "modal_leadscrub_solve": "أداة LeadScrub تعمل 100% داخل جهازك (بدون إنترنت). نظف مئات الآلاف من الإيميلات في ثوانٍ وبأمان تام.",
      
      "prod_ecommatch_title": "المطابقة المالية EcomMatch",
      "prod_ecommatch_price": "",
      "prod_ecommatch_desc": "طابق طلبات متجرك (Shopify) مع دفعات (Stripe) واكتشف الأموال الضائعة.",
      "modal_ecommatch_pain": "تضييع أيام في محاولة مطابقة طلبات المتجر مع الحوالات البنكية على الإكسل.",
      "modal_ecommatch_agitate": "هل خصم البنك عمولة خفية؟ هل فشلت حوالة ولم تنتبه لها؟ أنت تخسر المال بصمت.",
      "modal_ecommatch_solve": "ارفع ملف طلبات المتجر وملف الدفعات، وخوارزميتنا ستكتشف فوراً التطابق، النقص، والحوالات المفقودة كلياً.",
      
      "prod_contractcompare_title": "مقارن العقود Contract-Compare",
      "prod_contractcompare_price": "",
      "prod_contractcompare_desc": "لا تفوت أي بند مخفي. قارن نسختين من أي عقد قانوني محلياً واكتشف التلاعب.",
      "modal_contractcompare_pain": "كيف تتأكد أن الطرف الآخر لم يضف بنداً خفياً يرفع الشرط الجزائي من 10 آلاف إلى 100 ألف؟",
      "modal_contractcompare_agitate": "رفع عقود الـ (NDA) السرية لمواقع مقارنة مجانية يعرضك للمساءلة القانونية.",
      "modal_contractcompare_solve": "ضع العقد القديم والجديد، والأداة ستلون لك الكلمات المضافة بالأخضر والمحذوفة بالأحمر 100% داخل متصفحك.",
      
      "prod_adspendaudit_title": "مدقق الإعلانات AdSpend Audit",
      "prod_adspendaudit_price": "",
      "prod_adspendaudit_desc": "اكتشف فوراً الحملات الإعلانية التي تحرق ميزانيتك بدون أي مبيعات.",
      "modal_adspendaudit_pain": "المسوقون وأصحاب المتاجر يحرقون آلاف الدولارات على حملات خاسرة يومياً.",
      "modal_adspendaudit_agitate": "مراجعة مئات الحملات الإعلانية يدوياً عملية مرهقة ومعقدة.",
      "modal_adspendaudit_solve": "ارفع ملف الإعلانات (CSV)، وسنستخرج لك فوراً قائمة الإعدام (Kill List) للحملات التي يجب إيقافها فوراً لإنقاذ مالك.",
      
      "prod_webdesign_title": "برمجة وتصميم المواقع",
      "prod_webdesign_price": "تواصل معنا",
      "prod_webdesign_desc": "برمجة مواقع احترافية وسريعة جداً تعكس قوة شركتك.",
      "modal_webdesign_pain": "موقعك الحالي بطيء ويبدو قديماً، مما يجعلك تفقد العملاء المحتملين.",
      "modal_webdesign_agitate": "استخدام القوالب الجاهزة والضعيفة يدمر مصداقية علامتك التجارية أمام الشركات الكبرى.",
      "modal_webdesign_solve": "نصمم ونبرمج مواقع حديثة، سريعة كطائرة حربية، وبواجهات عصرية تجبر العميل على احترام شركتك.",
      
      "prod_companysetup_title": "تأسيس الهوية والشركات",
      "prod_companysetup_price": "تواصل معنا",
      "prod_companysetup_desc": "بناء هوية بصرية كاملة، شعار، ألوان، وموقع إلكتروني متكامل.",
      "modal_companysetup_pain": "البدء بمشروع جديد بدون هوية واضحة يجعلك تبدو كهاوٍ وليس كشركة محترفة.",
      "modal_companysetup_agitate": "تصميم شعار رخيص من هنا وموقع من هناك سيخلق هوية مشوهة تنفر العملاء الكبار.",
      "modal_companysetup_solve": "نستلم مشروعك من الصفر: نصمم الشعار، نختار الألوان النفسية المناسبة، ونبني الموقع الإلكتروني لتنطلق كإمبراطورية."
'''

# Find the start of translations and replace
en_start = i18n_content.find('en: {')
en_trans_start = i18n_content.find('translation: {', en_start) + 14
en_trans_end = i18n_content.find('}', en_trans_start)
i18n_content = i18n_content[:en_trans_start] + '\n' + en_translations + '\n' + i18n_content[en_trans_end:]

ar_start = i18n_content.find('ar: {')
ar_trans_start = i18n_content.find('translation: {', ar_start) + 14
ar_trans_end = i18n_content.find('}', ar_trans_start)
i18n_content = i18n_content[:ar_trans_start] + '\n' + ar_translations + '\n' + i18n_content[ar_trans_end:]

with open(i18n_file, 'w', encoding='utf-8') as f: f.write(i18n_content)


# 2. Update App.jsx Products Array
app_products = '''
    const products = [
      { id: 'leadscrub', icon: Shield, titleKey: 'prod_leadscrub_title', priceKey: 'prod_leadscrub_price', descKey: 'prod_leadscrub_desc' },
      { id: 'ecommatch', icon: Zap, titleKey: 'prod_ecommatch_title', priceKey: 'prod_ecommatch_price', descKey: 'prod_ecommatch_desc' },
      { id: 'contractcompare', icon: Hexagon, titleKey: 'prod_contractcompare_title', priceKey: 'prod_contractcompare_price', descKey: 'prod_contractcompare_desc' },
      { id: 'adspendaudit', icon: TrendingDown, titleKey: 'prod_adspendaudit_title', priceKey: 'prod_adspendaudit_price', descKey: 'prod_adspendaudit_desc' },
      { id: 'webdesign', icon: Monitor, titleKey: 'prod_webdesign_title', priceKey: 'prod_webdesign_price', descKey: 'prod_webdesign_desc', isService: True },
      { id: 'companysetup', icon: Briefcase, titleKey: 'prod_companysetup_title', priceKey: 'prod_companysetup_price', descKey: 'prod_companysetup_desc', isService: True }
    ];
'''
# Using regex to replace the products array
app_content = re.sub(r'const products = \[\s*\{ id:.*?\];', app_products.strip(), app_content, flags=re.DOTALL)
# Make sure icons are imported
if 'TrendingDown' not in app_content: app_content = app_content.replace('import { Search,', 'import { Search, Shield, Zap, Hexagon, TrendingDown, Monitor, Briefcase,')
with open(app_file, 'w', encoding='utf-8') as f: f.write(app_content)


# 3. Update ProductLanding.jsx ProductsData
landing_data = '''
const productsData = {
    'leadscrub': { icon: Shield, titleKey: 'prod_leadscrub_title', priceKey: 'prod_leadscrub_price', painKey: 'modal_leadscrub_pain', agitateKey: 'modal_leadscrub_agitate', solveKey: 'modal_leadscrub_solve', link: 'https://whop.com/nexus-os-85c8/nexus-leadscrub-enterprise-license' },
    'ecommatch': { icon: Zap, titleKey: 'prod_ecommatch_title', priceKey: 'prod_ecommatch_price', painKey: 'modal_ecommatch_pain', agitateKey: 'modal_ecommatch_agitate', solveKey: 'modal_ecommatch_solve', link: 'https://whop.com/nexus-os-85c8/nexus-ecommatch-shopify-stripe-reconciliation' },
    'contractcompare': { icon: Hexagon, titleKey: 'prod_contractcompare_title', priceKey: 'prod_contractcompare_price', painKey: 'modal_contractcompare_pain', agitateKey: 'modal_contractcompare_agitate', solveKey: 'modal_contractcompare_solve', link: 'https://whop.com/nexus-os-85c8/nexus-contract-compare-nda-legal-diff-engine' },
    'adspendaudit': { icon: TrendingDown, titleKey: 'prod_adspendaudit_title', priceKey: 'prod_adspendaudit_price', painKey: 'modal_adspendaudit_pain', agitateKey: 'modal_adspendaudit_agitate', solveKey: 'modal_adspendaudit_solve', link: 'https://whop.com/nexus-os-85c8/nexus-adspend-audit-wasted-budget-detector' },
    'webdesign': { icon: Monitor, titleKey: 'prod_webdesign_title', priceKey: 'prod_webdesign_price', painKey: 'modal_webdesign_pain', agitateKey: 'modal_webdesign_agitate', solveKey: 'modal_webdesign_solve', link: 'https://wa.me/962770281699', isService: True },
    'companysetup': { icon: Briefcase, titleKey: 'prod_companysetup_title', priceKey: 'prod_companysetup_price', painKey: 'modal_companysetup_pain', agitateKey: 'modal_companysetup_agitate', solveKey: 'modal_companysetup_solve', link: 'https://wa.me/962770281699', isService: True }
};
'''
landing_content = re.sub(r'const productsData = \{.*?^\};', landing_data.strip(), landing_content, flags=re.DOTALL|re.MULTILINE)

# If it's a service, change the buy button text to contact us.
btn_replace = '''
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full flex items-center justify-center gap-3 bg-nexus-emerald text-black py-4 rounded-2xl font-bold text-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,157,0.4)] mb-4"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {product.isService ? (isRtl ? 'تواصل معنا للحصول على عرض سعر' : 'Contact Us for a Quote') : (isRtl ? 'احصل على الترخيص الآن' : 'Get Full Lifetime Access')}
                  </span>
                </a>
'''
landing_content = re.sub(r'<a\s*href=\{product.link\}.*?</a>', btn_replace.strip(), landing_content, flags=re.DOTALL)
if 'TrendingDown' not in landing_content: landing_content = landing_content.replace('import { ArrowRight,', 'import { ArrowRight, Briefcase, TrendingDown,')

with open(landing_file, 'w', encoding='utf-8') as f: f.write(landing_content)
print('Done updating everything!')
