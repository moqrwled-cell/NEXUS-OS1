import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, DollarSign, ArrowLeft, Trash2, TrendingDown, Target, FileSpreadsheet, Activity, AlertOctagon, TrendingUp } from "lucide-react";
import Papa from "papaparse";
export default function AdSpendAudit() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({
    campaignName: "",
    spend: "",
    conversions: ""
  });
  const [targetCPA, setTargetCPA] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  useEffect(() => {
    const license = localStorage.getItem("nexus_license");
    if (!license) navigate("/login");
  }, [navigate]);
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results2) => {
        if (results2.data.length > 0) {
          setData(results2.data);
          const cols = Object.keys(results2.data[0]);
          setColumns(cols);
          let m = { campaignName: cols[0], spend: cols[0], conversions: cols[0] };
          cols.forEach((c) => {
            const lower = c.toLowerCase();
            if (lower.includes("campaign") || lower.includes("name")) m.campaignName = c;
            if (lower.includes("spend") || lower.includes("amount") || lower.includes("cost")) m.spend = c;
            if (lower.includes("purchase") || lower.includes("conversion") || lower.includes("result") || lower.includes("lead")) m.conversions = c;
          });
          setMapping(m);
          setResults(null);
        }
      }
    });
  };
  const processAudit = () => {
    if (!data.length || !mapping.campaignName || !mapping.spend || !mapping.conversions) return;
    setIsProcessing(true);
    setTimeout(() => {
      let totalWasted = 0;
      let totalSpend = 0;
      let zombies = [];
      let highCpa = [];
      let scalable = [];
      data.forEach((row) => {
        const name = row[mapping.campaignName] || "Unnamed";
        const spendStr = String(row[mapping.spend]).replace(/[^0-9.-]+/g, "");
        const convStr = String(row[mapping.conversions]).replace(/[^0-9.-]+/g, "");
        const spend = parseFloat(spendStr) || 0;
        const conversions = parseFloat(convStr) || 0;
        if (spend <= 0) return;
        totalSpend += spend;
        const actualCPA = conversions > 0 ? spend / conversions : Infinity;
        if (conversions === 0 && spend > 30) {
          totalWasted += spend;
          zombies.push({ name, spend, conversions, cpa: actualCPA });
        } else if (conversions > 0 && actualCPA > targetCPA) {
          const wastedOnThis = spend - targetCPA * conversions;
          totalWasted += wastedOnThis;
          highCpa.push({ name, spend, conversions, cpa: actualCPA, wasted: wastedOnThis });
        } else if (conversions > 0 && actualCPA <= targetCPA) {
          scalable.push({ name, spend, conversions, cpa: actualCPA });
        }
      });
      zombies.sort((a, b) => b.spend - a.spend);
      highCpa.sort((a, b) => b.wasted - a.wasted);
      scalable.sort((a, b) => a.cpa - b.cpa);
      setResults({
        totalSpend,
        totalWasted,
        zombies,
        highCpa,
        scalable
      });
      setIsProcessing(false);
    }, 800);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-black text-white font-sans p-8 relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-rose-900/20 to-transparent -z-10 pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-12 border-b border-white/10 pb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]" }, /* @__PURE__ */ React.createElement(Activity, { className: "text-rose-400", size: 24 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold" }, "Nexus AdSpend-Audit"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-sm" }, "Financial Ad Account Analyzer"))), /* @__PURE__ */ React.createElement("button", { onClick: () => navigate("/"), className: "flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all text-sm border border-white/10" }, /* @__PURE__ */ React.createElement(ArrowLeft, { size: 16 }), " Dashboard")), /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-12 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4 space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/10 rounded-3xl p-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(FileSpreadsheet, { className: "text-rose-400" }), "1. Upload Ad Data"), !file ? /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => fileInputRef.current.click(),
      className: "border-2 border-dashed border-rose-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-rose-500/5 hover:border-rose-400 transition-all group"
    },
    /* @__PURE__ */ React.createElement(Upload, { className: "text-rose-500/50 mb-4 group-hover:text-rose-400", size: 40 }),
    /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-base mb-2" }, "Upload Ads CSV"),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-xs" }, "Export from Facebook/Google Ads."),
    /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".csv", className: "hidden", ref: fileInputRef, onChange: handleFileUpload })
  ) : /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-5 relative" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setFile(null);
    setData([]);
    setResults(null);
  }, className: "absolute top-4 right-4 text-gray-400 hover:text-red-400" }, /* @__PURE__ */ React.createElement(Trash2, { size: 16 })), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-sm truncate pr-8" }, file.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400 mt-1" }, data.length, " Campaigns Found"))), /* @__PURE__ */ React.createElement("div", { className: `liquid-glass-strong border border-white/10 rounded-3xl p-8 transition-all ${!file ? "opacity-50 pointer-events-none" : ""}` }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Target, { className: "text-rose-400" }), "2. Map & Configure"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-gray-400 font-medium block mb-1" }, "Campaign Name Column"), /* @__PURE__ */ React.createElement("select", { value: mapping.campaignName, onChange: (e) => setMapping({ ...mapping, campaignName: e.target.value }), className: "w-full bg-black border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-rose-500 outline-none" }, columns.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-gray-400 font-medium block mb-1" }, "Amount Spent Column"), /* @__PURE__ */ React.createElement("select", { value: mapping.spend, onChange: (e) => setMapping({ ...mapping, spend: e.target.value }), className: "w-full bg-black border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-rose-500 outline-none" }, columns.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-gray-400 font-medium block mb-1" }, "Conversions/Purchases Column"), /* @__PURE__ */ React.createElement("select", { value: mapping.conversions, onChange: (e) => setMapping({ ...mapping, conversions: e.target.value }), className: "w-full bg-black border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-rose-500 outline-none" }, columns.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c)))), /* @__PURE__ */ React.createElement("div", { className: "pt-4 border-t border-white/10" }, /* @__PURE__ */ React.createElement("label", { className: "text-sm text-white font-bold block mb-2" }, "Target CPA ($)"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400 mb-3" }, "How much are you willing to pay per conversion?"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(DollarSign, { className: "absolute left-3 top-2.5 text-gray-500", size: 16 }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value: targetCPA,
      onChange: (e) => setTargetCPA(Number(e.target.value)),
      className: "w-full bg-black border border-white/20 rounded-lg pl-9 p-2.5 text-white font-bold focus:border-rose-500 outline-none"
    }
  )))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: processAudit,
      disabled: isProcessing,
      className: "w-full mt-8 bg-gradient-to-r from-rose-600 to-red-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105 transition-all flex justify-center items-center gap-2"
    },
    isProcessing ? "Auditing Finances..." : "Run Financial Audit"
  ))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-8" }, results ? /* @__PURE__ */ React.createElement("div", { className: "space-y-6 animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-rose-500/30 rounded-3xl p-8 relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-[50px] rounded-full" }), /* @__PURE__ */ React.createElement("p", { className: "text-rose-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(TrendingDown, { size: 16 }), " Wasted Ad Spend"), /* @__PURE__ */ React.createElement("p", { className: "text-5xl font-black text-rose-500 mb-2" }, "$", results.totalWasted.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-200/70" }, "Money mathematically thrown away on bad campaigns.")), /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/10 rounded-3xl p-8" }, /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-sm font-bold uppercase tracking-wider mb-2" }, "Total Analyzed Spend"), /* @__PURE__ */ React.createElement("p", { className: "text-4xl font-bold text-white mb-2" }, "$", results.totalSpend.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, (results.totalWasted / results.totalSpend * 100).toFixed(1), "% of your budget is being wasted."))), /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/10 rounded-3xl overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "bg-rose-500/10 border-b border-rose-500/20 p-5 flex items-center gap-3" }, /* @__PURE__ */ React.createElement(AlertOctagon, { className: "text-rose-500" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-rose-100" }, 'The "Kill" List (Zombies)'), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-200/70" }, "Campaigns that spent money but brought ZERO conversions."))), /* @__PURE__ */ React.createElement("div", { className: "p-0 max-h-[250px] overflow-y-auto custom-scrollbar" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-sm" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-black/50 text-gray-400 text-xs uppercase" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "p-4 font-medium" }, "Campaign"), /* @__PURE__ */ React.createElement("th", { className: "p-4 font-medium" }, "Spent"), /* @__PURE__ */ React.createElement("th", { className: "p-4 font-medium" }, "Convs"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-white/5" }, results.zombies.length > 0 ? results.zombies.map((c, i) => /* @__PURE__ */ React.createElement("tr", { key: i, className: "hover:bg-white/5 transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "p-4 font-medium text-rose-100 truncate max-w-[200px]" }, c.name), /* @__PURE__ */ React.createElement("td", { className: "p-4 text-rose-400 font-bold" }, "$", c.spend.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "p-4 text-gray-500" }, "0"))) : /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "3", className: "p-8 text-center text-gray-500" }, "No zombie campaigns found!")))))), /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/10 rounded-3xl overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-500/10 border-b border-emerald-500/20 p-5 flex items-center gap-3" }, /* @__PURE__ */ React.createElement(TrendingUp, { className: "text-emerald-500" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-emerald-100" }, 'The "Scale" List (Winners)'), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-emerald-200/70" }, "Campaigns hitting your Target CPA. Increase budgets here."))), /* @__PURE__ */ React.createElement("div", { className: "p-0 max-h-[250px] overflow-y-auto custom-scrollbar" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-sm" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-black/50 text-gray-400 text-xs uppercase" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "p-4 font-medium" }, "Campaign"), /* @__PURE__ */ React.createElement("th", { className: "p-4 font-medium" }, "Spent"), /* @__PURE__ */ React.createElement("th", { className: "p-4 font-medium" }, "Convs"), /* @__PURE__ */ React.createElement("th", { className: "p-4 font-medium" }, "Actual CPA"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-white/5" }, results.scalable.length > 0 ? results.scalable.map((c, i) => /* @__PURE__ */ React.createElement("tr", { key: i, className: "hover:bg-white/5 transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "p-4 font-medium text-emerald-100 truncate max-w-[200px]" }, c.name), /* @__PURE__ */ React.createElement("td", { className: "p-4 text-gray-300" }, "$", c.spend.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "p-4 text-gray-300" }, c.conversions), /* @__PURE__ */ React.createElement("td", { className: "p-4 text-emerald-400 font-bold" }, "$", c.cpa.toFixed(2)))) : /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "4", className: "p-8 text-center text-gray-500" }, "No campaigns hitting the target CPA."))))))) : /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/5 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center opacity-50 min-h-[400px]" }, /* @__PURE__ */ React.createElement(Activity, { size: 64, className: "text-gray-600 mb-6" }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-2" }, "Audit Dashboard"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 max-w-sm" }, "Map your columns and hit run to instantly calculate mathematically wasted ad spend."))))));
}
