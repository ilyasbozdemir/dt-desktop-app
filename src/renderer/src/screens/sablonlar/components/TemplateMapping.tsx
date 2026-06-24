import React, { useEffect, useState } from 'react'
import { Save, FileText, Loader2, Link } from 'lucide-react'
import { Sablon } from '../sablonlar.hooks'

export function TemplateMapping(): React.JSX.Element {
  const [sablons, setSablons] = useState<Sablon[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [selectedSablonId, setSelectedSablonId] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Fetch Sablons
      const sablonRes = await window.electron.ipcRenderer.invoke('db:query', 'SELECT * FROM TANIM_Sablon WHERE aktif_mi = 1')
      if (sablonRes.success) {
        setSablons(sablonRes.data)
      }

      // Fetch Settings
      const settingsRes = await window.electron.ipcRenderer.invoke('db:get-settings')
      if (settingsRes.success) {
        setSettings(settingsRes.data)
        if (settingsRes.data['MAPPING_IHTIYAC_LISTESI_SABLON_ID']) {
          setSelectedSablonId(settingsRes.data['MAPPING_IHTIYAC_LISTESI_SABLON_ID'])
        }
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const newSettings = {
        ...settings,
        MAPPING_IHTIYAC_LISTESI_SABLON_ID: selectedSablonId
      }
      
      const res = await window.electron.ipcRenderer.invoke('db:save-settings', newSettings)
      if (res.success) {
        alert('Bağlamalar başarıyla kaydedildi!')
      } else {
        alert('Kaydetme hatası: ' + res.error)
      }
    } catch (error: any) {
      alert('İşlem sırasında hata: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Link className="w-6 h-6 text-blue-500" />
            Operasyon Şablonu Bağlamaları
          </h2>
          <p className="text-sm text-slate-500 mt-1">Sistem içerisindeki belirli işlemlerin hangi şablonlarla çıktı üreteceğini buradan ayarlayabilirsiniz.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="space-y-6">
        {/* İhtiyaç Listesi Bağlaması */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                İhtiyaç Listesi Şablonu
              </h3>
              <p className="text-xs text-slate-500 mt-1">Malzeme ve Kodlar sekmesindeki "Yazdır / PDF Olarak Kaydet" işleminde kullanılacak şablonu belirler.</p>
            </div>
            <div className="w-full md:w-96">
              <select
                value={selectedSablonId}
                onChange={(e) => setSelectedSablonId(e.target.value)}
                className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                title="İhtiyaç Listesi Şablonu Seçin"
              >
                <option value="">-- Şablon Seçiniz --</option>
                {sablons.map(s => (
                  <option key={s.id} value={s.id.toString()}>
                    {s.kategori ? `${s.kategori} - ` : ''}{s.ad} ({s.dosya_adi})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
