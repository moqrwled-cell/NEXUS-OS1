import re

with open('src/i18n.js', 'r', encoding='utf-8') as f: content = f.read()

# Fix the missing comma in EN block
content = content.replace('bleeding immediately."\n\n      "form_title"', 'bleeding immediately.",\n\n      "form_title"')

# Find where the old AR products start and end
# The AR products start right after "section_modules_desc": "..."
# And end right before "form_title": "تواصل مع NexusOS"
ar_start_marker = '"section_modules_desc": "'
ar_end_marker = '"form_title": "'

first_mod = content.find(ar_start_marker)
second_mod = content.find(ar_start_marker, first_mod + 10)

first_form = content.find(ar_end_marker)
second_form = content.find(ar_end_marker, first_form + 10)

ar_new = '''      "prod_leadscrub_title": "مُنظف القوائم LeadScrub",
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
      "modal_adspendaudit_solve": "ارفع ملف الإعلانات (CSV)، وسنستخرج لك فوراً وبلا رحمة 'قائمة الإعدام' (Kill List) للحملات التي تبتلع أموالك لإيقاف النزيف فوراً.",
'''

# The end of the "section_modules_desc" line:
ar_start = content.find('",', second_mod) + 2
# We want to replace from ar_start to second_form
content = content[:ar_start] + '\n\n' + ar_new + '\n      ' + content[second_form:]

with open('src/i18n.js', 'w', encoding='utf-8') as f: f.write(content)
print('Fixed completely')
