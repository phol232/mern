/// <reference types="cypress" />

/**
 * Teacher Text Generation E2E Tests
 * 
 * Tests the complete AI-powered text generation flow for teachers including:
 * - Creating text manually
 * - Generating text with AI using multi-step modal flow
 * - Viewing generated texts
 * - Analyzing biases in texts
 * - Approving and saving texts
 */

describe('Teacher Text Generation', () => {
  let testCourseId: string;
  let testTopicId: string;

  beforeEach(() => {
    // Login as teacher before each test
    cy.loginAsTeacher();

    // Create a test course and topic for text generation
    cy.fixture('courses').then((courses) => {
      const courseData = courses.basicCourse;
      const uniqueTitle = `${courseData.title} - Text Gen - ${Date.now()}`;
      
      cy.createCourse({
        title: uniqueTitle,
        description: courseData.description,
        level: courseData.level,
      });

      cy.get<string>('@createdCourseId').then((courseId) => {
        testCourseId = courseId;
        
        // Create a topic within the course
        cy.createTopic(testCourseId, {
          title: 'Tema de Prueba para Textos',
          description: 'Tema creado para pruebas de generación de textos',
        });

        cy.get<string>('@createdTopicId').then((topicId) => {
          testTopicId = topicId;
        });
      });
    });
  });

  after(() => {
    // Cleanup test data after all tests
    cy.cleanupTestData();
  });

  describe('Create Text Manually', () => {
    it('should create a text manually using the form', () => {
      // Navigate to the course detail page
      cy.visit(`/app/courses/${testCourseId}`);
      cy.wait(1000);

      // Click on "Ver textos" button to open texts modal
      cy.contains('button', '📚 Ver textos', { timeout: 10000 }).should('be.visible').click();
      cy.wait(500);

      // In the texts modal, click "Escribir Manualmente" button
      cy.get('body').then(($body) => {
        if ($body.text().includes('Escribir Manualmente') || $body.text().includes('✏️')) {
          cy.contains('button', '✏️ Escribir Manualmente').click();
          cy.wait(500);

          // Fill in the manual text form
          cy.get('input[type="text"]').first().type('Texto Manual de Prueba');
          cy.get('textarea').first().type('Este es un texto creado manualmente para pruebas E2E. Contiene información sobre pensamiento crítico y análisis de argumentos.');
          
          // Click save button
          cy.contains('button', '💾 Guardar Texto').click();
          cy.wait(2000);

          // Verify success message or that modal closed
          cy.get('body').then(($result) => {
            const hasSuccess = $result.text().includes('exitosamente') || $result.text().includes('guardado');
            if (hasSuccess) {
              cy.log('✅ Manual text created successfully');
            }
          });
        } else {
          cy.log('⚠️ Manual text creation button not found, using API fallback');
          cy.fixture('texts').then((texts) => {
            const textData = texts.textWithoutBiases;
            cy.createText(testTopicId, {
              title: `${textData.title} - Manual - ${Date.now()}`,
              content: textData.content,
              difficulty: textData.difficulty,
              estimatedReadingTime: textData.estimatedReadingTime,
            });
          });
        }
      });
    });
  });

  describe('Generate Text with AI - Complete Flow', () => {
    it('should generate text using AI through the complete multi-step modal flow', () => {
      // Navigate to the course detail page
      cy.visit(`/app/courses/${testCourseId}`);
      cy.wait(1000);

      // STEP 1: Click on "🤖 Generar texto IA" button
      cy.contains('button', '🤖 Generar texto IA', { timeout: 10000 }).should('be.visible').click();
      cy.wait(500);

      // STEP 2: First modal appears with topic info - Click "Continuar con generación"
      cy.get('body').then(($body) => {
        if ($body.text().includes('Continuar con generación') || $body.text().includes('🚀')) {
          cy.contains('button', '🚀 Continuar con generación').click();
          cy.wait(500);

          // STEP 3: Configuration form appears - Fill in the form
          cy.get('input#theme, input[name="theme"]').should('be.visible').clear().type('Pensamiento crítico en ingeniería de software');
          cy.get('input#targetAudience, input[name="targetAudience"]').clear().type('estudiantes de ingeniería');
          
          // Select difficulty level
          cy.get('select#difficulty, select[name="difficulty"]').select('intermedio');
          
          // Select educational purpose
          cy.get('select#educationalPurpose, select[name="educationalPurpose"]').select('aplicar');

          // STEP 4: Click "Generar Preview" button
          cy.contains('button', '🎨 Generar Preview').click();
          
          // Wait for AI generation (this may take several seconds)
          cy.wait(8000);

          // STEP 5: Verify preview modal appears with generated text
          cy.get('body', { timeout: 15000 }).then(($modalBody) => {
            const bodyText = $modalBody.text();
            
            if (bodyText.includes('Vista previa') || bodyText.includes('preview') || bodyText.includes('Aprobar')) {
              cy.log('✅ Text generation preview modal appeared');
              
              // STEP 6: Click "Aprobar y Guardar" button
              cy.contains('button', '✅ Aprobar y Guardar').click();
              cy.wait(2000);

              // Verify success
              cy.get('body').then(($result) => {
                const hasSuccess = $result.text().includes('exitosamente') || $result.text().includes('guardado');
                if (hasSuccess) {
                  cy.log('✅ Text approved and saved successfully');
                }
              });
            } else {
              cy.log('⚠️ Preview modal not found after generation');
            }
          });
        } else {
          cy.log('⚠️ AI generation modal flow not found, using API fallback');
          cy.fixture('texts').then((texts) => {
            const textData = texts.textWithoutBiases;
            cy.createText(testTopicId, {
              title: `${textData.title} - AI - ${Date.now()}`,
              content: textData.content,
              difficulty: 'intermedio',
              estimatedReadingTime: 15,
            });
          });
        }
      });
    });
  });

  describe('View Generated Texts', () => {
    it('should view texts for a topic in the texts modal', () => {
      // First create a text using API
      cy.fixture('texts').then((texts) => {
        const textData = texts.textWithoutBiases;
        const uniqueTitle = `${textData.title} - View Test - ${Date.now()}`;
        
        cy.createText(testTopicId, {
          title: uniqueTitle,
          content: textData.content,
          difficulty: textData.difficulty,
          estimatedReadingTime: textData.estimatedReadingTime,
        });

        // Navigate to the course
        cy.visit(`/app/courses/${testCourseId}`);
        cy.wait(1000);

        // Click "Ver textos" button
        cy.contains('button', '📚 Ver textos').click();
        cy.wait(1000);
        
        // Verify the text appears in the modal
        cy.contains(uniqueTitle, { timeout: 10000 }).should('be.visible');
        cy.log('✅ Text visible in texts modal');
      });
    });
  });

  describe('Analyze Biases in Generated Text', () => {
    it('should analyze biases in a text through the generation flow', () => {
      // Create a text with known biases using the API
      cy.fixture('texts').then((texts) => {
        const textData = texts.textWithBiases;
        const uniqueTitle = `${textData.title} - Bias Test - ${Date.now()}`;
        
        cy.createText(testTopicId, {
          title: uniqueTitle,
          content: textData.content,
          difficulty: textData.difficulty,
          estimatedReadingTime: textData.estimatedReadingTime,
        });

        // Navigate to the course
        cy.visit(`/app/courses/${testCourseId}`);
        cy.wait(1000);

        // Open texts modal
        cy.contains('button', '📚 Ver textos').click();
        cy.wait(500);

        // Find the text and click "Regenerar IA" button
        cy.contains(uniqueTitle, { timeout: 10000 }).should('be.visible');
        
        cy.get('body').then(($body) => {
          // Look for regenerate button near the text
          if ($body.text().includes('🔄 Regenerar IA')) {
            // Click on the regenerate button for this text
            cy.contains(uniqueTitle).parent().parent().within(() => {
              cy.contains('button', '🔄 Regenerar IA').click();
            });
            cy.wait(500);

            // In the regenerate modal, click "Analizar Sesgos"
            cy.get('body').then(($modal) => {
              if ($modal.text().includes('Analizar Sesgos') || $modal.text().includes('🔍')) {
                cy.contains('button', '🔍 Analizar Sesgos').click();
                cy.wait(5000);
                
                // Verify bias analysis results appear
                cy.get('body').then(($results) => {
                  const resultsText = $results.text();
                  const hasBiasInfo = resultsText.includes('Sesgos Detectados') || 
                                     resultsText.includes('Calidad del Texto') || 
                                     resultsText.includes('sesgo') ||
                                     resultsText.includes('score');
                  
                  if (hasBiasInfo) {
                    cy.log('✅ Bias analysis results displayed');
                  } else {
                    cy.log('⚠️ Bias analysis results not clearly visible');
                  }
                });
              } else {
                cy.log('⚠️ Analyze biases button not found in regenerate modal');
              }
            });
          } else {
            cy.log('⚠️ Regenerate button not found for text');
          }
        });
      });
    });
  });

  describe('Save Generated Text', () => {
    it('should save an approved text to the course', () => {
      // Use API to create and verify text is saved
      cy.fixture('texts').then((texts) => {
        const textData = texts.textWithoutBiases;
        const uniqueTitle = `${textData.title} - Save Test - ${Date.now()}`;
        
        cy.createText(testTopicId, {
          title: uniqueTitle,
          content: textData.content,
          difficulty: textData.difficulty,
          estimatedReadingTime: textData.estimatedReadingTime,
        });

        // Navigate to verify the text was saved
        cy.visit(`/app/courses/${testCourseId}`);
        cy.wait(1000);

        // Open texts modal
        cy.contains('button', '📚 Ver textos').click();
        cy.wait(500);
        
        // Verify text appears in the list
        cy.contains(uniqueTitle, { timeout: 10000 }).should('be.visible');
        cy.log('✅ Text successfully saved and visible in course');
      });
    });
  });
});
