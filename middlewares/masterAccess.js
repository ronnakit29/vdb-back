const Village = require("../classes/Village.class");
const knex = require("../plugins/knex");

async function masterAccess(req, res, next) {
    try {
        const { role } = req.user;
        const { vid } = req.query;
        const village = new Village(knex);
        if (role === 'master') {
            if (!vid) throw new Error('กรุณาเลือกหมู่บ้าน')
            const getVillage = await village.getFirstBy({ id: vid });
            req.village = getVillage;
            return next();
        } else {
            const getVillage = await village.getFirstBy({ code: req.user.village_code });
            req.village = getVillage;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = masterAccess;