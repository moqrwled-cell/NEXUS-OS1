import os
import re

filepath = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\src\i18n.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Hero texts in Arabic section
# We will just do a simple replace on the known arabic strings
content = content.replace('"hero_status": "النظام يعمل - الإصدار 3.0"', '"hero_status": "النظام يعمل - الإصدار 4.0 - بنية تحتية مجانية"')
content = content.replace('"hero_title": "النظام البيئي<br/>الذكي<br/>للأعمال."', '"hero_title": "أدوات محلية<br/>قوية<br/>لشركات B2B."')
content = content.replace('"hero_desc": "أتمت سير عملك، استخرج بيانات حيوية، وأغلق صفقاتك بكل سهولة مع حزمة NexusOS البرمجية المتطورة."', '"hero_desc": "عالج بيانات شركتك والـ B2B بسرية تامة 100% وبدون الحاجة لرفعها للسحابة. أنظمة تعمل بالكامل داخل متصفحك لتوفير آلاف الدولارات."')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Hero text updated!")
