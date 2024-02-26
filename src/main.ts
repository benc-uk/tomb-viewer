import './style.css'

import { Context } from 'gsots3d'
import { renderLevel } from './viewer'

const canvasWidth = 1024
const canvasHeight = canvasWidth * (9 / 16)

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
    </select>
  </div>

  <canvas id="canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
  <div id="textures"></div>
</main>
`

const ctx = await Context.init()
ctx.start()
ctx.camera.enableFPControls(0, -0.2, 0.002, 25)
ctx.camera.far = 80000
ctx.camera.position = [800, 400, 4060]
ctx.globalLight.setAsPosition(1000, 1000, 0)

// HACK: Temporary
ctx.disableCulling = true

const l = ctx.createPointLight([0, 0, 0], [1, 1, 1], 100)
ctx.update = () => {
  l.position = ctx.camera.position
}

document.querySelector('#levelSelect')!.addEventListener('change', async (e) => {
  document.querySelector('#textures')!.innerHTML = ''

  const levelName = (e.target as HTMLSelectElement).value
  renderLevel(ctx, levelName)
})

// Trigger the level select to load the first level
document.querySelector('#levelSelect')!.dispatchEvent(new Event('change'))
