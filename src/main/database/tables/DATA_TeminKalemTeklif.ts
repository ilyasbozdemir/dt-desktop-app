export const DATA_TeminKalemTeklif = {
  name: 'DATA_TeminKalemTeklif',
  description: 'İstekli firmaların her bir kaleme verdiği teklif fiyatları',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'temin_dosya_id', type: 'INTEGER', notNull: true },
    { name: 'temin_kalem_id', type: 'INTEGER', notNull: true },
    { name: 'temin_firma_id', type: 'INTEGER', notNull: true },
    { name: 'birim_fiyat', type: 'REAL', notNull: true, default: 0 },
    { name: 'kdv_tutari', type: 'REAL', default: 0 },
    { name: 'teklif_verildi_mi', type: 'INTEGER', default: 1 },
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  constraints: [
    'FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE CASCADE',
    'FOREIGN KEY(temin_kalem_id) REFERENCES DATA_TeminKalem(id) ON DELETE CASCADE',
    'FOREIGN KEY(temin_firma_id) REFERENCES DATA_TeminFirma(id) ON DELETE CASCADE'
  ],
  initialData: []
}
