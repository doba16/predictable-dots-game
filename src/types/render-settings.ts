export type RenderSettings = {
    /**
     * Width of canvas in pixels
     */
    screenWidth: number,

    /**
     * Height of screen in pixels
     */
    screenHeight: number,

    /**
     * Size of grid; this is the distance between individual dots
     */
    gridSize: number

    /**
     * Offset to center the dots horizontally
     */
    xOff: number

    /**
     * Offset to center the dots vertically
     */
    yOff: number,

    /**
     * Canvas context to render to
     */
    context: CanvasRenderingContext2D
}