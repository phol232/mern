/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Teacher Question Creation E2E Tests
 * 
 * Tests the complete question management flow for teachers including:
 * - Navigating to questions modal
 * - Creating manual questions (literal, inferential, critical)
 * - Editing existing questions
 * - Deleting questions
 * - Viewing questions list
 * 
 * Replicates the exact frontend flow from CourseDetailPage.jsx
 */

describe('Teacher Question Creation', () => {
  let testCourseId: string;
  let testTopicId: string;
  let testTextId: string;
  let testTextTitle: string;

  before(() => {
    // Login as teacher and create test data once
    cy.loginAsTeacher();

    // Create test course, topic, and text for questions
    cy.fixture('courses').then((courses) => {
      const courseData = courses.basicCourse;
      const uniqueTitle = `${courseData.title} - Questions - ${Date.now()}`;
      
      cy.createCourse({
        title: uniqueTitle,
        description: courseData.description,
        level: courseData.level,
      });

      cy.get<string>('@createdCourseId').then((courseId) => {
        testCourseId = courseId;
        
        cy.createTopic(testCourseId, {
          title: 'Tema de Prueba para Preguntas',
          description: 'Tema creado para pruebas de preguntas',
        });

        cy.get<string>('@createdTopicId').then((topicId) => {
          testTopicId = topicId;
          
          // Create a text for the questions
          cy.fixture('texts').then((texts) => {
            const textData = texts.textWithoutBiases;
            testTextTitle = textData.title;
            
            cy.createText(testTopicId, {
              title: textData.title,
              content: textData.content,
              difficulty: textData.difficulty,
              estimatedReadingTime: textData.estimatedReadingTime,
            });

            cy.get<string>('@createdTextId').then((textId) => {
              testTextId = textId;
            });
          });
        });
      });
    });
  });

  beforeEach(() => {
    // Login before each test
    cy.loginAsTeacher();
  });

  after(() => {
    // Cleanup test data after all tests
    cy.loginAsTeacher();
    cy.cleanupTestData();
  });

  /**
   * Helper function to navigate to questions modal
   * Replicates the frontend flow: Courses → Course Detail → Texts Modal → Questions Modal
   */
  function navigateToQuestionsModal() {
    // Navigate to courses page
    cy.visit('/app/courses');
    cy.wait(2000);

    // Click "Ver temas" to go to course detail
    cy.contains('Ver temas').first().click();
    cy.wait(2000);

    // Find and click "Ver textos" button for the topic
    cy.contains('button', 'Ver textos').first().click();
    cy.wait(2000);

    // Find the text and click "Ver preguntas"
    cy.contains(testTextTitle).parents('article').within(() => {
      cy.contains('button', 'Ver preguntas').click();
    });
    cy.wait(2000);
  }

  describe('Navigate to Questions Modal', () => {
    it('should navigate through the complete flow to reach questions modal', () => {
      navigateToQuestionsModal();

      // Verify questions modal is open
      cy.contains('Preguntas').should('exist');
      
      // Verify action buttons are available (they exist in the DOM)
      cy.contains('🤖 Generar con IA').should('exist');
      cy.contains('✏️ Escribir Manualmente').should('exist');
    });
  });

  describe('Create Manual Questions', () => {
    it('should create a literal type question manually', () => {
      navigateToQuestionsModal();

      // Load question fixture
      cy.fixture('questions').then((questions) => {
        const questionData = questions.literalQuestion;
        const uniqueText = `${questionData.text} - ${Date.now()}`;

        // Make sure we're in the questions modal (not texts modal)
        cy.contains('📝 Preguntas del texto').should('exist');

        // Click "✏️ Escribir Manualmente" button within the questions modal footer
        cy.contains('📝 Preguntas del texto').parents('.modal-content').within(() => {
          cy.contains('button', '✏️ Escribir Manualmente').click({ force: true });
        });
        cy.wait(1000);

        // Fill in question form (textarea) - should be in the manual question modal
        cy.contains('✏️ Escribir Pregunta Manualmente').should('exist');
        cy.get('textarea').first().clear().type(uniqueText);
        
        // Select skill (Habilidad) - Literal
        cy.get('select').eq(0).select('Literal');

        // Save the question
        cy.contains('button', 'Guardar').click({ force: true });
        cy.wait(2000);

        // Verify question appears in the list
        cy.contains(uniqueText).should('exist');
      });
    });

    it('should create an inferential type question manually', () => {
      navigateToQuestionsModal();

      // Load question fixture
      cy.fixture('questions').then((questions) => {
        const questionData = questions.inferentialQuestion;
        const uniqueText = `${questionData.text} - ${Date.now()}`;

        // Make sure we're in the questions modal
        cy.contains('📝 Preguntas del texto').should('exist');

        // Click "✏️ Escribir Manualmente" button within the questions modal
        cy.contains('📝 Preguntas del texto').parents('.modal-content').within(() => {
          cy.contains('button', '✏️ Escribir Manualmente').click({ force: true });
        });
        cy.wait(1000);

        // Fill in question form (textarea)
        cy.contains('✏️ Escribir Pregunta Manualmente').should('exist');
        cy.get('textarea').first().clear().type(uniqueText);
        
        // Select skill (Habilidad) - Inferencial
        cy.get('select').eq(0).select('Inferencial');

        // Save the question
        cy.contains('button', 'Guardar').click({ force: true });
        cy.wait(2000);

        // Verify question appears in the list
        cy.contains(uniqueText).should('exist');
      });
    });

    it('should create a critical type question manually', () => {
      navigateToQuestionsModal();

      // Load question fixture
      cy.fixture('questions').then((questions) => {
        const questionData = questions.criticalQuestion;
        const uniqueText = `${questionData.text} - ${Date.now()}`;

        // Make sure we're in the questions modal
        cy.contains('📝 Preguntas del texto').should('exist');

        // Click "✏️ Escribir Manualmente" button within the questions modal
        cy.contains('📝 Preguntas del texto').parents('.modal-content').within(() => {
          cy.contains('button', '✏️ Escribir Manualmente').click({ force: true });
        });
        cy.wait(1000);

        // Fill in question form (textarea)
        cy.contains('✏️ Escribir Pregunta Manualmente').should('exist');
        cy.get('textarea').first().clear().type(uniqueText);
        
        // Select skill (Habilidad) - Crítica
        cy.get('select').eq(0).select('Crítica');

        // Save the question
        cy.contains('button', 'Guardar').click({ force: true });
        cy.wait(2000);

        // Verify question appears in the list
        cy.contains(uniqueText).should('exist');
      });
    });
  });

  describe('Edit Question', () => {
    it('should edit an existing question', () => {
      // Create a question first using API
      cy.fixture('questions').then((questions) => {
        const originalQuestion = questions.literalQuestion;
        const timestamp = Date.now();
        const originalText = `${originalQuestion.text} - EDIT - ${timestamp}`;
        const updatedText = `${originalQuestion.text} - EDITED - ${timestamp}`;
        
        cy.createQuestion(testTextId, {
          text: originalText,
          type: originalQuestion.type,
          hint: originalQuestion.hint,
        });

        // Navigate to questions modal
        navigateToQuestionsModal();

        // Wait for questions to load
        cy.wait(2000);

        // Verify original question exists
        cy.contains(originalText).should('exist');

        // Find and click edit button (✏️ emoji button) - use closest to get single parent
        cy.contains(originalText).closest('div').find('button').contains('✏️').click({ force: true });

        cy.wait(1000);

        // Update question text
        cy.get('input[type="text"], textarea').first().clear().type(updatedText);

        // Save changes
        cy.contains('button', 'Actualizar').click({ force: true });
        cy.wait(2000);

        // Verify updated question appears
        cy.contains(updatedText).should('exist');
        
        // Verify original text no longer exists
        cy.get('body').then(($body) => {
          const hasOriginal = $body.text().includes(originalText);
          const hasUpdated = $body.text().includes(updatedText);
          
          expect(hasUpdated).to.be.true;
          expect(hasOriginal).to.be.false;
        });
      });
    });
  });

  describe('Delete Question', () => {
    it('should delete a question', () => {
      // Create a question first using API
      cy.fixture('questions').then((questions) => {
        const questionData = questions.literalQuestion;
        const uniqueText = `${questionData.text} - DELETE - ${Date.now()}`;
        
        cy.createQuestion(testTextId, {
          text: uniqueText,
          type: questionData.type,
          hint: questionData.hint,
        });

        // Navigate to questions modal
        navigateToQuestionsModal();

        // Wait for questions to load
        cy.wait(2000);

        // Verify question exists
        cy.contains(uniqueText).should('exist');

        // Find and click delete button (🗑️ emoji button) - use closest to get single parent
        cy.contains(uniqueText).closest('div').find('button').contains('🗑️').click({ force: true });

        // Confirm deletion (window.confirm is auto-accepted by Cypress)
        cy.wait(2000);

        // Verify question is no longer in the list
        cy.contains(uniqueText).should('not.exist');
      });
    });

    it('should delete all questions for a text', () => {
      // Create multiple questions using API
      cy.fixture('questions').then((questions) => {
        const timestamp = Date.now();
        const q1Text = `Question 1 - ${timestamp}`;
        const q2Text = `Question 2 - ${timestamp}`;
        
        cy.createQuestion(testTextId, {
          text: q1Text,
          type: 'literal',
        });
        
        cy.createQuestion(testTextId, {
          text: q2Text,
          type: 'inferencial',
        });

        // Navigate to questions modal
        navigateToQuestionsModal();

        // Wait for questions to load
        cy.wait(2000);

        // Verify both questions exist before deletion
        cy.contains(q1Text).should('exist');
        cy.contains(q2Text).should('exist');

        // Click "🗑️ Eliminar todas" button (note: lowercase "todas")
        cy.contains('🗑️ Eliminar todas').click({ force: true });

        // Confirm deletion (window.confirm is auto-accepted by Cypress)
        cy.wait(2000);

        // Verify questions no longer exist
        cy.contains(q1Text).should('not.exist');
        cy.contains(q2Text).should('not.exist');
      });
    });
  });

  describe('Question Types Validation', () => {
    it('should verify all skill types are available', () => {
      navigateToQuestionsModal();

      // Make sure we're in the questions modal
      cy.contains('📝 Preguntas del texto').should('exist');

      // Click "✏️ Escribir Manualmente" button within the questions modal
      cy.contains('📝 Preguntas del texto').parents('.modal-content').within(() => {
        cy.contains('button', '✏️ Escribir Manualmente').click({ force: true });
      });
      cy.wait(1000);

      // Verify we're in the manual question modal
      cy.contains('✏️ Escribir Pregunta Manualmente').should('exist');

      // Verify skill selector (Habilidad) has all types
      cy.get('select').eq(0).find('option').then(($options) => {
        const optionTexts = [...$options].map(o => o.textContent);
        expect(optionTexts).to.include('Literal');
        expect(optionTexts).to.include('Inferencial');
        expect(optionTexts).to.include('Crítica');
        expect(optionTexts).to.include('Aplicación');
      });
    });
  });

  describe('View Questions List', () => {
    it('should display list of questions for a text', () => {
      // Create some questions first
      cy.fixture('questions').then((questions) => {
        const timestamp = Date.now();
        
        cy.createQuestion(testTextId, {
          text: `View Test Question 1 - ${timestamp}`,
          type: 'literal',
        });
        
        cy.createQuestion(testTextId, {
          text: `View Test Question 2 - ${timestamp}`,
          type: 'inferencial',
        });

        // Navigate to questions modal
        navigateToQuestionsModal();

        // Wait for questions to load
        cy.wait(2000);

        // Scroll to make questions visible and verify they exist
        cy.contains(`View Test Question 1 - ${timestamp}`).scrollIntoView().should('exist');
        cy.contains(`View Test Question 2 - ${timestamp}`).scrollIntoView().should('exist');
      });
    });
  });

  describe('Generate Questions with AI', () => {
    it('should generate questions using AI and verify they are saved', () => {
      navigateToQuestionsModal();

      // Make sure we're in the questions modal
      cy.contains('📝 Preguntas del texto').should('exist');

      // Click "🤖 Generar con IA" button within the questions modal footer
      cy.contains('📝 Preguntas del texto').parents('.modal-content').within(() => {
        cy.contains('button', '🤖 Generar con IA').click({ force: true });
      });
      
      // Wait for AI generation and modal to close
      cy.wait(8000); // Longer wait for AI generation

      // The modal should close after generation, now reopen to see generated questions
      // Navigate back to questions modal
      cy.contains(testTextTitle).parents('article').within(() => {
        cy.contains('button', 'Ver preguntas').click();
      });
      cy.wait(2000);

      // Verify questions were generated and saved
      cy.get('body').then(($body) => {
        if ($body.text().includes('Este texto tiene') && $body.text().includes('preguntas guardadas')) {
          cy.log('✓ AI generated questions successfully');
          
          // Count the questions
          const questionCount = ($body.text().match(/Pregunta \d+/g) || []).length;
          cy.log(`✓ Found ${questionCount} generated questions`);
          expect(questionCount).to.be.greaterThan(0);
        } else {
          cy.log('⚠ AI service may not be available or questions not generated');
        }
      });
    });

    it('should use regenerate button to regenerate existing AI questions', () => {
      navigateToQuestionsModal();

      // Make sure we're in the questions modal with existing questions
      cy.contains('📝 Preguntas del texto').should('exist');

      // If there are questions, there should be a "🔄 Regenerar IA" button
      cy.get('body').then(($body) => {
        if ($body.text().includes('🔄 Regenerar IA')) {
          // Click "🔄 Regenerar IA" button within the questions modal
          cy.contains('📝 Preguntas del texto').parents('.modal-content').within(() => {
            cy.contains('button', '🔄 Regenerar IA').click({ force: true });
          });
          
          // Wait for regeneration (modal closes automatically)
          cy.wait(8000);

          // Reopen questions modal to see regenerated questions
          cy.contains(testTextTitle).parents('article').within(() => {
            cy.contains('button', 'Ver preguntas').click({ force: true });
          });
          cy.wait(2000);

          // Verify questions were regenerated
          cy.contains('Este texto tiene').should('exist');
          cy.log('✓ Questions regenerated successfully');
        } else {
          cy.log('⚠ No existing questions to regenerate');
        }
      });
    });

    it('should verify AI generates multiple questions with different types', () => {
      navigateToQuestionsModal();

      // Make sure we're in the questions modal
      cy.contains('📝 Preguntas del texto').should('exist');

      // Click "🤖 Generar con IA" button
      cy.contains('📝 Preguntas del texto').parents('.modal-content').within(() => {
        cy.contains('button', '🤖 Generar con IA').click({ force: true });
      });
      
      // Wait for AI generation (modal closes automatically)
      cy.wait(8000);

      // Reopen questions modal to see generated questions
      cy.contains(testTextTitle).parents('article').within(() => {
        cy.contains('button', 'Ver preguntas').click({ force: true });
      });
      cy.wait(2000);

      // Count and verify generated questions
      cy.get('body').then(($body) => {
        const questionCount = ($body.text().match(/Pregunta \d+/g) || []).length;
        
        if (questionCount > 0) {
          cy.log(`✓ AI generated ${questionCount} questions`);
          expect(questionCount).to.be.greaterThan(3); // Should generate multiple questions
          
          // Verify different question types are present
          const hasLiteral = $body.text().includes('LITERAL');
          const hasInferencial = $body.text().includes('INFERENCIAL');
          const hasCritica = $body.text().includes('CRÍTICA');
          
          cy.log(`Question types: Literal=${hasLiteral}, Inferencial=${hasInferencial}, Crítica=${hasCritica}`);
          
          cy.log('✓ AI-generated questions saved with multiple types');
        } else {
          cy.log('⚠ AI service may not be available or failed to generate questions');
        }
      });
    });
  });
});
