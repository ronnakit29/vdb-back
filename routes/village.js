const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/jwt.js');
const acceptRole = require('../middlewares/acceptRole.js');
const Village = require('../classes/Village.class.js');
const knex = require('../plugins/knex.js');

const village = new Village(knex)
router.use(verifyJWT);
router.get('/', acceptRole(["manager", "master"]), async (req, res) => {
	try {
		const params = {}
		if (req.user.role !== 'master') {
			params.id = req.user.village.id
		}
		const result = await village.getBy(params, 200, 'id', 'desc');
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

router.get('/:id', acceptRole(["master"]), async (req, res) => {
	try {
		const { id } = req.params;
		const result = await village.getFirstBy({ id });
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
})

router.post('/create', acceptRole(["master"]), async (req, res) => {
	try {
		const { name, code, working_position, } = req.body;
		const data = {
			name,
			code,
			working_position,
		}
		const result = await village.create(data);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
})

router.post('/update', acceptRole(["master"]), async (req, res) => {
	try {
		const { id, name, code, working_position, } = req.body;
		const data = { name, code, working_position }
		const result = await village.update(id, data);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

router.post('/delete', acceptRole(["master"]), async (req, res) => {
	try {
		const { id } = req.body;
		const result = await village.delete(id);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
})

module.exports = router;