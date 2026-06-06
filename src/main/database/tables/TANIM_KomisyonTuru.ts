export const TANIM_KomisyonTuru = {
  name: 'TANIM_KomisyonTuru',
  description: 'Sistemde tanımlı komisyon türleri (Örn: Fiyat Araştırma, Muayene ve Kabul)',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'ad', type: 'TEXT', notNull: true }, // Fiyat Araştırma Komisyonu
    { name: 'sablon_id', type: 'TEXT' }, // İleride üst yazı şablonlarına bağlanabilmesi için
    { name: 'aktif_mi', type: 'BOOLEAN', default: 1 },
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  constraints: [
    'UNIQUE(ad)'
  ],
  initialData: [
    { ad: 'Fiyat Araştırma Komisyonu' },
    { ad: 'Yaklaşık Maliyet Tespit Komisyonu' },
    { ad: 'Muayene ve Kabul Komisyonu' }
  ]
}
