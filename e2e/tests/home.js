Feature('Home');

Background((I) => {
  I.amOnPage('/');
});

Scenario('Loads', (I) => {
  I.see('ZOON');
});
