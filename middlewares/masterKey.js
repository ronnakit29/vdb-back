function masterKey(req, res, next) {
	// from env
	if (!req.headers["x-master-key"] && !req.query.masterKey) {
		return res.status(401).json({ success: false, error: "Unauthorized" });
	}
	const masterKey = req.headers["x-master-key"] || req.query.masterKey;
	if (masterKey !== process.env.MASTER_KEY) {
		return res.status(401).json({ success: false, error: "Unauthorized" });
	}
	next();
}

module.exports = masterKey;