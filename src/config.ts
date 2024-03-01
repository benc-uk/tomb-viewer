import JSON5 from 'json5'

type AppConfig = {
  width: number
  aspectRatio: number
  fullWidth: boolean
  smoothScale: boolean
  textureFilter: boolean
  drawDistance: number
  fov: number
}

// Global and exported config
export let config = {} as AppConfig

export async function loadConfig() {
  const configResp = await fetch('config.jsonc')
  const configText = await configResp.text()
  config = JSON5.parse(configText) as AppConfig
}
