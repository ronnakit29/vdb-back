const knex = require('../plugins/knex');
const User = require('../classes/User.class');
const JwtService = require('../classes/JwtService.class');
const user = new User(knex);
const jwt = new JwtService(process.env.JWT_SECRET);
async function verifyJWT(req, res, next) {
	try {
		const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
		if (!token) throw new Error('No token provided');
		const decoded = await jwt.verifyToken(token);
		if (!decoded) throw new Error('Invalid token');
		const getUser = await user.getFirstBy({ id: decoded.id })
		delete getUser.password;
		req.user = getUser;
		next();
	} catch (error) {
		return res.status(401).json({ status: false, message: error.message });
	}
}

module.exports = verifyJWT;