export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'unknown';
  choices?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GeneratedQuestion extends Question {
  sourceQuestionId: string;
  edited: boolean;
}

export interface TestSession {
  id: string;
  title: string;
  createdAt: Date;
  sourceImage?: string;
  extractedText: string;
  originalQuestions: Question[];
  generatedQuestions: GeneratedQuestion[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  detected_questions: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
  }>;
}

export interface GenerationRequest {
  question: Question;
  count: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GenerationResult {
  questions: GeneratedQuestion[];
  modelUsed: string;
}

export type ExportFormat = 'txt' | 'docx' | 'pdf' | 'json';
