'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/AuthProvider'
import { AnalysisResult, SavedAnalysis } from '@/app/new/types'

interface UseCloudSavedAnalysesReturn {
  savedAnalyses: SavedAnalysis[]
  showSaveModal: boolean
  saveTitle: string
  saveTag: string
  isLoading: boolean
  setShowSaveModal: (show: boolean) => void
  setSaveTitle: (title: string) => void
  setSaveTag: (tag: string) => void
  saveAnalysis: (analysisResult: AnalysisResult, title: string, originalText: string, tag?: string) => Promise<boolean>
  deleteSavedAnalysis: (id: string) => Promise<void>
  loadSavedAnalysis: (saved: SavedAnalysis, setAnalysisResult: (result: AnalysisResult) => void, setTextContent: (text: string) => void, setError: (error: string | null) => void) => void
  refreshAnalyses: () => Promise<void>
}

export const useCloudSavedAnalyses = (
  setError: (error: string | null) => void
): UseCloudSavedAnalysesReturn => {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [saveTag, setSaveTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  // Charger les analyses depuis le cloud
  const fetchAnalyses = useCallback(async () => {
    if (!user) {
      setSavedAnalyses([])
      return
    }

    setIsLoading(true)
    const { data, error } = await supabase
      .from('saved_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching analyses:', error)
      setError('Erreur lors du chargement des analyses')
    } else if (data) {
      // Convertir le format Supabase en SavedAnalysis
      const analyses: SavedAnalysis[] = data.map((item: {
        id: string
        title: string
        date: string
        tag: string | null
        original_text: string
        result_json: AnalysisResult
      }) => ({
        id: item.id,
        title: item.title,
        date: item.date,
        tag: item.tag || undefined,
        originalText: item.original_text,
        result: item.result_json
      }))
      setSavedAnalyses(analyses)
    }
    setIsLoading(false)
  }, [user, supabase, setError])

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

  const saveAnalysis = async (
    analysisResult: AnalysisResult,
    title: string,
    originalText: string,
    tag?: string
  ): Promise<boolean> => {
    if (!user) {
      setError('Vous devez être connecté pour sauvegarder')
      return false
    }

    if (!analysisResult || !title.trim()) {
      setError('Veuillez entrer un titre')
      return false
    }

    setIsLoading(true)
    
    // Créer le profil s'il n'existe pas - méthode directe avec upsert
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false
      })
    
    if (profileError) {
      console.error('Erreur création profil:', profileError)
      // Essayer avec RPC comme fallback
      try {
        await supabase.rpc('create_profile_if_not_exists', {
          user_id: user.id,
          user_email: user.email
        })
      } catch (rpcError) {
        console.error('RPC aussi échoué:', rpcError)
      }
    }
    
    // Attendre un peu pour s'assurer que le profil est créé
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const date = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const { error } = await supabase
      .from('saved_analyses')
      .insert({
        user_id: user.id,
        title: title.trim(),
        date,
        tag: tag?.trim() || null,
        original_text: originalText || '',
        result_json: analysisResult
      })

    if (error) {
      console.error('Error saving analysis:', error)
      setError('Erreur lors de la sauvegarde')
      setIsLoading(false)
      return false
    }

    // Rafraîchir la liste
    await fetchAnalyses()
    
    setSaveTitle('')
    setSaveTag('')
    setShowSaveModal(false)
    setError('✅ Analyse enregistrée avec succès !')
    setTimeout(() => setError(null), 2000)
    setIsLoading(false)
    return true
  }

  const deleteSavedAnalysis = async (id: string) => {
    if (!user) return

    setIsLoading(true)
    const { error } = await supabase
      .from('saved_analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting analysis:', error)
      setError('Erreur lors de la suppression')
    } else {
      setSavedAnalyses(prev => prev.filter(a => a.id !== id))
    }
    setIsLoading(false)
  }

  const loadSavedAnalysis = (
    saved: SavedAnalysis,
    setAnalysisResult: (result: AnalysisResult) => void,
    setTextContent: (text: string) => void,
    setError: (error: string | null) => void
  ) => {
    setAnalysisResult(saved.result)
    setTextContent(saved.originalText)
    setError('✅ Analyse chargée !')
    setTimeout(() => setError(null), 2000)
  }

  const refreshAnalyses = async () => {
    await fetchAnalyses()
  }

  return {
    savedAnalyses,
    showSaveModal,
    saveTitle,
    saveTag,
    isLoading,
    setShowSaveModal,
    setSaveTitle,
    setSaveTag,
    saveAnalysis,
    deleteSavedAnalysis,
    loadSavedAnalysis,
    refreshAnalyses
  }
}
