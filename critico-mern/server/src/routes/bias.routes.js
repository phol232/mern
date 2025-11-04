const express = require('express');
const controller = require('../controllers/bias.controller');
const { authenticate } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

/**
 * @swagger
 * /biases/analyze-content:
 *   post:
 *     summary: Analizar sesgos en contenido directo
 *     tags: [Biases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Análisis de sesgos
 */
router.post('/analyze-content', authenticate, controller.analyzeTextContent);

/**
 * @swagger
 * /biases/analyze-text/{textId}:
 *   post:
 *     summary: Analizar sesgos en un texto guardado
 *     tags: [Biases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: textId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Análisis de sesgos del texto
 */
router.post('/analyze-text/:textId', authenticate, validateObjectId(['textId'], 'params'), controller.analyzeText);

/**
 * @swagger
 * /biases/analyze-student-answer/{attemptId}:
 *   post:
 *     summary: Analizar sesgos en respuesta de estudiante
 *     tags: [Biases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Análisis de sesgos en respuesta
 */
router.post('/analyze-student-answer/:attemptId', authenticate, validateObjectId(['attemptId'], 'params'), controller.analyzeStudentAnswer);

/**
 * @swagger
 * /biases/save-student-analysis/{attemptId}:
 *   post:
 *     summary: Guardar análisis de sesgos de estudiante
 *     tags: [Biases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Análisis guardado
 */
router.post('/save-student-analysis/:attemptId', authenticate, validateObjectId(['attemptId'], 'params'), controller.saveStudentAnalysis);

/**
 * @swagger
 * /biases/analyze-attempt/{attemptId}:
 *   post:
 *     summary: Analizar sesgos en intento (método legacy)
 *     tags: [Biases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Análisis de sesgos
 */
router.post('/analyze-attempt/:attemptId', authenticate, validateObjectId(['attemptId'], 'params'), controller.analyzeAttempt);

/**
 * @swagger
 * /biases/{relatedTo}/{relatedId}:
 *   get:
 *     summary: Obtener sesgos guardados
 *     tags: [Biases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: relatedTo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: relatedId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de sesgos
 */
router.get('/:relatedTo/:relatedId', authenticate, validateObjectId(['relatedId'], 'params'), controller.getBiases);

/**
 * @swagger
 * /biases/{biasId}/resolve:
 *   patch:
 *     summary: Marcar sesgo como resuelto
 *     tags: [Biases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: biasId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sesgo marcado como resuelto
 */
router.patch('/:biasId/resolve', authenticate, validateObjectId(['biasId'], 'params'), controller.resolveBias);

/**
 * @swagger
 * /biases/course/{courseId}/statistics:
 *   get:
 *     summary: Obtener estadísticas de sesgos del curso
 *     tags: [Biases]
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
 *         description: Estadísticas de sesgos
 */
router.get('/course/:courseId/statistics', authenticate, validateObjectId(['courseId'], 'params'), controller.getCourseStatistics);

/**
 * @swagger
 * /biases/topic/{topicId}/summary:
 *   get:
 *     summary: Obtener resumen de sesgos por tema
 *     tags: [Biases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resumen de sesgos
 */
router.get('/topic/:topicId/summary', authenticate, validateObjectId(['topicId'], 'params'), controller.getTopicSummary);

module.exports = router;
