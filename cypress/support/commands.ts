/// <reference types="cypress" />

import { selectors } from './selectors';

// ***********************************************
// Custom Cypress Commands for CRÍTICO E2E Testing
// ***********************************************

// ============================================
// Type Definitions
// ============================================

interface CourseData {
  title: string;
  description: string;
  level?: string;
}

interface TopicData {
  title: string;
  description?: string;
  order?: number;
}

interface TextData {
  title: string;
  content: string;
  difficulty?: string;
  estimatedReadingTime?: number;
}

interface QuestionData {
  text: string;
  type: 'literal' | 'inferencial' | 'critica';
  hint?: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      // Authentication Commands
      login(email: string, password: string): Chainable<void>;
      register(userData: any): Chainable<void>;
      loginAsTeacher(): Chainable<void>;
      loginAsStudent(): Chainable<void>;
      logout(): Chainable<void>;
      
      // Navigation Commands
      navigateToCourses(): Chainable<void>;
      navigateToStudentEvaluation(): Chainable<void>;
      navigateToStudentManagement(): Chainable<void>;
      navigateToAvailableCourses(): Chainable<void>;
      
      // Data Creation Commands (IDs stored in aliases: @createdCourseId, @createdTopicId, etc.)
      createCourse(courseData: CourseData): Chainable<void>;
      createTopic(courseId: string, topicData: TopicData): Chainable<void>;
      createText(topicId: string, textData: TextData): Chainable<void>;
      createQuestion(textId: string, questionData: QuestionData): Chainable<void>;
      enrollStudent(courseId: string): Chainable<void>;
      
      // Validation Commands
      verifyBiasAnalysis(expectedBiases?: number): Chainable<void>;
      verifyCourseInList(courseName: string): Chainable<void>;
      verifyFeedbackGenerated(): Chainable<void>;
      verifyEnrollmentSuccess(): Chainable<void>;
      
      // Cleanup Commands
      cleanupTestData(): Chainable<void>;
    }
  }
}

// ============================================
// Authentication Commands
// ============================================

/**
 * Login with email and password
 * @param email - User email
 * @param password - User password
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  
  // Wait for login form to be visible - use id selector as fallback
  cy.get('input[name="email"], input#email', { timeout: 10000 }).should('be.visible');
  
  // Fill in credentials using name attributes
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
  
  // Submit login form - look for the submit button
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect to dashboard/app
  cy.url({ timeout: 15000 }).should('include', '/app');
  
  // Verify token is stored (check both possible locations)
  cy.window().then((win) => {
    const hasToken = win.localStorage.getItem('auth_token') || 
                    win.localStorage.getItem('critico_auth');
    expect(hasToken).to.exist;
  });
});

/**
 * Register a new user
 * @param userData - User registration data
 */
Cypress.Commands.add('register', (userData: any) => {
  cy.visit('/register');
  
  // Wait for register form to be visible
  cy.get('input[name="firstName"]', { timeout: 10000 }).should('be.visible');
  
  // Fill in registration form
  cy.get('input[name="firstName"]').clear().type(userData.firstName);
  cy.get('input[name="lastName"]').clear().type(userData.lastName);
  cy.get('input[name="email"]').clear().type(userData.email);
  cy.get('input[name="password"]').clear().type(userData.password);
  cy.get('select[name="role"]').select(userData.role);
  
  // Submit registration form
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect to dashboard/app
  cy.url({ timeout: 15000 }).should('include', '/app');
  
  // Verify token is stored (check both possible locations)
  cy.window().then((win) => {
    const hasToken = win.localStorage.getItem('auth_token') || 
                    win.localStorage.getItem('critico_auth');
    expect(hasToken).to.exist;
  });
  
  cy.log(`User registered successfully: ${userData.email}`);
});

/**
 * Login as teacher using session caching
 * Uses cy.session to cache authentication state
 * Registers the user first if they don't exist
 */
Cypress.Commands.add('loginAsTeacher', () => {
  cy.session('teacher-session', () => {
    cy.fixture('users').then((users) => {
      // Try to login first with primary user
      cy.visit('/login');
      cy.get('input[name="email"]', { timeout: 10000 }).should('be.visible');
      cy.get('input[name="email"]').clear().type(users.teacher.email);
      cy.get('input[name="password"]').clear().type(users.teacher.password);
      cy.get('button[type="submit"]').click();
      
      // Wait a bit for login attempt
      cy.wait(2000);
      
      // Check if login was successful or if we need to register
      cy.url().then((url) => {
        if (url.includes('/login')) {
          // Login failed, create a new unique user
          cy.log('Teacher user does not exist, creating new one...');
          
          const timestamp = Date.now();
          const uniqueTeacher = {
            firstName: users.teacher.firstName,
            lastName: users.teacher.lastName,
            email: `docente.test.${timestamp}@yamycorp.com`,
            password: users.teacher.password,
            role: users.teacher.role
          };
          
          cy.register(uniqueTeacher);
        } else {
          // Login successful
          cy.log('Teacher login successful');
        }
      });
    });
  }, {
    validate() {
      // Validate session is still valid - check both possible locations
      cy.window().then((win) => {
        const hasToken = win.localStorage.getItem('auth_token') || 
                        win.localStorage.getItem('critico_auth');
        expect(hasToken).to.exist;
      });
    },
  });
  
  // Visit app after session is restored
  cy.visit('/app');
});

/**
 * Login as student using session caching
 * Uses cy.session to cache authentication state
 * Registers the user first if they don't exist
 */
Cypress.Commands.add('loginAsStudent', () => {
  cy.session('student-session', () => {
    cy.fixture('users').then((users) => {
      // Try to login first with primary user
      cy.visit('/login');
      cy.get('input[name="email"]', { timeout: 10000 }).should('be.visible');
      cy.get('input[name="email"]').clear().type(users.student.email);
      cy.get('input[name="password"]').clear().type(users.student.password);
      cy.get('button[type="submit"]').click();
      
      // Wait a bit for login attempt
      cy.wait(2000);
      
      // Check if login was successful or if we need to register
      cy.url().then((url) => {
        if (url.includes('/login')) {
          // Login failed, create a new unique user
          cy.log('Student user does not exist, creating new one...');
          
          const timestamp = Date.now();
          const uniqueStudent = {
            firstName: users.student.firstName,
            lastName: users.student.lastName,
            email: `estudiante.test.${timestamp}@yamycorp.com`,
            password: users.student.password,
            role: users.student.role
          };
          
          cy.register(uniqueStudent);
        } else {
          // Login successful
          cy.log('Student login successful');
        }
      });
    });
  }, {
    validate() {
      // Validate session is still valid - check both possible locations
      cy.window().then((win) => {
        const hasToken = win.localStorage.getItem('auth_token') || 
                        win.localStorage.getItem('critico_auth');
        expect(hasToken).to.exist;
      });
    },
  });
  
  // Visit app after session is restored
  cy.visit('/app');
});

/**
 * Logout current user
 */
Cypress.Commands.add('logout', () => {
  // Try to find and click logout button
  cy.get('body').then(($body) => {
    if ($body.find(selectors.auth.logoutButton).length > 0) {
      cy.get(selectors.auth.logoutButton).click();
    } else if ($body.find(selectors.navigation.logoutLink).length > 0) {
      cy.get(selectors.navigation.logoutLink).click();
    } else {
      // Fallback: clear localStorage and visit login
      cy.clearLocalStorage();
      cy.clearCookies();
    }
  });
  
  // Verify redirect to login page
  cy.url({ timeout: 10000 }).should('include', '/login');
  
  // Verify token is removed
  cy.window().its('localStorage.token').should('not.exist');
});

// ============================================
// Navigation Commands
// ============================================

/**
 * Navigate to courses page
 */
Cypress.Commands.add('navigateToCourses', () => {
  cy.visit('/app/courses');
  cy.url().should('include', '/app/courses');
  cy.get('body').should('be.visible');
});

/**
 * Navigate to student evaluation page
 */
Cypress.Commands.add('navigateToStudentEvaluation', () => {
  cy.visit('/app/student/evaluation');
  cy.url().should('include', '/app/student/evaluation');
  cy.get('body').should('be.visible');
});

/**
 * Navigate to student management page (teacher only)
 */
Cypress.Commands.add('navigateToStudentManagement', () => {
  cy.visit('/app/students');
  cy.url().should('include', '/app/students');
  cy.get('body').should('be.visible');
});

/**
 * Navigate to available courses page (student view)
 */
Cypress.Commands.add('navigateToAvailableCourses', () => {
  cy.visit('/app/student/available-courses');
  cy.url().should('include', '/app/student/available-courses');
  cy.get('body').should('be.visible');
});

// ============================================
// Data Creation Commands
// ============================================

/**
 * Create a new course via API
 * @param courseData - Course data object
 * @returns Course ID
 */
Cypress.Commands.add('createCourse', (courseData: CourseData) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/courses`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        title: courseData.title,
        description: courseData.description,
        level: courseData.level || 'Básico',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      const courseId = response.body._id || response.body.id;
      cy.log(`Course created with ID: ${courseId}`);
      cy.wrap(courseId).as('createdCourseId');
    });
  });
});

/**
 * Create a new topic within a course via API
 * @param courseId - Course ID
 * @param topicData - Topic data object
 * @returns Topic ID
 */
Cypress.Commands.add('createTopic', (courseId: string, topicData: TopicData) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/courses/${courseId}/topics`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        title: topicData.title,
        description: topicData.description || '',
        order: topicData.order || 1,
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      const topicId = response.body._id || response.body.id;
      cy.log(`Topic created with ID: ${topicId}`);
      cy.wrap(topicId).as('createdTopicId');
    });
  });
});

/**
 * Create a new text within a topic via API
 * @param topicId - Topic ID
 * @param textData - Text data object
 * @returns Text ID
 */
Cypress.Commands.add('createText', (topicId: string, textData: TextData) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/topics/${topicId}/texts`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        title: textData.title,
        content: textData.content,
        difficulty: textData.difficulty || 'intermediate',
        estimatedReadingTime: textData.estimatedReadingTime || 5,
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      const textId = response.body._id || response.body.id;
      cy.log(`Text created with ID: ${textId}`);
      cy.wrap(textId).as('createdTextId');
    });
  });
});

/**
 * Create a new question for a text via API
 * @param textId - Text ID
 * @param questionData - Question data object
 * @returns Question ID
 */
Cypress.Commands.add('createQuestion', (textId: string, questionData: QuestionData) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/texts/${textId}/questions`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        text: questionData.text,
        type: questionData.type,
        hint: questionData.hint || '',
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      const questionId = response.body._id || response.body.id;
      cy.log(`Question created with ID: ${questionId}`);
      cy.wrap(questionId).as('createdQuestionId');
    });
  });
});

/**
 * Enroll current student in a course via API
 * @param courseId - Course ID to enroll in
 */
Cypress.Commands.add('enrollStudent', (courseId: string) => {
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
        courseId: courseId,
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      cy.log(`Student enrolled in course: ${courseId}`);
    });
  });
});

// ============================================
// Validation Commands
// ============================================

/**
 * Verify bias analysis results are displayed
 * @param expectedBiases - Expected number of biases (optional)
 */
Cypress.Commands.add('verifyBiasAnalysis', (expectedBiases?: number) => {
  // Verify bias modal is visible
  cy.get(selectors.biasAnalysis.biasModal, { timeout: 15000 }).should('be.visible');
  
  // Verify score is displayed
  cy.get(selectors.biasAnalysis.biasScore).should('be.visible');
  
  // Verify level is displayed
  cy.get(selectors.biasAnalysis.biasLevel).should('be.visible');
  
  // If expected biases count is provided, verify it
  if (expectedBiases !== undefined) {
    if (expectedBiases > 0) {
      cy.get(selectors.biasAnalysis.biasCard).should('have.length', expectedBiases);
    } else {
      cy.get(selectors.biasAnalysis.biasModal).then(($modal) => {
        const text = $modal.text().toLowerCase();
        const hasNoBiasMessage = text.includes('sin sesgos') || 
                                 text.includes('no biases') || 
                                 text.includes('excelente');
        expect(hasNoBiasMessage).to.be.true;
      });
    }
  }
  
  // Verify recommendations section exists
  cy.get(selectors.biasAnalysis.recommendations).should('exist');
});

/**
 * Verify a course appears in the course list
 * @param courseName - Name of the course to verify
 */
Cypress.Commands.add('verifyCourseInList', (courseName: string) => {
  cy.get(selectors.courses.courseList, { timeout: 10000 })
    .should('be.visible')
    .and('contain', courseName);
  
  cy.log(`Verified course "${courseName}" appears in list`);
});

/**
 * Verify feedback has been generated and is visible
 */
Cypress.Commands.add('verifyFeedbackGenerated', () => {
  // Check for feedback text or modal
  cy.get('body').then(($body) => {
    const hasFeedbackText = $body.find(selectors.students.feedbackText).length > 0;
    const hasFeedbackModal = $body.find(selectors.students.feedbackModal).length > 0;
    const hasSuccessMessage = $body.find(selectors.common.successMessage).length > 0;
    
    expect(hasFeedbackText || hasFeedbackModal || hasSuccessMessage).to.be.true;
  });
  
  cy.log('Verified feedback was generated');
});

/**
 * Verify student enrollment was successful
 */
Cypress.Commands.add('verifyEnrollmentSuccess', () => {
  // Check for success message or enrollment confirmation
  cy.get('body').then(($body) => {
    if ($body.find(selectors.common.successMessage).length > 0) {
      cy.get(selectors.common.successMessage).then(($msg) => {
        const text = $msg.text().toLowerCase();
        const hasEnrollmentMessage = text.includes('inscrito') || 
                                     text.includes('enrolled') || 
                                     text.includes('exitosamente') || 
                                     text.includes('successfully');
        expect(hasEnrollmentMessage).to.be.true;
      });
    } else if ($body.find(selectors.enrollment.enrollmentStatus).length > 0) {
      cy.get(selectors.enrollment.enrollmentStatus).should('be.visible');
    }
  });
  
  cy.log('Verified enrollment was successful');
});

// ============================================
// Cleanup Commands
// ============================================

/**
 * Cleanup test data created during tests
 * Identifies and removes resources with "E2E Test" or "Cypress Test" in the name
 */
Cypress.Commands.add('cleanupTestData', () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    
    if (!token) {
      cy.log('No token found, skipping cleanup');
      return;
    }
    
    // Get all courses and delete test courses
    cy.request({
      method: 'GET',
      url: `${Cypress.config('baseUrl')}/api/courses`,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200 && response.body) {
        const courses = Array.isArray(response.body) ? response.body : response.body.courses || [];
        
        courses.forEach((course: any) => {
          const isTestCourse = course.title && (
            course.title.includes('E2E Test') ||
            course.title.includes('Cypress Test') ||
            course.title.includes('Prueba E2E') ||
            course.title.includes('Test Automation')
          );
          
          if (isTestCourse) {
            const courseId = course._id || course.id;
            cy.request({
              method: 'DELETE',
              url: `${Cypress.config('baseUrl')}/api/courses/${courseId}`,
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              failOnStatusCode: false,
            }).then(() => {
              cy.log(`Deleted test course: ${course.title}`);
            });
          }
        });
      }
    });
  });
  
  cy.log('Cleanup completed');
});

export {};
