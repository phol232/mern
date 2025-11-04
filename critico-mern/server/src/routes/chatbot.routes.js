const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
  tutorChat,
  tutorChatTest,
  getQuickSuggestions
} = require('../controllers/chatbot.controller');

router.use(authenticate);

/**
 * @swagger
 * /chatbot/tutor:
 *   post:
 *     summary: Chat con tutor virtual
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               context:
 *                 type: object
 *     responses:
 *       200:
 *         description: Respuesta del tutor
 */
router.post('/tutor', tutorChat);

/**
 * @swagger
 * /chatbot/tutor-test:
 *   post:
 *     summary: Probar chat con tutor (modo test)
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Respuesta de prueba
 */
router.post('/tutor-test', tutorChatTest);

/**
 * @swagger
 * /chatbot/suggestions:
 *   post:
 *     summary: Obtener sugerencias rápidas
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sugerencias
 */
router.post('/suggestions', getQuickSuggestions);

module.exports = router;
