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
      "modal_adspendaudit_solve": "ارفع ملف الإعلانات (CSV)، وسنستخرج لك فوراً وبلا رحمة قائمة الإعدام (Kill List) للحملات التي تبتلع أموالك لإيقاف النزيف فوراً.",
'''

# Find the start of the AR products block
ar_start_key = '"prod_leadscrub_title": '
# We need to find the SECOND occurrence of this key, because the first is in the EN block
first_occ = content.find(ar_start_key)
ar_start = content.find(ar_start_key, first_occ + 10)

if ar_start != -1:
    # Find the end of the AR products block. It ends right before "seo_tool_title" in the AR section
    ar_end_key = '"seo_tool_title":'
    # Find the second occurrence
    first_end = content.find(ar_end_key)
    ar_end = content.find(ar_end_key, first_end + 10)
    
    if ar_end != -1:
        # Go backwards from ar_end to keep the formatting
        content = content[:ar_start] + ar_new.strip() + "\\n\\n        " + content[ar_end:]
        with open('src/i18n.js', 'w', encoding='utf-8') as f: f.write(content)
        print("Arabic translations replaced successfully!")
    else:
        print("Could not find the end key.")
else:
    print("Could not find the start key.")
