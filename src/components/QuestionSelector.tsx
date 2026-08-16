import React from 'react';
import Button from './UI/Button';
import { truncate } from '../utils/helpers';

export interface QuestionSelectorProps {
  questions: any[];
  selectedQuestionId?: string;
  onSelectQuestion: (question: any) => void;
  onGenerateQuestions?: (question: any) => void;
  generating?: boolean;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onGenerateQuestions,
  generating = false,
}) => {
  if (questions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No questions detected</p>
          <p className="text-gray-400 text-sm">Extract text from an image to see questions here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4">Select a Question</h3>
      <p className="text-sm text-gray-600 mb-4">{questions.length} question(s) detected</p>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {questions.map((question) => (
          <button
            key={question.id}
            onClick={() => onSelectQuestion(question)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
              selectedQuestionId === question.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <p className="font-medium text-sm">{truncate(question.text, 60)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Type: {question.type === 'multiple-choice' ? 'Multiple Choice' : 'Short Answer'}
            </p>
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={() => {
          const selected = questions.find(q => q.id === selectedQuestionId);
          if (selected && onGenerateQuestions) {
            onGenerateQuestions(selected);
          }
        }}
        disabled={!selectedQuestionId || generating}
        loading={generating}
        className="w-full"
      >
        {generating ? 'Generating...' : '✨ Generate Similar Questions'}
      </Button>
    </div>
  );
};

export default QuestionSelector;
