import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface TeminDosyasi {
  id: number
  temin_no: string
  konu: string
  birim_id: number | null
  tur: string
  yaklasik_maliyet: number
  butce_kodu: string | null
  temin_tarihi: string | null
  teslim_tarihi: string | null
  firma_id: number | null
  onay_personel_id: number | null
  hazirlayan_personel_id: number | null
  durum_asama_id: number | null
  mevzuat_id: number | null
  notlar: string | null
  fonksiyonel_kod: string | null
  ekonomik_kod: string | null
  created_at: string
}

const fetchDosyalar = async (): Promise<TeminDosyasi[]> => {
  const res = await window.electron.ipcRenderer.invoke(
    'db:query',
    'SELECT * FROM DATA_TeminDosyasi ORDER BY created_at DESC'
  )
  if (!res.success) throw new Error(res.error)
  return res.data
}

export function useDosyalarHooks() {
  const queryClient = useQueryClient()

  const { data: dosyalar = [], isLoading: isLoadingDosyalar } = useQuery({
    queryKey: ['temin_dosyalari'],
    queryFn: fetchDosyalar
  })

  const addDosyaMutation = useMutation({
    mutationFn: async (dosya: Partial<TeminDosyasi>) => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:run',
        `INSERT INTO DATA_TeminDosyasi (temin_no, konu, tur, yaklasik_maliyet, butce_kodu, notlar, fonksiyonel_kod, ekonomik_kod) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dosya.temin_no ?? '',
          dosya.konu || 'Yeni Dosya',
          dosya.tur || 'mal',
          dosya.yaklasik_maliyet ?? 0,
          dosya.butce_kodu ?? '',
          dosya.notlar ?? '',
          dosya.fonksiyonel_kod ?? '',
          dosya.ekonomik_kod ?? ''
        ]
      )
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['temin_dosyalari'] })
  })

  const updateDosyaMutation = useMutation({
    mutationFn: async (dosya: Partial<TeminDosyasi> & { id: number }) => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:run',
        `UPDATE DATA_TeminDosyasi SET 
          temin_no = ?, 
          konu = ?, 
          tur = ?, 
          yaklasik_maliyet = ?, 
          butce_kodu = ?, 
          notlar = ?,
          fonksiyonel_kod = ?,
          ekonomik_kod = ?,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          dosya.temin_no ?? '',
          dosya.konu ?? 'İsimsiz Dosya',
          dosya.tur ?? 'mal',
          dosya.yaklasik_maliyet ?? 0,
          dosya.butce_kodu ?? '',
          dosya.notlar ?? '',
          dosya.fonksiyonel_kod ?? '',
          dosya.ekonomik_kod ?? '',
          dosya.id
        ]
      )
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['temin_dosyalari'] })
  })

  const deleteDosyaMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:run',
        'DELETE FROM DATA_TeminDosyasi WHERE id = ?',
        [id]
      )
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['temin_dosyalari'] })
  })

  return {
    dosyalar,
    isLoadingDosyalar,
    addDosya: addDosyaMutation.mutateAsync,
    updateDosya: updateDosyaMutation.mutateAsync,
    deleteDosya: deleteDosyaMutation.mutateAsync
  }
}
