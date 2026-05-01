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

  const symbols = [
    { name: 'star', draw: (g: Graphics) => g.star(0, 0, 5, 30, 12).fill({ color: 0xFFD700 }) },
    { name: 'circle', draw: (g: Graphics) => g.circle(0, 0, 30).fill({ color: 0xd1001f }) },
    { name: 'diamond', draw: (g: Graphics) => g.rect(-20, -20, 40, 40).fill({ color: 0x44AAFF }) },
  ]

  const revealedSymbols: string[] = []

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const tile = new Graphics()
      tile.rect(-tileWidth/2, -tileHeight/2, tileWidth, tileHeight)
      tile.x = gameboard.x + j * tileWidth  + tileSpacing * j
      tile.y = gameboard.y + i * tileHeight  + tileSpacing * i
      tile.fill({ color: 0xFFA500 })
      app.stage.addChild(tile)

      tile.eventMode = "static"
      tile.cursor = 'pointer'
      tile.on('pointerdown', () => {
        tile.eventMode = 'none'
        tile.tint = 0xff9999
        const symbol = symbols[Math.floor(Math.random() * symbols.length)]
        const symbolGraphic = new Graphics()
        symbol.draw(symbolGraphic)
        app.stage.addChild(symbolGraphic)
        symbolGraphic.x = tile.x
        symbolGraphic.y = tile.y

        revealedSymbols.push(symbol.name)

        if (revealedSymbols.length === 9) {
          const counts = revealedSymbols.reduce((acc: Record<string, number>, symbol) => {
            acc[symbol] = (acc[symbol] || 0) + 1
            return acc
          }, {})
          
          for (const count in counts) if (counts[count] >= 3) console.log(`You win!`)
        }
      })
    }
  }
})()