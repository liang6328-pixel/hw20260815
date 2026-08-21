import React, { useRef, useState, useCallback } from 'react';
import Button from './UI/Button';
import Alert from './UI/Alert';
import { isImageFile, isPDFFile, formatFileSize } from '../utils/helpers';

export interface FileImporterProps {
  onFileSelect: (file: File) => void;
  onCancel?: () => void;
}

const FileImporter: React.FC<FileImporterProps> = ({ onFileSelect, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!isImageFile(file) && !isPDFFile(file)) {
      setError('Please select an image (JPG, PNG, WEBP) or PDF file (.pdf)');
      return;
    }

    console.log('File selected:', file.name, file.type);

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is 10MB, your file is ${formatFileSize(file.size)}`);
      return;
    }

    setSelectedFile(file);
  }, []);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    onCancel?.();
  }, [onCancel]);

  const handleUseFile = useCallback(() => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [selectedFile, onFileSelect]);

  if (!selectedFile) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Import File</h3>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <p className="text-gray-600 mb-4">
          Select an image or PDF file containing your questions.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supported: JPG, PNG, WEBP (images up to 10MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="primary" size="lg" onClick={openFilePicker}>
          📁 Browse Files
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">File Selected</h3>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p className="font-medium">{selectedFile.name}</p>
        <p className="text-sm text-gray-600">
          Size: {formatFileSize(selectedFile.size)} | Type: {selectedFile.type}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="success" size="md" onClick={handleUseFile}>
          ✓ Use This File
        </Button>
        <Button variant="secondary" size="md" onClick={() => setSelectedFile(null)}>
          ↻ Choose Another
        </Button>
        <Button variant="secondary" size="md" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default FileImporter;
