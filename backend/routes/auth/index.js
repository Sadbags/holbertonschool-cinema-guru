import express from 'express';
import registerRouter from './register.js';
import loginRouter from './login.js';
import { verifyToken } from '../../utils/tokens.js';

const router = express.Router();

// Rutas de registro y login
router.use('/register', registerRouter);
router.use('/login', loginRouter);

// Ruta para validar JWT
router.post('/', verifyToken, (req, res) => {
    if (req.userId && req.username) {
        res.send({
            userId: req.userId,
            username: req.username,
        });
    } else {
        res.status(401).send({
            message: "Invalid token"
        });
    }
});

export default router;
