import React, { useState } from 'react'
import { PlaceholderYonetimi } from './components/PlaceholderYonetimi'
import { TemplateMapping } from './components/TemplateMapping'
import { Key, Link } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function DegiskenlerScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'placeholders' | 'mapping'>('placeholders')

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300 p-6">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('placeholders')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'placeholders'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          )}
        >
          <Key className="w-4 h-4" />
          Dinamik Değişkenler
        </button>
        <button
          onClick={() => setActiveTab('mapping')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'mapping'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          )}
        >
          <Link className="w-4 h-4" />
          Operasyon Bağlamaları
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'placeholders' && <PlaceholderYonetimi />}
        {activeTab === 'mapping' && <TemplateMapping />}
      </div>
    </div>
  )
}
