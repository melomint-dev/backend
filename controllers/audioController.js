import crypto from "crypto";
import fs from "fs";
import config from "../config/serverConfig.js";
import { decryptFile, encryptFile } from "../utils/cipher.utils.js";
import { pinFileBufferToIPFS, getFileFromIPFS } from "../utils/pinata.utils.js";
import { stream2buffer } from "../utils/stream2buffer.utils.js";
import { getEmbeddings } from "../services/songProcessing.services.js";
import { lowerMP3Quality } from "../utils/audioBufferEncoder.js";
const password = config.encrption.password;
const algorithm = config.encrption.algorithm;
const key = crypto.scryptSync(password, "salt", 32);

export const uploadFile = async (req, res) => {
  try {
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    if (!req.files || !req.files.image || !req.files.audio) {
      return res.status(400).json({ error: 'Both image and audio files are required' });
    }else if(audioFile.mimetype !== "audio/mpeg"){
      return res.status(401).json({ error: "File type not supported. please upload mp3 file" });
    }else if(imageFile.mimetype !== "image/jpeg" && imageFile.mimetype !== "image/png"){
      return res.status(402).json({ error: "File type not supported. please upload jpeg or png file" });
    }

    fs.writeFileSync(audioFile.originalname, audioFile.buffer);
    const lowQualityBuffer = await lowerMP3Quality(audioFile.originalname);
    const encryptedFileBufferLow = encryptFile(lowQualityBuffer, algorithm, key);
    const encryptedFileBuffer = encryptFile(audioFile.buffer, algorithm, key);

    const artistID = req.body.artistID || "0"; // remove this 0 after artistID is implemented in the frontend
    console.log("artistID: ", artistID);

    const coverImageHash = await pinFileBufferToIPFS(
      imageFile.buffer,
      imageFile.originalname
    ); 
    
    const IpfsHash = await pinFileBufferToIPFS(
      encryptedFileBuffer,
      audioFile.originalname+ ".enc"
    );

    let LowQualityIpfsHash;
    await pinFileBufferToIPFS(
      encryptedFileBufferLow,
      "low "+audioFile.originalname+ ".enc"
    ).then((res) => {
      LowQualityIpfsHash = res
      fs.unlinkSync(audioFile.originalname);
    })

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

    res.status(200).json({
      IpfsHash,
      LowQualityIpfsHash,
      embeddings,
      coverImageHash
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
      // const encryptedFilePath = `encrypted/${ipfsHash}.enc`;
      // fs.writeFileSync(encryptedFilePath, encryptedFileBuffer);

      // Decrypt the file and save it in a new folder called decrypted with extension mp3
      const decryptedFileBuffer = decryptFile(
        encryptedFileBuffer,
        algorithm,
        key
      );
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
