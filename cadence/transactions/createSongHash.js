export const createSongHashTransaction = `
import MeloMint from 0xMeloMint

transaction(songId: String, goldSong: String, NFTSong: String) {
  prepare(signer: AuthAccount) {
    let res <- signer.load<@MeloMint.SongCollection>(from: MeloMint.SongCollectionStoragePath)!
    if goldSong != "null" {
      res.addGoldSong(songId: songId, songHash: goldSong)
    }
    if NFTSong != "null" {
      res.addNFTSong(songId: songId, songHash: NFTSong)
    }
    signer.save(<-res, to: MeloMint.SongCollectionStoragePath)
  }
}`;
