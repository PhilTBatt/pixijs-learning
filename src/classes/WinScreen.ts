import { Container, Graphics, Text } from "pixi.js";
import { Gameboard } from "./Gameboard";
import { Game } from "./Game";
import gsap from "gsap";

export class WinScreen {
    game: Game
    gameboard: Gameboard
    winScreen: Container
    winBackground: Graphics
    winText: Text
    resetButton: Container

    constructor(game: Game) {
        this.game = game
        this.gameboard = game.gameboard
        this.winScreen = new Container()
        this.winBackground = new Graphics()
        this.winText = new Text({text: 'You Lose!', style: {fontSize: 64, fill: 0xffffff, fontWeight: 'bold'}})

        const resetButtonWidth = this.game.app.screen.width / 10
        const resetButtonHeight = this.game.app.screen.height / 12
        const resetButtonOffsetY = this.game.app.screen.height / 6
        this.resetButton = new Container()
        this.resetButton.y = resetButtonOffsetY
        this.resetButton.eventMode = "static"
        this.resetButton.cursor = 'pointer'
        const resetBackground = new Graphics()
        resetBackground.rect(-resetButtonWidth/2, -resetButtonHeight/2, resetButtonWidth, resetButtonHeight)
        resetBackground.fill({ color: 0x909090 })
        this.resetButton.addChild(resetBackground)
        const resetText = new Text({text: 'Reset', style: {fontSize: 32, fill: 0xffffff}})
        resetText.anchor.set(0.5)
        this.resetButton.addChild(resetText)
    }

    initialiseWinScreen(gameboard: Gameboard) {
        this.winScreen.visible = false
        this.winScreen.x = gameboard.gameboard.x
        this.winScreen.y = gameboard.gameboard.y

        this.winBackground.rect(-gameboard.gameboardWidth/2, -gameboard.gameboardHeight/2, gameboard.gameboardWidth, gameboard.gameboardHeight)
        this.winBackground.fill({ color: 0x000000, alpha: 0.6 })
        
        this.winText.anchor.set(0.5)
        
        this.winScreen.addChild(this.winBackground)
        this.winScreen.addChild(this.winText)
        this.winScreen.addChild(this.resetButton)
        this.game.app.stage.addChild(this.winScreen)
    }

    triggerWinScreen() {
        const counts = this.gameboard.tiles.reduce((acc: Record<string, number>, tile) => {
                acc[tile.symbol.name] = (acc[tile.symbol.name] || 0) + 1
                return acc
            }, {})

        this.winScreen.alpha = 0
        this.winScreen.visible = true
        gsap.to(this.winScreen, {alpha: 1, duration: 2, onComplete: () => {
            gsap.to(this.winText.scale, { x: 1.2, y: 1.2, duration: 0.5, yoyo: true, repeat: -1})
            gsap.to(this.winText, { y: -30, duration: 0.5, ease: "power2.out", yoyo: true, repeat: -1 })
            for (const tile of this.gameboard.tiles) if (counts[tile.symbol.name] >= 3) {
                gsap.to(tile.symbolGraphic.scale, { x: 1.3, y: 1.3, duration: 0.5, yoyo: true, repeat: -1})
                gsap.to(tile.symbolGraphic, { y: tile.symbolGraphic.y -5, duration: 0.5, ease: "power2.out", yoyo: true, repeat: -1 })
            }
        }})

        for (const count in counts) if (counts[count] >= 3) {
            this.winText.text = 'You Win!'
            break
        }
    }
}