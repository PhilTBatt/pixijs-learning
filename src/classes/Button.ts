import { Container, Graphics, Text } from "pixi.js"
import { Game } from "./Game"

export class Button {
    game: Game
    buttonContainer: Container
    buttonBackground: Graphics
    buttonText: Text


    constructor(game: Game, width: number, height: number, offsetY: number, text: string,  colour: number, onClick: () => void) {
        this.game = game

        this.buttonContainer = new Container()
        this.buttonContainer.y = offsetY
        this.buttonContainer.eventMode = "static"
        this.buttonContainer.cursor = 'pointer'

        this.buttonBackground = new Graphics()
        this.buttonBackground.rect(-width/2, -height/2, width, height)
        this.buttonBackground.fill({ color: colour })
        this.buttonContainer.addChild(this.buttonBackground)

        this.buttonText = new Text({text: text, style: {fontSize: 32, fill: 0xffffff}})
        this.buttonText.anchor.set(0.5)
        this.buttonContainer.addChild(this.buttonText)

        this.buttonContainer.on('pointerdown', () => onClick() )
    }
}