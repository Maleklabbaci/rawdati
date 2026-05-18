import { useEstablishment } from '../context/EstablishmentContext'

export function Staff() {
  const { establishment } = useEstablishment()
  const type = establishment?.type || 'Crèche'

  const getTitle = (type: string) => {
    if (type === 'École de langue' || type === 'École de cours') return 'Gestion des Formateurs'
    if (type === 'École de formation') return 'Gestion des Formateurs'
    return 'Gestion du Personnel'
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{getTitle(type)}</h1>
      <p className="text-gray-500">Module en cours de développement...</p>
    </div>
  )
}