import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useEstablishment } from '../context/EstablishmentContext'

export function Payments() {
  const { establishment } = useEstablishment()
  const type = establishment?.type || 'Crèche'

  const [formData, setFormData] = useState({
    child_id: '',
    amount: '',
    method: 'Cash'
  })

  const getTitle = (type: string) => {
    if (type === 'École de formation') return 'Gestion des Paiements - Formations'
    if (type.includes('École')) return 'Gestion des Paiements - Cours'
    return 'Gestion des Paiements'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase.from('payments').insert([{
      ...formData,
      amount: parseFloat(formData.amount),
      nursery_id: '00000000-0000-0000-0000-000000000000'
    }])

    if (!error) {
      alert('Paiement enregistré avec succès !')
      setFormData({ child_id: '', amount: '', method: 'Cash' })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{getTitle(type)}</h1>

      <div className="max-w-md bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-sm">Montant</label>
            <input 
              type="number" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border" 
              required 
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm">Méthode de paiement</label>
            <select 
              value={formData.method}
              onChange={(e) => setFormData({...formData, method: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border"
            >
              <option value="Cash">Espèces</option>
              <option value="Card">Carte</option>
              <option value="Transfer">Virement</option>
            </select>
          </div>

          <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700">
            Enregistrer le paiement
          </button>
        </form>
      </div>
    </div>
  )
}