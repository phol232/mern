const fetch = require('node-fetch');

const CORA_AGENT_URL = process.env.CORA_AGENT_URL;
const CORA_CHATBOT_ID = process.env.CORA_CHATBOT_ID;
const CORA_API_KEY = process.env.CORA_API_KEY;

// ⏱️ Rate limiting configuration - MUY CONSERVADOR para evitar 429
const RATE_LIMIT = {
  minTimeBetweenRequests: 5000, // 🔥 5 SEGUNDOS entre cada request (muy conservador)
  maxRetries: 1, // 🔥 Solo 1 reintento (no 3)
  retryDelay: 10000 // 🔥 Esperar 10s antes de reintentar
};

// 🚦 Cola ESTRICTA de requests - UN request a la vez con delays largos
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      const queueLength = this.queue.length;
      if (queueLength > 1) {
        console.log(`🚦 Request en cola. Posición: ${queueLength}. Espera estimada: ~${queueLength * 5}s`);
      }
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const { fn, resolve, reject } = this.queue.shift();
    
    try {
      // 🔥 SIEMPRE esperar el tiempo mínimo entre requests
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < RATE_LIMIT.minTimeBetweenRequests) {
        const waitTime = RATE_LIMIT.minTimeBetweenRequests - timeSinceLastRequest;
        console.log(`⏸️  Esperando ${(waitTime/1000).toFixed(1)}s antes del siguiente request (rate limiting)...`);
        await new Promise(r => setTimeout(r, waitTime));
      }
      
      this.lastRequestTime = Date.now();
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      // 🔥 Delay adicional antes de procesar el siguiente
      if (this.queue.length > 0) {
        setTimeout(() => this.process(), 500);
      }
    }
  }
}

const requestQueue = new RequestQueue();

// 🔄 Fetch simple con UN solo reintento conservador
async function fetchWithRetry(url, options, retryCount = 0) {
  try {
    const response = await fetch(url, options);
    
    // 🔥 Si es 429, solo 1 reintento después de 10 segundos
    if (response.status === 429 && retryCount === 0) {
      console.log(`⏳ Rate limit (429). Esperando ${RATE_LIMIT.retryDelay/1000}s antes de reintentar...`);
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.retryDelay));
      return fetchWithRetry(url, options, 1);
    }
    
    return response;
  } catch (error) {
    // 🔥 NO reintentar errores de red - fallar rápido
    throw error;
  }
}

// 🎯 Wrapper que usa la cola + retry conservador
async function queuedFetch(url, options) {
  return requestQueue.add(() => fetchWithRetry(url, options));
}

const PROHIBITED_REPLACEMENTS = {
  todos: 'la mayoría',
  todo: 'la mayoría',
  todas: 'la mayoría',
  toda: 'la mayoría',
  cada: 'varios',
  ninguna: 'pocas',
  ninguno: 'pocos',
  ningún: 'pocos'
};

const escapeRegExp = (text) => text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

const applyReplacementCasing = (original, replacement) => {
  if (!original) return replacement;
  const isUpperCase = original === original.toUpperCase();
  const isCapitalized = original[0] === original[0].toUpperCase();

  if (isUpperCase) {
    return replacement.toUpperCase();
  }
  if (isCapitalized) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
};

const replaceProhibitedWords = (text, words) => {
  if (!text || !Array.isArray(words) || words.length === 0) {
    return { text, replacementsApplied: [] };
  }

  let updated = text;
  const replacementsApplied = [];

  words.forEach(word => {
    const normalized = typeof word === 'string' ? word.toLowerCase().trim() : '';
    if (!normalized) return;

    const replacement = PROHIBITED_REPLACEMENTS[normalized] || 'varios';
    const regex = new RegExp(`(?<=^|[^\\p{L}\\p{N}_])${escapeRegExp(normalized)}(?=$|[^\\p{L}\\p{N}_])`, 'giu');

    if (regex.test(updated)) {
      updated = updated.replace(regex, match => applyReplacementCasing(match, replacement));
      replacementsApplied.push({ palabra: normalized, reemplazo: replacement });
    }
  });

  return { text: updated, replacementsApplied };
};

const containsProhibitedWord = (text, word) => {
  if (!text || !word) return false;
  const regex = new RegExp(`(?<=^|[^\\p{L}\\p{N}_])${escapeRegExp(word)}(?=$|[^\\p{L}\\p{N}_])`, 'iu');
  return regex.test(text);
};

const countGlossaryItems = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const sections = text.split(/\*\*Glosario breve\*\*/i);
  if (sections.length < 2) return 0;

  const glossaryPart = sections[1];
  return glossaryPart
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .length;
};

const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .length;
};

const normalizeDiacritics = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Genera un texto educativo usando el agente CORA de DigitalOcean
 * @param {Object} config - Configuración para la generación
 * @param {string} config.tema - Tema del texto
 * @param {string} config.publico - Público objetivo
 * @param {string} config.nivel - Nivel de complejidad
 * @param {string} config.proposito - Propósito del texto
 * @param {number} config.ventanaInicio - Año de inicio de la ventana temporal
 * @param {number} config.ventanaFin - Año de fin de la ventana temporal
 * @param {string} config.idioma - Idioma del texto
 * @returns {Promise<Object>} Respuesta del agente CORA
 */
// 🔥 OPTIMIZACIÓN DE PAYLOAD - Límites estrictos para reducir tokens
const PAYLOAD_LIMITS = {
  MAX_TEXT_LENGTH: 2000,        // Máximo 2000 caracteres de texto original
  MAX_BIAS_DESCRIPTIONS: 300,   // Máximo 300 caracteres para descripciones de sesgos
  MAX_INSTRUCTIONS: 200,        // Máximo 200 caracteres para instrucciones adicionales
  MAX_CONTEXT: 500,            // Máximo 500 caracteres de contexto
  MAX_TOTAL_PAYLOAD: 3000      // Máximo total del mensaje
};

// 🔧 Función para truncar texto inteligentemente
function smartTruncateText(text, maxLength, preserveEnd = false) {
  if (!text || text.length <= maxLength) return text;
  
  if (preserveEnd) {
    // Para texto original, preservar el final que puede tener conclusiones importantes
    const start = text.substring(0, Math.floor(maxLength * 0.6));
    const end = text.substring(text.length - Math.floor(maxLength * 0.4));
    return `${start}\n\n[...CONTENIDO TRUNCADO...]\n\n${end}`;
  } else {
    // Para descripciones, tomar solo el inicio
    return text.substring(0, maxLength - 3) + '...';
  }
}

// 🔧 Función para optimizar descripciones de sesgos
function optimizeBiasDescriptions(biases) {
  if (!biases || biases.length === 0) return [];
  
  return biases.slice(0, 3).map(bias => ({
    type: bias.type,
    // Solo palabras problemáticas, sin descripciones largas
    palabrasProblematicas: bias.palabrasProblematicas?.slice(0, 5) || [],
    severity: bias.severity
  }));
}

// 🔧 Función para crear mensaje optimizado
function createOptimizedMessage(config) {
  const isCorrectionMode = Array.isArray(config.sesgosDetectados) && config.sesgosDetectados.length > 0;
  
  if (isCorrectionMode) {
    // Extraer solo palabras problemáticas (sin descripciones largas)
    const palabrasProblematicas = new Set();
    config.sesgosDetectados.forEach(sesgo => {
      if (sesgo.palabrasProblematicas && sesgo.palabrasProblematicas.length > 0) {
        sesgo.palabrasProblematicas.slice(0, 5).forEach(p => palabrasProblematicas.add(p.toLowerCase()));
      }
    });
    
    const palabrasArray = Array.from(palabrasProblematicas).slice(0, 10); // Máximo 10 palabras
    
    // Mensaje ultra-compacto
    let userMessage = `MODO=CORREGIR\nPRODUCE=TEXTO\n`;
    
    if (palabrasArray.length > 0) {
      userMessage += `REEMPLAZAR: ${palabrasArray.join(', ')}\n`;
    }
    
    // Instrucciones del docente (truncadas)
    if (config.instruccionesDocente && config.instruccionesDocente.trim()) {
      const instruccionesTruncadas = smartTruncateText(config.instruccionesDocente, PAYLOAD_LIMITS.MAX_INSTRUCTIONS);
      userMessage += `INSTRUCCIONES: ${instruccionesTruncadas}\n`;
    }
    
    // Formato específico para párrafos de 6-8 líneas
    userMessage += `FORMATO: Párrafos de 6-8 líneas cada uno\n`;
    
    // Texto original (truncado inteligentemente)
    const textoTruncado = smartTruncateText(config.textoOriginal, PAYLOAD_LIMITS.MAX_TEXT_LENGTH, true);
    userMessage += `TEXTO:\n${textoTruncado}`;
    
    return userMessage;
    
  } else {
    // Modo normal - parámetros básicos solamente con formato de párrafos
    return `tema=${config.tema}; publico=${config.publico}; nivel=${config.nivel}; proposito=${config.proposito}; ventana_temporal=${config.ventanaInicio}-${config.ventanaFin}; idioma=${config.idioma}; formato=párrafos de 6-8 líneas cada uno`;
  }
}

async function generateEducationalText(config) {
  try {
    console.log('📤 Enviando solicitud OPTIMIZADA a CORA...');
    
    const endpoint = `${CORA_AGENT_URL}/api/v1/chat/completions`;
    
    // 🔥 CREAR MENSAJE OPTIMIZADO
    const userMessage = createOptimizedMessage(config);
    
    // Verificar límite total
    if (userMessage.length > PAYLOAD_LIMITS.MAX_TOTAL_PAYLOAD) {
      console.warn(`⚠️ Payload excede límite: ${userMessage.length} > ${PAYLOAD_LIMITS.MAX_TOTAL_PAYLOAD}`);
      // Truncar mensaje completo si es necesario
      const truncatedMessage = smartTruncateText(userMessage, PAYLOAD_LIMITS.MAX_TOTAL_PAYLOAD);
      console.log('✂️ Mensaje truncado para cumplir límites');
    }

    const requestBody = {
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ],
      stream: false,
      include_retrieval_info: false,
      include_functions_info: false,
      include_guardrails_info: false
    };

    console.log('📊 Estadísticas del payload:');
    console.log(`   - Longitud del mensaje: ${userMessage.length} caracteres`);
    console.log(`   - Límite configurado: ${PAYLOAD_LIMITS.MAX_TOTAL_PAYLOAD} caracteres`);
    console.log(`   - Reducción estimada: ~${Math.round((1 - userMessage.length / 5000) * 100)}% vs payload anterior`);

    const response = await queuedFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CORA_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Respuesta recibida:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de CORA:', errorText);
      throw new Error(`Error del agente CORA (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Datos recibidos de CORA');
    
    // Extraer el contenido del mensaje
    let content = data.choices[0].message.content;
    
    // Si el contenido está en formato JSON con campo "texto_didactico_5x8", extraerlo
    if (content.includes('"texto_didactico_5x8"')) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*"texto_didactico_5x8"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          content = parsed.texto_didactico_5x8;
          console.log('✅ Texto extraído del campo "texto_didactico_5x8"');
        }
      } catch (e) {
        console.log('⚠️  No se pudo parsear JSON, usando contenido original');
      }
    }
    
    // 🔥 POST-PROCESAMIENTO SIMPLIFICADO (solo si hay palabras problemáticas)
    const isCorrectionMode = Array.isArray(config.sesgosDetectados) && config.sesgosDetectados.length > 0;
    if (isCorrectionMode) {
      const palabrasProblematicas = new Set();
      config.sesgosDetectados.forEach(sesgo => {
        if (sesgo.palabrasProblematicas && sesgo.palabrasProblematicas.length > 0) {
          sesgo.palabrasProblematicas.slice(0, 5).forEach(p => palabrasProblematicas.add(p.toLowerCase()));
        }
      });
      
      const palabrasArray = Array.from(palabrasProblematicas);
      
      if (palabrasArray.length > 0) {
        // Post-procesamiento mínimo
        const { text: sanitizedText } = replaceProhibitedWords(content, palabrasArray);
        content = sanitizedText;
        
        // Verificación final simplificada
        const remaining = palabrasArray.filter(word => containsProhibitedWord(content, word));
        if (remaining.length > 0) {
          console.warn('⚠️ Palabras problemáticas restantes:', remaining.slice(0, 3));
        } else {
          console.log('✅ Optimización de sesgos completada');
        }
      }
    }

    // Actualizar el contenido procesado
    data.choices[0].message.content = content;
    
    return data;

  } catch (error) {
    console.error('❌ Error en generateEducationalText:', error);
    throw error;
  }
}

/**
 * Genera preguntas basadas en un texto educativo
 * @param {Object} config - Configuración para la generación de preguntas
 * @param {string} config.textContent - Contenido del texto base
 * @param {string} config.textTitle - Título del texto
 * @param {string} config.nivel - Nivel del texto
 * @param {string} config.correcciones - Correcciones del docente (opcional)
 * @returns {Promise<Object>} Respuesta del agente CORA con preguntas
 */
async function generateQuestions(config) {
  try {
    console.log('📤 Enviando solicitud a CORA para generar preguntas...');
    
    const endpoint = `${CORA_AGENT_URL}/api/v1/chat/completions`;
    console.log('URL:', endpoint);

    // Construir el prompt para generar preguntas
    let userMessage = `Genera preguntas de comprensión para el siguiente texto educativo:

TÍTULO: ${config.textTitle}
NIVEL: ${config.nivel}

TEXTO:
${config.textContent}

INSTRUCCIONES PARA GENERAR PREGUNTAS:

1. Variedad de niveles cognitivos:
   - Preguntas literales (recuperar información explícita)
   - Preguntas de inferencia (deducir algo no dicho directamente)
   - Preguntas críticas (valorar, comparar, cuestionar supuestos)
   - Preguntas de aplicación (usar el concepto en un caso nuevo)

2. Cantidad: Genera entre 6 y 10 preguntas en total

3. Formato de cada pregunta:
   - Tipo: literal | inferencia | crítica | aplicación
   - Pregunta: (texto de la pregunta)
   - Explicación: (qué evalúa esta pregunta)

4. Reglas:
   - Cada pregunta debe estar vinculada con el texto
   - No repetir la misma idea
   - Lenguaje sencillo y directo
   - Al menos 2 preguntas por tipo

FORMATO DE SALIDA:
Lista las preguntas en este formato exacto:

Pregunta 1
Tipo: [literal/inferencia/crítica/aplicación]
Pregunta: [texto de la pregunta]
Explicación: [qué evalúa]

Pregunta 2
Tipo: [literal/inferencia/crítica/aplicación]
Pregunta: [texto de la pregunta]
Explicación: [qué evalúa]

(continuar hasta completar 6-10 preguntas)`;

    // Si hay correcciones, agregarlas
    if (config.correcciones && config.correcciones.trim()) {
      userMessage += `\n\nCORRECCIONES SOLICITADAS POR EL DOCENTE:\n${config.correcciones}\n\nPor favor, ajusta las preguntas considerando estas correcciones.`;
    }

    const requestBody = {
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ],
      stream: false,
      include_retrieval_info: false,
      include_functions_info: false,
      include_guardrails_info: false
    };

    console.log('📨 Generando preguntas...');

    const response = await queuedFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CORA_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Respuesta recibida:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de CORA:', errorText);
      throw new Error(`Error del agente CORA (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Preguntas generadas por CORA');
    
    return data;

  } catch (error) {
    console.error('❌ Error en generateQuestions:', error);
    throw error;
  }
}

/**
 * Genera feedback automático para una respuesta de estudiante usando IA
 * @param {Object} config - Configuración para el feedback
 * @param {string} config.pregunta - La pregunta realizada
 * @param {string} config.respuesta - La respuesta del estudiante
 * @param {string} config.tema - Tema del texto/pregunta
 * @param {string} config.skill - Habilidad evaluada (literal, inferencial, crítica, aplicación)
 * @param {string} config.textoContexto - Contexto del texto (opcional)
 * @returns {Promise<Object>} Respuesta del agente CORA con evaluación
 */
async function generateFeedback(config) {
  try {
    console.log('📤 Generando feedback automático con CORA...');
    
    const endpoint = `${CORA_AGENT_URL}/api/v1/chat/completions`;
    
    // Construir prompt con información de sesgos (si existe)
    let userMessage = `Eres un experto evaluador académico que proporciona retroalimentación constructiva y motivadora.

CONTEXTO:
- Tema: ${config.tema}
- Habilidad evaluada: ${config.skill}
${config.textoContexto ? `- Texto de referencia: ${config.textoContexto.substring(0, 500)}...` : ''}

PREGUNTA:
${config.pregunta}

RESPUESTA DEL ESTUDIANTE:
${config.respuesta}`;

    // ✅ INCLUIR ANÁLISIS DE SESGOS SI EXISTE
    if (config.sesgosDetectados && config.sesgosDetectados.length > 0) {
      userMessage += `\n\nANÁLISIS AUTOMÁTICO DE SESGOS DETECTADOS:
Puntuación: ${config.puntuacion}/12
Nivel: ${config.nivelCalidad}
Sesgos identificados: ${config.sesgosDetectados.length}

Detalles de sesgos:`;
      
      config.sesgosDetectados.forEach((sesgo, idx) => {
        userMessage += `\n${idx + 1}. ${sesgo.tag} - ${sesgo.type}: ${sesgo.description}
   Sugerencia: ${sesgo.suggestion}`;
      });

      if (config.recomendaciones && config.recomendaciones.length > 0) {
        userMessage += `\n\nRecomendaciones pedagógicas:`;
        config.recomendaciones.forEach(rec => {
          userMessage += `\n- ${rec}`;
        });
      }
    }

    userMessage += `\n\nPROPORCIONA RETROALIMENTACIÓN ACADÉMICA Y MOTIVADORA:

1. FORTALEZAS (menciona al menos 2 aspectos positivos específicos):
- [Qué hizo bien el estudiante]

2. ÁREAS DE MEJORA (sé específico y constructivo):
- [Qué puede mejorar, con ejemplos concretos]

3. RECOMENDACIONES ACCIONABLES (pasos claros para mejorar):
- [Sugerencias específicas que el estudiante puede aplicar]

4. MOTIVACIÓN Y CIERRE:
[Mensaje motivador que refuerce la importancia del aprendizaje continuo]

FORMATO: Usa un tono académico pero cercano, como un tutor que busca ayudar al estudiante a crecer. Si hay sesgos detectados, explícalos de manera que el estudiante entienda por qué son importantes y cómo corregirlos.`;

    const requestBody = {
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ],
      stream: false,
      include_retrieval_info: false,
      include_functions_info: false,
      include_guardrails_info: false
    };

    console.log('📨 Solicitando evaluación a CORA...');

    const response = await queuedFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CORA_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Respuesta recibida:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de CORA:', errorText);
      throw new Error(`Error del agente CORA (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Feedback generado por CORA');
    
    return data;

  } catch (error) {
    console.error('❌ Error en generateFeedback:', error);
    throw error;
  }
}

async function generateBiasDidacticPack(config) {
  try {
    console.log('📤 Solicitando informe didáctico de sesgos a CORA...');

    const endpoint = `${CORA_AGENT_URL}/api/v1/chat/completions`;

    const {
      tema,
      publico,
      nivel,
      proposito,
      ventanaInicio,
      ventanaFin,
      idioma,
      pregunta,
      respuestaEstudiante,
      textoContexto,
      sesgosDetectados = [],
      puntuacion,
      nivelCalidad,
      recomendaciones = []
    } = config;

    const resumenSesgos = sesgosDetectados.length === 0
      ? 'Sin sesgos detectados'
      : sesgosDetectados.map(s => {
          const parts = [];
          if (s.tag) parts.push(s.tag);
          if (s.type) parts.push(s.type);
          if (s.description) parts.push(s.description);
          return `- ${parts.join(' | ')}`;
        }).join('\n');

    const recomendacionesTexto = recomendaciones.length > 0
      ? recomendaciones.map((r, idx) => `${idx + 1}. ${r}`).join('\n')
      : 'Sin recomendaciones adicionales.';

    const contextoTexto = textoContexto ? textoContexto.substring(0, 1200) : '';

    // ✅ REPORTE DE SESGOS - Análisis específico de la respuesta del estudiante
    const userMessage = `Analiza los sesgos en la respuesta del estudiante y genera un reporte educativo.

PREGUNTA:
${pregunta}

RESPUESTA DEL ESTUDIANTE:
"${respuestaEstudiante}"

TEXTO BASE:
${contextoTexto}

ANÁLISIS AUTOMÁTICO:
${resumenSesgos}
Puntuación: ${puntuacion}/${config.maxScore || 12} | Nivel: ${nivelCalidad}

GENERA UN REPORTE que explique:

1. ¿Qué sesgos tiene esta respuesta específica?
   - Menciona lo que el estudiante escribió literalmente
   - Compara con lo que debería haber escrito según el texto base

2. ¿Por qué son problemáticos estos sesgos?
   - Qué conceptos clave del texto ignoró
   - Qué errores de razonamiento cometió

3. ¿Cómo puede mejorar el estudiante?
   - Pasos concretos para corregir la respuesta
   - Ejemplos de cómo reescribir usando conceptos del texto

El reporte debe ser claro, directo y enfocado EN ESTA RESPUESTA.
NO hagas un texto genérico sobre sesgos en general.

Público: ${publico} | Nivel: ${nivel} | Idioma: ${idioma}

${recomendaciones.length > 0 ? `Recomendaciones:\n${recomendacionesTexto}` : ''}`;

    const requestBody = {
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      stream: false,
      include_retrieval_info: false,
      include_functions_info: false,
      include_guardrails_info: false
    };

    const response = await queuedFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CORA_API_KEY}`,
        'X-Chatbot-ID': CORA_CHATBOT_ID
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Respuesta recibida:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de CORA en informe didáctico:', errorText);
      throw new Error(`Error del agente CORA (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Informe didáctico de sesgos generado correctamente');
    return data;
  } catch (error) {
    console.error('❌ Error en generateBiasDidacticPack:', error);
    throw error;
  }
}

/**
 * Genera respuesta del tutor personal usando CORA
 * @param {Object} config - Configuración
 * @param {string} config.prompt - Prompt con contexto completo
 * @param {string} config.message - Mensaje del estudiante
 * @param {number} config.maxTokens - Tokens máximos de respuesta
 * @returns {Promise<Object>} Respuesta del tutor
 */
async function generateTutorResponse(config) {
  try {
    console.log('🤖 Generando respuesta del tutor con CORA...');
    
    const endpoint = `${CORA_AGENT_URL}/api/v1/chat/completions`;

    const requestBody = {
      messages: [
        {
          role: "system",
          content: "Eres un tutor personal experto, amigable y motivador que ayuda a estudiantes a aprender mejor."
        },
        {
          role: "user",
          content: config.prompt
        }
      ],
      stream: false,
      max_tokens: config.maxTokens || 800,
      temperature: 0.7,
      include_retrieval_info: false,
      include_functions_info: false,
      include_guardrails_info: false
    };

    console.log('📨 Enviando consulta al tutor...');

    const response = await queuedFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CORA_API_KEY}`,
        'X-Chatbot-ID': CORA_CHATBOT_ID
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Respuesta recibida:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de CORA:', errorText);
      throw new Error(`Error del agente CORA (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta del tutor generada exitosamente');
    
    return data;

  } catch (error) {
    console.error('❌ Error en generateTutorResponse:', error);
    throw error;
  }
}

module.exports = {
  generateEducationalText,
  generateQuestions,
  generateFeedback,
  generateBiasDidacticPack,
  generateTutorResponse,
  __testables: {
    replaceProhibitedWords,
    containsProhibitedWord,
    countGlossaryItems,
    countWords,
    normalizeDiacritics
  }
};
