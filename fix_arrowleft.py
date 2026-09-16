import os

files = [
    'src/pages/EcomMatch.jsx',
    'src/pages/ContractCompare.jsx',
    'src/pages/AdSpendAudit.jsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f: content = f.read()
    
    if 'ArrowLeft' not in content[:content.find(';')]:
        # replace the first 'import { ' with 'import { ArrowLeft, '
        content = content.replace("import {", "import { ArrowLeft,", 1)
        with open(file, 'w', encoding='utf-8') as f: f.write(content)

print('Fixed ArrowLeft imports in tools!')
