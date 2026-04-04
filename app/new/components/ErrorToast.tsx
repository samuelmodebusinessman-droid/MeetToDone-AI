"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorToastProps {
  error: string | null;
  onClose: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 cursor-pointer hover:bg-red-200 transition-all duration-300"
      role="alert"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <AlertCircle className="w-5 h-5" />
      <span className="text-sm">{error}</span>
      <span className="text-xs opacity-70 ml-2">(cliquez pour fermer)</span>
    </div>
  );
};
