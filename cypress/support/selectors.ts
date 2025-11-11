/**
 * Centralized Cypress Selectors
 * 
 * This file contains all selectors used in Cypress tests, organized by module.
 * Using data-cy attributes is preferred for stability, with fallback selectors when needed.
 */

export const selectors = {
  /**
   * Authentication Module Selectors
   */
  auth: {
    emailInput: '[data-cy="email-input"]',
    passwordInput: '[data-cy="password-input"]',
    firstNameInput: '[data-cy="first-name-input"]',
    lastNameInput: '[data-cy="last-name-input"]',
    roleSelect: '[data-cy="role-select"]',
    loginButton: '[data-cy="login-button"]',
    registerButton: '[data-cy="register-button"]',
    logoutButton: '[data-cy="logout-button"]',
    submitButton: '[data-cy="submit-button"]',
    errorMessage: '[data-cy="error-message"]',
    successMessage: '[data-cy="success-message"]',
    loginForm: '[data-cy="login-form"]',
    registerForm: '[data-cy="register-form"]',
    registerLink: '[data-cy="register-link"]',
    loginLink: '[data-cy="login-link"]',
  },

  /**
   * Courses Module Selectors
   */
  courses: {
    createButton: '[data-cy="create-course-button"]',
    courseCard: '[data-cy="course-card"]',
    courseTitle: '[data-cy="course-title"]',
    courseDescription: '[data-cy="course-description"]',
    courseLevel: '[data-cy="course-level"]',
    enrollButton: '[data-cy="enroll-button"]',
    courseList: '[data-cy="course-list"]',
    courseGrid: '[data-cy="course-grid"]',
    editButton: '[data-cy="edit-course-button"]',
    deleteButton: '[data-cy="delete-course-button"]',
    saveCourseButton: '[data-cy="save-course-button"]',
    cancelButton: '[data-cy="cancel-button"]',
    courseTitleInput: '[data-cy="course-title-input"]',
    courseDescriptionInput: '[data-cy="course-description-input"]',
    courseLevelSelect: '[data-cy="course-level-select"]',
    viewDetailsButton: '[data-cy="view-details-button"]',
    myCourses: '[data-cy="my-courses"]',
    availableCourses: '[data-cy="available-courses"]',
    enrolledBadge: '[data-cy="enrolled-badge"]',
    courseModal: '[data-cy="course-modal"]',
  },

  /**
   * Texts Module Selectors
   */
  texts: {
    generateButton: '[data-cy="generate-text-button"]',
    textContent: '[data-cy="text-content"]',
    textTitle: '[data-cy="text-title"]',
    textCard: '[data-cy="text-card"]',
    textList: '[data-cy="text-list"]',
    biasIndicator: '[data-cy="bias-indicator"]',
    problematicWords: '[data-cy="problematic-words"]',
    regenerateButton: '[data-cy="regenerate-button"]',
    saveTextButton: '[data-cy="save-text-button"]',
    textPromptInput: '[data-cy="text-prompt-input"]',
    textDifficulty: '[data-cy="text-difficulty"]',
    estimatedReadingTime: '[data-cy="estimated-reading-time"]',
    textEditor: '[data-cy="text-editor"]',
    createTextButton: '[data-cy="create-text-button"]',
    editTextButton: '[data-cy="edit-text-button"]',
    deleteTextButton: '[data-cy="delete-text-button"]',
    textModal: '[data-cy="text-modal"]',
    biasWarning: '[data-cy="bias-warning"]',
    biasCount: '[data-cy="bias-count"]',
    viewTextButton: '[data-cy="view-text-button"]',
  },

  /**
   * Questions Module Selectors
   */
  questions: {
    createButton: '[data-cy="create-question-button"]',
    questionText: '[data-cy="question-text"]',
    questionType: '[data-cy="question-type"]',
    questionCard: '[data-cy="question-card"]',
    questionList: '[data-cy="question-list"]',
    answerInput: '[data-cy="answer-input"]',
    submitButton: '[data-cy="submit-answer-button"]',
    submitAnswerButton: '[data-cy="submit-answer-button"]',
    questionTextInput: '[data-cy="question-text-input"]',
    questionTypeSelect: '[data-cy="question-type-select"]',
    questionHintInput: '[data-cy="question-hint-input"]',
    saveQuestionButton: '[data-cy="save-question-button"]',
    editQuestionButton: '[data-cy="edit-question-button"]',
    deleteQuestionButton: '[data-cy="delete-question-button"]',
    questionModal: '[data-cy="question-modal"]',
    hintButton: '[data-cy="hint-button"]',
    hintText: '[data-cy="hint-text"]',
    answerTextarea: '[data-cy="answer-textarea"]',
    literalQuestion: '[data-cy="literal-question"]',
    inferencialQuestion: '[data-cy="inferencial-question"]',
    criticaQuestion: '[data-cy="critica-question"]',
    questionNumber: '[data-cy="question-number"]',
  },

  /**
   * Bias Analysis Module Selectors
   */
  biasAnalysis: {
    analyzeButton: '[data-cy="analyze-bias-button"]',
    biasModal: '[data-cy="bias-modal"]',
    biasScore: '[data-cy="bias-score"]',
    biasLevel: '[data-cy="bias-level"]',
    biasCard: '[data-cy="bias-card"]',
    biasType: '[data-cy="bias-type"]',
    biasDescription: '[data-cy="bias-description"]',
    biasSuggestion: '[data-cy="bias-suggestion"]',
    recommendations: '[data-cy="recommendations"]',
    recommendationItem: '[data-cy="recommendation-item"]',
    closeModalButton: '[data-cy="close-modal-button"]',
    biasDetails: '[data-cy="bias-details"]',
    biasContext: '[data-cy="bias-context"]',
    biasAlternative: '[data-cy="bias-alternative"]',
    scoreBar: '[data-cy="score-bar"]',
    levelBadge: '[data-cy="level-badge"]',
    biasesDetected: '[data-cy="biases-detected"]',
    biasCount: '[data-cy="bias-count"]',
    improvementSuggestions: '[data-cy="improvement-suggestions"]',
    academicRecommendations: '[data-cy="academic-recommendations"]',
    // Linguistic bias types
    biasUniv: '[data-cy="bias-s-univ"]',
    biasPolar: '[data-cy="bias-s-polar"]',
    biasGen: '[data-cy="bias-s-gen"]',
    biasCausa: '[data-cy="bias-s-causa"]',
    biasAut: '[data-cy="bias-s-aut"]',
    biasEmo: '[data-cy="bias-s-emo"]',
    biasConfirma: '[data-cy="bias-s-confirma"]',
    biasEstrella: '[data-cy="bias-s-estrella"]',
  },

  /**
   * Chatbot Module Selectors
   */
  chatbot: {
    openButton: '[data-cy="chatbot-open-button"]',
    closeButton: '[data-cy="chatbot-close-button"]',
    chatWindow: '[data-cy="chatbot-window"]',
    messageInput: '[data-cy="chatbot-message-input"]',
    sendButton: '[data-cy="chatbot-send-button"]',
    messageList: '[data-cy="chatbot-messages"]',
    messageItem: '[data-cy="chatbot-message"]',
    userMessage: '[data-cy="user-message"]',
    botMessage: '[data-cy="bot-message"]',
    typingIndicator: '[data-cy="typing-indicator"]',
    chatHeader: '[data-cy="chatbot-header"]',
    clearHistoryButton: '[data-cy="clear-history-button"]',
    minimizeButton: '[data-cy="minimize-button"]',
    chatContainer: '[data-cy="chat-container"]',
    messageTimestamp: '[data-cy="message-timestamp"]',
    errorMessage: '[data-cy="chatbot-error"]',
  },

  /**
   * Student Management Module Selectors
   */
  students: {
    studentList: '[data-cy="student-list"]',
    studentCard: '[data-cy="student-card"]',
    studentName: '[data-cy="student-name"]',
    studentEmail: '[data-cy="student-email"]',
    progressBar: '[data-cy="progress-bar"]',
    progressPercentage: '[data-cy="progress-percentage"]',
    viewAnswersButton: '[data-cy="view-answers-button"]',
    generateFeedbackButton: '[data-cy="generate-feedback-button"]',
    studentDetails: '[data-cy="student-details"]',
    studentModal: '[data-cy="student-modal"]',
    answersList: '[data-cy="answers-list"]',
    answerCard: '[data-cy="answer-card"]',
    feedbackText: '[data-cy="feedback-text"]',
    feedbackModal: '[data-cy="feedback-modal"]',
    courseFilter: '[data-cy="course-filter"]',
    searchInput: '[data-cy="search-student-input"]',
    enrolledStudents: '[data-cy="enrolled-students"]',
    studentProgress: '[data-cy="student-progress"]',
    textsCompleted: '[data-cy="texts-completed"]',
    questionsAnswered: '[data-cy="questions-answered"]',
    averageScore: '[data-cy="average-score"]',
    lastActivity: '[data-cy="last-activity"]',
  },

  /**
   * Navigation Selectors
   */
  navigation: {
    navbar: '[data-cy="navbar"]',
    homeLink: '[data-cy="home-link"]',
    coursesLink: '[data-cy="courses-link"]',
    availableCoursesLink: '[data-cy="available-courses-link"]',
    myCoursesLink: '[data-cy="my-courses-link"]',
    evaluationLink: '[data-cy="evaluation-link"]',
    studentManagementLink: '[data-cy="student-management-link"]',
    profileLink: '[data-cy="profile-link"]',
    settingsLink: '[data-cy="settings-link"]',
    dashboardLink: '[data-cy="dashboard-link"]',
    logoutLink: '[data-cy="logout-link"]',
    menuToggle: '[data-cy="menu-toggle"]',
    sidebar: '[data-cy="sidebar"]',
    breadcrumb: '[data-cy="breadcrumb"]',
  },

  /**
   * Common UI Elements
   */
  common: {
    modal: '[data-cy="modal"]',
    modalTitle: '[data-cy="modal-title"]',
    modalBody: '[data-cy="modal-body"]',
    modalFooter: '[data-cy="modal-footer"]',
    closeButton: '[data-cy="close-button"]',
    confirmButton: '[data-cy="confirm-button"]',
    cancelButton: '[data-cy="cancel-button"]',
    saveButton: '[data-cy="save-button"]',
    deleteButton: '[data-cy="delete-button"]',
    editButton: '[data-cy="edit-button"]',
    backButton: '[data-cy="back-button"]',
    nextButton: '[data-cy="next-button"]',
    previousButton: '[data-cy="previous-button"]',
    submitButton: '[data-cy="submit-button"]',
    loadingSpinner: '[data-cy="loading-spinner"]',
    errorMessage: '[data-cy="error-message"]',
    successMessage: '[data-cy="success-message"]',
    warningMessage: '[data-cy="warning-message"]',
    infoMessage: '[data-cy="info-message"]',
    emptyState: '[data-cy="empty-state"]',
    pagination: '[data-cy="pagination"]',
    searchInput: '[data-cy="search-input"]',
    filterButton: '[data-cy="filter-button"]',
    sortButton: '[data-cy="sort-button"]',
  },

  /**
   * Dashboard Selectors
   */
  dashboard: {
    container: '[data-cy="dashboard-container"]',
    welcomeMessage: '[data-cy="welcome-message"]',
    statsCard: '[data-cy="stats-card"]',
    recentActivity: '[data-cy="recent-activity"]',
    quickActions: '[data-cy="quick-actions"]',
    coursesOverview: '[data-cy="courses-overview"]',
    progressChart: '[data-cy="progress-chart"]',
  },

  /**
   * Topics Module Selectors
   */
  topics: {
    topicCard: '[data-cy="topic-card"]',
    topicTitle: '[data-cy="topic-title"]',
    topicDescription: '[data-cy="topic-description"]',
    createTopicButton: '[data-cy="create-topic-button"]',
    topicList: '[data-cy="topic-list"]',
    editTopicButton: '[data-cy="edit-topic-button"]',
    deleteTopicButton: '[data-cy="delete-topic-button"]',
    topicModal: '[data-cy="topic-modal"]',
  },

  /**
   * Enrollment Selectors
   */
  enrollment: {
    enrollButton: '[data-cy="enroll-button"]',
    unenrollButton: '[data-cy="unenroll-button"]',
    enrollmentStatus: '[data-cy="enrollment-status"]',
    enrollmentDate: '[data-cy="enrollment-date"]',
    enrollmentModal: '[data-cy="enrollment-modal"]',
  },
};

/**
 * Fallback selectors for when data-cy attributes are not available
 * These use CSS classes, IDs, or semantic selectors as alternatives
 */
export const fallbackSelectors = {
  auth: {
    emailInput: 'input[type="email"], input[name="email"]',
    passwordInput: 'input[type="password"], input[name="password"]',
    loginButton: 'button[type="submit"]:contains("Login"), button:contains("Iniciar")',
    registerButton: 'button[type="submit"]:contains("Register"), button:contains("Registrar")',
    logoutButton: 'button:contains("Logout"), button:contains("Cerrar sesión")',
  },
  courses: {
    createButton: 'button:contains("Create Course"), button:contains("Crear Curso")',
    courseCard: '.course-card, .card',
    courseTitle: '.course-title, h2, h3',
    enrollButton: 'button:contains("Enroll"), button:contains("Inscribirse")',
  },
  chatbot: {
    openButton: '.chatbot-button, .chat-toggle',
    messageInput: '.chat-input, textarea',
    sendButton: '.send-button, button[type="submit"]',
  },
};

/**
 * Helper function to get selector with fallback
 * @param module - The module name (e.g., 'auth', 'courses')
 * @param element - The element name (e.g., 'emailInput', 'loginButton')
 * @returns The primary selector or fallback if available
 */
export function getSelector(module: keyof typeof selectors, element: string): string {
  const moduleSelectors = selectors[module] as Record<string, string>;
  const moduleFallbacks = fallbackSelectors[module as keyof typeof fallbackSelectors] as Record<string, string> | undefined;
  return moduleSelectors[element] || moduleFallbacks?.[element] || '';
}

export default selectors;
