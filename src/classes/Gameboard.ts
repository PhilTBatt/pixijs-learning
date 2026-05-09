import { Graphics } from "pixi.js";
import { Game } from "./Game";
import { Symbol, symbols } from "../types/Symbol";
import { Tile } from "./Tile";
import gsap from "gsap";

export class Gameboard {
    game: Game
    gameboard: Graphics
    gameboardHeight: number
    gameboardWidth: number
    tiles: Tile[]
    symbols: Symbol[]

    constructor(game: Game, gameboardWidth: number, gameboardHeight: number) {
        this.game = game
        this.gameboard = new Graphics()
        this.gameboardWidth = gameboardWidth
        this.gameboardHeight = gameboardHeight
        this.tiles = []
        this.symbols = symbols
    }

    initialiseGameBoard() {
        this.gameboard.rect(-this.gameboardWidth/2, -this.gameboardHeight/2, this.gameboardWidth, this.gameboardHeight)
        this.gameboard.x = this.game.app.screen.width / 2
        this.gameboard.y = this.game.app.screen.height / 2
        this.gameboard.fill({ color: 0x964B00 })
        this.game.app.stage.addChild(this.gameboard)

        const tileHeight = this.game.app.screen.height / 6.5
        const tileWidth = this.game.app.screen.width / 10
        const tileSpacing = this.game.app.screen.width / 50

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
            const tile = new Tile(this.game)
            tile.tileContainer.x = this.gameboard.x + j * tileWidth  + tileSpacing * j
            tile.tileContainer.y = this.gameboard.y + i * tileHeight  + tileSpacing * i
            this.tiles.push(tile)
            }
        }
    }

    checkWin() {
        const allRevealed = this.tiles.every(tile => tile.symbolRevealed)
        if (allRevealed) this.game.winScreen.triggerWinScreen()

    }

    resetGameBoard() {
        this.game.winScreen.winScreen.visible = false
        this.tiles.forEach(tile => tile.resetTile())
        gsap.killTweensOf(this.game.winScreen.winScreen)
        gsap.killTweensOf(this.game.winScreen.winText.scale)
        gsap.killTweensOf(this.game.winScreen.winText)
        this.game.winScreen.winText.scale.set(1)
        this.game.winScreen.winText.y = 0
        this.game.winScreen.winText.text = 'You Lose!'
        this.game.app.stage.addChild(this.game.winScreen.winScreen)
    }
}