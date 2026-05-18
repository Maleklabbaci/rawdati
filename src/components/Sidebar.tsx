import { 
  LayoutDashboard, Users, UserCheck, Calendar, CreditCard, 
  BarChart3, LogOut, Moon, Sun 
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useEstablishment } from '../context/EstablishmentContext'

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: any) => void
  darkMode: boolean
  toggleDarkMode: () => void
  onLogout: () => void
}

export function Sidebar({ currentPage, setCurrentPage, darkMode, toggleDarkMode, onLogout }: SidebarProps) {
  const { language, setLanguage, t } = useLanguage()
  const { establishment } = useEstablishment()

  const type = establishment?.type || 'Crèche'

  const getMenuLabels = (type: string) => {
    if (type === 'École de langue' || type === 'École de cours') {
      return { students: 'Étudiants', staff: 'Formateurs', attendance: 'Présence' }
    } else if (type === 'École de formation') {
      return { students: 'Apprenants', staff: 'Formateurs', attendance: 'Présence' }
    } else {
      return { students: 'Enfants', staff: 'Personnel', attendance: 'Présence' }
    }
  }

  const menuLabels = getMenuLabels(type)

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'children', label: menuLabels.students, icon: Users },
    { id: 'staff', label: menuLabels.staff, icon: UserCheck },
    { id: 'attendance', label: menuLabels.attendance, icon: Calendar },
    { id: 'payments', label: t('payments'), icon: CreditCard },
    { id: 'reports', label: t('reports'), icon: BarChart3 },
  ]

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">RAWDATI</h1>
            <p className="text-[10px] text-gray-500 -mt-1">PLATEFORME ÉDUCATIVE</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[15px] font-medium transition-all ${
                  isActive 
                    ? 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 shadow-sm' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
        {/* Language */}
        <div className="flex gap-2 px-2 pb-3">
          <button
            onClick={() => setLanguage('fr')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${language === 'fr' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${language === 'ar' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
          >
            عربي
          </button>
        </div>

        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-sm">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 text-sm"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}