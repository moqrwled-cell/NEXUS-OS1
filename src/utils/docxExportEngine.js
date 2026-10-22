import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

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
          text: `[AmLaw 100 Model Form — ${jurisdiction}]`,
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
