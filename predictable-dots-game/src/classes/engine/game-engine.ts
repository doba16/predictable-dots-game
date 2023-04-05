import { GameObject } from "./game-object"

export class GameEngine extends EventTarget {

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    private gameObjects: GameObject[] = []

    private _width: number = 0
    private _height: number = 0

    private _interactionX: number = 0
    private _interactionY: number = 0
    private _interactionClicked: boolean = false

    constructor(canvas: HTMLCanvasElement) {
        super()

        this.canvas = canvas
        
        const ctx = canvas.getContext("2d")
        if (!ctx) {
            throw new Error("Unable to obtain context from canvas")
        }
        this.ctx = ctx
    }

    /**
     * Initialize the game engine.
     * 
     * This method initializes the game engine, registers callbacks and starts the game loop.
     */
    public initialize(): void {
        // Register events
        this.registerEvents()

        // Start game loop
        this.gameLoop()
    }

    /**
     * Game Loop.
     * 
     * Draws the game repeatedly.
     */
    private gameLoop(): void {
        // Update canvas
        this.updateCanvas()

        // Update Game Objects
        this.updateGameObjects()

        // Draw the game after all game objects are updated
        this.draw()

        // Request the next frame
        window.requestAnimationFrame(this.gameLoop.bind(this))
    }

    /**
     * Update canvas.
     */
    private updateCanvas(): void {
        // Update size
        this._width = this.canvas.getBoundingClientRect().width
        this._height = this.canvas.getBoundingClientRect().height

        this.canvas.width = this._width
        this.canvas.height = this._height

        // Clear canvas
        this.ctx.clearRect(0, 0, this._width, this._height)
    }

    /**
     * Update game objects
     */
    private updateGameObjects() {
        this.dispatchEvent(new Event("update"))

        this.gameObjects.forEach(gameObject => gameObject.update(this.canvas.width, this.canvas.height))
    }
    
    /**
     * Draws the game.
     */
    private draw(): void {
        this.gameObjects.forEach(gameObject => gameObject.draw(this.ctx, this.canvas.width, this.canvas.height, this.interactionX, this.interactionY, this.interactionClicked))        
    }

    public addGameObject(object: GameObject): void {
        this.gameObjects.push(object)
    }

    public removeGameObject(object: GameObject): void {
        this.gameObjects = this.gameObjects.filter(o => o !== object)
    }

    // =============================================================================================
    //  Handle Events
    // =============================================================================================

    private registerEvents(): void {
        this.canvas.addEventListener("mousemove", this.handleMouseMoveEvent.bind(this))
        this.canvas.addEventListener("touchmove", this.handleTouchMoveEvent.bind(this))

        this.canvas.addEventListener("mousedown", this.handleMouseDownEvent.bind(this))
        this.canvas.addEventListener("touchstart", this.handleTouchDownEvent.bind(this))

        this.canvas.addEventListener("mouseup", this.handleMouseUpEvent.bind(this))
        this.canvas.addEventListener("touchend", this.handleTouchUpEvent.bind(this))
    }

    private handleMouseMoveEvent(event: MouseEvent): void {
        this._interactionX = event.offsetX / this.canvas.clientWidth * this.canvas.width
        this._interactionY = event.offsetY / this.canvas.clientHeight * this.canvas.height

        this._interactionClicked = event.buttons > 0

        this.updateInteraction()
        this.dispatchEvent(new Event("interactionMove"))
    }

    private handleTouchMoveEvent(event: TouchEvent): void {
        if (event.touches.length > 0) {
            this._interactionX = (event.touches[0].pageX - this.canvas.getBoundingClientRect().left) / this.canvas.getBoundingClientRect().width * this.canvas.width
            this._interactionY = (event.touches[0].pageY - this.canvas.getBoundingClientRect().top) / this.canvas.getBoundingClientRect().height * this.canvas.height
        }

        this._interactionClicked = true

        this.updateInteraction()
        this.dispatchEvent(new Event("interactionMove"))
    }

    private handleMouseDownEvent(event: MouseEvent): void {
        this.handleMouseMoveEvent(event)
        
        this._interactionClicked = true

        this.updateInteraction()
        this.dispatchEvent(new Event("interactionDown"))
    }

    private handleTouchDownEvent(event: TouchEvent) {
        this.handleTouchMoveEvent(event)

        this._interactionClicked = true

        this.updateInteraction()
        this.dispatchEvent(new Event("interactionDown"))
    }

    private handleMouseUpEvent(event: MouseEvent): void {
        this.handleMouseMoveEvent(event)
        
        this._interactionClicked = false

        this.updateInteraction()
        this.dispatchEvent(new Event("interactionUp"))
    }

    private handleTouchUpEvent(event: TouchEvent) {
        this.handleTouchMoveEvent(event)

        this._interactionClicked = false

        this.updateInteraction()
        this.dispatchEvent(new Event("interactionUp"))
    }

    /**
     * Forward events to all game objects 
     */
    private updateInteraction(): void {
        this.gameObjects.forEach(gameObject => gameObject.updateInteraction(this._interactionX, this._interactionY, this._interactionClicked))
    }

    // =============================================================================================
    //  Getters / Setters
    // =============================================================================================

    public get interactionClicked(): boolean {
        return this._interactionClicked
    }

    public get interactionX(): number {
        return this._interactionX
    }

    public get interactionY(): number {
        return this._interactionY
    }

    public get context(): CanvasRenderingContext2D {
        return this.ctx
    }

    public get width(): number {
        return this._width
    }

    public get height(): number {
        return this._height
    }

}