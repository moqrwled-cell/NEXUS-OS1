const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = "c:\\Users\\lenovo\\Desktop\\شغل محمد\\منتج الرقمي\\NexusOS_Products_To_Sell";

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// The beautiful branded HTML template for the client instructions
const getHtmlTemplate = (title, icon, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusOS | ${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;600&display=swap');
        body { background-color: #020608; color: #fff; font-family: 'Barlow', sans-serif; }
        h1, h2, h3 { font-family: 'Instrument Serif', serif; }
        .glass-panel {
            background: rgba(4, 11, 14, 0.8);
            border: 1px solid rgba(0, 255, 157, 0.2);
            box-shadow: 0 4px 30px rgba(0, 255, 157, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
        }
        .text-emerald { color: #00FF9D; }
        .text-cyan { color: #00F0FF; }
        .bg-emerald { background-color: #00FF9D; color: #000; }
    </style>
</head>
<body class="min-h-screen p-8 flex justify-center">
    <div class="max-w-4xl w-full">
        <header class="flex items-center gap-4 mb-12 border-b border-gray-800 pb-6">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-3xl" style="background: linear-gradient(135deg, #00FF9D, #00F0FF); color: black;">
                ${icon}
            </div>
            <div>
                <p class="text-emerald text-sm uppercase tracking-widest mb-1">NexusOS Enterprise System</p>
                <h1 class="text-4xl text-white">${title}</h1>
            </div>
        </header>
        
        <main class="space-y-8">
            ${content}
        </main>

        <footer class="mt-20 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; 2026 NexusOS. All systems operational. Unauthorized distribution prohibited.
        </footer>
    </div>
</body>
</html>
`;

const products = [
    {
        folder: "Nexus_Lead_Extractor",
        title: "Lead Extractor Node",
        icon: "🎯",
        htmlContent: `
            <div class="glass-panel p-8">
                <h2 class="text-2xl text-emerald mb-4">1. Initialize the Engine</h2>
                <p class="text-gray-300 mb-4">Go to <strong>Apify.com</strong> and search for the 'Google Maps Scraper' tool in the store.</p>
                
                <h2 class="text-2xl text-emerald mb-4 mt-8">2. Configuration Settings</h2>
                <p class="text-gray-300 mb-4">Use the exact JSON configuration provided in this folder (<code>apify_config.json</code>) to ensure high-quality lead extraction.</p>
                
                <h2 class="text-2xl text-emerald mb-4 mt-8">3. Cold Outreach</h2>
                <p class="text-gray-300 mb-4">We have included a highly converting cold email template in <code>cold_email_template.txt</code>. Use this to contact your extracted leads.</p>
            </div>
        `,
        files: {
            "apify_config.json": '{\n  "searchTerms": ["B2B SaaS Companies"],\n  "maxPlacesPerSearch": 500,\n  "extractEmailsAndContacts": true\n}',
            "cold_email_template.txt": "Subject: Quick question regarding [Company]...\n\nHi [Name],\n\nI noticed your reviews are fantastic, but you might be missing out on automated lead capture.\nWe build autonomous systems at NexusOS. Open to a 5-min chat?\n\nBest,\n[Your Name]"
        }
    },
    {
        folder: "WhatsApp_AI_Booker",
        title: "WhatsApp AI Agent",
        icon: "💬",
        htmlContent: `
            <div class="glass-panel p-8">
                <h2 class="text-2xl text-emerald mb-4">1. The Brain (Make.com)</h2>
                <p class="text-gray-300 mb-4">We have provided the exact system logic in the <code>blueprint.json</code> file. Go to Make.com, create a new scenario, click the three dots at the bottom, and select <strong>Import Blueprint</strong>. Upload the JSON file.</p>
                
                <h2 class="text-2xl text-emerald mb-4 mt-8">2. AI Personality</h2>
                <p class="text-gray-300 mb-4">Open the <code>system_prompt.txt</code> file included in this folder. Paste it into your OpenAI module inside Make.com.</p>
            </div>
        `,
        files: {
            "blueprint.json": '{\n  "name": "NexusOS WhatsApp Booker",\n  "flow": [\n    {"id": 1, "module": "manychat:watchMessages"},\n    {"id": 2, "module": "openai:createCompletion"},\n    {"id": 3, "module": "manychat:sendMessage"}\n  ]\n}',
            "system_prompt.txt": "You are an elite booking assistant. Your goal is to qualify the lead and get them to book a meeting via Calendly. Keep answers under 3 sentences."
        }
    },
    {
        folder: "Nexus_SEO_Closer",
        title: "SEO Auditing System",
        icon: "📈",
        htmlContent: `
            <div class="glass-panel p-8">
                <h2 class="text-2xl text-emerald mb-4">1. Audit Generation</h2>
                <p class="text-gray-300 mb-4">Use a tool like SEOptimer. Generate the PDF report and add your branding.</p>
                
                <h2 class="text-2xl text-emerald mb-4 mt-8">2. The Trojan Horse Method</h2>
                <p class="text-gray-300 mb-4">Use the strategy detailed in <code>sales_strategy.txt</code> to close the client effortlessly.</p>
            </div>
        `,
        files: {
            "sales_strategy.txt": "Send the audit for free. Highlight 3 critical errors. Wait for them to ask for the PDF. Once they see the value, offer a 10-minute consultation to fix the issues."
        }
    },
    {
        folder: "Nexus_Voice_Agent",
        title: "Voice AI System",
        icon: "🎙️",
        htmlContent: `
            <div class="glass-panel p-8">
                <h2 class="text-2xl text-emerald mb-4">1. Setup Vapi.ai</h2>
                <p class="text-gray-300 mb-4">Create an account on Vapi.ai and initialize a new inbound phone number.</p>
                
                <h2 class="text-2xl text-emerald mb-4 mt-8">2. Agent Configuration</h2>
                <p class="text-gray-300 mb-4">Copy the instructions from <code>voice_agent_instructions.txt</code> and paste them into the system prompt box of your Voice AI.</p>
            </div>
        `,
        files: {
            "voice_agent_instructions.txt": "You are a highly professional inbound sales agent. Your name is Alex. Speak in a friendly, conversational tone. If they ask about pricing, say it starts at $500. Try to schedule a consultation."
        }
    }
];

products.forEach(product => {
    const prodDir = path.join(targetDir, product.folder);
    if (!fs.existsSync(prodDir)) {
        fs.mkdirSync(prodDir, { recursive: true });
    }
    
    // Write HTML guide
    const htmlPath = path.join(prodDir, "NexusOS_Setup_Guide.html");
    fs.writeFileSync(htmlPath, getHtmlTemplate(product.title, product.icon, product.htmlContent));
    
    // Write extra files
    for (const [filename, content] of Object.entries(product.files)) {
        fs.writeFileSync(path.join(prodDir, filename), content);
    }
});

console.log("Products generated successfully in NexusOS_Products_To_Sell");
