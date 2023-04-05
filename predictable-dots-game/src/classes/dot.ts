import { DotColor } from "../types/dot-color"
import { GameSettings } from "../types/game-settings"
import { RenderSettings } from "../types/render-settings"
import { InterpolatedValue } from "./engine/interpolated-value"
import { SpringInterpolatedValue } from "./engine/spring-interpolated-value"
import { CircleGameObject } from "./index"

export class Dot extends CircleGameObject {

    private _xLocation: number
    private _yLocation: number

    private _yInterpolatedValue: InterpolatedValue

    private _renderSettings: RenderSettings

    private _color: DotColor

    constructor({ x, y, color }: {
        x: number,
        y: number,
        color: DotColor
    }) {
        super(0, 0, 20)

        this._xLocation = x
        this._yLocation = y
        this._color = color

        this._yInterpolatedValue = new SpringInterpolatedValue(y - 5)
        this._yInterpolatedValue.value = y

        this._renderSettings = {
            gridSize: 0,
            xOff: 0,
            yOff: 0
        }
    }

    public update(): void {
        this.x = (this.xLocation + 1) * this.renderSettings.gridSize + this.renderSettings.xOff
        this.y = (this._yInterpolatedValue.interpolate() + 1) * this.renderSettings.gridSize + this.renderSettings.yOff

        this.radius = this.renderSettings.gridSize / 2.5
    }

    public draw(context: CanvasRenderingContext2D, width: number, height: number): void {
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
        this._yLocation = y
        this._yInterpolatedValue.value = y
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