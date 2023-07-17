import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { authorizationFunction } from "../utils/flowAuthorization.js";
import { useScript } from "../cadence/helpers/script.js";
import { getAllSongScript } from "../cadence/scripts/getAllSongs.js";

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
      const data = await useScript({
        code: getAllSongScript,
        args: [],
      });
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const abstractionsController = new AbstractionsController();
