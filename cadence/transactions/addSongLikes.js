export const addSongLikesTransaction = `
import MeloMint from 0xMeloMint

transaction (songId: String, like: Int) {
    prepare(signer: AuthAccount) {
      MeloMint.songAddLikes(signer: signer, songId: songId, like: like)
    }
  }
`;
