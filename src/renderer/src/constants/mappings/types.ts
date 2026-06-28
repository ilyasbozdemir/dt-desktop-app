export interface TableColumnMapping {
  tablo?: string
  sutun?: string
  iliskili_id?: string // Aktif dosya ID'sine (activeDosyaId) göre filtreleme yapılacak kolon adı (örn: 'temin_dosya_id' veya 'id')
  deger?: any // Tablodan çekmek yerine doğrudan kullanılacak sabit değer
  altEslestirme?: Record<string, string> // Liste/tablo verilerinde satır sütunlarını şablon değişkenleriyle eşleştirmek için (örn: { malzemeAdi: 'kalem_adi' })
  aciklama?: string
}

export interface ProcessMapping {
  [sablonDegiskeni: string]: TableColumnMapping
}
