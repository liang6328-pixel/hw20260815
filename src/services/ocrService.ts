// Types imported as any

// Mock OCR implementation
const mockOCRData = `
1. What is the capital of France?
   A) London
   B) Paris
   C) Berlin
   D) Madrid

2. Which planet is known as the Red Planet?
   A) Venus
   B) Mars
   C) Jupiter
   D) Saturn

3. What is the chemical symbol for Gold?
   A) Go
   B) Gd
   C) Au
   D) Ag

4. Who wrote Romeo and Juliet?
   A) Jane Austen
   B) Charles Dickens
   C) William Shakespeare
   D) Mark Twain

5. What is 15 × 12?
   A) 150
   B) 160
   C) 180
   D) 200
`;

function extractQuestionsFromText(text: string): any[] {
  const questions: any[] = [];
  const lines = text.split('\n');

  let currentQuestion: any = null;
  let currentChoices: any = {};

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    // Check if this is a question number (e.g., "1." or "2.")
    const questionMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);

    if (questionMatch) {
      // Save previous question if exists
      if (currentQuestion && currentQuestion.text) {
        currentQuestion.id = `q-${questions.length + 1}`;
        currentQuestion.type = Object.keys(currentChoices).length === 4 ? 'multiple-choice' : 'short-answer';

        if (currentQuestion.type === 'multiple-choice') {
          currentQuestion.choices = currentChoices;
        }

        questions.push(currentQuestion);
      }

      // Start new question
      currentQuestion = {
        text: questionMatch[2],
      };
      currentChoices = {};
    }
    // Check if this is a choice (A, B, C, D)
    else if (trimmed.match(/^[A-D]\)\s+/)) {
      const match = trimmed.match(/^([A-D])\)\s+(.+)$/);
      if (match && currentQuestion) {
        const choiceKey = match[1].toLowerCase();
        currentChoices[choiceKey] = match[2];
      }
    }
  }

  // Add last question
  if (currentQuestion && currentQuestion.text) {
    currentQuestion.id = `q-${questions.length + 1}`;
    currentQuestion.type = Object.keys(currentChoices).length === 4 ? 'multiple-choice' : 'short-answer';

    if (currentQuestion.type === 'multiple-choice') {
      currentQuestion.choices = currentChoices;
    }

    questions.push(currentQuestion);
  }

  console.log('Extracted questions:', questions.length);
  return questions;
}

export async function processImageWithOCR(
  imageData: string | File,
  useMockMode: boolean = true
): Promise<OCRResult> {
  if (useMockMode) {
    return mockOCRProcess(imageData);
  }
  return realOCRProcess(imageData);
}

async function mockOCRProcess(imageData: string | File): Promise<OCRResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    text: mockOCRData,
    confidence: 0.95,
    detected_questions: [],
  };
}

async function realOCRProcess(imageData: string | File): Promise<OCRResult> {
  // This would call a real OCR service like:
  // - Tesseract.js
  // - Google Cloud Vision API
  // - AWS Textract
  // For now, we'll use Tesseract.js as a fallback

  try {
    // In a real implementation, you would use Tesseract.js or another OCR library
    // For this MVP, we'll fall back to mock
    console.warn('Real OCR not implemented yet, using mock mode');
    return mockOCRProcess(imageData);
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error('Failed to process image with OCR');
  }
}

export function extractQuestionsFromOCRResult(ocrResult: any): any[] {
  return extractQuestionsFromText(ocrResult.text);
}

export function validateOCRResult(result: any): boolean {
  return result.text && result.text.length > 10 && result.confidence > 0.5;
}
