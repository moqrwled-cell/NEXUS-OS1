with open('src/App.jsx', 'r', encoding='utf-8') as f: content = f.read()
if '/* Force Netlify Build Trigger */' not in content:
    content = content.replace('export default function App() {', 'export default function App() {\n  /* Force Netlify Build Trigger */')
    with open('src/App.jsx', 'w', encoding='utf-8') as f: f.write(content)
