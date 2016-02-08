declare module Plottable.Utils.Math {
    /**
     * Checks if x is between a and b.
     *
     * @param {number} x The value to test if in range
     * @param {number} a The beginning of the (inclusive) range
     * @param {number} b The ending of the (inclusive) range
     * @return {boolean} Whether x is in [a, b]
     */
    function inRange(x: number, a: number, b: number): boolean;
    /**
     * Clamps x to the range [min, max].
     *
     * @param {number} x The value to be clamped.
     * @param {number} min The minimum value.
     * @param {number} max The maximum value.
     * @return {number} A clamped value in the range [min, max].
     */
    function clamp(x: number, min: number, max: number): number;
    /**
     * Applies the accessor, if provided, to each element of `array` and returns the maximum value.
     * If no maximum value can be computed, returns defaultValue.
     */
    function max<C>(array: C[], defaultValue: C): C;
    function max<T, C>(array: T[], accessor: (t?: T, i?: number) => C, defaultValue: C): C;
    /**
     * Applies the accessor, if provided, to each element of `array` and returns the minimum value.
     * If no minimum value can be computed, returns defaultValue.
     */
    function min<C>(array: C[], defaultValue: C): C;
    function min<T, C>(array: T[], accessor: (t?: T, i?: number) => C, defaultValue: C): C;
    /**
     * Returns true **only** if x is NaN
     */
    function isNaN(n: any): boolean;
    /**
     * Returns true if the argument is a number, which is not NaN
     * Numbers represented as strings do not pass this function
     */
    function isValidNumber(n: any): boolean;
    /**
     * Generates an array of consecutive, strictly increasing numbers
     * in the range [start, stop) separeted by step
     */
    function range(start: number, stop: number, step?: number): number[];
    /**
     * Returns the square of the distance between two points
     *
     * @param {Point} p1
     * @param {Point} p2
     * @return {number} dist(p1, p2)^2
     */
    function distanceSquared(p1: Point, p2: Point): number;
    function degreesToRadians(degree: number): number;
}
