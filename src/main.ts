import { Application, Graphics } from "pixi.js";

(async () => {
  const app = new Application()

  await app.init({ background: "#1099bb", resizeTo: window })

  document.getElementById("pixi-container")!.appendChild(app.canvas)

  const gameboardHeight = app.screen.height / 1.5
  const gameboardWidth = app.screen.width / 2.5

  const gameboard = new Graphics()
  gameboard.rect(-gameboardWidth/2, -gameboardHeight/2, gameboardWidth, gameboardHeight)
  gameboard.x = app.screen.width / 2
  gameboard.y = app.screen.height / 2
  gameboard.fill({ color: 0x964B00 })
  app.stage.addChild(gameboard)

  const tileHeight = app.screen.height / 6.5
  const tileWidth = app.screen.width / 10
  const tileSpacing = app.screen.width / 50

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const tile = new Graphics()
      tile.rect(-tileWidth/2, -tileHeight/2, tileWidth, tileHeight)
      tile.x = gameboard.x + j * tileWidth  + tileSpacing * j
      tile.y = gameboard.y + i * tileHeight  + tileSpacing * i
      tile.fill({ color: 0xFFFFFF })
      app.stage.addChild(tile)
    }
  }
})()