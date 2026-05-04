import { Application, Graphics } from "pixi.js";

export class Gameboard {
    app: Application
    gameboard: Graphics
    gameboardHeight: number
    gameboardWidth: number

    constructor(app: Application, gameboardWidth: number, gameboardHeight: number) {
        this.app = app
        this.gameboard = new Graphics()
        this.gameboardWidth = gameboardWidth
        this.gameboardHeight = gameboardHeight
    }

    initialiseGameBoard() {
        this.gameboard.rect(-this.gameboardWidth/2, -this.gameboardHeight/2, this.gameboardWidth, this.gameboardHeight)
        this.gameboard.x = this.app.screen.width / 2
        this.gameboard.y = this.app.screen.height / 2
        this.gameboard.fill({ color: 0x964B00 })
        this.app.stage.addChild(this.gameboard)
    }
}