import { Application } from "pixi.js";
import { Gameboard } from "./Gameboard";
import { WinScreen } from "./WinScreen";

export class Game {
    app: Application
    gameboard: Gameboard 
    winScreen: WinScreen

    constructor(app: Application) {
        this.app = app
        this.gameboard = new Gameboard(this, this.app.screen.width / 2.5, this.app.screen.height / 1.5)
        this.winScreen = new WinScreen(this)
    }

    async start() {
        this.gameboard.initialiseGameBoard()

        this.winScreen.initialiseWinScreen(this.gameboard)
    }
}