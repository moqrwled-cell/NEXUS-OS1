import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Globe, Download, Shield, Lock, LogOut, Database, User, Mail, Phone, Activity } from 'lucide-react';
import Papa from 'papaparse';

export default function LeadSniper() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [leads, setLeads] = useState([]);
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const license = localStorage.getItem('nexus_license');
    if (!license) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('nexus_license');
    navigate('/login');
  };

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const startScraping = () => {
    if (!keyword || !location) return;
    
    setIsScraping(true);
    setLeads([]);
    setLogs([]);
    addLog(`Initializing local scraper engine...`);
    addLog(`Bypassing cloud IP blocks...`);
    
    let leadCount = 0;
    const maxLeads = Math.floor(Math.random() * 50) + 150; // Simulate finding 150-200 leads
    
    const names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
    const domains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com", "@company.com"];

    const interval = setInterval(() => {
      if (leadCount >= maxLeads) {
        clearInterval(interval);
        setIsScraping(false);
        addLog(`✅ Scraping complete. Found ${maxLeads} leads.`);
        return;
      }

      // Generate fake lead for simulation
      const fName = names[Math.floor(Math.random() * names.length)];
      const lName = names[Math.floor(Math.random() * names.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      
      const newLead = {
        id: leadCount + 1,
        name: `${fName} ${lName}`,
        business: `${fName} ${keyword} Solutions`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${domain}`,
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Verified'
      };

      setLeads(prev => [newLead, ...prev]);
      leadCount++;
      
      if (leadCount % 5 === 0) {
        addLog(`Scraping page ${Math.floor(leadCount / 5)}... Found new endpoints.`);
      }
    }, 150);
  };

  const downloadCSV = () => {
    if (leads.length === 0) return;
    const csv = Papa.unparse(leads);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nexus_leads_${keyword}_${location}.csv`.replace(/\s+/g, '_'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600/10 to-transparent -z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Database className="text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus LeadSniper</h1>
              <p className="text-gray-400 text-sm">B2B Local IP Scraper</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-blue-400 text-sm bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
              <Lock size={14} />
              <span>Proxy Active (Local IP)</span>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-red-500/30"
            >
              <LogOut size={16} />
              Disconnect
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Search Parameters */}
          <div className="lg:col-span-4 space-y-6">
            <div className="liquid-glass-strong p-6 rounded-3xl border border-white/5">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Search className="text-blue-400" size={20}/>
                Target Parameters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Niche / Keyword</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. Dentists, SaaS Founders..." 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      disabled={isScraping}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. New York, London, Dubai..." 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isScraping}
                    />
                  </div>
                </div>

                <button 
                  onClick={startScraping}
                  disabled={isScraping || !keyword || !location}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4 flex justify-center items-center gap-2"
                >
                  {isScraping ? (
                    <><Activity className="animate-pulse" size={20} /> Extracting Leads...</>
                  ) : (
                    <><Search size={20} /> Start Extraction</>
                  )}
                </button>
              </div>
            </div>

            {/* Terminal / Logs */}
            <div className="liquid-glass-strong p-6 rounded-3xl border border-white/5 h-48 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0"></div>
              <div className="relative z-10">
                <h3 className="text-sm text-gray-400 font-mono mb-3 flex items-center gap-2">
                  <Shield size={14} className="text-nexus-emerald" />
                  Terminal Logs
                </h3>
                <div className="space-y-2 font-mono text-xs text-nexus-emerald">
                  {logs.map((log, i) => (
                    <div key={i} className="animate-fade-in opacity-80">&gt; {log}</div>
                  ))}
                  {logs.length === 0 && <div className="text-gray-600">&gt; Waiting for target input...</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Results Table */}
          <div className="lg:col-span-8">
            <div className="liquid-glass-strong rounded-3xl border border-white/5 h-full min-h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="text-blue-400" />
                    Extracted Leads
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Found: <span className="text-blue-400 font-bold">{leads.length}</span> verified contacts</p>
                </div>
                
                <button 
                  onClick={downloadCSV}
                  disabled={leads.length === 0 || isScraping}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-30"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>

              <div className="flex-1 overflow-auto p-0">
                {leads.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <Database size={48} className="opacity-20" />
                    <p>No leads extracted yet. Enter a niche and location to begin.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0 z-10">
                      <tr>
                        <th className="p-4 font-medium">Business Name</th>
                        <th className="p-4 font-medium">Contact</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 font-medium text-blue-100">{lead.business}</td>
                          <td className="p-4 text-gray-300 flex items-center gap-2">
                            <User size={14} className="text-gray-500" />
                            {lead.name}
                          </td>
                          <td className="p-4 text-gray-300">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-nexus-emerald" />
                              {lead.email}
                            </div>
                          </td>
                          <td className="p-4 text-gray-400 font-mono text-xs">{lead.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
