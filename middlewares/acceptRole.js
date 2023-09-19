function acceptRole(acceptRoles = []) {
	return async (req, res, next) => {
		try {
			if (!req.user) {
				throw new Error('กรุณาเข้าสู่ระบบก่อน');
			}
			const { role } = req.user;
			const hasRole = acceptRoles.includes(role);
			if (!hasRole) {
				throw new Error('ไม่มีสิทธิ์ในการเข้าถึง');
			}
			next();
		} catch (error) {
			console.error(error);
			res.status(401).json({ status: false, error: error.message });
		}
	}
}

module.exports = acceptRole;