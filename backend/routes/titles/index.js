import express from 'express';
import { Op } from 'sequelize';
import { Title, UserFavorites, UserWatchLater } from '../../models/Title.js';
import User from '../../models/User.js';
import UserActivity from '../../models/UserActivity.js';
import { verifyToken } from '../../utils/tokens.js';
import userTitlesRouter from './userTitles.js'; // Asegúrate de tener este archivo exportando default

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Titles
 *   description: IMDb titles management
 */
router.use('/', userTitlesRouter);

/**
 * @swagger
 * /api/titles/advancedsearch:
 *   get:
 *     summary: Advanced movie search
 *     tags: [Titles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: maxYear
 *         in: query
 *         schema:
 *           type: integer
 *       - name: minYear
 *         in: query
 *         schema:
 *           type: integer
 *       - name: genres
 *         in: query
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum: [oldest, latest, highestrated, lowestrated]
 *       - name: title
 *         in: query
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search results returned
 */
router.get('/advancedsearch', verifyToken, async (req, res) => {
    const maxYear = parseInt(req.query.maxYear);
    const minYear = parseInt(req.query.minYear);
    const genres = req.query.genres
        ? req.query.genres.split(',').map(g => g.charAt(0).toUpperCase() + g.slice(1))
        : [];

    const params = {
        maxYear: isNaN(maxYear) ? 2025 : maxYear,
        minYear: isNaN(minYear) ? 0 : minYear,
        sort: req.query.sort ?? '',
        genres,
        title: req.query.title ?? '',
        page: req.query.page ?? 1,
    };

    try {
        const titles = await Title.findAll({
            where: {
                released: { [Op.between]: [params.minYear, params.maxYear] },
                genres: { [Op.contains]: params.genres.length > 0 ? params.genres : true },
                title: { [Op.iLike]: `%${params.title}%` }
            },
            order: [getSort(params.sort)],
            limit: params.page * 50,
        });

        res.json({ totalCount: titles.length, titles });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

/**
 * @swagger
 * /api/titles/{imdbId}:
 *   get:
 *     summary: Get one title by IMDb ID
 *     tags: [Titles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Title found
 *       404:
 *         description: Title not found
 */
router.get('/:imdbId', verifyToken, async (req, res) => {
    const { imdbId } = req.params;

    try {
        const title = await Title.findOne({ where: { imdbId } });

        if (!title) return res.status(404).json({ message: 'Title not found' });

        res.json(title);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

function getSort(param) {
    switch (param) {
        case 'oldest':
            return ['released', 'ASC'];
        case 'highestrated':
            return ['imdbrating', 'DESC'];
        case 'lowestrated':
            return ['imdbrating', 'ASC'];
        default:
            return ['released', 'DESC'];
    }
}

export default router;
