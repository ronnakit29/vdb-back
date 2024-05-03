const express = require('express');
const router = express.Router();
const multer = require('multer');

// Define your routes here
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Make sure this folder exists, or multer will throw an error
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/file', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        return res.status(200).json({ success: true, data: req.file });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;