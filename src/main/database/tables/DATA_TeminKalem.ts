export const DATA_TeminKalem = {
  name: 'DATA_TeminKalem',
  description: 'Dosyaya bağlı malzeme, hizmet veya yapım işi kalemleri',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'temin_dosya_id', type: 'INTEGER', notNull: true },
    { name: 'barkod_id', type: 'TEXT' },
    { name: 'tasinir_kodu', type: 'TEXT' },
    { name: 'okas_kodu', type: 'TEXT' },
    { name: 'kalem_adi', type: 'TEXT', notNull: true },
    { name: 'tipi', type: 'TEXT', notNull: true, default: "'Mal'" }, // Mal | Hizmet | Yapım | Danışmanlık
    { name: 'birim', type: 'TEXT', default: "'Adet'" },
    { name: 'miktar', type: 'REAL', notNull: true, default: 1 },
    { name: 'kdv_orani', type: 'REAL', default: 20 },
    { name: 'aciklama', type: 'TEXT' },
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  constraints: [
    'FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE CASCADE'
  ],
  initialData: []
}
