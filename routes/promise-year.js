const express = require('express');
const PromiseYear = require('../classes/PromiseYear.class');
const knex = require('../plugins/knex');
const verifyJWT = require('../middlewares/jwt');
const acceptRole = require('../middlewares/acceptRole');
const router = express.Router();

// Define your routes here
const promiseYear = new PromiseYear(knex)
router.use(verifyJWT)
router.get('/', async (req, res) => {
	try {
		if (!req?.user?.village?.id) throw new Error('หมู่บ้านของผู้ใช้งานนี้ไม่ได้ถูกตั้งค่าไว้')
		const result = await promiseYear.getFirstBy({
			village_id: req.user.village.id,
		});
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

router.post('/', acceptRole(["master", "manager"]), async (req, res) => {
	try {
		if (!req.user?.village?.id) throw new Error('ไม่พบหมู่บ้าน')
		const result = await promiseYear.update({ village_id: req.user.village.id }, {
			year: req.body.year,
		});
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;