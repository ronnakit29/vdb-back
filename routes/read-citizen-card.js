const express = require('express');
const Member = require('../classes/Member.class');
const knex = require('../plugins/knex');
const router = express.Router();
const moment = require('moment');
const member = new Member(knex)
// Define your routes here
const fs = require('fs');
const Village = require('../classes/Village.class');

router.post('/', async (req, res) => {
	try {
		const { vid } = req.query
		const { cid, thName, enName, dob, issueDate, expireDate, address, issuer, photo } = req.body;
		if (!vid) throw new Error('การยืนยันตัวหมู่บ้านไม่ถูกต้องโปรดทำรายการอีกครั้ง');
		const village = new Village(knex);
		await village.getFirstBy({ code: vid }, true);
		const data = {
			title_name: thName.prefix,
			first_name: thName.firstname,
			last_name: thName.lastname,
			citizen_id: cid,
			address: address,
			en_title_name: enName.prefix,
			en_first_name: enName.firstname,
			en_last_name: enName.lastname,
			birth_date: moment(`${dob.year - 543}-${dob.month}-${dob.day}`).toDate(),
			issue: moment(`${issueDate.year - 543}-${issueDate.month}-${issueDate.day}`).toDate(),
			expire: moment(`${expireDate.year - 543}-${expireDate.month}-${expireDate.day}`).toDate(),
			issuer: issuer,
			created_at: moment().toDate(),
			status: 1,
			village_code: vid,
		}
		// photo is base64
		fs.createWriteStream(`./public/images/${cid}.bmp`).write(Buffer.from(photo, 'base64'));

		await member.updateBy({ village_code: vid, status: 1 }, { status: 0 });

		const result = await member.createOrUpdate({ citizen_id: cid }, data);
		return res.status(200).json({
			success: true, data: {
				message: result ? 'บันทึกข้อมูลเรียบร้อย' : 'อัพเดทข้อมูลเรียบร้อย'
			}
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;