import { ALL_DOT_COLORS as ALL_DOT_COLORS, DOT_COLOR_RED, DUMMY_DOT_COLOR } from "../consts/colors"
import { DotColor } from "../index"
import { RenderSettings } from "../types/render-settings"
import { randomElement } from "../utils/arrays"
import { Dot } from "./dot"

export class DotsGame {

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    private dots: (Dot | undefined)[][]

    private width: number
    private height: number

    private renderSettings: RenderSettings

    private sequence: Dot[]

    private mouseDown: boolean
    private mouseX: number
    private mouseY: number

    private gameActive: boolean

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
                const dot: Dot = new Dot({x: i, y: j, color: randomElement(ALL_DOT_COLORS)})
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

        this.gameActive = true
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

            // Do not allow connection of dummy dots
            if (this.sequence[0].color === DUMMY_DOT_COLOR) {
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
     * Draw the Dots Game
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
                dot && dot.render(this.renderSettings)
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

            if (!this.mouseDown) {
                this.completeSequence()
            }

            this.dots.forEach(dots => {
                dots.forEach(dot => {
                    dot && dot.mouseMove(e, this.renderSettings)
                })
            })
        })

        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            this.mouseDown = true
            this.sequence = []
            this.dots.forEach(dots => {
                dots.forEach(dot => {
                    dot && dot.mouseDown()
                })
            })
        })

        this.canvas.addEventListener("mouseup", () => {
            this.mouseDown = false
            this.completeSequence()
        })
    }

    private completeSequence(): void {
        if (this.sequence.length < 2) {
            return
        }

        const isSquare = this.testIfSquare()

        if (isSquare) {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    if (this.dots[i][j]?.color === this.sequence[0].color) {
                        this.dots[i][j] = undefined
                    }
                }
            }
        } else {
            for (const dot of this.sequence) {
                this.dots[dot.x][dot.y] = undefined
            }
        }

        // Drop dots down
        for (let i: number = this.height - 1; i >= 0; i--) {
            for (let j: number = 0; j < this.width; j++) {
                if (this.dots[j][i] === undefined) {
                    for (let k = i - 1; k >= 0; k--) {
                        if (this.dots[j][k]) {
                            this.dots[j][i] = this.dots[j][k]
                            this.dots[j][k] = undefined

                            const replacedDot = this.dots[j][i]

                            if (replacedDot !== undefined) {
                                replacedDot.y = i
                            }

                            break
                        }
                    }
                }

                // Test if dot fell down
                if (this.dots[j][i] === undefined) {
                    const dot: Dot = new Dot({x: j, y: i, color: this.chooseColor(isSquare ? this.sequence[0].color : undefined)})
                    dot.sequenceBeginCallback = this.beginSequenceCallback.bind(this)
                    dot.mouseEnterCallback = this.enterDotCallback.bind(this)

                    this.dots[j][i] = dot
                }
            }
        }

        this.sequence = []
    }

    private testIfSquare(): boolean {
        for (let i = 0; i < this.sequence.length; i++) {
            for (let j = i + 1; j < this.sequence.length; j++) {
                if (this.sequence[i] === this.sequence[j]) {
                    return true
                }
            }
        }
        return false
    }

    private chooseColor(excluded?: DotColor): DotColor {
        const colors = [...ALL_DOT_COLORS]
        const filteredColors = colors.filter(c => c !== excluded)
        return randomElement(filteredColors)
    }
}