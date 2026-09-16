import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Deep Psychological Copywriting (Hypnotic / PAS formula)
const resources = {
  en: {
    translation: {

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

}}) is bleeding money. With a performance score of {{perf}}/100 and SEO score of {{seo}}/100, Google is actively penalizing this site. We estimate a 70% loss in potential organic traffic. Immediate technical intervention is required to stop competitors from stealing your market share.",
      
      "seo_status_warning": "Warning",
      "seo_title_warning": "SEO Vulnerabilities Found",
      "seo_copy_warning": "This domain ({{url}}) has structural vulnerabilities. The performance score of {{perf}}/100 indicates slow load times which kill conversions. Your competitors are likely outranking you. We can implement our Nexus architecture to fix these gaps and boost your rankings significantly.",
      
      "seo_status_good": "Good",
      "seo_title_good": "Solid Foundation, but Optimization Needed",
      "seo_copy_good": "This domain ({{url}}) performs well ({{perf}}/100 Performance, {{seo}}/100 SEO). However, to dominate the #1 spot in your industry, you need advanced technical SEO and cinematic web architecture. Let's upgrade your digital presence to a premium tier.",
      
      "seo_section_loss_title": "⚠️ Estimated Financial Leakage",
      "seo_section_loss_desc": "Based on this analysis, the website is currently losing search engine trust. Potential clients are likely bouncing to your competitors due to slow load times and weak technical SEO structure.",
      "seo_section_action_title": "✅ Recommended Action Plan",
      "seo_action_1": "Re-engineer code structure to reduce load time to under 1 second.",
      "seo_action_2": "Patch technical vulnerabilities hindering Google bots from crawling the site.",
      "seo_action_3": "Build a high-converting UI/UX architecture to maximize lead generation.",
      
      "seo_btn_copy_msg": "Copy Outreach Script",
      "seo_outreach_copied": "Script copied! Paste it in WhatsApp or Email.",
      "seo_outreach_msg": "Hi there,\n\nI was browsing your website ({{url}}) and noticed a critical issue affecting your revenue.\nI ran a deep technical audit and discovered that Google is actively penalizing your site due to hidden structural errors! ⚠️\n\nPerformance Score: {{perf}}/100\nSEO Score: {{seo}}/100\n\nI've attached a detailed PDF report proving this. These errors are causing you to lose potential clients to competitors every day.\n\nI am an enterprise systems engineer, and I can fix this infrastructure immediately.\n\nLet me know when you review the attached report so we can stop the bleeding.",

      "seo_error_failed": "Analysis failed: {{msg}}. Please ensure the URL is correct and publicly accessible by Google.",

      "app_auth_title": "Secure Access Portal",
      "app_auth_desc": "Enter the Access Code provided in your Whop dashboard to unlock your software.",
      "app_lead_title": "NexusOS Lead Extractor",
      "app_lead_desc": "Autonomous Deep-Web Scraper",
      "app_lead_target": "Target Parameters",
      "app_lead_start": "Start Extraction",
      "lead_status_searching": "Initializing GPS boundaries...",
      "lead_status_no_results": "No targets found in this sector.",
      "lead_status_complete": "Extraction complete. Ready for export.",
      "lead_status_error": "Connection to central database failed."
    }
  },
  ar: {
    translation: {

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

}}) ينزف أموالاً كثيرة. بنقطة أداء {{perf}}/100 ونقطة سيو {{seo}}/100، تقوم جوجل بمعاقبة هذا الموقع بنشاط. نقدر أنك تخسر حوالي 70% من حركة الزوار المحتملة. التدخل الفني العاجل مطلوب فوراً لمنع المنافسين من سرقة حصتك في السوق.",
      
      "seo_status_warning": "تحذير",
      "seo_title_warning": "تم العثور على ثغرات في هيكلة السيو",
      "seo_copy_warning": "هذا الموقع ({{url}}) يعاني من نقاط ضعف هيكلية. تشير نقطة الأداء {{perf}}/100 إلى أوقات تحميل بطيئة تقتل المبيعات. من المحتمل جداً أن منافسيك يتفوقون عليك. يمكننا تطبيق هندسة متطورة لسد هذه الفجوات وتعزيز ترتيبك بشكل كبير.",
      
      "seo_status_good": "جيد",
      "seo_title_good": "أساس قوي، لكن يحتاج لترقية",
      "seo_copy_good": "أداء هذا الموقع ({{url}}) جيد ({{perf}}/100 أداء، و {{seo}}/100 سيو). ومع ذلك، للسيطرة على المركز الأول في مجالك، تحتاج إلى سيو تقني متقدم وهيكلة سينمائية. دعنا نرتقي بتواجدك الرقمي إلى مستوى القمة.",
      
      "seo_section_loss_title": "⚠️ الخسائر المقدرة للموقع",
      "seo_section_loss_desc": "بناءً على هذا التحليل، الموقع يفقد حالياً ثقة محركات البحث بنسبة تتجاوز 65%. العملاء المحتملون الذين يبحثون عن خدماتك يتوجهون مباشرة إلى منافسيك بسبب بطء التحميل وضعف الهيكلة التقنية. هذه الخسارة تتضاعف يومياً.",
      "seo_section_action_title": "✅ خطة التدخل المقترحة",
      "seo_action_1": "إعادة بناء هيكلة الكود لتسريع التحميل إلى أقل من 1 ثانية.",
      "seo_action_2": "ترقيع الثغرات التقنية التي تعيق زحف روبوتات جوجل للموقع.",
      "seo_action_3": "بناء تجربة مستخدم (UI/UX) تزيد من نسبة تحويل الزوار إلى مشترين.",
      
      "seo_btn_copy_msg": "نسخ رسالة الواتساب",
      "seo_outreach_copied": "تم نسخ رسالة الصدمة! اذهب للواتساب والصقها.",
      "seo_outreach_msg": "أهلاً بك يا مدير،\n\nكنت أتصفح موقعكم ({{url}}) ولاحظت شيئاً خطيراً جداً يخص أرباحكم.\nقمت بعمل فحص تقني عميق للموقع واكتشفت أن جوجل يعاقب موقعكم حالياً بسبب أخطاء برمجية خفية! ⚠️\n\nنقطة أداء الموقع: {{perf}}/100\nنقطة السيو: {{seo}}/100\n\nأرسلت لك ملف PDF تفصيلي يثبت هذا الكلام بالأدلة. هذه الأخطاء تجعل منافسيك يسرقون عملائك يومياً من بحث جوجل.\n\nأنا مهندس أنظمة وتقنيات، ويمكنني حل هذه الكارثة لكم خلال 48 ساعة فقط وتصدر نتائج البحث.\n\nبانتظار ردك بعد قراءة التقرير المرفق لننقذ الموقع.",

      "seo_error_failed": "فشل التحليل: {{msg}}. تأكد من أن الرابط صحيح ويمكن الوصول إليه من محركات البحث.",

      "app_auth_title": "بوابة الدخول الآمنة",
      "app_auth_desc": "أدخل كود التفعيل الموجود في حسابك في Whop لفتح البرنامج.",
      "app_lead_title": "مستخرج داتا NexusOS",
      "app_lead_desc": "محرك استخراج آلي لبيانات الويب العميق",
      "app_lead_target": "معايير الاستهداف",
      "app_lead_start": "بدء الاستخراج الآلي",
      "lead_status_searching": "جاري تحديد النطاق الجغرافي وبدء الاتصال...",
      "lead_status_no_results": "لم يتم العثور على أهداف في هذا النطاق.",
      "lead_status_complete": "اكتمل الاستخراج. جاهز للتصدير.",
      "lead_status_error": "فشل الاتصال بقاعدة البيانات المركزية."
    }
  },
  es: {
    translation: {
      "nav_brand": "NexusOS",
      "nav_btn": "Inicializar",
      "hero_status": "Sistema en línea V3.0",
      "hero_title": "El Ecosistema<br/>Empresarial<br/>Inteligente.",
      "hero_desc": "Automatiza tu flujo de trabajo y cierra tratos sin esfuerzo con la suite NexusOS.",
      "btn_deploy": "Desplegar Sistema",
      "btn_view": "Ver Arquitectura",
      "section_modules_title": "Módulos y Servicios Nexus",
      "section_modules_desc": "Nodos de grado empresarial y servicios de ingeniería a medida.",
      "prod_lead_title": "Nexus Lead Extractor",
      "prod_lead_price": "$97",
      "prod_lead_desc": "Extrae clientes potenciales B2B de alto valor usando nuestro nodo de scraping.",
      "prod_wa_title": "WhatsApp AI Booker",
      "prod_wa_price": "$147",
      "prod_wa_desc": "Despliega un agente conversacional inteligente en WhatsApp 24/7.",
      "prod_seo_title": "Nexus SEO Closer",
      "prod_seo_price": "$97",
      "prod_seo_desc": "Genera auditorías SEO en segundos para cerrar clientes en piloto automático.",
      "prod_voice_title": "Nexus Voice Agent",
      "prod_voice_price": "$197",
      "prod_voice_desc": "Nuestra IA de voz de vanguardia. Maneja llamadas de ventas con latencia humana.",
      "prod_web_title": "Arquitectura Web Nexus",
      "prod_web_price": "A medida",
      "prod_web_desc": "Desarrollo web premium. Construimos experiencias de alta conversión.",
      "prod_custom_title": "Ingeniería a Medida",
      "prod_custom_price": "Cotizar",
      "prod_custom_desc": "¿Tienes una pesadilla técnica o una idea loca? Nuestros ingenieros la construirán.",
      
      "modal_btn": "Comprar Acceso",
      "modal_btn_email": "Solicitar Cotización",
      "modal_close": "Cerrar",
      
      "modal_lead_pain": "¿Sigues comprando listas de leads obsoletas? Tus competidores te están robando.",
      "modal_lead_agitate": "Cada hora de búsqueda manual es dinero perdido.",
      "modal_lead_solve": "Nexus Lead Extractor raspa miles de leads B2B verificados en segundos. Conéctalo y observa cómo se llena tu embudo.",
      
      "modal_wa_pain": "Estás perdiendo el 60% de tus clientes por no responder en 5 minutos.",
      "modal_wa_agitate": "La latencia humana mata las ventas. Mientras duermes, los clientes se van.",
      "modal_wa_solve": "Despliega el WhatsApp AI Booker. Actúa como tu cerrador de ventas 24/7, califica leads y agenda reuniones. Nunca más pierdas un cliente.",
      
      "modal_seo_pain": "Vender SEO es agotador sin pruebas instantáneas.",
      "modal_seo_agitate": "Los clientes no confían en promesas. Necesitan datos inmediatos.",
      "modal_seo_solve": "Nexus SEO Closer genera auditorías impresionantes al instante. Entrégale este reporte a un cliente y te rogará que arregles su sitio.",
      
      "modal_voice_pain": "Las llamadas en frío están muertas y contratar humanos es muy caro.",
      "modal_voice_agitate": "Lidiar con salarios y capacitaciones paraliza tu crecimiento.",
      "modal_voice_solve": "Conoce a tu nuevo mejor empleado. El Nexus Voice Agent hace miles de llamadas, suena humano y agenda reuniones. Escala infinitamente.",

      "modal_web_pain": "Tu sitio web actual parece barato y espanta a clientes de alto valor.",
      "modal_web_agitate": "Si tu web parece una plantilla de 2015, los clientes pensarán que tus servicios son baratos. Tienes 3 segundos para impresionarlos.",
      "modal_web_solve": "Nexus Web Architecture construye experiencias digitales premium. Programamos la confianza y la conversión en cada píxel. Cobra lo que mereces.",

      "modal_custom_pain": "¿Estás perdiendo dinero por fallos técnicos o tareas manuales imposibles de automatizar?",
      "modal_custom_agitate": "Depender de software comercial limita tu crecimiento. Si tienes un bug crítico, tu empresa se estanca.",
      "modal_custom_solve": "Despliega nuestro equipo de ingenieros de élite. Reparamos lo crítico y construimos lo imposible. Cuéntanos tu problema, nosotros lo programamos."
    }
  },
  fr: {
    translation: {
      "nav_brand": "NexusOS",
      "nav_btn": "Initialiser",
      "hero_status": "Système en ligne V3.0",
      "hero_title": "L'Écosystème<br/>Commercial<br/>Intelligent.",
      "hero_desc": "Automatisez votre flux de travail et concluez des ventes sans effort avec NexusOS.",
      "btn_deploy": "Déployer le Système",
      "btn_view": "Voir l'Architecture",
      "section_modules_title": "Modules & Services Nexus",
      "section_modules_desc": "Nœuds d'entreprise et services d'ingénierie sur mesure.",
      "prod_lead_title": "Nexus Lead Extractor",
      "prod_lead_price": "$97",
      "prod_lead_desc": "Extrayez des leads B2B de haute valeur avec notre nœud de scraping autonome.",
      "prod_wa_title": "WhatsApp AI Booker",
      "prod_wa_price": "$147",
      "prod_wa_desc": "Déployez un agent intelligent sur WhatsApp pour qualifier vos leads 24/7.",
      "prod_seo_title": "Nexus SEO Closer",
      "prod_seo_price": "$97",
      "prod_seo_desc": "Générez des audits SEO en quelques secondes pour conclure des ventes en pilote automatique.",
      "prod_voice_title": "Nexus Voice Agent",
      "prod_voice_price": "$197",
      "prod_voice_desc": "Notre IA vocale de pointe. Gère les appels de vente avec une intelligence humaine.",
      "prod_web_title": "Architecture Web Nexus",
      "prod_web_price": "Sur mesure",
      "prod_web_desc": "Développement web premium. Nous créons des expériences numériques à haute conversion.",
      "prod_custom_title": "Ingénierie Sur Mesure",
      "prod_custom_price": "Devis",
      "prod_custom_desc": "Vous avez un cauchemar technique ou une idée folle ? Nos ingénieurs la réaliseront.",
      
      "modal_btn": "Acheter l'Accès",
      "modal_btn_email": "Demander un Devis",
      "modal_close": "Fermer",
      
      "modal_lead_pain": "Vous achetez encore des listes de prospects obsolètes ?",
      "modal_lead_agitate": "La recherche manuelle vous fait perdre des revenus chaque jour.",
      "modal_lead_solve": "Nexus Lead Extractor extrait des milliers de prospects B2B vérifiés en quelques secondes. Branchez-le et regardez vos ventes exploser.",
      "modal_wa_pain": "Vous perdez 60 % de vos prospects si vous ne répondez pas en 5 minutes.",
      "modal_wa_agitate": "Le temps de réponse humain tue les ventes. Pendant que vous dormez, les clients partent.",
      "modal_wa_solve": "Déployez WhatsApp AI Booker. Il agit comme votre vendeur 24/7, qualifie les prospects et planifie des réunions. Ne perdez plus jamais un prospect.",
      "modal_seo_pain": "Vendre du SEO sans preuve immédiate est épuisant.",
      "modal_seo_agitate": "Les clients ne font pas confiance aux promesses, ils veulent des données.",
      "modal_seo_solve": "Nexus SEO Closer génère des rapports d'audit instantanés. Montrez ce rapport à un chef d'entreprise et il vous suppliera de réparer son site.",
      "modal_voice_pain": "Le démarchage téléphonique est mort et embaucher coûte trop cher.",
      "modal_voice_agitate": "La gestion d'une équipe commerciale paralyse votre marketing.",
      "modal_voice_solve": "Rencontrez votre meilleur employé. Le Nexus Voice Agent passe des milliers d'appels, semble humain et planifie des rendez-vous. Évoluez à l'infini.",
      
      "modal_web_pain": "Votre site web actuel fait fuir les clients haut de gamme.",
      "modal_web_agitate": "Si votre site ressemble à un modèle gratuit de 2015, les clients penseront que vos services sont bon marché. Vous avez 3 secondes pour convaincre.",
      "modal_web_solve": "Nexus Web Architecture crée des expériences premium. Nous codons la confiance et la psychologie dans chaque pixel. Facturez enfin ce que vous méritez.",
      
      "modal_custom_pain": "Vous perdez de l'argent à cause d'erreurs techniques ou de processus non automatisés ?",
      "modal_custom_agitate": "Se limiter aux logiciels standards bloque votre croissance. Un bug critique détruit vos opérations.",
      "modal_custom_solve": "Faites appel à nos ingénieurs d'élite. Nous réparons l'impossible et construisons du sur mesure. Expliquez votre problème, nous le coderons."
    }
  },
  tr: {
    translation: {
      "nav_brand": "NexusOS",
      "nav_btn": "Başlat",
      "hero_status": "Sistem Çevrimiçi V3.0",
      "hero_title": "Akıllı<br/>İş<br/>Ekosistemi.",
      "hero_desc": "İş akışınızı otomatikleştirin ve NexusOS süiti ile anlaşmaları zahmetsizce kapatın.",
      "btn_deploy": "Sistemi Dağıt",
      "btn_view": "Mimariyi Görüntüle",
      "section_modules_title": "Nexus Modülleri ve Hizmetleri",
      "section_modules_desc": "Kurumsal düğümler ve özel mühendislik hizmetleri.",
      "prod_lead_title": "Nexus Lead Extractor",
      "prod_lead_price": "$97",
      "prod_lead_desc": "Otonom kazıma düğümümüzü kullanarak yüksek değerli B2B müşterileri çıkarın.",
      "prod_wa_title": "WhatsApp AI Booker",
      "prod_wa_price": "$147",
      "prod_wa_desc": "WhatsApp'ta akıllı bir konuşma ajanı dağıtın, 7/24 randevu alın.",
      "prod_seo_title": "Nexus SEO Closer",
      "prod_seo_price": "$97",
      "prod_seo_desc": "Saniyeler içinde kapsamlı SEO denetimleri oluşturun. Müşterileri otopilotta kapatın.",
      "prod_voice_title": "Nexus Voice Agent",
      "prod_voice_price": "$197",
      "prod_voice_desc": "En son teknoloji sesli yapay zekamız. Satış çağrılarını insan benzeri bir zekayla yönetir.",
      "prod_web_title": "Nexus Web Mimarisi",
      "prod_web_price": "Özel",
      "prod_web_desc": "Özel, sinematik web geliştirme. Birinci sınıf markalar için deneyimler oluşturuyoruz.",
      "prod_custom_title": "Özel Mühendislik",
      "prod_custom_price": "Teklif",
      "prod_custom_desc": "Teknik bir kabusunuz mu var? Elit mühendislerimiz çözümü üretecek.",
      
      "modal_btn": "Erişim Satın Al",
      "modal_btn_email": "Teklif İste",
      "modal_close": "Kapat",
      
      "modal_lead_pain": "Hâlâ eski müşteri listeleri mi alıyorsunuz? Rakipleriniz müşterilerinizi çalıyor.",
      "modal_lead_agitate": "E-postaları manuel arayarak geçirdiğiniz her saat, gelir kaybıdır.",
      "modal_lead_solve": "Nexus Lead Extractor saniyeler içinde binlerce doğrulanmış B2B müşterisi çıkarır. Sadece başlatın ve kârınızı izleyin.",
      "modal_wa_pain": "5 dakika içinde cevap vermediğiniz için müşterilerinizin %60'ını kaybediyorsunuz.",
      "modal_wa_agitate": "İnsan gecikmesi satışları öldürür. Siz uyurken potansiyel müşterileriniz başka yerlere gider.",
      "modal_wa_solve": "WhatsApp AI Booker'ı dağıtın. 7/24 satış temsilciniz gibi çalışır, itirazları yanıtlar ve toplantılar ayarlar. Bir daha asla müşteri kaybetmeyin.",
      "modal_seo_pain": "Anında kanıtınız yoksa SEO satmak neredeyse imkansızdır.",
      "modal_seo_agitate": "Müşteriler sözlere değil verilere güvenir.",
      "modal_seo_solve": "Nexus SEO Closer anında harika denetim raporları üretir. Bu raporu bir işletme sahibine verin, sitesini düzeltmeniz için size yalvaracaktır.",
      "modal_voice_pain": "Soğuk arama öldü ve bir satış ekibi işe almak çok pahalı.",
      "modal_voice_agitate": "Satış ekibi yönetmek büyümenizi yavaşlatır.",
      "modal_voice_solve": "Yeni en iyi personelinizle tanışın. Nexus Voice Agent binlerce arama yapar, tamamen insan gibi ses çıkarır ve toplantılar ayarlar. Satış gücünüzü sonsuz şekilde ölçeklendirin.",

      "modal_web_pain": "Mevcut web siteniz ucuz görünüyor ve yüksek ödeme yapan müşterileri uzaklaştırıyor.",
      "modal_web_agitate": "Siteniz 2015'ten kalma ücretsiz bir şablon gibi görünüyorsa, müşteriler hizmetlerinizin de ucuz olduğunu düşünecektir.",
      "modal_web_solve": "Nexus Web Mimarisi birinci sınıf, sinematik deneyimler inşa eder. Güveni ve psikolojik dönüşümü her piksele işliyoruz. Hak ettiğiniz prim fiyatlarını talep edin.",

      "modal_custom_pain": "Kritik teknik hatalar veya otomatikleştirilemeyen manuel işler yüzünden para mı kaybediyorsunuz?",
      "modal_custom_agitate": "Hazır yazılımlara bağlı kalmak büyümenizi sınırlar.",
      "modal_custom_solve": "Elit mühendis ekibimizi görevlendirin. Kritik altyapıları onarıyor, imkansızı kodluyoruz. Bize sorununuzu söyleyin, çözümü inşa edelim."
    }
  },
  ja: {
    translation: {
      "nav_brand": "NexusOS",
      "nav_btn": "初期化",
      "hero_status": "システムオンライン V3.0",
      "hero_title": "インテリジェントな<br/>ビジネス<br/>エコシステム。",
      "hero_desc": "NexusOSスイートでワークフローを自動化し、簡単に取引を成立させます。",
      "btn_deploy": "システムを展開",
      "btn_view": "アーキテクチャを表示",
      "section_modules_title": "Nexusモジュール＆サービス",
      "section_modules_desc": "エンタープライズレベルのソフトウェアとオーダーメイドのエンジニアリング。",
      
      "prod_lead_title": "Nexus Lead Extractor",
      "prod_lead_price": "$97",
      "prod_lead_desc": "自律的なスクレイピングノードを使用して、高価値のB2Bリードを抽出します。",
      "prod_wa_title": "WhatsApp AI Booker",
      "prod_wa_price": "$147",
      "prod_wa_desc": "WhatsAppにインテリジェントな会話エージェントを展開し、予約を獲得します。",
      "prod_seo_title": "Nexus SEO Closer",
      "prod_seo_price": "$97",
      "prod_seo_desc": "数秒で包括的なSEO監査を生成し、クライアントを獲得します。",
      "prod_voice_title": "Nexus Voice Agent",
      "prod_voice_price": "$197",
      "prod_voice_desc": "最先端の音声AI。人間のようなインテリジェンスでセールスコールを処理します。",
      "prod_web_title": "Nexus Web Architecture",
      "prod_web_price": "カスタム",
      "prod_web_desc": "シネマティックなWeb開発。高コンバージョンのデジタル体験を構築します。",
      "prod_custom_title": "カスタムエンジニアリング",
      "prod_custom_price": "見積もり",
      "prod_custom_desc": "技術的な悪夢や自動化のアイデアがありますか？エリートエンジニアが構築します。",
      
      "modal_btn": "アクセスを購入",
      "modal_btn_email": "見積もりを依頼する",
      "modal_close": "閉じる",
      
      "modal_lead_pain": "まだ古い見込み客リストを買っていますか？競合他社があなたの顧客を奪っています。",
      "modal_lead_agitate": "手動で検索する時間はすべて収益の損失です。",
      "modal_lead_solve": "Nexus Lead Extractorは数秒で何千もの検証済みB2Bリードを抽出します。システムを起動して、利益が急増するのを見てください。",
      
      "modal_wa_pain": "5分以内に返信しないため、リードの60％を失っています。",
      "modal_wa_agitate": "人間の応答の遅れは売上を低下させます。あなたが寝ている間に顧客は去っていきます。",
      "modal_wa_solve": "WhatsApp AI Bookerを展開してください。24時間年中無休の営業担当者として機能し、リードを評価して会議を予約します。",
      
      "modal_seo_pain": "即座の証拠なしにSEOを売り込むのは非常に困難です。",
      "modal_seo_agitate": "クライアントは約束ではなくデータを信じます。",
      "modal_seo_solve": "Nexus SEO Closerは瞬時に見事な監査レポートを生成します。このレポートを経営者に渡せば、彼らはあなたに修正を懇願するでしょう。",
      
      "modal_voice_pain": "テレアポは時代遅れであり、営業チームを雇うのは高すぎます。",
      "modal_voice_agitate": "営業チームの管理は成長を妨げます。",
      "modal_voice_solve": "Nexus Voice Agentは何千もの電話をかけ、完全に人間のように聞こえ、会議を予約します。ソフトウェアの価格で営業力を無限に拡張します。",
      
      "modal_web_pain": "あなたの現在のウェブサイトは安っぽく見え、高額を支払うクライアントを遠ざけています。",
      "modal_web_agitate": "もしあなたのサイトが2015年の無料テンプレートのように見えたら、顧客はあなたのサービスも安っぽいと思うでしょう。印象づける時間は3秒しかありません。",
      "modal_web_solve": "Nexus Web Architectureは、シネマティックで高級なデジタル体験を構築します。すべてのピクセルに信頼と心理学を組み込みます。",
      
      "modal_custom_pain": "技術的なバグや自動化できない手動作業によってお金を失っていませんか？",
      "modal_custom_agitate": "既製のソフトウェアに頼りすぎると成長が制限されます。",
      "modal_custom_solve": "私たちのエリートエンジニアリングチームを配置してください。不可能を設計し、カスタムAIをゼロから構築します。問題を教えてください、私たちが解決策を構築します。"
    }
  },
  zh: {
    translation: {
      "nav_brand": "NexusOS",
      "nav_btn": "初始化",
      "hero_status": "系统在线 V3.0",
      "hero_title": "智能<br/>商业<br/>生态系统。",
      "hero_desc": "使用 NexusOS 高级软件套件自动化您的工作流程并毫不费力地完成交易。",
      "btn_deploy": "部署系统",
      "btn_view": "查看架构",
      "section_modules_title": "Nexus 模块与服务",
      "section_modules_desc": "专为自主扩展您的业务而设计的企业级节点和定制工程服务。",
      
      "prod_lead_title": "Nexus Lead Extractor",
      "prod_lead_price": "$97",
      "prod_lead_desc": "使用我们的自主抓取节点直接提取高价值的 B2B 潜在客户。",
      "prod_wa_title": "WhatsApp AI Booker",
      "prod_wa_price": "$147",
      "prod_wa_desc": "在 WhatsApp 上部署智能对话代理，全天候 24/7 预约。",
      "prod_seo_title": "Nexus SEO Closer",
      "prod_seo_price": "$97",
      "prod_seo_desc": "在几秒钟内生成全面的 SEO 审计，自动完成客户转化。",
      "prod_voice_title": "Nexus Voice Agent",
      "prod_voice_price": "$197",
      "prod_voice_desc": "我们最先进的语音 AI。以类似人类的智能处理销售电话。",
      "prod_web_title": "Nexus Web 架构开发",
      "prod_web_price": "定制",
      "prod_web_desc": "高端、电影级的网站开发。我们打造高转化率的数字体验。",
      "prod_custom_title": "定制工程与问题解决",
      "prod_custom_price": "报价",
      "prod_custom_desc": "遇到技术噩梦或疯狂的自动化想法？我们的精英工程师将为您构建解决方案。",
      
      "modal_btn": "购买访问权限",
      "modal_btn_email": "索取报价",
      "modal_close": "关闭",
      
      "modal_lead_pain": "还在购买过时的客户名单？您的竞争对手正在抢走您的客户。",
      "modal_lead_agitate": "您手动搜索客户的每一小时都是收入的损失。",
      "modal_lead_solve": "Nexus Lead Extractor 会在几秒钟内提取数千个经过验证的 B2B 潜在客户。只需启动系统，看着您的利润飙升。",
      
      "modal_wa_pain": "因为没有在5分钟内回复，您正在流失 60% 的潜在客户。",
      "modal_wa_agitate": "人类的延迟会扼杀销售。当您睡觉时，客户正在流失。",
      "modal_wa_solve": "部署 WhatsApp AI Booker。它作为您 24/7 的销售人员，过滤客户并自动预约会议。再也不会丢失客户。",
      
      "modal_seo_pain": "没有即时证据，推销 SEO 是非常困难的。",
      "modal_seo_agitate": "客户不相信承诺，他们只相信数据。",
      "modal_seo_solve": "Nexus SEO Closer 瞬间生成令人惊叹的审计报告。将此报告交给企业主，他们会恳求您修复他们的网站。",
      
      "modal_voice_pain": "电话推销已经过时，而且雇佣销售团队太贵了。",
      "modal_voice_agitate": "管理销售团队阻碍了您的发展。",
      "modal_voice_solve": "认识您的最佳新员工。Nexus Voice Agent 可以拨打数千个电话，听起来完全像真人，并自动预约会议。以一个软件的价格无限扩展您的销售队伍。",
      
      "modal_web_pain": "您现在的网站看起来很廉价，这正在赶走高付费的优质客户。",
      "modal_web_agitate": "在数字时代，如果您的网站看起来像2015年的免费模板，高端客户会认为您的服务也很廉价。您只有3秒钟的时间来给他们留下印象。",
      "modal_web_solve": "Nexus Web Architecture 打造具有电影感的高端数字体验。我们将信任感和转化心理学融入每一个像素。让我们改变您的数字形象，让您终于可以收取应得的高昂费用。",
      
      "modal_custom_pain": "您是否因为致命的技术错误或无法自动化的繁琐手工流程而在损失金钱？",
      "modal_custom_agitate": "仅仅依赖现成的软件会限制您的发展。如果您遇到了毁灭性的系统故障，您的企业增长就会停滞。",
      "modal_custom_solve": "部署我们的精英工程团队。无论是修复关键的基础架构、连接不可能的API，还是从零开始构建定制的AI节点，我们都能将不可能变为现实。告诉我们您的问题，我们将构建解决方案。"
    }
  }
};

const systemLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
const defaultLang = Object.keys(resources).includes(systemLang) ? systemLang : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang, // Auto-detect from system
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
