const biasService = require('../services/bias.service');
const Text = require('../models/Text');
const QuestionAttempt = require('../models/QuestionAttempt');

/**
 * Analizar sesgos en un texto generado (guardado)
 */
const analyzeText = async (req, res, next) => {
  try {
    const { textId } = req.params;
    
    const text = await Text.findById(textId);
    if (!text) {
      return res.status(404).json({ message: 'Texto no encontrado' });
    }

    // Verificar permisos
    if (text.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Analizar y guardar sesgos
    const result = await biasService.analyzeBiasesAndSave(
      text.content,
      'text',
      text._id,
      req.user._id
    );

    res.json({
      textId: text._id,
      ...result,
      analyzedAt: new Date()
    });
  } catch (error) {
    console.error('Error al analizar texto:', error);
    next(error);
  }
};

/**
 * Analizar sesgos en texto sin guardar (preview)
 */
const analyzeTextContent = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string' || content.trim().length < 50) {
      return res.status(400).json({ 
        message: 'El contenido del texto es requerido (mínimo 50 caracteres)' 
      });
    }

    // Analizar sesgos sin guardar en BD
    const biases = await biasService.analyzeBiases(content);
    const statistics = biasService.generateBiasStatistics(biases);
    const quality = biasService.assessTextQuality(biases);

    res.json({
      biases,
      statistics,
      quality,
      analyzedAt: new Date()
    });
  } catch (error) {
    console.error('Error al analizar contenido:', error);
    next(error);
  }
};

/**
 * Analizar sesgos en una respuesta de estudiante
 */
const analyzeAttempt = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    
    const attempt = await QuestionAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Intento no encontrado' });
    }

    // Verificar permisos
    if (attempt.student.toString() !== req.user._id.toString() && req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Analizar solo si es texto
    if (typeof attempt.answer !== 'string' || attempt.answer.length < 20) {
      return res.status(400).json({ 
        message: 'La respuesta es muy corta para analizar sesgos (mínimo 20 caracteres)' 
      });
    }

    // Analizar y guardar sesgos
    const result = await biasService.analyzeBiasesAndSave(
      attempt.answer,
      'attempt',
      attempt._id,
      req.user._id
    );

    res.json({
      attemptId: attempt._id,
      questionId: attempt.question,
      ...result,
      analyzedAt: new Date()
    });
  } catch (error) {
    console.error('Error al analizar respuesta:', error);
    next(error);
  }
};

/**
 * Obtener sesgos de un texto o intento
 */
const getBiases = async (req, res, next) => {
  try {
    const { relatedTo, relatedId } = req.params;
    
    if (!['text', 'attempt'].includes(relatedTo)) {
      return res.status(400).json({ message: 'Tipo inválido. Usa "text" o "attempt"' });
    }

    const result = await biasService.getBiases(relatedTo, relatedId);
    
    res.json(result);
  } catch (error) {
    console.error('Error al obtener sesgos:', error);
    next(error);
  }
};

/**
 * Marcar un sesgo como resuelto
 */
const resolveBias = async (req, res, next) => {
  try {
    const { biasId } = req.params;
    const { note } = req.body;

    const bias = await biasService.resolveBias(biasId, note);

    res.json({
      message: 'Sesgo marcado como resuelto',
      bias
    });
  } catch (error) {
    console.error('Error al resolver sesgo:', error);
    next(error);
  }
};

/**
 * Obtener estadísticas de sesgos del curso
 */
const getCourseStatistics = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    const statistics = await biasService.getCourseStatistics(courseId);
    
    res.json(statistics);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    next(error);
  }
};

const getTopicSummary = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    res.status(501).json({ message: 'No implementado aún' });
  } catch (error) {
    next(error);
  }
};

/**
 * Analizar sesgos en respuesta de estudiante (análisis académico)
 * Endpoint especializado para estudiantes que quieren ver el análisis de su respuesta
 */
const analyzeStudentAnswer = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    
    // Buscar el intento con populate de pregunta y texto
    const attempt = await QuestionAttempt.findById(attemptId)
      .populate({
        path: 'question',
        populate: {
          path: 'text',
          select: 'content title'
        }
      });
    
    if (!attempt) {
      return res.status(404).json({ message: 'Respuesta no encontrada' });
    }

    // Verificar permisos: solo el estudiante dueño o docentes/admin
    const isOwner = attempt.student.toString() === req.user._id.toString();
    const isTeacher = req.user.role === 'teacher' || req.user.role === 'admin';
    
    if (!isOwner && !isTeacher) {
      return res.status(403).json({ message: 'No autorizado para ver esta respuesta' });
    }

    // Extraer la respuesta del array de answers
    // El modelo tiene answers: [{ value, isCorrect }], necesitamos extraer el texto
    let studentAnswer = '';
    
    if (attempt.answers && attempt.answers.length > 0) {
      // Para preguntas de desarrollo/argumentativa, el value es el texto
      const firstAnswer = attempt.answers[0];
      
      if (typeof firstAnswer.value === 'string') {
        studentAnswer = firstAnswer.value;
      } else if (firstAnswer.value && typeof firstAnswer.value === 'object') {
        // Si es objeto, intentar extraer algún campo de texto
        studentAnswer = firstAnswer.value.text || firstAnswer.value.respuesta || JSON.stringify(firstAnswer.value);
      }
    }

    // Validar que haya respuesta suficiente
    if (!studentAnswer || studentAnswer.length < 20) {
      return res.status(400).json({ 
        message: 'La respuesta es muy corta para analizar (mínimo 20 caracteres)',
        debug: {
          hasAnswers: !!attempt.answers,
          answersLength: attempt.answers?.length,
          firstAnswerType: attempt.answers?.[0]?.value ? typeof attempt.answers[0].value : 'undefined',
          extractedLength: studentAnswer?.length || 0
        }
      });
    }

    // Extraer contexto
    const question = attempt.question;
    const textContext = question?.text?.content || '';
    
    // Analizar sesgos específicos para respuestas de estudiantes
    const analysis = await biasService.analyzeStudentAnswer(
      studentAnswer,
      {
        pregunta: question?.pregunta || '',
        tipo: question?.tipo || 'literal',
        explicacion: question?.explicacion || ''
      },
      textContext
    );

    res.json({
      attemptId: attempt._id,
      questionId: question?._id,
      studentId: attempt.student,
      questionType: question?.tipo,
      answer: studentAnswer, // ✅ Enviar la respuesta extraída correctamente
      ...analysis,
      analyzedAt: new Date(),
      isOwner
    });
  } catch (error) {
    console.error('Error al analizar respuesta de estudiante:', error);
    next(error);
  }
};

module.exports = {
  analyzeText,
  analyzeTextContent,
  analyzeAttempt,
  getBiases,
  resolveBias,
  getCourseStatistics,
  getTopicSummary,
  analyzeStudentAnswer
};
