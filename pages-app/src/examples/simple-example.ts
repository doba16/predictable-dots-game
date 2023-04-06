import {DotsGame, GameEngine} from "@doba16/predictable-dots-game"

const simpleExampleCanvas = document.querySelector("#simple-example-canvas") as HTMLCanvasElement

const engine = new GameEngine(simpleExampleCanvas)
engine.initialize()

new DotsGame({
    engine,
    width: 6,
    height: 6
})