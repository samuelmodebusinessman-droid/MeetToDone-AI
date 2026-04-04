// Fonction pour extraire le texte d'un PDF
export const extractPDFText = async (file: File): Promise<string> => {
  // Utiliser pdfjs-dist version 3.x qui est plus stable
  const pdfjsLib = await import('pdfjs-dist');
  // Configuration du worker pour la version 3.x
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    fullText += `\n\n--- Page ${i} ---\n${pageText}`;
  }

  return fullText.trim();
};

// Fonction pour extraire le texte d'une image avec OCR
export const extractImageText = async (file: File): Promise<string> => {
  const Tesseract = await import('tesseract.js');
  const result = await Tesseract.recognize(file, 'fra', {
    logger: (m) => console.log(m),
  });
  return result.data.text;
};

// Fonction pour extraire le texte d'un DOCX
export const extractDOCXText = async (file: File): Promise<string> => {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};
