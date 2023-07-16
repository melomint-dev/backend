import * as fcl from "@onflow/fcl";

import { sendTransaction } from "../utils/flowTransaction.js";

export const transactions = {
  sampleTransaction: async (req, res) => {
    let code = `
    transaction (name: String) {
      prepare(signer: AuthAccount) {
        log(name)
      }
    }
    `;
    let response = await sendTransaction({
      code: code,
      args: [fcl.arg("Kavan", fcl.t.String)],
    });
    res.send(response);
  },

  createSong: async (req, res) => {
    let code = `
    import MeloMint from 0x01

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

      execute {
      }
    }
    `;
  },

  getSongAsset: async (req, res) => {
    let code = `
    import MeloMint from 0x01

    transaction (songId: String) {
      prepare(signer: AuthAccount) {
        let res <- signer.load<@MeloMint.SongCollection>(from: MeloMint.SongCollectionStoragePath)!
        if res.isGoldSongExists(songId: songId) {
          log(res.getGoldSong(songId: songId))
        }
        if res.isNFTSongExists(songId: songId) {
          log(res.getNFTSong(songId: songId))
        }
        signer.save(<-res, to: MeloMint.SongCollectionStoragePath)
      }
    }`;
  },
};
