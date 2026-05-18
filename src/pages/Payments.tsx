import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useEstablishment } from '../context/EstablishmentContext'

export function Payments() {
  const { establishment, nurseryId } = useEstablishment()
  const type = establishment?.type || 'Crèche'

  const [formData, setFormData] = useState({ amount: '', method: 'Cash' })

  const getTitle = (type: string) => {
    if (type === 'École de formation') return 'Gestion des Paiements - Formations'
    if (type.includes('École')) return 'Gestion des Paiements - Cours'
    return 'Gestion des Paiements'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nurseryId) return

    const { error } = await supabase.from('payments').insert([{
      nursery_id: nurseryId,
      amount: parseFloat(formData.amount),
      method: formData.method,
      status: 'Paid'
    }])

    if (!error) {
      alert('Paiement enregistré avec succès !')
      setFormData({ amount: '', method: 'Cash' })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{getTitle(type)}</h1>

      <div className="max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Montant</label>
            <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Méthode</label>
            <select value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border">
              <option value="Cash">Espèces</option>
              <option value="Card">Carte bancaire</option>
              <option value="Transfer">Virement</option>
            </select>
          </div>

          <button type="submit" className="w-full py-3.5 rounded-2xl bg-teal-600 text-white font-semibold">
            Enregistrer le paiement
          </button>
        </form>
      </div>
    </div>
  )
}