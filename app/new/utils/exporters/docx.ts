import { AnalysisResult } from '../../types';

export const exportToDOCX = async (
  analysisResult: AnalysisResult,
  setShowExportDropdown?: (show: boolean) => void
): Promise<void> => {
  const docx = await import('docx');
  const { Document, Paragraph, TextRun, HeadingLevel, Packer } = docx;
  
  const children = [];
  
  // Titre
  children.push(new Paragraph({
    text: 'Résumé de Réunion',
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 200 }
  }));
  
  // Résumé
  children.push(new Paragraph({
    children: [new TextRun({ text: 'Résumé', bold: true })],
    spacing: { after: 100 }
  }));
  children.push(new Paragraph({
    text: analysisResult.summary,
    spacing: { after: 200 }
  }));
  
  // Informations générales
  if (analysisResult.generalInfo) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Informations générales', bold: true })],
      spacing: { after: 100 }
    }));
    if (analysisResult.generalInfo.dateTime) {
      children.push(new Paragraph({ text: `Date/Heure: ${analysisResult.generalInfo.dateTime}` }));
    }
    if (analysisResult.generalInfo.location) {
      children.push(new Paragraph({ text: `Lieu: ${analysisResult.generalInfo.location}` }));
    }
    if (analysisResult.generalInfo.agenda) {
      children.push(new Paragraph({ text: `Ordre du jour: ${analysisResult.generalInfo.agenda}` }));
    }
    children.push(new Paragraph({ spacing: { after: 200 } }));
  }
  
  // Points clés
  if (analysisResult.keyPoints?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Points clés discutés', bold: true })],
      spacing: { after: 100 }
    }));
    analysisResult.keyPoints.forEach(point => {
      children.push(new Paragraph({
        text: `• ${point}`,
        bullet: { level: 0 }
      }));
    });
    children.push(new Paragraph({ spacing: { after: 200 } }));
  }
  
  // Décisions
  if (analysisResult.decisions?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Décisions prises', bold: true })],
      spacing: { after: 100 }
    }));
    analysisResult.decisions.forEach(decision => {
      children.push(new Paragraph({
        text: `• ${decision}`,
        bullet: { level: 0 }
      }));
    });
    children.push(new Paragraph({ spacing: { after: 200 } }));
  }
  
  // Actions
  if (analysisResult.actionItems?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Actions à suivre', bold: true })],
      spacing: { after: 100 }
    }));
    analysisResult.actionItems.forEach((action, idx) => {
      let actionText = `${idx + 1}. ${action.task}`;
      if (action.assignee) actionText += ` (Responsable: ${action.assignee})`;
      if (action.deadline) actionText += ` (Date: ${action.deadline})`;
      if (action.priority) actionText += ` [Priorité: ${action.priority}]`;
      children.push(new Paragraph({ text: actionText }));
    });
    children.push(new Paragraph({ spacing: { after: 200 } }));
  }
  
  // Points en suspens
  if (analysisResult.pendingQuestions?.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Points en suspens', bold: true })],
      spacing: { after: 100 }
    }));
    analysisResult.pendingQuestions.forEach(q => {
      children.push(new Paragraph({
        text: `• ${q}`,
        bullet: { level: 0 }
      }));
    });
    children.push(new Paragraph({ spacing: { after: 200 } }));
  }
  
  // Alertes de conformité
  if (analysisResult.alertesConformite && analysisResult.alertesConformite.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Alertes de Conformité', bold: true, color: 'F59E0B' })],
      spacing: { after: 100 }
    }));
    analysisResult.alertesConformite.forEach((alerte, idx) => {
      const typeLabel = alerte.type === 'incoherence' ? 'Incohérence' : 
                        alerte.type === 'oubli' ? 'Oubli' : 'Écart';
      children.push(new Paragraph({
        text: `${idx + 1}. [${alerte.severite}] ${typeLabel}: ${alerte.description}`,
        bullet: { level: 0 }
      }));
    });
  }
  
  const doc = new Document({
    sections: [{ children }]
  });
  
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume-reunion.docx';
  a.click();
  URL.revokeObjectURL(url);
  if (setShowExportDropdown) setShowExportDropdown(false);
};
