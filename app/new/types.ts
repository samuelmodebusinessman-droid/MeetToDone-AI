// Types pour les résultats d'analyse enrichis
export interface ActionItem {
  task: string;
  assignee: string;
  deadline: string;
  priority: string;
}

export interface AlertItem {
  type: 'incoherence' | 'oubli' | 'ecart';
  description: string;
  severite: 'Haute' | 'Moyenne' | 'Basse';
}

export interface GeneralInfo {
  dateTime: string;
  participants: string[];
  absents: string[];
  location: string;
  agenda: string;
}

export interface AnalysisResult {
  summary?: string;
  generalInfo?: GeneralInfo;
  keyPoints?: string[];
  decisions?: string[];
  actionItems?: ActionItem[];
  pendingQuestions?: string[];
  otherInfo?: string;
  alertesConformite?: AlertItem[];
  // Champs pour les autres modes d'analyse
  mainIntention?: string;
  secondaryIntentions?: string[];
  globalSentiment?: string;
  intensity?: 'Faible' | 'Moyenne' | 'Forte';
  emotions?: string[];
  overallTone?: string;
  entities?: {
    people: { name: string; role?: string }[];
    organizations: string[];
    locations: string[];
    dates: string[];
    amounts: string[];
    products: string[];
  };
  themes?: {
    mainThemes: string[];
    subThemes: string[];
    keywords: string[];
    segments: { title: string; content: string }[];
  };
  context?: {
    relations: string[];
    implicitReferences: string[];
    coherence: string;
    missingContext: string[];
  };
  intentions?: any;
  analysis?: any;
}

// Type pour les analyses enregistrées dans l'historique
export interface SavedAnalysis {
  id: string;
  title: string;
  date: string;
  tag?: string;
  originalText: string;
  result: AnalysisResult;
}

// Type pour les modèles IA disponibles
export type AIModel = 'llama-3.1-8b-instant';

// Type pour les modes d'analyse
export type AnalysisMode = 
  | 'basic'           // Analyse de base
  | 'structured'      // Analyse structurée complète
  | 'sentiment'       // Analyse d'intention et sentiment
  | 'entities'        // Extraction d'entités nommées
  | 'thematic'        // Analyse thématique
  | 'context'         // Analyse de contexte et relations
  | 'complete';       // Analyse complète (tous les modes)

// Résultats pour chaque mode d'analyse
export interface BasicAnalysis {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
}

export interface StructuredAnalysis extends AnalysisResult {}

export interface SentimentAnalysis {
  mainIntention: string;
  secondaryIntentions: string[];
  globalSentiment: string;
  intensity: 'Faible' | 'Moyenne' | 'Forte';
  emotions: string[];
  overallTone: string;
}

export interface NamedEntity {
  name: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'amount' | 'product';
  role?: string;
}

export interface EntitiesAnalysis {
  people: { name: string; role?: string }[];
  organizations: string[];
  locations: string[];
  dates: string[];
  amounts: string[];
  products: string[];
}

export interface ThematicAnalysis {
  mainThemes: string[];
  subThemes: string[];
  keywords: string[];
  segments: { title: string; content: string }[];
}

export interface ContextAnalysis {
  relations: string[];
  implicitReferences: string[];
  coherence: string;
  missingContext: string[];
}

// Résultat d'analyse complet (tous modes)
export interface MultiModeAnalysis {
  mode: AnalysisMode;
  basic?: BasicAnalysis;
  structured?: StructuredAnalysis;
  sentiment?: SentimentAnalysis;
  entities?: EntitiesAnalysis;
  thematic?: ThematicAnalysis;
  context?: ContextAnalysis;
}

// Props communes pour les composants utilisant analysisResult
export interface AnalysisProps {
  analysisResult: AnalysisResult | null;
}

// Props pour les fonctions d'export
export interface ExportProps extends AnalysisProps {
  setShowExportDropdown?: (show: boolean) => void;
}

// Props pour les fonctions d'envoi
export interface SenderProps extends AnalysisProps {
  slackWebhookUrl?: string;
  gmailAddress?: string;
  setError: (error: string | null) => void;
  setSendingToSlack?: (sending: boolean) => void;
  setSendingToGmail?: (sending: boolean) => void;
  setShowSlackModal?: (show: boolean) => void;
  setShowGmailModal?: (show: boolean) => void;
}
