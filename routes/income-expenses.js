const express = require('express');
const IncomeExpenses = require('../classes/IncomeExpenses.class');
const knex = require('../plugins/knex');
const verifyJWT = require('../middlewares/jwt');
const acceptRole = require('../middlewares/acceptRole');
const User = require('../classes/User.class');
const router = express.Router();

// Define your routes here
router.use(verifyJWT);
const incomeExpenses = new IncomeExpenses(knex)
router.get('/', acceptRole(['employee', 'manager', 'manager']), async (req, res) => {
	try {
		const { village } = req.user;
		console.log(village)
		const result = await incomeExpenses.getBy({ village_id: village.id }, 200, 'id', 'desc');
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

router.get('/list', acceptRole(['employee', 'manager', 'master']), async (req, res) => {
	try {
		const { vid } = req.query;
		const { limit, sort, sortBy, startDate, endDate } = req.query;
		const params = {}
		if (req.user.role !== 'master') {
			params.village_id = req.user.village.id
		} else {
			params.village_id = vid
		}
		const result = await incomeExpenses.getBy(params, limit, sort || "id", sortBy || "desc", { startDate, endDate });
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
})

router.post('/create', acceptRole(['manager', 'master']), async (req, res) => {
	try {
		const { village, id } = req.user;
		if (!req.body.description) throw new Error('description is required')
		const data = {
			description: req.body.description,
			income: req.body.income,
			expense: req.body.expense,
			withdraw_value: req.body.withdraw_value,
			withdraw_all: req.body.withdraw_all || 0,
			user_id: id,
			village_id: village.id,
			manager_citizen_id: req.body.citizen_id,
		}
		const user = new User(knex)
		// const checkManager = await user.getFirstBy({ citizen_id: req.body.citizen_id, role: "manager", village_code: req.user.village_code })
		// if (!checkManager) throw new Error('ไม่พบผู้ใช้งาน หรือผู้ใช้งานไม่ใช่ผู้จัดการ')
		const result = await incomeExpenses.create(data);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

router.post('/delete', acceptRole(['manager', 'master']), async (req, res) => {
	try {
		const { id } = req.body;
		const { village } = req.user;
		const result = await incomeExpenses.delete({ id, village_id: village.id });
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});
module.exports = router;