import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState(1)

  // Step 1 - Establishment
  const [establishmentName, setEstablishmentName] = useState('')
  const [city, setCity] = useState('')
  const [establishmentType, setEstablishmentType] = useState('Crèche')

  // Step 2 - User Account
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn } = useAuth()

  const establishmentTypes = ['Crèche', 'École de langue', 'École de cours', 'École de formation']

  const resetForm = () => {
    setStep(1)
    setEstablishmentName(''); setCity(''); setEstablishmentType('Crèche')
    setFullName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setPhone('')
    setError(''); setSuccess('')
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!establishmentName || !city) {
      setError("Veuillez remplir le nom et la ville")
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    try {
      // 1. Create user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) throw signUpError

      // 2. Create nursery and get its ID
      if (authData.user) {
        const { data: nurseryData, error: nurseryError } = await supabase
          .from('nurseries')
          .insert({
            name: establishmentName,
            owner_name: fullName,
            email: email,
            phone: phone,
            city: city,
            type: establishmentType,
            status: 'Active',
            plan: 'Trial'
          })
          .select()
          .single()

        if (nurseryError) throw nurseryError

        // 3. Save nursery_id in user metadata
        await supabase.auth.updateUser({
          data: { nursery_id: nurseryData.id }
        })
      }

      setSuccess("Inscription réussie ! Votre établissement a été créé.")
      setTimeout(() => {
        setIsLogin(true)
        resetForm()
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white dark:from-gray-950 dark:to-gray-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white text-3xl font-bold">R</span>
          </div>
          <h1 className="text-3xl font-bold">RAWDATI</h1>
          <p className="text-gray-500 mt-1">Plateforme de Gestion Éducative</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-8">
            <button onClick={() => { setIsLogin(true); resetForm() }} className={`flex-1 py-2.5 rounded-xl font-medium ${isLogin ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-500'}`}>
              Connexion
            </button>
            <button onClick={() => { setIsLogin(false); resetForm() }} className={`flex-1 py-2.5 rounded-xl font-medium ${!isLogin ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-500'}`}>
              Inscription
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h2>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm">{success}</div>}

          {!isLogin && (
            <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nom de l'établissement</label>
                    <input type="text" value={establishmentName} onChange={(e) => setEstablishmentName(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Ville</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Type d'établissement</label>
                    <select value={establishmentType} onChange={(e) => setEstablishmentType(e.target.value)} className="w-full px-4 py-3 rounded-2xl border">
                      {establishmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-teal-600 text-white py-3.5 rounded-2xl font-semibold">Continuer</button>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nom complet</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Téléphone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Confirmer le mot de passe</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" required />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-2xl border font-medium">Retour</button>
                    <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-2xl bg-teal-600 text-white font-semibold">
                      {loading ? 'Création...' : 'Créer mon compte'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {isLogin && (
            <form onSubmit={async (e) => {
              e.preventDefault()
              setLoading(true)
              try { await signIn(email, password) } 
              catch (err: any) { setError(err.message) } 
              finally { setLoading(false) }
            }} className="space-y-5">
              <div><label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" required /></div>
              <div><label className="block text-sm font-medium mb-1.5">Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl border" required /></div>
              <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3.5 rounded-2xl font-semibold">
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          )}

          {isLogin && <div className="mt-6 text-center text-sm">Pas encore de compte ? <button onClick={() => setIsLogin(false)} className="ml-1 text-teal-600 font-medium">Inscrivez-vous</button></div>}
        </div>
      </div>
    </div>
  )
}