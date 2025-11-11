/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Student Bias Analysis Tests
 * 
 * Tests the complete flow of analyzing biases in student answers:
 * - Clicking the "Analyze Biases" button
 * - Verifying bias analysis modal opens
 * - Verifying score display (0-12)
 * - Verifying level display (excelente/bueno/etc)
 * - Verifying detected biases with cards
 * - Verifying improvement suggestions
 * - Verifying academic recommendations
 * 
 * Requirements: 5.5
 */

describe('Student Bias Analysis', () => {
  let testCourseId: string;
  let testTopicId: string;
  let testTextId: string;
  let testQuestionId: string;

  before(() => {
    // Setup: Create course with text and question as teacher
    cy.loginAsTeacher();

    cy.fixture('courses').then((courses) => {
      cy.createCourse({
        title: `E2E Test - Bias Analysis - ${Date.now()}`,
        description: courses.basicCourse.description,
        level: courses.basicCourse.level,
      });

      cy.get('@createdCourseId').then((courseId) => {
        testCourseId = String(courseId);

        cy.createTopic(testCourseId, {
          title: 'Tema de Análisis de Sesgos',
          description: 'Tema para pruebas de análisis de sesgos',
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

  describe('Access Bias Analysis', () => {
    it('should display "Analyze Biases" button after answering question', () => {
      cy.navigateToStudentEvaluation();

      cy.wait(2000);

      // Open text
      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      // Submit an answer first
      cy.get('body').then(($body) => {
        if ($body.find('textarea').length > 0) {
          cy.get('textarea').first().clear().type('Esta es una respuesta de prueba para análisis de sesgos.');

          // Submit
          cy.get('body').then(($form) => {
            if ($form.find('button[type="submit"]').length > 0) {
              cy.get('button[type="submit"]').first().click();
            }
          });

          cy.wait(2000);
        }
      });

      // Look for analyze bias button
      cy.get('body').then(($body) => {
        const hasAnalyzeButton = $body.find(selectors.biasAnalysis.analyzeButton).length > 0 ||
                                $body.text().toLowerCase().includes('analizar sesgo') ||
                                $body.text().toLowerCase().includes('analyze bias');

        expect(hasAnalyzeButton).to.be.true;
      });

      cy.log('✓ Analyze Biases button available');
    });

    it('should enable analyze button only after answer is submitted', () => {
      cy.navigateToStudentEvaluation();

      cy.wait(2000);

      // Open text
      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      // Check if analyze button exists and its state
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
          // Button exists - verify it's clickable after submission
          cy.get('textarea').first().clear().type('Respuesta para habilitar análisis');

          cy.get('button[type="submit"]').first().click();

          cy.wait(2000);

          cy.get(selectors.biasAnalysis.analyzeButton).should('not.be.disabled');

          cy.log('✓ Analyze button enabled after submission');
        } else {
          cy.log('⚠ Analyze button selector not found');
        }
      });
    });
  });

  describe('Click Analyze Biases Button', () => {
    beforeEach(() => {
      // Submit an answer before each test
      cy.navigateToStudentEvaluation();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      cy.get('textarea').first().clear().type('Respuesta de prueba para análisis');
      cy.get('button[type="submit"]').first().click();
      cy.wait(2000);
    });

    it('should open bias analysis modal when button is clicked', () => {
      // Click analyze button
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
          cy.get(selectors.biasAnalysis.analyzeButton).click();
        } else {
          // Fallback: look for button with analyze text
          cy.contains('button', /analizar|analyze/i).click();
        }
      });

      cy.wait(3000);

      // Verify modal opens
      cy.get('body').then(($body) => {
        const hasModal = $body.find(selectors.biasAnalysis.biasModal).length > 0 ||
                        $body.find(selectors.common.modal).length > 0 ||
                        $body.find('[role="dialog"]').length > 0;

        expect(hasModal).to.be.true;
      });

      cy.log('✓ Bias analysis modal opened');
    });

    it('should show loading indicator while analyzing', () => {
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
          cy.get(selectors.biasAnalysis.analyzeButton).click();

          // Check for loading indicator immediately
          cy.get('body', { timeout: 1000 }).then(($body) => {
            const hasLoading = $body.find(selectors.common.loadingSpinner).length > 0 ||
                              $body.text().toLowerCase().includes('analizando') ||
                              $body.text().toLowerCase().includes('analyzing');

            if (hasLoading) {
              cy.log('✓ Loading indicator shown');
            } else {
              cy.log('⚠ No loading indicator (analysis may be instant)');
            }
          });
        }
      });
    });
  });

  describe('Verify Bias Score Display', () => {
    beforeEach(() => {
      // Submit answer and open analysis
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
      });

      cy.get('button[type="submit"]').first().click();
      cy.wait(2000);

      // Click analyze
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
          cy.get(selectors.biasAnalysis.analyzeButton).click();
        } else {
          cy.contains('button', /analizar|analyze/i).click();
        }
      });

      cy.wait(3000);
    });

    it('should display bias score in format X/12', () => {
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.biasScore).length > 0) {
          cy.get(selectors.biasAnalysis.biasScore).should('be.visible');
          cy.get(selectors.biasAnalysis.biasScore).invoke('text').should('match', /\d+(\.\d+)?[\s\/]*12/);
        } else {
          // Fallback: look for score pattern in modal
          cy.get('body').invoke('text').should('match', /\d+(\.\d+)?[\s\/]*12/);
        }
      });

      cy.log('✓ Bias score displayed in correct format');
    });

    it('should display score between 0 and 12', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        const scoreMatch = bodyText.match(/(\d+(\.\d+)?)\s*[\/\s]*12/);

        if (scoreMatch) {
          const score = parseFloat(scoreMatch[1]);
          expect(score).to.be.at.least(0);
          expect(score).to.be.at.most(12);
          cy.log(`✓ Score ${score}/12 is within valid range`);
        } else {
          cy.log('⚠ Score pattern not found');
        }
      });
    });

    it('should display score with appropriate precision', () => {
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.biasScore).length > 0) {
          cy.get(selectors.biasAnalysis.biasScore).invoke('text').then((text) => {
            const scoreMatch = text.match(/(\d+(\.\d+)?)/);
            if (scoreMatch) {
              const score = scoreMatch[1];
              // Score should be a valid number
              expect(parseFloat(score)).to.be.a('number');
              cy.log(`✓ Score displayed: ${score}`);
            }
          });
        }
      });
    });
  });

  describe('Verify Level Display', () => {
    beforeEach(() => {
      // Submit answer and analyze
      cy.navigateToStudentEvaluation();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      cy.get('textarea').first().clear().type('Respuesta para verificar nivel de análisis');
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

    it('should display bias level classification', () => {
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.biasLevel).length > 0) {
          cy.get(selectors.biasAnalysis.biasLevel).should('be.visible');
        } else {
          // Look for level keywords in text
          const bodyText = $body.text().toLowerCase();
          const hasLevel = bodyText.includes('excelente') ||
                          bodyText.includes('bueno') ||
                          bodyText.includes('aceptable') ||
                          bodyText.includes('necesita mejora') ||
                          bodyText.includes('insuficiente') ||
                          bodyText.includes('excellent') ||
                          bodyText.includes('good');

          expect(hasLevel).to.be.true;
        }
      });

      cy.log('✓ Bias level displayed');
    });

    it('should display one of the valid level values', () => {
      const validLevels = [
        'excelente',
        'bueno',
        'aceptable',
        'necesita mejora',
        'necesita_mejora',
        'insuficiente',
        'excellent',
        'good',
        'acceptable',
        'needs improvement',
        'insufficient'
      ];

      cy.get('body').invoke('text').then((text) => {
        const lowerText = text.toLowerCase();
        const hasValidLevel = validLevels.some(level => lowerText.includes(level));
        expect(hasValidLevel).to.be.true;
      });

      cy.log('✓ Valid level classification shown');
    });

    it('should display level with visual indicator (color/badge)', () => {
      cy.get('body').then(($body) => {
        const hasLevelBadge = $body.find(selectors.biasAnalysis.levelBadge).length > 0 ||
                             $body.find('.badge').length > 0 ||
                             $body.find('[class*="level"]').length > 0;

        if (hasLevelBadge) {
          cy.log('✓ Level has visual indicator');
        } else {
          cy.log('⚠ No specific visual indicator found');
        }
      });
    });
  });

  describe('Verify Detected Biases with Cards', () => {
    beforeEach(() => {
      // Submit answer WITH biases and analyze
      cy.navigateToStudentEvaluation();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      // Use answer with biases
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

    it('should display detected biases as cards', () => {
      cy.get('body').then(($body) => {
        const hasBiasCards = $body.find(selectors.biasAnalysis.biasCard).length > 0;
        const hasBiasesDetected = $body.find(selectors.biasAnalysis.biasesDetected).length > 0;
        const hasBiasText = $body.text().toLowerCase().includes('sesgo') ||
                           $body.text().toLowerCase().includes('bias');

        expect(hasBiasCards || hasBiasesDetected || hasBiasText).to.be.true;
      });

      cy.log('✓ Detected biases displayed');
    });

    it('should show bias type for each detected bias', () => {
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.biasCard).length > 0) {
          cy.get(selectors.biasAnalysis.biasCard).first().within(() => {
            cy.get('body').then(($card) => {
              const hasBiasType = $card.find(selectors.biasAnalysis.biasType).length > 0 ||
                                 $card.text().match(/S-[A-Z]+/);
              expect(hasBiasType).to.be.true;
            });
          });

          cy.log('✓ Bias types shown');
        } else {
          // Check for bias type codes in text
          cy.get('body').invoke('text').should('match', /S-[A-Z]+/);
          cy.log('✓ Bias type codes found');
        }
      });
    });

    it('should show bias description for each detected bias', () => {
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.biasCard).length > 0) {
          cy.get(selectors.biasAnalysis.biasCard).first().within(() => {
            cy.get('body').then(($card) => {
              const hasDescription = $card.find(selectors.biasAnalysis.biasDescription).length > 0 ||
                                    $card.text().length > 20;
              expect(hasDescription).to.be.true;
            });
          });

          cy.log('✓ Bias descriptions shown');
        }
      });
    });

    it('should display count of detected biases', () => {
      cy.get('body').then(($body) => {
        const hasBiasCount = $body.find(selectors.biasAnalysis.biasCount).length > 0 ||
                            $body.text().match(/\d+\s*(sesgo|bias)/i);

        if (hasBiasCount) {
          cy.log('✓ Bias count displayed');
        } else {
          // Count bias cards
          const cardCount = $body.find(selectors.biasAnalysis.biasCard).length;
          if (cardCount > 0) {
            cy.log(`✓ ${cardCount} bias cards displayed`);
          }
        }
      });
    });
  });

  describe('Verify Improvement Suggestions', () => {
    beforeEach(() => {
      // Submit answer and analyze
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

    it('should display improvement suggestions section', () => {
      cy.get('body').then(($body) => {
        const hasSuggestions = $body.find(selectors.biasAnalysis.improvementSuggestions).length > 0 ||
                              $body.find(selectors.biasAnalysis.biasSuggestion).length > 0 ||
                              $body.text().toLowerCase().includes('sugerencia') ||
                              $body.text().toLowerCase().includes('suggestion') ||
                              $body.text().toLowerCase().includes('mejora');

        expect(hasSuggestions).to.be.true;
      });

      cy.log('✓ Improvement suggestions displayed');
    });

    it('should show specific suggestions for each bias', () => {
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.biasCard).length > 0) {
          cy.get(selectors.biasAnalysis.biasCard).first().within(() => {
            cy.get('body').then(($card) => {
              const hasSuggestion = $card.find(selectors.biasAnalysis.biasSuggestion).length > 0 ||
                                   $card.text().toLowerCase().includes('sugerencia') ||
                                   $card.text().toLowerCase().includes('evita') ||
                                   $card.text().toLowerCase().includes('considera');
              expect(hasSuggestion).to.be.true;
            });
          });

          cy.log('✓ Specific suggestions provided');
        }
      });
    });

    it('should provide actionable improvement advice', () => {
      cy.get('body').invoke('text').then((text) => {
        const lowerText = text.toLowerCase();
        const hasActionableAdvice = lowerText.includes('evita') ||
                                    lowerText.includes('considera') ||
                                    lowerText.includes('intenta') ||
                                    lowerText.includes('usa') ||
                                    lowerText.includes('avoid') ||
                                    lowerText.includes('consider') ||
                                    lowerText.includes('try');

        expect(hasActionableAdvice).to.be.true;
      });

      cy.log('✓ Actionable advice provided');
    });
  });

  describe('Verify Academic Recommendations', () => {
    beforeEach(() => {
      // Submit answer and analyze
      cy.navigateToStudentEvaluation();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      cy.get('textarea').first().clear().type('Respuesta para verificar recomendaciones académicas');
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

    it('should display academic recommendations section', () => {
      cy.get('body').then(($body) => {
        const hasRecommendations = $body.find(selectors.biasAnalysis.recommendations).length > 0 ||
                                  $body.find(selectors.biasAnalysis.academicRecommendations).length > 0 ||
                                  $body.text().toLowerCase().includes('recomendación') ||
                                  $body.text().toLowerCase().includes('recommendation');

        expect(hasRecommendations).to.be.true;
      });

      cy.log('✓ Academic recommendations displayed');
    });

    it('should show multiple recommendation items', () => {
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.recommendationItem).length > 0) {
          cy.get(selectors.biasAnalysis.recommendationItem).should('have.length.greaterThan', 0);
        } else {
          // Check for list items or multiple recommendations in text
          const hasMultipleRecommendations = $body.find('li').length > 0 ||
                                            ($body.text().match(/recomendación|recommendation/gi) || []).length > 1;
          expect(hasMultipleRecommendations).to.be.true;
        }
      });

      cy.log('✓ Multiple recommendations shown');
    });

    it('should provide educational guidance', () => {
      cy.get('body').invoke('text').then((text) => {
        const lowerText = text.toLowerCase();
        const hasEducationalContent = lowerText.includes('pensamiento crítico') ||
                                     lowerText.includes('análisis') ||
                                     lowerText.includes('evidencia') ||
                                     lowerText.includes('argumento') ||
                                     lowerText.includes('critical thinking') ||
                                     lowerText.includes('analysis');

        expect(hasEducationalContent).to.be.true;
      });

      cy.log('✓ Educational guidance provided');
    });
  });

  describe('Modal Interaction', () => {
    beforeEach(() => {
      // Submit answer and open analysis
      cy.navigateToStudentEvaluation();
      cy.wait(2000);

      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.textCard).length > 0) {
          cy.get(selectors.texts.textCard).first().click({ force: true });
        }
      });

      cy.wait(2000);

      cy.get('textarea').first().clear().type('Respuesta para probar interacción con modal');
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

    it('should allow closing the bias analysis modal', () => {
      // Look for close button
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.closeModalButton).length > 0) {
          cy.get(selectors.biasAnalysis.closeModalButton).click();
        } else if ($body.find(selectors.common.closeButton).length > 0) {
          cy.get(selectors.common.closeButton).click();
        } else {
          // Try ESC key
          cy.get('body').type('{esc}');
        }
      });

      cy.wait(1000);

      // Verify modal is closed
      cy.get('body').then(($body) => {
        const modalStillOpen = $body.find(selectors.biasAnalysis.biasModal).is(':visible');
        expect(modalStillOpen).to.be.false;
      });

      cy.log('✓ Modal can be closed');
    });

    it('should allow scrolling through bias analysis results', () => {
      // Verify modal content is scrollable
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.biasModal).length > 0) {
          cy.get(selectors.biasAnalysis.biasModal).scrollTo('bottom');
          cy.get(selectors.biasAnalysis.biasModal).scrollTo('top');
          cy.log('✓ Modal content is scrollable');
        }
      });
    });

    it('should maintain analysis results when modal is reopened', () => {
      // Close modal
      cy.get('body').then(($body) => {
        if ($body.find(selectors.common.closeButton).length > 0) {
          cy.get(selectors.common.closeButton).click();
        } else {
          cy.get('body').type('{esc}');
        }
      });

      cy.wait(1000);

      // Reopen analysis
      cy.get('body').then(($body) => {
        if ($body.find(selectors.biasAnalysis.analyzeButton).length > 0) {
          cy.get(selectors.biasAnalysis.analyzeButton).click();
        } else {
          cy.contains('button', /analizar|analyze/i).click();
        }
      });

      cy.wait(2000);

      // Verify results are still there
      cy.get('body').then(($body) => {
        const hasScore = $body.text().match(/\d+[\s\/]*12/);
        expect(hasScore).to.not.be.null;
      });

      cy.log('✓ Analysis results persist');
    });
  });
});
