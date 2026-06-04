export const DATA_TeminKomisyon = {
  name: 'DATA_TeminKomisyon',
  description: 'Dosyada görevlendirilen komisyon üyeleri',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'temin_dosya_id', type: 'INTEGER', notNull: true },
    { name: 'personel_id', type: 'INTEGER', notNull: true },
    { name: 'komisyon_turu', type: 'TEXT', notNull: true }, // Fiyat Araştırma | Muayene Kabul
    { name: 'gorevi', type: 'TEXT', notNull: true, default: "'Üye'" }, // Başkan | Üye | Yedek Üye
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  constraints: [
    'FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE CASCADE',
    'FOREIGN KEY(personel_id) REFERENCES TANIM_Personel(id) ON DELETE CASCADE'
  ],
  initialData: []
}
