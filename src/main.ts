import './style.css'

import { Context } from 'gsots3d'
import { renderLevel } from './viewer'
import { config, loadConfig } from './config'

// Starts everything, called once the config is loaded
async function startApp() {
  let canvasStyle = ''
  canvasStyle += config.fullWidth ? 'width: 100%;' : ''
  canvasStyle += config.smoothScale ? '' : 'image-rendering: pixelated;'

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main>
  <div class="flexrow">
    <span class="title">Tomb Raider - Level Viewer</span>
    <select id="levelSelect">
      <option value="Tomb-Raider-1/01-Caves.PHD">01 Caves</option>
      <option value="Tomb-Raider-1/02-City-of-Vilcabamba.PHD">02 City of Vilcabamba</option>
      <option value="Tomb-Raider-1/03-The-Lost-Valley.PHD">03 The Lost Valley</option>
      <option value="Tomb-Raider-1/04-Tomb-of-Qualopec.PHD">04 Tomb of Qualopec</option>
      <option value="Tomb-Raider-1/05-St-Francis-Folly.PHD">05 St Francis' Folly</option>
      <option value="Tomb-Raider-1/06-Colosseum.PHD">06 Colosseum</option>
      <option value="Tomb-Raider-1/07-Palace-Midas.PHD">07 Palace Midas</option>
      <option value="Tomb-Raider-1/08-Cistern.PHD">08 The Cistern</option>
      <option value="Tomb-Raider-1/09-Tomb-of-Tihocan.PHD">09 Tomb of Tihocan</option>
      <option value="Tomb-Raider-1/10-City-of-Khamoon.PHD">10 City of Khamoon</option>
      <option value="Tomb-Raider-1/11-Obelisk-of-Khamoon.PHD">11 Obelisk of Khamoon</option>
      <option value="Tomb-Raider-1/12-Sanctuary-of-the-Scion.PHD">12 Sanctuary of the Scion</option>
      <option value="Tomb-Raider-1/13-Natlas-Mines.PHD">13 Natla's Mines</option>
      <option value="Tomb-Raider-1/14-Atlantis.PHD">14 Atlantis</option>
      <option value="Tomb-Raider-1/15-The-Great-Pyramid.PHD">15 The Great Pyramid</option>
      <option value="Tomb-Raider-1/00-Laras-Home.PHD">00 Laras Home</option>
    </select>
  </div>

  <canvas id="canvas" 
   width="${config.width}" 
   height="${config.width * config.aspectRatio}" 
   style="${canvasStyle}">
  </canvas>
</main>`

  const ctx = await Context.init()
  ctx.start()

  ctx.camera.far = config.drawDistance
  ctx.camera.fov = config.fov

  let globalLightAngle = 0
  let globalLightHeight = 1
  const camLight = ctx.createPointLight([0, 0, 0], [1, 1, 1], 3000)

  ctx.update = () => {
    // Light that follows the camera
    camLight.position = ctx.camera.position
    ctx.globalLight.direction = [Math.cos(globalLightAngle), -globalLightHeight, Math.sin(globalLightAngle)]
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === '1') globalLightAngle += 0.1
    if (e.key === '2') globalLightAngle -= 0.1
    if (e.key === '3') globalLightHeight -= 0.1
    if (e.key === '4') globalLightHeight += 0.1

    if (globalLightHeight < 0.1) globalLightHeight = 0.1
  })

  // Load the level when the select changes
  document.querySelector('#levelSelect')!.addEventListener('change', async (e) => {
    const levelName = (e.target as HTMLSelectElement).value
    renderLevel(ctx, levelName)
  })

  // Trigger the level select to load the first level
  document.querySelector('#levelSelect')!.dispatchEvent(new Event('change'))
}

// =============================================================================
// ENTRY POINT
// =============================================================================

await loadConfig()
startApp()
