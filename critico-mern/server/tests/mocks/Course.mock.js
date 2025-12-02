const { createModel } = require('../support/inMemoryDb');

module.exports = createModel('Course', {
  defaults: () => ({
    description: '',
    topicCount: 0,
    status: 'draft',
    reminders: [],
    analytics: {
      averageScore: 0,
      totalTextsRead: 0,
      totalQuestionsAnswered: 0,
      biasTrends: []
    }
  }),
  relations: { owner: { model: 'User' } }
});
