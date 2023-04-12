import { DotColor } from "."
import { UiBarElement } from "../classes/dots-game/ui-bar-element"

export type Goal = {

    /**
     * Color of the goal.
     */
    color: DotColor

    /**
     * Amount needed to satisfy this goal.
     */
    neededAmount: number,

}

export type GoalState = {
    /**
     * Goal of this goal state
     */
    goal: Goal

    /**
     * Current amount collected by the player
     */
    currentAmount: number

    /**
     * GameObject to display goal.
     */
    gameObject: UiBarElement
}