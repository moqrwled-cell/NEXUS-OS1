import os
import re

filepath = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\src\pages\Login.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = """
    try {
      const response = await fetch('/.netlify/functions/validate-key', {
        method: 'POST',
        body: JSON.stringify({ licenseKey })
      });
      
      const data = await response.json();

      if (response.ok && data.valid) {
        localStorage.setItem("nexus_license", licenseKey);
        navigate("/app/leadscrub");
      } else {
        setError(data.error || (isRtl ? "كود التفعيل غير صحيح أو منتهي الصلاحية." : "Invalid or expired license key."));
      }
    } catch (err) {
      setError(isRtl ? "حدث خطأ في الاتصال بخادم التحقق." : "Server error.");
    } finally {
      setIsLoading(false);
    }
"""

# Replace the old try block
content = re.sub(r'try \{[\s\S]*?\} catch \(err\) \{[\s\S]*?\} finally \{[\s\S]*?\}', new_logic.strip(), content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Login.jsx with real API validation.")
