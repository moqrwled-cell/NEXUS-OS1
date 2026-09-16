import re
with open('src/i18n.js', 'r', encoding='utf-8') as f: content = f.read()

# Fix prices
content = content.replace('" مدى الحياة"', '"$49 مدى الحياة"')
content = content.replace('" Lifetime"', '"$49 Lifetime"')

# AdSpend should be $45
content = content.replace('"prod_adspendaudit_price": "$49 Lifetime"', '"prod_adspendaudit_price": "$45 Lifetime"')
content = content.replace('"prod_adspendaudit_price": "$49 مدى الحياة"', '"prod_adspendaudit_price": "$45 مدى الحياة"')

with open('src/i18n.js', 'w', encoding='utf-8') as f: f.write(content)
print('Fixed!')
