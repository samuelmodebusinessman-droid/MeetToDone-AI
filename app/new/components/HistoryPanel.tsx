"use client";

import React, { useState } from 'react';
import { FileText, Loader2, X, Settings, Download, FileSpreadsheet, FileType, FileCode, File } from 'lucide-react';
import { SavedAnalysis, AnalysisResult } from '../types';

interface HistoryPanelProps {
  analysisResult: AnalysisResult | null;
  savedAnalyses: SavedAnalysis[];
  saveTitle: string;
  saveTag: string;
  setSaveTitle: (title: string) => void;
  setSaveTag: (tag: string) => void;
  onSaveAnalysis: () => void;
  onDeleteSavedAnalysis: (id: string) => void;
  onLoadSavedAnalysis: (saved: SavedAnalysis) => void;
  // Camera props
  showCamera: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onOpenCamera: () => void;
  onCloseCamera: () => void;
  onCapturePhoto: () => void;
  // Slack props
  slackWebhookUrl: string;
  setSlackWebhookUrl: (url: string) => void;
  sendingToSlack: boolean;
  onSendSlack: () => void;
  // Gmail props
  gmailAddress: string;
  setGmailAddress: (address: string) => void;
  sendingToGmail: boolean;
  onSendGmail: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  analysisResult,
  savedAnalyses,
  saveTitle,
  saveTag,
  setSaveTitle,
  setSaveTag,
  onSaveAnalysis,
  onDeleteSavedAnalysis,
  onLoadSavedAnalysis,
  showCamera,
  videoRef,
  onOpenCamera,
  onCloseCamera,
  onCapturePhoto,
  slackWebhookUrl,
  setSlackWebhookUrl,
  sendingToSlack,
  onSendSlack,
  gmailAddress,
  setGmailAddress,
  sendingToGmail,
  onSendGmail
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [viewingSaved, setViewingSaved] = useState<SavedAnalysis | null>(null);

  // Tags prédéfinis
  const predefinedTags = ['Urgent', 'Client', 'Interne', 'Projet', 'Suivi'];

  return (
    <div className="bg-white border-[2px] border-[#0F766E] rounded-[16px] p-5 flex flex-col shadow-sm min-h-[500px]">
      <div className="pr-1 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[#134E4A] font-bold text-[20px]">Historique</h2>
          
          {/* Bouton Configuration */}
          <div className="relative">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="w-8 h-8 rounded-[6px] bg-[#F0FDFA] border border-[#0F766E]/20 flex items-center justify-center hover:bg-[#0F766E]/10 transition-colors"
              title="Configuration"
            >
              <Settings className="w-4 h-4 text-[#0F766E]" />
            </button>
            
            {/* Dropdown Configuration */}
            {showConfig && (
              <div className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-[12px] shadow-xl border border-[#0F766E]/20 p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#134E4A] font-semibold text-[13px]">Configuration</h3>
                  <button
                    onClick={() => setShowConfig(false)}
                    className="w-5 h-5 flex items-center justify-center text-[#0F766E]/60 hover:text-[#134E4A]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Config Slack */}
                <div className="mb-4">
                  <label className="text-[#134E4A] text-[11px] font-medium mb-1.5 block flex items-center gap-1.5">
                    <img 
                      src="https://img.icons8.com/?size=100&id=kikR2jIn6485&format=png&color=000000" 
                      alt="Slack" 
                      className="w-3.5 h-3.5 object-contain"
                    />
                    Webhook Slack
                  </label>
                  <input
                    type="text"
                    value={slackWebhookUrl}
                    onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/..."
                    className="w-full px-2 py-1.5 bg-[#FAFAFA] border border-[#0F766E]/20 rounded-[6px] text-[11px] text-[#134E4A] placeholder-[#0F766E]/40 focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                
                {/* Config Gmail */}
                <div className="mb-4">
                  <label className="text-[#134E4A] text-[11px] font-medium mb-1.5 block flex items-center gap-1.5">
                    <img 
                      src="https://img.icons8.com/?size=100&id=P7UIlhbpWzZm&format=png&color=000000" 
                      alt="Gmail" 
                      className="w-3.5 h-3.5 object-contain"
                    />
                    Adresse Gmail
                  </label>
                  <input
                    type="email"
                    value={gmailAddress}
                    onChange={(e) => setGmailAddress(e.target.value)}
                    placeholder="email@gmail.com"
                    className="w-full px-2 py-1.5 bg-[#FAFAFA] border border-[#0F766E]/20 rounded-[6px] text-[11px] text-[#134E4A] placeholder-[#0F766E]/40 focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                
                {/* Config Caméra */}
                <div>
                  <label className="text-[#134E4A] text-[11px] font-medium mb-1.5 block flex items-center gap-1.5">
                    <img 
                      src="https://img.icons8.com/?size=100&id=85103&format=png&color=000000" 
                      alt="Camera" 
                      className="w-3.5 h-3.5 object-contain"
                    />
                    Caméra
                  </label>
                  {showCamera ? (
                    <div className="space-y-2">
                      <div className="relative bg-black rounded-[8px] overflow-hidden aspect-video">
                        <video 
                          ref={videoRef}
                          autoPlay 
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={onCapturePhoto}
                          className="flex-1 h-[28px] rounded-[6px] bg-[#0F766E] text-white text-[10px] font-semibold hover:bg-[#134E4A] transition-colors"
                        >
                          📸 Capturer
                        </button>
                        <button 
                          onClick={onCloseCamera}
                          className="h-[28px] px-3 rounded-[6px] bg-gray-200 text-gray-700 text-[10px] font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={onOpenCamera}
                      className="w-full h-[28px] rounded-[6px] bg-[#F0FDFA] border border-[#0F766E]/20 text-[#134E4A] text-[10px] font-medium hover:bg-[#0F766E]/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <img 
                        src="https://img.icons8.com/?size=100&id=85103&format=png&color=0F766E" 
                        alt="Camera" 
                        className="w-3.5 h-3.5 object-contain"
                      />
                      Ouvrir la caméra
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-[#0F766E]/80 text-[12px] mb-3 leading-relaxed">
          Analyses sauvegardées avec tags.
        </p>

        <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
          {/* Section Enregistrer */}
          {analysisResult && (
            <div className="bg-[#F0FDFA] rounded-[10px] p-3 border border-[#0F766E]/20">
              <h3 className="text-[#134E4A] font-semibold text-[12px] mb-2 flex items-center gap-1.5">
                <img 
                  src="https://img.icons8.com/?size=100&id=11240&format=png&color=0F766E" 
                  alt="Save" 
                  className="w-3.5 h-3.5 object-contain"
                />
                Enregistrer cette analyse
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="Titre de la réunion..."
                  className="w-full px-2 py-1.5 bg-white border border-[#0F766E]/30 rounded-[6px] text-[11px] text-[#134E4A] placeholder-[#0F766E]/40 focus:outline-none focus:border-[#0F766E]"
                />
                
                {/* Sélection de tag */}
                <div className="flex flex-wrap gap-1.5">
                  {predefinedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSaveTag(tag === saveTag ? '' : tag)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                        tag === saveTag
                          ? 'bg-[#0F766E] text-white'
                          : 'bg-white border border-[#0F766E]/20 text-[#134E4A] hover:bg-[#F0FDFA]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={saveTag && !predefinedTags.includes(saveTag) ? saveTag : ''}
                    onChange={(e) => setSaveTag(e.target.value)}
                    placeholder="Tag perso..."
                    className="px-2 py-0.5 bg-white border border-[#0F766E]/20 rounded-full text-[10px] text-[#134E4A] placeholder-[#0F766E]/40 focus:outline-none focus:border-[#0F766E] w-[80px]"
                  />
                </div>
                
                <button
                  onClick={onSaveAnalysis}
                  className="w-full h-[32px] bg-[#0F766E] text-white text-[11px] font-medium rounded-[6px] hover:bg-[#134E4A] transition-colors flex items-center justify-center gap-2"
                >
                  <img 
                    src="https://img.icons8.com/?size=100&id=11240&format=png&color=FFFFFF" 
                    alt="Save" 
                    className="w-3.5 h-3.5 object-contain"
                  />
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {/* Section Analyses enregistrées - Format Rectangle */}
          <div className="border-t border-[#0F766E]/10 pt-3">
            <h3 className="text-[#134E4A] font-semibold text-[12px] mb-2 flex items-center gap-1.5">
              <img 
                src="https://img.icons8.com/?size=100&id=11240&format=png&color=0F766E" 
                alt="History" 
                className="w-3.5 h-3.5 object-contain"
              />
              Sauvegardes ({savedAnalyses.length})
            </h3>
            
            {savedAnalyses.length === 0 ? (
              <p className="text-[#0F766E]/60 text-[11px] text-center py-4">
                Aucune analyse enregistrée
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {savedAnalyses.map((saved) => (
                  <div 
                    key={saved.id}
                    className="bg-white rounded-[10px] p-3 border border-[#0F766E]/15 hover:border-[#0F766E]/40 hover:shadow-md transition-all cursor-pointer group relative"
                    onClick={() => setViewingSaved(saved)}
                  >
                    {/* Tag */}
                    {saved.tag && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] text-[9px] font-semibold rounded-full border border-[#F59E0B]/20">
                          {saved.tag}
                        </span>
                      </div>
                    )}
                    
                    {/* Nom/Titre */}
                    <h4 className="text-[#134E4A] font-semibold text-[12px] leading-tight pr-16 mb-1.5 line-clamp-2">
                      {saved.title}
                    </h4>
                    
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[#0F766E]/60 text-[9px]">
                      <img 
                        src="https://img.icons8.com/?size=100&id=86507&format=png&color=0F766E" 
                        alt="Date" 
                        className="w-3 h-3 object-contain opacity-60"
                      />
                      {saved.date}
                    </div>
                    
                    {/* Bouton Supprimer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSavedAnalysis(saved.id);
                      }}
                      className="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center text-[#0F766E]/30 hover:text-red-500 hover:bg-red-50 rounded-[4px] transition-all opacity-0 group-hover:opacity-100"
                      title="Supprimer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de visualisation d'une sauvegarde */}
        {viewingSaved && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[16px] w-full max-w-[800px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#0F766E]/10 bg-[#F0FDFA]">
                <div className="flex items-center gap-3">
                  <h3 className="text-[#134E4A] font-bold text-[18px]">{viewingSaved.title}</h3>
                  {viewingSaved.tag && (
                    <span className="px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-semibold rounded-full border border-[#F59E0B]/20">
                      {viewingSaved.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0F766E]/60 text-[11px]">{viewingSaved.date}</span>
                  <button
                    onClick={() => setViewingSaved(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-[6px] hover:bg-[#0F766E]/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-[#0F766E]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-4">
                  {/* Texte original */}
                  {viewingSaved.originalText && (
                    <div className="bg-gray-50 rounded-[10px] p-4 border border-gray-200">
                      <h4 className="text-gray-700 font-semibold text-[13px] mb-2 flex items-center gap-2">
                        <img 
                          src="https://img.icons8.com/?size=100&id=2989&format=png&color=6B7280" 
                          alt="Original text" 
                          className="w-4 h-4 object-contain"
                        />
                        Texte original analysé
                      </h4>
                      <div className="bg-white p-3 rounded-[6px] border border-gray-200 max-h-[200px] overflow-y-auto">
                        <p className="text-gray-600 text-[11px] leading-relaxed whitespace-pre-wrap">
                          {viewingSaved.originalText}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Résumé */}
                  <div className="bg-[#FAFAFA] rounded-[10px] p-4 border border-[#0F766E]/10">
                    <h4 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-2">
                      <img 
                        src="https://img.icons8.com/?size=100&id=2989&format=png&color=0F766E" 
                        alt="Summary" 
                        className="w-4 h-4 object-contain"
                      />
                      Résumé
                    </h4>
                    <p className="text-[#134E4A] text-[12px] leading-relaxed bg-white p-3 rounded-[6px] border border-[#0F766E]/10">
                      {viewingSaved.result.summary}
                    </p>
                  </div>

                  {/* Points clés */}
                  {viewingSaved.result.keyPoints.length > 0 && (
                    <div className="bg-[#FAFAFA] rounded-[10px] p-4 border border-[#0F766E]/10">
                      <h4 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-2">
                        <img 
                          src="https://img.icons8.com/?size=100&id=3913&format=png&color=0F766E" 
                          alt="Key points" 
                          className="w-4 h-4 object-contain"
                        />
                        Points clés ({viewingSaved.result.keyPoints.length})
                      </h4>
                      <ul className="space-y-1">
                        {viewingSaved.result.keyPoints.map((point, i) => (
                          <li key={i} className="text-[#134E4A] text-[11px] flex items-start gap-2 bg-white p-2 rounded-[4px] border border-[#0F766E]/5">
                            <span className="text-[#0F766E]">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Décisions */}
                  {viewingSaved.result.decisions.length > 0 && (
                    <div className="bg-[#FAFAFA] rounded-[10px] p-4 border border-[#0F766E]/10">
                      <h4 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-2">
                        <img 
                          src="https://img.icons8.com/?size=100&id=11642&format=png&color=0F766E" 
                          alt="Decisions" 
                          className="w-4 h-4 object-contain"
                        />
                        Décisions ({viewingSaved.result.decisions.length})
                      </h4>
                      <ul className="space-y-1">
                        {viewingSaved.result.decisions.map((decision, i) => (
                          <li key={i} className="text-[#134E4A] text-[11px] flex items-start gap-2 bg-white p-2 rounded-[4px] border border-[#0F766E]/5">
                            <span className="text-[#F59E0B]">★</span>
                            {decision}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  {viewingSaved.result.actionItems.length > 0 && (
                    <div className="bg-[#FAFAFA] rounded-[10px] p-4 border border-[#0F766E]/10">
                      <h4 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-2">
                        <img 
                          src="https://img.icons8.com/?size=100&id=111905&format=png&color=0F766E" 
                          alt="Actions" 
                          className="w-4 h-4 object-contain"
                        />
                        Actions ({viewingSaved.result.actionItems.length})
                      </h4>
                      <div className="space-y-2">
                        {viewingSaved.result.actionItems.map((item, i) => (
                          <div key={i} className="text-[#134E4A] text-[11px] bg-white p-3 rounded-[6px] border border-[#0F766E]/10">
                            <div className="font-medium">{item.task}</div>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-[#0F766E]/80">
                              {item.assignee && <span>👤 {item.assignee}</span>}
                              {item.deadline && <span>📅 {item.deadline}</span>}
                              {item.priority && <span className={`px-1.5 py-0.5 rounded text-[9px] ${item.priority === 'Haute' ? 'bg-red-100 text-red-600' : item.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>{item.priority}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions en suspens */}
                  {viewingSaved.result.pendingQuestions.length > 0 && (
                    <div className="bg-[#FAFAFA] rounded-[10px] p-4 border border-[#0F766E]/10">
                      <h4 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-2">
                        <img 
                          src="https://img.icons8.com/?size=100&id=8531&format=png&color=0F766E" 
                          alt="Questions" 
                          className="w-4 h-4 object-contain"
                        />
                        Questions en suspens ({viewingSaved.result.pendingQuestions.length})
                      </h4>
                      <ul className="space-y-1">
                        {viewingSaved.result.pendingQuestions.map((q, i) => (
                          <li key={i} className="text-[#134E4A] text-[11px] flex items-start gap-2 bg-white p-2 rounded-[4px] border border-[#0F766E]/5">
                            <span className="text-[#0F766E]">?</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Alertes conformité */}
                  {viewingSaved.result.alertesConformite && viewingSaved.result.alertesConformite.length > 0 && (
                    <div className="bg-red-50 rounded-[10px] p-4 border border-red-100">
                      <h4 className="text-red-700 font-semibold text-[13px] mb-2 flex items-center gap-2">
                        <img 
                          src="https://img.icons8.com/?size=100&id=8333&format=png&color=EF4444" 
                          alt="Alertes" 
                          className="w-4 h-4 object-contain"
                        />
                        Alertes conformité ({viewingSaved.result.alertesConformite.length})
                      </h4>
                      <div className="space-y-2">
                        {viewingSaved.result.alertesConformite.map((alerte, i) => (
                          <div key={i} className="text-[11px] bg-white p-3 rounded-[6px] border border-red-100">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                alerte.severite === 'Haute' ? 'bg-red-100 text-red-600' : 
                                alerte.severite === 'Moyenne' ? 'bg-yellow-100 text-yellow-600' : 
                                'bg-green-100 text-green-600'
                              }`}>
                                {alerte.severite}
                              </span>
                              <span className="text-red-600 font-medium uppercase text-[9px]">{alerte.type}</span>
                            </div>
                            <p className="text-gray-700">{alerte.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer - Boutons d'export */}
              <div className="border-t border-[#0F766E]/10 p-4 bg-[#FAFAFA]">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="text-[#0F766E]/60 text-[11px]">Exporter cette analyse :</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Export PDF */}
                    <button
                      onClick={() => {
                        // @ts-ignore - Exporter le PDF
                        const { exportToPDF } = require('../utils/exporters/pdf');
                        exportToPDF(viewingSaved.result, () => {});
                      }}
                      className="px-2 py-1.5 bg-red-50 text-red-600 text-[10px] font-medium rounded-[4px] hover:bg-red-100 transition-colors border border-red-200"
                      title="Exporter PDF"
                    >
                      PDF
                    </button>
                    {/* Export DOCX */}
                    <button
                      onClick={() => {
                        // @ts-ignore - Exporter DOCX
                        const { exportToDOCX } = require('../utils/exporters/docx');
                        exportToDOCX(viewingSaved.result, () => {});
                      }}
                      className="px-2 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-[4px] hover:bg-blue-100 transition-colors border border-blue-200"
                      title="Exporter Word"
                    >
                      DOCX
                    </button>
                    {/* Export TXT */}
                    <button
                      onClick={() => {
                        // @ts-ignore - Exporter TXT
                        const { exportToTXT } = require('../utils/exporters/txt');
                        exportToTXT(viewingSaved.result, () => {});
                      }}
                      className="px-2 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-medium rounded-[4px] hover:bg-gray-100 transition-colors border border-gray-200"
                      title="Exporter Texte"
                    >
                      TXT
                    </button>
                    {/* Export CSV */}
                    <button
                      onClick={() => {
                        // @ts-ignore - Exporter CSV
                        const { exportToCSV } = require('../utils/exporters/csv');
                        exportToCSV(viewingSaved.result, () => {});
                      }}
                      className="px-2 py-1.5 bg-green-50 text-green-600 text-[10px] font-medium rounded-[4px] hover:bg-green-100 transition-colors border border-green-200"
                      title="Exporter CSV"
                    >
                      CSV
                    </button>
                    {/* Export XLSX */}
                    <button
                      onClick={() => {
                        // @ts-ignore - Exporter XLSX
                        const { exportToXLS } = require('../utils/exporters/xlsx');
                        exportToXLS(viewingSaved.result, () => {});
                      }}
                      className="px-2 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded-[4px] hover:bg-emerald-100 transition-colors border border-emerald-200"
                      title="Exporter Excel"
                    >
                      XLSX
                    </button>
                    <div className="w-px h-6 bg-[#0F766E]/20 mx-1" />
                    <button
                      onClick={() => onLoadSavedAnalysis(viewingSaved)}
                      className="px-3 py-1.5 bg-[#0F766E] text-white text-[10px] font-medium rounded-[4px] hover:bg-[#134E4A] transition-colors flex items-center gap-1.5"
                    >
                      <img 
                        src="https://img.icons8.com/?size=100&id=11240&format=png&color=FFFFFF" 
                        alt="Load" 
                        className="w-3 h-3 object-contain"
                      />
                      Charger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
