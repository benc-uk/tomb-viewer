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

  // const camLight = ctx.createPointLight([0, 0, 0], [1, 1, 1], 0)
  // ctx.globalLight.setAsPosition(60000, 60000, 0)
  ctx.globalLight.ambient = [0.01, 0.01, 0.01]
  ctx.globalLight.enabled = false

  // Aargh point lights are so bad at this scale
  // camLight.quad = 0.0000003
  // camLight.constant = 0.3
  // camLight.linear = 0.0000003

  // ctx.update = () => {
  //   // A light that follows the camera
  //   camLight.position = ctx.camera.position
  // }

  window.addEventListener('keydown', (e) => {
    // if (e.key === '1') {
    //   globalLightAngle += 0.1
    // }
    // if (e.key === '2') {
    //   globalLightAngle -= 0.1
    // }
    // if (e.key === '3') {
    //   globalLightHeight -= 0.03
    // }
    // if (e.key === '4') {
    //   globalLightHeight += 0.03
    // }
    if (e.key === 'h') {
      document.querySelector<HTMLDivElement>('#help')!.style.display =
        document.querySelector<HTMLDivElement>('#help')!.style.display === 'none' ? 'block' : 'none'
    }
    if (e.key === 'p') {
      console.log(
        'Position: ' + Math.round(ctx.camera.position[0]) + ', ' + Math.round(ctx.camera.position[1]) + ', ' + Math.round(ctx.camera.position[2])
      )
    }

    // if (globalLightHeight < 0.1) {
    //   globalLightHeight = 0.1
    // }
  })

  // Load the level when the select changes
  document.querySelector('#levelSelect')!.addEventListener('change', async (e) => {
    document.querySelector<HTMLDivElement>('#error')!.style.display = 'none'

    const level = (e.target as HTMLSelectElement).value
    if (!level) {
      return
    }

    console.clear()
    buildWorld(ctx, level).catch((err) => {
      document.querySelector<HTMLDivElement>('#error')!.innerText = err
      document.querySelector<HTMLDivElement>('#error')!.style.display = 'block'
      document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
    })
  })

  buildWorld(ctx, config.startLevel ?? 'TR1/01-Caves.PHD').catch((err) => {
    document.querySelector<HTMLDivElement>('#error')!.innerText = err
    document.querySelector<HTMLDivElement>('#error')!.style.display = 'block'
    document.querySelector<HTMLDivElement>('#help')!.style.display = 'none'
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
