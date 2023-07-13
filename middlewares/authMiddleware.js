/* eslint-disable consistent-return */
import Jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token || token === '') {
      return res.status(401).json({ message: 'Token not found' });
    }
    Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid Token', error: err });
      }
      req.decoded = decoded;
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: 'Token not found', error: err });
  }
};

export default verifyToken;
