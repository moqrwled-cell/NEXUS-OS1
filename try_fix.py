import re

with open('src/i18n.js', 'r', encoding='utf-8') as f: content = f.read()

# Fix English outreach msg
en_bad = '''"seo_outreach_msg": "Hi there,
  
  I was browsing your website ({{url}}) and noticed a critical issue affecting your revenue.\\nI ran a deep technical audit and discovered that Google is actively penalizing your site due to hidden structural errors! 🚨
  
  Performance Score: {{perf}}/100\\nSEO Score: {{seo}}/100
  
  I've attached a detailed PDF report proving this. These errors are causing you to lose potential clients to competitors every day.
  
  I am an enterprise systems engineer, and I can fix this infrastructure immediately.
  
  Let me know when you review the attached report so we can stop the bleeding.",'''

en_good = '"seo_outreach_msg": "Hi there,\\n\\nI was browsing your website ({{url}}) and noticed a critical issue affecting your revenue.\\nI ran a deep technical audit and discovered that Google is actively penalizing your site due to hidden structural errors! 🚨\\n\\nPerformance Score: {{perf}}/100\\nSEO Score: {{seo}}/100\\n\\nI\'ve attached a detailed PDF report proving this. These errors are causing you to lose potential clients to competitors every day.\\n\\nI am an enterprise systems engineer, and I can fix this infrastructure immediately.\\n\\nLet me know when you review the attached report so we can stop the bleeding.",'

content = content.replace(en_bad, en_good)

# The Arabic one is completely garbled in the terminal, so I'll use regex to fix all multi-line strings in i18n.js
# Or better yet, we can just replace actual newlines with '\\n' for any line inside a double quoted string that didn't close.
# But regex for that is hard.

# Since we know the exact text of the Arabic one (I can see it from earlier when the file was good), I'll just restore the whole file from before my bad python script and re-apply just the AR/EN product blocks carefully.
