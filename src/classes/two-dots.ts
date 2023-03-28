import { ALL_COT_COLORS, DOT_COLOR_RED } from "../consts/colors"
import { RenderSettings } from "../types/render-settings"
import { randomElement } from "../utils/arrays"
import { Dot } from "./dot"

export class TwoDots {

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    private dots: Dot[][]

    private width: number
    private height: number

    private renderSettings: RenderSettings

    private sequence: Dot[]

    private mouseDown: boolean
    private mouseX: number
    private mouseY: number

    constructor({canvas, width, height}: {
        canvas: HTMLCanvasElement,
        width: number,
        height: number
    }) {
        // Initialize Canvas and context
        this.canvas = canvas
        const ctx = canvas.getContext("2d")
        if (!ctx) {
            throw new Error("Rendering Context ist null!")
        }
        this.ctx = ctx

        // Initialize dimensions
        this.width = width
        this.height = height

        this.renderSettings = {
            screenHeight: 400,
            screenWidth: 400,
            context: this.ctx,
            gridSize: 20,
            xOff: 0,
            yOff: 0
        }

        // Initialize dots
        this.dots = []
        for (let i: number = 0; i < this.width; i++) {
            const arr: Dot[] = []
            for (let j: number = 0; j < this.height; j++) {
                const dot: Dot = new Dot({x: i, y: j, color: randomElement(ALL_COT_COLORS)})
                dot.sequenceBeginCallback = this.beginSequenceCallback.bind(this)
                dot.mouseEnterCallback = this.enterDotCallback.bind(this)
                arr.push(dot)
            }
            this.dots.push(arr)
        }

        this.sequence = []
        this.mouseDown = false
        this.mouseX = 0
        this.mouseY = 0
    }

    /**
     * Callback to start a sequence
     */
    private beginSequenceCallback(dot: Dot) {
        this.sequence = [dot]
    }

    /** 
     * Callback when mouse enters a dot
     */
    private enterDotCallback(dot: Dot): void {
        if (this.mouseDown) {
            if (this.sequence.length === 0) {
                return
            }

            if (this.sequence[0].color !== dot.color) {
                return
            }

            const distSquared = (this.sequence[this.sequence.length - 1].x - dot.x) * (this.sequence[this.sequence.length - 1].x - dot.x) +
                    (this.sequence[this.sequence.length - 1].y - dot.y) * (this.sequence[this.sequence.length - 1].y - dot.y)

            if (distSquared !== 1) {
                return
            }

            if (this.sequence[this.sequence.length - 2] === dot) {
                this.sequence.pop()
                return
            }

            this.sequence.push(dot)
        }
    }

    /**
     * Loop to request animation frames
     */
    private drawLoop() {
        this.draw()
        window.requestAnimationFrame(this.drawLoop.bind(this))
    }

    /**
     * Draw the game of Two Dots
     */
    private draw() {
        // Clear frame
        this.ctx.clearRect(0, 0, this.renderSettings.screenWidth, this.renderSettings.screenHeight)

        // Render sequence
        if (this.mouseDown && this.sequence.length > 0) {
            this.ctx.lineWidth = this.renderSettings.gridSize / 7
            this.ctx.strokeStyle = this.sequence[0].color.color
            this.ctx.lineCap = "round"
            this.ctx.lineJoin = "round"

            this.ctx.beginPath()
            this.ctx.moveTo(
                this.renderSettings.xOff + this.renderSettings.gridSize * (1 + this.sequence[0].x),
                this.renderSettings.yOff + this.renderSettings.gridSize * (1 + this.sequence[0].y),
            )
            for (let i: number = 1; i < this.sequence.length; i++) {
                this.ctx.lineTo(
                    this.renderSettings.xOff + this.renderSettings.gridSize * (1 + this.sequence[i].x),
                    this.renderSettings.yOff + this.renderSettings.gridSize * (1 + this.sequence[i].y),
                )
            }
            this.ctx.lineTo(this.mouseX, this.mouseY)
            this.ctx.stroke()
            
        }

        // Render dots
        this.dots.forEach(dots => {
            dots.forEach(dot => {
                dot.render(this.renderSettings)
            })
        })
    }

    /**
     * Starts the drawing of the game
     */
    public startDrawing(): void {
        // Start drawing
        this.drawLoop()

        const resizeCallback = () => {
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight

            // Get dimensions
            const screenWidth = this.canvas.clientWidth
            const screenHeight = this.canvas.clientHeight
            const gridSize = Math.min(screenWidth / (this.width + 1), screenHeight / (this.height + 1))
            const xOff = (screenWidth - (this.width + 1) * gridSize) / 2
            const yOff = (screenHeight - (this.height + 1) * gridSize) / 2

            this.renderSettings = {
                screenWidth, screenHeight, gridSize, xOff, yOff, context: this.ctx
            }
        }

        // Register window resize listener
        window.addEventListener("resize", resizeCallback)
        resizeCallback()

        // Register mouse events
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            this.mouseX = e.x
            this.mouseY = e.y
            this.mouseDown = e.buttons > 0
            this.dots.forEach(dots => {
                dots.forEach(dot => {
                    dot.mouseMove(e, this.renderSettings)
                })
            })
        })

        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            this.mouseDown = true
            this.sequence = []
            this.dots.forEach(dots => {
                dots.forEach(dot => {
                    dot.mouseDown()
                })
            })
        })

        this.canvas.addEventListener("mouseup", () => {
            this.mouseDown = false
        })
    }

}