import re

# Fix App.jsx
app_file = 'src/App.jsx'
with open(app_file, 'r', encoding='utf-8') as f: app_content = f.read()

lucide_import_pattern = r'import \{([^}]+)\} from \'lucide-react\';'
match = re.search(lucide_import_pattern, app_content)
if match:
    existing_icons = match.group(1)
    needed = ['Shield', 'Zap', 'Hexagon', 'TrendingDown', 'Monitor', 'Briefcase']
    for icon in needed:
        if icon not in existing_icons:
            existing_icons += f', {icon}'
    new_import = f"import {{{existing_icons}}} from 'lucide-react';"
    app_content = app_content[:match.start()] + new_import + app_content[match.end():]
    with open(app_file, 'w', encoding='utf-8') as f: f.write(app_content)

# Fix ProductLanding.jsx
landing_file = 'src/pages/ProductLanding.jsx'
with open(landing_file, 'r', encoding='utf-8') as f: landing_content = f.read()
match = re.search(lucide_import_pattern, landing_content)
if match:
    existing_icons = match.group(1)
    needed = ['Shield', 'Zap', 'Hexagon', 'TrendingDown', 'Monitor', 'Briefcase']
    for icon in needed:
        if icon not in existing_icons:
            existing_icons += f', {icon}'
    new_import = f"import {{{existing_icons}}} from 'lucide-react';"
    landing_content = landing_content[:match.start()] + new_import + landing_content[match.end():]
    with open(landing_file, 'w', encoding='utf-8') as f: f.write(landing_content)
print('Fixed imports!')
