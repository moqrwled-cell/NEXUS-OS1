const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const productsReplacement = `  const products = [
    {
      id: 'leadscrub',
      icon: Search,
      hardcodedTitle: 'Nexus LeadScrub',
      hardcodedPrice: '$49/mo',
      hardcodedDesc: 'B2B Cold Email DNC Cleaner. Local-first in-browser processing.',
      link: 'http://localhost:3000/dashboard/leadscrub'
    },
    {
      id: 'ecommatch',
      icon: Search,
      hardcodedTitle: 'Nexus EcomMatch',
      hardcodedPrice: '$79/mo',
      hardcodedDesc: 'Shopify-Stripe Reconciliation for accountants.',
      link: 'http://localhost:3000/dashboard/ecommatch'
    },
    {
      id: 'paydiff',
      icon: Search,
      hardcodedTitle: 'Nexus PayDiff',
      hardcodedPrice: '$99/mo',
      hardcodedDesc: 'Payroll Variance Auditor for HR.',
      link: 'http://localhost:3000/dashboard/paydiff'
    },
    { id: 'searchmerge', icon: Search, hardcodedTitle: 'Nexus SearchMerge', hardcodedPrice: '$39/mo', hardcodedDesc: 'SEO Data Combiner (GSC + Ahrefs)', link: 'http://localhost:3000/dashboard/searchmerge' },
    { id: 'contractcompare', icon: Search, hardcodedTitle: 'Nexus Contract-Compare', hardcodedPrice: '$59/mo', hardcodedDesc: 'Legal Document Diff Tool', link: 'http://localhost:3000/dashboard/contractcompare' },
    { id: 'adspendaudit', icon: Search, hardcodedTitle: 'Nexus AdSpend-Audit', hardcodedPrice: '$29/mo', hardcodedDesc: 'Multi-Platform Ad Aggregator', link: 'http://localhost:3000/dashboard/adspendaudit' },
    { id: 'payoutsplit', icon: Search, hardcodedTitle: 'Nexus Payout-Split', hardcodedPrice: '$99/mo', hardcodedDesc: 'Royalties Splitter for Labels', link: 'http://localhost:3000/dashboard/payoutsplit' },
    { id: 'bankconvert', icon: Search, hardcodedTitle: 'Nexus Bank-Convert', hardcodedPrice: '$49/mo', hardcodedDesc: 'PDF Bank Statement to QBO', link: 'http://localhost:3000/dashboard/bankconvert' },
    { id: 'crmmapper', icon: Search, hardcodedTitle: 'Nexus CRM-Mapper', hardcodedPrice: '$79/mo', hardcodedDesc: 'Salesforce to HubSpot CSV Mapper', link: 'http://localhost:3000/dashboard/crmmapper' },
    { id: 'inventorysync', icon: Search, hardcodedTitle: 'Nexus Inventory-Sync', hardcodedPrice: '$59/mo', hardcodedDesc: 'Barcode vs System Matcher', link: 'http://localhost:3000/dashboard/inventorysync' },
    { id: 'reviewscrubber', icon: Search, hardcodedTitle: 'Nexus Review-Scrubber', hardcodedPrice: '$39/mo', hardcodedDesc: 'Trustpilot Sentiment Filter', link: 'http://localhost:3000/dashboard/reviewscrubber' },
    { id: 'fleetlog', icon: Search, hardcodedTitle: 'Nexus Fleet-Log', hardcodedPrice: '$89/mo', hardcodedDesc: 'GPS vs Fuel CSV Matcher', link: 'http://localhost:3000/dashboard/fleetlog' },
    { id: 'atsfilter', icon: Search, hardcodedTitle: 'Nexus ATS-Filter', hardcodedPrice: '$49/mo', hardcodedDesc: 'Resume Keyword Matcher in ZIP', link: 'http://localhost:3000/dashboard/atsfilter' },
    { id: 'subtitlesync', icon: Search, hardcodedTitle: 'Nexus Subtitle-Sync', hardcodedPrice: '$29/mo', hardcodedDesc: 'SRT Aligner for Editors', link: 'http://localhost:3000/dashboard/subtitlesync' },
    { id: 'medicalredact', icon: Search, hardcodedTitle: 'Nexus Medical-Redact', hardcodedPrice: '$99/mo', hardcodedDesc: 'Patient Name Redactor for PDF', link: 'http://localhost:3000/dashboard/medicalredact' }
  ];`;

content = content.replace(/const products = \[[\s\S]*?link: 'http:\/\/localhost:3000\/login'\s*\}\s*\];/, productsReplacement);

// Also we need to replace the rendering of these products. Let's find where they are mapped.
// t(p.titleKey) -> p.hardcodedTitle
content = content.replace(/t\(p\.titleKey\)/g, 'p.hardcodedTitle');
content = content.replace(/t\(p\.priceKey\)/g, 'p.hardcodedPrice');
content = content.replace(/t\(p\.descKey\)/g, 'p.hardcodedDesc');

// Fix the onClick of the buy button
content = content.replace(/window\.location\.href = p\.link;/g, 'window.location.href = p.link;'); // Keep it same

fs.writeFileSync(filePath, content);
console.log('Updated App.jsx with all 15 products');
