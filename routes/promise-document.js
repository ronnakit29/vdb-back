const express = require('express');
const router = express.Router();
const promiseDocumentController = require('../controllers/promiseDocument.controller.js');
const verifyJWT = require('../middlewares/jwt.js');

router.use(verifyJWT)

router.post('/', promiseDocumentController.createPromiseDocument);

router.get('/', promiseDocumentController.getAllPromiseDocuments);

router.get('/analysis', promiseDocumentController.analysisPromiseByTypeAndDate);

router.get('/member/:citizen_id', promiseDocumentController.checkCitizenPromiseListByCitizenID);

router.get('/checkQuota/:citizen_id', promiseDocumentController.checkQuota);

router.get('/group/:groupId', promiseDocumentController.getPromiseDocumentByGroupId);

router.get('/:id', promiseDocumentController.getPromiseDocumentById);

router.put('/:id', promiseDocumentController.updatePromiseDocument);

router.delete('/:id', promiseDocumentController.deletePromiseDocument);

router.post('/cancel/:groupId', promiseDocumentController.cancelPromiseDocument);

router.post('/end/:groupId', promiseDocumentController.endPromiseDocument);

router.post('/accept/:groupId', promiseDocumentController.acceptPromiseDocument);

router.post('/citizen-data/:groupId', promiseDocumentController.updatePromiseDocumentCitizenCard);

router.get('/loanQuota/:citizen_id', promiseDocumentController.checkPromiseActiveQuota);

router.get('/docs/:citizen_id', promiseDocumentController.promiseListByCitizenId);

module.exports = router;