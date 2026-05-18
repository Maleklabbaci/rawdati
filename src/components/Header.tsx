import { useEstablishment } from '../context/EstablishmentContext'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const { establishment } = useEstablishment()
  const { user } = useAuth()

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-xl">
          {establishment?.name || 'Mon Établissement'}
        </h2>
        <p className="text-sm text-teal-600 dark:text-teal-400">
          {establishment?.type || 'Établissement'} • {establishment?.plan || 'Trial'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.email}</p>
          <p className="text-xs text-gray-500">Administrateur</p>
        </div>
        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.email?.[0]?.toUpperCase() || 'A'}
        </div>
      </div>
    </div>
  )
}