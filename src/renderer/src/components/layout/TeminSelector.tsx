import React, { useState, useRef, useEffect } from 'react'
import { FileText, ChevronDown, Search, FolderClosed, Plus } from 'lucide-react'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { useDosyalarHooks } from '../../screens/dosyalar/dosyalar.hooks'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '../../utils/cn'

export function TeminSelector(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const { activeDosyaId, setActiveDosyaId, setIsCreatingDosya } = useWorkspaceStore()
  const { dosyalar, isLoadingDosyalar } = useDosyalarHooks()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedDosya = dosyalar.find((d) => d.id === activeDosyaId)

  const filteredDosyalar = dosyalar.filter(
    (d) =>
      d.konu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.temin_no?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (id: number): void => {
    setActiveDosyaId(id)
    setIsOpen(false)
    // Redirect to dosyalar screen if not already there
    navigate({ to: '/dosyalar' })
  }

  const handleCreateYeniDosya = (e: React.MouseEvent): void => {
    e.stopPropagation()
    setIsCreatingDosya(true)
    setIsOpen(false)
    navigate({ to: '/dosyalar' })
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-800 rounded-xl transition-all max-w-[280px] md:max-w-[360px] text-left"
        title="Aktif Doğrudan Temin Dosyasını Seçin"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none mb-0.5">
            Aktif Temin Dosyası
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-tight">
            {selectedDosya
              ? `${selectedDosya.temin_no || 'No Bekliyor'} — ${selectedDosya.konu}`
              : 'Doğrudan Temin Seçilmedi'}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative flex items-center p-1.5 border-b border-slate-100 dark:border-slate-800 mb-2">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Dosya no veya konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateYeniDosya}
              className="absolute right-2 p-1.5 text-blue-600 hover:bg-blue-550 dark:hover:bg-blue-950/45 rounded-lg transition-colors"
              title="Yeni Temin Dosyası Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-0.5 p-1">
            {isLoadingDosyalar ? (
              <div className="p-4 text-center text-xs text-slate-500">Yükleniyor...</div>
            ) : filteredDosyalar.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <FolderClosed className="w-6 h-6 opacity-40" />
                <span>Temin dosyası bulunamadı.</span>
                <button
                  onClick={handleCreateYeniDosya}
                  className="mt-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Yeni Dosya Tanımla
                </button>
              </div>
            ) : (
              filteredDosyalar.map((dosya) => (
                <button
                  key={dosya.id}
                  onClick={() => handleSelect(dosya.id)}
                  className={cn(
                    'w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent',
                    activeDosyaId === dosya.id &&
                      'bg-blue-50/70 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
                  )}
                >
                  <FileText
                    className={cn(
                      'w-4 h-4 mt-0.5 shrink-0',
                      activeDosyaId === dosya.id ? 'text-blue-500' : 'text-slate-400'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-400">
                        {dosya.temin_no || 'No Bekliyor'}
                      </span>
                      <span className="text-[8px] px-1 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded font-bold uppercase">
                        {dosya.tur}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-200 font-semibold truncate">
                      {dosya.konu}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
