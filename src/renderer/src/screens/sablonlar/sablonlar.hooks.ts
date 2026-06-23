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
  kategori: string | null
  test_verisi: string | null
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
        'SELECT * FROM TANIM_Sablon WHERE id IN (SELECT MAX(id) FROM TANIM_Sablon WHERE aktif_mi = 1 GROUP BY COALESCE(parent_id, id)) ORDER BY id DESC'
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
      test_verisi,
      oldSablon,
      extractedPlaceholders
    }: {
      ad: string
      dosya_adi: string
      dosya_turu: string
      icerik: string
      aciklama: string
      test_verisi?: string | null
      oldSablon?: Sablon
      extractedPlaceholders: Placeholder[]
    }) => {
      const isUpdate = !!oldSablon

      if (isUpdate) {
        const parent_id = oldSablon.parent_id || oldSablon.id

        // Deactivate all active templates of the same family
        await window.electron.ipcRenderer.invoke(
          'db:run',
          'UPDATE TANIM_Sablon SET aktif_mi = 0 WHERE (id = ? OR parent_id = ?) AND aktif_mi = 1',
          [parent_id, parent_id]
        )

        // Insert new version
        const insertRes = await window.electron.ipcRenderer.invoke(
          'db:run',
          `INSERT INTO TANIM_Sablon (ad, dosya_adi, dosya_turu, icerik, aciklama, test_verisi, aktif_mi, parent_id, versiyon)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?, (SELECT COALESCE(MAX(versiyon), 0) + 1 FROM TANIM_Sablon WHERE id = ? OR parent_id = ?))`,
          [ad, dosya_adi, dosya_turu, icerik, aciklama, test_verisi || null, parent_id, parent_id, parent_id]
        )
        if (insertRes.error) throw new Error(insertRes.error)
        const newSablonId = insertRes.lastID

        // Copy/insert placeholders for the new version
        for (const p of extractedPlaceholders) {
          await window.electron.ipcRenderer.invoke(
            'db:run',
            'INSERT INTO SABLON_Placeholder (sablon_id, placeholder_id) VALUES (?, ?)',
            [newSablonId, p.id]
          )
        }

        // Update active configuration mappings to point to the new sablon_id
        await window.electron.ipcRenderer.invoke(
          'db:run',
          'UPDATE TANIM_Komisyon_Sablon SET sablon_id = ? WHERE sablon_id = ?',
          [newSablonId, oldSablon.id]
        )

        await window.electron.ipcRenderer.invoke(
          'db:run',
          'UPDATE TANIM_AlimTuru_Sablon SET sablon_id = ? WHERE sablon_id = ?',
          [newSablonId, oldSablon.id]
        )

        return newSablonId
      } else {
        // Insert new fresh template (v1)
        const insertRes = await window.electron.ipcRenderer.invoke(
          'db:run',
          `INSERT INTO TANIM_Sablon (ad, dosya_adi, dosya_turu, icerik, aciklama, test_verisi, aktif_mi, parent_id, versiyon)
           VALUES (?, ?, ?, ?, ?, ?, 1, NULL, 1)`,
          [ad, dosya_adi, dosya_turu, icerik, aciklama, test_verisi || null]
        )
        if (insertRes.error) throw new Error(insertRes.error)
        const newSablonId = insertRes.lastID

        for (const p of extractedPlaceholders) {
          await window.electron.ipcRenderer.invoke(
            'db:run',
            'INSERT INTO SABLON_Placeholder (sablon_id, placeholder_id) VALUES (?, ?)',
            [newSablonId, p.id]
          )
        }
        return newSablonId
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sablonlar'] })
    }
  })
}

export function useDeleteSablon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:run',
        'DELETE FROM TANIM_Sablon WHERE id = ?',
        [id]
      )
      if (res.error) throw new Error(res.error)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sablonlar'] })
    }
  })
}
