app_file = 'src/App.jsx'
landing_file = 'src/pages/ProductLanding.jsx'

with open(app_file, 'r', encoding='utf-8') as f: app_content = f.read()
app_content = app_content.replace('isService: True', 'isService: true')
with open(app_file, 'w', encoding='utf-8') as f: f.write(app_content)

with open(landing_file, 'r', encoding='utf-8') as f: landing_content = f.read()
landing_content = landing_content.replace('isService: True', 'isService: true')
with open(landing_file, 'w', encoding='utf-8') as f: f.write(landing_content)
print('Fixed True to true!')
