/**
 * Fetches a level file as a Uint8Array
 * @param path - The path to the level file, e.g. Tomb-Raider-1/08-Cistern.PHD
 * @returns
 */
export async function getLevelData(path: string) {
  const response = await fetch('levels/' + path)
  const buffer = await response.arrayBuffer()
  return new Uint8Array(buffer)
}
