import * as fcl from "@onflow/fcl";

import { executeScript, sendTransaction } from "../utils/flowTransaction.js";
import { authorizationFunction } from "../utils/flowAuthorization.js";
import flowService from "../services/flow.service.js";
import {
  addSongLikesTransaction,
  createSongHashTransaction,
  updateSubscriptionTimeTransaction,
} from "../cadence/transactions/transaction.js";
import { getPremiumSongHashScript } from "../cadence/scripts/getPremiumSongHash.js";
import { useScript } from "../cadence/helpers/script.js";

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
    console.log(req.body);
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

  addSongLikes: async (req, res) => {
    console.log("Adding likes to Song");
    console.log(req.body);

    let response = await sendTransaction({
      code: addSongLikesTransaction,
      args: [
        fcl.arg(req.body.songId, fcl.t.String),
        fcl.arg(req.body.like, fcl.t.Int),
      ],
    });
    if (response == false) {
      res.status(400).json({ message: "Error Occured" });
    } else {
      res.status(200).json({ message: response });
    }
  },

  addSubscribers: async (req, res) => {
    console.log("Add Subscribers");
    console.log(req.body);
    let code = `
    import MeloMint from 0xMeloMint

    transaction(userId: Address, artistId: Address) {
      prepare(signer: AuthAccount) {
          MeloMint.personAddSubscribedTo(person: signer, artistId: artistId, userId: userId)
          MeloMint.personAddSubscriber(person: signer, userId: userId, artistId: artistId)
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

  updateSubscriptionTime: async (req, res) => {
    console.log("Update Subscription Time");
    console.log(req.body);

    let response = await sendTransaction({
      code: updateSubscriptionTimeTransaction,
      args: [
        fcl.arg(req.body.userId, fcl.t.Address),
        fcl.arg(req.body.additionalTime, fcl.t.UFix64),
      ],
    });
    if (response == false) {
      res.status(400).json({ message: "Error" });
    } else {
      res.status(200).json({ message: response });
    }
  },
};

export const scripts = {
  getPremiumSongHash: async (req, res) => {
    console.log(req.body);
    let response = await useScript({
      code: getPremiumSongHashScript,
      args: [
        fcl.arg(req.body.songId, fcl.t.String),
        fcl.arg(req.body.userId, fcl.t.Address),
      ],
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
