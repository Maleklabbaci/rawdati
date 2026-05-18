import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [establishmentType, setEstablishmentType] = useState('Crèche')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn } = useAuth()

  const establishmentTypes = [
    'Crèche',
    'École de langue',
    'École de cours',
    'École de formation'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        // Inscription + Création automatique de l'établissement
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) throw signUpError

        if (data.user) {
          const { error: nurseryError } = await supabase
            .from('nurseries')
            .insert({
              name: `Établissement de ${email.split('@')[0]}`,
              owner_name: email.split('@')[0],
              email: email,
              type: establishmentType,
              status: 'Active',
              plan: 'Trial'
            })

          if (nurseryError) {
            console.error('Erreur création établissement:', nurseryError)
          }
        }

        setSuccess("Inscription réussie ! Votre établissement a été créé.")
        setIsLogin(true)
        setEmail('')
        setPassword('')
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">R</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">RAWDATI</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Plateforme de Gestion Éducative</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${isLogin ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-500'}`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${!isLogin ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-500'}`}
            >
              Inscription
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="contact@ecole.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Type d'établissement - seulement à l'inscription */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">
                  Type d'établissement
                </label>
                <select
                  value={establishmentType}
                  onChange={(e) => setEstablishmentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {establishmentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-2xl font-semibold disabled:opacity-70 transition-all mt-2 shadow-lg"
            >
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"} 
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-1 text-teal-600 hover:underline font-medium"
            >
              {isLogin ? 'Inscrivez-vous' : 'Connectez-vous'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          RAWDATI © 2026 — Plateforme de Gestion Éducative
        </p>
      </div>
    </div>
  )
}