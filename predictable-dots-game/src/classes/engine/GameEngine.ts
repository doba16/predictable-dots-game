import { GameObject } from "./GameObject"

export class GameEngine {

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    private gameObjects: GameObject[] = []

    private interactionX: number = 0
    private interactionY: number = 0
    private interactionClicked: boolean = false

    constructor(canvas: HTMLCanvasElement) {
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
        const width = this.canvas.getBoundingClientRect().width
        const height = this.canvas.getBoundingClientRect().height

        this.canvas.width = width
        this.canvas.height = height

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height)
    }
    
    /**
     * Draws the game.
     */
    private draw(): void {
        this.gameObjects.forEach(gameObject => gameObject.draw(this.ctx, this.canvas.width, this.canvas.height))

        // For Testing: Draw a diagonal line
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(this.canvas.width, this.canvas.height)
        this.ctx.stroke()

        this.ctx.fillStyle = this.interactionClicked ? "red" : "black";

        this.ctx.beginPath()
        this.ctx.ellipse(this.interactionX, this.interactionY, 10, 10, 0, 0, Math.PI * 2)
        this.ctx.fill()
    }

    public addGameObject(object: GameObject): void {
        this.gameObjects.push(object)
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
        this.interactionX = event.offsetX / this.canvas.clientWidth * this.canvas.width
        this.interactionY = event.offsetY / this.canvas.clientHeight * this.canvas.height

        this.interactionClicked = event.buttons > 0

        this.updateInteraction()
    }

    private handleTouchMoveEvent(event: TouchEvent): void {
        if (event.touches.length > 0) {
            this.interactionX = (event.touches[0].pageX - this.canvas.getBoundingClientRect().left) / this.canvas.getBoundingClientRect().width * this.canvas.width
            this.interactionY = (event.touches[0].pageY - this.canvas.getBoundingClientRect().top) / this.canvas.getBoundingClientRect().height * this.canvas.height
        }

        this.interactionClicked = true

        this.updateInteraction()
    }

    private handleMouseDownEvent(event: MouseEvent): void {
        this.handleMouseMoveEvent(event)
        
        this.interactionClicked = true

        this.updateInteraction()
    }

    private handleTouchDownEvent(event: TouchEvent) {
        this.handleTouchMoveEvent(event)

        this.interactionClicked = true

        this.updateInteraction()
    }

    private handleMouseUpEvent(event: MouseEvent): void {
        this.handleMouseMoveEvent(event)
        
        this.interactionClicked = false

        this.updateInteraction()
    }

    private handleTouchUpEvent(event: TouchEvent) {
        this.handleTouchMoveEvent(event)

        this.interactionClicked = false

        this.updateInteraction()
    }

    /**
     * Forward events to all game objects 
     */
    private updateInteraction(): void {
        this.gameObjects.forEach(gameObject => gameObject.updateInteraction(this.interactionX, this.interactionY, this.interactionClicked))
    }

}