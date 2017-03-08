Feature('Home');

Scenario('Loads', (I) => {
  I.amOnPage('/');
  I.see('ZOON');
});
