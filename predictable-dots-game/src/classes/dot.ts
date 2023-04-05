import { DotColor } from "../types/dot-color"
import { GameSettings } from "../types/game-settings"
import { RenderSettings } from "../types/render-settings"
import { CircleGameObject } from "./index"

export class Dot extends CircleGameObject {

    private _xLocation: number
    private _yLocation: number

    private _renderSettings: RenderSettings

    private lastY: number
    private animationBeginTime: number

    private _color: DotColor

    constructor({ x, y, color }: {
        x: number,
        y: number,
        color: DotColor
    }) {
        super(0, 0, 20)

        this._xLocation = x
        this._yLocation = y
        this.lastY = y - 5
        this._color = color

        this.animationBeginTime = performance.now()

        this._renderSettings = {
            gridSize: 0,
            xOff: 0,
            yOff: 0
        }
    }

    public update(): void {
        this.x = (this.xLocation + 1) * this.renderSettings.gridSize + this.renderSettings.xOff
        this.y = (this.yLocation + 1) * this.renderSettings.gridSize + this.renderSettings.yOff

        this.radius = this.renderSettings.gridSize / 2.5
    }

    public draw(context: CanvasRenderingContext2D, width: number, height: number): void {
        const progress = Math.min(300, performance.now() - this.animationBeginTime) / 300
        const interpolation = 1 - (progress - 1) * (progress - 1) * (progress - 0.5) * (-2)
        const renderY = interpolation * (this.y - this.lastY) + this.lastY

        if (this.interactionIn) {
            context.fillStyle = this.color.shadowColor

            context.beginPath()
            context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, Math.PI * 2)
            context.fill()
        }

        context.fillStyle = this.color.color

        context.beginPath()
        context.ellipse(this.x, this.y, this.radius / 3 * 2, this.radius / 3 * 2, 0, 0, Math.PI * 2)
        context.fill()
    }


    public get xLocation(): number {
        return this._xLocation
    }

    private set xLocation(x: number) {
        this._xLocation = x
    }

    public get yLocation(): number {
        return this._yLocation
    }

    public set yLocation(y: number) {
        this.lastY = this._yLocation
        this.animationBeginTime = performance.now()
        this._yLocation = y
    }

    public set color(color: DotColor) {
        this._color = color
    }

    public get color(): DotColor {
        return this._color
    }

    public get renderSettings(): RenderSettings {
        return this._renderSettings
    }

    public set renderSettings(renderSettings: RenderSettings) {
        this._renderSettings = renderSettings
    }
}