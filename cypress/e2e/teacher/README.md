# Teacher Flow E2E Tests

This directory contains comprehensive end-to-end tests for teacher functionality in the CRÍTICO MERN system.

## Test Files

### 1. course-management.cy.ts
Tests for course CRUD operations:
- ✅ Create new course with title and description
- ✅ View list of courses created by teacher
- ✅ View details of a specific course
- ✅ Edit existing course
- ✅ Delete course

### 2. text-generation.cy.ts
Tests for AI-powered text generation:
- ✅ Generate text using AI with prompts
- ✅ Detect biases in generated text
- ✅ Display problematic words
- ✅ Regenerate text with bias correction
- ✅ Save approved text to course

### 3. question-creation.cy.ts
Tests for question management:
- ✅ Create literal type questions
- ✅ Create inferential type questions
- ✅ Create critical type questions
- ✅ Edit existing questions
- ✅ Delete questions
- ✅ Validate all question types are available

### 4. student-management.cy.ts
Tests for student monitoring:
- ✅ View list of enrolled students
- ✅ Display student information
- ✅ View student progress metrics
- ✅ View texts completed by students
- ✅ Filter students by course
- ✅ View student answers
- ✅ Search for students

### 5. feedback-generation.cy.ts
Tests for AI-powered feedback:
- ✅ Generate AI feedback for student answers
- ✅ Display feedback text after generation
- ✅ Verify feedback visibility to students
- ✅ Generate feedback for multiple answers
- ✅ Handle bulk feedback generation
- ✅ Validate feedback quality

## Running the Tests

### Run all teacher tests:
```bash
npm run cypress:open
# Then select the teacher folder in the UI

# Or run headless:
npx cypress run --spec "cypress/e2e/teacher/**/*.cy.ts"
```

### Run specific test file:
```bash
npx cypress run --spec "cypress/e2e/teacher/course-management.cy.ts"
```

## Test Data

All tests use fixtures from `cypress/fixtures/`:
- `users.json` - Teacher and student credentials
- `courses.json` - Sample course data
- `texts.json` - Sample texts with and without biases
- `questions.json` - Sample questions of each type
- `answers.json` - Sample student answers

## Test Structure

Each test file follows this pattern:

1. **Setup (before/beforeEach)**: 
   - Login as teacher
   - Create necessary test data (courses, topics, texts, questions)

2. **Test Execution**:
   - Navigate to relevant pages
   - Perform actions (create, edit, delete, view)
   - Verify expected outcomes

3. **Cleanup (after)**:
   - Remove test data using `cy.cleanupTestData()`

## Custom Commands Used

These tests leverage custom Cypress commands from `cypress/support/commands.ts`:

- `cy.loginAsTeacher()` - Authenticate as teacher with session caching
- `cy.createCourse()` - Create course via API
- `cy.createTopic()` - Create topic via API
- `cy.createText()` - Create text via API
- `cy.createQuestion()` - Create question via API
- `cy.enrollStudent()` - Enroll student in course
- `cy.navigateToCourses()` - Navigate to courses page
- `cy.navigateToStudentManagement()` - Navigate to student management
- `cy.verifyCourseInList()` - Verify course appears in list
- `cy.verifyFeedbackGenerated()` - Verify feedback was generated
- `cy.cleanupTestData()` - Remove test data

## Selectors

All selectors are centralized in `cypress/support/selectors.ts` using `data-cy` attributes for stability.

## Requirements Coverage

These tests cover the following requirements from the spec:

- **Requirement 4.1**: Course management (create, edit, delete, view)
- **Requirement 4.2**: Text generation with AI and bias detection
- **Requirement 4.3**: Question creation (literal, inferential, critical)
- **Requirement 4.4**: Student visualization and progress monitoring
- **Requirement 4.5**: Feedback generation with AI
- **Requirements 8.1-8.5**: Student management features

## Notes

- Tests use unique timestamps in titles to avoid conflicts
- Tests are designed to be independent and can run in any order
- Session caching is used to speed up authentication
- API calls are used for setup to reduce test execution time
- UI interactions are used for the actual test scenarios
- Tests gracefully handle missing UI elements with conditional checks
