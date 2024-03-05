// =============================================================================
// Project: WebGL Tomb Raider
// Configuration for the app
// =============================================================================

import { XYZ } from 'gsots3d'
import JSON5 from 'json5'

type AppConfig = {
  width: number
  aspectRatio: number

  gamma: number
  fullWidth: boolean
  smoothScale: boolean
  textureFilter: boolean

  drawDistance: number
  fov: number
  speed: number

  startLevel: string
  startPos: XYZ

  showLights: boolean

  lightConst: number
  lightQuad: number
  lightBright: number
}

// Global and exported config
export let config = {} as AppConfig

export async function loadConfig() {
  const configResp = await fetch('config.jsonc')
  const configText = await configResp.text()

  config = JSON5.parse(configText) as AppConfig
}
