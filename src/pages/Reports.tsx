import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function Reports() {
  const attendanceData = [
    { name: 'Lun', present: 78, absent: 9 },
    { name: 'Mar', present: 82, absent: 5 },
    { name: 'Mer', present: 75, absent: 12 },
    { name: 'Jeu', present: 80, absent: 7 },
    { name: 'Ven', present: 85, absent: 2 },
  ]

  const groupData = [
    { name: 'Petits', value: 32, color: '#14b8a6' },
    { name: 'Moyens', value: 28, color: '#3b82f6' },
    { name: 'Grands', value: 27, color: '#8b5cf6' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Rapports & Statistiques</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold mb-4">Présence cette semaine</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#14b8a6" name="Présents" />
                <Bar dataKey="absent" fill="#f87171" name="Absents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Group Distribution */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold mb-4">Répartition par groupe</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={groupData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {groupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}