const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');
const {
  saveAttempts,
  getStudentAttempts,
  getStudentHistory,
  updateAttemptFeedback
} = require('../controllers/attempt.controller');

router.use(authenticate);

router.post('/', saveAttempts);
router.post('/submit', saveAttempts); 

router.get('/text/:textId/student/:studentId', validateObjectId(['textId', 'studentId'], 'params'), getStudentAttempts);

router.get('/student/:studentId', validateObjectId(['studentId'], 'params'), getStudentHistory);

router.put('/:attemptId/feedback', validateObjectId(['attemptId'], 'params'), updateAttemptFeedback);

module.exports = router;
