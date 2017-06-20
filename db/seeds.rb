@simaob = User.create!(
  name: "Simão Belchior",
  email: "simao.belchior@vizzuality.com",
  password: "programacao",
  organization: "Vizzuality",
  github_username: "simaob",
)

@pkoch = User.create!(
  name: "Paulo Köch",
  email: "pkoch@lifeonmars.pt",
  password: "programacao",
  organization: "Life on Mars",
  github_username: "pkoch",
)

ZoonModuleLoader.import(JSON.parse(File.read(File.join(
  File.dirname(__FILE__),
  '..',
  'modules.json',
))))
