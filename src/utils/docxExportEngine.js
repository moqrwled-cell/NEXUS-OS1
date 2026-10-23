import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { generatePreSigningAmendmentRiderText } from './statutoryCodex.js';

/**
 * Nexus ContractGuard — Institutional DOCX Export Engine
 * 100% Client-Side In-RAM Word Document Generator (.docx)
 * Zero Network Leaks (ABA Model Rule 1.6 & Article 9 Compliant)
 */
export async function downloadContractDOCX(contractText, options = {}) {
  const {
    title = 'Commercial Agreement',
    jurisdiction = 'United States Commercial Law',
    category = 'contract'
  } = options;

  if (!contractText || typeof contractText !== 'string') {
    throw new Error('Contract text must be a valid non-empty string.');
  }

  const rawLines = contractText.split(/\r?\n/);
  const children = [];

  // Formal Header Block: Document Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 28, // 14pt
          font: 'Times New Roman'
        })
      ]
    })
  );

  // Subtitle / Standard Caption
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 360 },
      children: [
        new TextRun({
          text: `AmLaw 100 Model Form — ${jurisdiction}`,
          italics: true,
          size: 19, // 9.5pt
          font: 'Times New Roman',
          color: '555555'
        })
      ]
    })
  );

  // Parse lines into structured Word paragraphs
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Preserve paragraph break for empty lines
    if (!trimmed) {
      continue;
    }

    // Detect Major Section / Article Header
    const isMajorHeading = /^(ARTICLE\s+[0-9IVXLCDM]+|SECTION\s+[0-9]+|RECITALS|AGREEMENT|WITNESSETH|IN WITNESS WHEREOF|EXHIBIT\s+[A-Z0-9]+|SCHEDULE\s+[A-Z0-9]+)/i.test(trimmed);
    const isSubsectionHeading = /^([0-9]+\.[0-9]+|\([a-z0-9]+\))\s+[A-Z]/i.test(trimmed);

    if (isMajorHeading) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 23, // 11.5pt
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else if (isSubsectionHeading) {
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 100, line: 276 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 22, // 11pt
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 140, line: 276 }, // 1.15 line spacing
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: trimmed,
              size: 22, // 11pt
              font: 'Times New Roman'
            })
          ]
        })
      );
    }
  }

  // Construct Document with 1-inch standard legal margins (1440 twips = 1 inch)
  const doc = new Document({
    title: title,
    subject: `Institutional Legal Agreement — ${jurisdiction}`,
    creator: 'Nexus ContractGuard Legal Drafting Suite',
    description: 'Pre-signing commercial contract draft generated for client review and redlining.',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children
      }
    ]
  });

  // Compile in-memory Blob and trigger client-side download
  const blob = await Packer.toBlob(doc);
  const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
  const fileName = `${sanitizedTitle}_Draft.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);

  return { success: true, fileName };
}

/**
 * Downloads a court-grade Pre-Signing Amendment Rider & Revision Schedule as an editable .docx file.
 * Formatted with standard 1-inch legal margins, Times New Roman, and formal counsel caption.
 */
export async function downloadAmendmentRiderDOCX(auditData, meta = {}) {
  const riderText = generatePreSigningAmendmentRiderText(auditData, meta);
  const contractTitle = meta.contractTitle || meta.title || auditData?.meta?.title || 'Commercial Agreement';

  const rawLines = riderText.split(/\r?\n/);
  const children = [];

  // Formal Caption: Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: 'PRE-SIGNING AMENDMENT RIDER AND DRAFTING REVISIONS SCHEDULE',
          bold: true,
          size: 26, // 13pt
          font: 'Times New Roman'
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 160 },
      children: [
        new TextRun({
          text: `TO THAT CERTAIN ${contractTitle.toUpperCase()}`,
          bold: true,
          size: 22, // 11pt
          font: 'Times New Roman'
        })
      ]
    })
  );

  // Mandatory Counsel Working Draft Notice
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 360 },
      children: [
        new TextRun({
          text: 'PRACTITIONER WORKING DRAFT — FOR REVIEWING COUNSEL VERIFICATION AND CUSTOMIZATION PRIOR TO EXECUTION',
          italics: true,
          bold: true,
          size: 19, // 9.5pt
          font: 'Times New Roman',
          color: '444444'
        })
      ]
    })
  );

  // Parse lines into structured paragraphs
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Skip redundant title banner lines already formatted above
    if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---') || 
        trimmed.includes('PRE-SIGNING AMENDMENT RIDER AND DRAFTING REVISIONS SCHEDULE') ||
        (trimmed.startsWith('TO ') && trimmed.includes(contractTitle.toUpperCase()))) {
      continue;
    }

    const isMajorHeading = /^(SECTION\s+[0-9]+|RECITALS\s+&\s+STIPULATIONS|IN WITNESS WHEREOF|Dated as of:|Parties:)/i.test(trimmed);
    const isSubsectionHeading = /^([0-9]+\.[0-9]+)\s+[A-Z]/i.test(trimmed);
    const isSignatureBlock = /^(CLIENT\s*\/\s*BUYER:|COUNTERPARTY\s*\/\s*SELLER:|By:|Name:|Title:)/i.test(trimmed);

    if (isMajorHeading) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 23, // 11.5pt
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else if (isSubsectionHeading) {
      children.push(
        new Paragraph({
          spacing: { before: 180, after: 100, line: 276 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 22, // 11pt
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else if (isSignatureBlock) {
      children.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 22, // 11pt
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 140, line: 276 }, // 1.15 line spacing
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: trimmed,
              size: 22, // 11pt
              font: 'Times New Roman'
            })
          ]
        })
      );
    }
  }

  // Construct Document with 1-inch standard legal margins (1440 twips = 1 inch)
  const doc = new Document({
    title: `Pre-Signing Amendment Rider — ${contractTitle}`,
    subject: `Amendment and Harmonization Schedule`,
    creator: 'Transactional Legal Practice Group',
    description: 'Pre-signing commercial contract amendment schedule generated for legal counsel review and redlining.',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const sanitizedTitle = contractTitle.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) || 'Agreement';
  const fileName = `${sanitizedTitle}_PreSigning_Amendment_Rider.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);

  return { success: true, fileName };
}


/**
 * Downloads a court-grade Word (.docx) document of the harmonized and restated contract/deed,
 * with 100% mathematical factual data preservation assertion.
 * 
 * @param {Object} harmonizedResult - Result from restateAndPolishContract
 * @param {Object} options - Customization options
 * @returns {Promise<{success: boolean, fileName: string}>}
 */
export async function downloadHarmonizedDeedDOCX(harmonizedResult, options = {}) {
  const {
    title = 'Harmonized Contract and Conveyance Draft',
    jurisdiction = 'Delaware & Uniform Real Property Law'
  } = options;

  if (!harmonizedResult || !harmonizedResult.restatedText) {
    throw new Error('Valid harmonized result with restatedText is required.');
  }

  const { restatedText, verification } = harmonizedResult;
  const children = [];

  // Title Heading
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 26, // 13pt
          font: 'Times New Roman'
        })
      ]
    })
  );

  // Subtitle / Standard Caption
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: `Court-Grade Restatement — ${jurisdiction}`,
          italics: true,
          size: 19, // 9.5pt
          font: 'Times New Roman',
          color: '555555'
        })
      ]
    })
  );

  // Data Integrity Assurance Banner
  const integrityText = verification?.passed
    ? `DATA INTEGRITY CERTIFIED: 100% of all ${verification.totalAnchors || 0} factual anchors (APN, acreage, metes & bounds coordinates, purchase figures, and dates) strictly preserved. Zero mutations.`
    : `DATA VERIFICATION NOTICE: Counsel verification recommended for custom municipal parameters.`;

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 300 },
      children: [
        new TextRun({
          text: integrityText,
          size: 18, // 9pt
          bold: true,
          font: 'Times New Roman',
          color: verification?.passed ? '006633' : '996600'
        })
      ]
    })
  );

  // Parse lines of restatedText into paragraphs
  const rawLines = restatedText.split(/\r?\n/);
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isMajorHeading = /^(ARTICLE\s+[0-9IVXLCDM]+|SECTION\s+[0-9]+|SECTION\.\s+[A-Z\s]+|RECITALS|IN WITNESS WHEREOF|EXHIBIT\s+[A-Z0-9]+)/i.test(trimmed);
    const isSubsectionHeading = /^([0-9]+\.[0-9]+|\([a-z0-9]+\))\s+[A-Z]/i.test(trimmed);

    if (isMajorHeading) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 100 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 22, // 11pt
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else if (isSubsectionHeading) {
      children.push(
        new Paragraph({
          spacing: { before: 140, after: 80, line: 276 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 22,
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 120, line: 276 },
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: trimmed,
              size: 22,
              font: 'Times New Roman'
            })
          ]
        })
      );
    }
  }

  // Build document with standard 1-inch margins
  const doc = new Document({
    title: `${title} — Restated`,
    subject: 'Forensic Deed & Contract Restatement',
    creator: 'Nexus ContractGuard Enterprise',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) || 'Contract';
  const outFileName = `${cleanTitle}_CourtGrade_Restated.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = outFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);

  return { success: true, fileName: outFileName };
}
