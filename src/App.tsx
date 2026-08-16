import React, { useState, useCallback } from 'react';
import Navigation from './components/Navigation';
import CameraCapture from './components/CameraCapture';
import FileImporter from './components/FileImporter';
import QuestionCanvas from './components/QuestionCanvas';
import QuestionSelector from './components/QuestionSelector';
import QuestionReviewModal from './components/QuestionReviewModal';
import ExportManager from './components/ExportManager';
import Alert from './components/UI/Alert';
import Button from './components/UI/Button';
import { processImageWithOCR, extractQuestionsFromOCRResult } from './services/ocrService';
import { generateSimilarQuestions } from './services/aiService';

type AppStep = 'input' | 'extraction' | 'selection' | 'review' | 'export';

interface Question {
  id: string;
  text: string;
  type: string;
  choices?: { a: string; b: string; c: string; d: string };
  correctAnswer?: string;
}

interface GeneratedQuestion extends Question {
  sourceQuestionId: string;
  edited: boolean;
}

interface AppState {
  step: AppStep;
  extractedText: string;
  extractedQuestions: Question[];
  selectedQuestion?: Question;
  generatedQuestions: GeneratedQuestion[];
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    step: 'input',
    extractedText: '',
    extractedQuestions: [],
    generatedQuestions: [],
  });

  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleImageCapture = useCallback(async (imageData: string) => {
    try {
      setError(null);
      setLoading(true);
      const ocrResult = await processImageWithOCR(imageData, demoMode);
      const questions = extractQuestionsFromOCRResult(ocrResult);
      setAppState(prev => ({
        ...prev,
        step: 'extraction',
        extractedText: ocrResult.text,
        extractedQuestions: questions,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR failed');
    } finally {
      setLoading(false);
    }
  }, [demoMode]);

  const handleFileImport = useCallback(async (file: File) => {
    try {
      setError(null);
      setLoading(true);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageData = event.target?.result as string;
          await handleImageCapture(imageData);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Use image files (JPG, PNG, WEBP)');
        setLoading(false);
      }
    } catch (err) {
      setError('Import failed');
      setLoading(false);
    }
  }, [handleImageCapture]);

  const handleTextChange = useCallback((text: string) => {
    const questions = extractQuestionsFromOCRResult({ text, confidence: 0.9, detected_questions: [] });
    setAppState(prev => ({ ...prev, extractedText: text, extractedQuestions: questions }));
  }, []);

  const handleSelectQuestion = useCallback((question: Question) => {
    setAppState(prev => ({ ...prev, step: 'selection', selectedQuestion: question }));
  }, []);

  const handleGenerateQuestions = useCallback(async (question: Question) => {
    try {
      setError(null);
      setGenerating(true);
      const result = await generateSimilarQuestions(question as any, 5, demoMode);
      setAppState(prev => ({
        ...prev,
        step: 'review',
        selectedQuestion: question,
        generatedQuestions: result.questions as any,
      }));
    } catch (err) {
      setError('Generation failed');
    } finally {
      setGenerating(false);
    }
  }, [demoMode]);

  const handleSaveQuestions = useCallback((selectedQuestions: GeneratedQuestion[]) => {
    setAppState(prev => ({ ...prev, step: 'export', generatedQuestions: selectedQuestions }));
  }, []);

  const handleNewTest = useCallback(() => {
    setAppState({ step: 'input', extractedText: '', extractedQuestions: [], generatedQuestions: [] });
    setError(null);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navigation onNewTest={handleNewTest} demoMode={demoMode} onToggleDemoMode={setDemoMode} />
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {error && <Alert type="error" title="Error" message={error} onClose={() => setError(null)} />}

        {appState.step === 'input' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <CameraCapture onCapture={handleImageCapture} onCancel={() => {}} />
            <FileImporter onFileSelect={handleFileImport} onCancel={() => {}} />
          </div>
        )}

        {['extraction', 'selection', 'review', 'export'].includes(appState.step) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <QuestionCanvas extractedText={appState.extractedText} onTextChange={handleTextChange} loading={loading} />
            <QuestionSelector questions={appState.extractedQuestions} selectedQuestionId={appState.selectedQuestion?.id} onSelectQuestion={handleSelectQuestion} onGenerateQuestions={handleGenerateQuestions} generating={generating} />
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {appState.step === 'export' ? (
                <ExportManager sourceQuestion={appState.selectedQuestion as any} generatedQuestions={appState.generatedQuestions as any} onClose={handleNewTest} />
              ) : (
                <>
                  <h3 style={{ margin: '0 0 1rem 0' }}>Summary</h3>
                  <p>Questions: {appState.extractedQuestions.length}</p>
                  <p>Selected: {appState.selectedQuestion?.text?.substring(0, 30) || 'None'}</p>
                  <p>Generated: {appState.generatedQuestions.length}</p>
                  {appState.step === 'selection' && appState.selectedQuestion && (
                    <Button variant="primary" size="lg" onClick={() => handleGenerateQuestions(appState.selectedQuestion!)} disabled={generating} loading={generating} style={{ width: '100%', marginTop: '1rem' }}>
                      Generate
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <QuestionReviewModal isOpen={appState.step === 'review'} sourceQuestion={appState.selectedQuestion as any} generatedQuestions={appState.generatedQuestions as any} onClose={() => setAppState(prev => ({ ...prev, step: 'selection' }))} onSave={handleSaveQuestions} regenerating={generating} />
    </div>
  );
}
