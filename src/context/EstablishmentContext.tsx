import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface Establishment {
  id: string
  name: string
  type: string
  plan: string
}

interface EstablishmentContextType {
  establishment: Establishment | null
  loading: boolean
}

const EstablishmentContext = createContext<EstablishmentContextType | undefined>(undefined)

export function EstablishmentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEstablishment = async () => {
      if (!user) {
        setEstablishment(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('nurseries')
        .select('id, name, type, plan')
        .eq('email', user.email)
        .single()

      if (!error && data) {
        setEstablishment(data)
      }
      setLoading(false)
    }

    fetchEstablishment()
  }, [user])

  return (
    <EstablishmentContext.Provider value={{ establishment, loading }}>
      {children}
    </EstablishmentContext.Provider>
  )
}

export const useEstablishment = () => {
  const context = useContext(EstablishmentContext)
  if (!context) throw new Error('useEstablishment must be used within EstablishmentProvider')
  return context
}