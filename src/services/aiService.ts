// Types imported as any

function generateMockQuestions(sourceQuestion: any, count: number = 5): any[] {
  const questions: any[] = [];

  // Math problem definitions with correct answers
  const mathProblems = [
    { text: '18 × 14', answer: 252 },
    { text: '22 × 11', answer: 242 },
    { text: '16 × 13', answer: 208 },
    { text: '25 × 10', answer: 250 },
    { text: '20 × 12', answer: 240 },
  ];

  for (let i = 0; i < count; i++) {
    const newQuestion: any = {
      ...structuredClone(sourceQuestion),
      id: `gen-${sourceQuestion.id}-${i}`,
      sourceQuestionId: sourceQuestion.id,
      edited: false,
    };

    if (sourceQuestion.type === 'multiple-choice' && sourceQuestion.choices) {
      const problem = mathProblems[i % mathProblems.length];
      const correctAnswer = problem.answer;

      const variations = [
        `Calculate: ${problem.text} = ?`,
        `What is the product of ${problem.text}?`,
        `Multiply: ${problem.text}`,
        `${problem.text} equals:`,
        `Find the result: ${problem.text}`,
      ];

      // Create answer choices with correct answer and plausible wrong answers
      const correctAnswerIndex = i % 4; // Put correct answer in different positions
      const wrongAnswers = [
        correctAnswer - 20,
        correctAnswer + 15,
        correctAnswer - 35,
      ];

      const choices: any = {};
      let wrongAnswerIndex = 0;

      for (let j = 0; j < 4; j++) {
        if (j === correctAnswerIndex) {
          choices[String.fromCharCode(97 + j)] = String(correctAnswer);
        } else {
          choices[String.fromCharCode(97 + j)] = String(wrongAnswers[wrongAnswerIndex++]);
        }
      }

      newQuestion.text = variations[i % variations.length];
      newQuestion.choices = choices;
      newQuestion.correctAnswer = String.fromCharCode(97 + correctAnswerIndex);
    } else if (sourceQuestion.type === 'short-answer') {
      newQuestion.text = `Explain: ${sourceQuestion.text.substring(0, 40)}... (Variation ${i + 1})`;
    } else {
      newQuestion.text = `${sourceQuestion.text} (Variation ${i + 1})`;
    }

    questions.push(newQuestion);
  }

  return questions;
}

export async function generateSimilarQuestions(
  sourceQuestion: any,
  count: number = 5,
  useMockMode: boolean = true
): Promise<GenerationResult> {
  if (useMockMode) {
    return mockAIGeneration(sourceQuestion, count);
  }
  return realAIGeneration(sourceQuestion, count);
}

async function mockAIGeneration(
  sourceQuestion: any,
  count: number = 5
): Promise<GenerationResult> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 2000));

  const generatedQuestions = generateMockQuestions(sourceQuestion, count);

  return {
    questions: generatedQuestions,
    modelUsed: 'mock-gpt-4',
  };
}

async function realAIGeneration(
  sourceQuestion: any,
  count: number = 5
): Promise<GenerationResult> {
  // This would call a real AI API like:
  // - OpenAI GPT-4
  // - Anthropic Claude
  // - Google PaLM
  // - HuggingFace Inference API

  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: sourceQuestion,
        count,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result as GenerationResult;
  } catch (error) {
    console.error('AI generation failed, falling back to mock:', error);
    // Fallback to mock mode
    return mockAIGeneration(sourceQuestion, count);
  }
}

export async function regenerateSingleQuestion(
  sourceQuestion: any,
  useMockMode: boolean = true
): Promise<GeneratedQuestion> {
  const result = await generateSimilarQuestions(sourceQuestion, 1, useMockMode);
  return result.questions[0];
}

export function validateGeneratedQuestions(questions: any[]): boolean {
  return (
    Array.isArray(questions) &&
    questions.length > 0 &&
    questions.every(q => q.text && q.text.length > 5)
  );
}
