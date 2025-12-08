import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import 'dotenv/config';

const { JWT_TOKEN_SECRET, TOKEN_EXPIRE_SECONDS } = process.env;

export const generateToken = async (userId, username) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId, username }, JWT_TOKEN_SECRET, { expiresIn: parseInt(TOKEN_EXPIRE_SECONDS) }, (err, token) => {
      if (err) reject(new Error('Token generation unsuccessful'));
      else resolve(token);
    });
  });
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  });
};

export const validateToken = async (req, res) => {
  const authHeader = req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    const { userId } = decoded;
    try {
      const user = await User.findByPk(userId);
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
