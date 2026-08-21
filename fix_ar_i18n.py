import os

filepath = r"C:\Users\lenovo\Desktop\شغل محمد\منتج الرقمي\nexus-os-landing\src\i18n.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

arKeys = """
        "prod_leadscrub_title": "Nexus LeadScrub",
        "prod_leadscrub_price": "$49/شهرياً",
        "prod_leadscrub_desc": "أداة تنظيف إيميلات وكالات التسويق. قم بتنظيف ملايين الإيميلات المحظورة (DNC) محلياً بدون رفع بيانات عملائك للسحابة.",
        
        "prod_ecommatch_title": "Nexus EcomMatch",
        "prod_ecommatch_price": "$79/شهرياً",
        "prod_ecommatch_desc": "مطابقة تقارير شوبيفاي مع سترايب للمحاسبين. وفر ساعات من العمل اليدوي ومطابقة آمنة بنسبة 100%.",
        
        "prod_paydiff_title": "Nexus PayDiff",
        "prod_paydiff_price": "$99/شهرياً",
        "prod_paydiff_desc": "مقارنة الرواتب لشركات الـ HR. اكتشف أي تغير في الرواتب بضغطة زر مع ضمان سرية معلومات الموظفين.",
        
        "prod_searchmerge_title": "Nexus SearchMerge",
        "prod_searchmerge_price": "$39/شهرياً",
        "prod_searchmerge_desc": "أداة لدمج بيانات SEO (GSC و Ahrefs) للمسوقين.",
        
        "prod_contractcompare_title": "Nexus Contract-Compare",
        "prod_contractcompare_price": "$59/شهرياً",
        "prod_contractcompare_desc": "أداة مقارنة العقود القانونية للمحامين، آمنة ومحلية.",
        
        "prod_adspendaudit_title": "Nexus AdSpend-Audit",
        "prod_adspendaudit_price": "$29/شهرياً",
        "prod_adspendaudit_desc": "دمج تقارير إعلانات فيسبوك وجوجل محلياً.",
        
        "prod_payoutsplit_title": "Nexus Payout-Split",
        "prod_payoutsplit_price": "$99/شهرياً",
        "prod_payoutsplit_desc": "توزيع أرباح الفنانين لشركات الإنتاج الموسيقي.",
        
        "prod_bankconvert_title": "Nexus Bank-Convert",
        "prod_bankconvert_price": "$49/شهرياً",
        "prod_bankconvert_desc": "تحويل الكشوفات البنكية من PDF إلى CSV محلياً.",
        
        "prod_crmmapper_title": "Nexus CRM-Mapper",
        "prod_crmmapper_price": "$79/شهرياً",
        "prod_crmmapper_desc": "مطابقة داتا Salesforce مع HubSpot لنقل البيانات.",
        
        "prod_inventorysync_title": "Nexus Inventory-Sync",
        "prod_inventorysync_price": "$59/شهرياً",
        "prod_inventorysync_desc": "مطابقة الجرد والمخازن لاكتشاف النواقص.",
        
        "prod_reviewscrubber_title": "Nexus Review-Scrubber",
        "prod_reviewscrubber_price": "$39/شهرياً",
        "prod_reviewscrubber_desc": "فلترة وتحليل تقييمات Trustpilot بسرعة فائقة.",
        
        "prod_fleetlog_title": "Nexus Fleet-Log",
        "prod_fleetlog_price": "$89/شهرياً",
        "prod_fleetlog_desc": "مطابقة استهلاك الوقود مع GPS لشركات الشحن.",
        
        "prod_atsfilter_title": "Nexus ATS-Filter",
        "prod_atsfilter_price": "$49/شهرياً",
        "prod_atsfilter_desc": "فلترة السير الذاتية بالكلمات المفتاحية محلياً.",
        
        "prod_subtitlesync_title": "Nexus Subtitle-Sync",
        "prod_subtitlesync_price": "$29/شهرياً",
        "prod_subtitlesync_desc": "مطابقة وتصحيح توقيتات الترجمة (SRT).",
        
        "prod_medicalredact_title": "Nexus Medical-Redact",
        "prod_medicalredact_price": "$99/شهرياً",
        "prod_medicalredact_desc": "حذف أسماء المرضى من التقارير الطبية بسرية تامة.",
"""

# Find the Arabic section and inject
import re

# We will look for "section_modules_desc": "..." inside the ar: block.
# Since the exact arabic text might be encoded differently, we use a regex to match the key itself.
# We replace the FIRST occurrence of "section_modules_desc" after "ar:"
parts = content.split("ar: {")
if len(parts) > 1:
    sub_parts = re.split(r'("section_modules_desc":\s*"[^"]*",)', parts[1], maxsplit=1)
    if len(sub_parts) == 3:
        new_ar_section = sub_parts[0] + sub_parts[1] + "\n" + arKeys + sub_parts[2]
        new_content = parts[0] + "ar: {" + new_ar_section
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Arabic keys injected successfully!")
    else:
        print("Failed to find section_modules_desc in Arabic section")
else:
    print("Failed to find ar: section")
