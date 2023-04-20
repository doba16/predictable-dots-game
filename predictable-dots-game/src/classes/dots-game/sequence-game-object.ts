import { DUMMY_DOT_COLOR, Dot, DotColor } from "../../index";
import { RenderSettings } from "../../types/render-settings";
import { compareColors } from "../../utils/color";
import { GameObject } from "../engine/index";


export class SequenceGameObject implements GameObject {
    
    private _sequence: Dot[] = []
    private _renderSettings: RenderSettings = {
        gridSize: 0,
        xOff: 0,
        yOff: 0
    }

    updateInteraction(interactionX: number, interactionY: number, interactionClicked: boolean): void {
        // No action needed.
    }
    
    update(width: number, height: number): void {
        // No action needed
    }

    draw(context: CanvasRenderingContext2D, width: number, height: number, interactionX: number, interactionY: number): void {
        if (this.sequence.length > 0) {
            context.lineWidth = this.renderSettings.gridSize / 7
            context.strokeStyle = this.sequence[0].color.color
            context.lineCap = "round"
            context.lineJoin = "round"

            context.beginPath()
            context.moveTo(
                this.renderSettings.xOff + this.renderSettings.gridSize * (1 + this.sequence[0].xLocation),
                this.renderSettings.yOff + this.renderSettings.gridSize * (1 + this.sequence[0].yLocation),
            )
            for (let i: number = 1; i < this.sequence.length; i++) {
                context.lineTo(
                    this.renderSettings.xOff + this.renderSettings.gridSize * (1 + this.sequence[i].xLocation),
                    this.renderSettings.yOff + this.renderSettings.gridSize * (1 + this.sequence[i].yLocation),
                )
            }
            context.lineTo(interactionX, interactionY)
            context.stroke()
            
        }
    }

    /**
     * Attempts to add a dot to the sequence if it is a valid move.
     * 
     * @param dot dot to attempt to add
     */
    public attemptAddDot(dot: Dot): void {
        if (this.sequence.length === 0) {
            return
        }

        const firstDot = this.sequence[0]
        const prevDot = this.sequence[this.sequence.length - 1]
        const prevPrevDot = this.sequence[this.sequence.length - 2]

        if (!compareColors(firstDot.color, dot.color)) {
            return
        }

        // Do not allow connection of dummy dots
        if (compareColors(firstDot.color, DUMMY_DOT_COLOR)) {
            return
        }

        const distSquared = (prevDot.xLocation - dot.xLocation) * (prevDot.xLocation - dot.xLocation) +
                (prevDot.yLocation - dot.yLocation) * (prevDot.yLocation - dot.yLocation)

        if (distSquared !== 1) {
            return
        }

        if (prevPrevDot === dot) {
            this.sequence.pop()
            return
        }

        this.sequence.push(dot)
    }

    public isSquareMove(): boolean {
        for (let i = 0; i < this.sequence.length; i++) {
            for (let j = i + 1; j < this.sequence.length; j++) {
                if (this.sequence[i].xLocation === this.sequence[j].xLocation && this.sequence[i].yLocation === this.sequence[j].yLocation) {
                    return true
                }
            }
        }
        return false
    }

    public get sequence(): Dot[] {
        return this._sequence
    }

    public set sequence(sequence: Dot[]) {
        this._sequence = sequence
    }

    public get renderSettings(): RenderSettings {
        return this._renderSettings
    }

    public set renderSettings(renderSettings: RenderSettings) {
        this._renderSettings = renderSettings
    }

}