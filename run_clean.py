import re

# 1. Update App.jsx (Remove the 2 services)
app_file = 'src/App.jsx'
with open(app_file, 'r', encoding='utf-8') as f: app_content = f.read()

app_products = '''
    const products = [
      { id: 'leadscrub', icon: Shield, titleKey: 'prod_leadscrub_title', priceKey: 'prod_leadscrub_price', descKey: 'prod_leadscrub_desc' },
      { id: 'ecommatch', icon: Zap, titleKey: 'prod_ecommatch_title', priceKey: 'prod_ecommatch_price', descKey: 'prod_ecommatch_desc' },
      { id: 'contractcompare', icon: Hexagon, titleKey: 'prod_contractcompare_title', priceKey: 'prod_contractcompare_price', descKey: 'prod_contractcompare_desc' },
      { id: 'adspendaudit', icon: TrendingDown, titleKey: 'prod_adspendaudit_title', priceKey: 'prod_adspendaudit_price', descKey: 'prod_adspendaudit_desc' }
    ];
'''
app_content = re.sub(r'const products = \[\s*\{ id:.*?\];', app_products.strip(), app_content, flags=re.DOTALL)
with open(app_file, 'w', encoding='utf-8') as f: f.write(app_content)

# 2. Update ProductLanding.jsx (Remove the 2 services)
landing_file = 'src/pages/ProductLanding.jsx'
with open(landing_file, 'r', encoding='utf-8') as f: landing_content = f.read()
landing_data = '''
const productsData = {
    'leadscrub': { icon: Shield, titleKey: 'prod_leadscrub_title', priceKey: 'prod_leadscrub_price', painKey: 'modal_leadscrub_pain', agitateKey: 'modal_leadscrub_agitate', solveKey: 'modal_leadscrub_solve', link: 'https://whop.com/nexus-os-85c8/nexus-leadscrub-enterprise-license' },
    'ecommatch': { icon: Zap, titleKey: 'prod_ecommatch_title', priceKey: 'prod_ecommatch_price', painKey: 'modal_ecommatch_pain', agitateKey: 'modal_ecommatch_agitate', solveKey: 'modal_ecommatch_solve', link: 'https://whop.com/nexus-os-85c8/nexus-ecommatch-shopify-stripe-reconciliation' },
    'contractcompare': { icon: Hexagon, titleKey: 'prod_contractcompare_title', priceKey: 'prod_contractcompare_price', painKey: 'modal_contractcompare_pain', agitateKey: 'modal_contractcompare_agitate', solveKey: 'modal_contractcompare_solve', link: 'https://whop.com/nexus-os-85c8/nexus-contract-compare-nda-legal-diff-engine' },
    'adspendaudit': { icon: TrendingDown, titleKey: 'prod_adspendaudit_title', priceKey: 'prod_adspendaudit_price', painKey: 'modal_adspendaudit_pain', agitateKey: 'modal_adspendaudit_agitate', solveKey: 'modal_adspendaudit_solve', link: 'https://whop.com/nexus-os-85c8/nexus-adspend-audit-wasted-budget-detector' }
};
'''
landing_content = re.sub(r'const productsData = \{.*?^\};', landing_data.strip(), landing_content, flags=re.DOTALL|re.MULTILINE)
with open(landing_file, 'w', encoding='utf-8') as f: f.write(landing_content)
print('Fixed App and Landing')
