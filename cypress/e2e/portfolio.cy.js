// AI-assisted Cypress tests for COMP229 Assignment 4.
// Uses a freshly seeded, disposable MongoDB database. No production data is changed.
const sample = { firstname: 'Demo', lastname: 'Visitor', email: 'visitor@example.com', phone: '4165550123', message: 'A website project inquiry.' };
const typeField = (name, value) => cy.get(`input[name="${name}"]`).clear().type(value);
function loginAdmin() {
  cy.visit('/signin');
  cy.get('input[type=email]').type('admin@portfolio.local');
  cy.get('input[type=password]').type(Cypress.env('adminPassword'), { log: false });
  cy.contains('button', /^Sign in$/).click();
  cy.contains('h1', 'Manage portfolio').should('be.visible');
}
function owner() { typeField('firstname', 'Yuri'); typeField('lastname', 'Koller'); typeField('email', 'yuri@example.com'); }
describe('Portfolio full stack end-to-end tests', () => {
  it('reads database-backed public pages and navigates on mobile', () => {
    cy.visit('/projects'); cy.contains('h2', 'MiddleGround AI').should('exist');
    cy.visit('/education'); cy.contains('h2', 'Codecademy Front-End Engineer').should('exist');
    cy.viewport(390, 844); cy.visit('/'); cy.get('[aria-label="Toggle navigation"]').click();
    cy.contains('nav a', 'Contact').click(); cy.contains('h1', 'Contact me').should('be.visible');
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(390));
    cy.screenshot('01-mobile-navigation');
  });
  it('stores a public contact inquiry and shows success', () => {
    cy.intercept('POST', '/api/contacts').as('contact'); cy.visit('/contact');
    typeField('firstName', sample.firstname); typeField('lastName', sample.lastname); typeField('email', sample.email); typeField('phone', sample.phone);
    cy.get('textarea[name=message]').type(sample.message); cy.contains('button', 'Send message').click();
    cy.wait('@contact').its('response.statusCode').should('eq', 201);
    cy.get('[role=status]').should('contain', 'your message has been received');
    cy.get('input[name=firstName]').should('have.value', '');
    cy.get('form').screenshot('02-contact-saved');
  });
  it('signs up a read-only user and rejects direct write attempts', () => {
    cy.visit('/signup'); cy.get('input[autocomplete=name]').type('Portfolio Reader');
    cy.get('input[type=email]').type(`reader-${Date.now()}@example.com`);
    cy.get('input[type=password]').type('Test-only-reader-pass', { log: false });
    cy.contains('button', 'Create account').click(); cy.contains('h1', 'Portfolio records').should('be.visible');
    cy.contains('button', 'Add project').should('not.exist'); cy.contains('button', /^Edit$/).should('not.exist');
    cy.request({ method: 'POST', url: '/api/projects', body: {}, failOnStatusCode: false }).its('status').should('eq', 403);
    cy.reload(); cy.contains('h1', 'Portfolio records').should('be.visible'); cy.screenshot('03-user-read-only');
    cy.contains('button', 'Sign out').click(); cy.visit('/manage'); cy.location('pathname').should('eq', '/signin');
  });
  it('rejects invalid credentials with a readable error', () => {
    cy.visit('/signin'); cy.get('input[type=email]').type('admin@portfolio.local'); cy.get('input[type=password]').type('incorrect-password', { log: false });
    cy.contains('button', /^Sign in$/).click(); cy.get('[role=alert]').should('contain', 'Email or password is incorrect.'); cy.screenshot('04-invalid-signin');
  });
  for (const resource of ['projects', 'qualifications', 'contacts']) {
    it(`allows Admin create/read/update/delete for ${resource}`, () => {
      loginAdmin();
      if (resource !== 'projects') cy.contains('[aria-label="Record type"] button', resource === 'qualifications' ? 'Education' : 'Contacts').click();
      cy.contains('button', /^Add /).click(); owner();
      if (resource === 'contacts') cy.get('form textarea').type('Admin Cypress inquiry.');
      else {
        typeField('title', `Cypress ${resource} record`); typeField('completion', '2026-11-23');
        cy.get('form textarea').type('Created through the browser and saved to MongoDB.');
      }
      cy.contains('button', 'Create record').click(); cy.get('[role=status]').should('contain', 'Record created successfully.');
      // Use navigation rather than reloading the selected tab, which intentionally defaults to Projects.
      cy.reload();
      if (resource !== 'projects') cy.contains('[aria-label="Record type"] button', resource === 'qualifications' ? 'Education' : 'Contacts').click();
      cy.contains('.record-card', resource === 'contacts' ? 'Admin Cypress inquiry.' : `Cypress ${resource} record`).as('record');
      cy.get('@record').should('exist').contains('button', /^Edit$/).click();
      cy.get('form textarea').clear().type(`Updated Cypress ${resource} description.`); cy.contains('button', 'Save changes').click();
      cy.get('[role=status]').should('contain', 'Record updated successfully.'); cy.screenshot(`05-admin-${resource}-updated`);
      cy.contains('.record-card', `Updated Cypress ${resource} description.`).within(() => {
        cy.contains('button', /^Delete$/).click(); cy.contains('Delete this record permanently?').should('be.visible'); cy.contains('button', 'Confirm delete').click();
      });
      cy.get('[role=status]').should('contain', 'Record deleted successfully.');
      cy.contains('.record-card', `Updated Cypress ${resource} description.`).should('not.exist');
      cy.contains('button', 'Sign out').click();
    });
  }
});
