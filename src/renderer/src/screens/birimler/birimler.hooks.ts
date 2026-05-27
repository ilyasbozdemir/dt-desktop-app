import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Birim {
  id: number
  birim_adi: string
  aktif_mi: number
}

const fetchBirimler = async (): Promise<Birim[]> => {
  const res = await window.electron.ipcRenderer.invoke(
    'db:query',
    'SELECT * FROM TANIM_Birim ORDER BY birim_adi ASC'
  )
  if (!res.success) throw new Error(res.error)
  return res.data
}

export function useBirimlerHooks() {
  const queryClient = useQueryClient()

  const { data: birimler = [], isLoading: isLoadingBirimler } = useQuery({
    queryKey: ['birimler'],
    queryFn: fetchBirimler
  })

  const addBirimMutation = useMutation({
    mutationFn: async (birim_adi: string) => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:run',
        'INSERT INTO TANIM_Birim (birim_adi, aktif_mi) VALUES (?, 1)',
        [birim_adi]
      )
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['birimler'] })
  })

  const deleteBirimMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await window.electron.ipcRenderer.invoke(
        'db:run',
        'DELETE FROM TANIM_Birim WHERE id = ?',
        [id]
      )
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['birimler'] })
  })

  return {
    birimler,
    isLoadingBirimler,
    addBirim: addBirimMutation.mutateAsync,
    deleteBirim: deleteBirimMutation.mutateAsync
  }
}
