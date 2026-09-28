import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Download, Shield, ShieldAlert, ArrowLeft, Trash2, CheckCircle2, Lock, Filter, FileSpreadsheet, Users } from "lucide-react";
import Papa from "papaparse";
const ROLE_BASED_PREFIXES = ["info", "sales", "support", "admin", "contact", "hello", "marketing", "press", "help", "billing", "jobs", "careers"];
const FREE_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "protonmail.com", "mail.com", "zoho.com", "yandex.com"];
export default function LeadScrub() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [emailColumn, setEmailColumn] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [filters, setFilters] = useState({
    removeDuplicates: true,
    removeInvalid: true,
    removeRoleBased: true,
    removeFreeDomains: true
  });
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
          const detectedEmailCol = cols.find((c) => c.toLowerCase().includes("email") || c.toLowerCase().includes("e-mail"));
          if (detectedEmailCol) {
            setEmailColumn(detectedEmailCol);
          } else {
            setEmailColumn(cols[0]);
          }
          setResults(null);
        }
      }
    });
  };
  const processLeads = () => {
    if (!data.length || !emailColumn) return;
    setIsProcessing(true);
    setTimeout(() => {
      let stats = {
        total: data.length,
        valid: 0,
        duplicates: 0,
        invalidFormat: 0,
        roleBased: 0,
        freeDomain: 0
      };
      const cleanData = [];
      const seenEmails = /* @__PURE__ */ new Set();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      data.forEach((row) => {
        let rawEmail = row[emailColumn];
        if (!rawEmail || typeof rawEmail !== "string") rawEmail = "";
        const email = rawEmail.trim().toLowerCase();
        let isScrubbed = false;
        if (filters.removeInvalid && (!email || !emailRegex.test(email))) {
          stats.invalidFormat++;
          isScrubbed = true;
        }
        if (!isScrubbed) {
          if (filters.removeDuplicates && seenEmails.has(email)) {
            stats.duplicates++;
            isScrubbed = true;
          } else {
            seenEmails.add(email);
          }
        }
        if (!isScrubbed) {
          const [prefix, domain] = email.split("@");
          if (filters.removeRoleBased && ROLE_BASED_PREFIXES.includes(prefix)) {
            stats.roleBased++;
            isScrubbed = true;
          } else if (filters.removeFreeDomains && FREE_DOMAINS.includes(domain)) {
            stats.freeDomain++;
            isScrubbed = true;
          }
        }
        if (!isScrubbed) {
          stats.valid++;
          cleanData.push(row);
        }
      });
      setResults({ stats, cleanData });
      setIsProcessing(false);
    }, 800);
  };
  const downloadCleanCSV = () => {
    if (!results || !results.cleanData.length) return;
    const csv = Papa.unparse(results.cleanData);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `nexus_cleaned_leads_${(/* @__PURE__ */ new Date()).getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-black text-white font-sans p-8 relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-900/20 to-transparent -z-10 pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-12 border-b border-white/10 pb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]" }, /* @__PURE__ */ React.createElement(Shield, { className: "text-teal-400", size: 24 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold" }, "Nexus LeadScrub"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-sm" }, "B2B Data Sanitization Engine"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "hidden md:flex items-center gap-2 text-teal-400 text-sm bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20" }, /* @__PURE__ */ React.createElement(Lock, { size: 14 }), /* @__PURE__ */ React.createElement("span", null, "100% Local Browser Processing (Zero Uploads)")), /* @__PURE__ */ React.createElement("button", { onClick: () => navigate("/"), className: "flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all text-sm border border-white/10" }, /* @__PURE__ */ React.createElement(ArrowLeft, { size: 16 }), " Dashboard"))), /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-12 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5 space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/10 rounded-3xl p-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(FileSpreadsheet, { className: "text-teal-400" }), "1. Upload Raw Leads"), !file ? /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => fileInputRef.current.click(),
      className: "border-2 border-dashed border-teal-500/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-500/5 hover:border-teal-400 transition-all group"
    },
    /* @__PURE__ */ React.createElement(Upload, { className: "text-teal-500/50 mb-4 group-hover:text-teal-400 transition-colors", size: 48 }),
    /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg mb-2" }, "Upload CSV File"),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-sm" }, "Drop your raw leads list here to begin."),
    /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".csv", className: "hidden", ref: fileInputRef, onChange: handleFileUpload })
  ) : /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(FileSpreadsheet, { className: "text-teal-400", size: 24 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-sm truncate max-w-[200px]" }, file.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400" }, (file.size / 1024).toFixed(1), " KB \u2022 ", data.length, " Rows"))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setFile(null);
    setData([]);
    setResults(null);
  }, className: "text-gray-400 hover:text-red-400 p-2" }, /* @__PURE__ */ React.createElement(Trash2, { size: 18 }))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mt-6" }, /* @__PURE__ */ React.createElement("label", { className: "text-sm text-gray-400 font-medium" }, "Select Email Column"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: emailColumn,
      onChange: (e) => setEmailColumn(e.target.value),
      className: "w-full bg-black border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
    },
    columns.map((col) => /* @__PURE__ */ React.createElement("option", { key: col, value: col }, col))
  )))), /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/10 rounded-3xl p-8 opacity-100 transition-all" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Filter, { className: "text-teal-400" }), "2. Sanitization Rules"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, [
    { key: "removeInvalid", label: "Remove Invalid Emails", desc: "Drops malformed addresses" },
    { key: "removeDuplicates", label: "Remove Duplicates", desc: "Keeps only unique emails" },
    { key: "removeRoleBased", label: "Remove Role-Based Emails", desc: "Drops info@, admin@, etc." },
    { key: "removeFreeDomains", label: "Remove Free Domains", desc: "Drops @gmail, @yahoo for strict B2B" }
  ].map((filter) => /* @__PURE__ */ React.createElement("label", { key: filter.key, className: "flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-black/40 cursor-pointer hover:border-teal-500/30 transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex items-center pt-1" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      className: "sr-only",
      checked: filters[filter.key],
      onChange: () => toggleFilter(filter.key)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters[filter.key] ? "bg-teal-500 border-teal-500" : "border-gray-500"}` }, filters[filter.key] && /* @__PURE__ */ React.createElement(CheckCircle2, { size: 14, className: "text-black" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-sm text-white" }, filter.label), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400 mt-1" }, filter.desc))))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: processLeads,
      disabled: !file || isProcessing,
      className: "w-full mt-8 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
    },
    isProcessing ? "Scrubbing Leads..." : "Run LeadScrub Engine"
  ))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7" }, results ? /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/10 rounded-3xl p-8 h-full animate-fade-in flex flex-col relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full pointer-events-none" }), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold mb-8 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ShieldAlert, { className: "text-teal-400" }), "Audit & Sanitization Report"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4 mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "bg-black/40 border border-white/5 rounded-2xl p-6" }, /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-sm font-medium mb-2" }, "Total Uploaded"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold text-white" }, results.stats.total)), /* @__PURE__ */ React.createElement("div", { className: "bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6" }, /* @__PURE__ */ React.createElement("p", { className: "text-teal-400 text-sm font-medium mb-2" }, "Valid B2B Leads"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold text-teal-400" }, results.stats.valid))), /* @__PURE__ */ React.createElement("div", { className: "bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 flex-1" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-sm text-gray-400 uppercase tracking-wider mb-6" }, "Threats Scrubbed"), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-red-400 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Trash2, { size: 16 }), " Duplicates Found"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg" }, results.stats.duplicates)), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white/5 h-1 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "bg-red-500 h-full", style: { width: `${results.stats.duplicates / results.stats.total * 100}%` } })), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-orange-400 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16 }), " Role-Based (info@, etc.)"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg" }, results.stats.roleBased)), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white/5 h-1 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "bg-orange-500 h-full", style: { width: `${results.stats.roleBased / results.stats.total * 100}%` } })), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-yellow-400 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Users, { size: 16 }), " Free Domains (gmail, etc.)"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg" }, results.stats.freeDomain)), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white/5 h-1 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "bg-yellow-500 h-full", style: { width: `${results.stats.freeDomain / results.stats.total * 100}%` } })), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-gray-400 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Filter, { size: 16 }), " Invalid Format"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg" }, results.stats.invalidFormat)))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: downloadCleanCSV,
      className: "w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2"
    },
    /* @__PURE__ */ React.createElement(Download, { size: 20 }),
    " Export Cleaned List (CSV)"
  )) : /* @__PURE__ */ React.createElement("div", { className: "liquid-glass-strong border border-white/5 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center opacity-50" }, /* @__PURE__ */ React.createElement(Shield, { size: 64, className: "text-gray-600 mb-6" }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-2" }, "Awaiting Data"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 max-w-sm" }, "Upload a CSV and run the engine to see the detailed sanitization report here."))))));
}
