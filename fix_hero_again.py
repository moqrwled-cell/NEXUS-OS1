import os

filepath = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\src\i18n.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the hero text to remove "بنية تحتية مجانية"
content = content.replace('"hero_status": "النظام يعمل - الإصدار 4.0 - بنية تحتية مجانية"', '"hero_status": "النظام يعمل - الإصدار 4.0 - Local-First Architecture"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed the free infrastructure text.")
