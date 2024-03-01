import './style.css'

import { Context } from 'gsots3d'
import { loadLevelToWorld } from './viewer'
import { config, loadConfig } from './config'

// Starts everything, called once the config is loaded
async function startApp() {
  let canvasStyle = ''
  canvasStyle += config.fullWidth ? 'width: 100%;' : ''
  canvasStyle += config.smoothScale ? '' : 'image-rendering: pixelated;'

  document.querySelector<HTMLCanvasElement>('#canvas')!.width = config.width
  document.querySelector<HTMLCanvasElement>('#canvas')!.height = config.width * config.aspectRatio
  document.querySelector<HTMLCanvasElement>('#canvas')!.style.cssText = canvasStyle

  // Main graphics context
  const ctx = await Context.init()
  ctx.start()

  ctx.camera.far = config.drawDistance
  ctx.camera.fov = config.fov
  ctx.gamma = config.gamma

  let globalLightAngle = 0
  let globalLightHeight = 1
  const camLight = ctx.createPointLight([0, 0, 0], [1, 1, 1], 1000)

  ctx.update = () => {
    // Light that follows the camera
    camLight.position = ctx.camera.position
    ctx.globalLight.direction = [Math.cos(globalLightAngle), -globalLightHeight, Math.sin(globalLightAngle)]
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
      globalLightAngle += 0.1
    }
    if (e.key === '2') {
      globalLightAngle -= 0.1
    }
    if (e.key === '3') {
      globalLightHeight -= 0.03
    }
    if (e.key === '4') {
      globalLightHeight += 0.03
    }
    if (e.key === 'h') {
      document.querySelector<HTMLDivElement>('#help')!.style.display =
        document.querySelector<HTMLDivElement>('#help')!.style.display === 'none' ? 'block' : 'none'
    }

    if (globalLightHeight < 0.1) {
      globalLightHeight = 0.1
    }
  })

  // Load the level when the select changes
  document.querySelector('#levelSelect')!.addEventListener('change', async (e) => {
    loadLevelToWorld(ctx, (e.target as HTMLSelectElement).value)
  })

  loadLevelToWorld(ctx, 'TR1/01-Caves.PHD')

  setTimeout(() => {
    document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
  }, 3000)
}

// =============================================================================
// ENTRY POINT
// =============================================================================

await loadConfig()
startApp()
