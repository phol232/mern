const express = require('express');
const controller = require('../controllers/progress.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

/**
 * @swagger
 * /progress/student/{studentId}:
 *   get:
 *     summary: Obtener progreso de un estudiante
 *     tags: [Progress]
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
router.get('/student/:studentId', authenticate, authorize('teacher', 'admin'), validateObjectId(['studentId'], 'params'), controller.getStudentProgress);

/**
 * @swagger
 * /progress/course/{courseId}/metrics:
 *   get:
 *     summary: Obtener métricas de un curso
 *     tags: [Progress]
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
 *         description: Métricas del curso
 */
router.get('/course/:courseId/metrics', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), controller.getCourseMetrics);

module.exports = router;
