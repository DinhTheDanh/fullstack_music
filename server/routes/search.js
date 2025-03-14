const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const verifyAdmin = require('../middleware/verifyAdmin');

const SearchController = require('../app/controllers/SearchController');

router.get('/', SearchController.search);

module.exports = router;
