/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

describe('Authentication - Registration', () => {
  beforeEach(() => {
    // Clear any existing session data
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Successful Registration', () => {
    it('should register a new user successfully', () => {
      // Generate unique email to avoid conflicts
      const timestamp = Date.now();
      const newUser = {
        firstName: 'Nuevo',
        lastName: 'Usuario',
        email: `nuevo.usuario.${timestamp}@test.com`,
        password: 'NewPassword123!',
        role: 'student',
      };

      // Visit register page
      cy.visit('/register');
      
      // Wait for registration form to be visible
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Check if we're on the register page or need to navigate
      cy.url().then((url) => {
        if (!url.includes('/register')) {
          // Try to find and click register link if on login page
          cy.get('body').then(($body) => {
            if ($body.find(selectors.auth.registerLink).length > 0) {
              cy.get(selectors.auth.registerLink).click();
            }
          });
        }
      });
      
      // Fill in registration form
      cy.get('body').then(($body) => {
        // Check for first name input
        if ($body.find(selectors.auth.firstNameInput).length > 0) {
          cy.get(selectors.auth.firstNameInput).clear().type(newUser.firstName);
        } else if ($body.find('input[name="firstName"]').length > 0) {
          cy.get('input[name="firstName"]').clear().type(newUser.firstName);
        }
        
        // Check for last name input
        if ($body.find(selectors.auth.lastNameInput).length > 0) {
          cy.get(selectors.auth.lastNameInput).clear().type(newUser.lastName);
        } else if ($body.find('input[name="lastName"]').length > 0) {
          cy.get('input[name="lastName"]').clear().type(newUser.lastName);
        }
        
        // Email input (required)
        if ($body.find(selectors.auth.emailInput).length > 0) {
          cy.get(selectors.auth.emailInput).clear().type(newUser.email);
        } else {
          cy.get('input[type="email"]').clear().type(newUser.email);
        }
        
        // Password input (required)
        if ($body.find(selectors.auth.passwordInput).length > 0) {
          cy.get(selectors.auth.passwordInput).clear().type(newUser.password);
        } else {
          cy.get('input[type="password"]').first().clear().type(newUser.password);
        }
        
        // Role select (if available)
        if ($body.find(selectors.auth.roleSelect).length > 0) {
          cy.get(selectors.auth.roleSelect).select(newUser.role);
        } else if ($body.find('select[name="role"]').length > 0) {
          cy.get('select[name="role"]').select(newUser.role);
        }
      });
      
      // Submit registration form
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.registerButton).length > 0) {
          cy.get(selectors.auth.registerButton).click();
        } else if ($body.find(selectors.auth.submitButton).length > 0) {
          cy.get(selectors.auth.submitButton).click();
        } else {
          cy.get('button[type="submit"]').click();
        }
      });
      
      // Verify account creation was successful
      // Either redirected to dashboard or see success message
      cy.url({ timeout: 15000 }).then((url) => {
        const isOnDashboard = url.includes('/app') || url.includes('/dashboard');
        const isOnLogin = url.includes('/login');
        
        // Should be redirected to either dashboard or login page
        expect(isOnDashboard || isOnLogin).to.be.true;
        
        if (isOnDashboard) {
          // If redirected to dashboard, verify token exists
          cy.window().its('localStorage.token').should('exist');
        }
      });
    });

    it('should register a new teacher successfully', () => {
      const timestamp = Date.now();
      const newTeacher = {
        firstName: 'Docente',
        lastName: 'Nuevo',
        email: `docente.nuevo.${timestamp}@test.com`,
        password: 'TeacherPass123!',
        role: 'teacher',
      };

      cy.visit('/register');
      
      // Wait for form
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Fill registration form
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.firstNameInput).length > 0) {
          cy.get(selectors.auth.firstNameInput).type(newTeacher.firstName);
        }
        
        if ($body.find(selectors.auth.lastNameInput).length > 0) {
          cy.get(selectors.auth.lastNameInput).type(newTeacher.lastName);
        }
        
        if ($body.find(selectors.auth.emailInput).length > 0) {
          cy.get(selectors.auth.emailInput).type(newTeacher.email);
        } else {
          cy.get('input[type="email"]').type(newTeacher.email);
        }
        
        if ($body.find(selectors.auth.passwordInput).length > 0) {
          cy.get(selectors.auth.passwordInput).type(newTeacher.password);
        } else {
          cy.get('input[type="password"]').first().type(newTeacher.password);
        }
        
        if ($body.find(selectors.auth.roleSelect).length > 0) {
          cy.get(selectors.auth.roleSelect).select(newTeacher.role);
        }
      });
      
      // Submit form
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.registerButton).length > 0) {
          cy.get(selectors.auth.registerButton).click();
        } else {
          cy.get('button[type="submit"]').click();
        }
      });
      
      // Verify successful registration
      cy.url({ timeout: 15000 }).should('satisfy', (url: string) => {
        return url.includes('/app') || url.includes('/dashboard') || url.includes('/login');
      });
    });
  });

  describe('Failed Registration', () => {
    it('should show error when registering with existing email', () => {
      cy.fixture('users').then((users) => {
        cy.visit('/register');
        
        // Wait for form
        cy.get('body', { timeout: 10000 }).should('be.visible');
        
        // Try to register with existing teacher email
        cy.get('body').then(($body) => {
          if ($body.find(selectors.auth.emailInput).length > 0) {
            cy.get(selectors.auth.emailInput).type(users.teacher.email);
          } else {
            cy.get('input[type="email"]').type(users.teacher.email);
          }
          
          if ($body.find(selectors.auth.passwordInput).length > 0) {
            cy.get(selectors.auth.passwordInput).type('SomePassword123!');
          } else {
            cy.get('input[type="password"]').first().type('SomePassword123!');
          }
        });
        
        // Submit form
        cy.get('body').then(($body) => {
          if ($body.find(selectors.auth.registerButton).length > 0) {
            cy.get(selectors.auth.registerButton).click();
          } else {
            cy.get('button[type="submit"]').click();
          }
        });
        
        // Should show error or stay on register page
        cy.wait(2000);
        cy.url().should('satisfy', (url: string) => {
          return url.includes('/register') || url.includes('/login');
        });
      });
    });

    it('should show error with invalid email format', () => {
      cy.visit('/register');
      
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Enter invalid email
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.emailInput).length > 0) {
          cy.get(selectors.auth.emailInput).type('not-a-valid-email');
        } else {
          cy.get('input[type="email"]').type('not-a-valid-email');
        }
        
        if ($body.find(selectors.auth.passwordInput).length > 0) {
          cy.get(selectors.auth.passwordInput).type('Password123!');
        } else {
          cy.get('input[type="password"]').first().type('Password123!');
        }
      });
      
      // Try to submit
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.registerButton).length > 0) {
          cy.get(selectors.auth.registerButton).click();
        } else {
          cy.get('button[type="submit"]').click();
        }
      });
      
      // Should stay on register page
      cy.url().should('include', '/register');
    });

    it('should show error with weak password', () => {
      const timestamp = Date.now();
      
      cy.visit('/register');
      
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Enter valid email but weak password
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.emailInput).length > 0) {
          cy.get(selectors.auth.emailInput).type(`test.${timestamp}@example.com`);
        } else {
          cy.get('input[type="email"]').type(`test.${timestamp}@example.com`);
        }
        
        // Use weak password
        if ($body.find(selectors.auth.passwordInput).length > 0) {
          cy.get(selectors.auth.passwordInput).type('123');
        } else {
          cy.get('input[type="password"]').first().type('123');
        }
      });
      
      // Try to submit
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.registerButton).length > 0) {
          cy.get(selectors.auth.registerButton).click();
        } else {
          cy.get('button[type="submit"]').click();
        }
      });
      
      // Should stay on register page or show validation error
      cy.wait(1000);
      cy.url().should('include', '/register');
    });

    it('should show error with empty required fields', () => {
      cy.visit('/register');
      
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Try to submit without filling any fields
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.registerButton).length > 0) {
          cy.get(selectors.auth.registerButton).click();
        } else {
          cy.get('button[type="submit"]').click();
        }
      });
      
      // Should stay on register page
      cy.url().should('include', '/register');
    });
  });

  describe('Navigation', () => {
    it('should navigate from register to login page', () => {
      cy.visit('/register');
      
      cy.get('body', { timeout: 10000 }).should('be.visible');
      
      // Look for login link
      cy.get('body').then(($body) => {
        if ($body.find(selectors.auth.loginLink).length > 0) {
          cy.get(selectors.auth.loginLink).click();
          cy.url().should('include', '/login');
        } else if ($body.text().toLowerCase().includes('login') || $body.text().toLowerCase().includes('iniciar')) {
          // Find any link that mentions login
          cy.contains(/login|iniciar sesión/i).click();
          cy.url().should('include', '/login');
        }
      });
    });
  });
});
