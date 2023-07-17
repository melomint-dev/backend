import crypto from "crypto";
import fs from "fs";
import config from "../config/serverConfig.js";
import { decryptFile, encryptFile } from "../utils/cipher.utils.js";
import { pinFileBufferToIPFS, getFileFromIPFS } from "../utils/pinata.utils.js";
import { stream2buffer } from "../utils/stream2buffer.utils.js";
import { getEmbeddings } from "../services/songProcessing.services.js";
import { lowerMP3Quality } from "../utils/audioBufferEncoder.js";
import { deleteOldestFiles } from "../utils/jugadFileCaching.js";
import { type } from "os";
import { createSongHashTransaction } from "../cadence/transactions/createSongHash.js";
import * as fcl from "@onflow/fcl";
const password = config.encrption.password;
const algorithm = config.encrption.algorithm;
const key = crypto.scryptSync(password, "salt", 32);

export const uploadFile = async (req, res) => {
  try {
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    if (!req.files || !req.files.image || !req.files.audio) {
      return res
        .status(400)
        .json({ error: "Both image and audio files are required" });
    } else if (audioFile.mimetype !== "audio/mpeg") {
      return res
        .status(401)
        .json({ error: "File type not supported. please upload mp3 file" });
    } else if (
      imageFile.mimetype !== "image/jpeg" &&
      imageFile.mimetype !== "image/png"
    ) {
      return res.status(402).json({
        error: "File type not supported. please upload jpeg or png file",
      });
    }

    fs.writeFileSync(audioFile.originalname, audioFile.buffer);
    const lowQualityBuffer = await lowerMP3Quality(audioFile.originalname);
    const encryptedFileBufferLow = encryptFile(
      lowQualityBuffer,
      algorithm,
      key
    );
    const encryptedFileBuffer = encryptFile(audioFile.buffer, algorithm, key);

    const artistID = req.body.artistID || "0"; // remove this 0 after artistID is implemented in the frontend
    console.log("artistID: ", artistID);

    const coverImageHash = await pinFileBufferToIPFS(
      imageFile.buffer,
      imageFile.originalname
    );

    const IpfsHash = await pinFileBufferToIPFS(
      encryptedFileBuffer,
      audioFile.originalname + ".enc"
    );

    let LowQualityIpfsHash;
    await pinFileBufferToIPFS(
      encryptedFileBufferLow,
      "low " + audioFile.originalname + ".enc"
    ).then((res) => {
      LowQualityIpfsHash = res;
      fs.unlinkSync(audioFile.originalname);
    });

    console.log("IpfsHash: ", IpfsHash);
    console.log("LowQualityIpfsHash: ", LowQualityIpfsHash);
    console.log("coverImageHash: ", coverImageHash);

    // get embeddings from the file
    const embeddings = await getEmbeddings(
      audioFile.buffer,
      audioFile.originalname,
      coverImageHash,
      IpfsHash,
      artistID
    );

    let code = createSongHashTransaction;
    let response = await sendTransaction({
      code: code,
      args: [
        fcl.arg(req.body.songId, fcl.t.String),
        fcl.arg(IpfsHash, fcl.t.String),
        fcl.arg("null", fcl.t.String),
      ],
    });
    log(response);

    if (response == false) {
      res.status(400).json({ message: "Error" });
    } else {
      res.status(200).json({
        LowQualityIpfsHash,
        coverImageHash,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFile = async (req, res) => {
  try {
    const { ipfsHash } = req.params;
    if (!ipfsHash) {
      return res.status(400).json({ error: "ipfsHash is required" });
    } else if (ipfsHash.length !== 46 && typeof ipfsHash !== "string") {
      return res.status(400).json({ error: "ipfsHash is invalid" });
    }
    const decryptedFilePath = `decrypted/${ipfsHash}.mp3`;

    // stream the decrypted file to the client
    if (!fs.existsSync(decryptedFilePath)) {
      console.log("file not found");

      // Retrieve the encrypted file from IPFS
      const pinataResBody = await getFileFromIPFS(ipfsHash);

      //convert pinataResBody ReadableStream to a buffer
      const encryptedFileBuffer = await stream2buffer(pinataResBody);

      const decryptedFileBuffer = decryptFile(
        encryptedFileBuffer,
        algorithm,
        key
      );
      fs.writeFileSync(decryptedFilePath, decryptedFileBuffer);

      console.log("file saved");

      const { maxFileCount } = config.jugadFileCaching;
      deleteOldestFiles(maxFileCount);
    }

    // Set the appropriate headers for audio streaming
    res.setHeader("Content-Type", "audio/mp3");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Transfer-Encoding", "chunked");

    // Create a read stream from the audio file
    const audioStream = fs.createReadStream(decryptedFilePath);

    // Pipe the audio stream to the response object
    audioStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const imgToIPFS = async (req, res) => {
  try {
    const imageFile = req.file;

    if (!req.file || !imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    } else if (
      imageFile.mimetype !== "image/jpeg" &&
      imageFile.mimetype !== "image/png"
    ) {
      return res.status(402).json({
        error: "File type not supported. please upload jpeg or png file",
      });
    }

    const imageHash = await pinFileBufferToIPFS(
      imageFile.buffer,
      imageFile.originalname
    );

    res.status(200).json({
      imageHash,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
