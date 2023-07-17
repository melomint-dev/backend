import * as fcl from "@onflow/fcl";

import { executeScript, sendTransaction } from "../utils/flowTransaction.js";
import { authorizationFunction } from "../utils/flowAuthorization.js";
import flowService from "../services/flow.service.js";
import { createSongHashTransaction } from "../cadence/transactions/transaction.js";

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

  createSongHash: async (req, res) => {
    log(req.body);
    let code = createSongHashTransaction;
    let response = await sendTransaction({
      code: code,
      args: [
        fcl.arg(req.body.songId, fcl.t.String),
        fcl.arg(req.body.goldSong, fcl.t.String),
        fcl.arg(req.body.NFTSong, fcl.t.String),
      ],
    });
    res.send(response);
  },

  addSubscribers: async (req, res) => {
    console.log("Add Subscribers");
    console.log(req.body);
    let code = `
    import MeloMint from 0xMeloMint

    transaction(userId: Address, artistId: Address) {
        prepare(signer: AuthAccount) {
            MeloMint.personAddSubscribedTo(person: signer, artistId: artistId)
            MeloMint.personAddSubscriber(person: signer, userId: userId)
        }
    }
    `;
    let response = await sendTransaction({
      code: code,
      args: [
        fcl.arg(req.body.userId, fcl.t.Address),
        fcl.arg(req.body.artistId, fcl.t.Address),
      ],
    });
    if (response == false) {
      res.status(400).json({ message: "Error Occured" });
    } else {
      res.status(200).json({ message: response });
    }
  },
};

export const scripts = {
  getGoldSongAsset: async (req, res) => {
    let code = `
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
    let response = await executeScript({
      code: code,
      args: [fcl.arg(req.body.songId, fcl.t.String)],
    });
    res.send(response);
  },

  getNFTSongAsset: async (req, res) => {
    let code = `
    import MeloMint from 0xMeloMint

    pub fun main(songId: String, userId: Address, artistId: Address): String {
      if MeloMint.getPersonByAddress(id: userId).subscribedTo.containsKey(artistId) && MeloMint.getPersonByAddress(id: artistId).subscribers.containsKey(userId) {
        let signer = getAuthAccount(0xMeloMint)
        var songAsset: String = ""
        let res <- signer.load<@MeloMint.SongCollection>(from: MeloMint.SongCollectionStoragePath)!
    
        if res.isNFTSongExists(songId: songId) {
          songAsset = res.getGoldSong(songId: songId)
        }
        
        signer.save(<- res, to: MeloMint.SongCollectionStoragePath)
        return songAsset
      }
      return ""
    }
    `;
    let response = await executeScript({
      code: code,
      args: [fcl.arg(req.body.songId, fcl.t.String)],
    });
    res.send(response);
  },
};

class AbstractionsController {
  async getAllSongs(req, res) {
    try {
      const data = await flowService.getAllSongs();
      res.status(200).json(data);
    } catch (error) {
      console.log("ERROR IN GET ALL SONGS", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getTrendingSongs(req, res) {
    try {
      const data = await flowService.getTrendingSongs(6);
      res.status(200).json(data);
    } catch (error) {
      console.log("ERROR IN GET TRENDING SONGS", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getLatestSongs(req, res) {
    try {
      const data = await flowService.getLatestSongs(6);
      res.status(200).json(data);
    } catch (error) {
      console.log("ERROR IN GET LATEST SONGS", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getArtistsOnRise(req, res) {
    try {
      const data = await flowService.getArtistsOnRise(5);
      res.status(200).json(data);
    } catch (error) {
      console.log("ERROR IN GET ARTISTS ON RISE", error);
      res.status(500).json({ error: error.message });
    }
  }

  async search(req, res) {
    try {
      const data = await flowService.search(req.query.q);
      res.status(200).json(data);
    } catch (error) {
      console.log("ERROR IN SEARCH", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const abstractionsController = new AbstractionsController();
