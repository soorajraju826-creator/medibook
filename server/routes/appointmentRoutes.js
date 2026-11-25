const router = require('express').Router();
const controller = require('../controllers/appointmentController');
const { protect, allowRoles } = require('../middleware/auth');
router.use(protect);
router.get('/mine', controller.mine);
router.post('/', allowRoles('patient'), controller.create);
router.patch('/:id/status', controller.updateStatus);
module.exports = router;
