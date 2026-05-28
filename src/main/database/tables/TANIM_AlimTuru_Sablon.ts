export const TANIM_AlimTuru_Sablon = {
  name: 'TANIM_AlimTuru_Sablon',
  description: 'Alım türüne göre hangi şablonların kullanılacağı',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'alim_turu_id', type: 'INTEGER', notNull: true },
    { name: 'belge_adi', type: 'TEXT', notNull: true },
    { name: 'sablon_id', type: 'INTEGER' },
    { name: 'sira', type: 'INTEGER', notNull: true, default: 0 },
    { name: 'zorunlu', type: 'INTEGER', notNull: true, default: 1 }
  ],
  constraints: [
    "FOREIGN KEY(alim_turu_id) REFERENCES TANIM_AlimTuru(id) ON DELETE CASCADE",
    "FOREIGN KEY(sablon_id) REFERENCES TANIM_Sablon(id) ON DELETE RESTRICT",
    "UNIQUE(alim_turu_id, belge_adi)"
  ],
  initialData: []
}
