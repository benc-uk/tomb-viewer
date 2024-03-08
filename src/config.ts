// =============================================================================
// Project: WebGL Tomb Raider
// Configuration for the app
// =============================================================================

import { XYZ } from 'gsots3d'
import JSON5 from 'json5'

export type AppConfig = {
  width: number
  aspectRatio: number

  gamma: number
  ambient: number

  textureFilter: boolean

  drawDistance: number
  fov: number
  speed: number

  startPos?: XYZ

  lightConst: number
  lightQuad: number
  lightBright: number

  distanceThreshold: number
}

export async function loadConfig() {
  const configResp = await fetch('config.jsonc')
  const configText = await configResp.text()

  const config = JSON5.parse(configText) as AppConfig
  return config
}
