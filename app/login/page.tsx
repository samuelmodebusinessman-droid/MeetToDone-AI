'use client'

import { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message || 'Erreur de connexion')
      setLoading(false)
    } else {
      router.push('/new')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FDFA] to-[#E0F2FE]">
      <div className="bg-white rounded-[16px] shadow-xl p-8 w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#134E4A] mb-2">Connexion</h1>
          <p className="text-[#0F766E]/70 text-[14px]">
            Accédez à vos analyses sauvegardées
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] bg-[#0F766E] text-white rounded-[10px] font-semibold text-[14px] hover:bg-[#134E4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[13px] text-[#0F766E]/70">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-[#0F766E] font-medium hover:underline">
              S'inscrire
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
            <span>1 analyse gratuite par jour</span>
          </div>
        </div>
      </div>
    </div>
  )
}
