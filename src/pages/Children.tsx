import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Modal } from '../components/Modal'
import { supabase } from '../lib/supabase'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    group_name: 'Petits',
    parent_name: '',
    parent_phone: '',
  })

  // Fetch children from Supabase
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

    // TODO: Replace with real nursery_id from logged in user later
    const { error } = await supabase.from('children').insert([{
      ...formData,
      nursery_id: '00000000-0000-0000-0000-000000000000', // placeholder
      status: 'Active'
    }])

    if (error) {
      alert('Erreur lors de l\'ajout: ' + error.message)
    } else {
      setIsModalOpen(false)
      fetchChildren() // Refresh list
      setFormData({
        first_name: '', last_name: '', group_name: 'Petits',
        parent_name: '', parent_phone: ''
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Enfants</h1>
          <p className="text-gray-500">{children.length} enfants inscrits</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" /> Ajouter un enfant
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un enfant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="text-left p-4 font-medium">Nom</th>
              <th className="text-left p-4 font-medium">Groupe</th>
              <th className="text-left p-4 font-medium">Parent</th>
              <th className="text-left p-4 font-medium">Téléphone</th>
              <th className="text-left p-4 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center">Chargement...</td></tr>
            ) : filteredChildren.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aucun enfant trouvé</td></tr>
            ) : (
              filteredChildren.map((child) => (
                <tr key={child.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-4 font-medium">{child.first_name} {child.last_name}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-sm">
                      {child.group_name}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{child.parent_name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{child.parent_phone}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-full text-sm">
                      {child.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Child Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un enfant">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Prénom</label>
              <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Nom</label>
              <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Groupe</label>
            <select value={formData.group_name} onChange={(e) => setFormData({...formData, group_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border">
              <option value="Petits">Petits (2-3 ans)</option>
              <option value="Moyens">Moyens (3-4 ans)</option>
              <option value="Grands">Grands (4-5 ans)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Nom du parent</label>
            <input type="text" value={formData.parent_name} onChange={(e) => setFormData({...formData, parent_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Téléphone du parent</label>
            <input type="tel" value={formData.parent_phone} onChange={(e) => setFormData({...formData, parent_phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border" required />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border">Annuler</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700">Ajouter l'enfant</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}