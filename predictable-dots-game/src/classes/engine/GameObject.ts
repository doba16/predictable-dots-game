export interface GameObject {

    /**
     * Draws the game object.
     */
    draw(context: CanvasRenderingContext2D, width: number, height: number): void

    /**
     * Called to update the interaction
     * @param interactionX horizontal coordinate of the interaction
     * @param interactionY vertical coordinate of the interaction
     * @param interactionClicked if interaction is clicked or not
     */
    updateInteraction(interactionX: number, interactionY: number, interactionClicked: boolean): void

    /**
     * Called to update the object
     */
    update(width: number, height: number): void

}