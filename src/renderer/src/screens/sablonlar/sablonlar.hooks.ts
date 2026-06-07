import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Sablon {
  id: number
  ad: string
  dosya_adi: string
  dosya_turu: string
  icerik: string // Stored as text/html
  aciklama: string | null
  aktif_mi: number
  parent_id: number | null
  versiyon: number
  created_at: string
  updated_at: string
}

export interface Placeholder {
  id: number
  anahtar: string
  etiket: string
  kaynak_tablo: string | null
  kaynak_sutun: string | null
  varsayilan: string | null
  aciklama: string | null
}

export function useSablonlar() {
  return useQuery({
    queryKey: ['sablonlar'],
    queryFn: async () => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:query',
        'SELECT * FROM TANIM_Sablon WHERE aktif_mi = 1 ORDER BY id DESC'
      )
      if (res.error) throw new Error(res.error)
      return res.data as Sablon[]
    }
  })
}

export function useSablonHistory(parentId: number | null) {
  return useQuery({
    queryKey: ['sablonlar', 'history', parentId],
    queryFn: async () => {
      if (!parentId) return []
      const res = await window.electron.ipcRenderer.invoke(
        'db:query',
        'SELECT * FROM TANIM_Sablon WHERE id = ? OR parent_id = ? ORDER BY versiyon DESC',
        [parentId, parentId]
      )
      if (res.error) throw new Error(res.error)
      return res.data as Sablon[]
    },
    enabled: !!parentId
  })
}

export function usePlaceholders() {
  return useQuery({
    queryKey: ['placeholders'],
    queryFn: async () => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:query',
        'SELECT * FROM TANIM_Placeholder ORDER BY etiket ASC'
      )
      if (res.error) throw new Error(res.error)
      return res.data as Placeholder[]
    }
  })
}

export function useSaveSablon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      ad,
      dosya_adi,
      dosya_turu,
      icerik,
      aciklama,
      oldSablon,
      extractedPlaceholders
    }: {
      ad: string
      dosya_adi: string
      dosya_turu: string
      icerik: string
      aciklama: string
      oldSablon?: Sablon
      extractedPlaceholders: Placeholder[]
    }) => {
      const isUpdate = !!oldSablon
      const parent_id = isUpdate ? (oldSablon.parent_id || oldSablon.id) : null
      const versiyon = isUpdate ? oldSablon.versiyon + 1 : 1

      const queries: { sql: string; params: any[] }[] = []

      // Deactivate old version if it's an update
      if (isUpdate) {
        queries.push({
          sql: 'UPDATE TANIM_Sablon SET aktif_mi = 0 WHERE id = ?',
          params: [oldSablon.id]
        })
      }

      // We cannot easily get the newly inserted ID inside a transaction using pure db:transaction
      // unless the backend returns it. Let's do it manually via single db:run calls or update the transaction logic.
      // Wait, db:transaction doesn't return the last inserted ID.
      // So we will execute them sequentially for now, or just use db:run then db:run.

      const insertRes = await window.electron.ipcRenderer.invoke(
        'db:run',
        `INSERT INTO TANIM_Sablon (ad, dosya_adi, dosya_turu, icerik, aciklama, aktif_mi, parent_id, versiyon)
         VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
        [ad, dosya_adi, dosya_turu, icerik, aciklama, parent_id, versiyon]
      )

      if (insertRes.error) throw new Error(insertRes.error)

      const newSablonId = insertRes.lastID

      // Insert mappings for extracted placeholders
      for (const p of extractedPlaceholders) {
        await window.electron.ipcRenderer.invoke(
          'db:run',
          'INSERT INTO SABLON_Placeholder (sablon_id, placeholder_id) VALUES (?, ?)',
          [newSablonId, p.id]
        )
      }

      return newSablonId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sablonlar'] })
    }
  })
}
