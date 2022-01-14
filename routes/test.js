const Express = require('express');
const SiteController = require('../app/Controllers/SiteController');

const router = Express.Router();
const siteController = new SiteController();

router.get('/', siteController.index);

module.exports = router;