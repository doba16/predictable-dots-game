import { Dot, GameObject } from "./index";


export class SequenceGameObject implements GameObject {
    
    private _sequence: Dot[] | undefined

    updateInteraction(interactionX: number, interactionY: number, interactionClicked: boolean): void {
        // No action needed.
    }
    
    update(width: number, height: number): void {
        throw new Error("Method not implemented.");
    }

    draw(context: CanvasRenderingContext2D, width: number, height: number): void {
        throw new Error("Method not implemented.");
    }

    public get sequence(): Dot[] | undefined {
        return this._sequence
    }

    public set sequence(sequence: Dot[] | undefined) {
        this._sequence = sequence
    }

}