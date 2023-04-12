import { UiBarElement } from "./ui-bar-element";

export class IconUiBarElement extends UiBarElement {

    private _icon: HTMLImageElement

    constructor(icon: string, text?: string) {
        super(text)
        this._icon = new Image()
        this._icon.src = icon
    }
    
    drawGraphic(context: CanvasRenderingContext2D): void {
        context.drawImage(this._icon, this.x + this.height / 10, this.y + this.height / 10, this.height * 8 / 10, this.height * 8 / 10)
    }
    
}