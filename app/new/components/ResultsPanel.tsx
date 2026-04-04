"use client";

import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, AlertCircle, Loader2, Bot } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsPanelProps {
  analysisResult: AnalysisResult | null;
  copied: boolean;
  sendingToSlack: boolean;
  sendingToGmail: boolean;
  showExportDropdown: boolean;
  setShowExportDropdown: (show: boolean) => void;
  onCopy: () => void;
  onSendSlack: () => void;
  onSendGmail: () => void;
  onExportXLS: () => void;
  onExportDOCX: () => void;
  onExportTXT: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  analysisResult,
  copied,
  sendingToSlack,
  sendingToGmail,
  showExportDropdown,
  setShowExportDropdown,
  onCopy,
  onSendSlack,
  onSendGmail,
  onExportXLS,
  onExportDOCX,
  onExportTXT,
  onExportCSV,
  onExportPDF
}) => {
  return (
    <div className="bg-white border-[2px] border-[#0F766E] rounded-[16px] p-5 flex flex-col shadow-sm h-[480px] flex-1">
      <div className="pr-1 flex flex-col h-full overflow-hidden">
        <h2 className="text-[#134E4A] font-bold text-[20px] mb-1">Résumé exécutif</h2>
        <p className="text-[#0F766E]/80 text-[12px] mb-2 leading-relaxed">
          Points clés, décisions et tâches générés par l&apos;IA.
        </p>

        {/* Boutons d'action */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onCopy}
              disabled={!analysisResult}
              className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-all border ${
                copied 
                  ? 'bg-[#0F766E] border-[#0F766E]' 
                  : 'bg-white border-[#0F766E]/20 hover:border-[#0F766E]/50'
              } ${!analysisResult ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={copied ? "Copié !" : "Copier"}
            >
              {copied ? (
                <span className="text-white text-[10px] font-bold">✓</span>
              ) : (
                <img 
                  src="https://img.icons8.com/?size=100&id=Cc3xUWwG4uK7&format=png&color=000000" 
                  alt="Copier" 
                  className="w-4 h-4 object-contain"
                />
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onSendSlack}
              disabled={!analysisResult || sendingToSlack}
              className={`w-8 h-8 rounded-[6px] flex items-center justify-center bg-white border border-[#0F766E]/20 hover:border-[#4A154B]/50 transition-all ${!analysisResult ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Slack"
            >
              {sendingToSlack ? (
                <Loader2 className="w-4 h-4 text-[#4A154B] animate-spin" />
              ) : (
                <img 
                  src="https://img.icons8.com/?size=100&id=kikR2jIn6485&format=png&color=000000" 
                  alt="Slack" 
                  className="w-4 h-4 object-contain"
                />
              )}
            </button>
            <button
              onClick={onSendGmail}
              disabled={!analysisResult || sendingToGmail}
              className={`w-8 h-8 rounded-[6px] flex items-center justify-center bg-white border border-[#0F766E]/20 hover:border-[#EA4335]/50 transition-all ${!analysisResult ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Gmail"
            >
              {sendingToGmail ? (
                <Loader2 className="w-4 h-4 text-[#EA4335] animate-spin" />
              ) : (
                <img 
                  src="https://img.icons8.com/?size=100&id=P7UIlhbpWzZm&format=png&color=000000" 
                  alt="Gmail" 
                  className="w-4 h-4 object-contain"
                />
              )}
            </button>
            <button
              onClick={onExportXLS}
              disabled={!analysisResult}
              className={`w-8 h-8 rounded-[6px] flex items-center justify-center bg-white border border-[#0F766E]/20 hover:border-[#217346]/50 transition-all ${!analysisResult ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Excel"
            >
              <img 
                src="https://img.icons8.com/?size=100&id=JChkA69vF7Lo&format=png&color=000000" 
                alt="Excel" 
                className="w-4 h-4 object-contain"
              />
            </button>
            <button
              onClick={onExportDOCX}
              disabled={!analysisResult}
              className={`w-8 h-8 rounded-[6px] flex items-center justify-center bg-white border border-[#0F766E]/20 hover:border-[#2B579A]/50 transition-all ${!analysisResult ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Word"
            >
              <img 
                src="https://img.icons8.com/?size=100&id=EqxMzyq5jqdz&format=png&color=000000" 
                alt="Word" 
                className="w-4 h-4 object-contain"
              />
            </button>
          </div>
          
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              disabled={!analysisResult}
              className={`w-8 h-8 rounded-[6px] flex items-center justify-center bg-white border border-[#0F766E]/20 hover:border-[#0F766E]/50 transition-all ${!analysisResult ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Exporter"
            >
              <img 
                src="https://img.icons8.com/?size=100&id=82829&format=png&color=000000" 
                alt="Exporter" 
                className="w-4 h-4 object-contain"
              />
            </button>
            
            {/* Dropdown d'export */}
            {showExportDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-[8px] shadow-lg border border-[#0F766E]/20 py-1 z-10 min-w-[140px]">
                <button
                  onClick={onExportDOCX}
                  className="w-full px-3 py-2 text-left text-[12px] text-[#134E4A] hover:bg-[#0F766E]/10 transition-colors flex items-center gap-2"
                >
                  <img src="https://img.icons8.com/?size=100&id=111941&format=png&color=000000" alt="DOC" className="w-4 h-4 object-contain" />
                  Exporter DOC
                </button>
                <button
                  onClick={onExportXLS}
                  className="w-full px-3 py-2 text-left text-[12px] text-[#134E4A] hover:bg-[#0F766E]/10 transition-colors flex items-center gap-2"
                >
                  <img src="https://img.icons8.com/?size=100&id=111774&format=png&color=000000" alt="XLS" className="w-4 h-4 object-contain" />
                  Exporter XLS
                </button>
                <button
                  onClick={onExportTXT}
                  className="w-full px-3 py-2 text-left text-[12px] text-[#134E4A] hover:bg-[#0F766E]/10 transition-colors flex items-center gap-2"
                >
                  <img src="https://img.icons8.com/?size=100&id=111961&format=png&color=000000" alt="TXT" className="w-4 h-4 object-contain" />
                  Exporter TXT
                </button>
                <button
                  onClick={onExportCSV}
                  className="w-full px-3 py-2 text-left text-[12px] text-[#134E4A] hover:bg-[#0F766E]/10 transition-colors flex items-center gap-2"
                >
                  <img src="https://img.icons8.com/?size=100&id=111975&format=png&color=000000" alt="CSV" className="w-4 h-4 object-contain" />
                  Exporter CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenu scrollable des résultats */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {analysisResult ? (
            <div className="space-y-4 pb-2">
              {/* Résumé */}
              <div className="bg-[#FAFAFA] rounded-[10px] p-3 border border-[#0F766E]/10">
                <h3 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#0F766E]" />
                  Résumé
                </h3>
                <p className="text-[#333] text-[12px] leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Informations générales */}
              {analysisResult.generalInfo && (
                <div className="bg-[#0F766E]/5 rounded-[10px] p-3 border border-[#0F766E]/10">
                  <h3 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[#0F766E]" />
                    Informations générales
                  </h3>
                  <div className="space-y-1.5 text-[12px]">
                    {analysisResult.generalInfo.dateTime && (
                      <p><span className="text-[#0F766E] font-medium">Date/Heure:</span> {analysisResult.generalInfo.dateTime}</p>
                    )}
                    {analysisResult.generalInfo.location && (
                      <p><span className="text-[#0F766E] font-medium">Lieu:</span> {analysisResult.generalInfo.location}</p>
                    )}
                    {analysisResult.generalInfo.agenda && (
                      <p><span className="text-[#0F766E] font-medium">Ordre du jour:</span> {analysisResult.generalInfo.agenda}</p>
                    )}
                    {analysisResult.generalInfo.participants && analysisResult.generalInfo.participants.length > 0 && (
                      <div>
                        <span className="text-[#0F766E] font-medium">Participants:</span>
                        <ul className="ml-4 mt-1 space-y-0.5">
                          {analysisResult.generalInfo.participants.map((p, idx) => (
                            <li key={idx} className="text-[#333]">• {p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Points clés */}
              <div className="bg-[#FEF3C7]/30 rounded-[10px] p-3 border border-[#F59E0B]/20">
                <h3 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                  Points clés discutés
                </h3>
                <ul className="space-y-1.5">
                  {analysisResult.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-[#333] text-[12px] flex items-start gap-1.5">
                      <span className="text-[#F59E0B] mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Décisions */}
              <div className="bg-[#0F766E]/5 rounded-[10px] p-3 border border-[#0F766E]/10">
                <h3 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                  Décisions prises
                </h3>
                <ul className="space-y-1.5">
                  {analysisResult.decisions.map((decision, idx) => (
                    <li key={idx} className="text-[#333] text-[12px] flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions à suivre */}
              <div className="bg-[#FB7185]/5 rounded-[10px] p-3 border border-[#FB7185]/20">
                <h3 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#FB7185]" />
                  Actions à suivre
                </h3>
                <ul className="space-y-2">
                  {analysisResult.actionItems.map((action, idx) => (
                    <li key={idx} className="text-[#333] text-[12px] flex items-start gap-2">
                      <span className="w-5 h-5 bg-[#FB7185]/20 text-[#FB7185] rounded text-[10px] flex items-center justify-center shrink-0 font-semibold">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{action.task}</p>
                        <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-[#666]">
                          {action.assignee && <span>👤 {action.assignee}</span>}
                          {action.deadline && <span>📅 {action.deadline}</span>}
                          {action.priority && <span className={`px-1.5 py-0.5 rounded ${action.priority.toLowerCase().includes('haute') ? 'bg-red-100 text-red-600' : action.priority.toLowerCase().includes('moyenne') ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>⚡ {action.priority}</span>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Points en suspens */}
              {analysisResult.pendingQuestions && analysisResult.pendingQuestions.length > 0 && (
                <div className="bg-gray-50 rounded-[10px] p-3 border border-gray-200">
                  <h3 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    Points en suspens
                  </h3>
                  <ul className="space-y-1.5">
                    {analysisResult.pendingQuestions.map((question, idx) => (
                      <li key={idx} className="text-[#333] text-[12px] flex items-start gap-1.5">
                        <span className="text-gray-400 mt-0.5">?</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Autres informations */}
              {analysisResult.otherInfo && (
                <div className="bg-[#F59E0B]/5 rounded-[10px] p-3 border border-[#F59E0B]/20">
                  <h3 className="text-[#134E4A] font-semibold text-[13px] mb-2">
                    Autres informations importantes
                  </h3>
                  <p className="text-[#333] text-[12px] leading-relaxed">
                    {analysisResult.otherInfo}
                  </p>
                </div>
              )}

              {/* Alertes de Conformité */}
              {analysisResult.alertesConformite && analysisResult.alertesConformite.length > 0 && (
                <div className="bg-[#FFF7ED] rounded-[10px] p-3 border border-[#F59E0B]/30">
                  <h3 className="text-[#134E4A] font-semibold text-[13px] mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                    Alertes de Cohérence
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.alertesConformite.map((alerte, idx) => (
                      <li key={idx} className="text-[#333] text-[12px] flex items-start gap-2">
                        <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center shrink-0 font-semibold ${
                          alerte.severite === 'Haute' 
                            ? 'bg-red-100 text-red-600' 
                            : alerte.severite === 'Moyenne'
                              ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                              : 'bg-green-100 text-green-600'
                        }`}>
                          {alerte.severite === 'Haute' ? '!' : alerte.severite === 'Moyenne' ? '?' : 'i'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">
                            {alerte.type === 'incoherence' && 'Incohérence'}
                            {alerte.type === 'oubli' && 'Oubli'}
                            {alerte.type === 'ecart' && 'Écart'}
                            {': '}
                            {alerte.description}
                          </p>
                          <span className="text-[10px] text-[#0F766E]/60">
                            Sévérité: {alerte.severite}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* État vide */
            <div className="flex-1 flex flex-col items-center justify-center min-h-0">
              <div className="relative w-36 h-36 mb-4">
                <div className="absolute inset-0 bg-[#FB7185]/10 rounded-full" />
                <div className="absolute inset-2 bg-[#FB7185]/18 rounded-full" />
                <div className="absolute inset-4 bg-[#FB7185]/26 rounded-full" />
                <div className="absolute inset-6 bg-[#FB7185]/34 rounded-full" />
                <div className="absolute inset-8 bg-[#FB7185]/45 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <BarChart3 className="w-9 h-9 text-white" strokeWidth={1.5} />
                    <TrendingUp className="absolute -top-1 -right-4 w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1.5 max-w-xs">
                <p className="text-[#134E4A] font-bold text-[16px]">L&apos;analyse apparaîtra ici</p>
                <p className="text-[#0F766E]/60 text-[13px] leading-relaxed">
                  Importez votre réunion pour obtenir un résumé structuré avec décisions et actions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
