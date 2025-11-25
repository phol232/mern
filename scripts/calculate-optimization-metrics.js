#!/usr/bin/env node

/**
 * Script para calcular métricas de optimización de Docker
 * Genera reporte con emisiones de CO2 estimadas
 */

// Configuración de métricas
const METRICS = {
  // Emisiones de CO2 por MB de RAM por hora (estimado)
  // Basado en consumo energético promedio de servidores
  CO2_PER_MB_HOUR: 0.0004017, // gCO2e
  
  // Factor de ahorro por compresión Gzip
  GZIP_SAVINGS_FACTOR: 0.7, // 70% de ahorro estimado
};

// Consumo ANTES de optimización (MB) - Desarrollo sin límites
const BEFORE = {
  backend: 60,
  frontend: 87,
  mongo: 266,
  mongoExpress: 103,
  total: 516,
};

// Consumo DESPUÉS de optimización (MB) - Producción con límites
const AFTER = {
  backend: 109,
  frontend: 11,
  mongo: 93,
  mongoExpress: 0, // No se usa en producción
  total: 213,
};

function calculateMetrics() {
  const ramSaved = BEFORE.total - AFTER.total;
  const percentageSaved = ((ramSaved / BEFORE.total) * 100).toFixed(2);
  
  // Emisiones por MB base (por hora)
  const emissionsPerMB = METRICS.CO2_PER_MB_HOUR;
  
  // Emisiones ahorradas por hora
  const emissionsSavedPerHour = ramSaved * emissionsPerMB;
  
  // Emisiones ahorradas por día
  const emissionsSavedPerDay = emissionsSavedPerHour * 24;
  
  // Emisiones ahorradas por mes (30 días)
  const emissionsSavedPerMonth = emissionsSavedPerDay * 30;
  
  // Emisiones ahorradas por año
  const emissionsSavedPerYear = emissionsSavedPerDay * 365;
  
  // Ahorro adicional estimado por Gzip
  const gzipSavings = emissionsSavedPerYear * METRICS.GZIP_SAVINGS_FACTOR;
  
  return {
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
      },
      frontend: {
        before: `${BEFORE.frontend}MB`,
        after: `${AFTER.frontend}MB`,
        saved: `${BEFORE.frontend - AFTER.frontend}MB`,
      },
      mongo: {
        before: `${BEFORE.mongo}MB`,
        after: `${AFTER.mongo}MB`,
        saved: `${BEFORE.mongo - AFTER.mongo}MB`,
      },
      mongoExpress: {
        before: `${BEFORE.mongoExpress}MB`,
        after: `${AFTER.mongoExpress}MB (disabled in production)`,
        saved: `${BEFORE.mongoExpress}MB`,
      },
    },
  };
}

function main() {
  const report = calculateMetrics();
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { calculateMetrics };
