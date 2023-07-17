import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { authorizationFunction } from "../utils/flowAuthorization.js";
import flowService from "../services/flow.service.js";

fcl.config().put("accessNode.api", "https://testnet.onflow.org");

export const sendTx = async () => {
  console.log("Sending Tx");
  const transactionId = await fcl
    .send([
      fcl.transaction`
      transaction(number: Int, greeting: String) {
        prepare(signer: AuthAccount) {
  
        }
        execute {}
      }
      `,
      fcl.args([fcl.arg(1, t.Int), fcl.arg("Hello", t.String)]),
      fcl.proposer(authorizationFunction),
      fcl.payer(authorizationFunction),
      fcl.authorizations([authorizationFunction]),
      fcl.limit(9999),
    ])
    .then(fcl.decode);

  console.log(transactionId);
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
}

export const abstractionsController = new AbstractionsController();
