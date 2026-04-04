"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, User } from "lucide-react";

// Types
import { AnalysisResult, SavedAnalysis, AIModel, AnalysisMode } from "./types";

// Hooks
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useCamera } from "./hooks/useCamera";
import { useFileUpload } from "./hooks/useFileUpload";
import { useReferenceFiles } from "./hooks/useReferenceFiles";
import { useCloudSavedAnalyses } from "./hooks/useCloudSavedAnalyses";
import { useAnalysis } from "./hooks/useAnalysis";
import { useTokenSystem } from "./hooks/useTokenSystem";

// Components
import { AnalysisPanel } from "./components/AnalysisPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { ErrorToast } from "./components/ErrorToast";
import { TokenDisplay } from "./components/TokenDisplay";

// Utils
import { exportToPDF } from "./utils/exporters/pdf";
import { exportToDOCX } from "./utils/exporters/docx";
import { exportToTXT } from "./utils/exporters/txt";
import { exportToCSV } from "./utils/exporters/csv";
import { exportToXLS } from "./utils/exporters/xlsx";
import { sendToSlack } from "./utils/senders/slack";
import { sendToGmail } from "./utils/senders/gmail";
import { copyAnalysisResult } from "./utils/copy";

const MAX_FILES = 3;
const MAX_REF_FILES = 3;

export default function MTDPage() {
  // États principaux
  const [textContent, setTextContent] = useState("");
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | string>("");
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("structured");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // États pour Slack
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [sendingToSlack, setSendingToSlack] = useState(false);
  
  // États pour Gmail
  const [gmailAddress, setGmailAddress] = useState("");
  const [sendingToGmail, setSendingToGmail] = useState(false);

  // États UI
  const [isDragging, setIsDragging] = useState(false);

  // Hooks
  const { isListening, toggleListening } = useSpeechRecognition(
    (transcript) => setTextContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + transcript),
    setError
  );

  const { showCamera, videoRef, openCamera, closeCamera, capturePhoto } = useCamera(setError);

  const { 
    uploadedFiles, 
    imagePreviews, 
    isExtracting, 
    fileInputRef,
    handleFileUpload, 
    removeFile, 
    openFileSelector 
  } = useFileUpload(
    (updater) => setTextContent(updater),
    setHasUploadedFile,
    setError
  );

  const {
    referenceFiles,
    referenceFilesContent,
    isDraggingRef,
    refFileInputRef,
    setIsDraggingRef,
    handleReferenceFileUpload,
    removeReferenceFile,
    openRefFileSelector
  } = useReferenceFiles(setError);

  const {
    savedAnalyses,
    showSaveModal,
    saveTitle,
    saveTag,
    setSaveTitle,
    setSaveTag,
    saveAnalysis,
    deleteSavedAnalysis,
    loadSavedAnalysis
  } = useCloudSavedAnalyses(setError);

  const { canAnalyze, incrementUsage, remainingToday, isPremium } = useTokenSystem();

  const { isAnalyzing, handleAnalyze } = useAnalysis();

  // Computed
  const showAnalyserButton = textContent.trim().length > 0 || hasUploadedFile;

  // Handlers
  const handleReset = useCallback(() => {
    setTextContent("");
    setAnalysisResult(null);
    setError(null);
    // Supprimer les fichiers uploadés
    uploadedFiles.forEach((_, index) => {
      if (imagePreviews[index]) {
        URL.revokeObjectURL(imagePreviews[index]);
      }
    });
  }, [uploadedFiles, imagePreviews]);

  const handleAnalyzeClick = useCallback(async () => {
    // Check if user can analyze (token system)
    if (!canAnalyze) {
      setError(`Vous avez utilisé votre analyse gratuite du jour. Revenez demain ou passez Premium !`);
      return;
    }

    const success = await incrementUsage();
    if (!success && !isPremium) {
      setError(`Limite atteinte : 1 analyse par jour. Passez Premium pour illimité !`);
      return;
    }

    await handleAnalyze(
      textContent,
      hasUploadedFile,
      selectedModel,
      analysisMode,
      referenceFilesContent,
      setAnalysisResult,
      setSelectedModel,
      setError
    );
  }, [textContent, hasUploadedFile, selectedModel, analysisMode, referenceFilesContent, handleAnalyze, canAnalyze, incrementUsage, isPremium]);

  const handleCapturePhoto = useCallback(() => {
    capturePhoto(() => {
      setTextContent(prev => {
        const separator = prev.trim() ? '\n\n' : '';
        return prev + separator + '[Photo capturée]';
      });
    });
  }, [capturePhoto]);

  const handleSaveAnalysis = useCallback(() => {
    if (analysisResult && saveTitle.trim()) {
      saveAnalysis(analysisResult, saveTitle, textContent, saveTag);
    } else if (!saveTitle.trim()) {
      setError("Veuillez entrer un titre");
    }
  }, [analysisResult, saveTitle, textContent, saveTag, saveAnalysis]);

  const handleLoadSavedAnalysis = useCallback((saved: SavedAnalysis) => {
    loadSavedAnalysis(saved, setAnalysisResult, setTextContent, setError);
  }, [loadSavedAnalysis]);

  // Export handlers
  const handleExportPDF = useCallback(() => {
    if (analysisResult) exportToPDF(analysisResult, () => {});
  }, [analysisResult]);

  const handleExportDOCX = useCallback(() => {
    if (analysisResult) exportToDOCX(analysisResult, () => {});
  }, [analysisResult]);

  const handleExportTXT = useCallback(() => {
    if (analysisResult) exportToTXT(analysisResult, () => {});
  }, [analysisResult]);

  const handleExportCSV = useCallback(() => {
    if (analysisResult) exportToCSV(analysisResult, () => {});
  }, [analysisResult]);

  const handleExportXLS = useCallback(() => {
    if (analysisResult) exportToXLS(analysisResult, () => {});
  }, [analysisResult]);

  // Copy handler
  const handleCopy = useCallback(async () => {
    if (analysisResult) {
      await copyAnalysisResult({ analysisResult, setCopied, setError });
    }
  }, [analysisResult]);

  // Send handlers
  const handleSendSlack = useCallback(async () => {
    if (!analysisResult) return;
    
    if (!slackWebhookUrl) {
      setError("Veuillez configurer le webhook Slack");
      return;
    }
    
    await sendToSlack({
      analysisResult,
      slackWebhookUrl,
      setError,
      setSendingToSlack
    });
  }, [analysisResult, slackWebhookUrl]);

  const handleSendGmail = useCallback(async () => {
    if (!analysisResult) return;
    
    if (!gmailAddress) {
      setError("Veuillez configurer l'adresse Gmail");
      return;
    }
    
    await sendToGmail({
      analysisResult,
      gmailAddress,
      setError,
      setSendingToGmail
    });
  }, [analysisResult, gmailAddress]);

  // Auto-fermeture des erreurs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <div className="min-h-screen bg-[#FAF4EB] flex flex-col overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between py-4 px-4 sm:px-8 max-w-[1100px] mx-auto w-full shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0F766E] rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="https://i.ibb.co/Swj35cKw/M-removebg-preview.png" 
                alt="MeetToDone Logo" 
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[#134E4A] font-bold text-base">MeetToDone</span>
              <span className="text-[#0F766E]/60 text-[11px] font-medium">AI Meeting Assistant</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
            <TokenDisplay />
            <button 
              onClick={handleReset}
              className="text-[#0F766E]/60 hover:text-[#0F766E] text-[10px] sm:text-[11px] font-medium transition-colors"
              title="Réinitialiser tout"
            >
              Reset
            </button>
            <button className="flex items-center gap-1 sm:gap-2 bg-[#F59E0B] text-white font-semibold px-3 sm:px-4 py-2 rounded-full cursor-pointer hover:bg-[#D97706] transition-colors text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Nouvelle réunion</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
            <button className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0F766E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#134E4A] transition-colors">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <main className="flex-1 px-4 sm:px-6 pb-4 max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 sm:gap-5 w-full" style={{ maxWidth: '1150px', margin: '0 auto' }}>
            
            {/* Panel Historique & Config - À gauche */}
            <HistoryPanel
              analysisResult={analysisResult}
              savedAnalyses={savedAnalyses}
              saveTitle={saveTitle}
              saveTag={saveTag}
              setSaveTitle={setSaveTitle}
              setSaveTag={setSaveTag}
              onSaveAnalysis={handleSaveAnalysis}
              onDeleteSavedAnalysis={deleteSavedAnalysis}
              onLoadSavedAnalysis={handleLoadSavedAnalysis}
              showCamera={showCamera}
              videoRef={videoRef}
              onOpenCamera={openCamera}
              onCloseCamera={closeCamera}
              onCapturePhoto={handleCapturePhoto}
              slackWebhookUrl={slackWebhookUrl}
              setSlackWebhookUrl={setSlackWebhookUrl}
              sendingToSlack={sendingToSlack}
              onSendSlack={handleSendSlack}
              gmailAddress={gmailAddress}
              setGmailAddress={setGmailAddress}
              sendingToGmail={sendingToGmail}
              onSendGmail={handleSendGmail}
            />

            {/* Panel d'analyse fusionné (Saisie + Résultats) */}
            <AnalysisPanel
              textContent={textContent}
              setTextContent={setTextContent}
              setError={setError}
              referenceFiles={referenceFiles}
              MAX_REF_FILES={MAX_REF_FILES}
              isDraggingRef={isDraggingRef}
              setIsDraggingRef={setIsDraggingRef}
              handleReferenceFileUpload={handleReferenceFileUpload}
              removeReferenceFile={removeReferenceFile}
              openRefFileSelector={openRefFileSelector}
              refFileInputRef={refFileInputRef}
              isListening={isListening}
              toggleListening={toggleListening}
              openCamera={openCamera}
              uploadedFiles={uploadedFiles}
              imagePreviews={imagePreviews}
              isExtracting={isExtracting}
              MAX_FILES={MAX_FILES}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
              openFileSelector={openFileSelector}
              fileInputRef={fileInputRef}
              showAnalyserButton={showAnalyserButton}
              selectedModel={selectedModel}
              isAnalyzing={isAnalyzing}
              handleAnalyze={handleAnalyzeClick}
              setSelectedModel={setSelectedModel}
              analysisMode={analysisMode}
              setAnalysisMode={setAnalysisMode}
              analysisResult={analysisResult}
              copied={copied}
              onCopy={handleCopy}
              onExportXLS={handleExportXLS}
              onExportDOCX={handleExportDOCX}
              onExportTXT={handleExportTXT}
              onExportCSV={handleExportCSV}
              onExportPDF={handleExportPDF}
              onSendSlack={handleSendSlack}
              onSendGmail={handleSendGmail}
              sendingToSlack={sendingToSlack}
              sendingToGmail={sendingToGmail}
            />
          </div>
        </main>

        {/* Error Toast */}
        <ErrorToast error={error} onClose={() => setError(null)} />
      </div>
    </>
  );
}
