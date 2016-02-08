declare module Plottable.Utils.Window {
    /**
     * Print a warning message to the console, if it is available.
     *
     * @param {string} The warnings to print
     */
    function warn(warning: string): void;
    /**
     * Is like setTimeout, but activates synchronously if time=0
     * We special case 0 because of an observed issue where calling setTimeout causes visible flickering.
     * We believe this is because when requestAnimationFrame calls into the paint function, as soon as that function finishes
     * evaluating, the results are painted to the screen. As a result, if we want something to occur immediately but call setTimeout
     * with time=0, then it is pushed to the call stack and rendered in the next frame, so the component that was rendered via
     * setTimeout appears out-of-sync with the rest of the plot.
     */
    function setTimeout(f: Function, time: number, ...args: any[]): number;
    /**
     * Sends a deprecation warning to the console. The warning includes the name of the deprecated method,
     * version number of the deprecation, and an optional message.
     *
     * To be used in the first line of a deprecated method.
     *
     * @param {string} callingMethod The name of the method being deprecated
     * @param {string} version The version when the tagged method became obsolete
     * @param {string?} message Optional message to be shown with the warning
     */
    function deprecated(callingMethod: string, version: string, message?: string): void;
}
