const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Authen = require("../classes/Authen.class");
const User = require("../classes/User.class");
const knex = require("../plugins/knex");
const masterKey = require("../middlewares/masterKey");

const loginValidate = [body("username").exists().withMessage("username is required"), body("password").exists().withMessage("password is required")];
const registerValidate = [body("username").exists().withMessage("username is required"), body("password").exists().withMessage("password is required"), body("name").exists().withMessage("name is required"), body("email").exists().withMessage("email is required")];
const user = new User(knex)
const authen = new Authen(user)

router.post("/login", loginValidate, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ success: false, errors: errors.array() });
		}
		const { username, password } = req.body;
		const result = await authen.login(username, password);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

router.post("/register", masterKey, registerValidate, async (req, res) => {
	try {
		const { username, password, fullname, email, role, citizen_id, tel, village_code } = req.body;
		const result = await authen.register(username, password, fullname, email, role, citizen_id, tel, village_code);
		return res.status(201).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;
