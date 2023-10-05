const PromiseDocument = require("../classes/PromiseDocument.class");
const Village = require("../classes/Village.class");
const knex = require("../plugins/knex");

const promiseDocument = new PromiseDocument(knex)

exports.createPromiseDocument = async (req, res) => {
	try {
		const { village_code } = req.user;
		const { promiseList, promiseData } = req.body;
		const result = await promiseDocument.groupPromise(village_code, { promiseList, promiseData });
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.checkCitizenPromiseListByCitizenID = async (req, res) => {
	try {
		const { citizen_id } = req.params;
		const result = await promiseDocument.getBy({ citizen_id: citizen_id }, 1000, 'id', 'desc');
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.analysisPromiseByTypeAndDate = async (req, res) => {
	try {
		const { village, role } = req.user;
		const { type, startDate, endDate, vid } = req.query;
		const params = {
			status: 1
		}
		if (role !== 'master') {
			params.village_id = village.id
		} else {
			params.village_id = vid
		}
		if (type) params.type = type
		const count = await promiseDocument.count(params, { start: startDate, end: endDate });
		const sum = await promiseDocument.sum(params, { start: startDate, end: endDate }, 'amount');
		const hedge_fund = await promiseDocument.sum(params, { start: startDate, end: endDate }, 'hedge_fund');
		return res.status(200).json({
			success: true, data: {
				count,
				sum,
				hedge_fund
			}
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

exports.getPromiseDocumentByGroupId = async (req, res) => {
	try {
		const { groupId } = req.params;
		if (!groupId) throw new Error('ไม่พบข้อมูลกลุ่ม')
		const result = await promiseDocument.getBy({ group_id: groupId }, 10, 'id', 'desc', null, {});
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

exports.checkQuota = async (req, res) => {
	try {
		const { citizen_id } = req.params;
		const result = await promiseDocument.checkQuota(citizen_id);
		const quota = result;
		return res.status(200).json({ success: true, data: quota });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

exports.getAllPromiseDocuments = async (req, res) => {
	try {
		const { village, role } = req.user;
		const { type, startDate, endDate } = req.query;
		const params = {}
		if (role !== 'master') {
			params['promise_document.village_id'] = village.id
		} else {
			const { vid } = req.query;
			params['promise_document.village_id'] = vid
		}

		if (type) params.type = type
		const result = await promiseDocument.getBy(params, 5000, 'id', 'desc', null, { start: startDate, end: endDate });
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.getPromiseDocumentById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await promiseDocument.getById(id);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.updatePromiseDocument = async (req, res) => {
	try {
		const { id } = req.params;
		const data = {
			...req.body,
		}
		const result = await promiseDocument.update(id, data);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.deletePromiseDocument = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await promiseDocument.delete(id);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.cancelPromiseDocument = async (req, res) => {
	try {
		const { groupId } = req.params
		const result = await promiseDocument.cancelPromiseDocument(groupId);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}
exports.endPromiseDocument = async (req, res) => {
	try {
		const { groupId } = req.params
		const result = await promiseDocument.endPromiseDocument(groupId);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}
exports.acceptPromiseDocument = async (req, res) => {
	try {
		const { groupId } = req.params
		const result = await promiseDocument.acceptPromiseDocument(groupId);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}
exports.updatePromiseDocumentCitizenCard = async (req, res) => {
	try {
		const { witness1_citizen_id, witness2_citizen_id, employee_citizen_id, manager_citizen_id } = req.body
		const { groupId } = req.params
		const params = {}
		if (witness1_citizen_id) params.witness1_citizen_id = witness1_citizen_id
		if (witness2_citizen_id) params.witness2_citizen_id = witness2_citizen_id
		if (employee_citizen_id) params.employee_citizen_id = employee_citizen_id
		if (manager_citizen_id) params.manager_citizen_id = manager_citizen_id

		if (!witness1_citizen_id && !witness2_citizen_id && !employee_citizen_id && !manager_citizen_id) throw new Error('ไม่พบข้อมูลผู้ค้ำหรือเจ้าหน้าที่')
		console.log(req.body)
		const result = await promiseDocument.updatePromiseDocumentCitizenCard(groupId, params);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

exports.checkPromiseActiveQuota = async (req, res) => {
	try {
		const { citizen_id } = req.params
		const result = await promiseDocument.checkPromiseActiveQuota(citizen_id);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error)
		return res.status(500).json({ success: false, error: error.message });
	}
}

exports.promiseListByCitizenId = async (req, res) => {
	try {
		const { citizen_id } = req.params
		const result = await promiseDocument.getBy({ citizen_id: citizen_id }, 1000, 'id', 'desc');
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error)
		return res.status(500).json({ success: false, error: error.message });
	}
}