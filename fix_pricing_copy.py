import os

filepath = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\src\pages\ProductLanding.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the amateur text with professional B2B text
old_header = "{isRtl ? 'استثمارك لمرة واحدة' : 'One-Time Investment'}"
new_header = "{isRtl ? 'رخصة الاستخدام (بدون حدود)' : 'UNLIMITED ENTERPRISE LICENSE'}"
content = content.replace(old_header, new_header)

old_strike = "{!product.isCustom && <span className=\"text-gray-500 line-through text-xl\">$997</span>}"
new_strike = "{!product.isCustom && <span className=\"text-gray-500 text-sm mx-2\">{isRtl ? 'بدلاً من الدفع لكل عملية (Pay-per-credit)' : 'vs. pay-per-credit'}</span>}"
content = content.replace(old_strike, new_strike)

old_badge = "{isRtl ? '🔥 خصم خاص متاح اليوم فقط' : '🔥 Special Discount Available Today'}"
new_badge = "{isRtl ? '✓ يتم المعالجة محلياً - 0% رفع للسحابة' : '✓ Processed Locally - 0% Cloud Uploads'}"
content = content.replace(old_badge, new_badge)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Professional B2B pricing UI injected.")
