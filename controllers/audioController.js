import crypto from "crypto";
import fs from "fs";
import config from "../config/serverConfig.js";
import { decryptFile, encryptFile } from "../utils/cipher.utils.js";
import { pinFileBufferToIPFS, getFileFromIPFS } from "../utils/pinata.utils.js";
import { stream2buffer } from "../utils/stream2buffer.utils.js";
import { getEmbeddings } from "../services/songProcessing.services.js"
const password = config.encrption.password;
const algorithm = config.encrption.algorithm;
const key = crypto.scryptSync(password, "salt", 32);

export const uploadFile = async (req, res) => {
  try {
    //encrypt the file with the key and iv with the crypto library and save it in a new folder called encrypted with extension enc;
    const encryptedFileBuffer = encryptFile(req.file.buffer, algorithm, key);
    const encryptedFilePath = `encrypted/${req.file.originalname}.enc`;
    fs.writeFileSync(encryptedFilePath, encryptedFileBuffer);

    // pin the encrypted file to IPFS
    const IpfsHash = await pinFileBufferToIPFS(
      encryptedFileBuffer,
      req.file.originalname
    );

    // get embeddings from the file
    const embeddings = await getEmbeddings(
      req.file.buffer,
      req.file.originalname
    );

    res.status(200).json({ 
      IpfsHash, 
      embeddings 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFile = async (req, res) => {
  try {
    const { ipfsHash } = req.params;
    const decryptedFilePath = `decrypted/${ipfsHash}.mp3`;

    // stream the decrypted file to the client
    if (!fs.existsSync(decryptedFilePath)) {
      console.log("file not found");

      // Retrieve the encrypted file from IPFS
      const pinataResBody = await getFileFromIPFS(ipfsHash);
      
      //convert pinataResBody ReadableStream to a buffer
      const encryptedFileBuffer = await stream2buffer(pinataResBody);

      // save the encrypted file in a new folder called encrypted with extension enc
      const encryptedFilePath = `encrypted/${ipfsHash}.enc`;
      fs.writeFileSync(encryptedFilePath, encryptedFileBuffer);

      // Decrypt the file and save it in a new folder called decrypted with extension mp3
      const decryptedFileBuffer = decryptFile(encryptedFileBuffer, algorithm, key);
      fs.writeFileSync(decryptedFilePath, decryptedFileBuffer);

      console.log("file saved");
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
