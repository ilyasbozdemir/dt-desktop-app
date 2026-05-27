import React, { useState } from 'react'
import { useBirimlerHooks } from './birimler.hooks'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { LayoutGrid, Plus, Trash2 } from 'lucide-react'

export default function BirimlerScreen(): React.ReactNode {
  const { birimler, isLoadingBirimler, addBirim, deleteBirim } = useBirimlerHooks()
  const [yeniBirim, setYeniBirim] = useState('')

  const handleAddBirim = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!yeniBirim.trim()) return
    try {
      await addBirim(yeniBirim.trim())
      setYeniBirim('')
    } catch (err: any) {
      if (err.message?.includes('UNIQUE')) {
        alert('Bu birim zaten ekli!')
      } else {
        alert('Birim eklenirken hata oluştu!')
      }
    }
  }

  const handleDeleteBirim = async (id: number): Promise<void> => {
    if (confirm('Bu birimi silmek istediğinize emin misiniz?')) {
      try {
        await deleteBirim(id)
      } catch (err) {
        alert('Silme sırasında hata oluştu!')
      }
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-full">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-850 dark:text-slate-100 flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-blue-605" />
            Birim & Müdürlük Yönetimi
          </h1>
          <p className="text-sm text-slate-505 dark:text-slate-400 mt-2">
            Kurumunuza ait idari birimleri ve müdürlükleri buradan tanımlayarak personellere atayabilirsiniz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SOL: BİRİM EKLEME FORMU */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            Yeni Birim Tanımla
          </h3>

          <form onSubmit={handleAddBirim} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-1.5">
                Birim / Müdürlük Adı
              </label>
              <Input
                value={yeniBirim}
                onChange={(e) => setYeniBirim(e.target.value)}
                placeholder="Örn: Fen İşleri Müdürlüğü"
                required
                className="bg-slate-55 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-xs py-1.5 h-9"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 text-xs font-semibold py-2">
              Birimi Ekle
            </Button>
          </form>
        </div>

        {/* SAĞ: BİRİM LİSTESİ */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mb-4">
            Kayıtlı İdari Birimler
          </h3>

          <div className="flex flex-col gap-2.5">
            {isLoadingBirimler ? (
              <div className="text-sm text-slate-450 dark:text-slate-500 py-4 italic">Birimler yükleniyor...</div>
            ) : birimler.length === 0 ? (
              <div className="text-sm text-slate-450 dark:text-slate-500 py-4 italic">Kayıtlı birim bulunmamaktadır.</div>
            ) : (
              birimler.map((birim) => (
                <div
                  key={birim.id}
                  className="flex justify-between items-center p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {birim.birim_adi}
                  </span>
                  <Button
                    title="Sil"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBirim(birim.id)}
                    className="h-8 w-8 p-0 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/15 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
