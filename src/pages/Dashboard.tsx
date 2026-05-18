import { Users, Calendar, TrendingUp, UserCheck } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useEstablishment } from '../context/EstablishmentContext'

export function Dashboard() {
  const { establishment } = useEstablishment()

  const type = establishment?.type || 'Crèche'
  const name = establishment?.name || 'Votre établissement'

  const getLabels = (type: string) => {
    switch (type) {
      case 'École de langue':
        return { students: 'Étudiants inscrits', present: 'Présents aujourd\'hui', staff: 'Formateurs', welcome: 'Bienvenue dans votre école de langue' }
      case 'École de cours':
        return { students: 'Élèves inscrits', present: 'Présents aujourd\'hui', staff: 'Professeurs', welcome: 'Bienvenue dans votre école de cours' }
      case 'École de formation':
        return { students: 'Apprenants inscrits', present: 'Présents aujourd\'hui', staff: 'Formateurs', welcome: 'Bienvenue dans votre centre de formation' }
      default:
        return { students: 'Enfants inscrits', present: 'Présents aujourd\'hui', staff: 'Personnel', welcome: 'Bienvenue dans votre crèche' }
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">{labels.welcome}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">{name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white dark:bg-gray-900 p-7 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                  <p className="text-4xl font-semibold mt-3 tracking-tight">{stat.value}</p>
                </div>
                <div className={`p-3.5 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <div className="mt-5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {stat.change} ce mois
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-xl">Présence cette semaine</h3>
        </div>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}