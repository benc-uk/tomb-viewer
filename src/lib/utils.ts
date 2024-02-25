import { tr_palette, tr_textile8, tr_textile8_size } from './types'

/**
 * Saves a textile as a PNG image, and appends it to the #textures div
 * @param tex The textile to save
 * @param palette The palette to use
 */
export function saveTextileAsPNG(tex: tr_textile8, palette: tr_palette) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256

  const ctx = canvas.getContext('2d')!
  const imgData = ctx.createImageData(256, 256)

  for (let i = 0; i < tr_textile8_size; i++) {
    // Look up colour in the palette but it's 8 bit color so we need to multiply by 3
    const colour = palette[tex[i]]

    imgData.data[i * 4] = colour.r * 3
    imgData.data[i * 4 + 1] = colour.g * 3
    imgData.data[i * 4 + 2] = colour.b * 3
    imgData.data[i * 4 + 3] = 255
  }
  ctx.putImageData(imgData, 0, 0)

  const img = canvas.toDataURL('image/png')
  const imgEl = document.createElement('img')
  imgEl.src = img
  imgEl.style.border = '2px solid black'
  imgEl.style.margin = '5px'

  document.querySelector<HTMLDivElement>('#textures')!.appendChild(imgEl)
}

/**
 * Hack to redirect console.log to a div on the page
 * @param selector CSS selector for the div to redirect console.log to
 */
export function patchConsole(selector: string = '#console') {
  const logArea = document.querySelector(selector)!

  // Monkey patch console.log to write to the log area
  // eslint-disable-next-line
  console.log = function (...s: any) {
    for (const part of s) {
      logArea.textContent += part + ' '
    }

    logArea.textContent += '\n'
    logArea.scrollTop = logArea.scrollHeight
  }

  // eslint-disable-next-line
  console.error = function (s: any) {
    logArea.textContent += '💥 ' + s + '\n'
    logArea.scrollTop = logArea.scrollHeight
  }
}
