const express = require('express');
const controller = require('../controllers/topic.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

/**
 * @swagger
 * /topics/course/{courseId}:
 *   get:
 *     summary: Obtener temas de un curso
 *     tags: [Topics]
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
 *         description: Lista de temas
 */
router.get('/course/:courseId', authenticate, validateObjectId(['courseId'], 'params'), controller.getByCourse);

/**
 * @swagger
 * /topics/course/{courseId}:
 *   post:
 *     summary: Crear tema en un curso
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Tema creado
 */
router.post('/course/:courseId', authenticate, authorize('teacher', 'admin'), validateObjectId(['courseId'], 'params'), controller.createTopic);

/**
 * @swagger
 * /topics/{topicId}:
 *   patch:
 *     summary: Actualizar tema
 *     tags: [Topics]
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
 *         description: Tema actualizado
 *   delete:
 *     summary: Eliminar tema
 *     tags: [Topics]
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
 *         description: Tema eliminado
 */
router.patch('/:topicId', authenticate, authorize('teacher', 'admin'), validateObjectId(['topicId'], 'params'), controller.updateTopic);
router.delete('/:topicId', authenticate, authorize('teacher', 'admin'), validateObjectId(['topicId'], 'params'), controller.deleteTopic);

module.exports = router;
