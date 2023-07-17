export const getPersonByAddressScript = `
import MeloMint from 0xMeloMint

pub fun main(addr: Address): MeloMint.Person {
    return MeloMint.getPersonByAddress(id: addr)
}
`;
