"use client";

import { useState, useEffect, useCallback } from 'react';
import { AnalysisResult, SavedAnalysis } from '../types';

interface UseSavedAnalysesReturn {
  savedAnalyses: SavedAnalysis[];
  showSaveModal: boolean;
  saveTitle: string;
  saveTag: string;
  setShowSaveModal: (show: boolean) => void;
  setSaveTitle: (title: string) => void;
  setSaveTag: (tag: string) => void;
  saveAnalysis: (analysisResult: AnalysisResult, title: string, originalText: string, tag?: string) => void;
  deleteSavedAnalysis: (id: string) => void;
  loadSavedAnalysis: (saved: SavedAnalysis, setAnalysisResult: (result: AnalysisResult) => void, setError: (error: string | null) => void) => void;
}

export const useSavedAnalyses = (
  setError: (error: string | null) => void
): UseSavedAnalysesReturn => {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveTag, setSaveTag] = useState("");

  // Charger l'historique depuis localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem('mtd_saved_analyses');
    if (saved) {
      try {
        setSavedAnalyses(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur lors du chargement de l\'historique:', e);
      }
    }
  }, []);

  // Sauvegarder l'historique dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('mtd_saved_analyses', JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  const saveAnalysis = useCallback((analysisResult: AnalysisResult, title: string, originalText: string, tag?: string) => {
    if (!analysisResult || !title.trim()) return;
    
    const newAnalysis: SavedAnalysis = {
      id: Date.now().toString(),
      title: title.trim(),
      date: new Date().toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      tag: tag?.trim() || undefined,
      originalText: originalText || '',
      result: analysisResult
    };
    
    setSavedAnalyses(prev => [newAnalysis, ...prev]);
    setSaveTitle("");
    setSaveTag("");
    setShowSaveModal(false);
    setError("✅ Analyse enregistrée avec succès !");
    setTimeout(() => setError(null), 2000);
  }, [setError]);

  const deleteSavedAnalysis = useCallback((id: string) => {
    setSavedAnalyses(prev => prev.filter(a => a.id !== id));
  }, []);

  const loadSavedAnalysis = useCallback((
    saved: SavedAnalysis,
    setAnalysisResult: (result: AnalysisResult) => void,
    setError: (error: string | null) => void
  ) => {
    setAnalysisResult(saved.result);
    setError("✅ Analyse chargée !");
    setTimeout(() => setError(null), 2000);
  }, []);

  return {
    savedAnalyses,
    showSaveModal,
    saveTitle,
    saveTag,
    setShowSaveModal,
    setSaveTitle,
    setSaveTag,
    saveAnalysis,
    deleteSavedAnalysis,
    loadSavedAnalysis
  };
};
