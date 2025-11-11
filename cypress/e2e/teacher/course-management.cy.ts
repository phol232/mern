/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

/**
 * Teacher Course Management E2E Tests
 * 
 * Tests the complete course management flow for teachers including:
 * - Creating new courses
 * - Editing existing courses
 * - Deleting courses
 * - Viewing course list
 * - Viewing course details
 */

describe('Teacher Course Management', () => {
  beforeEach(() => {
    // Login as teacher before each test
    cy.loginAsTeacher();
  });

  after(() => {
    // Cleanup test data after all tests
    cy.cleanupTestData();
  });

  describe('Create Course', () => {
    it('should create a new course with title and description', () => {
      // Navigate to courses page
      cy.navigateToCourses();

      // Load course fixture data
      cy.fixture('courses').then((courses) => {
        const courseData = courses.basicCourse;
        const uniqueTitle = `${courseData.title} - ${Date.now()}`;

        // Click create course button
        cy.get(selectors.courses.createButton).click();

        // Fill in course form
        cy.get(selectors.courses.courseTitleInput).type(uniqueTitle);
        cy.get(selectors.courses.courseDescriptionInput).type(courseData.description);
        
        // Select course level if available
        cy.get('body').then(($body) => {
          if ($body.find(selectors.courses.courseLevelSelect).length > 0) {
            cy.get(selectors.courses.courseLevelSelect).select(courseData.level);
          }
        });

        // Save the course
        cy.get(selectors.courses.saveCourseButton).click();

        // Verify course was created successfully
        cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');
        
        // Verify course appears in the list
        cy.verifyCourseInList(uniqueTitle);
      });
    });
  });

  describe('View Courses', () => {
    it('should display list of courses created by the teacher', () => {
      // Navigate to courses page
      cy.navigateToCourses();

      // Verify course list is visible
      cy.get(selectors.courses.courseList, { timeout: 10000 }).should('be.visible');

      // Verify at least one course card exists or empty state is shown
      cy.get('body').then(($body) => {
        const hasCourses = $body.find(selectors.courses.courseCard).length > 0;
        const hasEmptyState = $body.find(selectors.common.emptyState).length > 0;
        
        expect(hasCourses || hasEmptyState).to.be.true;
      });
    });

    it('should view details of a specific course', () => {
      // Create a test course first
      cy.fixture('courses').then((courses) => {
        const courseData = courses.basicCourse;
        const uniqueTitle = `${courseData.title} - Details Test - ${Date.now()}`;
        
        cy.createCourse({
          title: uniqueTitle,
          description: courseData.description,
          level: courseData.level,
        });

        // Navigate to courses page
        cy.navigateToCourses();

        // Find and click on the created course
        cy.contains(selectors.courses.courseCard, uniqueTitle).within(() => {
          // Try to click view details button or the card itself
          cy.get('body').then(($body) => {
            if ($body.find(selectors.courses.viewDetailsButton).length > 0) {
              cy.get(selectors.courses.viewDetailsButton).click();
            } else {
              cy.get(selectors.courses.courseTitle).click();
            }
          });
        });

        // Verify we're on the course details page
        cy.url().should('match', /\/courses\/[a-f0-9]+/);

        // Verify course details are displayed
        cy.contains(uniqueTitle).should('be.visible');
      });
    });
  });

  describe('Edit Course', () => {
    it('should edit an existing course', () => {
      // Create a test course first
      cy.fixture('courses').then((courses) => {
        const courseData = courses.basicCourse;
        const originalTitle = `${courseData.title} - Edit Test - ${Date.now()}`;
        const updatedTitle = `${originalTitle} - UPDATED`;
        
        cy.createCourse({
          title: originalTitle,
          description: courseData.description,
          level: courseData.level,
        });

        // Navigate to courses page
        cy.navigateToCourses();

        // Find the course and click edit
        cy.contains(selectors.courses.courseCard, originalTitle).within(() => {
          cy.get(selectors.courses.editButton).click();
        });

        // Update course title
        cy.get(selectors.courses.courseTitleInput).clear().type(updatedTitle);

        // Save changes
        cy.get(selectors.courses.saveCourseButton).click();

        // Verify success message
        cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');

        // Verify updated course appears in list
        cy.verifyCourseInList(updatedTitle);

        // Verify old title is no longer present
        cy.get(selectors.courses.courseList).should('not.contain', originalTitle);
      });
    });
  });

  describe('Delete Course', () => {
    it('should delete a course', () => {
      // Create a test course first
      cy.fixture('courses').then((courses) => {
        const courseData = courses.basicCourse;
        const courseTitle = `${courseData.title} - Delete Test - ${Date.now()}`;
        
        cy.createCourse({
          title: courseTitle,
          description: courseData.description,
          level: courseData.level,
        });

        // Navigate to courses page
        cy.navigateToCourses();

        // Verify course exists
        cy.verifyCourseInList(courseTitle);

        // Find the course and click delete
        cy.contains(selectors.courses.courseCard, courseTitle).within(() => {
          cy.get(selectors.courses.deleteButton).click();
        });

        // Confirm deletion if confirmation modal appears
        cy.get('body').then(($body) => {
          if ($body.find(selectors.common.confirmButton).length > 0) {
            cy.get(selectors.common.confirmButton).click();
          }
        });

        // Verify success message
        cy.get(selectors.common.successMessage, { timeout: 10000 }).should('be.visible');

        // Verify course is no longer in the list
        cy.get(selectors.courses.courseList).should('not.contain', courseTitle);
      });
    });
  });
});
