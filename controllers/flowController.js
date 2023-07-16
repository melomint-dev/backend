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
};
