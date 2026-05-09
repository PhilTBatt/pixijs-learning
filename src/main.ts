import { Application } from "pixi.js";
import { Game } from "./classes/Game";

(async () => {
	const app = new Application()
	await app.init({ background: "#1099bb", resizeTo: window })
    document.getElementById("pixi-container")!.appendChild(app.canvas)

	const game = new Game(app)
	await game.start()
})()    