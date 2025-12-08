import express from 'express';
import { verifyToken } from '../../utils/tokens.js';
import { Title, UserFavorites, UserWatchLater } from '../../models/Title.js';
import User from '../../models/User.js';
import UserActivity from '../../models/UserActivity.js';

const router = express.Router(); //cambie esto y el export al final


router.get('/favorite/', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, { include: { model: Title, as: "favorite" } })
        if (!user) return res.status(404).send({ message: "User not found" })
        res.send(user.favorite)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/watchLater/', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, { include: { model: Title, as: "watchLater" } })
        if (!user) return res.status(404).send({ message: "User not found" })
        res.send(user.watchLater)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/favorite/:imdbId', verifyToken, async (req, res) => {
    const { imdbId } = req.params
    try {
        const user = await User.findByPk(req.userId, { include: { model: Title, as: "favorite" } })
        if (!user) return res.status(404).send({ message: "User not found" })

        const title = await Title.findOne({ where: { imdbId } })
        if (!title) return res.status(404).send({ message: "Title not found" })

        await user.addFavorite(title, { as: "favorite" })
        await UserActivity.create({ userId: user.id, TitleId: title.id, activityType: "favorite" })

        const updatedUser = await User.findByPk(req.userId, { include: { model: Title, as: "favorite" } })
        res.send(updatedUser.favorite)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/watchlater/:imdbId', verifyToken, async (req, res) => {
    const { imdbId } = req.params
    try {
        const user = await User.findByPk(req.userId, { include: { model: Title, as: "watchLater" } })
        if (!user) return res.status(404).send({ message: "User not found" })

        const title = await Title.findOne({ where: { imdbId } })
        if (!title) return res.status(404).send({ message: "Title not found" })

        await user.addWatchLater(title, { as: "watchLater" })
        await UserActivity.create({ userId: user.id, TitleId: title.id, activityType: "watchLater" })

        const updatedUser = await User.findByPk(req.userId, { include: { model: Title, as: "watchLater" } })
        res.send(updatedUser.watchLater)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/favorite/:imdbId', verifyToken, async (req, res) => {
    const { imdbId } = req.params
    try {
        const title = await Title.findOne({ where: { imdbId } })
        if (!title) return res.status(404).send({ message: "Title not found" })

        const userFav = await UserFavorites.findOne({ where: { UserId: req.userId, TitleId: title.id } })
        if (userFav) await userFav.destroy()

        const userActivity = await UserActivity.create({ userId: req.userId, TitleId: title.id, activityType: "removeFavorited" })
        res.send(userActivity)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/watchlater/:imdbId', verifyToken, async (req, res) => {
    const { imdbId } = req.params
    try {
        const title = await Title.findOne({ where: { imdbId } })
        if (!title) return res.status(404).send({ message: "Title not found" })

        const userWatch = await UserWatchLater.findOne({ where: { UserId: req.userId, TitleId: title.id } })
        if (userWatch) await userWatch.destroy()

        const userActivity = await UserActivity.create({ userId: req.userId, TitleId: title.id, activityType: "removeWatchLater" })
        res.send(userActivity)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router;

