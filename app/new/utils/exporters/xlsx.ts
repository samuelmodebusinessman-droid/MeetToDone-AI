import { AnalysisResult } from '../../types';

export const exportToXLS = async (
  analysisResult: AnalysisResult,
  setShowExportDropdown?: (show: boolean) => void
): Promise<void> => {
  const XLSX = await import('xlsx');
  
  // Créer un nouveau workbook
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "Résumé de Réunion",
    Subject: "Analyse de réunion",
    Author: "MeetToDone AI",
    CreatedDate: new Date()
  };
  
  // Préparer les données pour la feuille principale
  const data = [];
  
  // Titre et résumé
  data.push(["RÉSUMÉ DE RÉUNION"]);
  data.push([]);
  data.push(["Résumé:"]);
  data.push([analysisResult.summary]);
  data.push([]);
  
  // Informations générales
  if (analysisResult.generalInfo) {
    data.push(["INFORMATIONS GÉNÉRALES"]);
    if (analysisResult.generalInfo.dateTime) {
      data.push(["Date/Heure:", analysisResult.generalInfo.dateTime]);
    }
    if (analysisResult.generalInfo.location) {
      data.push(["Lieu:", analysisResult.generalInfo.location]);
    }
    if (analysisResult.generalInfo.agenda) {
      data.push(["Ordre du jour:", analysisResult.generalInfo.agenda]);
    }
    data.push([]);
  }
  
  // Points clés
  if (analysisResult.keyPoints?.length > 0) {
    data.push(["POINTS CLÉS DISCUTÉS"]);
    data.push(["N°", "Description"]);
    analysisResult.keyPoints.forEach((point, idx) => {
      data.push([idx + 1, point]);
    });
    data.push([]);
  }
  
  // Décisions
  if (analysisResult.decisions?.length > 0) {
    data.push(["DÉCISIONS PRISES"]);
    data.push(["N°", "Décision"]);
    analysisResult.decisions.forEach((decision, idx) => {
      data.push([idx + 1, decision]);
    });
    data.push([]);
  }
  
  // Actions
  if (analysisResult.actionItems?.length > 0) {
    data.push(["ACTIONS À SUIVRE"]);
    data.push(["N°", "Tâche", "Responsable", "Date", "Priorité"]);
    analysisResult.actionItems.forEach((action, idx) => {
      data.push([
        idx + 1,
        action.task,
        action.assignee || '-',
        action.deadline || '-',
        action.priority || '-'
      ]);
    });
    data.push([]);
  }
  
  // Points en suspens
  if (analysisResult.pendingQuestions?.length > 0) {
    data.push(["POINTS EN SUSPENS"]);
    data.push(["N°", "Question"]);
    analysisResult.pendingQuestions.forEach((q, idx) => {
      data.push([idx + 1, q]);
    });
    data.push([]);
  }
  
  // Alertes de conformité
  if (analysisResult.alertesConformite && analysisResult.alertesConformite.length > 0) {
    data.push(["ALERTES DE CONFORMITÉ"]);
    data.push(["N°", "Type", "Description", "Sévérité"]);
    analysisResult.alertesConformite.forEach((alerte, idx) => {
      const typeLabel = alerte.type === 'incoherence' ? 'Incohérence' : 
                        alerte.type === 'oubli' ? 'Oubli' : 'Écart';
      data.push([idx + 1, typeLabel, alerte.description, alerte.severite]);
    });
  }
  
  // Créer la feuille de calcul
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Définir les largeurs de colonnes
  ws['!cols'] = [
    { wch: 5 },   // N°
    { wch: 50 },  // Description/Tâche
    { wch: 20 },  // Responsable
    { wch: 15 },  // Date
    { wch: 15 }   // Priorité
  ];
  
  // Ajouter la feuille au workbook
  XLSX.utils.book_append_sheet(wb, ws, "Résumé");
  
  // Générer et télécharger le fichier
  XLSX.writeFile(wb, "resume-reunion.xlsx");
  if (setShowExportDropdown) setShowExportDropdown(false);
};
