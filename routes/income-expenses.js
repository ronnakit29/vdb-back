const express = require('express');
const IncomeExpenses = require('../classes/IncomeExpenses.class');
const knex = require('../plugins/knex');
const verifyJWT = require('../middlewares/jwt');
const acceptRole = require('../middlewares/acceptRole');
const User = require('../classes/User.class');
const router = express.Router();
const moment = require('moment');
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

router.post('/cancel', async (req, res) => {
	try {
		const { id } = req.body;
		const result = await incomeExpenses.update(id, { status: 'cancel' });
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(400).json({ success: false, error: error.message });
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
		const result = await incomeExpenses.getBy(params, limit || 100, sort || "id", sortBy || "desc", { startDate: moment(startDate).startOf('day').format("YYYY-MM-DD HH:mm:ss"), endDate: moment(endDate).endOf('day').format("YYYY-MM-DD HH:mm:ss") });
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
})
//
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await incomeExpenses.getFirstBy({ id });
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });

	}
});

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
			income_form: req.body.income_form,
			expense_form: req.body.expense_form,
			financial_status_form: req.body.financial_status_form,
			file: req.body.file,
			banking_value: req.body.banking_value,
		}
		const user = new User(knex)
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