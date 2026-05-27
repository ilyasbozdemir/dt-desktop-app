import React, { useState } from 'react'
import { usePersonelHooks, Personel } from './personel.hooks'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Plus, Edit, Trash2, X, Users, CheckCircle, Shield } from 'lucide-react'

export default function PersonelScreen(): React.ReactNode {
  const { personelList, isLoading, addPersonel, updatePersonel, deletePersonel } =
    usePersonelHooks()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPersonel, setEditingPersonel] = useState<Personel | null>(null)

  const [formData, setFormData] = useState<Partial<Personel>>({
    ad_soyad: '',
    unvan: '',
    birim: '',
    telefon: '',
    eposta: '',
    ihale_yetkilisi_mi: 0,
    harcama_yetkilisi_mi: 0,
    aktif_mi: 1
  })

  const openModal = (personel?: Personel): void => {
    if (personel) {
      setEditingPersonel(personel)
      setFormData(personel)
    } else {
      setEditingPersonel(null)
      setFormData({
        ad_soyad: '',
        unvan: '',
        birim: '',
        telefon: '',
        eposta: '',
        ihale_yetkilisi_mi: 0,
        harcama_yetkilisi_mi: 0,
        aktif_mi: 1
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = (): void => {
    setIsModalOpen(false)
    setEditingPersonel(null)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      if (editingPersonel) {
        await updatePersonel({ ...formData, id: editingPersonel.id })
      } else {
        await addPersonel(formData)
      }
      closeModal()
    } catch (err) {
      console.error(err)
      alert('Kayıt sırasında bir hata oluştu!')
    }
  }

  const handleDelete = async (id: number): Promise<void> => {
    if (confirm('Bu personeli silmek istediğinize emin misiniz?')) {
      try {
        await deletePersonel(id)
      } catch (err) {
        console.error(err)
        alert('Silme sırasında bir hata oluştu!')
      }
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Personel Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Kurum personelini buradan ekleyebilir ve yetkilerini belirleyebilirsiniz.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Yeni Personel Ekle
        </Button>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Yükleniyor...</div>
        ) : personelList.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <Users className="w-16 h-16 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground">Henüz Personel Eklenmemiş</h3>
            <p className="text-sm mt-1">
              Süreçlerde görev alacak personeli hemen eklemeye başlayın.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Ad Soyad</th>
                  <th className="px-6 py-4 font-semibold">Görev / Birim</th>
                  <th className="px-6 py-4 font-semibold">İletişim</th>
                  <th className="px-6 py-4 font-semibold text-center">Yetkiler</th>
                  <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {personelList.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                          {p.ad_soyad.slice(0, 2)}
                        </div>
                        {p.ad_soyad}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{p.unvan || '-'}</span>
                        <span className="text-xs text-muted-foreground">{p.birim || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                        <span>{p.telefon || '-'}</span>
                        <span className="text-muted-foreground">{p.eposta || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        {p.ihale_yetkilisi_mi === 1 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                            <Shield className="w-3 h-3" /> İhale Yetk.
                          </span>
                        )}
                        {p.harcama_yetkilisi_mi === 1 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle className="w-3 h-3" /> Harcama Yetk.
                          </span>
                        )}
                        {p.ihale_yetkilisi_mi === 0 && p.harcama_yetkilisi_mi === 0 && (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          title="Düzenle"
                          variant="outline"
                          size="sm"
                          onClick={() => openModal(p)}
                          className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          title="Sil"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                          className="h-8 px-2 hover:bg-red-50 hover:text-red-600 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b bg-muted/30">
              <h2 className="text-xl font-semibold">
                {editingPersonel ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Ad Soyad *</label>
                  <Input
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={formData.ad_soyad}
                    onChange={(e) => setFormData({ ...formData, ad_soyad: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Unvan / Görevi</label>
                  <Input
                    placeholder="Örn: İnşaat Mühendisi"
                    value={formData.unvan || ''}
                    onChange={(e) => setFormData({ ...formData, unvan: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Birim / Müdürlük</label>
                  <Input
                    placeholder="Örn: Fen İşleri"
                    value={formData.birim || ''}
                    onChange={(e) => setFormData({ ...formData, birim: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <Input
                    placeholder="Örn: 0555..."
                    value={formData.telefon || ''}
                    onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">E-Posta</label>
                  <Input
                    type="email"
                    placeholder="Örn: ornek@kurum.gov.tr"
                    value={formData.eposta || ''}
                    onChange={(e) => setFormData({ ...formData, eposta: e.target.value })}
                  />
                </div>

                <div className="col-span-2 p-4 bg-muted/30 rounded-xl border flex flex-col gap-4 mt-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" /> Yetkilendirme
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 bg-background border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        checked={formData.ihale_yetkilisi_mi === 1}
                        onChange={(e) =>
                          setFormData({ ...formData, ihale_yetkilisi_mi: e.target.checked ? 1 : 0 })
                        }
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">İhale Yetkilisi</span>
                        <span className="text-[10px] text-muted-foreground">
                          İhale / alım onay yetkisi.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-background border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        checked={formData.harcama_yetkilisi_mi === 1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            harcama_yetkilisi_mi: e.target.checked ? 1 : 0
                          })
                        }
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Harcama Yetkilisi</span>
                        <span className="text-[10px] text-muted-foreground">
                          Ödenek / bütçe kullanma yetkisi.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <Button type="button" variant="outline" onClick={closeModal}>
                  İptal
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingPersonel ? 'Değişiklikleri Kaydet' : 'Personeli Ekle'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
