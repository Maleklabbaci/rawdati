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
  const { establishment } = useEstablishment()
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
      return {
        title: 'Gestion des Étudiants',
        addButton: 'Ajouter un étudiant',
        parentLabel: 'Contact / Parent',
        groupLabel: 'Niveau / Groupe',
        countLabel: 'étudiants inscrits'
      }
    } else if (type === 'École de formation') {
      return {
        title: 'Gestion des Apprenants',
        addButton: 'Ajouter un apprenant',
        parentLabel: 'Entreprise / Contact',
        groupLabel: 'Module / Groupe',
        countLabel: 'apprenants inscrits'
      }
    } else {
      return {
        title: 'Gestion des Enfants',
        addButton: 'Ajouter un enfant',
        parentLabel: 'Nom du parent',
        groupLabel: 'Groupe',
        countLabel: 'enfants inscrits'
      }
    }
  }

  const labels = getLabels(type)

  const fetchChildren = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching children:', error)
    } else {
      setChildren(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchChildren()
  }, [])

  const filteredChildren = children.filter(child =>
    `${child.first_name} ${child.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('children').insert([{
      ...formData,
      nursery_id: '00000000-0000-0000-0000-000000000000',
      status: 'Active'
    }])

    if (error) {
      alert('Erreur lors de l\'ajout: ' + error.message)
    } else {
      setIsModalOpen(false)
      fetchChildren()
      setFormData({
        first_name: '', last_name: '', group_name: 'Groupe A',
        parent_name: '', parent_phone: ''
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{labels.title}</h1>
          <p className="text-gray-500">{children.length} {labels.countLabel}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> {labels.addButton}
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="text-left p-4 font-semibold">Nom</th>
              <th className="text-left p-4 font-semibold">{labels.groupLabel}</th>
              <th className="text-left p-4 font-semibold">{labels.parentLabel}</th>
              <th className="text-left p-4 font-semibold">Téléphone</th>
              <th className="text-left p-4 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center">Chargement...</td></tr>
            ) : filteredChildren.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aucun résultat trouvé</td></tr>
            ) : (
              filteredChildren.map((child) => (
                <tr key={child.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="p-4 font-medium">{child.first_name} {child.last_name}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-sm font-medium">
                      {child.group_name}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{child.parent_name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{child.parent_phone}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-full text-sm font-medium">
                      {child.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Amélioré */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={labels.addButton}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Prénom</label>
              <input 
                type="text" 
                value={formData.first_name} 
                onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Nom</label>
              <input 
                type="text" 
                value={formData.last_name} 
                onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-500" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{labels.groupLabel}</label>
            <input 
              type="text" 
              value={formData.group_name} 
              onChange={(e) => setFormData({...formData, group_name: e.target.value})} 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-500" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{labels.parentLabel}</label>
            <input 
              type="text" 
              value={formData.parent_name} 
              onChange={(e) => setFormData({...formData, parent_name: e.target.value})} 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-500" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Téléphone</label>
            <input 
              type="tel" 
              value={formData.parent_phone} 
              onChange={(e) => setFormData({...formData, parent_phone: e.target.value})} 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-500" 
              required 
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 font-semibold shadow-lg"
            >
              Ajouter
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}