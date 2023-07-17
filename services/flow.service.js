import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import { getAllSongScript } from "../cadence/scripts/getAllSongs.js";
import { useScript } from "../cadence/helpers/script.js";

class FlowService {
  async getAllSongs() {
    try {
      const data = await useScript({
        code: getAllSongScript,
        args: [],
      });
      return data;
    } catch (error) {
      console.log("ERROR IN GET ALL SONGS SERVICE", error);
      throw error;
    }
  }
}

export default new FlowService();
