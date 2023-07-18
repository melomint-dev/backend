/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import audioRouter from "./routes/audio.routes.js";
import flowRouter from "./routes/flow.routes.js";
import playbackRouter from "./routes/playback.routes.js";
import config from "./config/serverConfig.js";
import * as fcl from "@onflow/fcl";

const app = express();
const port = config.server.port;

fcl.config({
  "app.detail.title": "MeloMint",
  "0xMeloMint": "0x7d5835e221b85422",
});

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("server is running!"));

app.use("/", audioRouter);
app.use("/flow", flowRouter);
app.use("/api", playbackRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// coverpage on ipfs
// similarity on flow chain
