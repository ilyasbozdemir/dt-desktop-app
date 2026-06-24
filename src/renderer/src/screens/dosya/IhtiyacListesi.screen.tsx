import React, { useEffect, useState } from 'react'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { Package, Printer } from 'lucide-react'
import { SubScreen } from './SubScreen'

export function IhtiyacListesiTalepFormu(): React.JSX.Element {
  const { activeDosyaId } = useWorkspaceStore()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeDosyaId) return
    window.electron.ipcRenderer.invoke(
      'db:query',
      'SELECT * FROM DATA_TeminKalem WHERE temin_dosya_id = ? ORDER BY id ASC',
      [activeDosyaId]
    ).then(res => {
      if (res.success) setItems(res.data)
    }).finally(() => setLoading(false))
  }, [activeDosyaId])

  return (
    <SubScreen
      title="İhtiyaç Listesi & Talep Formu"
      icon={Package}
      description="Talep formu formatında hazırlanmış, çıktı alınmaya hazır resmi ihtiyaç listesi görünümü."
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Yazdır / PDF Olarak Kaydet
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md max-w-4xl mx-auto font-sans text-slate-850 dark:text-slate-200 print:shadow-none print:border-none print:p-0">
        <div className="text-center font-bold uppercase space-y-1 pb-6 border-b-2 border-slate-350 dark:border-slate-850">
          <h2 className="text-sm">T.C.</h2>
          <h3 className="text-xs">KAMU KURUMU VE İDARESİ</h3>
          <h4 className="text-[10px] text-slate-500">DOĞRUDAN TEMİN İHTİYAÇ LİSTESİ VE TALEP FORMU</h4>
        </div>

        <div className="py-6 space-y-4 text-xs">
          <p className="leading-relaxed">
            İdaremizin doğrudan temin usulüyle tedarik etmek istediği ve aşağıda detaylı teknik özellikleri / miktarları belirtilen malzemelerin / hizmetlerin satın alınması hususunu arz ederim.
          </p>

          <table className="w-full border-collapse border border-slate-300 dark:border-slate-800 text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="border border-slate-300 dark:border-slate-800 p-2 text-center w-10">S.No</th>
                <th className="border border-slate-300 dark:border-slate-800 p-2">Malzeme/İş Kalemi Adı</th>
                <th className="border border-slate-300 dark:border-slate-800 p-2 text-center w-20">Miktar</th>
                <th className="border border-slate-300 dark:border-slate-800 p-2 text-center w-20">Ölçü Birimi</th>
                <th className="border border-slate-300 dark:border-slate-800 p-2 text-center w-16">KDV</th>
                <th className="border border-slate-300 dark:border-slate-800 p-2">Açıklama / Teknik Özellik</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="border border-slate-300 dark:border-slate-800 p-4 text-center italic text-slate-400">Yükleniyor...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="border border-slate-300 dark:border-slate-800 p-4 text-center italic text-slate-400">Kayıtlı kalem bulunamadı.</td></tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="border border-slate-300 dark:border-slate-800 p-2 text-center font-bold">{idx + 1}</td>
                    <td className="border border-slate-300 dark:border-slate-800 p-2 font-bold">{item.kalem_adi}</td>
                    <td className="border border-slate-300 dark:border-slate-800 p-2 text-center font-mono font-bold">{item.miktar}</td>
                    <td className="border border-slate-300 dark:border-slate-800 p-2 text-center">{item.birim}</td>
                    <td className="border border-slate-300 dark:border-slate-800 p-2 text-center font-mono">%{item.kdv_orani}</td>
                    <td className="border border-slate-300 dark:border-slate-800 p-2 text-slate-500">{item.aciklama || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pt-12 flex justify-between">
            <div className="text-center w-40">
              <span className="block font-bold">Hazırlayan</span>
              <span className="block text-[10px] text-slate-400 mt-8">(İmza)</span>
            </div>
            <div className="text-center w-40">
              <span className="block font-bold">Birim Müdürü</span>
              <span className="block text-[10px] text-slate-400 mt-8">(İmza / Mühür)</span>
            </div>
          </div>
        </div>
      </div>
    </SubScreen>
  )
}
