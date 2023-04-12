import { ALL_DOT_COLORS as ALL_DOT_COLORS, DOT_COLOR_RED, DUMMY_DOT_COLOR } from "../../consts/colors"
import { GameEngine, GameObject, SequenceGameObject } from "../index"
import { GameSettings } from "../../types/game-settings"
import { RenderSettings } from "../../types/render-settings"
import { randomElement } from "../../utils/arrays"
import { Dot } from "./dot"
import { DotColor, Goal, GoalState } from "../../index"
import { UiBarElement } from "./ui-bar-element"
import MovesIcon from "../../../assets/moves.png"
import ScoreIcon from "../../../assets/score.png"
import RetryIcon from "../../../assets/retry.png"
import WinIcon from "../../../assets/win.png"
import LoseIcon from "../../../assets/lose.png"
import { IconUiBarElement } from "./icon-ui-bar-element"
import { DotUiBarElement } from "./dot-ui-bar-element"
import { EndScreen } from "./end-screen"

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

    private goals: GoalState[]

    private gameEndScreen?: EndScreen

    private dotSequence: DotColor[]
    private afterSequenceEnds: "dummy" | "random"
    private sequencePosition: number = 0

    /**
     * Height of upper ui bar
     */
    private uiSize: number

    private score: number = 0

    constructor({engine, width, height, goals, allowedMoves, afterSequenceEnds, dotSequence}: {
        engine: GameEngine,
        width: number,
        height: number,
        goals?: Goal[],
        allowedMoves: number,

        dotSequence?: DotColor[]
        afterSequenceEnds?: "dummy" | "random"
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
        this.totalMovesAllowed = allowedMoves
        

        this.sequence = new SequenceGameObject()
        this.engine.addGameObject(this.sequence)

        this.movesDisplay = new IconUiBarElement(MovesIcon, "")
        this.engine.addGameObject(this.movesDisplay)
        this.movesDisplay.height = this.uiSize
        this.movesDisplay.width = 3 * this.uiSize
        this.movesDisplay.text = this.movesRemaining.toString()
        this.movesDisplay.y = this.uiSize / 2

        this.scoreDisplay = new IconUiBarElement(ScoreIcon, "")
        this.engine.addGameObject(this.scoreDisplay)
        this.scoreDisplay.height = this.uiSize
        this.scoreDisplay.width = 3 * this.uiSize
        this.scoreDisplay.text = this.score.toString()
        this.scoreDisplay.y = this.uiSize / 2

        this.retryButton = new IconUiBarElement(RetryIcon, "")
        this.retryButton.width = this.uiSize
        this.retryButton.height = this.uiSize
        this.engine.addGameObject(this.retryButton)
        this.retryButton.hoverEffect = true
        this.retryButton.y = this.uiSize / 2
        this.retryButton.addEventListener("interactionUp", this.restartGame.bind(this))

        const goalsDefined = goals || []

        this.goals = goalsDefined.map(g => ({
            goal: g,
            currentAmount: 0,
            gameObject: new DotUiBarElement(g.color)
        }))

        // Add goals to game engine and set bounds
        this.goals.forEach(g => {
            g.gameObject.y = this.uiSize / 2
            g.gameObject.width = this.uiSize * 3
            g.gameObject.height = this.uiSize
            g.gameObject.x = 10
            this.engine.addGameObject(g.gameObject)
        })

        // Initialize dots
        this.dots = []

        this.afterSequenceEnds = afterSequenceEnds || "random"
        this.dotSequence = dotSequence || []

        this.restartGame()
    }

    private restartGame() {
        this.movesRemaining = this.totalMovesAllowed
        this.score = 0

        this.sequencePosition = 0

        this.dots.forEach(dots => {
            dots.forEach(dot => {
                if (dot) {
                    this.engine.removeGameObject(dot)
                }
            })
        })

        this.dots = []

        for (let i: number = 0; i < this.gameSettings.gridWidth; i++) {
            const arr: (Dot | undefined)[] = []
            for (let j: number = 0; j < this.gameSettings.gridHeight; j++) {
                arr.push(undefined)
            }
            this.dots.push(arr)
        }

        for (let i: number = 0; i < this.gameSettings.gridHeight; i++) {
            const arr: Dot[] = []
            for (let j: number = 0; j < this.gameSettings.gridWidth; j++) {
                const dot: Dot = new Dot({x: j, y: i, color: this.chooseColor()})
                
                dot.addEventListener("interactionDown", () => this.beginSequenceCallback(dot))
                dot.addEventListener("interactionEnter", () => this.enterDotCallback(dot))

                this.engine.addGameObject(dot)

                this.dots[j][i] = dot
            }
            this.dots.push(arr)
        }

        this.gameActive = true
        this.scoreDisplay.text = this.score.toString()
        this.movesDisplay.text = this.movesRemaining.toString()

        // Reset Goals
        this.goals.forEach(g => { 
            g.currentAmount = 0
            g.gameObject.text = g.currentAmount.toString() + "/" + g.goal.neededAmount.toString()
        })

        if (this.gameEndScreen) {
            this.engine.removeGameObject(this.gameEndScreen)
            this.gameEndScreen = undefined
        }
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

        const numberOfUiElements = 2 + this.goals.length
        const middleUiWidth = numberOfUiElements * this.uiSize * 3 + (numberOfUiElements - 1) * 0.5 * this.uiSize
        const middleUiX = (this.engine.width - middleUiWidth) / 2

        this.movesDisplay.x = middleUiX
        this.scoreDisplay.x = middleUiX + this.uiSize * 3.5

        this.goals.forEach((g, i) => {
            g.gameObject.x = middleUiX + this.uiSize * 7 + i * 3.5 * this.uiSize
        })

        if (this.gameEndScreen) {
            const dialogHeight = (this.engine.height - this.uiSize * 1.5) * 0.5



            this.gameEndScreen.x = (this.engine.width - dialogHeight * 1.5) / 2
            this.gameEndScreen.y = (this.engine.height - this.uiSize * 1.5 - dialogHeight) / 2 + this.uiSize * 1.5
            this.gameEndScreen.width = dialogHeight * 1.5
            this.gameEndScreen.height = dialogHeight
        }
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

        let addedPoints = 0

        if (isSquare) {
            for (let i = 0; i < this.gameSettings.gridWidth; i++) {
                for (let j = 0; j < this.gameSettings.gridHeight; j++) {
                    const dot = this.dots[i][j]
                    if (dot && dot.color === this.sequence.sequence[0].color) {
                        this.engine.removeGameObject(dot)
                        this.dots[i][j] = undefined
                        addedPoints++
                    }
                }
            }
        } else {
            for (const dot of this.sequence.sequence) {
                this.dots[dot.xLocation][dot.yLocation] = undefined
                this.engine.removeGameObject(dot)
            }

            addedPoints += this.sequence.sequence.length
        }
        this.score += addedPoints

        // Update goals
        this.goals.forEach(g => {
            if (g.goal.color === this.sequence.sequence[0].color) {
                g.currentAmount += addedPoints
                g.currentAmount = Math.min(g.currentAmount, g.goal.neededAmount)
                g.gameObject.text = g.currentAmount.toString() + "/" + g.goal.neededAmount.toString()
            }
        })

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

        let win = false

        this.movesRemaining--

        if (this.movesRemaining <= 0) {
            this.gameActive = false
            win = this.goals.length === 0
        }

        // Test if all goals are fulfilled
        const goalsFulfilled = this.goals.reduce((prev, g) => prev && g.currentAmount >= g.goal.neededAmount, true)
        if (goalsFulfilled && this.goals.length > 0) {
            this.gameActive = false
            win = true
        }

        this.sequence.sequence = []

        

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

            if (win) {
                this.gameEndScreen = new EndScreen(WinIcon, "Gewonnen!")
                this.engine.addGameObject(this.gameEndScreen)
            } else {
                this.gameEndScreen = new EndScreen(LoseIcon, "Verloren!")
                this.engine.addGameObject(this.gameEndScreen)
            }
        }
    }

    

    private chooseColor(excluded?: DotColor): DotColor {
        const sequenceDot = this.dotSequence[this.sequencePosition]

        let newDot: DotColor

        if (sequenceDot) {
            // If dot in sequence available, return it.
            this.sequencePosition++
            newDot = sequenceDot
        } else if (this.afterSequenceEnds === "dummy") {
            // If we fill with dummy dots, return dummy 
            newDot = DUMMY_DOT_COLOR
        } else {
            // Otherwise choose random color
            const colors = [...ALL_DOT_COLORS]
            const filteredColors = colors.filter(c => c !== excluded)
            newDot = randomElement(filteredColors)
        }

        return newDot
    }
}