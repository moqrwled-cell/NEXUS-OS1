import * as mammoth from "mammoth";
import fs from "fs";
import { validateCrossReferences } from "../src/utils/crossRefValidator.js";
import { auditDefinedTerms } from "../src/utils/definedTermsAuditor.js";
import { auditFinancialAndDates } from "../src/utils/financialDateAuditor.js";
import { enrichAllAuditFindings } from "../src/utils/statutoryCodex.js";

async function run() {
  const buf = fs.readFileSync("../Real_Lawyer_Test_Files/01_Apex_Acquisition_Agreement_DEFECTIVE.docx");
  const { value: text } = await mammoth.extractRawText({ buffer: buf });
  console.log("Total words in document:", text.split(/\s+/).filter(Boolean).length);
  
  const crossRefs = validateCrossReferences(text);
  const definedTerms = auditDefinedTerms(text);
  const financialDates = auditFinancialAndDates(text);
  
  console.log("Broken cross-references:", crossRefs.stats.brokenCount);
  console.log("Missing exhibits:", crossRefs.stats.missingExhibitCount);
  console.log("Undefined terms:", definedTerms.stats.undefinedCount, definedTerms.undefinedTerms.map(u => u.term));
  console.log("Financial mismatches:", financialDates.stats.mismatchCount);
  
  const enriched = enrichAllAuditFindings({ crossRefs, definedTerms, financialDates, risks: [] });
  console.log("\n========================================================");
  console.log("EXECUTIVE LEGAL AUDIT REPORT (LAWYER COCKPIT)");
  console.log("========================================================");
  console.log(`TOTAL DEAL BREAKERS: ${enriched.dealBreakers.length}`);
  enriched.dealBreakers.forEach((d, i) => {
    console.log(`\n[CRITICAL #${i+1}] ${d.title} (${d.clauseRef || d.clause})`);
    console.log(`  Statute: ${d.statutoryCitation}`);
    console.log(`  Malpractice: ${d.malpracticeRisk}`);
    console.log(`  Court-Grade Redline: ${d.courtGradeRedline.substring(0, 120)}...`);
  });

  console.log(`\nTOTAL ENFORCEABILITY HAZARDS: ${enriched.enforceabilityHazards.length}`);
  enriched.enforceabilityHazards.forEach((h, i) => {
    console.log(`\n[HAZARD #${i+1}] ${h.title} (${h.clauseRef || h.clause})`);
    console.log(`  Statute: ${h.statutoryCitation}`);
    console.log(`  Risk: ${h.malpracticeRisk}`);
    console.log(`  Court-Grade Redline: ${h.courtGradeRedline.substring(0, 120)}...`);
  });
}
run();
