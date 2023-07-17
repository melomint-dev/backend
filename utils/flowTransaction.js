import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { authorizationFunction } from "../utils/flowAuthorization.js";
import flowCredentials from "../flow.json" assert{ type: "json" };

fcl.config({
  "flow.network": "testnet",
  "accessNode.api": "https://access-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "app.detail.title": "MeloMint",
  "0xMeloMint": `0x${flowCredentials.accounts["deploy"].address}`,
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

export const executeScript = async (script) => {
  console.log("Executing Script");
  console.log(script);

  try {
    const response = await fcl
      .query([fcl.script(script.code), fcl.args(script.args)])
      .then(fcl.decode);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};
