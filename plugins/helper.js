const crypto = require('crypto');
function hashMD5(str) {
    const createHash = crypto.createHash('md5');
    createHash.update(str);
    return createHash.digest('hex');
}

module.exports = hashMD5;