/**
 * Controlador para métricas de optimización del sistema
 * Calcula emisiones de CO2 y ahorro de recursos
 */

const METRICS_CONFIG = {
  CO2_PER_MB_HOUR: 0.0004017, // gCO2e por MB de RAM por hora
  GZIP_SAVINGS_FACTOR: 0.7, // 70% de ahorro estimado por compresión
};

/**
 * Calcula métricas de optimización basadas en consumo de RAM
 * @param {Object} req - Request con datos before/after en body
 * @param {Object} res - Response con métricas calculadas
 */
exports.calculateOptimizationMetrics = (req, res) => {
  try {
    const { before, after } = req.body;

    // Valores por defecto si no se envían (basados en mediciones reales)
    const BEFORE = before || {
      backend: 60,
      frontend: 87,
      mongo: 266,
      mongoExpress: 103,
      total: 516,
    };

    const AFTER = after || {
      backend: 109,
      frontend: 11,
      mongo: 93,
      mongoExpress: 0,
      total: 213,
    };

    // Calcular totales si no vienen
    if (!BEFORE.total) {
      BEFORE.total = BEFORE.backend + BEFORE.frontend + BEFORE.mongo + BEFORE.mongoExpress;
    }
    if (!AFTER.total) {
      AFTER.total = AFTER.backend + AFTER.frontend + AFTER.mongo + AFTER.mongoExpress;
    }

    const ramSaved = BEFORE.total - AFTER.total;
    const percentageSaved = ((ramSaved / BEFORE.total) * 100).toFixed(2);

    // Cálculos de emisiones
    const emissionsPerMB = METRICS_CONFIG.CO2_PER_MB_HOUR;
    const emissionsSavedPerHour = ramSaved * emissionsPerMB;
    const emissionsSavedPerDay = emissionsSavedPerHour * 24;
    const emissionsSavedPerMonth = emissionsSavedPerDay * 30;
    const emissionsSavedPerYear = emissionsSavedPerDay * 365;
    const gzipSavings = emissionsSavedPerYear * METRICS_CONFIG.GZIP_SAVINGS_FACTOR;

    // Equivalencias ambientales
    const treesEquivalent = (emissionsSavedPerYear / 22000).toFixed(2); // 1 árbol absorbe ~22kg CO2/año
    const kmDrivenSaved = (emissionsSavedPerYear / 235).toFixed(2); // ~235g CO2/km promedio
    const smartphonesCharged = Math.floor(emissionsSavedPerYear / 8.17); // ~8.17g CO2 por carga

    const response = {
      status: "Green Software Optimized",
      metrics: {
        ram_before_mb: BEFORE.total,
        ram_after_mb: AFTER.total,
        ram_saved_mb: ramSaved,
        percentage_saved: `${percentageSaved}%`,
        emissions_per_MB_base: `${emissionsPerMB.toFixed(4)} gCO2e`,
        emissions_saved_per_hour: `${emissionsSavedPerHour.toFixed(4)} gCO2e`,
        emissions_saved_per_day: `${emissionsSavedPerDay.toFixed(4)} gCO2e`,
        emissions_saved_per_month: `${emissionsSavedPerMonth.toFixed(2)} gCO2e`,
        emissions_saved_per_year: `${emissionsSavedPerYear.toFixed(2)} gCO2e`,
        emissions_saved_by_gzip: `${gzipSavings.toFixed(4)} gCO2e (Estimado)`,
      },
      message: "Servidor optimizado con compresión Gzip para reducir huella de carbono.",
      breakdown: {
        backend: {
          before: `${BEFORE.backend}MB`,
          after: `${AFTER.backend}MB`,
          saved: `${BEFORE.backend - AFTER.backend}MB`,
          percentage: `${(((BEFORE.backend - AFTER.backend) / BEFORE.backend) * 100).toFixed(1)}%`,
        },
        frontend: {
          before: `${BEFORE.frontend}MB`,
          after: `${AFTER.frontend}MB`,
          saved: `${BEFORE.frontend - AFTER.frontend}MB`,
          percentage: `${(((BEFORE.frontend - AFTER.frontend) / BEFORE.frontend) * 100).toFixed(1)}%`,
        },
        mongo: {
          before: `${BEFORE.mongo}MB`,
          after: `${AFTER.mongo}MB`,
          saved: `${BEFORE.mongo - AFTER.mongo}MB`,
          percentage: `${(((BEFORE.mongo - AFTER.mongo) / BEFORE.mongo) * 100).toFixed(1)}%`,
        },
        mongoExpress: {
          before: `${BEFORE.mongoExpress}MB`,
          after: `${AFTER.mongoExpress}MB (disabled in production)`,
          saved: `${BEFORE.mongoExpress}MB`,
          percentage: "100%",
        },
      },
      equivalencies: {
        trees_planted_equivalent: `${treesEquivalent} árboles/año`,
        km_driven_saved: `${kmDrivenSaved} km en auto/año`,
        smartphones_charged: `${smartphonesCharged} cargas/año`,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al calcular métricas de optimización",
      error: error.message,
    });
  }
};

/**
 * Obtiene métricas con valores por defecto (sin autenticación)
 */
exports.getDefaultMetrics = (req, res) => {
  // Llamar al mismo controlador con valores por defecto
  req.body = {};
  exports.calculateOptimizationMetrics(req, res);
};
