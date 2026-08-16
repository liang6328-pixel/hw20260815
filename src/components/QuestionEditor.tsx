import React, { useState, useCallback } from 'react';
// Types imported as any
import Button from './UI/Button';

export interface QuestionEditorProps {
  question: any;
  onUpdate: (question: any) => void;
  compact?: boolean;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
  compact = false,
}) => {
  const [editedQuestion, setEditedQuestion] = useState<any>(question);

  React.useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleQuestionTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedQuestion(prev => ({
      ...prev,
      text: e.target.value,
    }));
  }, []);

  const handleChoiceChange = useCallback((choice: 'a' | 'b' | 'c' | 'd', value: string) => {
    setEditedQuestion(prev => ({
      ...prev,
      choices: prev.choices
        ? { ...prev.choices, [choice]: value }
        : prev.choices,
    }));
  }, []);

  const handleCorrectAnswerChange = useCallback((value: string) => {
    setEditedQuestion(prev => ({
      ...prev,
      correctAnswer: value,
    }));
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(editedQuestion);
  }, [editedQuestion, onUpdate]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto">
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
        <textarea
          value={editedQuestion.text}
          onChange={handleQuestionTextChange}
          onBlur={handleSave}
          className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Question text"
        />
      </div>

      {editedQuestion.type === 'multiple-choice' && editedQuestion.choices && (
        <div className="space-y-3">
          {(['a', 'b', 'c', 'd'] as const).map(choice => (
            <div key={choice}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choice {choice.toUpperCase()}
              </label>
              <input
                type="text"
                value={editedQuestion.choices![choice]}
                onChange={e => handleChoiceChange(choice, e.target.value)}
                onBlur={handleSave}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Option ${choice.toUpperCase()}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer
            </label>
            <select
              value={editedQuestion.correctAnswer || 'a'}
              onChange={e => handleCorrectAnswerChange(e.target.value)}
              onBlur={handleSave}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </div>
        </div>
      )}

      {editedQuestion.type === 'short-answer' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p className="font-medium mb-1">Short Answer Question</p>
          <p>Students should provide a written response to this question.</p>
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;
