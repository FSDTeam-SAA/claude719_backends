// Run: node -r ts-node/register/transpile-only tests/auth-verification.cjs
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const mock = (path, value) => {
  require.cache[require.resolve(path)] = { exports: { __esModule: true, default: value } };
};
let user;
let updates = [];
let deliveries = [];
let failMail = false;
let claimed = true;
mock('../src/app/config', { backendUrl: 'https://api.example.com/', jwt: {}, google: {} });
mock('../src/app/modules/user/user.model', {
  findOne: async () => user,
  updateOne: async (filter, update) => { updates.push({ filter, update }); return { modifiedCount: claimed ? 1 : 0 }; },
});
mock('../src/app/helper/sendMailer', async (...args) => {
  if (failMail) throw new Error('SMTP unavailable');
  deliveries.push(args);
});
const { authService } = require('../src/app/modules/auth/auth.service');
(async () => {
  user = { _id: 'test-user', email: 'test+tag@example.com', password: await bcrypt.hash('test-password', 4), emailVerified: false };
  await assert.rejects(authService.resendVerificationEmail(user.email, 'wrong'), /incorrect/);
  assert.equal(deliveries.length, 0);
  await authService.resendVerificationEmail(user.email, 'test-password');
  assert.equal(deliveries.length, 1);
  const link = new URL(deliveries[0][2].match(/href="([^"]+)"/)[1]);
  assert.equal(link.pathname, '/api/v1/auth/verify-email');
  assert.equal(link.searchParams.get('email'), user.email);
  assert.equal(link.searchParams.get('token').length, 64);
  claimed = false;
  await assert.rejects(authService.resendVerificationEmail(user.email, 'test-password'), /wait a minute/);
  assert.equal(deliveries.length, 1);
  claimed = true;
  failMail = true;
  updates = [];
  await assert.rejects(authService.resendVerificationEmail(user.email, 'test-password'), /SMTP unavailable/);
  assert.deepEqual(updates[1].update.$unset, { emailVerifyToken: 1, emailVerifyExpires: 1 });
  user.emailVerifyToken = 'previous-token';
  user.emailVerifyExpires = new Date(Date.now() - 1000);
  updates = [];
  await assert.rejects(authService.resendVerificationEmail(user.email, 'test-password'), /SMTP unavailable/);
  assert.equal(updates[1].update.$set.emailVerifyToken, 'previous-token');
  await assert.rejects(authService.verifyEmailByToken('expired-token', user.email), e => e.statusCode === 410);
  user.emailVerified = true;
  await assert.rejects(authService.resendVerificationEmail(user.email, 'test-password'), /already verified/);
  console.log('PASS: password check, URL encoding, resend cooldown, failed-send rollback, expired account preservation, verified account guard');
})().catch(error => { console.error(error); process.exitCode = 1; });
