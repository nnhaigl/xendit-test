import { CharacterController } from './src/modules/character/character.controller';
import App from './src/app';
require('dotenv').config()

async function active() {
  const port = +process.env.PORT || 8080
  const app = new App(
    [
      CharacterController
    ]
  );
  await app.listen(port).then(() => {
    console.log(`App listening on port ${port}`)
  })
}
active();