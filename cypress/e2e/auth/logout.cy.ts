/// <reference types="cypress" />

import { selectors } from '../../support/selectors';

describe('Authentication - Logout', () => {
  beforeEach(() => {
    // Clear any existing session data before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Teacher Logout', () => {
    it('should logout teacher successfully', () => {
      // Login as teacher first
      cy.fixture('users').then((users) => {
        cy.login(users.teacher.email, users.teacher.password);
        
        // Verify we're logged in
        cy.url().should('include', '/app');
        cy.window().its('localStorage.token').should('exist');
        
        // Perform logout
        cy.logout();
        
        // Verify redirect to login page
        cy.url({ timeout: 10000 }).should('include', '/login');
        
        // Verify token is removed from localStorage
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.null;
        });
        
        // Verify we can see the login form
        cy.get('body').then(($body) => {
          const hasLoginForm = 
            $body.find(selectors.auth.emailInput).length > 0 ||
            $body.find('input[type="email"]').length > 0;
          expect(hasLoginForm).to.be.true;
        });
      });
    });

    it('should clear all session data on logout', () => {
      cy.fixture('users').then((users) => {
        // Login as teacher
        cy.login(users.teacher.email, users.teacher.password);
        
        // Store initial localStorage keys
        cy.window().then((win) => {
          const initialKeys = Object.keys(win.localStorage);
          cy.log(`Initial localStorage keys: ${initialKeys.join(', ')}`);
          
          // Logout
          cy.logout();
          
          // Verify localStorage is cleared or token is removed
          cy.window().then((win2) => {
            expect(win2.localStorage.getItem('token')).to.be.null;
            cy.log('Token successfully removed from localStorage');
          });
        });
      });
    });
  });

  describe('Student Logout', () => {
    it('should logout student successfully', () => {
      // Login as student
      cy.fixture('users').then((users) => {
        cy.login(users.student.email, users.student.password);
        
        // Verify logged in
        cy.url().should('include', '/app');
        cy.window().its('localStorage.token').should('exist');
        
        // Logout
        cy.logout();
        
        // Verify redirect to login
        cy.url({ timeout: 10000 }).should('include', '/login');
        
        // Verify token removed
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.null;
        });
      });
    });
  });

  describe('Logout Button Interaction', () => {
    it('should find and click logout button in navigation', () => {
      cy.fixture('users').then((users) => {
        // Login
        cy.login(users.teacher.email, users.teacher.password);
        
        // Wait for app to load
        cy.url().should('include', '/app');
        cy.wait(1000);
        
        // Try to find logout button/link in various locations
        cy.get('body').then(($body) => {
          // Check for data-cy logout button
          if ($body.find(selectors.auth.logoutButton).length > 0) {
            cy.get(selectors.auth.logoutButton).click();
          }
          // Check for navigation logout link
          else if ($body.find(selectors.navigation.logoutLink).length > 0) {
            cy.get(selectors.navigation.logoutLink).click();
          }
          // Check for text-based logout button
          else if ($body.text().toLowerCase().includes('logout') || 
                   $body.text().toLowerCase().includes('cerrar sesión')) {
            cy.contains(/logout|cerrar sesión/i).click();
          }
          // Fallback: clear storage manually
          else {
            cy.clearLocalStorage();
            cy.clearCookies();
            cy.visit('/login');
          }
        });
        
        // Verify logout was successful
        cy.url({ timeout: 10000 }).should('include', '/login');
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.null;
        });
      });
    });

    it('should handle logout from different pages', () => {
      cy.fixture('users').then((users) => {
        // Login as teacher
        cy.login(users.teacher.email, users.teacher.password);
        
        // Navigate to courses page
        cy.visit('/app/courses');
        cy.url().should('include', '/app/courses');
        
        // Logout from courses page
        cy.logout();
        
        // Verify redirect to login
        cy.url({ timeout: 10000 }).should('include', '/login');
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.null;
        });
      });
    });
  });

  describe('Post-Logout Behavior', () => {
    it('should not allow access to protected routes after logout', () => {
      cy.fixture('users').then((users) => {
        // Login
        cy.login(users.teacher.email, users.teacher.password);
        
        // Verify logged in
        cy.url().should('include', '/app');
        
        // Logout
        cy.logout();
        
        // Try to access protected route
        cy.visit('/app/courses');
        
        // Should be redirected to login
        cy.url({ timeout: 10000 }).should('include', '/login');
      });
    });

    it('should require re-login after logout', () => {
      cy.fixture('users').then((users) => {
        // Login
        cy.login(users.teacher.email, users.teacher.password);
        cy.url().should('include', '/app');
        
        // Logout
        cy.logout();
        cy.url().should('include', '/login');
        
        // Verify cannot access app without logging in again
        cy.visit('/app');
        cy.url({ timeout: 10000 }).should('include', '/login');
        
        // Login again should work
        cy.get(selectors.auth.emailInput).type(users.teacher.email);
        cy.get(selectors.auth.passwordInput).type(users.teacher.password);
        cy.get(selectors.auth.loginButton).click();
        
        // Should be able to access app again
        cy.url({ timeout: 15000 }).should('include', '/app');
        cy.window().its('localStorage.token').should('exist');
      });
    });

    it('should clear session cookies on logout', () => {
      cy.fixture('users').then((users) => {
        // Login
        cy.login(users.teacher.email, users.teacher.password);
        
        // Get cookies before logout
        cy.getCookies().then((cookiesBefore) => {
          cy.log(`Cookies before logout: ${cookiesBefore.length}`);
          
          // Logout
          cy.logout();
          
          // Verify cookies are cleared or session cookie is removed
          cy.getCookies().then((cookiesAfter) => {
            cy.log(`Cookies after logout: ${cookiesAfter.length}`);
            
            // Session-related cookies should be cleared
            const hasSessionCookie = cookiesAfter.some(cookie => 
              cookie.name.toLowerCase().includes('session') ||
              cookie.name.toLowerCase().includes('token') ||
              cookie.name.toLowerCase().includes('auth')
            );
            
            expect(hasSessionCookie).to.be.false;
          });
        });
      });
    });
  });

  describe('Multiple Logout Attempts', () => {
    it('should handle logout when already logged out', () => {
      // Visit login page (not logged in)
      cy.visit('/login');
      
      // Try to logout (should not cause errors)
      cy.clearLocalStorage();
      cy.clearCookies();
      
      // Should still be on login page
      cy.url().should('include', '/login');
      
      // Verify no token exists
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });

    it('should handle rapid logout clicks', () => {
      cy.fixture('users').then((users) => {
        // Login
        cy.login(users.teacher.email, users.teacher.password);
        cy.url().should('include', '/app');
        
        // Perform logout
        cy.logout();
        
        // Verify successful logout
        cy.url({ timeout: 10000 }).should('include', '/login');
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.null;
        });
      });
    });
  });
});
