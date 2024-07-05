const express = require('express');
const verifyJWT = require('../middlewares/jwt');
const Permission = require('../classes/Permission.class');
const knex = require('../plugins/knex');
const router = express.Router();

// Define your routes here
router.use(verifyJWT)
router.get('/', async (req, res) => {
    try {
        const permission = new Permission(knex)
        const result = await permission.getBy({ user_id: req.user.id })
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;