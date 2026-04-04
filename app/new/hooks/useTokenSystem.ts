'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/AuthProvider'

interface TokenSystem {
  dailyCount: number
  maxDaily: number
  isPremium: boolean
  canAnalyze: boolean
  remainingToday: number
  lastAnalysisDate: string | null
  incrementUsage: () => Promise<boolean>
  refreshStatus: () => Promise<void>
}

export function useTokenSystem(): TokenSystem {
  const [dailyCount, setDailyCount] = useState(0)
  const [maxDaily] = useState(1) // 1 analyse gratuite par jour
  const [isPremium, setIsPremium] = useState(false)
  const [lastAnalysisDate, setLastAnalysisDate] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setDailyCount(0)
      setIsPremium(false)
      setLastAnalysisDate(null)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('daily_analysis_count, last_analysis_date, subscription_status')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return
    }

    if (data) {
      // Check if we need to reset the counter (new day)
      const today = new Date().toISOString().split('T')[0]
      const lastDate = data.last_analysis_date

      if (lastDate !== today) {
        // Reset counter for new day
        setDailyCount(0)
        // Update profile in background
        await supabase
          .from('profiles')
          .update({
            daily_analysis_count: 0,
            last_analysis_date: today
          })
          .eq('id', user.id)
      } else {
        setDailyCount(data.daily_analysis_count || 0)
      }

      setIsPremium(data.subscription_status === 'premium')
      setLastAnalysisDate(lastDate)
    }
  }, [user, supabase])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const incrementUsage = async (): Promise<boolean> => {
    if (!user) return false
    if (isPremium) return true // Premium users have unlimited access

    const today = new Date().toISOString().split('T')[0]
    const lastDate = lastAnalysisDate

    // Check if it's a new day
    let currentCount = dailyCount
    if (lastDate !== today) {
      currentCount = 0
    }

    if (currentCount >= maxDaily) {
      return false // No more analyses allowed today
    }

    // Increment counter
    const newCount = currentCount + 1
    const { error } = await supabase
      .from('profiles')
      .update({
        daily_analysis_count: newCount,
        last_analysis_date: today
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error incrementing usage:', error)
      return false
    }

    setDailyCount(newCount)
    setLastAnalysisDate(today)
    return true
  }

  const refreshStatus = async () => {
    await fetchProfile()
  }

  const canAnalyze = isPremium || dailyCount < maxDaily
  const remainingToday = isPremium ? 999 : Math.max(0, maxDaily - dailyCount)

  return {
    dailyCount,
    maxDaily,
    isPremium,
    canAnalyze,
    remainingToday,
    lastAnalysisDate,
    incrementUsage,
    refreshStatus
  }
}
