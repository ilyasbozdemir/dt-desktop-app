import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ClipboardCheck,
  Search,
  Plus,
  Trash2,
  Edit,
  X
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

interface GorevTanimlariModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GorevTanimlariModal({ isOpen, onClose }: GorevTanimlariModalProps): React.JSX.Element | null {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: gorevler = [], isLoading } = useQuery({
    queryKey: ['komisyon_gorevleri'],
    queryFn: async () => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:query',
        'SELECT * FROM TANIM_KomisyonGorevi WHERE aktif_mi = 1 ORDER BY id ASC'
      )
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    enabled: isOpen // Only fetch when modal is open
  })

  const filteredGorevler = gorevler.filter((g: any) => 
    g.ad.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (g.aciklama && g.aciklama.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-indigo-500" />
              Komisyon Görev Tanımları
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Komisyonlarda personellere atanabilecek unvan ve görevleri yönetin.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 pb-0 shrink-0 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Görev adı veya açıklama ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-sm"
            />
          </div>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 rounded-xl px-4 py-2 text-sm font-semibold transition-all">
            <Plus className="w-4 h-4" /> Yeni Görev Ekle
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-full py-12 text-center text-slate-500">Yükleniyor...</div>
            ) : filteredGorevler.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">Görev bulunamadı.</div>
            ) : (
              filteredGorevler.map((gorev: any) => (
              <div key={gorev.id} className="group p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950/50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      {gorev.ad.charAt(0)}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{gorev.ad}</h3>
                  </div>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed ml-10">
                  {gorev.aciklama}
                </p>
              </div>
            )))}
          </div>
        </div>

      </div>
    </div>
  )
}
