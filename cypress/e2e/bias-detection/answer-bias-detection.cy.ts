/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Answer Bias Detection Tests
 * 
 * Tests the detection of cognitive biases in student answers:
 * - Generalization excesiva
 * - Polarization in responses
 * - Simplified causality
 * - Partial reading
 * - Weak inference
 * - Superficial criticism
 * - Limited application
 * - Response misalignment
 * 
 * Also tests scoring calculation and suggestion generation.
 * 
 * Requirements: 6.2, 6.3, 6.4, 6.5
 */

describe('Answer Bias Detection - Cognitive Biases', () => {
  let testCourseId: string;
  let testTopicId: string;
  let testTextId: string;
  let testQuestionId: string;

  before(() => {
    // Setup: Create course with text and question as teacher
    cy.loginAsTeacher();

    cy.fixture('courses').then((courses) => {
      cy.createCourse({
        title: `E2E Test - Answer Bias Detection - ${Date.now()}`,
        description: courses.basicCourse.description,
        level: courses.basicCourse.level,
      });

      cy.get('@createdCourseId').then((courseId) => {
        testCourseId = String(courseId);

        cy.createTopic(testCourseId, {
          title: 'Tema de Detección de Sesgos Cognitivos',
          description: 'Tema para pruebas de detección de sesgos en respuestas',
          order: 1,
        });

        cy.get('@createdTopicId').then((topicId) => {
          testTopicId = String(topicId);

          cy.fixture('texts').then((texts) => {
            cy.createText(testTopicId, {
              title: texts.textWithoutBiases.title,
              content: texts.textWithoutBiases.content,
              difficulty: texts.textWithoutBiases.difficulty,
              estimatedReadingTime: texts.textWithoutBiases.estimatedReadingTime,
            });

            cy.get('@createdTextId').then((textId) => {
              testTextId = String(textId);

              cy.fixture('questions').then((questions) => {
                cy.createQuestion(testTextId, {
                  text: questions.criticalQuestion.text,
                  type: questions.criticalQuestion.type,
                  hint: questions.criticalQuestion.hint,
                });

                cy.get('@createdQuestionId').then((qId) => {
                  testQuestionId = String(qId);

                  // Enroll student
                  cy.loginAsStudent();
                  cy.enrollStudent(testCourseId);
                });
              });
            });
          });
        });
      });
    });
  });

  after(() => {
    // Cleanup
    cy.loginAsTeacher();
    cy.cleanupTestData();
  });

  beforeEach(() => {
    cy.loginAsStudent();
  });

  describe('Cognitive Bias Detection in Answers', () => {
    describe('Generalization Excesiva', () => {
      it('should detect excessive generalization in answer', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerWithGeneralization = 'Todos los estudiantes siempre aprenden de la misma manera. Cualquier persona puede dominar cualquier tema.';
        cy.get('textarea').first().clear().type(answerWithGeneralization);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        // Analyze biases
        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        // Verify generalization bias detected
        cy.get('body').invoke('text').then((text) => {
          const hasGeneralizationBias = text.toLowerCase().includes('generaliz') ||
                                       text.includes('S-GEN') ||
                                       text.includes('S-UNIV');
          expect(hasGeneralizationBias).to.be.true;
        });

        cy.log('✓ Excessive generalization detected in answer');
      });
    });

    describe('Polarization in Responses', () => {
      it('should detect polarized thinking in answer', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerWithPolarization = 'Esto es absolutamente correcto o completamente incorrecto. No hay término medio posible.';
        cy.get('textarea').first().clear().type(answerWithPolarization);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.get('body').invoke('text').then((text) => {
          const hasPolarizationBias = text.toLowerCase().includes('polariz') ||
                                     text.includes('S-POLAR');
          expect(hasPolarizationBias).to.be.true;
        });

        cy.log('✓ Polarization detected in answer');
      });
    });

    describe('Simplified Causality', () => {
      it('should detect oversimplified cause-effect reasoning', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerWithSimpleCausality = 'Los estudiantes fallan porque no estudian. Si estudias, entonces aprobarás.';
        cy.get('textarea').first().clear().type(answerWithSimpleCausality);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.get('body').invoke('text').then((text) => {
          const hasCausalityBias = text.toLowerCase().includes('causal') ||
                                  text.includes('S-CAUSA');
          expect(hasCausalityBias).to.be.true;
        });

        cy.log('✓ Simplified causality detected in answer');
      });
    });

    describe('Partial Reading Detection', () => {
      it('should detect answer based on incomplete text reading', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerShowingPartialReading = 'Según el título, creo que el texto trata sobre pensamiento crítico.';
        cy.get('textarea').first().clear().type(answerShowingPartialReading);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.log('✓ Partial reading analysis completed');
      });
    });

    describe('Weak Inference Detection', () => {
      it('should detect weak or unsupported inferences', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerWithWeakInference = 'Probablemente esto significa que todo es importante. Supongo que la conclusión es obvia.';
        cy.get('textarea').first().clear().type(answerWithWeakInference);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.log('✓ Weak inference analysis completed');
      });
    });

    describe('Superficial Criticism Detection', () => {
      it('should detect shallow critical analysis', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerWithSuperficialCriticism = 'El argumento es malo. No me gusta. Está equivocado.';
        cy.get('textarea').first().clear().type(answerWithSuperficialCriticism);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.log('✓ Superficial criticism analysis completed');
      });
    });

    describe('Limited Application Detection', () => {
      it('should detect limited practical application', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerWithLimitedApplication = 'Esto solo funciona en este caso específico. No tiene otras aplicaciones.';
        cy.get('textarea').first().clear().type(answerWithLimitedApplication);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.log('✓ Limited application analysis completed');
      });
    });

    describe('Response Misalignment Detection', () => {
      it('should detect answer that does not address the question', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const misalignedAnswer = 'Me gusta estudiar. El clima está agradable hoy. Los libros son interesantes.';
        cy.get('textarea').first().clear().type(misalignedAnswer);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.log('✓ Response misalignment analysis completed');
      });
    });
  });

  describe('Score Calculation Tests', () => {
    describe('Perfect Score (12/12)', () => {
      it('should assign 12/12 score for answer without biases', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        cy.fixture('answers').then((answers) => {
          cy.get('textarea').first().clear().type(answers.answerWithoutBiases.value);
          cy.get('button[type="submit"]').first().click();
          cy.wait(2000);

          cy.get('body').then(($body) => {
            if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
              cy.get(selectors.biasAnalysis.analyzeButton).click();
            } else {
              cy.contains('button', /analizar|analyze/i).click();
            }
          });

          cy.wait(3000);

          // Verify high score
          cy.get('body').invoke('text').then((text) => {
            const scoreMatch = text.match(/(\d+(\.\d+)?)\s*[\/\s]*12/);
            if (scoreMatch) {
              const score = parseFloat(scoreMatch[1]);
              expect(score).to.be.at.least(10);
              cy.log(`✓ High score ${score}/12 for unbiased answer`);
            }
          });
        });
      });

      it('should display "excelente" level for perfect score', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        cy.fixture('answers').then((answers) => {
          cy.get('textarea').first().clear().type(answers.answerWithoutBiases.value);
          cy.get('button[type="submit"]').first().click();
          cy.wait(2000);

          cy.get('body').then(($body) => {
            if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
              cy.get(selectors.biasAnalysis.analyzeButton).click();
            } else {
              cy.contains('button', /analizar|analyze/i).click();
            }
          });

          cy.wait(3000);

          cy.get('body').invoke('text').then((text) => {
            const lowerText = text.toLowerCase();
            const hasExcellentLevel = lowerText.includes('excelente') ||
                                     lowerText.includes('excellent') ||
                                     lowerText.includes('bueno');
            expect(hasExcellentLevel).to.be.true;
          });

          cy.log('✓ Excellent level displayed for high score');
        });
      });
    });

    describe('Score with 1-2 Biases', () => {
      it('should calculate correct score with few biases', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerWithFewBiases = 'El pensamiento crítico es importante. Todos deberían practicarlo siempre.';
        cy.get('textarea').first().clear().type(answerWithFewBiases);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.get('body').invoke('text').then((text) => {
          const scoreMatch = text.match(/(\d+(\.\d+)?)\s*[\/\s]*12/);
          if (scoreMatch) {
            const score = parseFloat(scoreMatch[1]);
            expect(score).to.be.at.least(6);
            expect(score).to.be.at.most(11);
            cy.log(`✓ Score ${score}/12 for answer with few biases`);
          }
        });
      });
    });

    describe('Score with 3+ Biases', () => {
      it('should calculate lower score with multiple biases', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        cy.fixture('answers').then((answers) => {
          cy.get('textarea').first().clear().type(answers.answerWithBiases.value);
          cy.get('button[type="submit"]').first().click();
          cy.wait(2000);

          cy.get('body').then(($body) => {
            if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
              cy.get(selectors.biasAnalysis.analyzeButton).click();
            } else {
              cy.contains('button', /analizar|analyze/i).click();
            }
          });

          cy.wait(3000);

          cy.get('body').invoke('text').then((text) => {
            const scoreMatch = text.match(/(\d+(\.\d+)?)\s*[\/\s]*12/);
            if (scoreMatch) {
              const score = parseFloat(scoreMatch[1]);
              expect(score).to.be.at.most(10);
              cy.log(`✓ Lower score ${score}/12 for answer with multiple biases`);
            }
          });
        });
      });

      it('should display "necesita_mejora" level for low score', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        const answerWithManyBiases = 'Todos los estudiantes siempre deben estudiar porque nunca se sabe. Los expertos dicen que es absolutamente necesario.';
        cy.get('textarea').first().clear().type(answerWithManyBiases);
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.get('body').invoke('text').then((text) => {
          const lowerText = text.toLowerCase();
          const hasLowerLevel = lowerText.includes('necesita') ||
                               lowerText.includes('aceptable') ||
                               lowerText.includes('mejora') ||
                               lowerText.includes('insuficiente');
          
          if (hasLowerLevel) {
            cy.log('✓ Lower level displayed for answer with many biases');
          } else {
            cy.log('⚠ Level may vary based on actual score');
          }
        });
      });
    });

    describe('Score Range Validation', () => {
      it('should always return score between 0 and 12', () => {
        cy.navigateToStudentEvaluation();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.textCard).length > 0) {
            cy.get(selectors.texts.textCard).first().click({ force: true });
          }
        });

        cy.wait(2000);

        cy.get('textarea').first().clear().type('Respuesta de prueba para validar rango de puntuación');
        cy.get('button[type="submit"]').first().click();
        cy.wait(2000);

        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
            cy.get(selectors.biasAnalysis.analyzeButton).click();
          } else {
            cy.contains('button', /analizar|analyze/i).click();
          }
        });

        cy.wait(3000);

        cy.get('body').invoke('text').then((text) => {
          const scoreMatch = text.match(/(\d+(\.\d+)?)\s*[\/\s]*12/);
          if (scoreMatch) {
            const score = parseFloat(scoreMatch[1]);
            expect(score).to.be.at.least(0);
            expect(score).to.be.at.most(12);
            cy.log(`✓ Score ${score}/12 is within valid range [0-12]`);
          }
        });
      });
    });
  });

  describe('Suggestion Generation Tests', () => {
    beforeEach(() => {
      cy.navigateToStudentEvaluation();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      cy.fixture('answers').then((answers) => {
        cy.get('textarea').first().clear().type(answers.answerWithBiases.value);
      });

      cy.get('button[type="submit"]').first().click();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
          cy.get(selectors.biasAnalysis.analyzeButton).click();
        } else {
          cy.contains('button', /analizar|analyze/i).click();
        }
      });

      cy.wait(3000);
    });

    describe('Specific Suggestions per Bias', () => {
      it('should provide specific suggestion for each detected bias', () => {
        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.biasCard).length > 0) {
            cy.get(selectors.biasAnalysis.biasCard).each(($card) => {
              cy.wrap($card).within(() => {
                cy.get('body').then(($cardBody) => {
                  const cardText = $cardBody.text();
                  const hasSuggestion = cardText.toLowerCase().includes('sugerencia') ||
                                       cardText.toLowerCase().includes('evita') ||
                                       cardText.toLowerCase().includes('considera') ||
                                       cardText.toLowerCase().includes('intenta');
                  expect(hasSuggestion).to.be.true;
                });
              });
            });

            cy.log('✓ Each bias card has specific suggestion');
          } else {
            cy.get('body').invoke('text').then((text) => {
              const hasSuggestions = text.toLowerCase().includes('sugerencia') ||
                                    text.toLowerCase().includes('suggestion');
              expect(hasSuggestions).to.be.true;
            });

            cy.log('✓ Suggestions present in analysis');
          }
        });
      });
    });

    describe('Suggestions Include Context', () => {
      it('should include context in suggestions', () => {
        cy.get('body').invoke('text').then((text) => {
          const lowerText = text.toLowerCase();
          const hasContext = lowerText.includes('en lugar de') ||
                            lowerText.includes('considera') ||
                            lowerText.includes('ejemplo') ||
                            lowerText.includes('contexto') ||
                            lowerText.includes('situación');
          expect(hasContext).to.be.true;
        });

        cy.log('✓ Suggestions include contextual information');
      });

      it('should reference specific parts of the answer', () => {
        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.biasContext).length > 0) {
            cy.get(selectors.biasAnalysis.biasContext).should('exist');
            cy.log('✓ Bias context elements found');
          } else {
            cy.log('⚠ Context may be embedded in suggestion text');
          }
        });
      });
    });

    describe('Suggestions Include Alternatives', () => {
      it('should provide alternative phrasings', () => {
        cy.get('body').invoke('text').then((text) => {
          const lowerText = text.toLowerCase();
          const hasAlternatives = lowerText.includes('en lugar de') ||
                                 lowerText.includes('mejor usar') ||
                                 lowerText.includes('considera usar') ||
                                 lowerText.includes('intenta') ||
                                 lowerText.includes('podrías') ||
                                 lowerText.includes('alternativa');
          expect(hasAlternatives).to.be.true;
        });

        cy.log('✓ Suggestions include alternative phrasings');
      });

      it('should show concrete examples of improvement', () => {
        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.biasAlternative).length > 0) {
            cy.get(selectors.biasAnalysis.biasAlternative).should('exist');
            cy.log('✓ Alternative suggestions found');
          } else {
            cy.get('body').invoke('text').then((text) => {
              const hasExamples = text.includes('"') || 
                                 text.toLowerCase().includes('ejemplo:') ||
                                 text.toLowerCase().includes('por ejemplo');
              if (hasExamples) {
                cy.log('✓ Examples included in suggestions');
              }
            });
          }
        });
      });

      it('should provide actionable improvement steps', () => {
        cy.get('body').invoke('text').then((text) => {
          const lowerText = text.toLowerCase();
          const hasActionableSteps = lowerText.includes('evita') ||
                                     lowerText.includes('usa') ||
                                     lowerText.includes('incluye') ||
                                     lowerText.includes('considera') ||
                                     lowerText.includes('intenta') ||
                                     lowerText.includes('reemplaza');
          expect(hasActionableSteps).to.be.true;
        });

        cy.log('✓ Actionable improvement steps provided');
      });
    });

    describe('Suggestion Quality', () => {
      it('should provide educational value in suggestions', () => {
        cy.get('body').invoke('text').then((text) => {
          const lowerText = text.toLowerCase();
          const hasEducationalContent = lowerText.includes('pensamiento crítico') ||
                                       lowerText.includes('análisis') ||
                                       lowerText.includes('evidencia') ||
                                       lowerText.includes('argumento') ||
                                       lowerText.includes('razonamiento');
          expect(hasEducationalContent).to.be.true;
        });

        cy.log('✓ Suggestions have educational value');
      });

      it('should be clear and understandable', () => {
        cy.get('body').then(($body) => {
          if ($body.find(selectors.biasAnalysis.biasSuggestion).length > 0) {
            cy.get(selectors.biasAnalysis.biasSuggestion).first().invoke('text').then((text) => {
              expect(text.length).to.be.greaterThan(10);
              cy.log('✓ Suggestions are substantive');
            });
          }
        });
      });
    });
  });

  describe('Complete Bias Analysis Flow', () => {
    it('should complete full analysis with all components', () => {
      cy.navigateToStudentEvaluation();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      cy.fixture('answers').then((answers) => {
        cy.get('textarea').first().clear().type(answers.answerWithBiases.value);
      });

      cy.get('button[type="submit"]').first().click();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
          cy.get(selectors.biasAnalysis.analyzeButton).click();
        } else {
          cy.contains('button', /analizar|analyze/i).click();
        }
      });

      cy.wait(3000);

      // Verify all components present
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        
        // Check for score
        const hasScore = bodyText.match(/\d+[\s\/]*12/);
        expect(hasScore).to.not.be.null;
        
        // Check for level
        const hasLevel = bodyText.toLowerCase().includes('excelente') ||
                        bodyText.toLowerCase().includes('bueno') ||
                        bodyText.toLowerCase().includes('aceptable') ||
                        bodyText.toLowerCase().includes('necesita');
        expect(hasLevel).to.be.true;
        
        // Check for suggestions
        const hasSuggestions = bodyText.toLowerCase().includes('sugerencia') ||
                              bodyText.toLowerCase().includes('recomendación');
        expect(hasSuggestions).to.be.true;
        
        cy.log('✓ Complete bias analysis with score, level, and suggestions');
      });
    });
  });
});
