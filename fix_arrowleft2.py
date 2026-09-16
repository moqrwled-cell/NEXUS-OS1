import os

files = [
    'src/pages/EcomMatch.jsx',
    'src/pages/ContractCompare.jsx',
    'src/pages/AdSpendAudit.jsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f: content = f.read()
    
    # Revert bad insertion
    content = content.replace("import { ArrowLeft, useNavigate }", "import { useNavigate }")
    content = content.replace("import { ArrowLeft, useState", "import { useState")
    
    # Inject into lucide-react correctly
    content = content.replace("} from 'lucide-react';", ", ArrowLeft } from 'lucide-react';")
    
    with open(file, 'w', encoding='utf-8') as f: f.write(content)

print('Fixed properly!')
