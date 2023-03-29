import { DotColor } from "../types/dot-color"
import { RenderSettings } from "../types/render-settings"

export class Dot {

    private _x: number
    private _y: number

    private lastY: number
    private animationBeginTime: number

    private _color: DotColor

    private selected: boolean

    private _mouseEnterCallback?: (dot: Dot) => void
    private _sequenceBeginCallback?: (dot: Dot) => void

    constructor({ x, y, color }: {
        x: number,
        y: number,
        color: DotColor
    }) {
        this._x = x
        this._y = y
        this.lastY = y - 5
        this._color = color

        this.selected = false

        this.animationBeginTime = performance.now()
    }

    public render(settings: RenderSettings): void {
        const progress = Math.min(300, performance.now() - this.animationBeginTime) / 300
        const interpolation = 1 - (progress - 1) * (progress - 1) * (progress - 0.5) * (-2)
        const renderY = interpolation * (this.y - this.lastY) + this.lastY

        if (this.selected) {
            settings.context.fillStyle = this.color.shadowColor

            settings.context.beginPath()
            settings.context.ellipse(
                settings.xOff + settings.gridSize * (1 + this.x),
                settings.yOff + settings.gridSize * (1 + renderY),
                settings.gridSize / 2.5,
                settings.gridSize / 2.5,
                0, 0, Math.PI * 2
            )
            settings.context.fill()
        }

        settings.context.fillStyle = this.color.color

        settings.context.beginPath()
        settings.context.ellipse(
            settings.xOff + settings.gridSize * (1 + this.x),
            settings.yOff + settings.gridSize * (1 + renderY),
            settings.gridSize / 4,
            settings.gridSize / 4,
            0, 0, Math.PI * 2
        )
        settings.context.fill()
    }

    public mouseMove(mouseX: number, mouseY: number, settings: RenderSettings): void {
        const renderedX = settings.xOff + settings.gridSize * (1 + this.x)
        const renderedY = settings.yOff + settings.gridSize * (1 + this.y)

        const distSquared = (mouseX - renderedX) * (mouseX - renderedX) + (mouseY - renderedY) * (mouseY - renderedY)
        
        const nextSelected = distSquared <= (settings.gridSize / 2.5) * (settings.gridSize / 2.5)

        if (this.selected !== nextSelected && nextSelected) {
            if (this.mouseEnterCallback) {
                this.mouseEnterCallback(this)
            }
        }

        this.selected = nextSelected
    }

    public mouseDown() {
        if (this.selected && this.sequenceBeginCallback) {
            this.sequenceBeginCallback(this)
        }
    }
 
    public set sequenceBeginCallback(sequenceBeginCallback: ((dot: Dot) => void) | undefined) {
        this._sequenceBeginCallback = sequenceBeginCallback
    }

    public get sequenceBeginCallback(): ((dot: Dot) => void) | undefined {
        return this._sequenceBeginCallback
    }

    public get x(): number {
        return this._x
    }

    private set x(x: number) {
        this._x = x
    }

    public get y(): number {
        return this._y
    }

    public set y(y: number) {
        this.lastY = this._y
        this.animationBeginTime = performance.now()
        this._y = y
    }

    public set mouseEnterCallback(mouseEnterCallback: ((dot: Dot) => void) | undefined) {
        this._mouseEnterCallback = mouseEnterCallback
    }

    public get mouseEnterCallback(): ((dot: Dot) => void) | undefined {
        return this._mouseEnterCallback
    }

    public set color(color: DotColor) {
        this._color = color
    }

    public get color(): DotColor {
        return this._color
    }
}