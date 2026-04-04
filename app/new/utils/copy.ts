import { AnalysisResult } from '../types';

interface CopyAnalysisProps {
  analysisResult: AnalysisResult;
  setCopied: (copied: boolean) => void;
  setError: (error: string | null) => void;
}

export const copyAnalysisResult = async ({
  analysisResult,
  setCopied,
  setError
}: CopyAnalysisProps): Promise<void> => {
  // Formater le contenu pour le copier
  let textToCopy = `📋 RÉSUMÉ DE RÉUNION\n\n`;
  textToCopy += `📝 ${analysisResult.summary}\n\n`;
  
  if (analysisResult.generalInfo) {
    textToCopy += `📅 ${analysisResult.generalInfo.dateTime || 'Non spécifié'}\n`;
    textToCopy += `📍 ${analysisResult.generalInfo.location || 'Non spécifié'}\n`;
    textToCopy += `📋 ${analysisResult.generalInfo.agenda || 'Non spécifié'}\n\n`;
    
    if (analysisResult.generalInfo.participants?.length > 0) {
      textToCopy += `👥 Participants:\n`;
      analysisResult.generalInfo.participants.forEach(p => {
        textToCopy += `  • ${p}\n`;
      });
      textToCopy += `\n`;
    }
  }
  
  if (analysisResult.keyPoints?.length > 0) {
    textToCopy += `🔑 Points clés:\n`;
    analysisResult.keyPoints.forEach(point => {
      textToCopy += `  • ${point}\n`;
    });
    textToCopy += `\n`;
  }
  
  if (analysisResult.decisions?.length > 0) {
    textToCopy += `✅ Décisions:\n`;
    analysisResult.decisions.forEach(decision => {
      textToCopy += `  • ${decision}\n`;
    });
    textToCopy += `\n`;
  }
  
  if (analysisResult.actionItems?.length > 0) {
    textToCopy += `📌 Actions:\n`;
    analysisResult.actionItems.forEach((action, idx) => {
      textToCopy += `  ${idx + 1}. ${action.task}`;
      if (action.assignee) textToCopy += ` (👤 ${action.assignee})`;
      if (action.deadline) textToCopy += ` (📅 ${action.deadline})`;
      if (action.priority) textToCopy += ` [${action.priority}]`;
      textToCopy += `\n`;
    });
    textToCopy += `\n`;
  }
  
  if (analysisResult.pendingQuestions?.length > 0) {
    textToCopy += `❓ Points en suspens:\n`;
    analysisResult.pendingQuestions.forEach(q => {
      textToCopy += `  • ${q}\n`;
    });
    textToCopy += `\n`;
  }
  
  // Alertes de conformité
  const alertes = analysisResult.alertesConformite;
  if (alertes && alertes.length > 0) {
    textToCopy += `⚠️ Alertes de Conformité:\n`;
    alertes.forEach((alerte, idx) => {
      const typeLabel = alerte.type === 'incoherence' ? 'Incohérence' : 
                        alerte.type === 'oubli' ? 'Oubli' : 'Écart';
      const emoji = alerte.severite === 'Haute' ? '🔴' : alerte.severite === 'Moyenne' ? '🟠' : '🟡';
      textToCopy += `  ${emoji} [${alerte.severite}] ${typeLabel}: ${alerte.description}\n`;
    });
    textToCopy += `\n`;
  }
  
  if (analysisResult.otherInfo) {
    textToCopy += `ℹ️ Autres informations:\n${analysisResult.otherInfo}\n`;
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    setError("Erreur lors de la copie");
  }
};
