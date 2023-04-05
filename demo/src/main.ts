import './style.css'
import {DotsGame, GameEngine} from "@doba16/predictable-dots-game"

const canvas: HTMLCanvasElement = document.getElementById("test-canvas") as HTMLCanvasElement

/* new DotsGame({
    canvas,
    width: 6,
    height: 6
}).startDrawing() */


const engine = new GameEngine(canvas)
engine.initialize()

new DotsGame({
    engine,
    width: 6,
    height: 6
})

