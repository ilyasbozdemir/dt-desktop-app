import React from 'react'
import { PlaceholderYonetimi } from './components/PlaceholderYonetimi'

export default function DegiskenlerScreen(): React.JSX.Element {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300 p-6">
      <div className="flex-1 overflow-y-auto">
        <PlaceholderYonetimi />
      </div>
    </div>
  )
}
