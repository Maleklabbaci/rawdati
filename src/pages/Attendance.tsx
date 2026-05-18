import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'
import { useEstablishment } from '../context/EstablishmentContext'

interface AttendanceRecord {
  id: string
  child_id: string
  child_name: string
  status: 'Present' | 'Absent' | 'Late'
}

export function Attendance() {
  const { t } = useLanguage()
  const { establishment } = useEstablishment()
  const type = establishment?.type || 'Crèche'

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  const getLabels = (type: string) => {
    if (type === 'École de langue' || type === 'École de cours') {
      return { title: 'Suivi des Présences - Étudiants' }
    } else if (type === 'École de formation') {
      return { title: 'Suivi des Présences - Apprenants' }
    } else {
      return { title: 'Suivi des Présences' }
    }
  }

  const labels = getLabels(type)

  const fetchAttendance = async () => {
    setLoading(true)
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        id,
        child_id,
        status,
        children(first_name, last_name)
      `)
      .eq('date', today)

    if (error) {
      console.error(error)
    } else {
      const formatted = data?.map((item: any) => ({
        id: item.id,
        child_id: item.child_id,
        child_name: `${item.children.first_name} ${item.children.last_name}`,
        status: item.status
      })) || []
      setAttendance(formatted)
    }
    setLoading(false)
  }

  const updateStatus = async (childId: string, newStatus: 'Present' | 'Absent' | 'Late') => {
    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase
      .from('attendance')
      .upsert({
        child_id: childId,
        date: today,
        status: newStatus,
        nursery_id: '00000000-0000-0000-0000-000000000000'
      })

    if (!error) {
      setAttendance(prev =>
        prev.map(item =>
          item.child_id === childId ? { ...item, status: newStatus } : item
        )
      )
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{labels.title}</h1>
          <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">{t('loading')}</div>
        ) : attendance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucun enregistrement</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {attendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4">
                <span className="font-medium">{record.child_name}</span>
                <div className="flex gap-2">
                  {(['Present', 'Absent', 'Late'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(record.child_id, status)}
                      className={`px-4 py-1.5 text-sm rounded-xl transition-all ${
                        record.status === status
                          ? status === 'Present' ? 'bg-green-600 text-white'
                            : status === 'Absent' ? 'bg-red-600 text-white'
                            : 'bg-orange-600 text-white'
                          : 'border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {status === 'Present' ? t('present') : status === 'Absent' ? t('absent') : t('late')}
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