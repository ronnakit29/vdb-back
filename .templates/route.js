const express = require('express');
const router = express.Router();
const __templateNameToCamelCase__Controller = require('../controllers/__templateNameToCamelCase__.controller.js');

router.post('/', __templateNameToCamelCase__Controller.create__templateNameToPascalCase__);

router.get('/', __templateNameToCamelCase__Controller.getAll__templateNameToPascalCase__s);

router.get('/:id', __templateNameToCamelCase__Controller.get__templateNameToPascalCase__ById);

router.put('/:id', __templateNameToCamelCase__Controller.update__templateNameToPascalCase__);

router.delete('/:id', __templateNameToCamelCase__Controller.delete__templateNameToPascalCase__);

module.exports = router;