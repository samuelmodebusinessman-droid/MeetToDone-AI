import { AnalysisResult } from '../../types';

interface SendToSlackProps {
  analysisResult: AnalysisResult;
  slackWebhookUrl: string;
  setError: (error: string | null) => void;
  setSendingToSlack: (sending: boolean) => void;
}

export const sendToSlack = async ({
  analysisResult,
  slackWebhookUrl,
  setError,
  setSendingToSlack
}: SendToSlackProps): Promise<void> => {
  setSendingToSlack(true);
  setError(null);
  
  try {
    // Construire le message Slack formaté
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📋 Résumé de Réunion",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Résumé:*\n${analysisResult.summary}`
        }
      }
    ];
    
    // Informations générales
    if (analysisResult.generalInfo) {
      let infoText = "*Informations générales:*\n";
      if (analysisResult.generalInfo.dateTime) infoText += `📅 ${analysisResult.generalInfo.dateTime}\n`;
      if (analysisResult.generalInfo.location) infoText += `📍 ${analysisResult.generalInfo.location}\n`;
      if (analysisResult.generalInfo.agenda) infoText += `📋 ${analysisResult.generalInfo.agenda}\n`;
      
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: infoText
        }
      });
    }
    
    // Points clés
    if (analysisResult.keyPoints?.length > 0) {
      let pointsText = "*🔑 Points clés:*\n";
      analysisResult.keyPoints.forEach((point, idx) => {
        pointsText += `${idx + 1}. ${point}\n`;
      });
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: pointsText
        }
      });
    }
    
    // Décisions
    if (analysisResult.decisions?.length > 0) {
      let decisionsText = "*✅ Décisions:*\n";
      analysisResult.decisions.forEach((decision, idx) => {
        decisionsText += `${idx + 1}. ${decision}\n`;
      });
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: decisionsText
        }
      });
    }
    
    // Actions
    if (analysisResult.actionItems?.length > 0) {
      let actionsText = "*📌 Actions à suivre:*\n";
      analysisResult.actionItems.forEach((action, idx) => {
        actionsText += `${idx + 1}. *${action.task}*`;
        if (action.assignee) actionsText += ` (👤 ${action.assignee})`;
        if (action.deadline) actionsText += ` (📅 ${action.deadline})`;
        if (action.priority) actionsText += ` [${action.priority}]`;
        actionsText += "\n";
      });
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: actionsText
        }
      });
    }
    
    // Points en suspens
    if (analysisResult.pendingQuestions?.length > 0) {
      let questionsText = "*❓ Points en suspens:*\n";
      analysisResult.pendingQuestions.forEach((q, idx) => {
        questionsText += `${idx + 1}. ${q}\n`;
      });
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: questionsText
        }
      });
    }
    
    // Alertes de conformité
    const alertesSlack = analysisResult.alertesConformite;
    if (alertesSlack && alertesSlack.length > 0) {
      let alertesText = "*⚠️ Alertes de Conformité:*\n";
      alertesSlack.forEach((alerte, idx) => {
        const typeLabel = alerte.type === 'incoherence' ? 'Incohérence' : 
                          alerte.type === 'oubli' ? 'Oubli' : 'Écart';
        const emoji = alerte.severite === 'Haute' ? '🔴' : alerte.severite === 'Moyenne' ? '🟠' : '🟡';
        alertesText += `${emoji} *${typeLabel}* (${alerte.severite}): ${alerte.description}\n`;
      });
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: alertesText
        }
      });
    }
    
    // Envoyer le message au webhook Slack
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blocks })
    });
    
    if (response.ok) {
      setError("✅ Envoyé à Slack avec succès !");
      setTimeout(() => setError(null), 3000);
    } else {
      throw new Error("Erreur lors de l'envoi à Slack");
    }
  } catch (err) {
    console.error("Erreur Slack:", err);
    setError("Erreur lors de l'envoi à Slack. Vérifiez votre webhook URL.");
  } finally {
    setSendingToSlack(false);
  }
};
