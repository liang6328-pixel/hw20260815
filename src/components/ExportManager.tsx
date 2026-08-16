import React, { useState, useCallback } from 'react';
// Types imported as any
import Button from './UI/Button';
import Alert from './UI/Alert';
import { exportQuestions } from '../services/exportService';

export interface ExportManagerProps {
  sourceQuestion?: any;
  generatedQuestions: any[];
  onClose?: () => void;
}

const ExportManager: React.FC<ExportManagerProps> = ({
  sourceQuestion,
  generatedQuestions,
  onClose,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<any>('docx');
  const [testTitle, setTestTitle] = useState('Mock Test Questions');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formats: Array<{ value: any; label: string; description: string }> = [
    { value: 'docx', label: 'Word Document', description: 'Professional format for printing' },
    { value: 'pdf', label: 'PDF', description: 'Universal format' },
    { value: 'txt', label: 'Text File', description: 'Simple text format' },
    { value: 'json', label: 'JSON', description: 'For data import/analysis' },
  ];

  const handleExport = useCallback(async () => {
    if (generatedQuestions.length === 0) {
      setError('No questions to export.');
      return;
    }

    try {
      setError(null);
      setSuccess(false);
      setExporting(true);

      await exportQuestions(
        {
          title: testTitle,
          sourceQuestion,
          questions: generatedQuestions,
          timestamp: new Date(),
        },
        selectedFormat
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  }, [generatedQuestions, sourceQuestion, selectedFormat, testTitle]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Export Questions</h3>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} dismissible />
      )}

      {success && (
        <Alert
          type="success"
          title="Success!"
          message="Questions exported successfully."
          onClose={() => setSuccess(false)}
        />
      )}

      <div className="space-y-4">
        {/* Test Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Title
          </label>
          <input
            type="text"
            value={testTitle}
            onChange={e => setTestTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Name for your test"
          />
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="space-y-2">
            {formats.map(format => (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                  selectedFormat === format.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-sm">{format.label}</p>
                <p className="text-xs text-gray-600">{format.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <p className="text-gray-600">
            <strong>{generatedQuestions.length}</strong> question(s) will be exported as{' '}
            <strong>{selectedFormat.toUpperCase()}</strong>
          </p>
          {sourceQuestion && (
            <p className="text-gray-500 text-xs mt-1">Source question will be included</p>
          )}
        </div>

        {/* Export Button */}
        <Button
          variant="success"
          size="lg"
          onClick={handleExport}
          disabled={exporting || generatedQuestions.length === 0}
          loading={exporting}
          className="w-full"
        >
          ⬇️ Export Now
        </Button>

        {onClose && (
          <Button variant="secondary" size="md" onClick={onClose} className="w-full">
            Close
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExportManager;
