import { AnalysisResult } from '../../types';

export const exportToPDF = async (
  analysisResult: AnalysisResult,
  setShowExportDropdown?: (show: boolean) => void
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Titre
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Résumé de Réunion', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Résumé
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Résumé:', margin, yPos);
  yPos += 7;
  doc.setFontSize(10);
  const summaryLines = doc.splitTextToSize(analysisResult.summary, maxWidth);
  doc.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 5 + 10;
  
  // Informations générales
  if (analysisResult.generalInfo) {
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations générales', margin, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (analysisResult.generalInfo.dateTime) {
      doc.text(`Date/Heure: ${analysisResult.generalInfo.dateTime}`, margin, yPos);
      yPos += 5;
    }
    if (analysisResult.generalInfo.location) {
      doc.text(`Lieu: ${analysisResult.generalInfo.location}`, margin, yPos);
      yPos += 5;
    }
    if (analysisResult.generalInfo.agenda) {
      doc.text(`Ordre du jour: ${analysisResult.generalInfo.agenda}`, margin, yPos);
      yPos += 5;
    }
    yPos += 10;
  }
  
  // Points clés
  if (analysisResult.keyPoints?.length > 0) {
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Points clés discutés', margin, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    analysisResult.keyPoints.forEach(point => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      const lines = doc.splitTextToSize(`• ${point}`, maxWidth - 5);
      doc.text(lines, margin + 3, yPos);
      yPos += lines.length * 5 + 2;
    });
    yPos += 5;
  }
  
  // Décisions
  if (analysisResult.decisions?.length > 0) {
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Décisions prises', margin, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    analysisResult.decisions.forEach(decision => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      const lines = doc.splitTextToSize(`• ${decision}`, maxWidth - 5);
      doc.text(lines, margin + 3, yPos);
      yPos += lines.length * 5 + 2;
    });
    yPos += 5;
  }
  
  // Actions
  if (analysisResult.actionItems?.length > 0) {
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Actions à suivre', margin, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    analysisResult.actionItems.forEach((action, idx) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      let actionText = `${idx + 1}. ${action.task}`;
      if (action.assignee) actionText += ` (Responsable: ${action.assignee})`;
      if (action.deadline) actionText += ` (Date: ${action.deadline})`;
      if (action.priority) actionText += ` [Priorité: ${action.priority}]`;
      const lines = doc.splitTextToSize(actionText, maxWidth - 5);
      doc.text(lines, margin + 3, yPos);
      yPos += lines.length * 5 + 2;
    });
    yPos += 5;
  }
  
  // Points en suspens
  if (analysisResult.pendingQuestions?.length > 0) {
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Points en suspens', margin, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    analysisResult.pendingQuestions.forEach(q => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      const lines = doc.splitTextToSize(`• ${q}`, maxWidth - 5);
      doc.text(lines, margin + 3, yPos);
      yPos += lines.length * 5 + 2;
    });
  }
  
  doc.save('resume-reunion.pdf');
  if (setShowExportDropdown) setShowExportDropdown(false);
};
