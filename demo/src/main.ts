import './style.css'
import { DOT_COLOR_RED, DotsGame, GameEngine } from "@doba16/predictable-dots-game"
import testSequence from "./test.json"

const canvas: HTMLCanvasElement = document.getElementById("test-canvas") as HTMLCanvasElement

const engine = new GameEngine(canvas)
engine.initialize()

new DotsGame({
    engine,
    width: 6,
    height: 6,
    allowedMoves: 30,
    afterSequenceEnds: "random",
    dotSequence: testSequence,
    goals: [
        {
            color: DOT_COLOR_RED,
            neededAmount: 5
        }
    ]
})

