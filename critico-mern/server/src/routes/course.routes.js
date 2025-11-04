const express = require('express');
const controller = require('../controllers/course.controller');
const studentsController = require('../controllers/students.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

/**
 * @swagger
 * /courses/available:
 *   get:
 *     summary: Obtener cursos disponibles para inscribirse
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos disponibles
 */
router.get('/available', authenticate, authorize('student'), controller.getAvailableCourses);

/**
 * @swagger
 * /courses/enrolled:
 *   get:
 *     summary: Obtener cursos en los que estoy inscrito
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos inscritos
 */
router.get('/enrolled', authenticate, authorize('student'), controller.getEnrolledCourses);

/**
 * @swagger
 * /courses/{courseId}/students:
 *   get:
 *     summary: Obtener estudiantes de un curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 */
router.get('/:courseId/students', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), studentsController.getCourseStudents);

/**
 * @swagger
 * /courses/{courseId}/student/{studentId}/texts-progress:
 *   get:
 *     summary: Obtener progreso de textos de un estudiante
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progreso del estudiante
 */
router.get('/:courseId/student/:studentId/texts-progress', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId', 'studentId'], 'params'), studentsController.getStudentTextsProgress);

/**
 * @swagger
 * /courses/mine:
 *   get:
 *     summary: Obtener mis cursos (como profesor)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mis cursos
 */
router.get('/mine', authenticate, controller.getMyCourses);

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Obtener curso por ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del curso
 */
router.get('/:courseId', authenticate, validateObjectId(['courseId'], 'params'), controller.getCourseById);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Crear nuevo curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Curso creado
 */
router.post('/', authenticate, authorize('teacher', 'admin'), controller.createCourse);

/**
 * @swagger
 * /courses/{courseId}:
 *   patch:
 *     summary: Actualizar curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso actualizado
 *   delete:
 *     summary: Eliminar curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso eliminado
 */
router.patch('/:courseId', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), controller.updateCourse);
router.delete('/:courseId', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), controller.deleteCourse);

module.exports = router;
