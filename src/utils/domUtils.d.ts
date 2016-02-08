declare module Plottable.Utils.DOM {
    /**
     * Gets the bounding box of an element.
     * @param {d3.Selection} element
     * @returns {SVGRed} The bounding box.
     */
    function elementBBox(element: d3.Selection<any>): SVGRect;
    /**
     * Screen refresh rate which is assumed to be 60fps
     */
    var SCREEN_REFRESH_RATE_MILLISECONDS: number;
    /**
     * Polyfill for `window.requestAnimationFrame`.
     * If the function exists, then we use the function directly.
     * Otherwise, we set a timeout on `SCREEN_REFRESH_RATE_MILLISECONDS` and then perform the function.
     *
     * @param {() => void} callback The callback to call in the next animation frame
     */
    function requestAnimationFramePolyfill(callback: () => void): void;
    /**
     * Calculates the width of the element.
     * The width includes the padding and the border on the element's left and right sides.
     *
     * @param {Element} element The element to query
     * @returns {number} The width of the element.
     */
    function elementWidth(element: Element): number;
    /**
     * Calculates the height of the element.
     * The height includes the padding the and the border on the element's top and bottom sides.
     *
     * @param {Element} element The element to query
     * @returns {number} The height of the element
     */
    function elementHeight(element: Element): number;
    /**
     * Retrieves the number array representing the translation for the selection
     *
     * @param {d3.Selection<any>} selection The selection to query
     * @returns {[number, number]} The number array representing the translation
     */
    function translate(selection: d3.Selection<any>): [number, number];
    /**
     * Translates the given selection by the input x / y pixel amounts.
     *
     * @param {d3.Selection<any>} selection The selection to translate
     * @param {number} x The amount to translate in the x direction
     * @param {number} y The amount to translate in the y direction
     * @returns {d3.Selection<any>} The input selection
     */
    function translate(selection: d3.Selection<any>, x: number, y: number): d3.Selection<any>;
    /**
     * Checks if the first ClientRect overlaps the second.
     *
     * @param {ClientRect} clientRectA The first ClientRect
     * @param {ClientRect} clientRectB The second ClientRect
     * @returns {boolean} If the ClientRects overlap each other.
     */
    function clientRectsOverlap(clientRectA: ClientRect, clientRectB: ClientRect): boolean;
    /**
     * Returns true if and only if innerClientRect is inside outerClientRect.
     *
     * @param {ClientRect} innerClientRect The first ClientRect
     * @param {ClientRect} outerClientRect The second ClientRect
     * @returns {boolean} If and only if the innerClientRect is inside outerClientRect.
     */
    function clientRectInside(innerClientRect: ClientRect, outerClientRect: ClientRect): boolean;
    /**
     * Retrieves the bounding svg of the input element
     *
     * @param {SVGElement} element The element to query
     * @returns {SVGElement} The bounding svg
     */
    function boundingSVG(element: SVGElement): SVGElement;
    /**
     * Generates a ClipPath ID that is unique for this instance of Plottable
     */
    function generateUniqueClipPathId(): string;
    /**
     * Returns true if the supplied coordinates or Ranges intersect or are contained by bbox.
     *
     * @param {number | Range} xValOrRange The x coordinate or Range to test
     * @param {number | Range} yValOrRange The y coordinate or Range to test
     * @param {SVGRect} bbox The bbox
     * @param {number} tolerance Amount by which to expand bbox, in each dimension, before
     * testing intersection
     *
     * @returns {boolean} True if the supplied coordinates or Ranges intersect or are
     * contained by bbox, false otherwise.
     */
    function intersectsBBox(xValOrRange: number | Range, yValOrRange: number | Range, bbox: SVGRect, tolerance?: number): boolean;
}
