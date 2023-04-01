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

    private totalMovesAllowed: number
    private movesRemaining: number

    /**
     * Height of upper ui bar
     */
    private uiSize: number

    private score: number

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

        this.uiSize = 40

        this.gameActive = true
        this.totalMovesAllowed = 30
        this.movesRemaining = this.totalMovesAllowed
        this.score = 0
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // Render UI
        this.ctx.fillStyle = "#7775"
        this.ctx.fillRect(0, 0, this.canvas.width, this.uiSize)

        const uiPt = this.uiSize / 25

        const textHeight = uiPt * 16
        this.ctx.font = `${textHeight}px system-ui`

        // Render remaining moves
        this.ctx.fillStyle = "red"

        this.ctx.beginPath()
        this.ctx.ellipse(uiPt * 10, uiPt * 7.5, uiPt * 3, uiPt * 3, 0, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.beginPath()
        this.ctx.ellipse(uiPt * 10, uiPt * 17.5, uiPt * 3, uiPt * 3, 0, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.beginPath()
        this.ctx.ellipse(uiPt * 20, uiPt * 17.5, uiPt * 3, uiPt * 3, 0, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.strokeStyle = "red"
        this.ctx.lineWidth = uiPt

        this.ctx.beginPath()
        this.ctx.moveTo(uiPt * 10, uiPt * 7.5)
        this.ctx.lineTo(uiPt * 10, uiPt * 17.5)
        this.ctx.lineTo(uiPt * 20, uiPt * 17.5)
        this.ctx.stroke()

        this.ctx.fillStyle = "green"

        this.ctx.beginPath()
        this.ctx.ellipse(uiPt * 20, uiPt * 7.5, uiPt * 3, uiPt * 3, 0, 0, Math.PI * 2)
        this.ctx.fill()


        // Render score
        this.ctx.fillStyle = "red"

        this.ctx.beginPath()
        this.ctx.ellipse(uiPt * 70, uiPt * 7.5, uiPt * 3, uiPt * 3, 0, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.fillStyle = "blue"

        this.ctx.beginPath()
        this.ctx.ellipse(uiPt * 70, uiPt * 17.5, uiPt * 3, uiPt * 3, 0, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.fillStyle = "green"

        this.ctx.beginPath()
        this.ctx.ellipse(uiPt * 80, uiPt * 7.5, uiPt * 3, uiPt * 3, 0, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.fillStyle = "purple"

        this.ctx.beginPath()
        this.ctx.ellipse(uiPt * 80, uiPt * 17.5, uiPt * 3, uiPt * 3, 0, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.fillStyle = "currentColor"
        this.ctx.textBaseline = "top"
        this.ctx.fillText(this.movesRemaining.toString(), uiPt * 27, (this.uiSize - textHeight) / 2)
        this.ctx.fillText(this.score.toString(), uiPt * 87, (this.uiSize - textHeight) / 2)

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
            const screenHeight = this.canvas.clientHeight - this.uiSize
            const gridSize = Math.min(screenWidth / (this.width + 1), screenHeight / (this.height + 1))
            const xOff = (screenWidth - (this.width + 1) * gridSize) / 2
            const yOff = (screenHeight - (this.height + 1) * gridSize) / 2 + this.uiSize

            this.renderSettings = {
                screenWidth, screenHeight, gridSize, xOff, yOff, context: this.ctx
            }
        }

        // Register resize observer
        new ResizeObserver(resizeCallback).observe(this.canvas)
        resizeCallback()

        const moveEventListener = (mouseX: number, mouseY: number, mouseDown: boolean) => {
            if (!this.gameActive) {
                return
            }

            this.mouseX = mouseX
            this.mouseY = mouseY
            this.mouseDown = mouseDown

            if (!this.mouseDown) {
                this.completeSequence()
            }

            this.dots.forEach(dots => {
                dots.forEach(dot => {
                    dot && dot.mouseMove(mouseX, mouseY, this.renderSettings)
                })
            })
        }

        // Register mouse events
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            moveEventListener(e.offsetX, e.offsetY, e.buttons > 0)
        })
        this.canvas.addEventListener("touchmove", (e: TouchEvent) => {
            e.preventDefault()
            if (e.touches.length > 0) {
                const xOff = this.canvas.getBoundingClientRect().left
                const yOff = this.canvas.getBoundingClientRect().top
                moveEventListener(e.touches[0].pageX - xOff, e.touches[0].clientY - yOff, true)
            }
        })

        const downEventListener = (mouseX: number, mouseY: number) => {
            if (!this.gameActive) {
                return
            }

            this.mouseDown = true
            this.sequence = []
            this.dots.forEach(dots => {
                dots.forEach(dot => {
                    dot && dot.mouseMove(mouseX, mouseY, this.renderSettings)
                    dot && dot.mouseDown()
                })
            })
        }

        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            downEventListener(e.offsetX, e.offsetY)
        })
        this.canvas.addEventListener("touchstart", (e: TouchEvent) => {
            e.preventDefault()
            if (e.touches.length > 0) {
                const xOff = this.canvas.getBoundingClientRect().left
                const yOff = this.canvas.getBoundingClientRect().top
                moveEventListener(e.touches[0].clientX - xOff, e.touches[0].clientY - yOff, false)
                downEventListener(e.touches[0].clientX - xOff, e.touches[0].clientY - yOff)
            }
        })

        const upEventListener = () => {
            if (!this.gameActive) {
                return
            }

            this.mouseDown = false
            this.completeSequence()
        }

        this.canvas.addEventListener("mouseup", () => {
            upEventListener()
        })
        this.canvas.addEventListener("touchend", (e: TouchEvent) => {
            e.preventDefault()
            upEventListener()
            moveEventListener(0, 0, false)
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
                        this.score++
                    }
                }
            }
        } else {
            for (const dot of this.sequence) {
                this.dots[dot.x][dot.y] = undefined
            }

            this.score += this.sequence.length
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

        this.movesRemaining--
        this.gameActive = this.movesRemaining > 0
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