import re

with open('src/i18n.js', 'r', encoding='utf-8') as f: content = f.read()

ar_new = '''
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

# Find the start of AR translations
ar_start = content.find('translation: {', content.find('ar: {'))
if ar_start != -1:
    ar_trans_start = ar_start + 14
    ar_trans_end = content.find('"form_title"', ar_trans_start)
    if ar_trans_end != -1:
        # We will replace everything between 'translation: {' and '"form_title"'
        # Wait, there are other keys like "nav_brand", "hero_status", etc. at the top of the AR block!
        # The products start at "section_modules_desc"
        prod_start = content.find('"prod_leadscrub_title"', ar_trans_start)
        if prod_start == -1: prod_start = content.find('"prod_leadscrub_price"', ar_trans_start) # just in case
        
        # If we can't easily find it, let's just do a regex replace for the entire AR products block.
        pass

# Let's use regex to replace all 'prod_...' and 'modal_...' keys in the AR block before 'form_title'
ar_block_start = content.find('ar: {')
ar_block_end = content.find('"form_title"', ar_block_start)

old_ar_block = content[ar_block_start:ar_block_end]
# We want to keep everything up to "section_modules_desc", and then insert our new copy
marker = '"section_modules_desc": "أدوات متطورة، محلية، وآمنة لشركتك.",\\n'
if marker not in old_ar_block:
    marker = '"section_modules_desc": "??????? ?????? ????? ??? ??????? ????? ???????.",\\n'

marker_pos = old_ar_block.find(marker)
if marker_pos != -1:
    new_ar_block = old_ar_block[:marker_pos + len(marker)] + "\\n" + ar_new.strip() + "\\n\\n      "
    content = content[:ar_block_start] + new_ar_block + content[ar_block_end:]
else:
    # fallback, just inject it right before form_title and delete old ones
    # actually let's just do it manually with python replace
    pass

with open('src/i18n.js', 'w', encoding='utf-8') as f: f.write(content)
