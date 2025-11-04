const express = require('express');
const controller = require('../controllers/question.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

/**
 * @swagger
 * /questions/text/{textId}:
 *   get:
 *     summary: Obtener preguntas de un texto
 *     tags: [Questions]
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
 *         description: Lista de preguntas
 */
router.get('/text/:textId', authenticate, validateObjectId(['textId'], 'params'), controller.getByText);

/**
 * @swagger
 * /questions/text/{textId}/submit:
 *   post:
 *     summary: Enviar respuestas a preguntas
 *     tags: [Questions]
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
 *         description: Respuestas enviadas
 */
router.post('/text/:textId/submit', authenticate, validateObjectId(['textId'], 'params'), controller.submitAnswers);

/**
 * @swagger
 * /questions/preview/{textId}:
 *   post:
 *     summary: Previsualizar preguntas generadas con IA
 *     tags: [Questions]
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
 *         description: Preguntas generadas
 */
router.post('/preview/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.previewQuestionsWithAI);

/**
 * @swagger
 * /questions/save/{textId}:
 *   post:
 *     summary: Guardar preguntas aprobadas
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: textId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Preguntas guardadas
 */
router.post('/save/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.saveApprovedQuestions);

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Crear pregunta manualmente
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Pregunta creada
 */
router.post('/', authenticate, authorize('teacher', 'admin'), controller.createQuestion);

/**
 * @swagger
 * /questions/{questionId}:
 *   patch:
 *     summary: Actualizar pregunta
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pregunta actualizada
 *   delete:
 *     summary: Eliminar pregunta
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pregunta eliminada
 */
router.patch('/:questionId', authenticate, authorize('teacher', 'admin'), validateObjectId(['questionId'], 'params'), controller.updateQuestion);
router.delete('/:questionId', authenticate, authorize('teacher', 'admin'), validateObjectId(['questionId'], 'params'), controller.deleteQuestion);

/**
 * @swagger
 * /questions/text/{textId}:
 *   delete:
 *     summary: Eliminar todas las preguntas de un texto
 *     tags: [Questions]
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
 *         description: Preguntas eliminadas
 */
router.delete('/text/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.deleteAllQuestions);

/**
 * @swagger
 * /questions/attempt/{attemptId}/feedback:
 *   post:
 *     summary: Generar feedback automático para un intento
 *     tags: [Questions]
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
 *         description: Feedback generado
 */
router.post('/attempt/:attemptId/feedback', authenticate, validateObjectId(['attemptId'], 'params'), controller.generateAutoFeedback);

module.exports = router;
