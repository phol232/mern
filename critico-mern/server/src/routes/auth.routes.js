const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *                 default: student
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Correo inválido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('role').optional().isIn(['student', 'teacher', 'admin'])
  ],
  controller.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  controller.login
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de recuperación enviado
 *       404:
 *         description: Usuario no encontrado
 */
router.post(
  '/forgot-password',
  [
    body('email').isEmail()
  ],
  controller.forgotPassword
);

module.exports = router;
