import dotenv from "dotenv";
dotenv.config();

var config = {}

config.server = {
    port: 3000,
}

config.pinata = {
    key: process.env.PINATA_KEY,
    secret: process.env.PINATA_SECRET,
    jwt: process.env.PINATA_JWT,
}

config.encrption = {
    password: process.env.ENCRYPTION_PASSWORD,
    algorithm: process.env.ENCRYPTION_ALGO,
}

export default config;