// middleware to check for a valid string in the authorization header

import config from "../config/serverConfig.js";

export const adminAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: "Send an auth key in headers with key authorization." });
  } else {
    if (authorization === config.admin.AuthKey) {
      next();
    } else {
      res.status(401).json({ error: "auth key in headers with key authorization didn't match." });
    }
  }
};
