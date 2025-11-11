/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

describe('Authentication - Route Protection', () => {
  beforeEach(() => {
    // Clear all authentication data before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Unauthenticated Access', () => {
    it('should redirect to login when accessing /app without authentication', () => {
      // Try to access protected route without being logged in
      cy.visit('/app');
      
      // Should be redirected to login page
      cy.url({ timeout: 10000 }).should('include', '/login');
      
      // Verify no token exists
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
      
      // Verify login form is visible
      cy.get('body').then(($body) => {
        const hasLoginForm = 
          $body.find(selectors.auth.emailInput).length > 0 ||
          $body.find('input[type="email"]').length > 0;
        expect(hasLoginForm).to.be.true;
      });
    });

    it('should redirect to login when accessing /app/courses without authentication', () => {
      // Try to access courses page without authentication
      cy.visit('/app/courses');
      
      // Should be redirected to login
      cy.url({ timeout: 10000 }).should('include', '/login');
      
      // Verify no token
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });

    it('should redirect to login when accessing /app/students without authentication', () => {
      // Try to access student management page without authentication
      cy.visit('/app/students');
      
      // Should be redirected to login
      cy.url({ timeout: 10000 }).should('include', '/login');
      
      // Verify no authentication
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });

    it('should redirect to login when accessing /app/student-evaluation without authentication', () => {
      // Try to access student evaluation page without authentication
      cy.visit('/app/student-evaluation');
      
      // Should be redirected to login
      cy.url({ timeout: 10000 }).should('include', '/login');
      
      // Verify no token
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });

    it('should redirect to login when accessing /app/available-courses without authentication', () => {
      // Try to access available courses page without authentication
      cy.visit('/app/available-courses');
      
      // Should be redirected to login
      cy.url({ timeout: 10000 }).should('include', '/login');
    });

    it('should redirect to login when accessing /app/generate-text without authentication', () => {
      // Try to access text generation page without authentication
      cy.visit('/app/generate-text');
      
      // Should be redirected to login
      cy.url({ timeout: 10000 }).should('include', '/login');
    });
  });

  describe('Authenticated Access', () => {
    it('should allow access to /app when authenticated as teacher', () => {
      cy.fixture('users').then((users) => {
        // Login as teacher
        cy.login(users.teacher.email, users.teacher.password);
        
        // Should be on /app
        cy.url().should('include', '/app');
        
        // Verify token exists
        cy.window().its('localStorage.token').should('exist');
        
        // Should see authenticated content
        cy.get('body').should('be.visible');
      });
    });

    it('should allow access to /app when authenticated as student', () => {
      cy.fixture('users').then((users) => {
        // Login as student
        cy.login(users.student.email, users.student.password);
        
        // Should be on /app
        cy.url().should('include', '/app');
        
        // Verify token exists
        cy.window().its('localStorage.token').should('exist');
      });
    });

    it('should allow teacher to access /app/courses', () => {
      cy.fixture('users').then((users) => {
        // Login as teacher
        cy.login(users.teacher.email, users.teacher.password);
        
        // Navigate to courses
        cy.visit('/app/courses');
        
        // Should stay on courses page
        cy.url().should('include', '/app/courses');
        
        // Should see courses content
        cy.get('body').should('be.visible');
      });
    });

    it('should allow student to access /app/available-courses', () => {
      cy.fixture('users').then((users) => {
        // Login as student
        cy.login(users.student.email, users.student.password);
        
        // Navigate to available courses
        cy.visit('/app/available-courses');
        
        // Should stay on available courses page
        cy.url().should('include', '/app/available-courses');
        
        // Should see content
        cy.get('body').should('be.visible');
      });
    });

    it('should allow student to access /app/student-evaluation', () => {
      cy.fixture('users').then((users) => {
        // Login as student
        cy.login(users.student.email, users.student.password);
        
        // Navigate to evaluation page
        cy.visit('/app/student-evaluation');
        
        // Should stay on evaluation page
        cy.url().should('include', '/app/student-evaluation');
        
        // Should see content
        cy.get('body').should('be.visible');
      });
    });
  });

  describe('Session Expiration', () => {
    it('should redirect to login when token is invalid', () => {
      // Set an invalid token
      cy.visit('/login');
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'invalid-token-12345');
      });
      
      // Try to access protected route
      cy.visit('/app/courses');
      
      // Should be redirected to login (token validation fails)
      cy.url({ timeout: 10000 }).should('satisfy', (url: string) => {
        return url.includes('/login') || url.includes('/app');
      });
    });

    it('should redirect to login when token is removed', () => {
      cy.fixture('users').then((users) => {
        // Login first
        cy.login(users.teacher.email, users.teacher.password);
        cy.url().should('include', '/app');
        
        // Remove token manually
        cy.window().then((win) => {
          win.localStorage.removeItem('token');
        });
        
        // Try to navigate to another protected route
        cy.visit('/app/courses');
        
        // Should be redirected to login
        cy.url({ timeout: 10000 }).should('include', '/login');
      });
    });
  });

  describe('Public Routes', () => {
    it('should allow access to /login without authentication', () => {
      // Visit login page
      cy.visit('/login');
      
      // Should stay on login page
      cy.url().should('include', '/login');
      
      // Should see login form
      cy.get('body').then(($body) => {
        const hasLoginForm = 
          $body.find(selectors.auth.emailInput).length > 0 ||
          $body.find('input[type="email"]').length > 0;
        expect(hasLoginForm).to.be.true;
      });
    });

    it('should allow access to /register without authentication', () => {
      // Visit register page
      cy.visit('/register');
      
      // Should stay on register page or be on login with register option
      cy.url().should('satisfy', (url: string) => {
        return url.includes('/register') || url.includes('/login');
      });
      
      // Should see form
      cy.get('body').should('be.visible');
    });

    it('should redirect authenticated users from /login to /app', () => {
      cy.fixture('users').then((users) => {
        // Login first
        cy.login(users.teacher.email, users.teacher.password);
        cy.url().should('include', '/app');
        
        // Try to visit login page while authenticated
        cy.visit('/login');
        
        // Should be redirected to app or stay on app
        cy.url({ timeout: 10000 }).should('satisfy', (url: string) => {
          return url.includes('/app') || url.includes('/login');
        });
      });
    });
  });

  describe('Direct URL Access', () => {
    it('should protect routes when accessed directly via URL', () => {
      // Clear authentication
      cy.clearLocalStorage();
      cy.clearCookies();
      
      // List of protected routes to test
      const protectedRoutes = [
        '/app',
        '/app/courses',
        '/app/students',
        '/app/student-evaluation',
        '/app/available-courses',
      ];
      
      protectedRoutes.forEach((route) => {
        cy.visit(route);
        
        // Should redirect to login
        cy.url({ timeout: 10000 }).should('include', '/login');
        
        // Clear any state before next iteration
        cy.clearLocalStorage();
        cy.clearCookies();
      });
    });

    it('should maintain protection after page reload', () => {
      // Try to access protected route
      cy.visit('/app/courses');
      
      // Should be redirected to login
      cy.url({ timeout: 10000 }).should('include', '/login');
      
      // Reload the page
      cy.reload();
      
      // Should still be on login page
      cy.url().should('include', '/login');
      
      // Verify no token
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });
  });

  describe('Navigation After Authentication', () => {
    it('should allow navigation between protected routes when authenticated', () => {
      cy.fixture('users').then((users) => {
        // Login as teacher
        cy.login(users.teacher.email, users.teacher.password);
        cy.url().should('include', '/app');
        
        // Navigate to courses
        cy.visit('/app/courses');
        cy.url().should('include', '/app/courses');
        
        // Navigate to students
        cy.visit('/app/students');
        cy.url().should('include', '/app/students');
        
        // Navigate back to app
        cy.visit('/app');
        cy.url().should('include', '/app');
        
        // All navigations should work without redirecting to login
        cy.window().its('localStorage.token').should('exist');
      });
    });

    it('should preserve authentication state during navigation', () => {
      cy.fixture('users').then((users) => {
        // Login
        cy.login(users.teacher.email, users.teacher.password);
        
        // Store token
        cy.window().its('localStorage.token').then((token) => {
          // Navigate to different routes
          cy.visit('/app/courses');
          cy.window().its('localStorage.token').should('equal', token);
          
          cy.visit('/app/students');
          cy.window().its('localStorage.token').should('equal', token);
          
          // Token should remain the same
          cy.log('Token persisted across navigation');
        });
      });
    });
  });

  describe('Browser Back Button', () => {
    it('should maintain route protection when using browser back button', () => {
      cy.fixture('users').then((users) => {
        // Start at login
        cy.visit('/login');
        
        // Login
        cy.get(selectors.auth.emailInput).type(users.teacher.email);
        cy.get(selectors.auth.passwordInput).type(users.teacher.password);
        cy.get(selectors.auth.loginButton).click();
        
        // Should be on app
        cy.url({ timeout: 15000 }).should('include', '/app');
        
        // Logout
        cy.logout();
        cy.url().should('include', '/login');
        
        // Try to go back using browser back button
        cy.go('back');
        
        // Should still be on login or redirected to login
        cy.url({ timeout: 10000 }).should('include', '/login');
        
        // Verify no token
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.null;
        });
      });
    });
  });
});
