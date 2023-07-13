import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";
import fs from "fs";
import { Readable } from "stream";
import config from "../config/serverConfig.js";
import { decryptFile, encryptFile } from "../services/cipher.services.js";

const JWT = config.pinata.jwt;
const password = config.encrption.password;
const algorithm = config.encrption.algorithm;
const key = crypto.scryptSync(password, "salt", 32);

function stream2buffer(stream) {
  const chunks = [];
  const reader = stream.getReader();

  function readStream() {
    return reader.read().then(({ done, value }) => {
      if (done) {
        const totalLength = chunks.reduce(
          (acc, chunk) => acc + chunk.length,
          0
        );
        const buffer = Buffer.concat(chunks, totalLength);
        return buffer;
      }

      chunks.push(value);
      return readStream();
    });
  }

  return readStream();
}

const pinFileBufferToIPFS = async (fileBuffer, name) => {
  const formData = new FormData();
  const stream = Readable.from(fileBuffer);

  formData.append("file", stream, {
    filepath: name + ".enc",
  });

  try {
    console.log("pinning file to ipfs");
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );

    console.log(res.data);
    return res.data.IpfsHash;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getEmbeddings = async (fileBuffer, name) => {
  // make a post request with multipart file in form data to the api https://melomint.centralindia.cloudapp.azure.com/embeddings

  const formData = new FormData();
  console.log('filename: ', name+';type=audio/mpeg')
  formData.append("file", fileBuffer, name);

  try {
    console.log("sending file to get embeddings");
    const res = await axios.post(
      "https://melomint.centralindia.cloudapp.azure.com/embeddings",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Content-Type": "multipart/form-data;",
          Accept: "application/json",
        },
      }
    );

    // console.log(res.data);
    return res.data;

  } catch (error) {
    console.log(error);
    return error;
  }
};

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
      const pinataRes = await fetch(
        `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        { method: "GET" }
      );
      //convert pinataRes.body ReadableStream to a buffer
      const encryptedFileBuffer = await stream2buffer(pinataRes.body);

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
