const translations = {
    en: {
        welcome: "<strong>SYSTEM ONLINE</strong><br><br>The Elite AI Campaign Builder. Generating high-converting assets using Quantum AI networks.",
        title: "Campaign Architecture",
        subtitle: "Define your parameters to engineer the perfect marketing campaign. Neural network ready.",
        labelProduct: "Product or Service Name",
        labelDesc: "Target Audience & Value Proposition",
        labelType: "Marketing Asset Type",
        optAds: "Facebook & Google Ads Masterclass",
        optEmail: "High-Converting Cold Email Sequence",
        optSocial: "Viral 30-Day Social Media Strategy",
        optSeo: "SEO Blog Post & Content Strategy",
        btnGenerate: "INITIALIZE AI GENERATION",
        loading: "Establishing neural link... engineering master plan...",
        resultTitle: "GENERATED ASSETS",
        errInput: "ERROR: Parameters missing. Fill all fields to proceed."
    },
    ar: {
        welcome: "<strong>النظام متصل</strong><br><br>صانع الحملات الذكي. يتم توليد الأصول التسويقية عبر شبكات الذكاء الاصطناعي المتقدمة.",
        title: "هندسة الحملات التسويقية",
        subtitle: "حدد معايير مشروعك لنقوم بهندسة حملتك المثالية. الشبكة العصبية جاهزة.",
        labelProduct: "اسم المنتج أو الخدمة",
        labelDesc: "الجمهور المستهدف والقيمة المقدمة",
        labelType: "نوع الحملة التسويقية",
        optAds: "نصوص إعلانات فيسبوك وجوجل المتقدمة",
        optEmail: "سلسلة إيميلات مبيعات عالية التحويل",
        optSocial: "استراتيجية سوشيال ميديا لـ 30 يوماً",
        optSeo: "خطة كتابة مقالات متوافقة مع SEO",
        btnGenerate: "بدء التوليد الذكي",
        loading: "جاري الاتصال بالشبكة العصبية... يتم بناء الخطة...",
        resultTitle: "الأصول المولدة",
        errInput: "خطأ: المعطيات ناقصة. الرجاء تعبئة جميع الحقول."
    },
    es: {
        welcome: "<strong>SISTEMA EN LÍNEA</strong><br><br>Constructor de campañas impulsado por redes neuronales.",
        title: "Arquitectura de Campaña",
        subtitle: "Define tus parámetros para diseñar la campaña perfecta.",
        labelProduct: "Nombre del Producto/Servicio",
        labelDesc: "Público Objetivo y Propuesta de Valor",
        labelType: "Tipo de Campaña",
        optAds: "Anuncios de Facebook y Google",
        optEmail: "Secuencia de Correos de Alta Conversión",
        optSocial: "Estrategia Viral de Redes (30 Días)",
        optSeo: "Estrategia de SEO y Blog",
        btnGenerate: "INICIALIZAR IA",
        loading: "Estableciendo enlace neuronal... diseñando plan...",
        resultTitle: "ACTIVOS GENERADOS",
        errInput: "ERROR: Faltan parámetros."
    },
    fr: {
        welcome: "<strong>SYSTÈME EN LIGNE</strong><br><br>Constructeur de campagnes propulsé par réseaux de neurones.",
        title: "Architecture de Campagne",
        subtitle: "Définissez vos paramètres pour créer la campagne parfaite.",
        labelProduct: "Nom du Produit/Service",
        labelDesc: "Public Cible et Proposition de Valeur",
        labelType: "Type de Campagne",
        optAds: "Publicités Facebook et Google",
        optEmail: "Séquence d'E-mails Haute Conversion",
        optSocial: "Stratégie Réseaux Sociaux (30 Jours)",
        optSeo: "Stratégie SEO et Blog",
        btnGenerate: "INITIALISER L'IA",
        loading: "Établissement du lien neuronal... création du plan...",
        resultTitle: "ACTIFS GÉNÉRÉS",
        errInput: "ERREUR : Paramètres manquants."
    },
    de: {
        welcome: "<strong>SYSTEM ONLINE</strong><br><br>Kampagnen-Builder, angetrieben von neuronalen Netzwerken.",
        title: "Kampagnen-Architektur",
        subtitle: "Definieren Sie Ihre Parameter für die perfekte Kampagne.",
        labelProduct: "Produkt-/Dienstleistungsname",
        labelDesc: "Zielgruppe & Wertversprechen",
        labelType: "Kampagnentyp",
        optAds: "Facebook & Google Ads",
        optEmail: "Cold-Email-Sequenz (Hohe Konversion)",
        optSocial: "30-Tage Social-Media-Strategie",
        optSeo: "SEO Blog-Strategie",
        btnGenerate: "KI INITIALISIEREN",
        loading: "Neuronale Verbindung wird hergestellt... Plan wird erstellt...",
        resultTitle: "GENERIERTE ASSETS",
        errInput: "FEHLER: Fehlende Parameter."
    }
};

let currentLang = 'en';

function toggleTheme() {
    const body = document.body;
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function changeLanguage() {
    currentLang = document.getElementById('langSelect').value;
    const t = translations[currentLang];
    
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    document.getElementById('t-welcome').innerHTML = t.welcome;
    document.getElementById('t-title').innerText = t.title;
    document.getElementById('t-subtitle').innerText = t.subtitle;
    document.getElementById('t-labelProduct').innerText = t.labelProduct;
    document.getElementById('t-labelDesc').innerText = t.labelDesc;
    document.getElementById('t-labelType').innerText = t.labelType;
    document.getElementById('t-optAds').innerText = t.optAds;
    document.getElementById('t-optEmail').innerText = t.optEmail;
    document.getElementById('t-optSocial').innerText = t.optSocial;
    document.getElementById('t-optSeo').innerText = t.optSeo;
    document.getElementById('t-btnGenerate').innerText = t.btnGenerate;
    document.getElementById('loadingSpinner').innerText = t.loading;
    document.getElementById('t-resultTitle').innerText = t.resultTitle;
}

async function generateCampaign() {
    const productName = document.getElementById('productName').value.trim();
    const productDesc = document.getElementById('productDesc').value.trim();
    const campaignType = document.getElementById('campaignType').value;
    const t = translations[currentLang];
    
    const btn = document.getElementById('generateBtn');
    const spinner = document.getElementById('loadingSpinner');
    const resultArea = document.getElementById('resultArea');
    const resultText = document.getElementById('resultText');

    if (!productName || !productDesc) return alert(t.errInput);

    btn.disabled = true;
    spinner.style.display = 'block';
    resultArea.style.display = 'none';
    resultText.innerHTML = '';

    const langInstructions = {
        en: "Respond entirely in English. Format beautifully with markdown.",
        ar: "أجب باللغة العربية حصراً وبشكل احترافي. استخدم التنسيق (Markdown).",
        es: "Responde completamente en Español usando formato Markdown.",
        fr: "Répondez entièrement en Français avec un formatage Markdown.",
        de: "Antworten Sie vollständig auf Deutsch mit Markdown-Formatierung."
    };

    const prompts = {
        ads: `You are an elite copywriter. Product: "${productName}", Description: "${productDesc}".
Write 3 variations of highly engaging Facebook Ads using the PAS framework. ${langInstructions[currentLang]}`,
        email: `You are an elite B2B Sales Executive. Product: "${productName}", Description: "${productDesc}".
Write a 3-day cold email sequence. Short, punchy, value-add. ${langInstructions[currentLang]}`,
        social: `You are a viral Social Media Strategist. Product: "${productName}", Description: "${productDesc}".
Create a detailed 7-day content calendar for LinkedIn and Twitter. ${langInstructions[currentLang]}`,
        seo: `You are a Master SEO Strategist. Product: "${productName}", Description: "${productDesc}".
Write a highly optimized SEO blog post outline and an engaging introduction. ${langInstructions[currentLang]}`
    };

    try {
        const apiKey = document.getElementById('apiKey').value.trim();
        if (!apiKey) {
            alert(lang === 'ar' ? 'الرجاء إدخال مفتاح OpenAI أولاً' : 'Please enter your OpenAI API Key first.');
            btn.disabled = false;
            btn.innerHTML = originalText;
            spinner.style.display = 'none';
            return;
        }

        const systemPrompt = "You are AutoMarketer Pro AI. Provide highly advanced marketing output in markdown.";
        const fullPrompt = systemPrompt + "\n\n" + prompts[campaignType];
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompts[campaignType] }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || "Invalid API Key or OpenAI Error.");
            }

            const data = await response.json();
            resultText.innerText = data.choices[0].message.content;
            resultArea.style.display = 'block';
        } catch (e) {
            alert("System Error: " + e.message);
        }

    } catch (error) {
        alert("System Error: " + error.message);
    } finally {
        btn.disabled = false;
        spinner.style.display = 'none';
    }
}
