// Auth Controller
import { compare as bcryptCompare } from 'bcrypt';
import Jwt from 'jsonwebtoken';
import * as userService from '../services/UserService.js';

const signup = async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (user) {
    res.json({ message: 'User already exists', status: 401 });
  } else {
    try {
      await userService.createIndustryPOCUser(req.body);
      const token = Jwt.sign({ id: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      res.cookie('token', token, { secure: false, sameSite: false });// for development
      // res.cookie('token', token, { secure: true, sameSite: true }); // for production
      res.json({ message: 'User created', status: 200 });
    } catch (err) {
      res.json({ message: err.message, status: 500 });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email);
  if (user) {
    bcryptCompare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      }
      if (result) {
        const token = Jwt.sign({ id: user.username }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        res.cookie('token', token, { secure: false, sameSite: false }); // for development
        // res.cookie('token', token, { secure: true, sameSite: true }); // for production
        res.status(200).send('Password matched');
      } else {
        res.status(401).send({ message: 'Password not matched', result });
      }
    });
  } else {
    res.json({ message: 'Email Not Found', status: 401 });
  }
};

const checkToken = async (req, res) => {
  res.status(200).send({ message: 'Token is valid', result: req.decoded });
};

export { login, signup, checkToken };
