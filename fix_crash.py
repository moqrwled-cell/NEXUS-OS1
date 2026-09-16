with open('src/App.jsx', 'r', encoding='utf-8') as f: content = f.read()

content = content.replace('services={products}', 'services={products.map(p => t(p.titleKey))}')

with open('src/App.jsx', 'w', encoding='utf-8') as f: f.write(content)
print('Fixed React crash!')
