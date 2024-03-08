// =============================================================================
// Project: WebGL Tomb Raider
// File reading utilities
// =============================================================================

/**
 * Fetches a level file as a Uint8Array
 * @param path - The path to the level file, e.g. Tomb-Raider-1/08-Cistern.PHD
 * @returns
 */
export async function getLevelFile(path: string) {
  const response = await fetch('levels/' + path)

  if (!response.ok) {
    throw new Error('Failed to fetch level data')
  }

  if (response.status !== 200) {
    throw new Error('Failed to fetch level data, not found')
  }

  const buffer = await response.arrayBuffer()
  return new Uint8Array(buffer)
}
