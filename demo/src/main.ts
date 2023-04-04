import './style.css'
import {GameEngine, TestCircle} from "@doba16/predictable-dots-game"

const canvas: HTMLCanvasElement = document.getElementById("test-canvas") as HTMLCanvasElement

/* new DotsGame({
    canvas,
    width: 6,
    height: 6
}).startDrawing() */

const circle = new TestCircle(100, 100, 20)

circle.addEventListener("interactionDown", () => console.log("Interaction Down!"))


const engine = new GameEngine(canvas)
engine.initialize()
engine.addGameObject(circle)

