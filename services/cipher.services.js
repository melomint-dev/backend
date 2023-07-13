import crypto from "crypto";

const encryptFile = (fileBuffer, algorithm, key) => {
  const iv = crypto.randomBytes(16);
  console.log(iv);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encryptedFileBuffer = Buffer.concat([
    iv,
    cipher.update(fileBuffer),
    cipher.final(),
  ]);
  return encryptedFileBuffer;
};

const decryptFile = (fileBuffer, algorithm, key) => {
  // get iv from fileBuffer in buffer type
  const iv = fileBuffer.slice(0, 16);
  // get encrypted fileBuffer (without iv) in buffer type
  fileBuffer = fileBuffer.slice(16);
  console.log(iv);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decryptedFileBuffer = Buffer.concat([
    decipher.update(fileBuffer),
    decipher.final(),
  ]);
  return decryptedFileBuffer;
};

export { encryptFile, decryptFile };
