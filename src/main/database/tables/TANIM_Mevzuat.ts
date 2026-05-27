export const TANIM_Mevzuat = {
  name: 'TANIM_Mevzuat',
  description: 'Yıllara göre Doğrudan Temin parasal limitleri ve geçerli vergi oranları',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'yil', type: 'INTEGER', notNull: true, unique: true },
    { name: 'limit_buyuksehir', type: 'REAL', notNull: true, default: 0 },
    { name: 'limit_diger', type: 'REAL', notNull: true, default: 0 },
    { name: 'kdv_oran_1', type: 'REAL', notNull: true, default: 1 },
    { name: 'kdv_oran_2', type: 'REAL', notNull: true, default: 10 },
    { name: 'kdv_oran_3', type: 'REAL', notNull: true, default: 20 },
    { name: 'damga_vergisi_orani', type: 'REAL', notNull: true, default: 9.48 },
    { name: 'karar_pulu_orani', type: 'REAL', notNull: true, default: 5.69 },
    { name: 'aktif_mi', type: 'BOOLEAN', notNull: true, default: 0 },
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  initialData: [
    {
      yil: 2026,
      limit_buyuksehir: 1_021_827.0,
      limit_diger: 340_391.0,
      kdv_oran_1: 1,
      kdv_oran_2: 10,
      kdv_oran_3: 20,
      damga_vergisi_orani: 9.48,
      karar_pulu_orani: 5.69,
      aktif_mi: 1
    }
  ]
}
