/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Teacher Question Creation E2E Tests
 * 
 * Tests the question creation and management flow for teachers including:
 * - Creating literal questions
 * - Creating inferential questions
 * - Creating critical questions
 * - Editing existing questions
 * - Deleting questions
 */

describe('Teacher Question Creation', () => {
  let testCourseId: string;
  let testTopicId: string;
  let testTextId: string;

  beforeEach(() => {
    // Login as teacher before each test
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

  after(() => {
    // Cleanup test data after all tests
    cy.cleanupTestData();
  });

  describe('Create Literal Question', () => {
    it('should create a literal type question', () => {
      // Navigate to the text where questions can be created
      cy.visit(`/app/courses/${testCourseId}`);

      // Load question fixture
      cy.fixture('questions').then((questions) => {
        const questionData = questions.literalQuestion;

        // Click create question button
        cy.get(selectors.questions.createButton, { timeout: 10000 }).click();

        // Fill in question form
        cy.get(selectors.questions.questionTextInput).type(questionData.text);
        cy.get(selectors.questions.questionTypeSelect).select(questionData.type);
        
        // Add hint if field is available
        cy.get('body').then(($body) => {
          if ($body.find(selectors.questions.questionHintInput).length > 0) {
            cy.get(selectors.questions.questionHintInput).type(questionData.hint);
          }
        });

        // Save the question
        cy.get(selectors.questions.saveQuestionButton).click();

        // Verify success message
        cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');

        // Verify question appears in the list
        cy.get(selectors.questions.questionList).should('contain', questionData.text);
      });
    });
  });

  describe('Create Inferential Question', () => {
    it('should create an inferential type question', () => {
      // Navigate to the text
      cy.visit(`/app/courses/${testCourseId}`);

      // Load question fixture
      cy.fixture('questions').then((questions) => {
        const questionData = questions.inferentialQuestion;

        // Click create question button
        cy.get(selectors.questions.createButton, { timeout: 10000 }).click();

        // Fill in question form
        cy.get(selectors.questions.questionTextInput).type(questionData.text);
        cy.get(selectors.questions.questionTypeSelect).select(questionData.type);
        
        // Add hint if field is available
        cy.get('body').then(($body) => {
          if ($body.find(selectors.questions.questionHintInput).length > 0) {
            cy.get(selectors.questions.questionHintInput).type(questionData.hint);
          }
        });

        // Save the question
        cy.get(selectors.questions.saveQuestionButton).click();

        // Verify success message
        cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');

        // Verify question appears in the list
        cy.get(selectors.questions.questionList).should('contain', questionData.text);
      });
    });
  });

  describe('Create Critical Question', () => {
    it('should create a critical type question', () => {
      // Navigate to the text
      cy.visit(`/app/courses/${testCourseId}`);

      // Load question fixture
      cy.fixture('questions').then((questions) => {
        const questionData = questions.criticalQuestion;

        // Click create question button
        cy.get(selectors.questions.createButton, { timeout: 10000 }).click();

        // Fill in question form
        cy.get(selectors.questions.questionTextInput).type(questionData.text);
        cy.get(selectors.questions.questionTypeSelect).select(questionData.type);
        
        // Add hint if field is available
        cy.get('body').then(($body) => {
          if ($body.find(selectors.questions.questionHintInput).length > 0) {
            cy.get(selectors.questions.questionHintInput).type(questionData.hint);
          }
        });

        // Save the question
        cy.get(selectors.questions.saveQuestionButton).click();

        // Verify success message
        cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');

        // Verify question appears in the list
        cy.get(selectors.questions.questionList).should('contain', questionData.text);
      });
    });
  });

  describe('Edit Question', () => {
    it('should edit an existing question', () => {
      // Create a question first using API
      cy.fixture('questions').then((questions) => {
        const originalQuestion = questions.literalQuestion;
        
        cy.createQuestion(testTextId, {
          text: originalQuestion.text,
          type: originalQuestion.type,
          hint: originalQuestion.hint,
        });

        // Navigate to the course
        cy.visit(`/app/courses/${testCourseId}`);

        // Find and click edit on the question
        cy.contains(selectors.questions.questionCard, originalQuestion.text).within(() => {
          cy.get(selectors.questions.editQuestionButton).click();
        });

        // Update question text
        const updatedText = `${originalQuestion.text} - ACTUALIZADA`;
        cy.get(selectors.questions.questionTextInput).clear().type(updatedText);

        // Save changes
        cy.get(selectors.questions.saveQuestionButton).click();

        // Verify success message
        cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');

        // Verify updated question appears
        cy.get(selectors.questions.questionList).should('contain', updatedText);
      });
    });
  });

  describe('Delete Question', () => {
    it('should delete a question', () => {
      // Create a question first using API
      cy.fixture('questions').then((questions) => {
        const questionData = questions.literalQuestion;
        const uniqueText = `${questionData.text} - DELETE TEST - ${Date.now()}`;
        
        cy.createQuestion(testTextId, {
          text: uniqueText,
          type: questionData.type,
          hint: questionData.hint,
        });

        // Navigate to the course
        cy.visit(`/app/courses/${testCourseId}`);

        // Verify question exists
        cy.get(selectors.questions.questionList, { timeout: 10000 }).should('contain', uniqueText);

        // Find and click delete on the question
        cy.contains(selectors.questions.questionCard, uniqueText).within(() => {
          cy.get(selectors.questions.deleteQuestionButton).click();
        });

        // Confirm deletion if confirmation modal appears
        cy.get('body').then(($body) => {
          if ($body.find(selectors.common.confirmButton).length > 0) {
            cy.get(selectors.common.confirmButton).click();
          }
        });

        // Verify success message
        cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');

        // Verify question is no longer in the list
        cy.get(selectors.questions.questionList).should('not.contain', uniqueText);
      });
    });
  });

  describe('Question Types Validation', () => {
    it('should verify all three question types are available', () => {
      // Navigate to the course
      cy.visit(`/app/courses/${testCourseId}`);

      // Click create question button
      cy.get(selectors.questions.createButton, { timeout: 10000 }).click();

      // Verify question type selector has all three types
      cy.get(selectors.questions.questionTypeSelect).within(() => {
        cy.contains('option', 'literal').should('exist');
        cy.contains('option', 'inferencial').should('exist');
        cy.contains('option', 'critica').should('exist');
      });
    });
  });
});
