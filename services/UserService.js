// use latest js syntax
import { hash as bcryptHash } from 'bcrypt';
import pool from '../config/db.js';

const getUserByEmail = async (email) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (user.rows.length !== 0) {
      return user.rows[0];
    }
    return false;
  } catch (error) {
    return { message: error.message, status: 500 };
  }
};

const createIndustryPOCUser = async (body) => {
  const {
    name, username, email, password, industry, contactNumber,
  } = body;
  // Encrypt password and then store it in the database
  const bcryptPassword = await bcryptHash(password, 10);
  await pool.query(
    'INSERT INTO users (name, username, email, password, industry, contactNumber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, username, email, bcryptPassword, industry, contactNumber],
  );
};

export { createIndustryPOCUser, getUserByEmail };
