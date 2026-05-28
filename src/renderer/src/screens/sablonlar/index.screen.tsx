import React, { useState } from 'react'
import {
  FileText,
  Upload,
  Download,
  Plus,
  Play,
  Settings,
  Database,
  Code,
  Save,
  Trash2
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { cn } from '../../utils/cn'

interface Placeholder {
  anahtar: string
  etiket: string
  zorunlu: boolean
  varsayilan?: string
}

export default function SablonlarScreen(): React.JSX.Element {
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([
    { anahtar: 'firma_adi', etiket: 'Firma Adı', zorunlu: true },
    { anahtar: 'tarih', etiket: 'İşlem Tarihi', zorunlu: true, varsayilan: '15/06/2026' },
    { anahtar: 'toplam_tutar', etiket: 'Toplam Tutar', zorunlu: false, varsayilan: '0,00 ₺' }
  ])

  const [previewValues, setPreviewValues] = useState<Record<string, string>>({})
  const [isExporting, setIsExporting] = useState(false)

  // Demo icerik
  const templateContent = `Sayın {{firma_adi}},\n\n{{tarih}} tarihli alım işlemimiz kapsamında {{toplam_tutar}} tutarındaki teklifiniz onaylanmıştır.\n\nİyi çalışmalar dileriz.`

  const renderPreview = () => {
    let result = templateContent
    placeholders.forEach((p) => {
      const val = previewValues[p.anahtar] || p.varsayilan || `[${p.etiket}]`
      result = result.replace(new RegExp(`{{${p.anahtar}}}`, 'g'), val)
    })
    return result
  }

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      alert('Şablon .dtm.template formatında başarıyla dışa aktarıldı (Demo).')
    }, 800)
  }

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-purple-500" />
            Şablon Yönetimi ve Playground
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Belge şablonlarını düzenleyin, dinamik etiketleri (placeholders) yönetin ve canlı önizleme yapın.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" className="text-xs font-semibold py-2 flex items-center gap-2 border-slate-200 dark:border-slate-800">
            <Upload className="w-4 h-4" />
            İçe Aktar (.dtm.template)
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold py-2 px-4 shadow-md flex items-center gap-2 text-white">
            <Download className="w-4 h-4" />
            {isExporting ? 'Aktarılıyor...' : 'Dışa Aktar'}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold py-2 px-4 shadow-md flex items-center gap-2 text-white">
            <Save className="w-4 h-4" />
            Kaydet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* SOL PANEL: ŞABLON DÜZENLEME */}
        <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Settings className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Şablon Yapılandırması
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Şablon Adı
              </label>
              <Input defaultValue="Mal Alımı - Onay Belgesi" className="bg-slate-50 dark:bg-slate-950 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Dosya Türü
              </label>
              <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl py-2 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option value="docx">Word Belgesi (.docx)</option>
                <option value="xlsx">Excel Tablosu (.xlsx)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                Dinamik Etiketler (Placeholders)
              </h3>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <Plus className="w-3.5 h-3.5 mr-1" /> Etiket Ekle
              </Button>
            </div>
            
            <div className="space-y-3">
              {placeholders.map((p, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl relative group">
                  <button className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/50">
                      {`{{${p.anahtar}}}`}
                    </span>
                    <span className="text-xs text-slate-500">→</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {p.etiket}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">Kaynak Tablo (Otomatik)</label>
                      <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-lg py-1.5 px-2">
                        <option value="">(Kullanıcı Girecek)</option>
                        <option value="TANIM_Firma" selected={p.anahtar === 'firma_adi'}>TANIM_Firma</option>
                        <option value="DATA_TeminDosyasi" selected={p.anahtar === 'toplam_tutar'}>DATA_TeminDosyasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">Varsayılan Değer</label>
                      <Input defaultValue={p.varsayilan || ''} placeholder="Varsayılan..." className="h-7 text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              İçerik Şablonu (Sadece Demo)
            </h3>
            <textarea 
              readOnly 
              value={templateContent}
              className="w-full h-32 p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 resize-none"
            />
          </div>

        </div>

        {/* SAĞ PANEL: CANLI ÖNİZLEME (PLAYGROUND) */}
        <div className="flex flex-col gap-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Play className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Canlı Önizleme (Playground)
            </h2>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aşağıdaki alanlara örnek değerler girerek şablonun nasıl derleneceğini canlı olarak görebilirsiniz.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {placeholders.map((p) => (
              <div key={p.anahtar}>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {p.etiket} {p.zorunlu && <span className="text-red-500">*</span>}
                </label>
                <Input 
                  placeholder={`${p.etiket} girin...`}
                  value={previewValues[p.anahtar] || ''}
                  onChange={(e) => setPreviewValues(prev => ({ ...prev, [p.anahtar]: e.target.value }))}
                  className="bg-white dark:bg-slate-950 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Çıktı Görüntüsü
            </h3>
            <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
              {renderPreview()}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
