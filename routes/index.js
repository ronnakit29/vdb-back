const express = require('express');
const router = express.Router();

// Define your routes here

router.use('/analysis', require('./analysis.js'));
router.use('/read-citizen-card', require('./read-citizen-card'));
router.use('/member', require('./member'));
router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/promise-document', require('./promise-document'));
router.use('/income-expenses', require('./income-expenses'));
router.use('/village', require('./village'));
router.use('/promise-year', require('./promise-year'));

module.exports = router;