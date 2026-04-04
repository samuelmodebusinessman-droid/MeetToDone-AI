import { AnalysisResult } from '../../types';

export const exportToTXT = (
  analysisResult: AnalysisResult,
  setShowExportDropdown?: (show: boolean) => void
): void => {
  let textContent = `RÉSUMÉ DE RÉUNION\n`;
  textContent += `${'='.repeat(50)}\n\n`;
  textContent += `RÉSUMÉ:\n${analysisResult.summary}\n\n`;
  
  if (analysisResult.generalInfo) {
    textContent += `INFORMATIONS GÉNÉRALES\n${'-'.repeat(30)}\n`;
    if (analysisResult.generalInfo.dateTime) textContent += `Date/Heure: ${analysisResult.generalInfo.dateTime}\n`;
    if (analysisResult.generalInfo.location) textContent += `Lieu: ${analysisResult.generalInfo.location}\n`;
    if (analysisResult.generalInfo.agenda) textContent += `Ordre du jour: ${analysisResult.generalInfo.agenda}\n`;
    
    if (analysisResult.generalInfo.participants?.length > 0) {
      textContent += `\nParticipants:\n`;
      analysisResult.generalInfo.participants.forEach(p => {
        textContent += `  - ${p}\n`;
      });
    }
    textContent += `\n`;
  }
  
  if (analysisResult.keyPoints?.length > 0) {
    textContent += `POINTS CLÉS\n${'-'.repeat(30)}\n`;
    analysisResult.keyPoints.forEach((point, idx) => {
      textContent += `${idx + 1}. ${point}\n`;
    });
    textContent += `\n`;
  }
  
  if (analysisResult.decisions?.length > 0) {
    textContent += `DÉCISIONS\n${'-'.repeat(30)}\n`;
    analysisResult.decisions.forEach((decision, idx) => {
      textContent += `${idx + 1}. ${decision}\n`;
    });
    textContent += `\n`;
  }
  
  if (analysisResult.actionItems?.length > 0) {
    textContent += `ACTIONS À SUIVRE\n${'-'.repeat(30)}\n`;
    analysisResult.actionItems.forEach((action, idx) => {
      textContent += `${idx + 1}. ${action.task}`;
      if (action.assignee) textContent += ` [Responsable: ${action.assignee}]`;
      if (action.deadline) textContent += ` [Date: ${action.deadline}]`;
      if (action.priority) textContent += ` [Priorité: ${action.priority}]`;
      textContent += `\n`;
    });
    textContent += `\n`;
  }
  
  if (analysisResult.pendingQuestions?.length > 0) {
    textContent += `POINTS EN SUSPENS\n${'-'.repeat(30)}\n`;
    analysisResult.pendingQuestions.forEach((q, idx) => {
      textContent += `${idx + 1}. ${q}\n`;
    });
    textContent += `\n`;
  }
  
  // Alertes de conformité
  if (analysisResult.alertesConformite && analysisResult.alertesConformite.length > 0) {
    textContent += `ALERTES DE CONFORMITÉ\n${'-'.repeat(30)}\n`;
    analysisResult.alertesConformite.forEach((alerte, idx) => {
      const typeLabel = alerte.type === 'incoherence' ? 'Incohérence' : 
                        alerte.type === 'oubli' ? 'Oubli' : 'Écart';
      textContent += `${idx + 1}. [${alerte.severite}] ${typeLabel}: ${alerte.description}\n`;
    });
  }
  
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume-reunion.txt';
  a.click();
  URL.revokeObjectURL(url);
  if (setShowExportDropdown) setShowExportDropdown(false);
};
