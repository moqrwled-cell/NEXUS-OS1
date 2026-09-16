with open('src/i18n.js', 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('immediately."\n', 'immediately.",\n')
content = content.replace('النزيف فوراً.",\n', 'النزيف فوراً.",\n') # wait, did I put a comma in the Arabic one?
with open('src/i18n.js', 'w', encoding='utf-8') as f: f.write(content)
print('Fixed commas!')
