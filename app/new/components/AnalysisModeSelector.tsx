"use client";

import React from 'react';
import { AnalysisMode } from '../types';
import { 
  FileText, 
  List, 
  Heart, 
  Users, 
  Tag, 
  GitBranch, 
  Layers 
} from 'lucide-react';

interface AnalysisModeSelectorProps {
  selectedMode: AnalysisMode;
  onSelectMode: (mode: AnalysisMode) => void;
}

const modes = [
  { 
    id: 'basic' as AnalysisMode, 
    name: 'Base', 
    description: 'Résumé, points clés, décisions, actions',
    icon: FileText,
    color: '#10B981'
  },
  { 
    id: 'structured' as AnalysisMode, 
    name: 'Réunion', 
    description: 'Analyse structurée complète',
    icon: List,
    color: '#0F766E'
  },
  { 
    id: 'sentiment' as AnalysisMode, 
    name: 'Sentiment', 
    description: 'Intention, émotions, ton',
    icon: Heart,
    color: '#EC4899'
  },
  { 
    id: 'entities' as AnalysisMode, 
    name: 'Entités', 
    description: 'Personnes, orgs, lieux, montants',
    icon: Users,
    color: '#8B5CF6'
  },
  { 
    id: 'thematic' as AnalysisMode, 
    name: 'Thèmes', 
    description: 'Thèmes, sous-thèmes, mots-clés',
    icon: Tag,
    color: '#F59E0B'
  },
  { 
    id: 'context' as AnalysisMode, 
    name: 'Contexte', 
    description: 'Relations, références, cohérence',
    icon: GitBranch,
    color: '#6366F1'
  },
  { 
    id: 'complete' as AnalysisMode, 
    name: 'Complète', 
    description: 'Toutes les analyses combinées',
    icon: Layers,
    color: '#EF4444'
  },
];

export const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({
  selectedMode,
  onSelectMode
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[11px] font-medium transition-all border ${
              selectedMode === mode.id
                ? 'shadow-sm'
                : 'hover:opacity-80'
            }`}
            title={mode.description}
            style={{
              borderColor: selectedMode === mode.id ? mode.color : '#0F766E20',
              backgroundColor: selectedMode === mode.id ? `${mode.color}15` : 'white',
              color: selectedMode === mode.id ? mode.color : '#134E4A'
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{mode.name}</span>
          </button>
        );
      })}
    </div>
  );
};
