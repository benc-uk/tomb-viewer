// =============================================================================
// Project: WebGL Tomb Raider
// Helpers for working with textures and textiles
// =============================================================================

import { textile16, textile8, textile8_size, textile16_size, colour, level, version } from './types'

/**
 * Return a tr_textile8 as a ArrayBuffer
 * See https://opentomb.github.io/TRosettaStone3/trosettastone.html#_palette
 * @param tex The textile to convert
 * @param palette The palette to use
 */
export function textile8ToBuffer(tex: textile8, palette: colour[]) {
  const buffer = new ArrayBuffer(256 * 256 * 4)
  const imgData = new Uint8Array(buffer)

  for (let i = 0; i < textile8_size; i++) {
    // Look up colour in the palette
    const colour = palette[tex[i]]

    let alpha = 255

    // TR1: Palette index 0 is transparent
    if (tex[i] === 0) {
      alpha = 0
    }

    // TR2+: magenta is transparent
    if (colour.r === 255 && colour.g === 0 && colour.b === 255) {
      alpha = 0
    }

    // Multiply by 3 as it's 8 bit colour or something
    imgData[i * 4] = colour.r * 3
    imgData[i * 4 + 1] = colour.g * 3
    imgData[i * 4 + 2] = colour.b * 3
    imgData[i * 4 + 3] = alpha
  }

  return imgData
}

/**
 * Return a tr_textile16 as a ArrayBuffer
 * See https://opentomb.github.io/TRosettaStone3/trosettastone.html#_palette
 * @param tex The textile16 to convert
 * @param palette16 The palette16 to use
 */
export function textile16ToBuffer(tex: textile16) {
  const buffer = new ArrayBuffer(256 * 256 * 4)
  const imgData = new Uint8Array(buffer)

  for (let i = 0; i < textile16_size; i++) {
    /* Each uint16_t represents a pixel whose colour is of the form ARGB, MSB-to-LSB:
      1-bit transparency (0 = transparent, 1 = opaque) (0x8000)
      5-bit red channel (0x7C00)
      5-bit green channel (0x03E0)
      5-bit blue channel (0x001F)
    */

    imgData[i * 4] = (tex[i] & 0x7c00) >> 7
    imgData[i * 4 + 1] = (tex[i] & 0x03e0) >> 2
    imgData[i * 4 + 2] = (tex[i] & 0x001f) << 3
    imgData[i * 4 + 3] = tex[i] & 0x8000 ? 255 : 0
  }

  return imgData
}

export function getRegionFromBuffer(srcBuffer: Uint8Array, offsetX: number, offsetY: number, width: number, height: number, srcWidth = 256) {
  const buffer = new ArrayBuffer(width * height * 4)
  const imgData = new Uint8Array(buffer)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIndex = ((y + offsetY) * srcWidth + (x + offsetX)) * 4
      const dstIndex = (y * width + x) * 4
      imgData[dstIndex] = srcBuffer[srcIndex]
      imgData[dstIndex + 1] = srcBuffer[srcIndex + 1]
      imgData[dstIndex + 2] = srcBuffer[srcIndex + 2]
      imgData[dstIndex + 3] = srcBuffer[srcIndex + 3]
    }
  }

  return imgData
}

// Used for debugging only
export function bufferToCanvas(buffer: ArrayBuffer, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')!
  const imgData = new ImageData(new Uint8ClampedArray(buffer), width, height)
  ctx.putImageData(imgData, 0, 0)

  return canvas
}

// Used for debugging only
export function debugTextiles(level: level) {
  document.body.style.overflow = 'auto'

  document.querySelectorAll('canvas')?.forEach((c) => c.remove())
  if (level.version === version.TR1) {
    for (let i = 0; i < level.textiles.length; i++) {
      const buffer = textile8ToBuffer(level.textiles[i], level.palette)
      const can = bufferToCanvas(buffer, 256, 256)
      document.body.prepend(can)
    }
  } else {
    for (let i = 0; i < level.textiles16.length; i++) {
      const buffer = textile16ToBuffer(level.textiles16[i])
      const can = bufferToCanvas(buffer, 256, 256)
      document.body.prepend(can)
    }
  }
}

// Used for debugging only
export function stringToImageBuffer(str: string) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = 256
  canvas.height = 128
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'orange'
  ctx.font = '140px monospace'
  ctx.fillText(str, 10, 100)
  return ctx.getImageData(0, 0, 256, 128).data
}
