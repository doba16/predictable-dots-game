import { GameObject } from "./game-object"

export abstract class AbstractGameObject extends EventTarget implements GameObject {
    
    private _interactionIn: boolean = false
    private _interactionClicked: boolean = false
    private _disabled: boolean = false

    abstract checkInteractionIn(interactionX: number, interactionY: number): boolean

    abstract update(width: number, height: number): void


    abstract draw(context: CanvasRenderingContext2D, width: number, height: number, interactionX: number, interactionY: number, interactionClicked: boolean): void

    public interactionEnter(): void {
        // Do nothing by default
    }

    public interactionLeave(): void {
        // Do noting by default
    }

    public interactionDown(): void {
        // Do noting by default
    }

    public interactionUp(): void {
        // Do noting by default
    }

    public updateInteraction(interactionX: number, interactionY: number, interactionClicked: boolean): void {
        if (this.disabled) {
            return
        }

        const newInteractionIn = this.checkInteractionIn(interactionX, interactionY)

        if (newInteractionIn && !this._interactionIn) {
            this.dispatchEvent(new Event("interactionEnter"))
            this.interactionEnter()
        }

        if (!newInteractionIn && this._interactionIn) {
            this.dispatchEvent(new Event("interactionLeave"))
            this.interactionLeave()
        }

        if (newInteractionIn && interactionClicked && !this._interactionClicked) {
            this.dispatchEvent(new Event("interactionDown"))
            this.interactionDown()
        }

        if (newInteractionIn && !interactionClicked && this._interactionClicked) {
            this.dispatchEvent(new Event("interactionUp"))
            this.interactionUp()
        }

        this._interactionIn = newInteractionIn
        this._interactionClicked = interactionClicked
    }
    
    public get interactionIn(): boolean {
        return this._interactionIn
    }
    
    public get interactionClicked(): boolean {
        return this._interactionClicked
    }

    public get disabled(): boolean {
        return this._disabled
    }
    
    public set disabled(disabled: boolean) {
        this._disabled = disabled
    }
}