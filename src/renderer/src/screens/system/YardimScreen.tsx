import React, { useState } from 'react'
import { FileText, Download, ExternalLink, HelpCircle, FileSpreadsheet, BookOpen, Layers, Cpu, Layout, Info } from 'lucide-react'
import { ExcelViewer } from '../../components/ui/ExcelViewer'

const DOCUMENTS = [
  {
    category: 'Sistem Kılavuzu & Tanıtım',
    items: [
      {
        id: 'uygulamamizi_yakindan_taniyalim',
        title: 'Uygulamamızı Yakından Tanıyalım',
        description: 'Uygulama genel yapısı, şablon mekanizması, sayfa yerleşimleri (A4/yarım sayfa) ve dosya/veri mimarisi hakkında detaylı rehber.',
        file: 'system_guide'
      }
    ]
  },
  {
    category: 'Resmi Yazışma ve Kullanıcı Kılavuzları',
    items: [
      {
        id: 'dogrudan_temin_islem_sureci',
        title: 'Doğrudan Temin İşlem Süreci',
        description: 'Doğrudan temin alım sürecinin adım adım tüm aşamaları (lüzum müzekkeresinden ödeme emrine).',
        file: '/docs/dogrudan_temin_islem_sureci.doc'
      },
      {
        id: 'resmi_yazisma_kurallari',
        title: 'Resmi Yazışma Kuralları',
        description: 'Resmi yazışmalarda uyulması gereken kurallar ve standartlar.',
        file: '/docs/resmi_yazisma_kurallari.pdf'
      },
      {
        id: 'resmi_yazismalarda_uygulanacak_usul_ve_esaslar_yonetmelik_kilavuzu',
        title: 'Resmi Yazışmalar Yönetmelik Kılavuzu',
        description: 'Resmi Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik Kılavuzu.',
        file: '/docs/resmi_yazismalarda_uygulanacak_usul_ve_esaslar_yonetmelik_kilavuzu.pdf'
      },
      {
        id: 'dogrudan_temin_son_kullanici_kilavuzu',
        title: 'Doğrudan Temin Son Kullanıcı Kılavuzu',
        description: 'Doğrudan Temin süreci ve uygulamanın kullanımı hakkında son kullanıcı kılavuzu.',
        file: '/docs/dogrudan_temin_son_kullanici_kilavuzu.pdf'
      },
      {
        id: '20200610-8',
        title: 'Faydalı Doküman (20200610-8)',
        description: 'İlgili resmi mevzuat dokümanı.',
        file: '/docs/20200610-8.pdf'
      }
    ]
  },
  {
    category: 'Muhasebat & Maliyet Dokümanları',
    items: [
      {
        id: 'guncel_tasinir_kod_listesi',
        title: 'Güncel Taşınır Kod Listesi',
        description: 'Taşınır hesap planı ve kod listesi (Güncel).',
        file: '/docs/muhasebat/guncel_tasinir_kod_listesi.xls'
      },
      {
        id: '2018_mahalli_idareler_detayli_hesap_plani',
        title: 'Mahalli İdareler Detaylı Hesap Planı (2018)',
        description: 'Mahalli idareler için detaylı muhasebat hesap planı excel tablosu.',
        file: '/docs/muhasebat/2018_mahalli_idareler_detayli_hesap_plani.xls'
      },
      {
        id: 'defter_belge_ve_cetvel_ornekleri',
        title: 'Defter, Belge ve Cetvel Örnekleri',
        description: 'Muhasebat süreçleri için defter, belge ve cetvel örnekleri.',
        file: '/docs/muhasebat/defter_belge_ve_cetvel_ornekleri.xlsx'
      },
      {
        id: 'ek_10_teslim_sureleri_tablosu',
        title: 'EK-10 Teslim Süreleri Tablosu',
        description: 'Resmi evrak ve faturaların teslim süreleri tablosu.',
        file: '/docs/muhasebat/ek_10_teslim_sureleri_tablosu.xlsx'
      },
      {
        id: 'kurumsal_2019_2021',
        title: 'Kurumsal Muhasebat Kılavuzu (2019-2021)',
        description: 'Kurumsal kılavuz ve mali istatistikler (2019-2021).',
        file: '/docs/muhasebat/kurumsal_2019_2021.pdf'
      },
      {
        id: '5816_2',
        title: 'Mali Mevzuat Dokümanı (5816_2)',
        description: 'Maliye ve Muhasebat ilgili mevzuat PDF dokümanı.',
        file: '/docs/muhasebat/5816_2.pdf'
      }
    ]
  }
]

const DogrudanTeminSurecAkisi = () => {
  const steps = [
    {
      title: "1- İHTİYACIN TESPİTİ",
      desc: "Standart bir form yok, “Lüzum Müzekkeresi” veya “İhtiyaç Raporu” adı altında bir belge oluşturulabilir. Bu belge ihtiyaç duyan birim tarafından alımı gerçekleştirilecek makama hitaben yazılır."
    },
    {
      title: "2- ONAY BELGESİ DÜZENLENMESİ",
      desc: "Onay Belgesi: İhale usulüyle yapılacak alımlarda, kamu ihale mevzuatında standart form olarak belirlenen ihale onay belgelerini; doğrudan temin suretiyle veya kamu ihale mevzuatında belirtilen istisnai alımlarda ise alım konusu işin nev'i, niteliği, varsa proje numarası, miktarı, gereken hallerde yaklaşık maliyeti, kullanılabilir ödeneği ve tertibi, alımda uygulanacak usulü, avans ve fiyat farkı verilecekse şartlarını gösteren ve harcama yetkilisinin imzasını taşıyan belgeyi ifade eder.\n\nStandart bir form yok, onay belgesinde oynama yapılarak kullanılabilir. Bu belgede, görevlendirme yapılan personel isimlerine de yer verilebilir veya ayrı bir yazıyla görevlendirme yapılabilir."
    },
    {
      title: "3- GÖREVLENDİRME YAPILMASI",
      desc: "Onay belgesi üzerinde veya ayrı bir yazıyla görevlendirme yapılır."
    },
    {
      title: "4- PİYASA FİYAT ARAŞTIRMASI YAPILMASI",
      desc: "Standart bir formu bulunmaktadır. Mahalli İdareler Harcama Belgeleri Yönetmeliği ÖRNEK 3."
    },
    {
      title: "5- FİYATIN HARCAMA YETKİLİSİ TARAFINDAN ONAYLANMASI",
      desc: "Piyasa fiyat araştırması tutanağının altına harcama yetkilisi tarafından olur verilmek suretiyle gerçekleştirilebilir."
    },
    {
      title: "6- 4734 62/I MADDESİNE GÖRE % 10 KONTROLÜ",
      desc: ""
    },
    {
      title: "7- ALIMIN YAPILMASI",
      desc: "Fatura düzenlenmesi, gerekli hallerde muayene kabul belgeleri ve taşınır işlem fişinin düzenlenmesi, piyasa fiyat araştırma tutanağının eklenmesi."
    },
    {
      title: "8- ÖDEME",
      desc: "Standart formu bulunmaktadır. Ödeme Emri Belgesi düzenlenir ve ekine gerekli belgeler konulur."
    }
  ];

  return (
    <div className="p-6 overflow-y-auto h-full max-h-full custom-scrollbar bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-105">Doğrudan Temin İşlem Süreci Akış Şeması</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mevzuata uygun olarak doğrudan temin (4734 Sayılı Kanun 22. Madde) sürecinin 8 temel adımı
          </p>
        </div>
        
        <div className="relative border-l-2 border-blue-500 dark:border-blue-700 ml-4 md:ml-6 space-y-6 py-2">
          {steps.map((step, idx) => (
            <div key={idx} className="relative pl-6 md:pl-8 group">
              {/* Dot marker */}
              <div className="absolute left-[-11px] top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-500 dark:border-blue-600 group-hover:scale-125 transition-transform duration-200" />
              
              <div className="bg-white dark:bg-slate-955 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-colors">
                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-450 uppercase tracking-wide flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] text-blue-700 dark:text-blue-300 font-bold shrink-0">
                    {idx + 1}
                  </span>
                  {step.title}
                </h3>
                {step.desc && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-normal whitespace-pre-wrap">
                    {step.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UygulamaRehberi = () => {
  return (
    <div className="p-6 overflow-y-auto h-full max-h-full custom-scrollbar bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Uygulamamızı Yakından Tanıyalım (Sistem Kılavuzu)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Uygulamanın genel kullanım akışı, sayfa yazdırma mantığı ve şablon özelleştirme rehberi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Genel Kullanım Akışı */}
          <div className="bg-white dark:bg-slate-955 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              1. Genel Kullanım Akışı ve Hızlı Çıktı
            </h3>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed mb-3">
              Uygulamanın temel amacı satın alma dosyalarınızı tek merkezden hızlıca hazırlamaktır. En verimli süreç akışı şu şekildedir:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1.5 font-normal">
              <li><strong>Kurum Bilgileri:</strong> İlk olarak kurum bilgilerinizi doldurun. Bu veriler tüm belgelerde otomatik olarak kullanılır.</li>
              <li><strong>Doğrudan Temin Dosyaları:</strong> Süreç dosyalarınızı oluşturup malzeme, komisyon, yaklaşık maliyet gibi detayları girin.</li>
              <li><strong>Otomatik Çıktı:</strong> Dosyanızı doldurduğunuzda, tüm süreç evraklarını <strong>Çıktı Merkezi</strong> üzerinden tek tuşla otomatik, hızlı ve resmi formatta yazdırabilirsiniz.</li>
            </ul>
          </div>

          {/* Card 2: Şablon Yönetimi (Geliştirici Rehberi) */}
          <div className="bg-white dark:bg-slate-955 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              2. Şablon Yönetimi (Geliştirici Rehberi)
            </h3>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed mb-3">
              Yazdırılabilir resmi belgeler dinamik HTML şablonları üzerinden üretilir. Geliştirici veya teknik kullanıcı iseniz:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1.5 font-normal">
              <li><strong>Şablon Düzenleme:</strong> Uygulama menüsündeki <strong>Şablonlar</strong> ekranından kod bazında HTML ve JSON yapılarını doğrudan özelleştirebilir ve düzenleyebilirsiniz.</li>
              <li><strong>Mustache Motoru:</strong> HTML şablonlarında <code>{"{{deger}}"}</code> Mustache yapısı kullanılır, dinamik veriler buraya yerleşir.</li>
              <li><strong>Şablon Konumu:</strong> Proje dizinindeki <code>resources/templates/</code> klasöründe yer alan kaynak kodlara müdahale edebilirsiniz.</li>
            </ul>
          </div>

          {/* Card 3: Çift Nüsha (Half-Page) Hassasiyeti */}
          <div className="bg-white dark:bg-slate-955 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Layout className="w-4 h-4 text-violet-500" />
              3. Çift Nüsha (A4/2) & Dinamik Sayfa Mantığı
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Teslim Tesellüm gibi belgelerde kağıt tasarrufu için A4 sayfasının üst ve alt yarısında iki kopya (`half-page`) yer alır:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1.5 font-normal">
              <li><strong>Yarım Sayfa Modu:</strong> Kalem sayısı azsa (≤ 5) iki nüsha tek bir A4 kağıdına sığdırılır, araya kesikli çizgi konulur.</li>
              <li><strong>Dinamik Tam Sayfa (Full-Page):</strong> Eğer malzeme satırı sayısı 5&apos;ten fazla ise şablondaki DOM scripti otomatik olarak <code>full-page-mode</code> sınıfını ekler.</li>
              <li>Bu modda iki nüsha da dikey A4 boyutuna genişletilir ve sayfa sonu (`break-after: page`) verilerek ardışık iki tam A4 sayfası olarak yazdırılır.</li>
            </ul>
          </div>

          {/* Card 4: Veri Entegrasyonu ve Nesne Yapısı */}
          <div className="bg-white dark:bg-slate-955 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500" />
              4. Kararlı Veri & Dotted Fallback Kuralı
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Kullanıcının bazı alanları (örneğin dosya numarası) boş bırakması ihtimaline karşı resmi evraklarda şu kurallar uygulanır:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1.5 font-normal">
              <li><strong>Obje Ayrıştırma:</strong> <code>dosyaNumarasi</code> bir bütün string yerine <code>{"{ yili: \"2026\", sayisi: \"123\" }"}</code> şeklinde bir nesne olarak saklanır.</li>
              <li><strong>Mustache Fallback:</strong> Sayı değeri girilmediğinde şablonun bozulmaması için <code>{"{{yili}}/{{#sayisi}}{{sayisi}}{{/sayisi}}{{^sayisi}}....{{/sayisi}}"}</code> yapısı kullanılır.</li>
              <li><strong>Çıktı Güvenliği:</strong> Böylece eksik verilerde çıktı <code>2026/....</code> veya tamamen boş ise <code>..../....</code> şeklinde gösterilerek resmi evrak formatı korunur.</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-4 text-xs text-blue-800 dark:text-blue-300 leading-relaxed flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong>Geliştirici & Model Notu:</strong> Şablonları güncellerken veya yeni alanlar eklerken bu yerleşim kurallarına ve boş veri yedekleme (fallback) yapılarına sadık kalmaya özen gösterin.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function YardimScreen(): React.JSX.Element {
  const [activeDoc, setActiveDoc] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const docId = searchParams.get('doc')
    if (docId) {
      for (const group of DOCUMENTS) {
        const found = group.items.find(item => item.id === docId)
        if (found) return found
      }
    }
    return DOCUMENTS[0].items[0]
  })

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-500">
      <div className="flex-none p-6 pb-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-slate-850 dark:text-slate-100">
          <HelpCircle className="w-7 h-7 text-blue-600" />
          Yardım ve Faydalı Dokümanlar
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Sistemi kullanırken faydalanabileceğiniz resmi mevzuat, kullanım kılavuzları ve muhasebat tablolarına buradan ulaşabilirsiniz.
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Document List */}
        <div className="w-[340px] flex-none border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {DOCUMENTS.map((group) => (
            <div key={group.category} className="space-y-2">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-3">
                {group.category}
              </h2>
              {group.items.map((doc) => {
                const isExcel = doc.file.endsWith('.xls') || doc.file.endsWith('.xlsx')
                return (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                      activeDoc.id === doc.id
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 shadow-sm'
                        : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isExcel ? (
                        <FileSpreadsheet className={`w-5 h-5 shrink-0 mt-0.5 ${activeDoc.id === doc.id ? 'text-green-600 dark:text-green-500' : 'text-slate-400'}`} />
                      ) : (
                        <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${activeDoc.id === doc.id ? 'text-blue-600' : 'text-slate-400'}`} />
                      )}
                      <div>
                        <h3 className={`text-sm font-semibold mb-1 leading-tight ${activeDoc.id === doc.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {doc.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-normal">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Right Content - PDF / Excel Viewer Placeholder */}
        <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
          <div className="flex-none p-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm z-10">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              {activeDoc.id === 'uygulamamizi_yakindan_taniyalim' ? (
                <Cpu className="w-4 h-4 text-blue-500" />
              ) : activeDoc.file.endsWith('.xls') || activeDoc.file.endsWith('.xlsx') ? (
                <FileSpreadsheet className="w-4 h-4 text-green-500" />
              ) : (
                <FileText className="w-4 h-4 text-blue-500" />
              )}
              {activeDoc.title}
            </h2>
            <div className="flex items-center gap-2">
              {activeDoc.id !== 'uygulamamizi_yakindan_taniyalim' && (
                <>
                  <a
                    href={activeDoc.file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Yeni Sekmede Aç / Dışarıda Görüntüle"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Dışarıda Aç
                  </a>
                  <a
                    href={activeDoc.file}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    İndir
                  </a>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 w-full h-full relative z-0 overflow-hidden bg-white dark:bg-slate-955">
            {activeDoc.id === 'uygulamamizi_yakindan_taniyalim' ? (
              <UygulamaRehberi />
            ) : activeDoc.id === 'dogrudan_temin_islem_sureci' ? (
              <DogrudanTeminSurecAkisi />
            ) : activeDoc.file.endsWith('.pdf') ? (
              <div className="p-4 w-full h-full">
                <iframe
                  src={`${activeDoc.file}#view=FitH`}
                  className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white"
                  title={activeDoc.title}
                />
              </div>
            ) : activeDoc.file.endsWith('.xls') || activeDoc.file.endsWith('.xlsx') ? (
              <ExcelViewer fileUrl={activeDoc.file} />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="flex flex-col items-center text-center max-w-sm">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-400">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {activeDoc.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-8">Önizleme desteklenmiyor.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
