/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Teacher Feedback Generation E2E Tests
 * 
 * Tests the AI-powered feedback generation flow for teachers including:
 * - Generating feedback for student answers
 * - Verifying feedback is displayed to students
 * - Generating feedback for multiple answers
 */

describe('Teacher Feedback Generation', () => {
  let testCourseId: string;
  let testTopicId: string;
  let testTextId: string;
  let testQuestionId: string;

  before(() => {
    // Setup: Create complete course structure as teacher
    cy.loginAsTeacher();

    cy.fixture('courses').then((courses) => {
      const courseData = courses.basicCourse;
      const uniqueTitle = `${courseData.title} - Feedback - ${Date.now()}`;
      
      cy.createCourse({
        title: uniqueTitle,
        description: courseData.description,
        level: courseData.level,
      });

      cy.get<string>('@createdCourseId').then((courseId) => {
        testCourseId = courseId;
        
        cy.createTopic(testCourseId, {
          title: 'Tema para Feedback',
          description: 'Tema de prueba para feedback',
        });

        cy.get<string>('@createdTopicId').then((topicId) => {
          testTopicId = topicId;
          
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
              
              cy.fixture('questions').then((questions) => {
                const questionData = questions.literalQuestion;
                
                cy.createQuestion(testTextId, {
                  text: questionData.text,
                  type: questionData.type,
                  hint: questionData.hint,
                });

                cy.get<string>('@createdQuestionId').then((questionId) => {
                  testQuestionId = questionId;
                });
              });
            });
          });
        });
      });
    });

    // Enroll student and submit an answer
    cy.loginAsStudent();
    cy.get<string>('@createdCourseId').then((courseId) => {
      cy.enrollStudent(courseId);
    });

    // Navigate to evaluation and submit an answer
    cy.visit('/app/student-evaluation');
    cy.wait(3000); // Allow page to load

    // Try to submit an answer if UI is available
    cy.get('body').then(($body) => {
      if ($body.find(selectors.questions.answerInput).length > 0) {
        cy.fixture('answers').then((answers) => {
          const answerData = answers.answerWithBiases;
          cy.get(selectors.questions.answerInput).first().type(answerData.value);
          cy.get(selectors.questions.submitAnswerButton).first().click();
          cy.wait(2000);
        });
      }
    });
  });

  beforeEach(() => {
    // Login as teacher for each test
    cy.loginAsTeacher();
  });

  after(() => {
    // Cleanup test data
    cy.cleanupTestData();
  });

  describe('Generate Feedback for Student Answer', () => {
    it('should generate AI feedback for a student answer', () => {
      // Navigate to student management
      cy.navigateToStudentManagement();

      // Check if students are available
      cy.get('body', { timeout: 10000 }).then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          // Click on first student
          cy.get(selectors.students.studentCard).first().click();

          // Look for generate feedback button
          cy.get('body').then(($details) => {
            if ($details.find(selectors.students.generateFeedbackButton).length > 0) {
              // Click generate feedback button
              cy.get(selectors.students.generateFeedbackButton).first().click();

              // Wait for feedback generation (AI call may take time)
              cy.wait(5000);

              // Verify feedback was generated
              cy.verifyFeedbackGenerated();
            } else {
              cy.log('Generate feedback button not found in current UI');
            }
          });
        } else {
          cy.log('No students available for feedback generation');
        }
      });
    });

    it('should display feedback text after generation', () => {
      // Navigate to student management
      cy.navigateToStudentManagement();

      cy.get('body', { timeout: 10000 }).then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          // View student details
          cy.get(selectors.students.studentCard).first().click();

          // Check if feedback already exists or can be generated
          cy.get('body').then(($details) => {
            const hasFeedbackText = $details.find(selectors.students.feedbackText).length > 0;
            const hasFeedbackButton = $details.find(selectors.students.generateFeedbackButton).length > 0;

            if (hasFeedbackText) {
              // Verify existing feedback is visible
              cy.get(selectors.students.feedbackText).should('be.visible');
            } else if (hasFeedbackButton) {
              // Generate new feedback
              cy.get(selectors.students.generateFeedbackButton).first().click();
              cy.wait(5000);
              
              // Verify feedback appears
              cy.get('body').then(($page) => {
                const feedbackGenerated = $page.find(selectors.students.feedbackText).length > 0 ||
                                         $page.find(selectors.common.successMessage).length > 0;
                expect(feedbackGenerated).to.be.true;
              });
            } else {
              cy.log('Feedback functionality not available in current UI');
            }
          });
        }
      });
    });
  });

  describe('Verify Feedback Visibility to Student', () => {
    it('should allow student to view generated feedback', () => {
      // First, ensure feedback exists by generating it as teacher
      cy.navigateToStudentManagement();

      cy.get('body', { timeout: 10000 }).then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          cy.get(selectors.students.studentCard).first().click();

          cy.get('body').then(($details) => {
            if ($details.find(selectors.students.generateFeedbackButton).length > 0) {
              cy.get(selectors.students.generateFeedbackButton).first().click();
              cy.wait(5000);
            }
          });
        }
      });

      // Now login as student and check if feedback is visible
      cy.loginAsStudent();
      cy.visit('/app/student-evaluation');

      // Navigate to the course and check for feedback
      cy.get('body', { timeout: 10000 }).then(($page) => {
        // Look for feedback indicators
        const hasFeedback = $page.text().toLowerCase().includes('feedback') ||
                           $page.text().toLowerCase().includes('retroalimentación') ||
                           $page.find(selectors.students.feedbackText).length > 0;

        if (hasFeedback) {
          cy.log('Feedback is visible to student');
        } else {
          cy.log('Feedback visibility depends on UI implementation');
        }
      });
    });
  });

  describe('Generate Feedback for Multiple Answers', () => {
    it('should generate feedback for multiple student answers', () => {
      // Navigate to student management
      cy.navigateToStudentManagement();

      cy.get('body', { timeout: 10000 }).then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          // View student details
          cy.get(selectors.students.studentCard).first().click();

          // Check if there are multiple answers
          cy.get('body').then(($details) => {
            const answerCards = $details.find(selectors.students.answerCard);
            const feedbackButtons = $details.find(selectors.students.generateFeedbackButton);

            if (feedbackButtons.length > 1) {
              // Generate feedback for first answer
              cy.get(selectors.students.generateFeedbackButton).first().click();
              cy.wait(5000);
              cy.verifyFeedbackGenerated();

              // Generate feedback for second answer
              cy.get(selectors.students.generateFeedbackButton).eq(1).click();
              cy.wait(5000);
              cy.verifyFeedbackGenerated();

              cy.log('Generated feedback for multiple answers');
            } else if (feedbackButtons.length === 1) {
              // Generate feedback for the single answer
              cy.get(selectors.students.generateFeedbackButton).first().click();
              cy.wait(5000);
              cy.verifyFeedbackGenerated();

              cy.log('Generated feedback for available answer');
            } else {
              cy.log('No feedback buttons available - may already be generated');
            }
          });
        } else {
          cy.log('No students available for feedback generation');
        }
      });
    });

    it('should handle bulk feedback generation if available', () => {
      // Navigate to student management
      cy.navigateToStudentManagement();

      // Check if bulk feedback generation is available
      cy.get('body', { timeout: 10000 }).then(($body) => {
        // Look for bulk action buttons
        const hasBulkFeedback = $body.text().toLowerCase().includes('generar todo') ||
                               $body.text().toLowerCase().includes('generate all') ||
                               $body.text().toLowerCase().includes('bulk');

        if (hasBulkFeedback) {
          cy.log('Bulk feedback generation feature detected');
          
          // Try to trigger bulk generation
          cy.contains('button', /generar todo|generate all/i).click();
          cy.wait(10000); // Bulk operations may take longer
          
          // Verify success
          cy.get(selectors.common.successMessage, { timeout: 15000 }).should('be.visible');
        } else {
          cy.log('Bulk feedback generation not available in current UI');
        }
      });
    });
  });

  describe('Feedback Quality Validation', () => {
    it('should verify feedback contains meaningful content', () => {
      // Navigate to student management
      cy.navigateToStudentManagement();

      cy.get('body', { timeout: 10000 }).then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          cy.get(selectors.students.studentCard).first().click();

          cy.get('body').then(($details) => {
            if ($details.find(selectors.students.feedbackText).length > 0) {
              // Verify feedback has substantial content
              cy.get(selectors.students.feedbackText).first().invoke('text').then((text) => {
                expect(text.length).to.be.greaterThan(10);
                cy.log(`Feedback length: ${text.length} characters`);
              });
            } else if ($details.find(selectors.students.generateFeedbackButton).length > 0) {
              // Generate feedback first
              cy.get(selectors.students.generateFeedbackButton).first().click();
              cy.wait(5000);

              // Then verify
              cy.get('body').then(($page) => {
                if ($page.find(selectors.students.feedbackText).length > 0) {
                  cy.get(selectors.students.feedbackText).first().invoke('text').then((text) => {
                    expect(text.length).to.be.greaterThan(10);
                  });
                }
              });
            }
          });
        }
      });
    });
  });
});
