import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Modal } from '../components/Modal'
import { supabase } from '../lib/supabase'
import { useEstablishment } from '../context/EstablishmentContext'

interface Child {
  id: string
  first_name: string
  last_name: string
  group_name: string
  parent_name: string
  parent_phone: string
  status: 'Active' | 'Inactive'
}

export function Children() {
  const { establishment, nurseryId } = useEstablishment()
  const type = establishment?.type || 'Crèche'

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    group_name: 'Groupe A',
    parent_name: '',
    parent_phone: '',
  })

  const getLabels = (type: string) => {
    if (type === 'École de langue' || type === 'École de cours') {
      return { title: 'Gestion des Étudiants', addButton: 'Ajouter un étudiant', parentLabel: 'Contact / Parent', groupLabel: 'Niveau / Groupe', countLabel: 'étudiants inscrits' }
    } else if (type === 'École de formation') {
      return { title: 'Gestion des Apprenants', addButton: 'Ajouter un apprenant', parentLabel: 'Entreprise / Contact', groupLabel: 'Module / Groupe', countLabel: 'apprenants inscrits' }
    } else {
      return { title: 'Gestion des Enfants', addButton: 'Ajouter un enfant', parentLabel: 'Nom du parent', groupLabel: 'Groupe', countLabel: 'enfants inscrits' }
    }
  }

  const labels = getLabels(type)

  const fetchChildren = async () => {
    if (!nurseryId) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('nursery_id', nurseryId)
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setChildren(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchChildren()
  }, [nurseryId])

  const filteredChildren = children.filter(child =>
    `${child.first_name} ${child.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nurseryId) return

    const { error } = await supabase.from('children').insert([{
      ...formData,
      nursery_id: nurseryId,
      status: 'Active'
    }])

    if (error) {
      alert('Erreur: ' + error.message)
    } else {
      setIsModalOpen(false)
      fetchChildren()
      setFormData({ first_name: '', last_name: '', group_name: 'Groupe A', parent_name: '', parent_phone: '' })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{labels.title}</h1>
          <p className="text-lg text-gray-500 mt-1">{children.length} {labels.countLabel}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg">
          <Plus className="w-4 h-4" /> {labels.addButton}
        </button>
      </div>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="text-left px-8 py-5 font-semibold text-sm">Nom</th>
              <th className="text-left px-8 py-5 font-semibold text-sm">{labels.groupLabel}</th>
              <th className="text-left px-8 py-5 font-semibold text-sm">{labels.parentLabel}</th>
              <th className="text-left px-8 py-5 font-semibold text-sm">Téléphone</th>
              <th className="text-left px-8 py-5 font-semibold text-sm">Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-8 py-12 text-center">Chargement...</td></tr> :
             filteredChildren.length === 0 ? <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-500">Aucun résultat</td></tr> :
             filteredChildren.map(child => (
              <tr key={child.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-8 py-5 font-medium">{child.first_name} {child.last_name}</td>
                <td className="px-8 py-5"><span className="px-4 py-1.5 text-sm bg-teal-100 dark:bg-teal-900/40 text-teal-700 rounded-2xl">{child.group_name}</span></td>
                <td className="px-8 py-5 text-gray-600 dark:text-gray-300">{child.parent_name}</td>
                <td className="px-8 py-5 text-gray-600 dark:text-gray-300 font-mono text-sm">{child.parent_phone}</td>
                <td className="px-8 py-5"><span className="px-4 py-1.5 text-sm bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 rounded-2xl">{child.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={labels.addButton}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-2">Prénom</label><input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border" required /></div>
            <div><label className="block text-sm font-semibold mb-2">Nom</label><input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border" required /></div>
          </div>
          <div><label className="block text-sm font-semibold mb-2">{labels.groupLabel}</label><input type="text" value={formData.group_name} onChange={(e) => setFormData({...formData, group_name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border" required /></div>
          <div><label className="block text-sm font-semibold mb-2">{labels.parentLabel}</label><input type="text" value={formData.parent_name} onChange={(e) => setFormData({...formData, parent_name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border" required /></div>
          <div><label className="block text-sm font-semibold mb-2">Téléphone</label><input type="tel" value={formData.parent_phone} onChange={(e) => setFormData({...formData, parent_phone: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border" required /></div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 rounded-2xl border font-medium">Annuler</button>
            <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-teal-600 text-white font-semibold">Ajouter</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}