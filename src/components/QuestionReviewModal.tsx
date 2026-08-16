import React, { useState, useCallback } from 'react';
// Types imported as any
import Modal from './UI/Modal';
import Button from './UI/Button';
import Alert from './UI/Alert';
import QuestionEditor from './QuestionEditor';
import { regenerateSingleQuestion, generateSimilarQuestions } from '../services/aiService';

export interface QuestionReviewModalProps {
  isOpen: boolean;
  sourceQuestion?: any;
  generatedQuestions: any[];
  onClose: () => void;
  onSave: (questions: any[]) => void;
  regenerating?: boolean;
}

const QuestionReviewModal: React.FC<QuestionReviewModalProps> = ({
  isOpen,
  sourceQuestion,
  generatedQuestions,
  onClose,
  onSave,
}) => {
  const [questions, setQuestions] = useState<any[]>(generatedQuestions || []);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [includedQuestions, setIncludedQuestions] = useState<Set<string>>(
    new Set(generatedQuestions?.map((q: any) => q.id) || [])
  );

  React.useEffect(() => {
    if (generatedQuestions && generatedQuestions.length > 0) {
      console.log('Generated questions:', generatedQuestions);
      setQuestions([...generatedQuestions]);
      setIncludedQuestions(new Set(generatedQuestions.map((q: any) => q.id)));
      setSelectedQuestionId(generatedQuestions[0].id);
    }
  }, [generatedQuestions, isOpen]);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const handleQuestionUpdate = useCallback((updatedQuestion: any) => {
    setQuestions(prev =>
      prev.map(q => (q.id === updatedQuestion.id ? { ...updatedQuestion, edited: true } : q))
    );
  }, []);

  const handleToggleInclude = useCallback((questionId: string) => {
    setIncludedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  const handleRegenerateQuestion = useCallback(async (questionId: string) => {
    if (!sourceQuestion) return;

    try {
      setError(null);
      setRegeneratingId(questionId);

      const newQuestion = await regenerateSingleQuestion(sourceQuestion, true);
      newQuestion.id = questionId;

      setQuestions(prev =>
        prev.map(q => (q.id === questionId ? newQuestion : q))
      );
    } catch (err) {
      setError('Failed to regenerate question. Please try again.');
      console.error('Regeneration error:', err);
    } finally {
      setRegeneratingId(null);
    }
  }, [sourceQuestion]);

  const handleRegenerateAll = useCallback(async () => {
    if (!sourceQuestion) return;

    try {
      setError(null);
      setRegeneratingId('all');

      const result = await generateSimilarQuestions(sourceQuestion, questions.length, true);
      setQuestions(result.questions);
    } catch (err) {
      setError('Failed to regenerate questions. Please try again.');
      console.error('Regeneration error:', err);
    } finally {
      setRegeneratingId(null);
    }
  }, [sourceQuestion, questions.length]);

  const handleSave = useCallback(() => {
    const selectedQuestions = questions.filter(q => includedQuestions.has(q.id));
    if (selectedQuestions.length === 0) {
      setError('Please select at least one question to save.');
      return;
    }
    onSave(selectedQuestions);
    setIncludedQuestions(new Set(selectedQuestions.map(q => q.id)));
  }, [questions, includedQuestions, onSave]);

  if (!isOpen) return null;

  const selectedCount = includedQuestions.size;

  return (
    <Modal
      isOpen={isOpen}
      title="Review Generated Questions"
      onClose={onClose}
      size="xl"
      closeButton={false}
    >
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {sourceQuestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Source Question</h4>
          <p className="text-blue-800 text-sm">{sourceQuestion.text}</p>
          {sourceQuestion.choices && (
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>A) {sourceQuestion.choices.a}</p>
              <p>B) {sourceQuestion.choices.b}</p>
              <p>C) {sourceQuestion.choices.c}</p>
              <p>D) {sourceQuestion.choices.d}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1.5rem', maxHeight: '400px', overflow: 'hidden' }}>
        {/* Question List - Compact */}
        <div style={{ border: '1px solid #ddd', borderRadius: '0.5rem', overflow: 'auto' }}>
          <div style={{ backgroundColor: '#f3f4f6', padding: '0.75rem', borderBottom: '1px solid #ddd', fontWeight: 'bold', fontSize: '0.875rem', position: 'sticky', top: 0 }}>
            Questions
          </div>
          <div>
            {questions.map((question, idx) => (
              <button
                key={question.id}
                onClick={() => setSelectedQuestionId(question.id)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  textAlign: 'left',
                  borderLeft: selectedQuestionId === question.id ? '4px solid #2563eb' : '4px solid transparent',
                  backgroundColor: selectedQuestionId === question.id ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                <input
                  type="checkbox"
                  checked={includedQuestions.has(question.id)}
                  onChange={() => handleToggleInclude(question.id)}
                  onClick={e => e.stopPropagation()}
                  style={{ cursor: 'pointer' }}
                />
                <span>Q{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Editor */}
        <div style={{ overflow: 'auto', border: '1px solid #ddd', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#fafafa' }}>
          {selectedQuestion ? (
            <QuestionEditor question={selectedQuestion} onUpdate={handleQuestionUpdate} />
          ) : (
            <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
              Select a question to edit
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
        <p className="text-gray-600">
          <strong>{selectedCount}</strong> of <strong>{questions.length}</strong> questions selected for export
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="md"
          onClick={handleRegenerateAll}
          disabled={regeneratingId !== null}
          loading={regeneratingId === 'all'}
        >
          ↻ Regenerate All
        </Button>

        {selectedQuestion && (
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleRegenerateQuestion(selectedQuestion.id)}
            disabled={regeneratingId !== null}
            loading={regeneratingId === selectedQuestion.id}
          >
            ↻ Regenerate This
          </Button>
        )}

        <Button variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="success"
          size="md"
          onClick={handleSave}
          disabled={selectedCount === 0}
          className="ml-auto"
        >
          ✓ Save Questions
        </Button>
      </div>
    </Modal>
  );
};

export default QuestionReviewModal;
