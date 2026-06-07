export const TANIM_Komisyon_Sablon = {
  name: 'TANIM_Komisyon_Sablon',
  description: 'Komisyonlara atanmış şablonlar (Belge çıktıları vb. için)',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'komisyon_id', type: 'INTEGER', notNull: true },
    { name: 'sablon_id', type: 'INTEGER', notNull: true },
    { name: 'belge_turu', type: 'TEXT' },
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  constraints: [
    'FOREIGN KEY(komisyon_id) REFERENCES TANIM_Komisyon(id) ON DELETE CASCADE',
    'FOREIGN KEY(sablon_id) REFERENCES TANIM_Sablon(id) ON DELETE CASCADE'
  ],
  initialData: []
}
