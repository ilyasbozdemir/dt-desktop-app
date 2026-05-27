import React, { useState } from 'react'
import { Database, Plus, Trash2, Edit2, ShieldAlert, Archive, MapPin } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

interface AmbarMock {
  id: number
  kod: string
  ad: string
  sorumlu: string
  adres: string
}

export default function AmbarScreen(): React.JSX.Element {
  const [ambarlar, setAmbarlar] = useState<AmbarMock[]>([
    { id: 1, kod: 'AMB-01', ad: 'Merkez İnşaat ve Fen İşleri Ambarı', sorumlu: 'Ahmet Yılmaz', adres: 'Fen İşleri Şantiyesi' },
    { id: 2, kod: 'AMB-02', ad: 'Kırtasiye ve Büro Malzemeleri Ambarı', sorumlu: 'Mehmet Demir', adres: 'Belediye Hizmet Binası Kat: -1' },
    { id: 3, kod: 'AMB-03', ad: 'Destek Hizmetleri ve Akaryakıt Deposu', sorumlu: 'Mustafa Kaya', adres: 'Destek Hizmetleri Garajı' }
  ])

  const [kod, setKod] = useState('')
  const [ad, setAd] = useState('')
  const [sorumlu, setSorumlu] = useState('')
  const [adres, setAdres] = useState('')

  const handleAdd = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!kod.trim() || !ad.trim()) return
    const newAmbar: AmbarMock = {
      id: Date.now(),
      kod: kod.trim().toUpperCase(),
      ad: ad.trim(),
      sorumlu: sorumlu.trim() || 'Belirlenmedi',
      adres: adres.trim() || 'Belirlenmedi'
    }
    setAmbarlar([...ambarlar, newAmbar])
    setKod('')
    setAd('')
    setSorumlu('')
    setAdres('')
    alert('Yeni ambar kaydı başarıyla eklendi (Mock).')
  }

  const handleDelete = (id: number): void => {
    if (confirm('Bu ambar kaydını silmek istediğinize emin misiniz?')) {
      setAmbarlar(ambarlar.filter((a) => a.id !== id))
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-full">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-slate-850 dark:text-slate-100">
            <Database className="w-8 h-8 text-blue-605" />
            Ambar Tanımları & Depo Yönetimi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Kurumunuza ait ana ambar, depo, stok grupları ve depo sorumlularını tanımlayın.
          </p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-450 flex items-center justify-center shrink-0">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Tanımlı Ambar Deposu</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{ambarlar.length} Adet</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Farklı Konum / Adres</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">3 Bölge</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-450 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Yetkili Sorumlu Havuzu</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{ambarlar.filter(a => a.sorumlu !== 'Belirlenmedi').length} Personel</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SOL: YENİ EKLEME FORMU */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            Yeni Ambar Deposu Tanımla
          </h3>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">Ambar / Depo Kodu *</label>
              <Input
                required
                value={kod}
                onChange={(e) => setKod(e.target.value)}
                placeholder="Örn: AMB-04"
                className="bg-slate-55 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-xs py-1.5 h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">Ambar Adı *</label>
              <Input
                required
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                placeholder="Örn: Fen İşleri Yedek Parça Ambarı"
                className="bg-slate-55 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-xs py-1.5 h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">Ambar Sorumlusu</label>
              <Input
                value={sorumlu}
                onChange={(e) => setSorumlu(e.target.value)}
                placeholder="Sorumlu Personel Adı"
                className="bg-slate-55 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-xs py-1.5 h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">Depo Adresi / Konumu</label>
              <Input
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
                placeholder="Depo Adresi"
                className="bg-slate-55 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-xs py-1.5 h-9"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 text-xs font-semibold py-2">
              Ambar Kaydını Ekle
            </Button>
          </form>
        </div>

        {/* SAĞ: LİSTE */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mb-4">
            Kayıtlı Ambar Depoları
          </h3>

          <div className="flex flex-col gap-3">
            {ambarlar.map((ambar) => (
              <div
                key={ambar.id}
                className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-450 bg-blue-50 dark:bg-blue-900/30 border border-blue-100/20 dark:border-blue-900/10 px-2 py-0.5 rounded">
                      {ambar.kod}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Sorumlu: {ambar.sorumlu}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 leading-normal">
                    {ambar.ad}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {ambar.adres}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-655">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ambar.id)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/15"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
