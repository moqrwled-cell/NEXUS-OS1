import JSZip from 'jszip';

function decodeXmlEntities(str = '') {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

/**
 * Nexus ContractGuard — CSP-Safe Word DOCX Text Extractor
 * 100% Client-Side In-RAM Word Document Parser
 * Zero eval(), Zero new Function(), Zero Bluebird/Underscore
 * Fully compliant with strict Content Security Policies (CSP) & ABA Model Rule 1.6
 */
export async function extractTextFromDOCX(arrayBuffer) {
  if (!arrayBuffer) {
    throw new Error('No ArrayBuffer provided for DOCX extraction.');
  }

  const zip = await JSZip.loadAsync(arrayBuffer);
  const docFile = zip.file('word/document.xml');
  if (!docFile) {
    throw new Error('Invalid Word document: missing word/document.xml');
  }

  const xmlContent = await docFile.async('text');

  // Extract all paragraphs (<w:p>...</w:p>)
  const paragraphs = [];
  const pRegex = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;
  let pMatch;

  while ((pMatch = pRegex.exec(xmlContent)) !== null) {
    const pBody = pMatch[1]
      .replace(/<w:tab\s*\/>/g, '    ')
      .replace(/<w:br(?:\s[^>]*)?\/>/g, '\n');

    // Extract text from all text runs (<w:t>...</w:t>) including inline tabs/breaks
    const tokenRegex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|(\n|    )/g;
    let tMatch;
    let pText = '';
    while ((tMatch = tokenRegex.exec(pBody)) !== null) {
      pText += tMatch[1] !== undefined ? decodeXmlEntities(tMatch[1]) : tMatch[2];
    }
    if (pText.trim()) {
      paragraphs.push(pText.trim());
    }
  }

  return { value: paragraphs.join('\n\n') };
}
