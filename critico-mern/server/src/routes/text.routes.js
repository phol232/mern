const express = require('express');
const controller = require('../controllers/text.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

/**
 * @swagger
 * /texts/topic/{topicId}/recommendations:
 *   get:
 *     summary: Obtener recomendaciones de textos para un tema
 *     tags: [Texts]
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
 *         description: Recomendaciones de textos
 */
router.get('/topic/:topicId/recommendations', authenticate, validateObjectId(['topicId'], 'params'), controller.getRecommendations);

/**
 * @swagger
 * /texts/topic/{topicId}:
 *   get:
 *     summary: Obtener textos de un tema
 *     tags: [Texts]
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
 *         description: Lista de textos del tema
 */
router.get('/topic/:topicId', authenticate, validateObjectId(['topicId'], 'params'), controller.getByTopic);

/**
 * @swagger
 * /texts/{textId}/reader:
 *   get:
 *     summary: Obtener estado del lector para un texto
 *     tags: [Texts]
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
 *         description: Estado del lector
 */
router.get('/:textId/reader', authenticate, validateObjectId(['textId'], 'params'), controller.getReaderState);

/**
 * @swagger
 * /texts/preview/{topicId}:
 *   post:
 *     summary: Previsualizar texto generado con IA
 *     tags: [Texts]
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
 *         description: Texto generado
 */
router.post('/preview/:topicId', authenticate, authorize('teacher', 'admin'), validateObjectId(['topicId'], 'params'), controller.previewTextWithAI);

/**
 * @swagger
 * /texts/save/{topicId}:
 *   post:
 *     summary: Guardar texto aprobado
 *     tags: [Texts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Texto guardado
 */
router.post('/save/:topicId', authenticate, authorize('teacher', 'admin'), validateObjectId(['topicId'], 'params'), controller.saveApprovedText);

/**
 * @swagger
 * /texts:
 *   post:
 *     summary: Crear nuevo texto
 *     tags: [Texts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Texto creado
 */
router.post('/', authenticate, authorize('teacher', 'admin'), controller.createText);

/**
 * @swagger
 * /texts/{textId}:
 *   patch:
 *     summary: Actualizar texto
 *     tags: [Texts]
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
 *         description: Texto actualizado
 *   delete:
 *     summary: Eliminar texto
 *     tags: [Texts]
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
 *         description: Texto eliminado
 */
router.patch('/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.updateText);
router.delete('/:textId', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.deleteText);

/**
 * @swagger
 * /texts/{textId}/regenerate:
 *   post:
 *     summary: Regenerar texto con IA
 *     tags: [Texts]
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
 *         description: Texto regenerado
 */
router.post('/:textId/regenerate', authenticate, authorize('teacher', 'admin'), validateObjectId(['textId'], 'params'), controller.regenerateText);

module.exports = router;
