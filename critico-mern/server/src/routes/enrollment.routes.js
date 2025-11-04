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

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Inscribir estudiante en un curso
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estudiante inscrito
 */
router.post('/', validateObjectId(['studentId', 'courseId'], 'body'), enrollStudent);

/**
 * @swagger
 * /enrollments/student/{studentId}:
 *   get:
 *     summary: Obtener inscripciones de un estudiante
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de inscripciones
 */
router.get('/student/:studentId', validateObjectId(['studentId'], 'params'), getStudentEnrollments);

/**
 * @swagger
 * /enrollments/student/{studentId}/progress:
 *   get:
 *     summary: Obtener progreso de un estudiante
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progreso del estudiante
 */
router.get('/student/:studentId/progress', validateObjectId(['studentId'], 'params'), getStudentProgress);

/**
 * @swagger
 * /enrollments/check/{studentId}/{courseId}:
 *   get:
 *     summary: Verificar si estudiante está inscrito en curso
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de inscripción
 */
router.get('/check/:studentId/:courseId', validateObjectId(['studentId', 'courseId'], 'params'), checkEnrollment);

/**
 * @swagger
 * /enrollments/{enrollmentId}/access:
 *   put:
 *     summary: Actualizar último acceso
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Acceso actualizado
 */
router.put('/:enrollmentId/access', validateObjectId(['enrollmentId'], 'params'), updateLastAccess);

/**
 * @swagger
 * /enrollments/student/{studentId}/course/{courseId}:
 *   delete:
 *     summary: Desinscribir estudiante de un curso
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudiante desinscrito
 */
router.delete('/student/:studentId/course/:courseId', validateObjectId(['studentId', 'courseId'], 'params'), unenrollStudent);

module.exports = router;
