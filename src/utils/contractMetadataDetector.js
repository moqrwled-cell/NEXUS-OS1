/**
 * Nexus ContractGuard Enterprise — Contract Metadata Detector
 * Deterministic In-Browser Extractor for Agreement Title and Executing Parties.
 * ABA Model Rule 1.6 Certified (Zero External Cloud Transmission).
 */

/**
 * Extracts agreement title, client party, and counterparty from contract text and filename.
 * 
 * @param {string} text - Raw contract draft text
 * @param {string} [fileName=''] - Optional uploaded file name
 * @returns {{ title: string; clientParty: string; counterparty: string }}
 */
export function detectContractMetadata(text = '', fileName = '') {
  if (!text || typeof text !== 'string') {
    return { title: '', clientParty: '', counterparty: '' };
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let detectedTitle = '';
  let detectedClient = '';
  let detectedCounterparty = '';

  // --------------------------------------------------------------------------
  // 1. EXTRACT AGREEMENT TITLE
  // --------------------------------------------------------------------------
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const rawLine = lines[i].replace(/^#{1,6}\s+/, '').trim();
    if (/\b(?:AGREEMENT|CONTRACT|DEED|LEASE|INDENTURE|UNDERTAKING|TERMS OF SERVICE|POLICY|PLAN|RELEASE|NOTE|AMENDMENT|ADDENDUM)\b/i.test(rawLine)) {
      if (rawLine.length >= 4 && rawLine.length <= 130 && !/^(?:this|whereas|witnesseth|now,\s*therefore|by and between|in witness whereof)\b/i.test(rawLine)) {
        detectedTitle = rawLine.replace(/["“”'‘’]/g, '').trim();
        break;
      }
    }
  }

  // Fallback to formal preamble quote: e.g. 'This Master Services Agreement (the "Agreement")'
  if (!detectedTitle) {
    const preambleMatch = text.slice(0, 1500).match(/(?:This|The)\s+([A-Z][A-Za-z0-9\s—–\-_/&]+?(?:Agreement|Contract|Lease|Deed|Release|Addendum|Amendment|Undertaking))\s*\((?:hereinafter|the|this)?\s*["“'‘](?:Agreement|Contract)["”'’]\)/i);
    if (preambleMatch && preambleMatch[1].length < 100) {
      detectedTitle = preambleMatch[1].trim();
    }
  }

  // Fallback to cleaned filename if available
  if (!detectedTitle && fileName) {
    const baseName = fileName.replace(/\.[a-zA-Z0-9]+$/, '').replace(/[_\-]+/g, ' ').trim();
    if (baseName.length >= 3) {
      detectedTitle = baseName;
    }
  }

  // --------------------------------------------------------------------------
  // 2. EXTRACT CLIENT & COUNTERPARTY PARTIES
  // --------------------------------------------------------------------------
  const preambleChunk = text.slice(0, 3000);

  // Pattern A: Entities associated with defined roles in parentheses
  // e.g. 'Acme Holdings LLC ("Client") and Globex Systems Inc ("Provider")'
  const partyRegex = /\b([A-Z][A-Za-z0-9&',.\s-]{2,60}?(?:\s+(?:LLC|L\.L\.C\.|Inc\.?|Incorporated|Corp\.?|Corporation|Ltd\.?|Limited|LLP|L\.L\.P\.|GmbH|S\.A\.))?)\s*(?:,\s*(?:a|an)\s+[^,()]+,?)?\s*\(\s*(?:the|hereinafter)?\s*["“'‘]([A-Za-z\s]+)["”'’]\s*\)/g;

  const foundParties = [];
  let pMatch;
  while ((pMatch = partyRegex.exec(preambleChunk)) !== null) {
    const rawName = pMatch[1].replace(/^(?:and|by|between|parties|the|each)\s+/i, '').trim();
    const role = pMatch[2].trim().toLowerCase();

    // Disqualify statutory references, headings, or generic contract words
    if (/^(?:statutes?|code|act|law|regulations?|section|article|agreement|recitals?)\b/i.test(rawName)) continue;
    if (rawName.length < 3 || rawName.length > 70) continue;

    foundParties.push({ name: rawName, role });
    if (foundParties.length >= 6) break;
  }

  const clientRoles = ['client', 'customer', 'buyer', 'purchaser', 'licensee', 'company', 'employer', 'disclosing party', 'owner', 'first party'];
  const counterpartyRoles = ['counterparty', 'provider', 'vendor', 'supplier', 'contractor', 'seller', 'licensor', 'consultant', 'employee', 'receiving party', 'second party'];

  for (const p of foundParties) {
    if (clientRoles.some(r => p.role.includes(r))) {
      if (!detectedClient) detectedClient = p.name;
    } else if (counterpartyRoles.some(r => p.role.includes(r))) {
      if (!detectedCounterparty) detectedCounterparty = p.name;
    }
  }

  // If party roles were not matched, allocate first party as Client and second as Counterparty
  if (foundParties.length >= 2) {
    if (!detectedClient) detectedClient = foundParties[0].name;
    if (!detectedCounterparty) detectedCounterparty = foundParties[1].name;
  } else if (foundParties.length === 1) {
    if (!detectedClient) detectedClient = foundParties[0].name;
  }

  // Fallback Pattern B: Identify corporate designators (LLC, Inc, Corp, Ltd, etc.)
  if (!detectedClient || !detectedCounterparty) {
    const RE_CORP = /\b([A-Z][A-Za-z0-9&',.-]+(?:\s+[A-Z][A-Za-z0-9&',.-]+){0,4}\s+(?:LLC|L\.L\.C\.|Inc\.?|Incorporated|Corp\.?|Corporation|Ltd\.?|Limited|LLP|L\.L\.P\.))\b/g;
    const corpMatches = [];
    let cMatch;
    while ((cMatch = RE_CORP.exec(preambleChunk)) !== null) {
      const cName = cMatch[1].trim();
      if (/^(?:Delaware General Corporation|California Corporations|Uniform Commercial)\b/i.test(cName)) continue;
      if (!corpMatches.includes(cName)) {
        corpMatches.push(cName);
      }
    }

    if (!detectedClient && corpMatches[0]) {
      detectedClient = corpMatches[0];
    }
    if (!detectedCounterparty && corpMatches[1]) {
      detectedCounterparty = corpMatches[1];
    }
  }

  return {
    title: detectedTitle,
    clientParty: detectedClient,
    counterparty: detectedCounterparty
  };
}
