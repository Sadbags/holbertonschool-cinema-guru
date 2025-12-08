import express from 'express';
import UserActivity from '../models/UserActivity.js';
import User from '../models/User.js';
import { Title } from '../models/Title.js';
import { verifyToken } from '../utils/tokens.js';

const router = express.Router();

/**
 * @swagger
 * /api/activity:
 *   get:
 *     summary: Get all user activity logs
 *     description: Includes favorites, watch later, and removed items.
 *     tags: [User Activity]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Activity list returned
 */
router.get('/', verifyToken, (req, res) => {
    UserActivity.findAll({
        include: [
            { model: User, as: "user", attributes: ["username"] },
            { model: Title, as: "title", attributes: ["title"] }
        ],
        order: [["createdAt", "DESC"]]
    })
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

export default router;
