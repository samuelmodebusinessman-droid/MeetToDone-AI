"use client";

import { useState, useCallback } from 'react';
import { AnalysisResult } from '../types';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Type pour les modes d'analyse
export type AnalysisMode = 
  | 'basic'           // Analyse de base
  | 'structured'      // Analyse structurée complète
  | 'sentiment'       // Analyse d'intention et sentiment
  | 'entities'        // Extraction d'entités nommées
  | 'thematic'        // Analyse thématique
  | 'context'         // Analyse de contexte et relations
  | 'complete';       // Analyse complète (tous les modes)

// Prompts pour chaque mode d'analyse
const createBasicPrompt = (text: string): string => {
  return `Tu es un assistant expert en analyse de texte. Fais une analyse de base concise et pertinente.

Règles : Reste fidèle au texte, ne rien inventer. Sois clair et professionnel.

Structure de ta réponse (en JSON) :

{
  "summary": "Résumé court en 1-3 phrases maximum",
  "keyPoints": ["Point clé 1", "Point clé 2", "..."],
  "decisions": ["Décision 1", "Décision 2", "..."],
  "actionItems": [
    {"task": "Description de la tâche", "assignee": "Responsable", "deadline": "Date", "priority": "Haute|Moyenne|Basse"}
  ]
}

Texte à analyser :
---
${text}
---`;
};

const createStructuredPrompt = (text: string, referenceDocs?: Map<string, string>): string => {
  let referenceSection = '';
  
  if (referenceDocs && referenceDocs.size > 0) {
    referenceSection = `\n\n=== DOCUMENTS DE RÉFÉRENCE ===\nTu dois comparer la transcription avec les documents suivants et relever les incohérences, écarts ou oublis:\n`;
    referenceDocs.forEach((content, fileName) => {
      referenceSection += `\n--- ${fileName} ---\n${content.substring(0, 5000)}\n`;
    });
    referenceSection += `\n=== INSTRUCTIONS SPÉCIALES ===\n1. Relever les incohérences\n2. Identifier les oublis\n3. Détecter les écarts (prix, délais, livrables)\n4. Créer une section "alertesConformite"\n`;
  }

  return `Tu es un assistant expert en analyse de réunions. Fais une analyse structurée complète et exhaustive.

Règles : Capture TOUS les détails concrets (noms, rôles, dates, chiffres, budgets, deadlines, lieux).${referenceSection}

Structure obligatoire (en JSON) :

{
  "summary": "Résumé général en 1-3 phrases",
  "generalInfo": {
    "dateTime": "Date et heure",
    "participants": ["Nom (Rôle)"],
    "absents": ["Noms des absents"],
    "location": "Lieu/Plateforme",
    "agenda": "Ordre du jour"
  },
  "keyPoints": ["Point 1", "Point 2", "..."],
  "decisions": ["Décision 1", "Décision 2", "..."],
  "actionItems": [
    {"task": "Description", "assignee": "Responsable", "deadline": "Date", "priority": "Haute|Moyenne|Basse"}
  ],
  "pendingQuestions": ["Question 1", "Question 2", "..."],
  "otherInfo": "Autres informations importantes (budgets, risques, chiffres clés)",
  "alertesConformite": [
    {"type": "incoherence|oubli|ecart", "description": "Description", "severite": "Haute|Moyenne|Basse"}
  ]
}

Texte de la réunion :
---
${text}
---`;
};

const createSentimentPrompt = (text: string): string => {
  return `Tu es un expert en analyse d'intention et de sentiment. Analyse en profondeur le texte fourni.

Règles : Identifie les intentions explicites et implicites. Détecte les nuances émotionnelles et le ton général.

Structure de ta réponse (en JSON) :

{
  "mainIntention": "Intention principale clairement formulée",
  "secondaryIntentions": ["Intention secondaire 1", "Intention secondaire 2", "..."],
  "globalSentiment": "Positif|Négatif|Neutre|Mitigé",
  "intensity": "Faible|Moyenne|Forte",
  "emotions": ["Frustration", "Enthousiasme", "Urgence", "Confiance", "Inquiétude", "..."],
  "overallTone": "Description du ton général (formel, informel, agressif, conciliant, etc.)"
}

Texte à analyser :
---
${text}
---`;
};

const createEntitiesPrompt = (text: string): string => {
  return `Tu es un expert en extraction d'entités nommées (NER). Identifie et extrait toutes les entités pertinentes du texte.

Règles : Sois exhaustif. N'oublie aucune entité, même mineure. Spécifie les rôles quand possible.

Structure de ta réponse (en JSON) :

{
  "people": [
    {"name": "Nom de la personne", "role": "Rôle/Fonction si mentionné"}
  ],
  "organizations": ["Entreprise 1", "Organisation 2", "..."],
  "locations": ["Lieu 1", "Adresse 2", "Ville 3", "..."],
  "dates": ["Date 1", "Heure 2", "Période 3", "..."],
  "amounts": ["Montant 1", "Budget 2", "Prix 3", "Quantité 4", "..."],
  "products": ["Produit 1", "Service 2", "..."]
}

Texte à analyser :
---
${text}
---`;
};

const createThematicPrompt = (text: string): string => {
  return `Tu es un expert en analyse thématique. Identifie les thèmes, sous-thèmes et mots-clés du texte.

Règles : Segmentes le texte de manière logique. Identifie les thèmes principaux et secondaires.

Structure de ta réponse (en JSON) :

{
  "mainThemes": ["Thème principal 1", "Thème principal 2", "..."],
  "subThemes": ["Sous-thème 1", "Sous-thème 2", "..."],
  "keywords": ["Mot-clé 1", "Mot-clé 2", "Mot-clé 3", "..."],
  "segments": [
    {"title": "Titre du segment", "content": "Résumé du contenu de ce segment"}
  ]
}

Texte à analyser :
---
${text}
---`;
};

const createContextPrompt = (text: string): string => {
  return `Tu es un expert en analyse de contexte et relations. Analyse les liens implicites et la cohérence du texte.

Règles : Identifie les références implicites et les relations entre les informations. Évalue la cohérence globale.

Structure de ta réponse (en JSON) :

{
  "relations": [
    "Relation 1 : explication du lien entre deux éléments",
    "Relation 2 : explication d'une dépendance",
    "..."
  ],
  "implicitReferences": [
    "Référence implicite 1 : ce à quoi le texte fait allusion sans le nommer explicitement",
    "Référence implicite 2 : ...",
    "..."
  ],
  "coherence": "Évaluation de la cohérence globale (Cohérent|Partiellement cohérent|Incohérent) avec justification brève",
  "missingContext": [
    "Contexte manquant 1 : information nécessaire mais absente",
    "Contexte manquant 2 : ...",
    "..."
  ]
}

Texte à analyser :
---
${text}
---`;
};

const createCompletePrompt = (text: string, referenceDocs?: Map<string, string>): string => {
  const structuredPart = createStructuredPrompt(text, referenceDocs);
  
  return `${structuredPart}\n\n=== ANALYSE COMPLÉMENTAIRE ===\n\nEn plus de l'analyse structurée ci-dessus, fournis également :\n\n1. ANALYSE SENTIMENT : Intention, sentiment global, émotions détectées, ton\n2. EXTRACTION ENTITÉS : Personnes avec rôles, organisations, lieux, dates, montants, produits\n3. ANALYSE THÉMATIQUE : Thèmes principaux, sous-thèmes, mots-clés\n4. ANALYSE CONTEXTE : Relations, références implicites, cohérence, contexte manquant\n\nStructure finale complète (en JSON) :\n\n{
  "summary": "...",\n  "generalInfo": {...},\n  "keyPoints": [...],\n  "decisions": [...],\n  "actionItems": [...],\n  "pendingQuestions": [...],\n  "otherInfo": "...",\n  "alertesConformite": [...],\n  "sentimentAnalysis": {\n    "mainIntention": "...",\n    "secondaryIntentions": [...],\n    "globalSentiment": "...",\n    "intensity": "...",\n    "emotions": [...],\n    "overallTone": "..."\n  },\n  "entities": {\n    "people": [...],\n    "organizations": [...],\n    "locations": [...],\n    "dates": [...],\n    "amounts": [...],\n    "products": [...]\n  },\n  "thematic": {\n    "mainThemes": [...],\n    "subThemes": [...],\n    "keywords": [...],\n    "segments": [...]\n  },\n  "context": {\n    "relations": [...],\n    "implicitReferences": [...],\n    "coherence": "...",\n    "missingContext": [...]\n  }\n}`;
};

const getPromptForMode = (mode: AnalysisMode, text: string, referenceDocs?: Map<string, string>): string => {
  switch (mode) {
    case 'basic':
      return createBasicPrompt(text);
    case 'structured':
      return createStructuredPrompt(text, referenceDocs);
    case 'sentiment':
      return createSentimentPrompt(text);
    case 'entities':
      return createEntitiesPrompt(text);
    case 'thematic':
      return createThematicPrompt(text);
    case 'context':
      return createContextPrompt(text);
    case 'complete':
      return createCompletePrompt(text, referenceDocs);
    default:
      return createStructuredPrompt(text, referenceDocs);
  }
};

interface UseAnalysisReturn {
  isAnalyzing: boolean;
  handleAnalyze: (
    textContent: string,
    hasUploadedFile: boolean,
    selectedModel: string,
    analysisMode: AnalysisMode,
    referenceFilesContent: Map<string, string>,
    setAnalysisResult: (result: AnalysisResult | null) => void,
    setSelectedModel: (model: string) => void,
    setError: (error: string | null) => void
  ) => Promise<void>;
}

const createAnalysisPrompt = (text: string, referenceDocs?: Map<string, string>): string => {
  let referenceSection = '';
  
  if (referenceDocs && referenceDocs.size > 0) {
    referenceSection = `\n\n=== DOCUMENTS DE RÉFÉRENCE ===\nTu dois comparer la transcription de la réunion avec les documents suivants et relever les incohérences, écarts ou oublis par rapport au brief initial:\n`;
    
    referenceDocs.forEach((content, fileName) => {
      referenceSection += `\n--- ${fileName} ---\n${content.substring(0, 5000)}\n`;
    });
    
    referenceSection += `\n=== INSTRUCTIONS SPÉCIALES D'ANALYSE CROISÉE ===
Tu es un auditeur stratégique. Compare la transcription avec les documents de référence ci-dessus.
Ta mission :
1. Relever les incohérences entre ce qui a été dit en réunion et les documents de référence
2. Identifier les oublis par rapport au brief initial
3. Détecter les écarts (prix, délais, livrables, etc.)
4. Transformer le tout en actions concrètes pour corriger ces écarts
5. Créer une section "alertesConformite" avec les incohérences majeures détectées\n`;
  }

  return `Tu es un assistant expert en analyse et synthèse de réunions. Ta mission est d'extraire et structurer toutes les informations importantes d'une transcription, de notes ou d'un compte-rendu de réunion de manière exhaustive, précise et actionable.

Règles obligatoires :
- Reste 100 % fidèle au contenu : ne rien inventer, ne pas interpréter.
- Capture tous les détails concrets : noms, rôles, dates, heures, chiffres, budgets, deadlines, lieux, etc.
- Sois exhaustif sur les éléments à retenir (décisions, tâches, discussions clés, points en suspens…).
- Utilise un ton professionnel, clair, neutre et orienté solution.${referenceSection}

Structure obligatoire de ta réponse (en JSON) :

{
  "summary": "Résumé en 1-3 phrases concises",
  "generalInfo": {
    "dateTime": "Date et heure",
    "participants": ["Nom (Rôle)"],
    "absents": ["Noms des absents"],
    "location": "Lieu/Plateforme",
    "agenda": "Ordre du jour"
  },
  "keyPoints": ["Point 1", "Point 2", "..."],
  "decisions": ["Décision 1", "Décision 2", "..."],
  "actionItems": [
    {"task": "Description", "assignee": "Responsable", "deadline": "Date", "priority": "Haute/Moyenne/Basse"}
  ],
  "pendingQuestions": ["Question 1", "Question 2", "..."],
  "otherInfo": "Autres informations importantes",
  "alertesConformite": [
    {"type": "incoherence|oubli|ecart", "description": "Description de l'alerte", "severite": "Haute|Moyenne|Basse"}
  ]
}

Texte de la réunion à analyser :
---
${text}
---`;
};

export const useAnalysis = (): UseAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = useCallback(async (
    textContent: string,
    hasUploadedFile: boolean,
    selectedModel: string,
    analysisMode: AnalysisMode,
    referenceFilesContent: Map<string, string>,
    setAnalysisResult: (result: AnalysisResult | null) => void,
    setSelectedModel: (model: string) => void,
    setError: (error: string | null) => void
  ) => {
    if (!textContent.trim() && !hasUploadedFile) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const modelId = selectedModel || 'llama-3.1-8b-instant';
      const mode = analysisMode || 'structured';
      console.log(`Analyse avec Groq - Modèle: ${modelId}, Mode: ${mode}`);
      
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'MeetToDone AI'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'user',
              content: getPromptForMode(mode, textContent, referenceFilesContent)
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Réponse invalide de l'API Groq");
      }

      const content = data.choices[0].message.content;
      
      console.log('Contenu reçu:', content.substring(0, 200));

      // Parser la réponse JSON
      let parsedResult: AnalysisResult;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        parsedResult = JSON.parse(jsonString);
        
        if (!parsedResult.summary || !Array.isArray(parsedResult.keyPoints)) {
          throw new Error("Structure de réponse invalide");
        }
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        const contentStr = typeof content === 'string' ? content : String(content || '');
        parsedResult = {
          summary: contentStr.substring(0, 300) + "...",
          generalInfo: {
            dateTime: "",
            participants: [],
            absents: [],
            location: "",
            agenda: ""
          },
          keyPoints: ["Réponse non structurée - voir résumé ci-dessus"],
          decisions: [],
          actionItems: [],
          pendingQuestions: [],
          otherInfo: ""
        };
      }
      
      setAnalysisResult(parsedResult);
    } catch (err: any) {
      console.error("Erreur d'analyse:", err);
      const errorMsg = err?.message || String(err) || "Une erreur est survenue";
      setError(errorMsg || "Une erreur est survenue lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    isAnalyzing,
    handleAnalyze
  };
};
