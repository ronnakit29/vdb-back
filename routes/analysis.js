const express = require('express');
const Member = require('../classes/Member.class');
const knex = require('../plugins/knex');
const PromiseDocument = require('../classes/PromiseDocument.class');
const Village = require('../classes/Village.class');
const verifyJWT = require('../middlewares/jwt');
const router = express.Router();

// Define your routes here
router.use(verifyJWT)
router.get('/dashboard', async (req, res) => {
	try {
		const { village_code, role } = req.user;
		const member = new Member(knex)
		const promiseDocument = new PromiseDocument(knex)
		const village = new Village(knex)
		let villageQuery = null;
		const params = {}
		if (role !== 'master') {
			villageQuery = await village.getFirstBy({ code: village_code })	
			params.village_code = village_code
		} else {
			villageQuery = await village.getFirstBy({ code: req.query.village_code })
			params.village_code = req.query.village_code
		}
		const totalMember = await member.count({ village_code: villageQuery.code })
		const totalPromise = await promiseDocument.count({ village_id: villageQuery.id })
		const totalPromiseAmount = await promiseDocument.sum({ village_id: villageQuery.id }, null, 'amount')
		const totalHedgeFundAmount = await promiseDocument.sum({ village_id: villageQuery.id }, null, 'hedge_fund')
		const result = {
			totalMember,
			totalPromise,
			totalPromiseAmount,
			totalHedgeFundAmount
		}
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;