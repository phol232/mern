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

/**
 * @swagger
 * /attempts:
 *   post:
 *     summary: Guardar intentos de respuesta
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Intentos guardados
 */
router.post('/', saveAttempts);

/**
 * @swagger
 * /attempts/submit:
 *   post:
 *     summary: Enviar intentos de respuesta
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Intentos enviados
 */
router.post('/submit', saveAttempts); 

/**
 * @swagger
 * /attempts/text/{textId}/student/{studentId}:
 *   get:
 *     summary: Obtener intentos de un estudiante en un texto
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: textId
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
 *         description: Lista de intentos
 */
router.get('/text/:textId/student/:studentId', validateObjectId(['textId', 'studentId'], 'params'), getStudentAttempts);

/**
 * @swagger
 * /attempts/student/{studentId}:
 *   get:
 *     summary: Obtener historial de intentos de un estudiante
 *     tags: [Attempts]
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
 *         description: Historial de intentos
 */
router.get('/student/:studentId', validateObjectId(['studentId'], 'params'), getStudentHistory);

/**
 * @swagger
 * /attempts/{attemptId}/feedback:
 *   put:
 *     summary: Actualizar feedback de un intento
 *     tags: [Attempts]
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
 *         description: Feedback actualizado
 */
router.put('/:attemptId/feedback', validateObjectId(['attemptId'], 'params'), updateAttemptFeedback);

module.exports = router;
