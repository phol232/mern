const express = require('express');
const controller = require('../controllers/topic.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/course/:courseId', authenticate, validateObjectId(['courseId'], 'params'), controller.getByCourse);
router.post('/course/:courseId', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), controller.createTopic);
router.patch('/:topicId', authenticate, authorize('teacher', 'admin'), validateObjectId(['topicId'], 'params'), controller.updateTopic);
router.delete('/:topicId', authenticate, authorize('teacher', 'admin'), validateObjectId(['topicId'], 'params'), controller.deleteTopic);

module.exports = router;
