import { Container, Graphics } from "pixi.js";
import { Game } from "./Game";
import gsap from "gsap";

export class Gameboard {
    game: Game
    gameboard: Graphics
    gameboardHeight: number
    gameboardWidth: number
    tileContainer = new Container()
    symbolContainer = new Container()
    tiles: Graphics[]
    symbols: { name: string, draw: (g: Graphics) => any }[]
    revealedSymbols: { name: string, graphic: Graphics }[]

    constructor(game: Game, gameboardWidth: number, gameboardHeight: number) {
        this.game = game
        this.gameboard = new Graphics()
        this.gameboardWidth = gameboardWidth
        this.gameboardHeight = gameboardHeight
        this.tiles = []
        this.symbols = [
            { name: 'star', draw: (g: Graphics) => g.star(0, 0, 5, 30, 12).fill({ color: 0xFFD700 }) },
            { name: 'circle', draw: (g: Graphics) => g.circle(0, 0, 30).fill({ color: 0xd1001f }) },
            { name: 'square', draw: (g: Graphics) => g.rect(-20, -20, 40, 40).fill({ color: 0x2266FF }) },
            { name: 'diamond', draw: (g: Graphics) => g.rect(-20, -20, 40, 40).fill({ color: 0x00bfbf }).angle = 45 },
            { name: 'triangle', draw: (g: Graphics) => g.poly([0, -30, 30, 30, -30, 30]).fill({ color: 0x22cc44 }) }
        ]
        this.revealedSymbols = []
    }

    initialiseGameBoard() {
        this.gameboard.rect(-this.gameboardWidth/2, -this.gameboardHeight/2, this.gameboardWidth, this.gameboardHeight)
        this.gameboard.x = this.game.app.screen.width / 2
        this.gameboard.y = this.game.app.screen.height / 2
        this.gameboard.fill({ color: 0x964B00 })
        this.game.app.stage.addChild(this.gameboard)
        this.game.app.stage.addChild(this.tileContainer)
        this.game.app.stage.addChild(this.symbolContainer)

        this.game.winScreen.resetButton.on('pointerdown', () => {
            this.game.winScreen.winScreen.visible = false
            this.tiles.forEach(tile => {
                tile.tint = 0xffffff
                tile.eventMode = 'static'
                tile.cursor = 'pointer'
            })
            this.symbolContainer.removeChildren()
            this.revealedSymbols.length = 0
            gsap.killTweensOf(this.game.winScreen)
            gsap.killTweensOf(this.game.winScreen.winText.scale)
            gsap.killTweensOf(this.game.winScreen.winText)
            this.game.winScreen.winText.scale.set(1)
            this.game.winScreen.winText.y = 0
            this.game.winScreen.winText.text = 'You Lose!'
            this.game.app.stage.addChild(this.game.winScreen.winScreen)
        })

        const tileHeight = this.game.app.screen.height / 6.5
        const tileWidth = this.game.app.screen.width / 10
        const tileSpacing = this.game.app.screen.width / 50

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
            const tile = new Graphics()
            tile.rect(-tileWidth/2, -tileHeight/2, tileWidth, tileHeight)
            tile.x = this.gameboard.x + j * tileWidth  + tileSpacing * j
            tile.y = this.gameboard.y + i * tileHeight  + tileSpacing * i
            tile.fill({ color: 0xFFA500 })
            this.tileContainer.addChild(tile)
            this.tiles.push(tile)

            tile.eventMode = "static"
            tile.cursor = 'pointer'
            tile.on('pointerdown', () => {
                tile.eventMode = 'none'
                tile.tint = 0xff9999
                const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)]
                const symbolGraphic = new Graphics()
                symbol.draw(symbolGraphic)
                symbolGraphic.x = tile.x
                symbolGraphic.y = tile.y

                this.revealedSymbols.push({ name: symbol.name, graphic: symbolGraphic })

                gsap.to(tile.scale, {x:0, duration: 0.15, onComplete: () => {
                    gsap.to(tile.scale, {x:1, duration: 0.15, onComplete: () => this.symbolContainer.addChild(symbolGraphic)})
                    }
                })

                if (this.revealedSymbols.length === 9) {
                    const counts = this.revealedSymbols.reduce((acc: Record<string, number>, symbol) => {
                        acc[symbol.name] = (acc[symbol.name] || 0) + 1
                        return acc
                    }, {})

                    this.game.winScreen.winScreen.alpha = 0
                    this.game.winScreen.winScreen.visible = true
                    gsap.to(this.game.winScreen.winScreen, {alpha: 1, duration: 2, onComplete: () => {
                        gsap.to(this.game.winScreen.winText.scale, { x: 1.2, y: 1.2, duration: 0.5, yoyo: true, repeat: -1})
                        gsap.to(this.game.winScreen.winText, { y: -30, duration: 0.5, ease: "power2.out", yoyo: true, repeat: -1 })
                        for (const symbol of this.revealedSymbols) if (counts[symbol.name] >= 3) {
                            gsap.to(symbol.graphic.scale, { x: 1.3, y: 1.3, duration: 0.5, yoyo: true, repeat: -1})
                            gsap.to(symbol.graphic, { y: symbol.graphic.y -5, duration: 0.5, ease: "power2.out", yoyo: true, repeat: -1 })
                        }
                    }})
                
                    for (const count in counts) if (counts[count] >= 3) {
                        this.game.winScreen.winText.text = 'You Win!'
                        break
                    }
                }
            })
            }
        }
    }
}