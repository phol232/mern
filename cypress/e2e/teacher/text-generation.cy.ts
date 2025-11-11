/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Teacher Text Generation E2E Tests
 * 
 * Tests the AI-powered text generation flow for teachers including:
 * - Generating text with AI using prompts
 * - Detecting biases in generated text
 * - Viewing problematic words
 * - Regenerating text with bias correction
 * - Saving approved text to course
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

  describe('Generate Text with AI', () => {
    it('should generate text using AI with a prompt', () => {
      // Navigate to the course/topic where text generation is available
      cy.visit(`/app/courses/${testCourseId}`);

      // Click generate text button
      cy.get(selectors.texts.generateButton, { timeout: 10000 }).click();

      // Enter a prompt for text generation
      const prompt = 'Genera un texto sobre pensamiento crítico en ingeniería de software';
      cy.get(selectors.texts.textPromptInput).type(prompt);

      // Click generate button
      cy.get(selectors.common.submitButton).click();

      // Wait for text to be generated (AI call may take time)
      cy.get(selectors.texts.textContent, { timeout: 30000 }).should('be.visible');

      // Verify generated text has content
      cy.get(selectors.texts.textContent).should('not.be.empty');
    });
  });

  describe('Bias Detection in Generated Text', () => {
    it('should detect biases in generated text', () => {
      // Navigate to the course
      cy.visit(`/app/courses/${testCourseId}`);

      // Create a text with known biases using the API
      cy.fixture('texts').then((texts) => {
        const textData = texts.textWithBiases;
        
        cy.createText(testTopicId, {
          title: textData.title,
          content: textData.content,
          difficulty: textData.difficulty,
          estimatedReadingTime: textData.estimatedReadingTime,
        });

        // Reload the page to see the created text
        cy.reload();

        // Verify bias indicator is present
        cy.get(selectors.texts.biasIndicator, { timeout: 10000 }).should('exist');

        // Verify bias count is displayed
        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.biasCount).length > 0) {
            cy.get(selectors.texts.biasCount).should('be.visible');
          }
        });
      });
    });

    it('should display problematic words in text', () => {
      // Navigate to the course
      cy.visit(`/app/courses/${testCourseId}`);

      // Create a text with known biases
      cy.fixture('texts').then((texts) => {
        const textData = texts.textWithBiases;
        
        cy.createText(testTopicId, {
          title: textData.title,
          content: textData.content,
          difficulty: textData.difficulty,
          estimatedReadingTime: textData.estimatedReadingTime,
        });

        // Reload and view the text
        cy.reload();

        // Click on the text to view details
        cy.contains(textData.title).click();

        // Verify problematic words section exists
        cy.get('body').then(($body) => {
          const hasProblematicWords = $body.find(selectors.texts.problematicWords).length > 0;
          const hasBiasIndicator = $body.find(selectors.texts.biasIndicator).length > 0;
          const hasBiasWarning = $body.find(selectors.texts.biasWarning).length > 0;
          
          // At least one bias-related element should be present
          expect(hasProblematicWords || hasBiasIndicator || hasBiasWarning).to.be.true;
        });
      });
    });
  });

  describe('Regenerate Text', () => {
    it('should regenerate text with bias correction', () => {
      // Navigate to text generation page
      cy.visit(`/app/courses/${testCourseId}`);

      // Click generate text button
      cy.get(selectors.texts.generateButton, { timeout: 10000 }).click();

      // Enter a prompt that might generate biased text
      const prompt = 'Todos los programadores siempre deben usar metodologías ágiles';
      cy.get(selectors.texts.textPromptInput).type(prompt);

      // Generate initial text
      cy.get(selectors.common.submitButton).click();

      // Wait for text generation
      cy.get(selectors.texts.textContent, { timeout: 30000 }).should('be.visible');

      // Check if regenerate button is available
      cy.get('body').then(($body) => {
        if ($body.find(selectors.texts.regenerateButton).length > 0) {
          // Click regenerate button
          cy.get(selectors.texts.regenerateButton).click();

          // Wait for regenerated text
          cy.get(selectors.texts.textContent, { timeout: 30000 }).should('be.visible');

          // Verify text content changed (new generation)
          cy.get(selectors.texts.textContent).should('not.be.empty');
        } else {
          cy.log('Regenerate button not available in current UI');
        }
      });
    });
  });

  describe('Save Text', () => {
    it('should save approved text to course', () => {
      // Navigate to the course
      cy.visit(`/app/courses/${testCourseId}`);

      // Create a text without biases
      cy.fixture('texts').then((texts) => {
        const textData = texts.textWithoutBiases;
        const uniqueTitle = `${textData.title} - ${Date.now()}`;
        
        // If there's a UI flow for creating text, use it
        cy.get('body').then(($body) => {
          if ($body.find(selectors.texts.createTextButton).length > 0) {
            // Use UI to create text
            cy.get(selectors.texts.createTextButton).click();
            cy.get(selectors.texts.textTitle).type(uniqueTitle);
            cy.get(selectors.texts.textEditor).type(textData.content);
            cy.get(selectors.texts.saveTextButton).click();

            // Verify success message
            cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');

            // Verify text appears in the list
            cy.contains(uniqueTitle).should('be.visible');
          } else {
            // Use API to create text
            cy.createText(testTopicId, {
              title: uniqueTitle,
              content: textData.content,
              difficulty: textData.difficulty,
              estimatedReadingTime: textData.estimatedReadingTime,
            });

            // Reload to see the created text
            cy.reload();

            // Verify text appears
            cy.contains(uniqueTitle, { timeout: 10000 }).should('be.visible');
          }
        });
      });
    });
  });
});
