export * from './types'
import { ProcessMapping } from './types'
import { IhtiyacListesiMapping } from './ihtiyac-listesi.mapping'
import { IhtiyacTalepFormuMapping } from './ihtiyac-talep-formu.mapping'
import { LuzumMuzekkeresiMapping } from './luzum-muzekkeresi.mapping'
import { LuzumOnayEkiMapping } from './luzum-muzekkeresi-onay-eki.mapping'
import { LuzumTeslimTesellumMapping } from './luzum-muzekkeresi-teslim-tesellum.mapping'
import { SonAlimFiyatCetveliMapping } from './son-alim-fiyat-cetveli.mapping'

export const processMappingRegistry: Record<string, ProcessMapping> = {
  '/dosya/hazirlik-ve-ihtiyac': IhtiyacListesiMapping,
  '/dosya/malzemeler/liste': IhtiyacListesiMapping,
  '/dosya/luzum/talep-formu': IhtiyacTalepFormuMapping,
  '/dosya/luzum/belge': LuzumMuzekkeresiMapping,
  '/dosya/luzum/onay-eki': LuzumOnayEkiMapping,
  '/dosya/luzum/teslim-tesellum': LuzumTeslimTesellumMapping,
  '/dosya/malzemeler/son-alim': SonAlimFiyatCetveliMapping
}

export function getDefaultMappingForProcess(processPath: string): ProcessMapping {
  return processMappingRegistry[processPath] || {}
}
