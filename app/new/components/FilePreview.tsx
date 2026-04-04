"use client";

import React from 'react';
import { Bot, FileText, Loader2 } from 'lucide-react';
import { AnalysisResult } from '../types';

interface FilePreviewProps {
  uploadedFiles: File[];
  imagePreviews: string[];
  removeFile: (index: number) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  uploadedFiles,
  imagePreviews,
  removeFile
}) => {
  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mt-3 flex flex-row gap-2">
      {uploadedFiles.map((file, index) => (
        <div 
          key={index}
          className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden border-2 border-[#0F766E]/20 group"
        >
          {imagePreviews[index] ? (
            <img 
              src={imagePreviews[index]} 
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#0F766E]/10 flex flex-col items-center justify-center p-1">
              <FileText className="w-6 h-6 text-[#0F766E]" />
              <span className="text-[8px] text-[#0F766E] text-center truncate w-full mt-1">
                {file.name.split('.').pop()?.toUpperCase()}
              </span>
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              removeFile(index);
            }}
            className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Supprimer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
