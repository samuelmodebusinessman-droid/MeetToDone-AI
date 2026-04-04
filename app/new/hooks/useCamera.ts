"use client";

import { useState, useRef, useCallback } from 'react';

interface UseCameraReturn {
  showCamera: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  openCamera: () => Promise<void>;
  closeCamera: () => void;
  capturePhoto: (onCapture: () => void) => void;
}

export const useCamera = (setError: (error: string | null) => void): UseCameraReturn => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Impossible d'accéder à la caméra");
    }
  }, [setError]);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback((onCapture: () => void) => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        onCapture();
        closeCamera();
      }
    }
  }, [closeCamera]);

  return {
    showCamera,
    videoRef,
    openCamera,
    closeCamera,
    capturePhoto
  };
};
