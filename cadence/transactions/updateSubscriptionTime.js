export const updateSubscriptionTimeTransaction = `
import MeloMint from 0xMeloMint

transaction (userId: Address, addiontionalTime: UFix64) {
    prepare(signer: AuthAccount) {
      MeloMint.updateSubscriptionTime(person: signer, userId: userId, newTime: getCurrentBlock().timestamp + addiontionalTime)
    }
  }
`;
