"use client";

import { useState, useRef, useCallback } from 'react';
import { extractPDFText, extractDOCXText } from '../utils/textExtractors';

interface UseReferenceFilesReturn {
  referenceFiles: File[];
  referenceFilesContent: Map<string, string>;
  isDraggingRef: boolean;
  refFileInputRef: React.RefObject<HTMLInputElement>;
  setIsDraggingRef: (value: boolean) => void;
  handleReferenceFileUpload: (file: File) => Promise<void>;
  removeReferenceFile: (index: number) => void;
  openRefFileSelector: () => void;
}

const MAX_REF_FILES = 3;

export const useReferenceFiles = (
  setError: (error: string | null) => void
): UseReferenceFilesReturn => {
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [referenceFilesContent, setReferenceFilesContent] = useState<Map<string, string>>(new Map());
  const [isDraggingRef, setIsDraggingRef] = useState(false);
  const refFileInputRef = useRef<HTMLInputElement>(null);

  const handleReferenceFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    if (referenceFiles.length >= MAX_REF_FILES) {
      setError(`Maximum ${MAX_REF_FILES} documents de référence autorisés.`);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(extension || '')) {
      setError("Format non supporté. Utilisez uniquement PDF ou DOCX.");
      return;
    }

    setReferenceFiles(prev => [...prev, file]);
    setError(null);

    try {
      let extractedText = '';
      
      if (extension === 'pdf') {
        extractedText = await extractPDFText(file);
      } else if (extension === 'docx') {
        extractedText = await extractDOCXText(file);
      }

      setReferenceFilesContent(prev => {
        const newMap = new Map(prev);
        newMap.set(file.name, extractedText);
        return newMap;
      });

    } catch (err: any) {
      console.error("Erreur d'extraction:", err);
      setError("Erreur lors de l'extraction : " + err.message);
      setReferenceFiles(prev => prev.filter(f => f.name !== file.name));
    }
  }, [referenceFiles.length, setError]);

  const removeReferenceFile = useCallback((index: number) => {
    const fileName = referenceFiles[index].name;
    setReferenceFiles(prev => prev.filter((_, i) => i !== index));
    setReferenceFilesContent(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileName);
      return newMap;
    });
  }, [referenceFiles]);

  const openRefFileSelector = useCallback(() => {
    refFileInputRef.current?.click();
  }, []);

  return {
    referenceFiles,
    referenceFilesContent,
    isDraggingRef,
    refFileInputRef,
    setIsDraggingRef,
    handleReferenceFileUpload,
    removeReferenceFile,
    openRefFileSelector
  };
};
