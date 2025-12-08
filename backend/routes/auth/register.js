import express from 'express';
import User from '../../models/User.js';
import { generateToken } from '../../utils/tokens.js';
import { hashPassword } from '../../utils/password.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid username format
 */

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash de la contraseña antes de guardar
        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            username,
            password: hashedPassword,
        });

        // Generar token
        const token = await generateToken(newUser.id, newUser.username);

        res.status(201).send({
            message: 'Registered successfully',
            accessToken: token,
        });
    } catch (error) {
        res.status(400).send({ message: 'Invalid username or server error', error });
    }
});

export default router;
