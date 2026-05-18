import { Users, Calendar, TrendingUp, UserCheck } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useEstablishment } from '../context/EstablishmentContext'

export function Dashboard() {
  const { establishment } = useEstablishment()

  const type = establishment?.type || 'Crèche'
  const name = establishment?.name || 'Votre établissement'

  // Dynamic labels based on type
  const getLabels = (type: string) => {
    switch (type) {
      case 'École de langue':
        return {
          students: 'Étudiants inscrits',
          present: 'Présents aujourd\'hui',
          staff: 'Formateurs',
          welcome: 'Bienvenue dans votre école de langue'
        }
      case 'École de cours':
        return {
          students: 'Élèves inscrits',
          present: 'Présents aujourd\'hui',
          staff: 'Professeurs',
          welcome: 'Bienvenue dans votre école de cours'
        }
      case 'École de formation':
        return {
          students: 'Apprenants inscrits',
          present: 'Présents aujourd\'hui',
          staff: 'Formateurs',
          welcome: 'Bienvenue dans votre centre de formation'
        }
      default: // Crèche
        return {
          students: 'Enfants inscrits',
          present: 'Présents aujourd\'hui',
          staff: 'Personnel',
          welcome: 'Bienvenue dans votre crèche'
        }
    }
  }

  const labels = getLabels(type)

  const stats = [
    { label: labels.students, value: "87", change: "+5", icon: Users, color: "teal" },
    { label: labels.present, value: "72", change: "83%", icon: Calendar, color: "blue" },
    { label: labels.staff, value: "14", change: "+1", icon: UserCheck, color: "purple" },
    { label: "Taux d'occupation", value: "92%", change: "+4%", icon: TrendingUp, color: "green" },
  ]

  const chartData = [
    { day: 'Lun', present: 78 },
    { day: 'Mar', present: 82 },
    { day: 'Mer', present: 75 },
    { day: 'Jeu', present: 80 },
    { day: 'Ven', present: 85 },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{labels.welcome} 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                {stat.change} ce mois
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Présence cette semaine</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}