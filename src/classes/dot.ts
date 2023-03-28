import { DotColor } from "../types/dot-color"
import { RenderSettings } from "../types/render-settings"

export class Dot {

    private _x: number
    private _y: number

    private animatedY: number

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
        this.animatedY = y
        this._color = color

        this.selected = false
    }

    public render(settings: RenderSettings): void {
        if (this.selected) {
            settings.context.fillStyle = this.color.shadowColor

            settings.context.beginPath()
            settings.context.ellipse(
                settings.xOff + settings.gridSize * (1 + this.x),
                settings.yOff + settings.gridSize * (1 + this.y),
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
            settings.yOff + settings.gridSize * (1 + this.y),
            settings.gridSize / 4,
            settings.gridSize / 4,
            0, 0, Math.PI * 2
        )
        settings.context.fill()
    }

    public mouseMove(e: MouseEvent, settings: RenderSettings): void {
        const renderedX = settings.xOff + settings.gridSize * (1 + this.x)
        const renderedY = settings.yOff + settings.gridSize * (1 + this.y)

        const distSquared = (e.x - renderedX) * (e.x - renderedX) + (e.y - renderedY) * (e.y - renderedY)
        
        const nextSelected = distSquared <= (settings.gridSize / 4) * (settings.gridSize / 4)

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