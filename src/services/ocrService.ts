import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

type OCRResult = { text: string; confidence: number; detected_questions: any[]; summary?: string };

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

function extractQuestionsFromText(text: string): any[] {
  const questions: any[] = [];
  const lines = text.split('\n');

  let currentQuestion: any = null;
  let currentChoices: any = {};

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const questionMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);

    if (questionMatch) {
      if (currentQuestion && currentQuestion.text) {
        currentQuestion.id = `q-${questions.length + 1}`;
        currentQuestion.type = Object.keys(currentChoices).length === 4 ? 'multiple-choice' : 'short-answer';
        if (currentQuestion.type === 'multiple-choice') {
          currentQuestion.choices = currentChoices;
        }
        questions.push(currentQuestion);
      }

      currentQuestion = { text: questionMatch[2] };
      currentChoices = {};
    } else if (trimmed.match(/^[A-D]\)\s+/)) {
      const match = trimmed.match(/^([A-D])\)\s+(.+)$/);
      if (match && currentQuestion) {
        currentChoices[match[1].toLowerCase()] = match[2];
      }
    }
  }

  if (currentQuestion && currentQuestion.text) {
    currentQuestion.id = `q-${questions.length + 1}`;
    currentQuestion.type = Object.keys(currentChoices).length === 4 ? 'multiple-choice' : 'short-answer';
    if (currentQuestion.type === 'multiple-choice') {
      currentQuestion.choices = currentChoices;
    }
    questions.push(currentQuestion);
  }

  return questions;
}

async function summarizeText(text: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('Deepseek API key not configured');
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `Please summarize the following text in 3-5 bullet points:\n\n${text}`,
        },
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Deepseek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function processImageWithOCR(
  imageData: string | File,
  useMockMode: boolean = true
): Promise<OCRResult> {
  return realOCRProcess(imageData);
}

async function realOCRProcess(imageData: string | File): Promise<OCRResult> {
  try {
    if (!DEEPSEEK_API_KEY) {
      throw new Error('Deepseek API key not configured. Add VITE_DEEPSEEK_API_KEY to .env');
    }

    let text = '';

    // Handle PDF files
    if (imageData instanceof File && imageData.type === 'application/pdf') {
      text = await extractTextFromPDF(imageData);
    } else {
      // Handle image files
      let base64Image = '';
      if (typeof imageData === 'string') {
        base64Image = imageData.split(',')[1] || imageData;
      } else {
        const buffer = await imageData.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        base64Image = String.fromCharCode(...bytes);
        base64Image = btoa(base64Image);
      }

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-vision',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
                {
                  type: 'text',
                  text: 'Extract all text from this image. Focus on questions and answers. Format them clearly with numbered questions and answer choices (A, B, C, D). Return the raw text exactly as it appears.',
                },
              ],
            },
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Deepseek API error: ${response.statusText}`);
      }

      const data = await response.json();
      text = data.choices?.[0]?.message?.content || '';
    }

    // Generate summary
    const summary = await summarizeText(text);

    return {
      text,
      summary,
      confidence: 0.9,
      detected_questions: [],
    };
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error(`Failed to process file: ${(error as any).message}`);
  }
}

export function extractQuestionsFromOCRResult(ocrResult: any): any[] {
  return extractQuestionsFromText(ocrResult.text);
}

export function validateOCRResult(result: any): boolean {
  return result.text && result.text.length > 10 && result.confidence > 0.5;
}
