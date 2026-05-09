import { Application, Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";
import { Gameboard } from "./Gameboard";
import { Game } from "./Game";

export class WinScreen {
    game: Game
    winScreen: Container
    winBackground: Graphics
    winText: Text
    resetButton: Container

    constructor(game: Game) {
        this.game = game
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

    }
}