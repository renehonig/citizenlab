module.exports = {
  register: (browser) => {
    browser
    .url('localhost:3000/sign-up')
    .waitForElementVisible('#signup-step1', 5000)
    .setValue('#firstName', 'Test')
    .setValue('#lastName', 'Account')
    .setValue('#email', 'test@citizenlab.co')
    .setValue('#password', '123456')
    .click('#signup-step1 button')
    .waitForElementVisible('#signup-step2', 5000)
    .click('#signup-step2 button')
    .waitForElementVisible('#landing-page', 5000)
    .end();
  },
};
