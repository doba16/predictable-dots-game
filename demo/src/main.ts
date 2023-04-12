import './style.css'
import { DOT_COLOR_BLUE, DOT_COLOR_GREEN, DOT_COLOR_RED, DotsGame, GameEngine } from "@doba16/predictable-dots-game"

const canvas: HTMLCanvasElement = document.getElementById("test-canvas") as HTMLCanvasElement

const engine = new GameEngine(canvas)
engine.initialize()

const R = DOT_COLOR_RED
const B = DOT_COLOR_BLUE
const G = DOT_COLOR_GREEN

new DotsGame({
    engine,
    width: 8,
    height: 6,
    allowedMoves: 10,
    afterSequenceEnds: "random"
})

