const express = require('express');
const controller = require('../controllers/course.controller');
const studentsController = require('../controllers/students.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/available', authenticate, authorize('student'), controller.getAvailableCourses);
router.get('/enrolled', authenticate, authorize('student'), controller.getEnrolledCourses);

router.get('/:courseId/students', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), studentsController.getCourseStudents);
router.get('/:courseId/student/:studentId/texts-progress', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId', 'studentId'], 'params'), studentsController.getStudentTextsProgress);

router.get('/mine', authenticate, controller.getMyCourses);
router.get('/:courseId', authenticate, validateObjectId(['courseId'], 'params'), controller.getCourseById);
router.post('/', authenticate, authorize('teacher', 'admin'), controller.createCourse);
router.patch('/:courseId', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), controller.updateCourse);
router.delete('/:courseId', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), controller.deleteCourse);

module.exports = router;
