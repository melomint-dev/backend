import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";
import config from "../config/serverConfig.js";

export const pinFileBufferToIPFS = async (fileBuffer, name) => {
    const formData = new FormData();
    const stream = Readable.from(fileBuffer);
  
    formData.append("file", stream, {
      filepath: name,
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
            Authorization: config.pinata.jwt,
          },
        }
      );
  
      console.log(res.data);
      console.log(typeof res.data["IpfsHash"]);
      console.log(res.data["IpfsHash"]);
      return res.data["IpfsHash"];
    } catch (error) {
      console.log(error);
      return error;
    }
};

export const getFileFromIPFS = async (ipfsHash) => {
    try {
      console.log("getting file from ipfs");
      const res = await fetch(
        `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        { method: "GET" }
      );
      return res.body;
    } catch (error) {
      console.log(error);
      return error;
    }
}
