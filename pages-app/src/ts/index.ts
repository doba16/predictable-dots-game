import { DOT_COLOR_BLUE, DOT_COLOR_PURPLE, DOT_COLOR_RED, DotsGame, GameEngine } from "@doba16/predictable-dots-game"

const goalsCanvas = document.querySelector("#goals-1-canvas") as HTMLCanvasElement

if (goalsCanvas) {
    const engine = new GameEngine(goalsCanvas)
    engine.initialize()

    new DotsGame({
        engine,
        width: 6,
        height: 6,
        allowedMoves: 30,
        goals: [
            {
                color: DOT_COLOR_BLUE,
                neededAmount: 10
            }, {
                color: DOT_COLOR_RED,
                neededAmount: 15
            }, {
                color: DOT_COLOR_PURPLE,
                neededAmount: 20
            }
        ]
    })
}

const simpleExampleCanvas = document.querySelector("#simple-example-canvas") as HTMLCanvasElement

if (simpleExampleCanvas) {
    const engine = new GameEngine(simpleExampleCanvas)
    engine.initialize()

    new DotsGame({
        engine,
        width: 6,
        height: 6,
        allowedMoves: 30
    })
}