// Types imported as any
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, BorderStyle } from 'docx';

export interface ExportData {
  title: string;
  sourceQuestion?: any;
  questions: any[];
  timestamp: Date;
}

function generateFileName(format: any): string {
  const date = new Date().toISOString().split('T')[0];
  return `mock_test_questions_${date}.${format}`;
}

export function formatQuestionsAsText(data: ExportData): string {
  let text = `Mock Test Questions\n`;
  text += `Generated: ${data.timestamp.toLocaleString()}\n`;
  text += `Title: ${data.title}\n`;
  text += `\n${'='.repeat(50)}\n\n`;

  if (data.sourceQuestion) {
    text += `SOURCE QUESTION:\n`;
    text += `${data.sourceQuestion.text}\n\n`;
    if (data.sourceQuestion.choices) {
      text += `A) ${data.sourceQuestion.choices.a}\n`;
      text += `B) ${data.sourceQuestion.choices.b}\n`;
      text += `C) ${data.sourceQuestion.choices.c}\n`;
      text += `D) ${data.sourceQuestion.choices.d}\n`;
    }
    text += `\n${'='.repeat(50)}\n\n`;
  }

  text += `GENERATED QUESTIONS (${data.questions.length}):\n\n`;

  data.questions.forEach((q, index) => {
    text += `${index + 1}. ${q.text}\n`;

    if (q.choices) {
      text += `   A) ${q.choices.a}\n`;
      text += `   B) ${q.choices.b}\n`;
      text += `   C) ${q.choices.c}\n`;
      text += `   D) ${q.choices.d}\n`;

      if (q.correctAnswer) {
        text += `   Correct Answer: ${q.correctAnswer.toUpperCase()}\n`;
      }
    }
    text += `\n`;
  });

  return text;
}

export async function exportAsText(data: ExportData): Promise<void> {
  const text = formatQuestionsAsText(data);
  const blob = new Blob([text], { type: 'text/plain' });
  downloadFile(blob, generateFileName('txt'));
}

export async function exportAsJSON(data: ExportData): Promise<void> {
  const json = JSON.stringify(
    {
      title: data.title,
      sourceQuestion: data.sourceQuestion,
      questions: data.questions,
      exportedAt: data.timestamp.toISOString(),
      questionCount: data.questions.length,
    },
    null,
    2
  );

  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, generateFileName('json'));
}

export async function exportAsPDF(data: ExportData): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // Header
  pdf.setFontSize(18);
  pdf.text('Mock Test Questions', pageWidth / 2, y, { align: 'center' });
  y += 10;

  pdf.setFontSize(10);
  pdf.text(`Generated: ${data.timestamp.toLocaleDateString()}`, pageWidth / 2, y, {
    align: 'center',
  });
  y += 8;

  pdf.text(`Title: ${data.title}`, margin, y);
  y += 10;

  // Source question
  if (data.sourceQuestion) {
    pdf.setFontSize(11);
    pdf.text('SOURCE QUESTION:', margin, y);
    y += 6;

    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(data.sourceQuestion.text, pageWidth - 2 * margin);
    lines.forEach(line => {
      if (y + 4 > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += 4;
    });

    if (data.sourceQuestion.choices) {
      y += 2;
      Object.entries(data.sourceQuestion.choices).forEach(([key, value]) => {
        if (y + 4 > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(`${key.toUpperCase()}) ${value}`, margin + 5, y);
        y += 4;
      });
    }
    y += 6;
  }

  // Generated questions
  pdf.setFontSize(11);
  pdf.text(`GENERATED QUESTIONS (${data.questions.length}):`, margin, y);
  y += 8;

  pdf.setFontSize(10);
  data.questions.forEach((q, index) => {
    if (y + 8 > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }

    pdf.text(`${index + 1}. `, margin, y);
    const qLines = pdf.splitTextToSize(q.text, pageWidth - 2 * margin - 10);
    qLines.forEach((line, i) => {
      pdf.text(line, margin + (i === 0 ? 10 : 0), y + i * 4);
    });
    y += qLines.length * 4 + 2;

    if (q.choices) {
      Object.entries(q.choices).forEach(([key, value]) => {
        if (y + 4 > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        const cLines = pdf.splitTextToSize(`${key.toUpperCase()}) ${value}`, pageWidth - 2 * margin - 15);
        cLines.forEach((line, i) => {
          pdf.text(line, margin + 10, y + i * 4);
        });
        y += cLines.length * 4;
      });

      if (q.correctAnswer) {
        pdf.text(`Correct Answer: ${q.correctAnswer.toUpperCase()}`, margin + 10, y);
        y += 4;
      }
    }

    y += 4;
  });

  pdf.save(generateFileName('pdf'));
}

export async function exportAsDOCX(data: ExportData): Promise<void> {
  const rows: TableRow[] = [];

  // Add header row
  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: 'Question', bold: true })],
          shading: { fill: 'E0E0E0' },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Choices', bold: true })],
          shading: { fill: 'E0E0E0' },
        }),
      ],
    })
  );

  // Add question rows
  data.questions.forEach((q) => {
    const choiceText = q.choices
      ? `A) ${q.choices.a}\nB) ${q.choices.b}\nC) ${q.choices.c}\nD) ${q.choices.d}\n\nCorrect: ${q.correctAnswer || '?'}`
      : 'Short Answer';

    rows.push(
      new TableRow({
        cells: [
          new TableCell({
            children: [new Paragraph(q.text)],
          }),
          new TableCell({
            children: [new Paragraph(choiceText)],
          }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Mock Test Questions',
            size: 36,
            bold: true,
          }),
          new Paragraph({
            text: `Generated: ${data.timestamp.toLocaleString()}`,
            size: 20,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Title: ${data.title}`,
            size: 24,
            spacing: { after: 200 },
          }),
          ...(data.sourceQuestion
            ? [
                new Paragraph({
                  text: 'Source Question:',
                  bold: true,
                  size: 24,
                }),
                new Paragraph({
                  text: data.sourceQuestion.text,
                  spacing: { after: 200 },
                }),
              ]
            : []),
          new Paragraph({
            text: `Generated Questions (${data.questions.length}):`,
            bold: true,
            size: 24,
            spacing: { before: 200, after: 200 },
          }),
          new Table({
            rows,
            width: { size: 100, type: 'pct' },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadFile(blob, generateFileName('docx'));
}

export async function exportQuestions(
  data: ExportData,
  format: any
): Promise<void> {
  try {
    switch (format) {
      case 'txt':
        await exportAsText(data);
        break;
      case 'json':
        await exportAsJSON(data);
        break;
      case 'pdf':
        await exportAsPDF(data);
        break;
      case 'docx':
        await exportAsDOCX(data);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export questions as ${format}`);
  }
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
