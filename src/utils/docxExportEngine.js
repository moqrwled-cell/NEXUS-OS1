import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Footer,
  PageNumber
} from 'docx';
import { generatePreSigningAmendmentRiderText } from './statutoryCodex.js';

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
};

function splitTwoColumnLine(line) {
  const match = line.match(/^(.+?)\s{3,}(.+)$/);
  if (match) {
    return [match[1].trim(), match[2].trim()];
  }
  return [line.trim(), ''];
}

function buildSignatureCell(lines, isHeaderRow = false) {
  const paras = lines.map((txt, idx) => {
    const isRole = /^[A-Z][A-Z0-9\s/().:-]+:$/.test(txt);
    const isLine = /^By:|^Name:|^Title:|^Date:/i.test(txt);
    return new Paragraph({
      spacing: {
        before: idx === 0 && isHeaderRow ? 80 : isLine ? 110 : 40,
        after: idx === lines.length - 1 ? 80 : 40
      },
      children: [
        new TextRun({
          text: txt,
          bold: isRole,
          size: 21, // 10.5pt
          font: 'Times New Roman'
        })
      ]
    });
  });

  return new TableCell({
    width: { size: 50, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    margins: { top: 40, bottom: 40, left: 60, right: 120 },
    children: paras.length ? paras : [new Paragraph({ children: [] })]
  });
}

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

  // Formal Top Caption: Ruled Centered Uppercase Legal Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 320 },
      border: {
        bottom: { style: BorderStyle.DOUBLE, size: 6, color: '111111', space: 8 }
      },
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

  let inExecutionBlock = false;
  const sigLeftLines = [];
  const sigRightLines = [];

  const flushSignatureTable = () => {
    if (sigLeftLines.length === 0 && sigRightLines.length === 0) return;
    if (sigRightLines.some(Boolean)) {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: NO_BORDERS,
          rows: [
            new TableRow({
              cantSplit: true,
              children: [
                buildSignatureCell(sigLeftLines.filter(Boolean), true),
                buildSignatureCell(sigRightLines.filter(Boolean), true)
              ]
            })
          ]
        })
      );
    } else {
      sigLeftLines.filter(Boolean).forEach((lineTxt, idx) => {
        const isRole = /^[A-Z][A-Z0-9\s/().:-]+:$/.test(lineTxt);
        children.push(
          new Paragraph({
            spacing: { before: isRole ? 180 : 100, after: 40 },
            keepNext: idx < sigLeftLines.length - 1,
            children: [
              new TextRun({
                text: lineTxt,
                bold: isRole,
                size: 21,
                font: 'Times New Roman'
              })
            ]
          })
        );
      });
    }
    sigLeftLines.length = 0;
    sigRightLines.length = 0;
  };

  // Parse lines into authentic US legal paragraphs
  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      if (inExecutionBlock && sigLeftLines.length > 0 && !sigRightLines.some(Boolean)) {
        // Blank line between stacked single-party blocks (e.g. LOI Purchaser then Seller)
        const nextNonEmpty = rawLines.slice(i + 1).find(l => l.trim() !== '');
        if (nextNonEmpty && /^(ACKNOWLEDGED AND AGREED|SELLER:|HOLDER:)/i.test(nextNonEmpty.trim())) {
          flushSignatureTable();
        }
      }
      continue;
    }

    // Detect signature trigger markers
    if (/^(IN WITNESS WHEREOF|ACKNOWLEDGED AND AGREED)/i.test(trimmed)) {
      inExecutionBlock = true;
      children.push(
        new Paragraph({
          spacing: { before: 260, after: 180, line: 276 },
          alignment: AlignmentType.JUSTIFIED,
          keepNext: true,
          children: [
            new TextRun({
              text: trimmed,
              bold: /^(ACKNOWLEDGED AND AGREED)/i.test(trimmed),
              size: 22,
              font: 'Times New Roman'
            })
          ]
        })
      );
      continue;
    }

    if (/^(Sincerely,|PURCHASER:|SELLER:|LANDLORD:|TENANT:|CLIENT:|FIRST PARTY:|PARTY A:|COMPANY:|EMPLOYER:|MAKER:|MEMBER 1:)/i.test(trimmed) || inExecutionBlock) {
      if (!inExecutionBlock && /^(Sincerely,|PURCHASER:|SELLER:)/i.test(trimmed)) {
        inExecutionBlock = true;
      }
      if (/^ACKNOWLEDGED AND AGREED/i.test(trimmed)) {
        flushSignatureTable();
        children.push(
          new Paragraph({
            spacing: { before: 240, after: 140 },
            keepNext: true,
            children: [
              new TextRun({ text: trimmed, bold: true, size: 21, font: 'Times New Roman' })
            ]
          })
        );
        continue;
      }
      if (/^Sincerely,/i.test(trimmed)) {
        children.push(
          new Paragraph({
            spacing: { before: 160, after: 120 },
            keepNext: true,
            children: [
              new TextRun({ text: trimmed, size: 22, font: 'Times New Roman' })
            ]
          })
        );
        continue;
      }

      const [leftCol, rightCol] = splitTwoColumnLine(rawLine);
      sigLeftLines.push(leftCol);
      if (rightCol) sigRightLines.push(rightCol);
      continue;
    }

    // Centered Uppercase Structural Headers
    const isCenteredHeading = /^(RECITALS|WITNESSETH|AGREEMENT|EXHIBIT\s+[A-Z0-9]+|SCHEDULE\s+[A-Z0-9]+)$/i.test(trimmed)
      || /^(ARTICLE\s+[0-9IVXLCDM]+|ADDENDUM\s+[A-Z0-9]+)\b/i.test(trimmed);
    const isMetaHeader = /^(VIA\s+ELECTRONIC|Date:|TO:|FROM:|RE:|PRINCIPAL\s+(?:SUM|AMOUNT):|INTEREST\s+RATE:)/i.test(trimmed);
    const subsectionMatch = trimmed.match(/^([0-9]+\.[0-9]+|[A-Z]\.[0-9]+)\s+([^.]+?\.)\s*(.*)$/);
    const recitalMatch = trimmed.match(/^(WHEREAS,|NOW,\s*THEREFORE,)\s*(.*)$/);

    if (isCenteredHeading) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          keepNext: true,
          spacing: { before: 260, after: 120 },
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
    } else if (recitalMatch) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 360 }, // 0.25in formal recital lead-in
          spacing: { before: 60, after: 120, line: 276 },
          children: [
            new TextRun({
              text: `${recitalMatch[1]} `,
              bold: true,
              size: 22,
              font: 'Times New Roman'
            }),
            new TextRun({
              text: recitalMatch[2],
              size: 22,
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else if (subsectionMatch) {
      // Bold ONLY the Section number & lead-in title; keep body regular weight!
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 360 },
          spacing: { before: 120, after: 120, line: 276 },
          children: [
            new TextRun({
              text: `${subsectionMatch[1]} ${subsectionMatch[2]} `,
              bold: true,
              size: 22, // 11pt
              font: 'Times New Roman'
            }),
            new TextRun({
              text: subsectionMatch[3],
              bold: false,
              size: 22,
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else if (isMetaHeader) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 40, after: 60, line: 240 },
          children: [
            new TextRun({
              text: trimmed,
              bold: /^(VIA\s+ELECTRONIC)/i.test(trimmed),
              size: 21,
              font: 'Times New Roman'
            })
          ]
        })
      );
    } else {
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 140, line: 276 }, // 1.15 line spacing
          alignment: AlignmentType.JUSTIFIED,
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

  flushSignatureTable();

  // Construct Document with 1-inch standard legal margins (1440 twips = 1 inch) and clean page footer
  const doc = new Document({
    title: title,
    subject: `Institutional Legal Agreement — ${jurisdiction}`,
    creator: 'Nexus ContractGuard Legal Drafting Suite',
    description: 'Pre-signing commercial contract draft formatted to U.S. commercial legal conventions.',
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
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 18,
                    font: 'Times New Roman',
                    color: '555555'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: 'Times New Roman',
                    color: '555555'
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 18,
                    font: 'Times New Roman',
                    color: '555555'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    font: 'Times New Roman',
                    color: '555555'
                  })
                ]
              })
            ]
          })
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

/**
 * Generates an institutional Microsoft Word (.docx) document containing 
 * visual Redline Markup (Track Changes visual equivalent):
 * - Additions: Blue bold text with single underline
 * - Deletions: Red text with strikethrough
 * - Preserves formal AmLaw 100 paragraph formatting
 */
export async function downloadRedlineDOCX(diffData, options = {}) {
  const {
    title = 'Master Commercial Agreement',
    clientParty = 'Client Principal',
    counterparty = 'Counterparty Entity',
    date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } = options;

  if (!diffData || !Array.isArray(diffData.segments)) {
    throw new Error('Valid diffData with segments array is required for Redline DOCX export.');
  }

  const stats = diffData.stats || {};
  const children = [];

  // Formal Header Block
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'REDLINE COMPARATIVE AUDIT & TRACK CHANGES MARKUP',
          bold: true,
          size: 26,
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24,
          font: 'Times New Roman',
          color: '222222'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 300 },
      children: [
        new TextRun({
          text: `Baseline Draft vs. Proposed Counterparty Markup • ${date}`,
          italics: true,
          size: 19,
          font: 'Times New Roman',
          color: '555555'
        })
      ]
    })
  );

  // Redline Legend Box (Standard Transactional Practice)
  children.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({
          text: 'REDLINE MARKUP LEGEND:',
          bold: true,
          size: 19,
          font: 'Times New Roman',
          color: '333333'
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: '1. DELETED TEXT (Baseline): ',
          bold: true,
          size: 19,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: 'Stricken in red strikethrough (e.g., ',
          size: 19,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: 'proposed deletion',
          strike: true,
          color: 'C00000',
          size: 19,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: ')',
          size: 19,
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 240 },
      children: [
        new TextRun({
          text: '2. ADDED TEXT (Counterparty): ',
          bold: true,
          size: 19,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: 'Shown in blue underline (e.g., ',
          size: 19,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: 'proposed addition',
          underline: { type: 'single' },
          color: '0070C0',
          bold: true,
          size: 19,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: ')',
          size: 19,
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 360 },
      children: [
        new TextRun({
          text: `Summary of Changes: ${stats.additions || 0} additions, ${stats.deletions || 0} deletions. Client: ${clientParty} | Counterparty: ${counterparty}.`,
          italics: true,
          size: 18,
          font: 'Times New Roman',
          color: '666666'
        })
      ]
    })
  );

  // Divider
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 300 },
      children: [
        new TextRun({
          text: '_________________________________________________________________________________',
          size: 16,
          color: 'CCCCCC'
        })
      ]
    })
  );

  // Group diff segments into paragraphs by newline
  let currentParaRuns = [];

  const flushParagraph = () => {
    if (currentParaRuns.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 120, line: 276 },
          children: [...currentParaRuns]
        })
      );
      currentParaRuns = [];
    }
  };

  for (const seg of diffData.segments) {
    const rawVal = seg.value || '';
    const parts = rawVal.split(/\r?\n/);

    for (let pIdx = 0; pIdx < parts.length; pIdx++) {
      const part = parts[pIdx];

      if (part.length > 0) {
        if (seg.type === 'added') {
          currentParaRuns.push(
            new TextRun({
              text: part,
              underline: { type: 'single' },
              color: '0070C0',
              bold: true,
              size: 22,
              font: 'Times New Roman'
            })
          );
        } else if (seg.type === 'removed') {
          currentParaRuns.push(
            new TextRun({
              text: part,
              strike: true,
              color: 'C00000',
              size: 22,
              font: 'Times New Roman'
            })
          );
        } else {
          currentParaRuns.push(
            new TextRun({
              text: part,
              size: 22,
              font: 'Times New Roman'
            })
          );
        }
      }

      // If there are more parts, that means there was a newline
      if (pIdx < parts.length - 1) {
        flushParagraph();
      }
    }
  }

  // Flush any remaining runs
  flushParagraph();

  // Document Footer Disclaimer
  children.push(
    new Paragraph({
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: 'CONFIDENTIAL WORK PRODUCT  PREPARED VIA NEXUS CONTRACTGUARD AIR-GAPPED IN-RAM ENGINE',
          size: 16,
          color: '888888',
          italics: true
        })
      ]
    })
  );

  // Build Document
  const doc = new Document({
    title: `${title} — Redline Markup`,
    subject: 'Forensic Redline Comparison',
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
  const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 35) || 'Contract';
  const outFileName = `${cleanTitle}_Redline_TrackChanges.docx`;

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
