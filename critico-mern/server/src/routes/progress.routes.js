const express = require('express');
const controller = require('../controllers/progress.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/student/:studentId', authenticate, authorize('teacher', 'admin'), validateObjectId(['studentId'], 'params'), controller.getStudentProgress);
router.get('/course/:courseId/metrics', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), controller.getCourseMetrics);

module.exports = router;
