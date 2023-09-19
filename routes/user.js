const express = require('express');
const verifyJWT = require('../middlewares/jwt');
const User = require('../classes/User.class');
const knex = require('../plugins/knex');
const acceptRole = require('../middlewares/acceptRole');
const Authen = require('../classes/Authen.class');
const router = express.Router();

// Define your routes here

const user = new User(knex)
router.use(verifyJWT)
router.get('/profile', async (req, res) => {
	return res.status(200).json({ success: true, data: req.user });
});
router.get('/checkManager', async (req, res) => {
	try {
		const { citizen_id } = req.query;
		if (!citizen_id) throw new Error('citizen_id is required')
		const result = await user.getFirstBy({ citizen_id, role: "manager", village_code: req.user.village_code })
		if (!result) throw new Error('ไม่พบผู้ใช้งาน หรือผู้ใช้งานไม่ใช่ผู้จัดการ')
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});
router.get('/list', acceptRole(["master", "manager"]), async (req, res) => {
	try {
		const { village_code } = req.query;
		const params = {}
		if (req.user.role !== 'master') {
			params.village_code = req.user.village_code
		} else {
			params.village_code = village_code
		}
		const result = await user.getBy(params, 200, 'id', 'desc');
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});
router.post('/create', async (req, res) => {
	try {
		const currentUser = req;
		const { role, username, fullname, password, email, citizen_id, village_code } = req.body;
		if (!village_code) throw new Error('village_code is required')
		if (!citizen_id) throw new Error('citizen_id is required')
		const managerRoleAccept = ["manager", "employee"]
		const params = {
			username,
			password,
			email,
			citizen_id,
			fullname,
			village_code: currentUser.role === 'master' ? village_code : currentUser.village_code,
			role: currentUser === "master" ? role : managerRoleAccept.includes(currentUser.role) ? role : "employee",
		}
		const authen = new Authen(user);
		const result = await authen.register(params.username, params.password, params.fullname, params.email, params.role, params.citizen_id, params.tel, params.village_code);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});
module.exports = router;