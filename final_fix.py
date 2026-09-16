with open('src/i18n.js', 'r', encoding='utf-8') as f: content = f.read()

en_new = r'''
      "prod_leadscrub_title": "Nexus LeadScrub",
      "prod_leadscrub_price": " Lifetime",
      "prod_leadscrub_desc": "B2B List Cleaner (Local-First). Never ruin your email deliverability again.",
      "modal_leadscrub_pain": "Are you tired of paying /mo for email verifiers just to clean your lists?",
      "modal_leadscrub_agitate": "Uploading your proprietary lead lists to third-party servers is a massive security risk. Your competitors can literally buy your leads.",
      "modal_leadscrub_solve": "Nexus LeadScrub is a completely local-first list cleaning engine. It processes hundreds of thousands of rows instantly inside your browser memory.",
      
      "prod_ecommatch_title": "Nexus EcomMatch",
      "prod_ecommatch_price": " Lifetime",
      "prod_ecommatch_desc": "Shopify & Stripe Reconciliation. Stop bleeding money and find missing payouts instantly.",
      "modal_ecommatch_pain": "E-commerce owners waste days trying to match Shopify orders with Stripe payouts on Excel.",
      "modal_ecommatch_agitate": "Did Stripe take a hidden fee? Did a payout fail? You are losing money without knowing it.",
      "modal_ecommatch_solve": "Upload your Store CSV and Gateway CSV. Our algorithm instantly finds perfect matches, mismatched amounts, and missing payouts locally.",
      
      "prod_contractcompare_title": "Nexus Contract-Compare",
      "prod_contractcompare_price": " Lifetime",
      "prod_contractcompare_desc": "NDA & Legal Diff Engine. Never miss a hidden clause again.",
      "modal_contractcompare_pain": "How do you know the other party didn't sneak a hidden clause changing your liability?",
      "modal_contractcompare_agitate": "Uploading confidential NDAs to random free cloud diff tools is a direct NDA violation. You are exposing yourself to lawsuits.",
      "modal_contractcompare_solve": "Nexus runs 100% locally. Paste the old and new contract, and it instantly exposes every single manipulated, added, or deleted word. They can't hide anything.",
      
      "prod_adspendaudit_title": "Nexus AdSpend-Audit",
      "prod_adspendaudit_price": " Lifetime",
      "prod_adspendaudit_desc": "Wasted Budget Detector. Kill unprofitable ads before they drain your bank account.",
      "modal_adspendaudit_pain": "Media buyers and agencies are actively burning your money on unprofitable Facebook/Google ads while taking their monthly cut.",
      "modal_adspendaudit_agitate": "Checking every ad set manually is impossible. Giving third-party software access to your Ad Account gives them your exact winning formulas.",
      "modal_adspendaudit_solve": "Upload your raw CSV export. Our local algorithm ruthlessly identifies budget-draining campaigns and generates a Kill List to stop the bleeding immediately."
'''

ar_new = r'''
      "prod_leadscrub_title": "مُنظف القوائم LeadScrub",
      "prod_leadscrub_price": " مدى الحياة",
      "prod_leadscrub_desc": "نظف قوائم الإيميلات الضخمة محلياً وبثوانٍ لتحافظ على قوة إرسالك.",
      "modal_leadscrub_pain": "هل تعبت من دفع اشتراكات شهرية باهظة لمواقع تنظيف الإيميلات؟",
      "modal_leadscrub_agitate": "رفع قوائم عملائك السرية لسيرفرات خارجية يعني أنك تسلم ثروتك لشركات قد تبيعها لمنافسيك.",
      "modal_leadscrub_solve": "أداة LeadScrub تعمل 100% داخل جهازك (بدون إنترنت). نظف مئات الآلاف من الإيميلات في ثوانٍ وبأمان تام واقطع الطريق على المتطفلين.",
      
      "prod_ecommatch_title": "المطابقة EcomMatch",
      "prod_ecommatch_price": " مدى الحياة",
      "prod_ecommatch_desc": "طابق طلبات متجرك (Shopify) مع دفعات (Stripe) واكتشف الأموال الضائعة.",
      "modal_ecommatch_pain": "تضييع أيام في محاولة مطابقة طلبات المتجر مع الحوالات البنكية على الإكسل.",
      "modal_ecommatch_agitate": "هل خصم البنك عمولة خفية؟ هل فشلت حوالة ولم تنتبه لها؟ بوابات الدفع تقتات بصمت على أرباحك وأنت غافل.",
      "modal_ecommatch_solve": "ارفع ملف طلبات المتجر وملف الدفعات، وخوارزميتنا ستكتشف فوراً التلاعب، النقص، والحوالات المفقودة كلياً لتعيد لك حقك.",
      
      "prod_contractcompare_title": "مقارن العقود Contract-Compare",
      "prod_contractcompare_price": " مدى الحياة",
      "prod_contractcompare_desc": "لا تفوت أي بند مخفي. قارن نسختين من أي عقد قانوني محلياً واكتشف التلاعب.",
      "modal_contractcompare_pain": "كيف تتأكد أن الطرف الآخر لم يدس بنداً خفياً يرفع الشرط الجزائي من 10 آلاف إلى 100 ألف؟",
      "modal_contractcompare_agitate": "رفع عقودك السرية والـ (NDA) لمواقع مقارنة مجانية يعرضك للمساءلة القانونية وكشف أسرار شركتك للعلن.",
      "modal_contractcompare_solve": "أداتنا تعمل 100% محلياً. ضع العقد القديم والجديد، وستفضح لك فوراً كل كلمة تم التلاعب بها، إضافتها، أو حذفها. لن يمر مكرهم عليك.",
      
      "prod_adspendaudit_title": "مدقق الإعلانات AdSpend-Audit",
      "prod_adspendaudit_price": " مدى الحياة",
      "prod_adspendaudit_desc": "اكتشف فوراً الحملات الإعلانية التي تحرق ميزانيتك بدون أي مبيعات.",
      "modal_adspendaudit_pain": "المسوقون ووكالات الإعلان يحرقون آلاف الدولارات من مالك الخاص على حملات خاسرة بينما يتقاضون رواتبهم كاملة.",
      "modal_adspendaudit_agitate": "مراجعة الحملات يدوياً مستحيل، وإعطاء صلاحيات لبرامج خارجية للتدقيق يعني تسريب خلطة مبيعاتك السرية للمنافسين.",
      "modal_adspendaudit_solve": "ارفع ملف الإعلانات (CSV)، وسنستخرج لك فوراً وبلا رحمة 'قائمة الإعدام' (Kill List) للحملات التي تبتلع أموالك لإيقاف النزيف فوراً."
'''

# We will just replace everything between 'prod_leadscrub_title' and 'form_title' in both languages!

# Find the EN block
en_start = content.find('      "prod_leadscrub_title"')
en_end = content.find('      "form_title"', en_start)
if en_start != -1 and en_end != -1:
    content = content[:en_start] + en_new.strip() + "\n\n" + content[en_end:]

# Find the AR block
ar_start = content.find('      "prod_leadscrub_title"', en_end)
ar_end = content.find('      "form_title"', ar_start)
if ar_start != -1 and ar_end != -1:
    content = content[:ar_start] + ar_new.strip() + "\n\n" + content[ar_end:]

with open('src/i18n.js', 'w', encoding='utf-8') as f: f.write(content)
print('Fixed completely')
