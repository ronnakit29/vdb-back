const express = require('express');
const verifyJWT = require('../middlewares/jwt');
const Securities = require('../classes/Securities.class');
const knex = require('../plugins/knex');
const router = express.Router();

// Define your routes here
router.use(verifyJWT)
const securities = new Securities(knex);
router.get('/list', async (req, res) => {
    try {
        const { village } = req;
        const result = await securities.getBy({ village_id: village.id });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
});

router.get('/:promiseGroupId', async (req, res) => {
    try {
        const { promiseGroupId } = req.params;
        const result = await securities.getFirstBy({ promise_document_group_id: promiseGroupId });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;