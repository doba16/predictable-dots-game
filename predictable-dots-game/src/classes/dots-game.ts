import { ALL_DOT_COLORS as ALL_DOT_COLORS, DOT_COLOR_RED, DUMMY_DOT_COLOR } from "../consts/colors"
import { DotColor, GameEngine, SequenceGameObject } from "../index"
import { GameSettings } from "../types/game-settings"
import { RenderSettings } from "../types/render-settings"
import { randomElement } from "../utils/arrays"
import { Dot } from "./dot"

export class DotsGame {

    private engine: GameEngine
    
    private dots: (Dot | undefined)[][]

    private gameSettings: GameSettings

    private renderSettings: RenderSettings

    private sequence: SequenceGameObject

    private gameActive: boolean

    private totalMovesAllowed: number
    private movesRemaining: number

    /**
     * Height of upper ui bar
     */
    private uiSize: number

    private score: number

    constructor({engine, width, height}: {
        engine: GameEngine,
        width: number,
        height: number
    }) {
        this.engine = engine

        this.engine.addEventListener("update", this.updateRenderSettings.bind(this))
        this.engine.addEventListener("interactionUp", this.completeSequence.bind(this))

        this.gameSettings = {
            gridWidth: width,
            gridHeight: height
        }

        this.renderSettings = {
            gridSize: 0,
            xOff: 0,
            yOff: 0
        }

        // Initialize dots
        this.dots = []
        for (let i: number = 0; i < this.gameSettings.gridWidth; i++) {
            const arr: Dot[] = []
            for (let j: number = 0; j < this.gameSettings.gridHeight; j++) {
                const dot: Dot = new Dot({x: i, y: j, color: randomElement(ALL_DOT_COLORS)})
                
                dot.addEventListener("interactionDown", () => this.beginSequenceCallback(dot))
                dot.addEventListener("interactionEnter", () => this.enterDotCallback(dot))
                
                arr.push(dot)

                engine.addGameObject(dot)
            }
            this.dots.push(arr)
        }

        this.sequence = new SequenceGameObject()
        this.engine.addGameObject(this.sequence)
        
        this.uiSize = 40

        this.gameActive = true
        this.totalMovesAllowed = 30
        this.movesRemaining = this.totalMovesAllowed
        this.score = 0
    }

    /**
     * Update render settings for dots
     */
    private updateRenderSettings(): void {
        let gridSize = Math.min(this.engine.width / (this.gameSettings.gridWidth + 1), (this.engine.height - this.uiSize) / (this.gameSettings.gridHeight + 1))
        gridSize = Math.max(gridSize, 0) // make sure grid size is never negative
        const xOff = (this.engine.width - (this.gameSettings.gridWidth + 1) * gridSize) / 2
        const yOff = ((this.engine.height - this.uiSize) - (this.gameSettings.gridHeight + 1) * gridSize) / 2 + this.uiSize

        this.renderSettings.gridSize = gridSize
        this.renderSettings.xOff = xOff
        this.renderSettings.yOff = yOff

        this.dots.forEach(dots => {
            dots.forEach(dot => {
                if (dot) {
                    dot.renderSettings = this.renderSettings
                }
            })
        })

        this.sequence.renderSettings = this.renderSettings
    }

    /**
     * Callback to start a sequence
     */
    private beginSequenceCallback(dot: Dot) {
        this.sequence.sequence = [dot]
    }

    /** 
     * Callback when mouse enters a dot
     */
    private enterDotCallback(dot: Dot): void {
        if (this.engine.interactionClicked) {
            this.sequence.attemptAddDot(dot)
        }
    }

    /**
     * Draw the Dots Game
     */
    private draw() {
        // Clear frame
        /* this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

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
        this.ctx.fillText(this.score.toString(), uiPt * 87, (this.uiSize - textHeight) / 2) */
    }

    private completeSequence(): void {
        if (this.sequence.sequence.length < 2) {
            this.sequence.sequence = []
            return
        }

        const isSquare = this.sequence.isSquareMove()

        if (isSquare) {
            for (let i = 0; i < this.gameSettings.gridWidth; i++) {
                for (let j = 0; j < this.gameSettings.gridHeight; j++) {
                    const dot = this.dots[i][j]
                    if (dot && dot.color === this.sequence.sequence[0].color) {
                        this.engine.removeGameObject(dot)
                        this.dots[i][j] = undefined
                        this.score++
                    }
                }
            }
        } else {
            for (const dot of this.sequence.sequence) {
                this.dots[dot.xLocation][dot.yLocation] = undefined
                this.engine.removeGameObject(dot)
            }

            this.score += this.sequence.sequence.length
        }

        // Drop dots down
        for (let i: number = this.gameSettings.gridHeight - 1; i >= 0; i--) {
            for (let j: number = 0; j < this.gameSettings.gridWidth; j++) {
                if (this.dots[j][i] === undefined) {
                    for (let k = i - 1; k >= 0; k--) {
                        if (this.dots[j][k]) {
                            this.dots[j][i] = this.dots[j][k]
                            this.dots[j][k] = undefined

                            const replacedDot = this.dots[j][i]

                            if (replacedDot !== undefined) {
                                replacedDot.yLocation = i
                            }

                            break
                        }
                    }
                }

                // Test if dot fell down
                if (this.dots[j][i] === undefined) {
                    const dot: Dot = new Dot({x: j, y: i, color: this.chooseColor(isSquare ? this.sequence.sequence[0].color : undefined)})
                    
                    dot.addEventListener("interactionDown", () => this.beginSequenceCallback(dot))
                    dot.addEventListener("interactionEnter", () => this.enterDotCallback(dot))

                    this.dots[j][i] = dot

                    this.engine.addGameObject(dot)
                }
            }
        }

        this.sequence.sequence = []

        this.movesRemaining--
        this.gameActive = this.movesRemaining > 0
    }

    

    private chooseColor(excluded?: DotColor): DotColor {
        const colors = [...ALL_DOT_COLORS]
        const filteredColors = colors.filter(c => c !== excluded)
        return randomElement(filteredColors)
    }
}