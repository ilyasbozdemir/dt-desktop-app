import React from 'react'
import { FileCheck } from 'lucide-react'
import { SubScreen } from '../../SubScreens.screen'

export function SiparisVeSozlesme(): React.JSX.Element {
  return (
    <SubScreen
      title="Sipariş & Sözleşme"
      icon={FileCheck}
      description="Sipariş ve sözleşme süreçlerini yönetin."
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bu süreç henüz tasarım aşamasındadır.
        </p>
      </div>
    </SubScreen>
  )
}
