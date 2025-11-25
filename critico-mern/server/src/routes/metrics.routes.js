const express = require('express');
const metricsController = require('../controllers/metrics.controller');

const router = express.Router();

/**
 * @swagger
 * /api/metrics/optimization:
 *   post:
 *     summary: Calcula métricas de optimización y emisiones de CO2
 *     description: Endpoint público para calcular ahorro de recursos y emisiones de carbono
 *     tags: [Metrics]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               before:
 *                 type: object
 *                 properties:
 *                   backend:
 *                     type: number
 *                   frontend:
 *                     type: number
 *                   mongo:
 *                     type: number
 *                   mongoExpress:
 *                     type: number
 *               after:
 *                 type: object
 *                 properties:
 *                   backend:
 *                     type: number
 *                   frontend:
 *                     type: number
 *                   mongo:
 *                     type: number
 *                   mongoExpress:
 *                     type: number
 *     responses:
 *       200:
 *         description: Métricas calculadas exitosamente
 *       500:
 *         description: Error al calcular métricas
 */
router.post('/optimization', metricsController.calculateOptimizationMetrics);

/**
 * @swagger
 * /api/metrics/optimization:
 *   get:
 *     summary: Obtiene métricas de optimización con valores por defecto
 *     description: Endpoint público que devuelve métricas usando valores predeterminados
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Métricas obtenidas exitosamente
 */
router.get('/optimization', metricsController.getDefaultMetrics);

module.exports = router;
