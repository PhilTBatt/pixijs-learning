import { Container, Graphics, Text } from "pixi.js"
import { Game } from "./Game"

export class Button {
    game: Game
    buttonContainer: Container
    buttonBackground: Graphics
    buttonText: Text


    constructor(game: Game, draw: () => Graphics, offsetY: number, text: string, onClick: () => void) {
        this.game = game

        this.buttonContainer = new Container()
        this.buttonContainer.y = offsetY
        this.buttonContainer.eventMode = "static"
        this.buttonContainer.cursor = 'pointer'

        this.buttonBackground = draw()
        this.buttonContainer.addChild(this.buttonBackground)

        this.buttonText = new Text({text: text, style: {fontSize: this.game.app.screen.height / 25, fill: 0xffffff}})
        this.buttonText.anchor.set(0.5)
        this.buttonContainer.addChild(this.buttonText)

        this.buttonContainer.on('pointerdown', () => onClick() )
    }
}