import { Container, Graphics } from "pixi.js";
import { Game } from "./Game";
import { Gameboard } from "./Gameboard";
import gsap from "gsap";
import { Symbol } from "../types/Symbol";

export class Tile {
    game: Game
    gameboard: Gameboard
    tileContainer: Container
    tile: Graphics
    symbol: Symbol
    symbolGraphic: Graphics
    symbolRevealed: boolean

    constructor(game: Game) {
        this.game = game
        this.gameboard = game.gameboard
        this.tileContainer = new Container()
        this.tile = new Graphics()
        this.symbol = this.gameboard.symbols[Math.floor(Math.random() * this.gameboard.symbols.length)]
        this.symbolGraphic = this.symbol.draw()
        this.symbolGraphic.visible = false
        this.symbolRevealed = false

        const tileHeight = this.game.app.screen.height / 6.5
        const tileWidth = this.game.app.screen.width / 10
        this.tile.rect(-tileWidth/2, -tileHeight/2, tileWidth, tileHeight)
        this.tile.fill({ color: 0xFFA500 })
        this.tile.eventMode = "static"
        this.tile.cursor = 'pointer'

        this.tileContainer.addChild(this.tile)
        this.tileContainer.addChild(this.symbolGraphic)
        this.game.app.stage.addChild(this.tileContainer)

        this.tile.on('pointerdown', () => {
            this.revealSymbol()
        })
    }

    revealSymbol() {
        if (this.symbolRevealed) return
        this.tile.eventMode = 'none'
        this.tile.tint = 0xff9999

        gsap.to(this.tile.scale, {x:0, duration: 0.15, onComplete: () => {
            gsap.to(this.tile.scale, {x:1, duration: 0.15, onComplete: () => {} })
            }
        })

        gsap.to(this.symbolGraphic.scale, {x:0, duration: 0.15, onComplete: () => {
            gsap.to(this.symbolGraphic.scale, {x:1, duration: 0.15, onComplete: () => {} })
            }
        })

        this.symbolGraphic.visible = true
        this.symbolRevealed = true

        this.gameboard.checkWin()
    }

    resetTile() {
        this.tileContainer.removeChild(this.symbolGraphic)
        this.symbol = this.gameboard.symbols[Math.floor(Math.random() * this.gameboard.symbols.length)]
        this.symbolGraphic = this.symbol.draw()
        this.symbolGraphic.visible = false
        this.symbolRevealed = false

        this.tile.tint = 0xffffff
        this.tile.eventMode = 'static'
        this.tile.cursor = 'pointer'

        this.tileContainer.addChild(this.symbolGraphic)
    }
}