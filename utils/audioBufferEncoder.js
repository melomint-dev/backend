import { Lame } from "node-lame";
export const lowerMP3Quality = async (filePath, bitrate = 64) => {
  try {
    const encoder = new Lame({
        output: "buffer",
        bitrate: bitrate,
    }).setFile(filePath);
    var buffer = await encoder.encode();
    return buffer.progressedBuffer;
  } catch (error) {
    throw new Error("Error encoding the audio: " + error);
  }
};
