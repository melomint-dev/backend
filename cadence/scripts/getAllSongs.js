export const getAllSongScript = `
import MeloMint from 0xMeloMint

pub fun main(): {String: MeloMint.Song} {
  return MeloMint.getSongs()  
}
`