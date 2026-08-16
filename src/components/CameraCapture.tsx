import React, { useRef, useState, useCallback } from 'react';
import Button from './UI/Button';
import Alert from './UI/Alert';

export interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel?: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('📷 Camera not supported in your browser. Please use Chrome, Firefox, Safari, or Edge.');
        return;
      }

      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      let errorMessage = 'Failed to access camera';

      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found on your device.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another app.';
        }
      }

      setError(`📷 ${errorMessage}`);
      console.error('Camera error:', err);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg', 0.95);
        setCapturedImage(imageData);
      }
    }
  }, []);

  const useCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
    }
  }, [capturedImage, onCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  }, []);

  const handleCancel = useCallback(() => {
    stopCamera();
    onCancel?.();
  }, [stopCamera, onCancel]);

  if (!cameraActive && !capturedImage) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Open Camera</h3>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <p className="text-gray-600 mb-4">Take a photo of your question paper or notes.</p>
        <Button variant="primary" size="lg" onClick={startCamera}>
          📷 Start Camera
        </Button>
      </div>
    );
  }

  if (cameraActive && !capturedImage) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Camera Preview</h3>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg mb-4 bg-black"
          style={{ maxHeight: '400px' }}
        />
        <div className="flex gap-2">
          <Button variant="primary" size="md" onClick={capturePhoto}>
            📸 Capture
          </Button>
          <Button variant="secondary" size="md" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (capturedImage) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Preview Captured Image</h3>
        <img
          src={capturedImage}
          alt="Captured"
          className="w-full rounded-lg mb-4 max-h-96 object-contain"
        />
        <div className="flex gap-2">
          <Button variant="success" size="md" onClick={useCapture}>
            ✓ Use This Image
          </Button>
          <Button variant="secondary" size="md" onClick={retake}>
            ↻ Retake
          </Button>
          <Button variant="secondary" size="md" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default CameraCapture;
