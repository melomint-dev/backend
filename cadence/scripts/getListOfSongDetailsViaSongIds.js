export const getListOfSongDetailsViaSongIdsScript = `
import MeloMint from 0xMeloMint

pub struct SongDetails {
    pub var song: MeloMint.Song
    pub var artist: MeloMint.Person

    init(song: MeloMint.Song, artist: MeloMint.Person) {
        self.song = song
        self.artist = artist
    }
}

pub fun main(songIds: [String]): [SongDetails] {

    var arrayOfSongDetails: [SongDetails] = []
    
    for songId in songIds {
        var song = MeloMint.getSongById(songId: songId)
        var artist = MeloMint.getPersonByAddress(id: song.artist)
        arrayOfSongDetails.append(SongDetails(song: song, artist: artist))
    }

    return arrayOfSongDetails
}`;
