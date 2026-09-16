import re

landing_file = 'src/pages/ProductLanding.jsx'
with open(landing_file, 'r', encoding='utf-8') as f: content = f.read()

# Add import if missing
if 'ContactModal' not in content:
    content = content.replace("import { ArrowRight", "import ContactModal from '../components/ContactModal';\nimport { ArrowRight")

# Add state
if 'isContactOpen' not in content:
    content = content.replace("const product = productsData[productId];", "const product = productsData[productId];\n  const [isContactOpen, setIsContactOpen] = React.useState(false);")

# Update the button
old_button = '''
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full flex items-center justify-center gap-3 bg-nexus-emerald text-black py-4 rounded-2xl font-bold text-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,157,0.4)] mb-4"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {product.isService ? (isRtl ? 'تواصل معنا للحصول على عرض سعر' : 'Contact Us for a Quote') : (isRtl ? 'احصل على الترخيص الآن' : 'Get Full Lifetime Access')}
                  </span>
                </a>
'''

new_button = '''
                {product.isService ? (
                  <button 
                    onClick={() => setIsContactOpen(true)}
                    className="group relative w-full flex items-center justify-center gap-3 bg-nexus-emerald text-black py-4 rounded-2xl font-bold text-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,157,0.4)] mb-4"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isRtl ? 'تواصل معنا للحصول على عرض سعر' : 'Contact Us for a Quote'}
                    </span>
                  </button>
                ) : (
                  <a 
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-full flex items-center justify-center gap-3 bg-nexus-emerald text-black py-4 rounded-2xl font-bold text-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,157,0.4)] mb-4"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isRtl ? 'احصل على الترخيص الآن' : 'Get Full Lifetime Access'}
                    </span>
                  </a>
                )}
'''
# We must use regex because spacing might differ
content = re.sub(r'<a\s*href=\{product.link\}.*?</a>', new_button.strip(), content, flags=re.DOTALL)

# Inject the modal rendering before the last closing div
modal_render = '''
      {product.isService && (
        <ContactModal 
          isOpen={isContactOpen} 
          onClose={() => setIsContactOpen(false)} 
          services={[t(product.titleKey)]} 
        />
      )}
    </div>
'''
content = content.replace("    </div>\n  );\n}", modal_render + "  );\n}")

# Make sure React is imported for React.useState
if 'import React' not in content:
    content = "import React from 'react';\n" + content

with open(landing_file, 'w', encoding='utf-8') as f: f.write(content)
print('Updated ProductLanding.jsx successfully')
