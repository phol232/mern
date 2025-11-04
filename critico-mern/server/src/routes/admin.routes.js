const express = require('express');
const controller = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middleware/validateObjectId');

const router = express.Router();

/**
 * @swagger
 * /admin/users/{userId}/role:
 *   patch:
 *     summary: Actualizar rol de usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *     responses:
 *       200:
 *         description: Rol actualizado
 */
router.patch('/users/:userId/role', authenticate, authorize('admin'), validateObjectId(['userId'], 'params'), controller.updateUserRole);

/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: Listar logs de auditoría
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de logs
 */
router.get('/audit-logs', authenticate, authorize('admin'), controller.listAuditLogs);

module.exports = router;
