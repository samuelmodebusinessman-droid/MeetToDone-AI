"use client";

import React from 'react';
import { Bot, FileText, Loader2 } from 'lucide-react';
import { FilePreview } from './FilePreview';
import { AnalysisModeSelector } from './AnalysisModeSelector';
import { AnalysisMode } from '../types';

interface InputPanelProps {
  textContent: string;
  setTextContent: (value: string) => void;
  setError: (error: string | null) => void;
  referenceFiles: File[];
  MAX_REF_FILES: number;
  isDraggingRef: boolean;
  setIsDraggingRef: (value: boolean) => void;
  handleReferenceFileUpload: (file: File) => Promise<void>;
  removeReferenceFile: (index: number) => void;
  openRefFileSelector: () => void;
  refFileInputRef: React.RefObject<HTMLInputElement>;
  isListening: boolean;
  toggleListening: () => void;
  openCamera: () => void;
  uploadedFiles: File[];
  imagePreviews: string[];
  isExtracting: boolean;
  MAX_FILES: number;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  handleFileUpload: (file: File) => Promise<void>;
  removeFile: (index: number) => void;
  openFileSelector: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  showAnalyserButton: boolean;
  selectedModel: string;
  isAnalyzing: boolean;
  handleAnalyze: () => void;
  setSelectedModel: (model: string) => void;
  analysisMode: AnalysisMode;
  setAnalysisMode: (mode: AnalysisMode) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  textContent,
  setTextContent,
  setError,
  referenceFiles,
  MAX_REF_FILES,
  isDraggingRef,
  setIsDraggingRef,
  handleReferenceFileUpload,
  removeReferenceFile,
  openRefFileSelector,
  refFileInputRef,
  isListening,
  toggleListening,
  openCamera,
  uploadedFiles,
  imagePreviews,
  isExtracting,
  MAX_FILES,
  isDragging,
  setIsDragging,
  handleFileUpload,
  removeFile,
  openFileSelector,
  fileInputRef,
  showAnalyserButton,
  selectedModel,
  isAnalyzing,
  handleAnalyze,
  setSelectedModel,
  analysisMode,
  setAnalysisMode
}) => {
  return (
    <div className="bg-white border-[2px] border-[#0F766E] rounded-[16px] p-5 flex flex-col shadow-sm h-[480px] flex-1">
      <div className="pr-1 flex flex-col h-full overflow-hidden">
        <h2 className="text-[#134E4A] font-bold text-[20px] mb-1 shrink-0">Entrée</h2>
        <p className="text-[#0F766E]/80 text-[12px] mb-3 leading-relaxed shrink-0">
          Importez votre réunion pour générer un résumé.
        </p>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Zone de saisie de texte */}
          <div className="mb-4">
            <label className="text-[#0F766E] text-[13px] mb-1.5 block font-medium flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              Texte à analyser
            </label>
            <textarea 
              className="w-full h-[140px] px-3 py-2 bg-[#FAFAFA] border border-[#0F766E]/30 rounded-[10px] text-[13px] text-[#134E4A] placeholder-[#0F766E]/40 resize-none focus:outline-none focus:border-[#0F766E] transition-all"
              placeholder="Collez ici le compte-rendu de votre réunion..."
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value);
                setError(null);
              }}
            />
          </div>

          {/* Zone de documents de référence */}
          <div className="mb-4">
            <label className="text-[#0F766E] text-[13px] mb-1.5 block font-medium flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Documents de référence (PDF, DOCX)
              <span className="text-[#0F766E]/50 text-[11px]">({referenceFiles.length}/{MAX_REF_FILES})</span>
            </label>
            
            <input
              type="file"
              ref={refFileInputRef}
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleReferenceFileUpload(file);
              }}
            />
            
            <div 
              className={`relative border border-dashed border-[#0F766E]/40 rounded-[12px] h-[70px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer overflow-hidden ${
                isDraggingRef 
                  ? "border-[#F59E0B] bg-[#F59E0B]/10" 
                  : "bg-gradient-to-br from-white/80 to-[#F0FDFA]/60 backdrop-blur-sm hover:border-[#0F766E]/60"
              }`}
              onDragEnter={() => setIsDraggingRef(true)}
              onDragLeave={() => setIsDraggingRef(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingRef(false);
                const file = e.dataTransfer.files[0];
                if (file) handleReferenceFileUpload(file);
              }}
              onClick={openRefFileSelector}
            >
              <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] rounded-[12px]" />
              
              <div className="relative flex items-center gap-2">
                <img 
                  src="https://img.icons8.com/?size=100&id=111941&format=png&color=0F766E" 
                  alt="Document" 
                  className="w-5 h-5 object-contain opacity-70"
                />
                <span className="text-[#134E4A] text-[12px] font-medium">
                  {referenceFiles.length === 0 ? "Déposez des documents de référence" : "Ajouter un document"}
                </span>
              </div>
              <span className="relative text-[#0F766E]/60 text-[10px]">
                PDF ou DOCX • Comparaison automatique
              </span>
            </div>
            
            {/* Badges des fichiers de référence */}
            {referenceFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {referenceFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-1.5 bg-[#0F766E]/10 border border-[#0F766E]/20 rounded-full px-2.5 py-1 text-[11px] text-[#134E4A]"
                  >
                    <FileText className="w-3 h-3 text-[#0F766E]" />
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeReferenceFile(index);
                      }}
                      className="w-4 h-4 flex items-center justify-center text-[#0F766E]/60 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Zone d'upload avec boutons */}
          <div className="flex items-center gap-3">
            {/* Boutons dictée et caméra */}
            <div className="flex flex-col gap-2">
              <button
                onClick={toggleListening}
                className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all border shadow-sm ${
                  isListening 
                    ? 'bg-red-500 border-red-500 animate-pulse' 
                    : 'bg-white hover:bg-[#FEF3C7] border-[#F59E0B]'
                }`}
                title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
              >
                {isListening ? (
                  <span className="text-white text-[10px] font-bold">ON</span>
                ) : (
                  <img 
                    src="https://img.icons8.com/?size=100&id=85836&format=png&color=F59E0B" 
                    alt="Micro" 
                    className="w-5 h-5 object-contain"
                  />
                )}
              </button>
              <button
                onClick={openCamera}
                className="w-10 h-10 rounded-[8px] flex items-center justify-center bg-white hover:bg-[#F0FDFA] transition-all border border-[#0F766E] shadow-sm"
                title="Caméra"
              >
                <img 
                  src="https://img.icons8.com/?size=100&id=85103&format=png&color=0F766E" 
                  alt="Caméra" 
                  className="w-5 h-5 object-contain"
                />
              </button>
            </div>

            {/* Zone d'import principale */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.webp,.bmp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <div 
              className={`flex-1 border border-dashed border-[#0F766E]/50 rounded-[12px] h-[100px] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-[#FAFAFA] ${
                isDragging || isExtracting
                  ? "border-[#F59E0B] bg-[#FEF3C7]/60" 
                  : "hover:border-[#0F766E] hover:bg-white"
              }`}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              onClick={openFileSelector}
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#F59E0B]">
                {isExtracting ? (
                  <Loader2 className="w-5 h-5 text-[#F59E0B] animate-spin" />
                ) : (
                  <img 
                    src="https://img.icons8.com/?size=100&id=12160&format=png&color=F59E0B" 
                    alt="Dossier" 
                    className="w-6 h-6 object-contain"
                  />
                )}
              </div>
              <div className="text-center px-3">
                <p className="text-[#134E4A] font-semibold text-[13px]">
                  {isExtracting ? 'Extraction en cours...' : `PDF, DOCX ou Images (${uploadedFiles.length}/${MAX_FILES})`}
                </p>
                <p className="text-[#0F766E]/60 text-[11px]">
                  JPG, PNG, GIF, WEBP <span className="text-[#F59E0B] font-semibold underline">cliquez pour parcourir</span>
                </p>
              </div>
            </div>
          </div>
          
          <FilePreview 
            uploadedFiles={uploadedFiles}
            imagePreviews={imagePreviews}
            removeFile={removeFile}
          />
        </div>

        {/* Sélecteur de mode d'analyse */}
        <div className="pt-2 pb-2 shrink-0 border-t border-[#0F766E]/10">
          <div className="flex flex-col gap-2">
            <span className="text-[#0F766E]/80 text-[11px] font-medium">Mode d'analyse :</span>
            <AnalysisModeSelector 
              selectedMode={analysisMode}
              onSelectMode={setAnalysisMode}
            />
          </div>
        </div>

        {/* Bouton Analyser avec sélecteur de modèle */}
        <div className="pt-3 shrink-0 border-t border-[#0F766E]/10">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAnalyze}
              className={`flex-1 h-[48px] rounded-[10px] cursor-pointer transition-all text-[14px] font-semibold flex items-center justify-center gap-2 px-6 ${
                showAnalyserButton && selectedModel
                  ? "bg-[#0F766E] text-white shadow-lg hover:bg-[#134E4A]" 
                  : "bg-[#0F766E]/20 text-[#0F766E]/40 cursor-not-allowed"
              }`}
              disabled={!showAnalyserButton || !selectedModel || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <img 
                    src="https://img.icons8.com/?size=100&id=LnlEQU5pxlIU&format=png&color=FFFFFF" 
                    alt="Analyser" 
                    className="w-5 h-5 object-contain"
                  />
                  <span>Analyser</span>
                </>
              )}
            </button>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedModel('llama-3.1-8b-instant')}
                className={`w-9 h-9 rounded-[6px] flex items-center justify-center transition-all border p-0.5 ${
                  selectedModel === 'llama-3.1-8b-instant'
                    ? 'bg-[#0081FB]/10 border-[#0081FB] shadow-sm'
                    : 'bg-white border-[#0F766E]/20 hover:border-[#0081FB]/50'
                }`}
                title="Meta Llama 3.1"
              >
                <img 
                  src="https://img.icons8.com/?size=100&id=PvvcWRWxRKSR&format=png&color=000000" 
                  alt="Meta" 
                  className="w-5 h-5 object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
