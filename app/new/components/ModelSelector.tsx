"use client";

import React from 'react';
import { AIModel } from '../types';

interface ModelSelectorProps {
  selectedModel: AIModel | string;
  onSelectModel: (model: AIModel) => void;
}

const models = [
  { id: 'llama-3.1-8b-instant' as AIModel, name: 'Meta', color: '#0081FB', icon: 'https://img.icons8.com/?size=100&id=PvvcWRWxRKSR&format=png&color=000000' },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel
}) => {
  return (
    <div className="flex items-center gap-1.5">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onSelectModel(model.id)}
          className={`w-9 h-9 rounded-[6px] flex items-center justify-center transition-all border p-0.5 ${
            selectedModel === model.id
              ? `bg-[${model.color}]/10 border-[${model.color}] shadow-sm`
              : 'bg-white border-[#0F766E]/20 hover:border-[${model.color}]/50'
          }`}
          title={model.name}
          style={{
            borderColor: selectedModel === model.id ? model.color : undefined,
            backgroundColor: selectedModel === model.id ? `${model.color}10` : undefined
          }}
        >
          <img 
            src={model.icon}
            alt={model.name}
            className="w-5 h-5 object-contain"
          />
        </button>
      ))}
    </div>
  );
};
