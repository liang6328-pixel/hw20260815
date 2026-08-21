import React, { useRef } from 'react';

export interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel?: () => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      onCapture(imageData);
    };
    reader.readAsDataURL(file);
  };

  const launchCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>📷 Open Camera</h3>
      <p style={{ color: '#666', marginBottom: '20px' }}>1. Open Windows Camera (Start → Camera)</p>
      <p style={{ color: '#666', marginBottom: '20px' }}>2. Take a photo and save it</p>
      <p style={{ color: '#666', marginBottom: '20px' }}>3. Click "Start Camera" to select the photo file</p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <button
        onClick={launchCamera}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        📷 Start Camera
      </button>
    </div>
  );
}
