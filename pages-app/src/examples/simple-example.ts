import {DotsGame} from "@doba16/predictable-dots-game"

const simpleExampleCanvas = document.querySelector("#simple-example-canvas") as HTMLCanvasElement

new DotsGame({
    canvas: simpleExampleCanvas,
    width: 6,
    height: 6
}).startDrawing()