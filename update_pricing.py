import sys

filepath = 'src/i18n.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace English
content = content.replace('"$49/mo"', '"$49 Lifetime"')
content = content.replace('"$79/mo"', '"$79 Lifetime"')
content = content.replace('"$99/mo"', '"$99 Lifetime"')

# Replace Arabic
content = content.replace('"$49/شهرياً"', '"$49 مدى الحياة"')
content = content.replace('"$79/شهرياً"', '"$79 مدى الحياة"')
content = content.replace('"$99/شهرياً"', '"$99 مدى الحياة"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Pricing updated to Lifetime successfully.")
