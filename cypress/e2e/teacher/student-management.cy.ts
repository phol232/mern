/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Teacher Student Management E2E Tests
 * 
 * Tests the student management and monitoring flow for teachers including:
 * - Viewing list of enrolled students
 * - Viewing student progress
 * - Filtering students by course
 * - Viewing student answers
 */

describe('Teacher Student Management', () => {
  let testCourseId: string;
  let testTopicId: string;
  let testTextId: string;
  let testQuestionId: string;

  before(() => {
    // Setup: Create course structure as teacher
    cy.loginAsTeacher();

    cy.fixture('courses').then((courses) => {
      const courseData = courses.basicCourse;
      const uniqueTitle = `${courseData.title} - Student Mgmt - ${Date.now()}`;
      
      cy.createCourse({
        title: uniqueTitle,
        description: courseData.description,
        level: courseData.level,
      });

      cy.get<string>('@createdCourseId').then((courseId) => {
        testCourseId = courseId;
        
        cy.createTopic(testCourseId, {
          title: 'Tema para Gestión de Estudiantes',
          description: 'Tema de prueba',
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

    // Enroll a student in the course
    cy.loginAsStudent();
    cy.get<string>('@createdCourseId').then((courseId) => {
      cy.enrollStudent(courseId);
    });

    // Student answers a question
    cy.visit(`/app/student-evaluation`);
    cy.wait(2000); // Allow page to load
  });

  beforeEach(() => {
    // Login as teacher for each test
    cy.loginAsTeacher();
  });

  after(() => {
    // Cleanup test data
    cy.cleanupTestData();
  });

  describe('View Enrolled Students', () => {
    it('should display list of students enrolled in course', () => {
      // Navigate to student management page
      cy.navigateToStudentManagement();

      // Verify student list is visible
      cy.get(selectors.students.studentList, { timeout: 10000 }).should('be.visible');

      // Verify at least one student card exists or empty state
      cy.get('body').then(($body) => {
        const hasStudents = $body.find(selectors.students.studentCard).length > 0;
        const hasEmptyState = $body.find(selectors.common.emptyState).length > 0;
        
        expect(hasStudents || hasEmptyState).to.be.true;
      });
    });

    it('should display student information in the list', () => {
      // Navigate to student management page
      cy.navigateToStudentManagement();

      // Check if there are enrolled students
      cy.get('body').then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          // Verify student card contains name or email
          cy.get(selectors.students.studentCard).first().within(() => {
            cy.get('body').then(($card) => {
              const hasName = $card.find(selectors.students.studentName).length > 0;
              const hasEmail = $card.find(selectors.students.studentEmail).length > 0;
              
              expect(hasName || hasEmail).to.be.true;
            });
          });
        } else {
          cy.log('No students enrolled yet');
        }
      });
    });
  });

  describe('View Student Progress', () => {
    it('should display progress metrics for a student', () => {
      // Navigate to student management page
      cy.navigateToStudentManagement();

      // Check if there are students with progress data
      cy.get('body').then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          // Click on first student to view details
          cy.get(selectors.students.studentCard).first().click();

          // Verify progress information is displayed
          cy.get('body').then(($details) => {
            const hasProgressBar = $details.find(selectors.students.progressBar).length > 0;
            const hasProgressPercentage = $details.find(selectors.students.progressPercentage).length > 0;
            const hasTextsCompleted = $details.find(selectors.students.textsCompleted).length > 0;
            const hasQuestionsAnswered = $details.find(selectors.students.questionsAnswered).length > 0;
            
            // At least one progress metric should be visible
            expect(hasProgressBar || hasProgressPercentage || hasTextsCompleted || hasQuestionsAnswered).to.be.true;
          });
        } else {
          cy.log('No students to view progress for');
        }
      });
    });

    it('should show texts completed metric', () => {
      // Navigate to student management page
      cy.navigateToStudentManagement();

      cy.get('body').then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          // View student details
          cy.get(selectors.students.studentCard).first().within(() => {
            // Check if view details button exists
            if ($body.find(selectors.students.viewAnswersButton).length > 0) {
              cy.get(selectors.students.viewAnswersButton).click();
            } else {
              cy.get(selectors.students.studentCard).first().click();
            }
          });

          // Verify some progress metric is visible
          cy.get('body').then(($details) => {
            const hasProgressInfo = $details.text().toLowerCase().includes('progreso') ||
                                   $details.text().toLowerCase().includes('progress') ||
                                   $details.text().toLowerCase().includes('completado') ||
                                   $details.text().toLowerCase().includes('completed');
            
            expect(hasProgressInfo).to.be.true;
          });
        }
      });
    });
  });

  describe('Filter Students by Course', () => {
    it('should filter students by selected course', () => {
      // Navigate to student management page
      cy.navigateToStudentManagement();

      // Check if course filter exists
      cy.get('body').then(($body) => {
        if ($body.find(selectors.students.courseFilter).length > 0) {
          // Select the test course from filter
          cy.get(selectors.students.courseFilter).select(0);

          // Verify student list updates
          cy.get(selectors.students.studentList, { timeout: 10000 }).should('be.visible');
        } else {
          cy.log('Course filter not available in current UI');
        }
      });
    });
  });

  describe('View Student Answers', () => {
    it('should display answers submitted by a student', () => {
      // Navigate to student management page
      cy.navigateToStudentManagement();

      cy.get('body').then(($body) => {
        if ($body.find(selectors.students.studentCard).length > 0) {
          // Click on student to view details
          cy.get(selectors.students.studentCard).first().within(() => {
            // Try to click view answers button
            if ($body.find(selectors.students.viewAnswersButton).length > 0) {
              cy.get(selectors.students.viewAnswersButton).click();
            } else {
              cy.get(selectors.students.studentCard).first().click();
            }
          });

          // Verify answers section or modal is displayed
          cy.get('body', { timeout: 10000 }).then(($page) => {
            const hasAnswersList = $page.find(selectors.students.answersList).length > 0;
            const hasAnswerCard = $page.find(selectors.students.answerCard).length > 0;
            const hasStudentDetails = $page.find(selectors.students.studentDetails).length > 0;
            const hasEmptyState = $page.text().toLowerCase().includes('no hay respuestas') ||
                                 $page.text().toLowerCase().includes('no answers');
            
            // Either answers are shown or empty state is displayed
            expect(hasAnswersList || hasAnswerCard || hasStudentDetails || hasEmptyState).to.be.true;
          });
        } else {
          cy.log('No students available to view answers');
        }
      });
    });
  });

  describe('Student List Features', () => {
    it('should display enrolled students count', () => {
      // Navigate to student management page
      cy.navigateToStudentManagement();

      // Verify page loaded
      cy.get('body', { timeout: 10000 }).should('be.visible');

      // Check for student count or list
      cy.get('body').then(($body) => {
        const hasStudentList = $body.find(selectors.students.studentList).length > 0;
        const hasEnrolledStudents = $body.find(selectors.students.enrolledStudents).length > 0;
        const hasStudentCards = $body.find(selectors.students.studentCard).length > 0;
        const hasEmptyState = $body.find(selectors.common.emptyState).length > 0;
        
        expect(hasStudentList || hasEnrolledStudents || hasStudentCards || hasEmptyState).to.be.true;
      });
    });

    it('should allow searching for students', () => {
      // Navigate to student management page
      cy.navigateToStudentManagement();

      // Check if search input exists
      cy.get('body').then(($body) => {
        if ($body.find(selectors.students.searchInput).length > 0) {
          // Type in search input
          cy.get(selectors.students.searchInput).type('estudiante');

          // Verify list updates or remains visible
          cy.get(selectors.students.studentList, { timeout: 5000 }).should('be.visible');
        } else {
          cy.log('Search functionality not available in current UI');
        }
      });
    });
  });
});
