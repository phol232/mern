const bcrypt = require('bcryptjs');
const { createModel } = require('../support/inMemoryDb');

const UserModel = createModel('User', {
  defaults: () => ({
    role: 'student',
    preferences: {
      language: 'es',
      theme: 'light',
      fontSize: 'medium',
      notifications: { email: true, push: true }
    }
  }),
  relations: { createdBy: { model: 'User' } },
  hooks: {
    async preSave(doc) {
      if (doc.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        doc.password = await bcrypt.hash(doc.password, salt);
      }
    }
  },
  methods: {
    comparePassword(candidate) {
      return bcrypt.compare(candidate, this.password);
    }
  },
  transform(obj) {
    const sanitized = { ...obj };
    delete sanitized.password;
    delete sanitized.recoveryToken;
    delete sanitized.recoveryTokenExpiresAt;
    return sanitized;
  }
});

module.exports = UserModel;
