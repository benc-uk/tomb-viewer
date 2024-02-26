import './style.css'

import { parseLevel } from './lib/parser'
import { getLevelData } from './lib/file'
import { textile8ToBuffer } from './lib/textures'

import { Context, Instance, Material, TextureCache } from 'gsots3d'

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

  <canvas id="canvas" width="800" height="600"></canvas>
  <div id="textures"></div>
</main>
`

const ctx = await Context.init()
ctx.globalLight.setAsPosition(50, 10, 300)
ctx.start()

document.querySelector('#levelSelect')!.addEventListener('change', async (e) => {
  document.querySelector('#textures')!.innerHTML = ''

  const levelName = (e.target as HTMLSelectElement).value
  const data = await getLevelData(levelName)
  console.log('Loading file: ' + levelName)

  try {
    const level = parseLevel(data)

    ctx.removeAllInstances()
    TextureCache.clear()

    const cubes = new Array<Instance>()

    console.log('Loaded level: ' + levelName)

    for (let i = 0; i < level.numTextiles; i++) {
      const t = level.textiles[i]
      const tb = textile8ToBuffer(t, level.palette)
      const m = Material.createBasicTexture(tb, true, false)
      const cube = ctx.createCubeInstance(m, 5)

      const x = (i % 4) * 7.5 - 11
      const y = 3 - Math.floor(i / 4) * 6 + 5
      cube.setPosition(x, y, 0)
      cubes.push(cube)
    }

    ctx.update = (delta: number) => {
      for (const cube of cubes) {
        cube.rotateY(0.9 * delta)
      }
    }
  } catch (e) {
    console.error('Error parsing level! Going to give up!')
    console.error(e)
  }
})

// Trigger the level select to load the first level
document.querySelector('#levelSelect')!.dispatchEvent(new Event('change'))
