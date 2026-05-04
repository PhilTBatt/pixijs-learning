import { Application, Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";
import { Gameboard } from "./Gameboard";

export class Game {
    app: Application

    constructor(app: Application) {
        this.app = app
    }

    async start() {
        await this.app.init({ background: "#1099bb", resizeTo: window })

        document.getElementById("pixi-container")!.appendChild(this.app.canvas)

        const gameboardHeight = this.app.screen.height / 1.5
        const gameboardWidth = this.app.screen.width / 2.5

        const gameboard = new Gameboard(this.app, gameboardWidth, gameboardHeight)
        gameboard.initialiseGameBoard()

        const tileHeight = this.app.screen.height / 6.5
        const tileWidth = this.app.screen.width / 10
        const tileSpacing = this.app.screen.width / 50

        const symbols = [
            { name: 'star', draw: (g: Graphics) => g.star(0, 0, 5, 30, 12).fill({ color: 0xFFD700 }) },
            { name: 'circle', draw: (g: Graphics) => g.circle(0, 0, 30).fill({ color: 0xd1001f }) },
            { name: 'square', draw: (g: Graphics) => g.rect(-20, -20, 40, 40).fill({ color: 0x2266FF }) },
            { name: 'diamond', draw: (g: Graphics) => g.rect(-20, -20, 40, 40).fill({ color: 0x00bfbf }).angle = 45 },
            { name: 'triangle', draw: (g: Graphics) => g.poly([0, -30, 30, 30, -30, 30]).fill({ color: 0x22cc44 }) }
        ]
        const tiles: Graphics[] = []
        const revealedSymbols: { name: string, graphic: Graphics }[] = []

        const winScreen = new Container()
        winScreen.visible = false
        winScreen.x = gameboard.gameboard.x
        winScreen.y = gameboard.gameboard.y
        const winBackground = new Graphics()
        winBackground.rect(-gameboardWidth/2, -gameboardHeight/2, gameboardWidth, gameboardHeight)
        winBackground.fill({ color: 0x000000, alpha: 0.6 })
        winScreen.addChild(winBackground)
        const winText = new Text({text: 'You Lose!', style: {fontSize: 64, fill: 0xffffff, fontWeight: 'bold'}})
        winText.anchor.set(0.5)
        winScreen.addChild(winText)

        const resetButtonWidth = this.app.screen.width / 10
        const resetButtonHeight = this.app.screen.height / 12
        const resetButtonOffsetY = this.app.screen.height / 6
        const resetButton = new Container()
        resetButton.y = resetButtonOffsetY
        resetButton.eventMode = "static"
        resetButton.cursor = 'pointer'
        const resetBackground = new Graphics()
        resetBackground.rect(-resetButtonWidth/2, -resetButtonHeight/2, resetButtonWidth, resetButtonHeight)
        resetBackground.fill({ color: 0x909090 })
        resetButton.addChild(resetBackground)
        const resetText = new Text({text: 'Reset', style: {fontSize: 32, fill: 0xffffff}})
        resetText.anchor.set(0.5)
        resetButton.addChild(resetText)
        winScreen.addChild(resetButton)

        resetButton.on('pointerdown', () => {
            winScreen.visible = false
            tiles.forEach(tile => {
                tile.tint = 0xffffff
                tile.eventMode = 'static'
                tile.cursor = 'pointer'
            })
            symbolContainer.removeChildren()
            revealedSymbols.length = 0
            gsap.killTweensOf(winScreen)
            gsap.killTweensOf(winText.scale)
            gsap.killTweensOf(winText)
            winText.scale.set(1)
            winText.y = 0
            winText.text = 'You Lose!'
        })

        const tileContainer = new Container()
        this.app.stage.addChild(tileContainer)

        const symbolContainer = new Container()
        this.app.stage.addChild(symbolContainer)

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
            const tile = new Graphics()
            tile.rect(-tileWidth/2, -tileHeight/2, tileWidth, tileHeight)
            tile.x = gameboard.gameboard.x + j * tileWidth  + tileSpacing * j
            tile.y = gameboard.gameboard.y + i * tileHeight  + tileSpacing * i
            tile.fill({ color: 0xFFA500 })
            tileContainer.addChild(tile)
            tiles.push(tile)

            tile.eventMode = "static"
            tile.cursor = 'pointer'
            tile.on('pointerdown', () => {
                tile.eventMode = 'none'
                tile.tint = 0xff9999
                const symbol = symbols[Math.floor(Math.random() * symbols.length)]
                const symbolGraphic = new Graphics()
                symbol.draw(symbolGraphic)
                symbolGraphic.x = tile.x
                symbolGraphic.y = tile.y

                revealedSymbols.push({ name: symbol.name, graphic: symbolGraphic })

                gsap.to(tile.scale, {x:0, duration: 0.15, onComplete: () => {
                    gsap.to(tile.scale, {x:1, duration: 0.15, onComplete: () => symbolContainer.addChild(symbolGraphic)})
                    }
                })

                if (revealedSymbols.length === 9) {
                    const counts = revealedSymbols.reduce((acc: Record<string, number>, symbol) => {
                        acc[symbol.name] = (acc[symbol.name] || 0) + 1
                        return acc
                    }, {})

                    winScreen.alpha = 0
                    winScreen.visible = true
                    gsap.to(winScreen, {alpha: 1, duration: 2, onComplete: () => {
                        gsap.to(winText.scale, { x: 1.2, y: 1.2, duration: 0.5, yoyo: true, repeat: -1})
                        gsap.to(winText, { y: -30, duration: 0.5, ease: "power2.out", yoyo: true, repeat: -1 })
                        for (const symbol of revealedSymbols) if (counts[symbol.name] >= 3) {
                            gsap.to(symbol.graphic.scale, { x: 1.3, y: 1.3, duration: 0.5, yoyo: true, repeat: -1})
                            gsap.to(symbol.graphic, { y: symbol.graphic.y -5, duration: 0.5, ease: "power2.out", yoyo: true, repeat: -1 })
                        }
                    }})
                
                    for (const count in counts) if (counts[count] >= 3) {
                        winText.text = 'You Win!'
                        break
                    }
                }
            })
            }
        }

        this.app.stage.addChild(winScreen)
    }
}