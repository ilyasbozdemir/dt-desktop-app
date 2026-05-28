export const TANIM_Placeholder = {
  name: 'TANIM_Placeholder',
  description: 'Sistem genelinde kullanılabilen dinamik alanların tanımı',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'anahtar', type: 'TEXT', notNull: true, unique: true },
    { name: 'etiket', type: 'TEXT', notNull: true },
    { name: 'kaynak_tablo', type: 'TEXT' },
    { name: 'kaynak_sutun', type: 'TEXT' },
    { name: 'varsayilan', type: 'TEXT' },
    { name: 'aciklama', type: 'TEXT' },
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  initialData: [
    { anahtar: 'firma_adi', etiket: 'Firma Adı', kaynak_tablo: 'TANIM_Firma', kaynak_sutun: 'unvan', aciklama: 'Temin edilecek firmanın ticari ünvanı' },
    { anahtar: 'firma_vkn', etiket: 'Vergi No / TCKN', kaynak_tablo: 'TANIM_Firma', kaynak_sutun: 'vergi_no', aciklama: 'Firmanın vergi numarası' },
    { anahtar: 'tarih', etiket: 'İşlem Tarihi', aciklama: 'Belgenin oluşturulduğu tarih' },
    { anahtar: 'toplam_tutar', etiket: 'Toplam Tutar', kaynak_tablo: 'DATA_TeminDosyasi', kaynak_sutun: 'yaklasik_maliyet', aciklama: 'Dosyanın toplam tutarı' }
  ]
}
