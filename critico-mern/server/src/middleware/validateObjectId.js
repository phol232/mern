const mongoose = require('mongoose');

/**
 * Middleware para validar ObjectIds en parámetros de ruta y cuerpo de petición
 * @param {Array} fields - Array de campos a validar (ej: ['studentId', 'courseId'])
 * @param {String} source - 'params' o 'body' para indicar dónde buscar los campos
 */
const validateObjectId = (fields, source = 'params') => {
  return (req, res, next) => {
    const data = source === 'params' ? req.params : req.body;
    
    for (const field of fields) {
      const value = data[field];
      
      if (value) {
        // Intentar limpiar el ID primero
        const cleanedId = cleanObjectId(value);
        
        if (!cleanedId) {
          return res.status(400).json({
            message: `${field} inválido`,
            details: `El ID "${value}" no es un ObjectId válido (debe tener exactamente 24 caracteres hexadecimales)`,
            field,
            receivedValue: value,
            receivedLength: value ? value.length : 0
          });
        }
        
        // Reemplazar el valor con el ID limpio
        data[field] = cleanedId;
      }
    }
    
    next();
  };
};

/**
 * Función helper para validar un ObjectId individual
 * @param {String} id - El ID a validar
 * @returns {Boolean} - true si es válido, false si no
 */
const isValidObjectId = (id) => {
  return id && mongoose.Types.ObjectId.isValid(id) && id.length === 24;
};

/**
 * Función para limpiar ObjectIds (remover caracteres extra)
 * @param {String} id - El ID a limpiar
 * @returns {String} - ID limpio de 24 caracteres o null si no es válido
 */
const cleanObjectId = (id) => {
  if (!id || typeof id !== 'string') return null;
  
  // Remover caracteres no hexadecimales
  const cleaned = id.replace(/[^a-fA-F0-9]/g, '');
  
  // Si tiene más de 24 caracteres, tomar solo los primeros 24
  if (cleaned.length >= 24) {
    const truncated = cleaned.substring(0, 24);
    return isValidObjectId(truncated) ? truncated : null;
  }
  
  return null;
};

module.exports = {
  validateObjectId,
  isValidObjectId,
  cleanObjectId
};