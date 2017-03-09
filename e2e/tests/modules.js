Feature('Modules');

Background((I) => {
  I.amOnPage('/modules');
  I.waitForElement('.mosaic', 5)
});

Scenario('Loads', (I) => {
  I.see('Modelling isn’t always easy, but it could be easier');
});

Scenario('Searches by family type', (I) => {
  within('.family-filter', () => {
    I.click('occurrence');
  })
  I.waitForElement('.mosaic')
  I.seeInCurrentUrl('/modules?searchFamily=occurrence')
});
