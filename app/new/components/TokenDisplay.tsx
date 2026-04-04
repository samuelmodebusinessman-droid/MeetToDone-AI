'use client'

import React from 'react'
import { useTokenSystem } from '@/app/new/hooks/useTokenSystem'

interface TokenDisplayProps {
  showUpgradeButton?: boolean
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ showUpgradeButton = true }) => {
  const { isPremium, remainingToday, canAnalyze } = useTokenSystem()

  if (isPremium) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200">
        <img 
          src="https://img.icons8.com/?size=100&id=qvYFJ7bWP2o9&format=png&color=F59E0B" 
          alt="Premium" 
          className="w-4 h-4"
        />
        <span className="text-[12px] font-semibold text-amber-700">Premium</span>
        <span className="text-[10px] text-amber-600/70">Illimité</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
        canAnalyze 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <img 
          src="https://img.icons8.com/?size=100&id=qvYFJ7bWP2o9&format=png&color=000000" 
          alt="Token" 
          className="w-4 h-4"
        />
        <span className={`text-[12px] font-medium ${
          canAnalyze ? 'text-blue-700' : 'text-red-600'
        }`}>
          {remainingToday}/1 aujourd'hui
        </span>
      </div>
      
      {showUpgradeButton && !canAnalyze && (
        <a 
          href="/pricing"
          className="text-[11px] px-2 py-1 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
        >
          Passer Premium
        </a>
      )}
    </div>
  )
}
