const express = require('express');
const controller = require('../controllers/text.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/topic/:topicId/recommendations', authenticate, validateObjectId(['topicId'], 'params'), controller.getRecommendations);
router.get('/topic/:topicId', authenticate, validateObjectId(['topicId'], 'params'), controller.getByTopic);
router.get('/:textId/reader', authenticate, validateObjectId(['textId'], 'params'), controller.getReaderState);
router.post('/preview/:topicId', authenticate, authorize('teacher', 'admin'), validateObjectId(['topicId'], 'params'), controller.previewTextWithAI);
router.post('/save/:topicId', authenticate, authorize('teacher', 'admin'), validateObjectId(['topicId'], 'params'), controller.saveApprovedText);
router.post('/', authenticate, authorize('teacher', 'admin'), controller.createText);
router.patch('/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.updateText);
router.delete('/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.deleteText);
router.post('/:textId/regenerate', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.regenerateText);

module.exports = router;
