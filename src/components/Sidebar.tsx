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

  // Dynamic menu labels
  const getMenuLabels = (type: string) => {
    if (type === 'École de langue' || type === 'École de cours') {
      return {
        students: 'Étudiants',
        staff: 'Formateurs',
        attendance: 'Présence'
      }
    } else if (type === 'École de formation') {
      return {
        students: 'Apprenants',
        staff: 'Formateurs',
        attendance: 'Présence'
      }
    } else {
      return {
        students: 'Enfants',
        staff: 'Personnel',
        attendance: 'Présence'
      }
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
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <div>
            <h1 className="font-bold text-xl">RAWDATI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Plateforme Éducative</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                isActive 
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        {/* Language Switcher */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setLanguage('fr')}
            className={`flex-1 py-2 rounded-xl text-sm ${language === 'fr' ? 'bg-teal-600 text-white' : 'border border-gray-200 dark:border-gray-700'}`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`flex-1 py-2 rounded-xl text-sm ${language === 'ar' ? 'bg-teal-600 text-white' : 'border border-gray-200 dark:border-gray-700'}`}
          >
            عربي
          </button>
        </div>

        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{darkMode ? t('lightMode') : t('darkMode')}</span>
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  )
}