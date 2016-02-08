declare module Plottable.Utils {
    class ClientToSVGTranslator {
        private static _TRANSLATOR_KEY;
        private _svg;
        private _measureRect;
        /**
         * Returns the ClientToSVGTranslator for the <svg> containing elem.
         * If one already exists on that <svg>, it will be returned; otherwise, a new one will be created.
         */
        static getTranslator(elem: SVGElement): ClientToSVGTranslator;
        constructor(svg: SVGElement);
        /**
         * Computes the position relative to the <svg> in svg-coordinate-space.
         */
        computePosition(clientX: number, clientY: number): Point;
        /**
         * Checks whether event happened inside <svg> element.
         */
        insideSVG(e: Event): boolean;
    }
}
