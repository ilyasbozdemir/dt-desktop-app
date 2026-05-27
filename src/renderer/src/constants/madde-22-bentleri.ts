// =============================================
// 4734 SAYILI KAMU İHALE KANUNU - MADDE 22
// DOĞRUDAN TEMİN BENTLERİ
// =============================================

export const MADDE_22_BENTLERI = [
  {
    bent: 'a',
    kisaAd: 'Tek Kaynak (Tekel)',
    aciklama: 'İhtiyacın sadece gerçek veya tüzel tek kişi tarafından karşılanabilmesi',
    detay: 'Yed-i vahit belgesi veya tutanak ile tevsik edilmesi zorunludur.',
    parasal_limit: false
  },
  {
    bent: 'b',
    kisaAd: 'Özel Hak / Patent',
    aciklama: 'Sadece gerçek veya tüzel tek kişinin ihtiyaçla ilgili özel bir hakka sahip olması',
    detay:
      'Bilimsel, teknik, fikri veya sanatsal nedenlerle münhasır hak. Örn: bilimsel yayın, fikir eseri, belirli akademisyenden eğitim.',
    parasal_limit: false
  },
  {
    bent: 'c',
    kisaAd: 'Uyumluluk / Standardizasyon',
    aciklama:
      'Mevcut mal, ekipman, teknoloji veya hizmetlerle uyum ve standardizasyon için zorunlu mal/hizmet alımı',
    detay:
      'Asıl sözleşmeye dayalı, toplam süresi 3 yılı geçmeyecek şekilde ilk alım yapılan kişiden alınır. KİK022.0/M veya KİK021.0/H formu düzenlenir.',
    parasal_limit: false,
    sure_siniri: '3 yıl'
  },
  {
    bent: 'd',
    kisaAd: 'Parasal Limit',
    aciklama:
      'Belirlenen parasal limiti aşmayan mal/hizmet alımları ve yapım işleri ile temsil ağırlama kapsamında konaklama, seyahat ve iaşe alımları',
    detay:
      "KİK tarafından her yıl güncellenir. Yıllık toplam bütçe ödeneğinin %10'unu aşamaz (KİK onayı olmaksızın).",
    parasal_limit: true,
    limit_notu: 'KİK tarafından yıllık güncellenir',
    yuzde_siniri: '%10 ödenek sınırı'
  },
  {
    bent: 'e',
    kisaAd: 'Taşınmaz Alım / Kiralama',
    aciklama: 'İdarelerin ihtiyacına uygun taşınmaz mal alımı veya kiralanması',
    detay: 'Gerekçe, yer/özellik tespiti ve rayiç araştırması onay belgesine eklenir.',
    parasal_limit: false
  },
  {
    bent: 'f',
    kisaAd: 'Acil İlaç / Tıbbi Sarf',
    aciklama:
      'Özelliğinden dolayı stoklama imkânı bulunmayan ve acil durumlarda kullanılacak ilaç, tıbbi sarf malzemeleri ile test ve tetkik sarf malzemesi',
    detay: 'Stoklanamaz nitelik ve acil durum tevsik belgeleri harcama belgelerine eklenir.',
    parasal_limit: false
  },
  {
    bent: 'g',
    kisaAd: 'Milletlerarası Tahkim',
    aciklama:
      'Milletlerarası tahkim yoluyla çözülmesi öngörülen uyuşmazlıklarla ilgili davalarda Türk veya yabancı avukat/ortaklıklardan hizmet alımı',
    detay:
      'Yalnızca milletlerarası tahkim davalarına münhasırdır; diğer uyuşmazlık çözüm yollarında genel hükümler uygulanır.',
    parasal_limit: false
  },
  {
    bent: 'ğ',
    kisaAd: 'Savunma / Güvenlik (Gizli)',
    aciklama: 'Savunma, güvenlik veya istihbarat alanında gizlilik içeren ihtiyaçlar',
    detay: 'İlgili mevzuat kapsamında değerlendirilir.',
    parasal_limit: false
  },
  {
    bent: 'h',
    kisaAd: 'Sözleşme Feshi Sonrası Acil',
    aciklama:
      'Sözleşmenin feshedilmesi veya sözleşme yapılamaması halinde işin acilen bitirilmesinin zorunlu olması',
    detay: 'Fesih/iptal kararının ardından geçici tedbir niteliğindedir.',
    parasal_limit: false
  },
  {
    bent: 'ı',
    kisaAd: 'Türkiye İş Kurumu',
    aciklama:
      "Türkiye İş Kurumu'nun 4904 sayılı Kanun kapsamındaki görevlerine ilişkin hizmet alımları ile İşsizlik Sigortası Kanunu kapsamındaki hizmet alımları",
    detay: 'Yalnızca İŞKUR için geçerlidir.',
    parasal_limit: false
  },
  {
    bent: 'i',
    kisaAd: 'Seçim Malzemesi',
    aciklama:
      'Seçim yenilenmesi veya ara seçim kararında YSK tarafından yapılacak filigranlı oy pusulası/zarfı kağıdı alımı ve oy pusulası basım hizmeti',
    detay:
      'Mahalli seçimlerde İl Seçim Kurulu başkanlıkları tarafından alınan oy pusulası basım hizmeti dahildir.',
    parasal_limit: false
  }
]

export const MADDE_3_ISTISNA_BENTLERI = [
  {
    bent: 'a',
    kisaAd: 'Tarım ve Hayvancılık',
    aciklama:
      'Doğrudan üreticilerden yapılan tarım veya hayvancılıkla ilgili ürün alımları ile Orman Kanunu kapsamındaki orman köyleri kooperatif ve köylülerinden hizmet alımları',
    detay:
      'Orman kooperatifleri veya orman köylülerinin iş gücü alımları ile tarımsal ürünlerin işlenmesi/satışı bu kapsamdadır.'
  },
  {
    bent: 'b',
    kisaAd: 'Savunma, Güvenlik ve İstihbarat',
    aciklama:
      'Savunma, güvenlik veya istihbarat alanları ile ilişkili olan ya da gizlilik içinde yürütülmesi gerektiğine idarece karar verilen mal, hizmet ve yapım alımları',
    detay: 'İlgili bakanlık veya idarenin gizlilik kararı onay belgesine eklenir.'
  },
  {
    bent: 'c',
    kisaAd: 'Uluslararası Anlaşmalar (Dış Finansman)',
    aciklama:
      'Uluslararası anlaşmalar gereğince sağlanan dış finansman ile yaptırılacak ve anlaşmasında farklı ihale usulleri belirlenmiş alımlar',
    detay: 'Dış finansman anlaşmasında yer alan özel şartlar ve usuller uygulanır.'
  },
  {
    bent: 'd',
    kisaAd: 'Yabancı Ülkelerdeki Kuruluşlar',
    aciklama: 'İdarelerin yabancı ülkelerdeki kuruluşlarının mal veya hizmet alımları',
    detay: 'Yurtdışı temsilcilikleri, ataşelikler vb. dış teşkilat alımları için geçerlidir.'
  },
  {
    bent: 'e',
    kisaAd: 'Kamu Kurumları Üretimleri (İşyurtları / DMO)',
    aciklama:
      'Ceza infaz kurumları işyurtları, DMO, döner sermaye işletmeleri vb. kuruluşların kendi ürettikleri veya ithal ettikleri mal ve hizmet alımları',
    detay:
      'Adalet Bakanlığı İşyurtları, Devlet Malzeme Ofisi (DMO) vb. kamu üretim tesislerinden doğrudan alımları kapsar.'
  },
  {
    bent: 'f',
    kisaAd: 'Ar-Ge ve Bilimsel Araştırma Projeleri',
    aciklama:
      'Ulusal araştırma-geliştirme kurumlarının yürüttüğü ve desteklediği Ar-Ge projeleri için gerekli olan mal ve hizmet alımları',
    detay:
      'BAP (Bilimsel Araştırma Projeleri), TÜBİTAK vb. Ar-Ge projeleri kapsamındaki alımlar bu kapsamda yürütülür.'
  },
  {
    bent: 'g',
    kisaAd: 'Ticari ve Sınai Faaliyet Alımları',
    aciklama:
      'Kuruluş amaçlarına uygun olarak yürüttükleri ticari ve sınai faaliyetleri ile sınırlı mal ve hizmet alımları',
    detay:
      'İktisadi işletmeler, belediye şirketleri vb. ticari faaliyetlerine yönelik alımları kapsar. KİK tarafından belirlenen parasal limitler ve esaslar uygulanır.'
  },
  {
    bent: 'h',
    kisaAd: 'Kültür ve Sanat Faaliyetleri',
    aciklama:
      'Kültür ve sanat varlıklarının korunması, restorasyonu veya sanatsal faaliyetlerin yürütülmesi için gereken alımlar',
    detay: 'Kültür Bakanlığı, müzeler, restorasyon işleri vb. kültürel alımları kapsar.'
  }
]

// Uygulamada en sık kullanılan bentler (belediyeler için)
export const SIKKULLANILANLAR = ['d', 'e', 'f', 'c']
