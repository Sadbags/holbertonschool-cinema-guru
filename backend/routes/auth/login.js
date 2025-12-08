import express from 'express';
import User from '../../models/User.js';
import { comparePassword } from '../../utils/password.js';
import { generateToken } from '../../utils/tokens.js';

const router = express.Router(); // ✅ Definir el router

router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(401).send({ message: 'Incorrect credentials' });
        }

        const correct = await comparePassword(req.body.password, user.password);
        if (!correct) {
            return res.status(401).send({ message: 'Incorrect credentials' });
        }

        const token = await generateToken(user.id, user.username);
        res.send({
            message: 'Logged in successfully',
            accessToken: token,
        });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
});

export default router;
