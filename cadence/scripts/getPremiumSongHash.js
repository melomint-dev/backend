export const getPremiumSongHashScript = `
import MeloMint from 0xMeloMint

pub fun main(songId: String, userId: Address): String {
  if MeloMint.getPersonByAddress(id: userId).subscriptionTill >= getCurrentBlock().timestamp {
    let signer = getAuthAccount(0xMeloMint)
    var songAsset: String = ""
    let res <- signer.load<@MeloMint.SongCollection>(from: MeloMint.SongCollectionStoragePath)!

    if res.isGoldSongExists(songId: songId) {
      songAsset = res.getGoldSong(songId: songId)
    }
    
    signer.save(<- res, to: MeloMint.SongCollectionStoragePath)
    return songAsset
  }
  return ""
}
`;
