import { AbstractGameObject } from "./abstract-game-object";
import { GameObject } from "./game-object";

export abstract class CircleGameObject extends AbstractGameObject {

    private _x: number
    private _y: number
    private _radius: number

    constructor(x: number, y: number, radius: number) {
        super()
        this._x = x
        this._y = y
        this._radius = radius
    }

    checkInteractionIn(interactionX: number, interactionY: number): boolean {
        const dist = (this._x - interactionX) * (this._x - interactionX) + (this._y - interactionY) * (this._y - interactionY)

        return dist <= this._radius * this._radius
    }
    
    public set x(x: number) {
        this._x = x
    }

    public get x(): number {
        return this._x
    }

    public set y(y: number) {
        this._y = y
    }
    
    public get y(): number {
        return this._y
    }

    public set radius(radius: number) {
        this._radius = radius
    }
    
    public get radius(): number {
        return this._radius
    }
}

export class TestCircle extends CircleGameObject {

    constructor(x: number, y: number, radius: number) {
        super(x, y, radius)
    }

    public draw(context: CanvasRenderingContext2D, width: number, height: number): void {
        context.fillStyle = this.interactionIn ? "red" : "blue"
        context.beginPath()
        context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, Math.PI * 2)
        context.fill()
    }

    public update(): void {

    }

}