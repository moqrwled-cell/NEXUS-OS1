import os

filepath = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\src\main.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports if they don't exist
if "import Login" not in content:
    content = content.replace("import App from './App.jsx'", "import App from './App.jsx'\nimport Login from './pages/Login.jsx'\nimport LeadScrub from './pages/LeadScrub.jsx'")

# Add routes
if "/login" not in content:
    content = content.replace('<Route path="/" element={<App />} />', '<Route path="/" element={<App />} />\n          <Route path="/login" element={<Login />} />\n          <Route path="/app/leadscrub" element={<LeadScrub />} />')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated main.jsx with new routes.")
