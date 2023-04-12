import { DotColor } from "../..";
import { UiBarElement } from "./ui-bar-element";

export class DotUiBarElement extends UiBarElement {

    private _dot: DotColor

    constructor(dot: DotColor, text?: string) {
        super(text)
        this._dot = dot
    }
    
    drawGraphic(context: CanvasRenderingContext2D): void {
        context.fillStyle = this._dot.color

        context.beginPath()
        context.ellipse(this.x + this.height / 2, this.y + this.height / 2, this.height / 4, this.height / 4, 0, 0, Math.PI * 2)
        context.fill()
    }
    
}