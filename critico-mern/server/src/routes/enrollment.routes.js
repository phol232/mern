const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');
const {
  enrollStudent,
  getStudentEnrollments,
  getStudentProgress,
  checkEnrollment,
  updateLastAccess,
  unenrollStudent
} = require('../controllers/enrollment.controller');

router.use(authenticate);
router.post('/', validateObjectId(['studentId', 'courseId'], 'body'), enrollStudent);
router.get('/student/:studentId', validateObjectId(['studentId'], 'params'), getStudentEnrollments);
router.get('/student/:studentId/progress', validateObjectId(['studentId'], 'params'), getStudentProgress);
router.get('/check/:studentId/:courseId', validateObjectId(['studentId', 'courseId'], 'params'), checkEnrollment);
router.put('/:enrollmentId/access', validateObjectId(['enrollmentId'], 'params'), updateLastAccess);
router.delete('/student/:studentId/course/:courseId', validateObjectId(['studentId', 'courseId'], 'params'), unenrollStudent);

module.exports = router;
