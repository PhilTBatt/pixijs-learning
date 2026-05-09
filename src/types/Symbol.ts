import { Graphics } from "pixi.js"

export type Symbol = {
    name: string
    draw: () => Graphics
}

export const symbols: Symbol[] =  [
    { name: 'star', draw: () => new Graphics().star(0, 0, 5, 30, 12).fill({ color: 0xFFD700 }) },
    { name: 'circle', draw: () => new Graphics().circle(0, 0, 30).fill({ color: 0xd1001f }) },
    { name: 'square', draw: () => new Graphics().rect(-20, -20, 40, 40).fill({ color: 0x2266FF }) },
    { name: 'triangle', draw: () => new Graphics().poly([0, -30, 30, 30, -30, 30]).fill({ color: 0x22cc44 }) },
    { name: 'diamond', draw: () => {const graphic = new Graphics().rect(-20, -20, 40, 40).fill({ color: 0x00bfbf }); graphic.angle = 45; return graphic} },
    { name: 'pentagon', draw: () => new Graphics().poly([0, -30, 28, -9, 18, 25, -18, 25, -28, -9]).fill({ color: 0x9b1199 }) },
    { name: 'hexagon', draw: () => new Graphics().poly([0, -30, 26, -15, 26, 15, 0, 30, -26, 15, -26, -15]).fill({ color: 0xff9977 }) }
]