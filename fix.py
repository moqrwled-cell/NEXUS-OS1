import os
files = ['src/pages/LeadScrub.jsx', 'src/pages/EcomMatch.jsx', 'src/pages/ContractCompare.jsx', 'src/pages/AdSpendAudit.jsx']
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(r\"\'lucide-react\'\", \"'lucide-react'\")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
