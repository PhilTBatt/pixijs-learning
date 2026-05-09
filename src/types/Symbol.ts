import { Graphics } from "pixi.js"

export type Symbol = {
    name: string
    draw: () => Graphics
}