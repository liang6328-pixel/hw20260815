import React, { useCallback, useState } from 'react';
import Button from './UI/Button';

export interface QuestionCanvasProps {
  extractedText: string;
  onTextChange: (text: string) => void;
  loading?: boolean;
  jobRole?: string;
  year?: string;
}

const QuestionCanvas: React.FC<QuestionCanvasProps> = ({
  extractedText,
  onTextChange,
  loading = false,
  jobRole,
  year,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(extractedText);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  }, []);

  const handleSaveEdit = useCallback(() => {
    onTextChange(editText);
    setIsEditing(false);
  }, [editText, onTextChange]);

  const handleCancelEdit = useCallback(() => {
    setEditText(extractedText);
    setIsEditing(false);
  }, [extractedText]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-600">Extracting text from image...</p>
        </div>
      </div>
    );
  }

  if (!extractedText) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No text extracted yet.</p>
          <p className="text-gray-400 text-sm">Import or capture an image to begin.</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-4">Edit Extracted Text</h3>
        <textarea
          value={editText}
          onChange={handleTextChange}
          className="flex-1 w-full p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Edit the extracted text here..."
        />
        <div className="flex gap-2 mt-4">
          <Button variant="success" size="md" onClick={handleSaveEdit}>
            ✓ Save Changes
          </Button>
          <Button variant="secondary" size="md" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Extracted Questions</h3>
        <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
          ✎ Edit
        </Button>
      </div>
      {(jobRole || year) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            {jobRole && <span><strong>Job Role:</strong> {jobRole}</span>}
            {jobRole && year && <span> | </span>}
            {year && <span><strong>Year:</strong> {year}</span>}
          </p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap text-gray-700 border border-gray-200">
          {extractedText}
        </div>
      </div>
    </div>
  );
};

export default QuestionCanvas;
