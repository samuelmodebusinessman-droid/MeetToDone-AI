'use client'

import { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message || 'Erreur lors de l\'inscription')
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FDFA] to-[#E0F2FE]">
        <div className="bg-white rounded-[16px] shadow-xl p-8 w-full max-w-[400px] text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold text-[#134E4A] mb-2">Compte créé !</h1>
          <p className="text-[#0F766E]/70 text-[14px]">
            Vérifiez votre email pour confirmer votre inscription.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FDFA] to-[#E0F2FE]">
      <div className="bg-white rounded-[16px] shadow-xl p-8 w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#134E4A] mb-2">Inscription</h1>
          <p className="text-[#0F766E]/70 text-[14px]">
            Créez votre compte pour sauvegarder vos analyses
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] p-3 rounded-[8px] mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#134E4A] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[44px] px-4 rounded-[8px] border border-[#0F766E]/20 focus:border-[#0F766E] focus:outline-none text-[14px]"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#134E4A] mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] px-4 rounded-[8px] border border-[#0F766E]/20 focus:border-[#0F766E] focus:outline-none text-[14px]"
              placeholder="••••••••"
              required
            />
            <p className="text-[11px] text-[#0F766E]/50 mt-1">Min. 6 caractères</p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#134E4A] mb-1.5">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[44px] px-4 rounded-[8px] border border-[#0F766E]/20 focus:border-[#0F766E] focus:outline-none text-[14px]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] bg-[#0F766E] text-white rounded-[10px] font-semibold text-[14px] hover:bg-[#134E4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[13px] text-[#0F766E]/70">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#0F766E] font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-[#0F766E]/10">
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#0F766E]/50">
            <img 
              src="https://img.icons8.com/?size=100&id=qvYFJ7bWP2o9&format=png&color=0F766E" 
              alt="Token" 
              className="w-3 h-3"
            />
            <span>1 analyse gratuite par jour avec votre compte</span>
          </div>
        </div>
      </div>
    </div>
  )
}
