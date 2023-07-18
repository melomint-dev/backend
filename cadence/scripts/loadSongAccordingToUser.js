export const loadSongForUser = `
import MeloMint from 0xMeloMint

pub fun main(songId: String, userId: Address, artistId: Address): String {
    let isPreReleaseExpired: Bool = (getCurrentBlock().timestamp >= MeloMint.getSongById(songId: songId).preRelease)
    let isSubscribed: Bool = MeloMint.getPersonByAddress(id: userId).subscribedTo.containsKey(artistId)
    let havePlatformSubscription: Bool = MeloMint.getPersonByAddress(id: userId).subscriptionTill >= getCurrentBlock().timestamp

    var songAsset: String = ""
    let signer = getAuthAccount(0x01)
    let res <- signer.load<@MeloMint.SongCollection>(from: MeloMint.SongCollectionStoragePath)!

    if isPreReleaseExpired {
      if havePlatformSubscription {
        if res.isGoldSongExists(songId: songId) {
          songAsset = res.getGoldSong(songId: songId)
        }
      } else {
        if res.isNFTSongExists(songId: songId) {
          songAsset = res.getNFTSong(songId: songId)
        }
      }
    } else {
      if isSubscribed {
        if havePlatformSubscription {
          if res.isGoldSongExists(songId: songId) {
              songAsset = res.getGoldSong(songId: songId)
          }
        } else {
          if res.isNFTSongExists(songId: songId) {
              songAsset = res.getNFTSong(songId: songId)
          }
        }
      }
    }

    signer.save(<- res, to: MeloMint.SongCollectionStoragePath)
   
    return songAsset
}

`;
