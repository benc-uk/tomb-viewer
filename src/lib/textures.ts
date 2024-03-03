import { tr_palette, tr_textile8, tr_textile8_size } from './types'

/**
 * Return a tr_textile8 as a ArrayBuffer
 * See https://opentomb.github.io/TRosettaStone3/trosettastone.html#_palette
 * @param tex The textile to convert
 * @param palette The palette to use
 */
export function textile8ToBuffer(tex: tr_textile8, palette: tr_palette) {
  const buffer = new ArrayBuffer(256 * 256 * 4)
  const imgData = new Uint8Array(buffer)

  for (let i = 0; i < tr_textile8_size; i++) {
    // Look up colour in the palette
    const colour = palette[tex[i]]

    // Multiply by 3 as it's 8 bit colour or something
    imgData[i * 4] = colour.r * 3
    imgData[i * 4 + 1] = colour.g * 3
    imgData[i * 4 + 2] = colour.b * 3
    // Palette index 0 is transparent, so we set the alpha to 0
    imgData[i * 4 + 3] = tex[i] === 0 ? 0 : 255
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

export function bufferToImageData(buffer: ArrayBuffer, width: number, height: number) {
  const imgData = new ImageData(new Uint8ClampedArray(buffer), width, height)
  return imgData
}

export function bufferToCanvas(buffer: ArrayBuffer, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const imgData = bufferToImageData(buffer, width, height)
  ctx.putImageData(imgData, 0, 0)
  return canvas
}
