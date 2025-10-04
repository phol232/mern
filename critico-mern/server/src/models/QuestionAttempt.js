const mongoose = require('mongoose');

const QuestionAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  text: { type: mongoose.Schema.Types.ObjectId, ref: 'Text', required: true },
  answers: [{
    value: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean
  }],
  score: { type: Number, default: 0 },
  timeSpentSeconds: { type: Number, default: 0 },
  completedAt: Date,
  autoFeedback: String, 
  feedback: String, 
  feedbackGeneratedAt: Date, 
  requiresReview: { type: Boolean, default: false },
  // ✅ NUEVO: Análisis de sesgos en la respuesta del estudiante
  biasAnalysis: {
    score: Number,           // Puntuación 0-12
    maxScore: Number,        // 12
    nivel: String,           // 'excelente', 'bueno', 'aceptable', etc.
    biasesDetected: Number,  // Cantidad de sesgos detectados
    analyzedAt: Date
  }
}, {
  timestamps: true
});

QuestionAttemptSchema.index({ student: 1, question: 1, createdAt: -1 });

module.exports = mongoose.model('QuestionAttempt', QuestionAttemptSchema);
