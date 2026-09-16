with open('src/i18n.js', 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('\\\\n\\\\n', '\\n\\n')
with open('src/i18n.js', 'w', encoding='utf-8') as f: f.write(content)
print('Fixed backslashes!')
