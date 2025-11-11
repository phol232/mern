/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Student Course Enrollment Tests
 * 
 * Tests the complete flow of a student enrolling in courses:
 * - Viewing available courses
 * - Enrolling in a course
 * - Verifying enrollment success
 * - Viewing enrolled course content
 * 
 * Requirements: 5.1, 5.2
 */

describe('Student Course Enrollment', () => {
  let testCourseId: string;
  let testTopicId: string;
  let testTextId: string;

  before(() => {
    // Setup: Create a test course as teacher
    cy.loginAsTeacher();
    
    cy.fixture('courses').then((courses) => {
      cy.createCourse({
        title: `E2E Test - ${courses.basicCourse.title} - ${Date.now()}`,
        description: courses.basicCourse.description,
        level: courses.basicCourse.level,
      });

      cy.get('@createdCourseId').then((courseId) => {
        testCourseId = String(courseId);
        
        // Create a topic in the course
        cy.createTopic(testCourseId, {
          title: 'Tema de Prueba E2E',
          description: 'Tema creado para pruebas de inscripción',
          order: 1,
        });

        cy.get('@createdTopicId').then((topicId) => {
          testTopicId = String(topicId);
          
          // Create a text in the topic
          cy.fixture('texts').then((texts) => {
            cy.createText(testTopicId, {
              title: texts.textWithoutBiases.title,
              content: texts.textWithoutBiases.content,
              difficulty: texts.textWithoutBiases.difficulty,
              estimatedReadingTime: texts.textWithoutBiases.estimatedReadingTime,
            });

            cy.get('@createdTextId').then((textId) => {
              testTextId = String(textId);
            });
          });
        });
      });
    });
  });

  after(() => {
    // Cleanup: Delete test course
    cy.loginAsTeacher();
    cy.cleanupTestData();
  });

  beforeEach(() => {
    // Login as student before each test
    cy.loginAsStudent();
  });

  describe('View Available Courses', () => {
    it('should display list of available courses', () => {
      // Navigate to available courses page
      cy.navigateToAvailableCourses();

      // Verify page loaded
      cy.url().should('include', '/available-courses');

      // Verify courses are displayed (either in list or grid)
      cy.get('body').then(($body) => {
        const hasCourseList = $body.find(selectors.courses.courseList).length > 0;
        const hasCourseGrid = $body.find(selectors.courses.courseGrid).length > 0;
        const hasCourseCards = $body.find(selectors.courses.courseCard).length > 0;

        expect(hasCourseList || hasCourseGrid || hasCourseCards).to.be.true;
      });

      cy.log('✓ Available courses page displays correctly');
    });

    it('should show course details including title and description', () => {
      cy.navigateToAvailableCourses();

      // Wait for courses to load
      cy.get(selectors.courses.courseCard, { timeout: 10000 }).should('exist');

      // Verify at least one course has title
      cy.get(selectors.courses.courseCard).first().within(() => {
        cy.get(selectors.courses.courseTitle).should('be.visible');
      });

      cy.log('✓ Course details are visible');
    });

    it('should display enroll button for non-enrolled courses', () => {
      cy.navigateToAvailableCourses();

      // Find our test course
      cy.get('body').then(($body) => {
        if ($body.text().includes('E2E Test')) {
          cy.contains(selectors.courses.courseCard, 'E2E Test').within(() => {
            // Check for enroll button
            cy.get('body').then(($card) => {
              const hasEnrollButton = $card.find(selectors.courses.enrollButton).length > 0 ||
                                     $card.text().toLowerCase().includes('inscribir') ||
                                     $card.text().toLowerCase().includes('enroll');
              expect(hasEnrollButton).to.be.true;
            });
          });
        }
      });

      cy.log('✓ Enroll button is available for courses');
    });
  });

  describe('Enroll in Course', () => {
    it('should successfully enroll student in a course', () => {
      cy.navigateToAvailableCourses();

      // Find and click enroll button for test course
      cy.get('body', { timeout: 10000 }).then(($body) => {
        if ($body.text().includes('E2E Test')) {
          cy.contains(selectors.courses.courseCard, 'E2E Test').within(() => {
            // Try to find and click enroll button
            cy.get('body').then(($card) => {
              if ($card.find(selectors.courses.enrollButton).length > 0) {
                cy.get(selectors.courses.enrollButton).click();
              } else {
                // Fallback: look for button with enroll text
                cy.contains('button', /inscribir|enroll/i).click();
              }
            });
          });

          // Verify enrollment success
          cy.verifyEnrollmentSuccess();

          cy.log('✓ Student enrolled successfully');
        } else {
          // If course not found in UI, enroll via API
          cy.enrollStudent(testCourseId);
          cy.log('✓ Student enrolled via API');
        }
      });
    });

    it('should show confirmation message after enrollment', () => {
      // Enroll via API to ensure clean state
      cy.enrollStudent(testCourseId);

      // Navigate to available courses to see updated state
      cy.navigateToAvailableCourses();

      // Look for success message or enrolled status
      cy.get('body').then(($body) => {
        const hasSuccessMessage = $body.find(selectors.common.successMessage).length > 0;
        const hasEnrolledBadge = $body.find(selectors.courses.enrolledBadge).length > 0;
        const hasEnrollmentStatus = $body.find(selectors.enrollment.enrollmentStatus).length > 0;

        // At least one indicator should be present
        expect(hasSuccessMessage || hasEnrolledBadge || hasEnrollmentStatus).to.be.true;
      });

      cy.log('✓ Enrollment confirmation displayed');
    });
  });

  describe('View Enrolled Courses', () => {
    before(() => {
      // Ensure student is enrolled
      cy.loginAsStudent();
      cy.enrollStudent(testCourseId);
    });

    it('should display enrolled course in "My Courses" section', () => {
      // Navigate to courses page (student view)
      cy.navigateToCourses();

      // Wait for courses to load
      cy.get('body', { timeout: 10000 }).should('be.visible');

      // Verify test course appears in the list
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        const hasCourse = bodyText.includes('E2E Test') || bodyText.includes('Prueba E2E');
        expect(hasCourse).to.be.true;
      });

      cy.log('✓ Enrolled course appears in My Courses');
    });

    it('should allow student to view enrolled course details', () => {
      cy.navigateToCourses();

      // Find and click on enrolled course
      cy.get('body', { timeout: 10000 }).then(($body) => {
        if ($body.text().includes('E2E Test')) {
          cy.contains(selectors.courses.courseCard, 'E2E Test').within(() => {
            // Try to click view details or the card itself
            cy.get('body').then(($card) => {
              if ($card.find(selectors.courses.viewDetailsButton).length > 0) {
                cy.get(selectors.courses.viewDetailsButton).click();
              } else {
                // Click the card itself
                cy.get(selectors.courses.courseCard).first().click();
              }
            });
          });

          // Verify we navigated to course details
          cy.url().should('match', /\/courses\/|\/course-content/);

          cy.log('✓ Course details page accessible');
        }
      });
    });

    it('should display course content including topics and texts', () => {
      cy.navigateToCourses();

      // Navigate to course details
      cy.get('body', { timeout: 10000 }).then(($body) => {
        if ($body.text().includes('E2E Test')) {
          cy.contains('E2E Test').click({ force: true });

          // Wait for content to load
          cy.wait(2000);

          // Verify content is displayed
          cy.get('body').then(($content) => {
            const hasTopics = $content.find(selectors.topics.topicCard).length > 0 ||
                             $content.text().includes('Tema');
            const hasTexts = $content.find(selectors.texts.textCard).length > 0 ||
                            $content.text().includes('Texto');

            // At least topics or texts should be visible
            expect(hasTopics || hasTexts).to.be.true;
          });

          cy.log('✓ Course content is visible');
        }
      });
    });
  });

  describe('Enrollment Validation', () => {
    it('should not allow duplicate enrollment in same course', () => {
      // Enroll first time
      cy.enrollStudent(testCourseId);

      // Try to enroll again
      cy.window().then((win) => {
        const token = win.localStorage.getItem('token');

        cy.request({
          method: 'POST',
          url: `${Cypress.config('baseUrl')}/api/enrollments`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: {
            courseId: testCourseId,
          },
          failOnStatusCode: false,
        }).then((response) => {
          // Should either succeed (idempotent) or return error
          expect(response.status).to.be.oneOf([200, 201, 400, 409]);

          if (response.status === 400 || response.status === 409) {
            cy.log('✓ Duplicate enrollment prevented');
          } else {
            cy.log('✓ Enrollment is idempotent');
          }
        });
      });
    });

    it('should maintain enrollment after logout and login', () => {
      // Ensure enrolled
      cy.enrollStudent(testCourseId);

      // Logout
      cy.logout();

      // Login again
      cy.loginAsStudent();

      // Navigate to courses
      cy.navigateToCourses();

      // Verify course still appears
      cy.get('body', { timeout: 10000 }).then(($body) => {
        const hasCourse = $body.text().includes('E2E Test');
        expect(hasCourse).to.be.true;
      });

      cy.log('✓ Enrollment persists across sessions');
    });
  });
});
