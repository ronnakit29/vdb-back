const knex = require("../plugins/knex");
const __templateNameToPascalCase__ = require("../classes/__templateNameToPascalCase__.class");
const __templateNameToCamelCase__ = new __templateNameToPascalCase__(knex)

exports.create__templateNameToPascalCase__ = async (req, res) => {
	try {
		const data = {
			...req.body,
		}
		const result = await __templateNameToCamelCase__.create(data);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.getAll__templateNameToPascalCase__s = async (req, res) => {
	try {
		const result = await __templateNameToCamelCase__.getAll();
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.get__templateNameToPascalCase__ById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await __templateNameToCamelCase__.getById(id);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.update__templateNameToPascalCase__ = async (req, res) => {
	try {
		const { id } = req.params;
		const data = {
			...req.body,
		}
		const result = await __templateNameToCamelCase__.update(id, data);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.delete__templateNameToPascalCase__ = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await __templateNameToCamelCase__.delete(id);
		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};
