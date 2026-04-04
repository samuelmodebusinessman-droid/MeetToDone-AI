import { AnalysisResult } from '../../types';

export const exportToCSV = (
  analysisResult: AnalysisResult,
  setShowExportDropdown?: (show: boolean) => void
): void => {
  let csvContent = '\uFEFF'; // BOM for UTF-8
  csvContent += 'Type,Numéro,Contenu,Responsable,Date,Priorité\n';
  
  // Résumé
  csvContent += `"Résumé","1","${analysisResult.summary.replace(/"/g, '""')}","","",""\n`;
  
  // Points clés
  if (analysisResult.keyPoints?.length > 0) {
    analysisResult.keyPoints.forEach((point, idx) => {
      csvContent += `"Point clé","${idx + 1}","${point.replace(/"/g, '""')}","","",""\n`;
    });
  }
  
  // Décisions
  if (analysisResult.decisions?.length > 0) {
    analysisResult.decisions.forEach((decision, idx) => {
      csvContent += `"Décision","${idx + 1}","${decision.replace(/"/g, '""')}","","",""\n`;
    });
  }
  
  // Actions
  if (analysisResult.actionItems?.length > 0) {
    analysisResult.actionItems.forEach((action, idx) => {
      csvContent += `"Action","${idx + 1}","${action.task.replace(/"/g, '""')}","${action.assignee || ''}","${action.deadline || ''}","${action.priority || ''}"\n`;
    });
  }
  
  // Points en suspens
  if (analysisResult.pendingQuestions?.length > 0) {
    csvContent += `"Section","","Points en suspens","","",""\n`;
    analysisResult.pendingQuestions.forEach((q, idx) => {
      csvContent += `"Point en suspens","${idx + 1}","${q.replace(/"/g, '""')}","","",""\n`;
    });
  }
  
  // Alertes de conformité
  if (analysisResult.alertesConformite && analysisResult.alertesConformite.length > 0) {
    csvContent += `"Section","","Alertes de Conformité","","",""\n`;
    analysisResult.alertesConformite.forEach((alerte, idx) => {
      const typeLabel = alerte.type === 'incoherence' ? 'Incohérence' : 
                        alerte.type === 'oubli' ? 'Oubli' : 'Écart';
      csvContent += `"Alerte","${idx + 1}","${typeLabel}: ${alerte.description.replace(/"/g, '""')}","","","${alerte.severite}"\n`;
    });
  }
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume-reunion.csv';
  a.click();
  URL.revokeObjectURL(url);
  if (setShowExportDropdown) setShowExportDropdown(false);
};
