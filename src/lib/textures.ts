import { tr_palette, tr_textile8, tr_textile8_size } from './types'

/**
 * Return a tr_textile8 as a ArrayBuffer
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
    imgData[i * 4 + 3] = 255
  }

  return imgData
}
