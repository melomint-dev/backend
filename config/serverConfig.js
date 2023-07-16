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

config.redis = {
    password: process.env.REDIS_PASSWORD
}

config.admin = {
    AuthKey : "VERY-STRONG-HASH"
}

config.jugadFileCaching = {
    maxFileCount: process.env.JUGAD_CACHE_FILE,
}

export default config;