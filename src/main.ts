import './style.css'

import { parseLevel } from './lib/parser'
import { getLevelData } from './lib/file'
import { patchConsole } from './lib/utils'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main>
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

  <pre id="console"></pre>
  <div id="textures"></div>
</main>
`

patchConsole('#console')

document.querySelector('#levelSelect')!.addEventListener('change', async (e) => {
  document.querySelector('#textures')!.innerHTML = ''
  document.querySelector('#console')!.innerHTML = ''

  const levelName = (e.target as HTMLSelectElement).value
  const data = await getLevelData(levelName)
  console.log('Loading file: ' + levelName)

  try {
    const level = parseLevel(data)

    let totalVertices = 0
    for (const room of level.rooms) {
      // count vertices
      totalVertices += room.roomData.numVertices
    }

    console.log(`Level parsed successfully!
    • texTitles: ${level.textiles.length}
    • rooms: ${level.rooms.length}
    • totalVertices: ${totalVertices}`)
  } catch (e) {
    console.error('Error parsing level! Going to give up!')
    console.error(e)
  }
})

document.querySelector('#levelSelect')!.dispatchEvent(new Event('change'))
