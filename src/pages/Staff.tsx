import { useLanguage } from '../context/LanguageContext'

export function Staff() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('staff')}</h1>
      <p className="text-gray-500">Module en cours de développement...</p>
    </div>
  )
}