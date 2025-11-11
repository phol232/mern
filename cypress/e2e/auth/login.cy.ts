/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

describe('Authentication - Login', () => {
  beforeEach(() => {
    // Clear any existing session data
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Successful Login', () => {
    it('should login successfully with valid teacher credentials', () => {
      // Load user fixtures
      cy.fixture('users').then((users) => {
        // Visit login page
        cy.visit('/login');
        
        // Verify login form is visible
        cy.get(selectors.auth.emailInput, { timeout: 10000 }).should('be.visible');
        
        // Enter valid teacher credentials
        cy.get(selectors.auth.emailInput).clear().type(users.teacher.email);
        cy.get(selectors.auth.passwordInput).clear().type(users.teacher.password);
        
        // Click login button
        cy.get(selectors.auth.loginButton).click();
        
        // Verify redirect to /app
        cy.url({ timeout: 15000 }).should('include', '/app');
        
        // Verify token is saved in localStorage
        cy.window().then((win) => {
          const token = win.localStorage.getItem('auth_token');
          expect(token).to.exist;
          expect(token).to.not.be.empty;
        });
        
        // Verify user is on dashboard/app page
        cy.get('body').should('be.visible');
      });
    });

    it('should login successfully with valid student credentials', () => {
      cy.fixture('users').then((users) => {
        // Visit login page
        cy.visit('/login');
        
        // Wait for form to be ready
        cy.get(selectors.auth.emailInput, { timeout: 10000 }).should('be.visible');
        
        // Enter valid student credentials
        cy.get(selectors.auth.emailInput).clear().type(users.student.email);
        cy.get(selectors.auth.passwordInput).clear().type(users.student.password);
        
        // Submit login form
        cy.get(selectors.auth.loginButton).click();
        
        // Verify successful redirect
        cy.url({ timeout: 15000 }).should('include', '/app');
        
        // Verify authentication token exists
        cy.window().then((win) => {
          const token = win.localStorage.getItem('auth_token');
          expect(token).to.exist;
        });
      });
    });

    it('should persist authentication after page reload', () => {
      cy.fixture('users').then((users) => {
        // Login as teacher
        cy.visit('/login');
        cy.get(selectors.auth.emailInput).type(users.teacher.email);
        cy.get(selectors.auth.passwordInput).type(users.teacher.password);
        cy.get(selectors.auth.loginButton).click();
        
        // Wait for successful login
        cy.url({ timeout: 15000 }).should('include', '/app');
        
        // Store token for verification
        cy.window().then((win) => {
          const token = win.localStorage.getItem('auth_token');
          expect(token).to.exist;
          
          // Reload the page
          cy.reload();
          
          // Verify token still exists after reload
          cy.window().then((reloadedWin) => {
            const reloadedToken = reloadedWin.localStorage.getItem('auth_token');
            expect(reloadedToken).to.equal(token);
          });
          
          // Verify still on authenticated page
          cy.url().should('include', '/app');
        });
      });
    });
  });

  describe('Failed Login', () => {
    it('should show error message with invalid credentials', () => {
      // Visit login page
      cy.visit('/login');
      
      // Wait for form to be visible
      cy.get(selectors.auth.emailInput, { timeout: 10000 }).should('be.visible');
      
      // Enter invalid credentials
      cy.get(selectors.auth.emailInput).clear().type('invalid@example.com');
      cy.get(selectors.auth.passwordInput).clear().type('WrongPassword123!');
      
      // Click login button
      cy.get(selectors.auth.loginButton).click();
      
      // Wait a moment for the error to appear
      cy.wait(1000);
      
      // Verify error message is displayed - try the data-cy selector first
      cy.get(selectors.auth.errorMessage, { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'Credenciales');
      
      // Verify user is NOT redirected (still on login page)
      cy.url().should('include', '/login');
      
      // Verify no token is stored
      cy.window().then((win) => {
        expect(win.localStorage.getItem('auth_token')).to.be.null;
      });
    });

    it('should show error with empty email field', () => {
      cy.visit('/login');
      
      // Wait for form
      cy.get(selectors.auth.passwordInput, { timeout: 10000 }).should('be.visible');
      
      // Enter only password, leave email empty
      cy.get(selectors.auth.passwordInput).type('SomePassword123!');
      
      // Try to submit
      cy.get(selectors.auth.loginButton).click();
      
      // Should still be on login page
      cy.url().should('include', '/login');
      
      // Verify no token is created
      cy.window().then((win) => {
        expect(win.localStorage.getItem('auth_token')).to.be.null;
      });
    });

    it('should show error with empty password field', () => {
      cy.visit('/login');
      
      // Wait for form
      cy.get(selectors.auth.emailInput, { timeout: 10000 }).should('be.visible');
      
      // Enter only email, leave password empty
      cy.get(selectors.auth.emailInput).type('test@example.com');
      
      // Try to submit
      cy.get(selectors.auth.loginButton).click();
      
      // Should still be on login page
      cy.url().should('include', '/login');
      
      // Verify no token is created
      cy.window().then((win) => {
        expect(win.localStorage.getItem('auth_token')).to.be.null;
      });
    });

    it('should show error with malformed email', () => {
      cy.visit('/login');
      
      // Wait for form
      cy.get(selectors.auth.emailInput, { timeout: 10000 }).should('be.visible');
      
      // Enter malformed email
      cy.get(selectors.auth.emailInput).type('not-an-email');
      cy.get(selectors.auth.passwordInput).type('Password123!');
      
      // Try to submit
      cy.get(selectors.auth.loginButton).click();
      
      // Should still be on login page or show validation error
      cy.url().should('include', '/login');
    });
  });
});
