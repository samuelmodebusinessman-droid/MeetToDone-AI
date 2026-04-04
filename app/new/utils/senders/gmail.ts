import { AnalysisResult } from '../../types';

interface SendToGmailProps {
  analysisResult: AnalysisResult;
  gmailAddress: string;
  setError: (error: string | null) => void;
  setSendingToGmail: (sending: boolean) => void;
}

export const sendToGmail = async ({
  analysisResult,
  gmailAddress,
  setError,
  setSendingToGmail
}: SendToGmailProps): Promise<void> => {
  setSendingToGmail(true);
  setError(null);
  
  try {
    // Construire le contenu de l'email
    let emailBody = `RÉSUMÉ DE RÉUNION\n\n`;
    emailBody += `Résumé:\n${analysisResult.summary}\n\n`;
    
    if (analysisResult.generalInfo) {
      emailBody += `Informations générales:\n`;
      if (analysisResult.generalInfo.dateTime) emailBody += `Date/Heure: ${analysisResult.generalInfo.dateTime}\n`;
      if (analysisResult.generalInfo.location) emailBody += `Lieu: ${analysisResult.generalInfo.location}\n`;
      if (analysisResult.generalInfo.agenda) emailBody += `Ordre du jour: ${analysisResult.generalInfo.agenda}\n\n`;
    }
    
    if (analysisResult.keyPoints?.length > 0) {
      emailBody += `Points clés discutés:\n`;
      analysisResult.keyPoints.forEach((point, idx) => {
        emailBody += `${idx + 1}. ${point}\n`;
      });
      emailBody += `\n`;
    }
    
    if (analysisResult.decisions?.length > 0) {
      emailBody += `Décisions prises:\n`;
      analysisResult.decisions.forEach((decision, idx) => {
        emailBody += `${idx + 1}. ${decision}\n`;
      });
      emailBody += `\n`;
    }
    
    if (analysisResult.actionItems?.length > 0) {
      emailBody += `Actions à suivre:\n`;
      analysisResult.actionItems.forEach((action, idx) => {
        emailBody += `${idx + 1}. ${action.task}`;
        if (action.assignee) emailBody += ` (Responsable: ${action.assignee})`;
        if (action.deadline) emailBody += ` (Date: ${action.deadline})`;
        if (action.priority) emailBody += ` [Priorité: ${action.priority}]`;
        emailBody += `\n`;
      });
      emailBody += `\n`;
    }
    
    if (analysisResult.pendingQuestions?.length > 0) {
      emailBody += `Points en suspens:\n`;
      analysisResult.pendingQuestions.forEach((q, idx) => {
        emailBody += `${idx + 1}. ${q}\n`;
      });
      emailBody += `\n`;
    }
    
    // Alertes de conformité
    const alertesGmail = analysisResult.alertesConformite;
    if (alertesGmail && alertesGmail.length > 0) {
      emailBody += `Alertes de Conformité:\n`;
      alertesGmail.forEach((alerte, idx) => {
        const typeLabel = alerte.type === 'incoherence' ? 'Incohérence' : 
                          alerte.type === 'oubli' ? 'Oubli' : 'Écart';
        emailBody += `${idx + 1}. [${alerte.severite}] ${typeLabel}: ${alerte.description}\n`;
      });
    }
    
    // Ouvrir Gmail avec le mailto
    const subject = encodeURIComponent("Résumé de Réunion - MeetToDone AI");
    const body = encodeURIComponent(emailBody);
    const to = encodeURIComponent(gmailAddress);
    
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`, '_blank');
    
    setError("✅ Gmail ouvert avec le résumé !");
    setTimeout(() => setError(null), 3000);
  } catch (err) {
    console.error("Erreur Gmail:", err);
    setError("Erreur lors de l'ouverture de Gmail");
  } finally {
    setSendingToGmail(false);
  }
};
