import React from 'react'
import { CreditCard } from 'lucide-react'
import { SubScreen } from '../../SubScreens.screen'

export function KabulVeOdeme(): React.JSX.Element {
  return (
    <SubScreen
      title="Kabul & Ödeme İşlemleri"
      icon={CreditCard}
      description="Kabul ve ödeme süreçlerini yönetin."
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bu süreç henüz tasarım aşamasındadır.
        </p>
      </div>
    </SubScreen>
  )
}
