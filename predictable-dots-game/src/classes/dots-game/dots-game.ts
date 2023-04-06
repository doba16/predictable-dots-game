import { ALL_DOT_COLORS as ALL_DOT_COLORS, DOT_COLOR_RED, DUMMY_DOT_COLOR } from "../../consts/colors"
import { GameEngine, GameObject, SequenceGameObject } from "../index"
import { GameSettings } from "../../types/game-settings"
import { RenderSettings } from "../../types/render-settings"
import { randomElement } from "../../utils/arrays"
import { Dot } from "./dot"
import { DotColor } from "../../index"
import { UiBarElement } from "./ui-bar-element"
import MovesIcon from "../../../assets/moves.png"
import ScoreIcon from "../../../assets/score.png"
import RetryIcon from "../../../assets/retry.png"

export class DotsGame {

    private engine: GameEngine
    
    private dots: (Dot | undefined)[][]

    private gameSettings: GameSettings

    private renderSettings: RenderSettings

    private sequence: SequenceGameObject

    private movesDisplay: UiBarElement
    private scoreDisplay: UiBarElement
    private retryButton: UiBarElement

    private gameActive: boolean = true

    private totalMovesAllowed: number
    private movesRemaining: number = 0

    /**
     * Height of upper ui bar
     */
    private uiSize: number

    private score: number = 0

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

        this.uiSize = 40
        this.totalMovesAllowed = 30
        

        this.sequence = new SequenceGameObject()
        this.engine.addGameObject(this.sequence)

        this.movesDisplay = new UiBarElement(MovesIcon, "")
        this.engine.addGameObject(this.movesDisplay)
        this.movesDisplay.height = this.uiSize
        this.movesDisplay.width = 3 * this.uiSize
        this.movesDisplay.text = this.movesRemaining.toString()
        this.movesDisplay.y = this.uiSize / 2

        this.scoreDisplay = new UiBarElement(ScoreIcon, "")
        this.engine.addGameObject(this.scoreDisplay)
        this.scoreDisplay.height = this.uiSize
        this.scoreDisplay.width = 3 * this.uiSize
        this.scoreDisplay.text = this.score.toString()
        this.scoreDisplay.y = this.uiSize / 2

        this.retryButton = new UiBarElement(RetryIcon, "")
        this.retryButton.width = this.uiSize
        this.retryButton.height = this.uiSize
        this.engine.addGameObject(this.retryButton)
        this.retryButton.hoverEffect = true
        this.retryButton.y = this.uiSize / 2
        this.retryButton.addEventListener("interactionUp", this.restartGame.bind(this))

        // Initialize dots
        this.dots = []

        this.restartGame()
    }

    private restartGame() {
        this.movesRemaining = this.totalMovesAllowed
        this.score = 0

        this.dots.forEach(dots => {
            dots.forEach(dot => {
                if (dot) {
                    this.engine.removeGameObject(dot)
                }
            })
        })

        this.dots = []

        for (let i: number = 0; i < this.gameSettings.gridWidth; i++) {
            const arr: Dot[] = []
            for (let j: number = 0; j < this.gameSettings.gridHeight; j++) {
                const dot: Dot = new Dot({x: i, y: j, color: randomElement(ALL_DOT_COLORS)})
                
                dot.addEventListener("interactionDown", () => this.beginSequenceCallback(dot))
                dot.addEventListener("interactionEnter", () => this.enterDotCallback(dot))
                
                arr.push(dot)

                this.engine.addGameObject(dot)
            }
            this.dots.push(arr)
        }

        this.gameActive = true
        this.scoreDisplay.text = this.score.toString()
        this.movesDisplay.text = this.movesRemaining.toString()
    }

    /**
     * Update render settings for dots
     */
    private updateRenderSettings(): void {
        let gridSize = Math.min(this.engine.width / (this.gameSettings.gridWidth + 1), (this.engine.height - this.uiSize * 1.5) / (this.gameSettings.gridHeight + 1))
        gridSize = Math.max(gridSize, 0) // make sure grid size is never negative
        const xOff = (this.engine.width - (this.gameSettings.gridWidth + 1) * gridSize) / 2
        const yOff = ((this.engine.height - this.uiSize * 1.5) - (this.gameSettings.gridHeight + 1) * gridSize) / 2 + this.uiSize * 1.5

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

        this.retryButton.x = this.engine.width - this.retryButton.width - this.uiSize / 2

        const numberOfUiElements = 2
        const middleUiWidth = numberOfUiElements * this.uiSize * 3 + (numberOfUiElements - 1) * 0.5 * this.uiSize
        const middleUiX = (this.engine.width - middleUiWidth) / 2

        this.movesDisplay.x = middleUiX
        this.scoreDisplay.x = middleUiX + this.uiSize * 3.5
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

        this.movesDisplay.text = this.movesRemaining.toString()
        this.scoreDisplay.text = this.score.toString()

        if (!this.gameActive) {
            this.dots.forEach(dots => {
                dots.forEach(dot => {
                    if (dot) {
                        dot.disabled = true
                    }
                })
            })
        }
    }

    

    private chooseColor(excluded?: DotColor): DotColor {
        const colors = [...ALL_DOT_COLORS]
        const filteredColors = colors.filter(c => c !== excluded)
        return randomElement(filteredColors)
    }
}