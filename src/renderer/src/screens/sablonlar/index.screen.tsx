import React, { useState } from 'react'
import { SablonListesi } from './components/SablonListesi'
import { SablonEditor } from './components/SablonEditor'
import { Sablon } from './sablonlar.hooks'

export default function SablonlarScreen(): React.JSX.Element {
  const [editingSablon, setEditingSablon] = useState<Sablon | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = (sablon: Sablon) => {
    setEditingSablon(sablon)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingSablon(null)
    setIsEditing(true)
  }

  const handleBack = () => {
    setEditingSablon(null)
    setIsEditing(false)
  }

  if (isEditing) {
    return <SablonEditor sablon={editingSablon || undefined} onBack={handleBack} />
  }

  return <SablonListesi onEdit={handleEdit} onCreate={handleCreate} />
}
