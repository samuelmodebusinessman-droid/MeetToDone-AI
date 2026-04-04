"use client";

import { useState, useRef, useCallback } from 'react';
import { extractPDFText, extractImageText, extractDOCXText } from '../utils/textExtractors';

interface UseFileUploadReturn {
  uploadedFiles: File[];
  imagePreviews: string[];
  isExtracting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (file: File) => Promise<void>;
  removeFile: (index: number) => void;
  openFileSelector: () => void;
}

const MAX_FILES = 3;

export const useFileUpload = (
  setTextContent: (updater: (prev: string) => string) => void,
  setHasUploadedFile: (value: boolean) => void,
  setError: (error: string | null) => void
): UseFileUploadReturn => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    if (uploadedFiles.length >= MAX_FILES) {
      setError(`Maximum ${MAX_FILES} fichiers autorisés. Supprimez-en un avant d'en ajouter un nouveau.`);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const documentExtensions = ['pdf', 'docx'];
    
    if (![...imageExtensions, ...documentExtensions].includes(extension || '')) {
      setError("Format non supporté. Utilisez PDF, DOCX ou images (JPG, PNG, GIF, WEBP)");
      return;
    }

    setUploadedFiles(prev => [...prev, file]);
    
    if (imageExtensions.includes(extension || '')) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviews(prev => [...prev, imageUrl]);
    } else {
      setImagePreviews(prev => [...prev, '']);
    }
    
    setIsExtracting(true);
    setError(null);

    try {
      let extractedText = '';
      
      if (extension === 'pdf') {
        extractedText = await extractPDFText(file);
      } else if (extension === 'docx') {
        extractedText = await extractDOCXText(file);
      } else if (imageExtensions.includes(extension || '')) {
        extractedText = await extractImageText(file);
      }

      setTextContent(prev => {
        const separator = prev.trim() ? '\n\n' : '';
        const fileHeader = `[${file.name}]\n`;
        return prev + separator + fileHeader + extractedText;
      });
      
      setHasUploadedFile(true);
    } catch (err: any) {
      console.error("Erreur d'extraction:", err);
      setError("Erreur lors de l'extraction : " + err.message);
      setUploadedFiles(prev => prev.filter(f => f.name !== file.name));
    } finally {
      setIsExtracting(false);
    }
  }, [uploadedFiles.length, setTextContent, setHasUploadedFile, setError]);

  const removeFile = useCallback((index: number) => {
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length <= 1) {
      setHasUploadedFile(false);
    }
  }, [imagePreviews, uploadedFiles.length, setHasUploadedFile]);

  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    uploadedFiles,
    imagePreviews,
    isExtracting,
    fileInputRef,
    handleFileUpload,
    removeFile,
    openFileSelector
  };
};
