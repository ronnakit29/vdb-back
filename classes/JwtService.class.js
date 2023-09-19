const jwt = require('jsonwebtoken');

class JwtService {
	 constructor(secret) {
		 this.secret = secret;
	 }

	 generateToken(payload, expiresIn) {
		 return jwt.sign(payload, this.secret, { expiresIn });
	 }

	 verifyToken(token) {
		 return new Promise((resolve, reject) => {
				jwt.verify(token, this.secret, (error, decoded) => {
					if (error) {
						 return reject(error);
					}
					return resolve(decoded);
				});
		 });
	 }
}

module.exports = JwtService;