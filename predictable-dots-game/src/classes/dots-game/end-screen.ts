import { AbstractGameObject, GameObject } from "../index";

import Logo from "../../../assets/moves.png"
import { InterpolatedValue } from "../engine/interpolated-value";
import { SpringInterpolatedValue } from "../engine/spring-interpolated-value";
import { EaseOutInterpolatedValue } from "../engine/ease-out-interpolated-value";

export class EndScreen extends AbstractGameObject {
    
    private _text: string
    private _icon: HTMLImageElement

    private _x: number = 0
    private _y: number = 0
    private _width: number = 150
    private _height: number = 40

    private _hoverEffect: boolean = false

    private _interpolatedOffset: InterpolatedValue
    private _interpolatedAlpha: InterpolatedValue

    constructor(icon: string, text?: string) {
        super()

        this._icon = new Image()
        this._icon.src = icon

        this._text = text || ""

        this._interpolatedOffset = new EaseOutInterpolatedValue(-0.25)
        this._interpolatedAlpha = new SpringInterpolatedValue(0)
        this._interpolatedOffset.value = 0
        this._interpolatedAlpha.value = 1
    }

    checkInteractionIn(interactionX: number, interactionY: number): boolean {
        return interactionX > this.x && interactionX < this.x + this.width && interactionY > this.y && interactionY < this.y + this.height
    }

    update() {
        // No action needed
    }

    draw(context: CanvasRenderingContext2D, width: number, height: number, interactionX: number, interactionY: number, interactionClicked: boolean): void {
        context.fillStyle = "#777C"
        
        const y = this.y + this._interpolatedOffset.interpolate() * this.height
        // const y = this.y

        context.globalAlpha = this._interpolatedAlpha.interpolate()

        context.beginPath()
        context.moveTo(this.x + this.height / 5, y)
        context.lineTo(this.x + this.width - this.height / 5, y)
        context.arcTo(this.x + this.width, y, this.x + this.width, y + this.height, this.height / 5)
        context.lineTo(this.x + this.width, y + this.height * 4 / 5)
        context.arcTo(this.x + this.width, y + this.height, this.x, y + this.height, this.height / 5)
        context.lineTo(this.x + this.height / 5, y + this.height)
        context.arcTo(this.x, y + this.height, this.x, y, this.height / 5)
        context.lineTo(this.x, y + this.height / 5)
        context.arcTo(this.x, y, this.x + this.width, y, this.height / 5)
        context.fill()
        
        context.drawImage(this._icon, this.x + (this.width - this.height / 2) / 2, y + this.height / 10, this.height * 5 / 10, this.height * 5 / 10)

        context.font = `${this.height * 0.2}px system-ui`
        context.textAlign = "center"
        context.textBaseline = "middle"
        context.fillStyle = "currentColor"
        context.fillText(this.text, this.x + this.width / 2, y + this.height * 8 / 10, this.width - this.height * 0.2)

        context.globalAlpha = 1
    }

    public get x(): number {
        return this._x
    }

    public set x(x: number) {
        this._x = x
    }
    
    public get y(): number {
        return this._y
    }

    public set y(y: number) {
        this._y = y
    }

    public get width(): number {
        return this._width
    }

    public set width(width: number) {
        this._width = Math.max(width, 0)
    }

    public get height(): number {
        return this._height
    }

    public set height(height: number) {
        this._height = Math.max(height, 0)
    }

    public get text(): string {
        return this._text
    }

    public set text(text: string) {
        this._text = text
    }

    public get hoverEffect(): boolean {
        return this._hoverEffect
    }

    public set hoverEffect(hoverEffect: boolean) {
        this._hoverEffect = hoverEffect
    }
}