import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Copy, CheckCircle, Download, ExternalLink } from 'lucide-react';

const productsData = {
  'lead-extractor': {
    title: 'Nexus Lead Extractor',
    icon: '🎯',
    steps: [
      {
        title: '1. Initialize the Engine',
        desc: 'Go to Apify and initialize the Google Maps Scraper node.',
        link: 'https://apify.com/store'
      },
      {
        title: '2. Configuration Parameters (JSON)',
        desc: 'Copy this exact configuration to ensure accurate data extraction.',
        code: `{\n  "searchTerms": ["B2B SaaS Companies"],\n  "maxPlacesPerSearch": 500,\n  "extractEmailsAndContacts": true\n}`
      },
      {
        title: '3. Cold Email Outreach Script',
        desc: 'Use this highly converting script to contact your extracted leads.',
        code: `Subject: Quick question regarding [Company]...\n\nHi [Name],\n\nI noticed your reviews are fantastic, but you might be missing out on automated lead capture.\nWe build autonomous systems at NexusOS. Open to a 5-min chat?\n\nBest,\n[Your Name]`
      }
    ]
  },
  'whatsapp-booker': {
    title: 'WhatsApp AI Agent',
    icon: '💬',
    steps: [
      {
        title: '1. The Brain (Make.com Blueprint)',
        desc: 'Download the JSON blueprint and import it directly into your Make.com scenario.',
        download: 'nexus-whatsapp-blueprint.json'
      },
      {
        title: '2. AI Personality Prompt',
        desc: 'Paste this into the OpenAI module to configure the AI behavior.',
        code: `You are an elite booking assistant. Your goal is to qualify the lead and get them to book a meeting via Calendly. Keep answers under 3 sentences.`
      }
    ]
  },
  'ai-agent': {
    title: 'Nexus AI Social Agent',
    icon: '🤖',
    steps: [
      {
        title: '1. Connect Your Channels',
        desc: 'Link your Instagram and WhatsApp Business accounts to the Nexus engine.',
        link: 'https://developers.facebook.com/'
      },
      {
        title: '2. Brain Installation (System Prompt)',
        desc: 'Copy this core instruction set and paste it into the AI Agent\'s brain.',
        code: `You are a high-tier sales closer for our company. Your goal is to reply instantly to DMs, answer FAQs about pricing and services, and push the prospect to book a consultation or buy directly. Be polite, concise, and persuasive. Use emojis sparingly.`
      }
    ]
  },
  'voice-agent': {
    title: 'Voice AI System',
    icon: '🎙️',
    steps: [
      {
        title: '1. Setup Vapi.ai',
        desc: 'Create an account on Vapi.ai and initialize a new inbound phone number.',
        link: 'https://vapi.ai/'
      },
      {
        title: '2. Agent Configuration Prompt',
        desc: 'Copy the instructions and paste them into the system prompt box of your Voice AI.',
        code: `You are a highly professional inbound sales agent. Your name is Alex. Speak in a friendly, conversational tone. If they ask about pricing, say it starts at $500. Try to schedule a consultation.`
      }
    ]
  }
};

export default function ClientDashboard() {
  const { productId } = useParams();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const product = productsData[productId];

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (filename) => {
    // In a real app, this would trigger a file download from the public folder or an API
    alert(`Downloading ${filename}... (Simulated)`);
  };

  return (
    <div className="min-h-screen bg-[#020608] text-white font-body p-6 lg:p-24 selection:bg-nexus-emerald selection:text-black">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-6 mb-16 border-b border-white/10 pb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(0,255,157,0.3)] bg-gradient-to-br from-nexus-mint to-nexus-emerald text-black">
            {product.icon}
          </div>
          <div>
            <p className="text-nexus-mint text-sm uppercase tracking-widest font-semibold mb-2">Client Access Portal</p>
            <h1 className="text-5xl font-heading text-white">{product.title}</h1>
          </div>
        </header>

        <main className="space-y-12">
          {product.steps.map((step, index) => (
            <div key={index} className="liquid-glass-strong rounded-3xl p-8 border border-nexus-emerald/20 hover:border-nexus-emerald/50 transition-colors">
              <h2 className="text-2xl font-heading text-nexus-emerald mb-4">{step.title}</h2>
              <p className="text-gray-400 mb-6 text-lg">{step.desc}</p>
              
              {step.link && (
                <a href={step.link} target="_blank" rel="noreferrer" className="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-nexus-mint font-semibold transition-colors border border-nexus-mint/30">
                  <ExternalLink size={18} className="mr-2" />
                  Access Tool
                </a>
              )}

              {step.download && (
                <button onClick={() => handleDownload(step.download)} className="inline-flex items-center px-6 py-3 bg-nexus-emerald text-black hover:bg-nexus-mint rounded-full font-bold transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                  <Download size={18} className="mr-2" />
                  Download Blueprint JSON
                </button>
              )}

              {step.code && (
                <div className="relative mt-4">
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => handleCopy(step.code, index)}
                      className="p-2 bg-black/50 hover:bg-black rounded-lg text-nexus-mint transition-colors border border-white/10"
                    >
                      {copiedIndex === index ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <pre className="bg-[#050B0E] p-6 rounded-2xl overflow-x-auto text-sm text-gray-300 font-mono border border-white/5 leading-relaxed">
                    {step.code}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
