const express = require('express');
const controller = require('../controllers/question.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/text/:textId', authenticate, validateObjectId(['textId'], 'params'), controller.getByText);
router.post('/text/:textId/submit', authenticate, validateObjectId(['textId'], 'params'), controller.submitAnswers);
router.post('/preview/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.previewQuestionsWithAI);
router.post('/save/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.saveApprovedQuestions);
router.post('/', authenticate, authorize('teacher', 'admin'), controller.createQuestion);
router.patch('/:questionId', authenticate, authorize('teacher', 'admin'), validateObjectId(['questionId'], 'params'), controller.updateQuestion);
router.delete('/:questionId', authenticate, authorize('teacher', 'admin'), validateObjectId(['questionId'], 'params'), controller.deleteQuestion);
router.delete('/text/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.deleteAllQuestions);
router.post('/attempt/:attemptId/feedback', authenticate, validateObjectId(['attemptId'], 'params'), controller.generateAutoFeedback);

module.exports = router;
