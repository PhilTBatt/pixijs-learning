import { Application } from "pixi.js";
import { Game } from "./classes/Game";

(async () => {
	const app = new Application()

	const game = new Game(app)
	await game.start()
})()