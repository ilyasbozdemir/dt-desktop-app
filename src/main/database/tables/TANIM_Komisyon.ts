export const TANIM_Komisyon = {
  name: 'TANIM_Komisyon',
  description: 'Kullanıcı tarafından oluşturulan bağımsız komisyonlar',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'tur_id', type: 'INTEGER', notNull: true }, // TANIM_KomisyonTuru
    { name: 'ad', type: 'TEXT', notNull: true }, // Örn: 2026 Yılı Fiyat Araştırma Komisyonu
    { name: 'aciklama', type: 'TEXT' },
    { name: 'aktif_mi', type: 'BOOLEAN', default: 1 },
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  constraints: [
    'FOREIGN KEY(tur_id) REFERENCES TANIM_KomisyonTuru(id) ON DELETE CASCADE'
  ],
  initialData: []
}
