// =============================================================================
// Project: WebGL Tomb Raider
// Main entry point for the app and HTML/JS initialization
// =============================================================================

import './style.css'

import { Context } from 'gsots3d'
import { buildWorld } from './builder'
import { config, loadConfig } from './config'

// Starts everything, called once the config is loaded
async function startApp() {
  let canvasStyle = ''
  canvasStyle += config.fullWidth ? 'width: 100%;' : ''
  canvasStyle += config.smoothScale ? '' : 'image-rendering: pixelated;'

  document.querySelector<HTMLCanvasElement>('#canvas')!.width = config.width
  document.querySelector<HTMLCanvasElement>('#canvas')!.height = config.width * config.aspectRatio
  document.querySelector<HTMLCanvasElement>('#canvas')!.style.cssText = canvasStyle

  // Main 3D graphics context, using GSOTS3D
  const ctx = await Context.init()
  ctx.start()

  ctx.camera.far = config.drawDistance
  ctx.camera.fov = config.fov
  ctx.gamma = config.gamma
  ctx.globalLight.ambient = [0.1, 0.1, 0.1]
  ctx.globalLight.enabled = false

  document.querySelector<HTMLInputElement>('#texFilt')!.checked = config.textureFilter
  document.querySelector<HTMLInputElement>('#texFilt')!.addEventListener('change', (e) => {
    config.textureFilter = (e.target as HTMLInputElement).checked

    // Reload the level to apply the change
    const level = document.querySelector<HTMLSelectElement>('#levelSelect')!.value
    buildWorld(ctx, level).catch((err) => {
      document.querySelector<HTMLDivElement>('#error')!.innerText = err
      document.querySelector<HTMLDivElement>('#error')!.style.display = 'block'
      document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
    })
  })
  document.querySelector<HTMLInputElement>('#showLights')!.checked = config.showLights
  document.querySelector<HTMLInputElement>('#showLights')!.addEventListener('change', (e) => {
    config.showLights = (e.target as HTMLInputElement).checked

    // Reload the level to apply the change
    const level = document.querySelector<HTMLSelectElement>('#levelSelect')!.value
    buildWorld(ctx, level).catch((err) => {
      document.querySelector<HTMLDivElement>('#error')!.innerText = err
      document.querySelector<HTMLDivElement>('#error')!.style.display = 'block'
      document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
    })
  })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'h') {
      document.querySelector<HTMLDivElement>('#help')!.style.display =
        document.querySelector<HTMLDivElement>('#help')!.style.display === 'none' ? 'block' : 'none'
    }

    if (e.key === 'p') {
      console.log(
        'Position: ' + Math.round(ctx.camera.position[0]) + ', ' + Math.round(ctx.camera.position[1]) + ', ' + Math.round(ctx.camera.position[2])
      )
    }
  })

  // Load the level when the select changes
  document.querySelector('#levelSelect')!.addEventListener('change', async (e) => {
    document.querySelector<HTMLDivElement>('#error')!.style.display = 'none'

    const level = (e.target as HTMLSelectElement).value
    if (!level) {
      return
    }

    window.location.hash = level
  })

  setTimeout(() => {
    document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
  }, 3000)

  window.addEventListener('hashchange', () => {
    const level = window.location.hash.slice(1)
    buildWorld(ctx, level).catch((err) => {
      document.querySelector<HTMLDivElement>('#error')!.innerText = err
      document.querySelector<HTMLDivElement>('#error')!.style.display = 'block'
      document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
    })
  })

  // On load read hash
  let level = window.location.hash.slice(1)
  if (!level) {
    window.location.hash = 'TR1/01-Caves.PHD'
    level = 'TR1/01-Caves.PHD'
  }
  document.querySelector<HTMLSelectElement>('#levelSelect')!.value = level
  buildWorld(ctx, level).catch((err) => {
    document.querySelector<HTMLDivElement>('#error')!.innerText = err
    document.querySelector<HTMLDivElement>('#error')!.style.display = 'block'
    document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
  })
}

// =============================================================================
// ENTRY POINT
// =============================================================================

await loadConfig()
startApp()
