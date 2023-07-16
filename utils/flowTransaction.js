import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { authorizationFunction } from "../utils/flowAuthorization.js";

fcl.config({
    "flow.network": "testnet",
    "accessNode.api": "https://access-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    "app.detail.title": "MeloMint",
    "0xMeloMint": "0x62cfd688a83bc89c",
  });

export const sendTransaction = async (transaction) => {
  console.log("Sending Tx");
  console.log(transaction);

  try {
    const transactionId = await fcl
      .send([
        fcl.transaction(transaction.code),
        fcl.args(transaction.args),
        fcl.proposer(authorizationFunction),
        fcl.payer(authorizationFunction),
        fcl.authorizations([authorizationFunction]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);
    console.log(transactionId);
    const transactionStatus = await fcl.tx(transactionId).onceSealed();
    console.log(transactionStatus);
    return transactionStatus;
  } catch (error) {
    console.log(error);
    return false;
  }
};
