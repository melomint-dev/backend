export const getPeopleScript = `
import MeloMint from 0xMeloMint

pub fun main(): {Address: MeloMint.Person}{
    return MeloMint.getPeople()
}
`;
