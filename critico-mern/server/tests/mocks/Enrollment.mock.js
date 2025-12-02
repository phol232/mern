const { createModel } = require('../support/inMemoryDb');

module.exports = createModel('Enrollment', {
  defaults: () => ({
    status: 'active',
    progress: {
      completion: 0,
      level: 'incipiente',
      lastAccessAt: null
    },
    notifications: { dueSoon: true, lastReminderSentAt: null }
  }),
  relations: {
    student: { model: 'User' },
    course: { model: 'Course' }
  }
});
