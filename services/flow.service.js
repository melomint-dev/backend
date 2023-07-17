import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { useScript } from "../cadence/helpers/script.js";
import { getAllSongScript } from "../cadence/scripts/getAllSongs.js";
import { getPersonByAddressScript } from "../cadence/scripts/getPersonByAddress.js";
import { getPeopleScript } from "../cadence/scripts/getAllPeople.js";

class FlowService {
  /**
   *
   * @param {string} address
   * @returns
   */
  getPersonByAddress = async (address) => {
    try {
      const data = await useScript({
        code: getPersonByAddressScript,
        args: [fcl.arg(address, fcl.t.Address)],
      });
      return data;
    } catch (error) {
      console.log("ERROR IN GET PERSON BY ADDRESS SERVICE", error);
      throw error;
    }
  };

  async getAllSongs() {
    try {
      const data = await useScript({
        code: getAllSongScript,
        args: [],
      });

      return Object.values(data);
    } catch (error) {
      console.log("ERROR IN GET ALL SONGS SERVICE", error);
      throw error;
    }
  }

  async getAllPeople() {
    try {
      const data = await useScript({
        code: getPeopleScript,
        args: [],
      });
      return Object.values(data);
    } catch (error) {
      console.log("ERROR IN GET ALL PEOPLE SERVICE", error);
      throw error;
    }
  }

  async populateArtistData(song) {
    try {
      const artist = await this.getPersonByAddress(song.artist);
      return {
        ...song,
        artist,
      };
    } catch (error) {
      console.log("ERROR IN POPULATE ARTIST DATA SERVICE", error);
      throw error;
    }
  }

  async populateArtistDataForSongs(songs) {
    try {
      return await Promise.all(
        songs.map(async (song) => {
          return await this.populateArtistData(song);
        })
      );
    } catch (error) {
      console.log("ERROR IN POPULATE ARTIST DATA FOR SONGS SERVICE", error);
      throw error;
    }
  }

  async getTrendingSongs(noOfSongs) {
    try {
      const songsList = await this.getAllSongs();

      /**
       * Sort songs by plays
       * plays are object
       * key: date
       * value: plays on that date
       * Use Latest date to sort
       */
      const trendingSongs = songsList.sort((a, b) => {
        const aPlays = Object.keys(a.plays).sort();
        const bPlays = Object.keys(b.plays).sort();
        const aLatestDatePlays = aPlays.length
          ? a.plays[aPlays[aPlays.length - 1]]
          : 0;
        const bLatestDatePlays = bPlays.length
          ? b.plays[bPlays[bPlays.length - 1]]
          : 0;
        return bLatestDatePlays - aLatestDatePlays;
      });

      // return top {{noOfSongs}} songs
      return await this.populateArtistDataForSongs(
        trendingSongs.slice(0, noOfSongs)
      );
    } catch (error) {
      console.log("ERROR IN GET TRENDING SONGS SERVICE", error);
      throw error;
    }
  }

  async getArtistsOnRise(noOfArtists) {
    try {
      const trendingSongs = await this.getTrendingSongs(noOfArtists * 2);

      const artistDatabyId = {};
      const trendingSongArtists = trendingSongs.map((song) => {
        artistDatabyId[song.artist.id] = song.artist;
        return song.artist;
      });

      const uniqueAddresses = [
        ...new Set(trendingSongArtists.map((artist) => artist.id)),
      ].slice(0, noOfArtists);

      return uniqueAddresses.map((address) => {
        return artistDatabyId[address];
      });
    } catch (error) {
      console.log("ERROR IN GET TRENDING SONGS SERVICE", error);
      throw error;
    }
  }

  async getLatestSongs(noOfSongs) {
    try {
      const songsList = await this.getAllSongs();

      /**
       * Sort songs by upload date
       */
      const latestSongs = songsList.sort((a, b) => {
        const aUploadDate = new Date(parseInt(a.uploadedAt) * 1000);
        const bUploadDate = new Date(parseInt(b.uploadedAt) * 1000);

        return bUploadDate - aUploadDate;
      });

      // return top {{noOfSongs}} songs
      return await this.populateArtistDataForSongs(
        latestSongs.slice(0, noOfSongs)
      );
    } catch (error) {
      console.log("ERROR IN GET TRENDING SONGS SERVICE", error);
      throw error;
    }
  }

  /**
   *
   * @param {string} query
   * @returns
   */
  async search(query) {
    try {
      const allSongs = await this.getAllSongs();
      const allArtists = await this.getAllPeople();

      if (!query) return { songs: [], artists: [] };

      const fileteredSongs = allSongs
        .filter((song) => song.name.toLowerCase().includes(query.toLowerCase()))
        .map((song) => {
          return {
            ...song,
            artist: allArtists.find((artist) => artist.id === song.artist),
          };
        });

      const fileteredArtists = allArtists
        .filter((artist) => artist.type == "1")
        .filter(
          (artist) =>
            artist.firstName.toLowerCase().includes(query.toLowerCase()) ||
            artist.lastName.toLowerCase().includes(query.toLowerCase())
        );

      return {
        songs: fileteredSongs,
        artists: fileteredArtists,
      };
    } catch (error) {
      console.log("ERROR IN SEARCH SERVICE", error);
      throw error;
    }
  }
}

export default new FlowService();
