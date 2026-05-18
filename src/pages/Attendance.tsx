import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useEstablishment } from '../context/EstablishmentContext'

interface AttendanceRecord {
  id: string
  child_id: string
  child_name: string
  status: 'Present' | 'Absent' | 'Late'
}

export function Attendance() {
  const { establishment, nurseryId } = useEstablishment()
  const type = establishment?.type || 'Crèche'

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  const getTitle = (type: string) => {
    if (type === 'École de langue' || type === 'École de cours') return 'Suivi des Présences - Étudiants'
    if (type === 'École de formation') return 'Suivi des Présences - Apprenants'
    return 'Suivi des Présences'
  }

  const fetchAttendance = async () => {
    if (!nurseryId) return
    setLoading(true)

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('attendance')
      .select(`id, child_id, status, children(first_name, last_name)`)
      .eq('nursery_id', nurseryId)
      .eq('date', today)

    if (!error && data) {
      const formatted = data.map((item: any) => ({
        id: item.id,
        child_id: item.child_id,
        child_name: `${item.children.first_name} ${item.children.last_name}`,
        status: item.status
      }))
      setAttendance(formatted)
    }
    setLoading(false)
  }

  const updateStatus = async (childId: string, newStatus: 'Present' | 'Absent' | 'Late') => {
    if (!nurseryId) return
    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase.from('attendance').upsert({
      nursery_id: nurseryId,
      child_id: childId,
      date: today,
      status: newStatus
    })

    if (!error) {
      setAttendance(prev => prev.map(item =>
        item.child_id === childId ? { ...item, status: newStatus } : item
      ))
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [nurseryId])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{getTitle(type)}</h1>
          <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Chargement...</div>
        ) : attendance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucune donnée aujourd'hui</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {attendance.map(record => (
              <div key={record.id} className="flex items-center justify-between p-5">
                <span className="font-medium">{record.child_name}</span>
                <div className="flex gap-2">
                  {(['Present', 'Absent', 'Late'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(record.child_id, status)}
                      className={`px-5 py-1.5 text-sm rounded-2xl transition-all ${
                        record.status === status
                          ? status === 'Present' ? 'bg-green-600 text-white'
                            : status === 'Absent' ? 'bg-red-600 text-white'
                            : 'bg-orange-600 text-white'
                          : 'border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {status === 'Present' ? 'Présent' : status === 'Absent' ? 'Absent' : 'Retard'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}