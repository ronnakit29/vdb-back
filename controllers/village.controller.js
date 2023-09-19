const Village = require("../classes/Village.class");
const knex = require("../plugins/knex");

const village = new Village(knex)

exports.createVillage = async (req, res) => {
	try {
		const data = {
			...req.body,
		}
		const result = await village.create(data);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.getAllVillages = async (req, res) => {
	try {
		const { village_code } = req.user;
		const result = await village.getBy({ village_code: village_code }, 1000, 'id', 'desc');
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.getVillageById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await village.getById(id);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.updateVillage = async (req, res) => {
	try {
		const { id } = req.params;
		const data = {
			...req.body,
		}
		const result = await village.update(id, data);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.deleteVillage = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await village.delete(id);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};
