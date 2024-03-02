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

  let globalLightAngle = 0
  let globalLightHeight = 1
  const camLight = ctx.createPointLight([0, 0, 0], [1, 1, 1], 10)

  // Aargh point lights are so bad at this scale
  camLight.quad = 0.000000000000000003
  camLight.constant = 1
  camLight.colour = [2, 2, 2]

  ctx.update = () => {
    // A light that follows the camera
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
    if (e.key === 'p') {
      console.log(
        'Position: ' + Math.round(ctx.camera.position[0]) + ', ' + Math.round(ctx.camera.position[1]) + ', ' + Math.round(ctx.camera.position[2])
      )
    }

    if (globalLightHeight < 0.1) {
      globalLightHeight = 0.1
    }
  })

  // Load the level when the select changes
  document.querySelector('#levelSelect')!.addEventListener('change', async (e) => {
    document.querySelector<HTMLDivElement>('#error')!.style.display = 'none'
    buildWorld(ctx, (e.target as HTMLSelectElement).value).catch((err) => {
      document.querySelector<HTMLDivElement>('#error')!.innerText = err
      document.querySelector<HTMLDivElement>('#error')!.style.display = 'block'
    })
  })

  buildWorld(ctx, config.startLevel ?? 'TR1/01-Caves.PHD').catch((err) => {
    document.querySelector<HTMLDivElement>('#error')!.innerText = err
    document.querySelector<HTMLDivElement>('#error')!.style.display = 'block'
  })

  setTimeout(() => {
    document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
  }, 3)
}

// =============================================================================
// ENTRY POINT
// =============================================================================

await loadConfig()
startApp()
