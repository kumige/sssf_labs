'use strict';
// stationRoute
const express = require('express');
const router = express.Router();
const connectionTypeController = require('../controllers/connectionTypeController');

router.get('/', connectionTypeController.connectiontype_list_get);

router.get('/:id', connectionTypeController.connectiontype_get);

router.post('/', connectionTypeController.connectiontype_post);

module.exports = router;
