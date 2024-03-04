const express = require('express');
const Member = require('../classes/Member.class');
const knex = require('../plugins/knex');
const router = express.Router();
const moment = require('moment');
// Define your routes here
const member = new Member(knex);
const fs = require('fs');
const verifyJWT = require('../middlewares/jwt');
router.use(verifyJWT);
router.get('/read-from-card', async (req, res) => {
	try {
		const { village_code } = req.user;
		// console.log(req.user)
		if(!village_code) throw new Error('ไม่พบข้อมูลหมู่บ้าน')
		const result = await member.getFirstBy({ status: 1, village_code });
		// check create_at 1 30 sec
		if (result) {
			console.log(result)
			const diffCheck = moment().diff(moment(result.created_at), 'seconds');
			if (diffCheck > 30) {
				return res.status(200).json({ success: false, data: null });
			}
			await member.update(result.id, { status: 0 });
			return res.status(200).json({ success: true, data: result });
		} else {
			return res.status(200).json({ success: false, data: null });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});
router.get('/total', async (req, res) => {
	try {
		const result = await member.count({});
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});
router.get('/image/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		const result = await member.getFirstBy({ citizen_id: cid });
		if (!result) {
			return res.status(404).json({ success: false, error: 'ไม่พบข้อมูล' });
		}
		const path = `./public/images/${cid}.bmp`;
		// send file
		const file = fs.readFileSync(path);
		res.writeHead(200, { 'Content-Type': 'image/jpeg' });
		res.end(file, 'binary');
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});
router.get('/list', async (req, res) => {
	try {
		const { village_code } = req.user;
		const result = await member.getBy({ village_code: village_code }, 1000, 'id', 'desc');
		const count = await member.count({ village_code: village_code });
		return res.status(200).json({ success: true, data: result, count });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
})
module.exports = router;