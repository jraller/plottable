declare module Plottable.Scales {
    class Category extends Scale<string, number> {
        private _d3Scale;
        private _range;
        private _innerPadding;
        private _outerPadding;
        /**
         * A Category Scale maps strings to numbers.
         *
         * @constructor
         */
        constructor();
        extentOfValues(values: string[]): string[];
        protected _getExtent(): string[];
        domain(): string[];
        domain(values: string[]): this;
        protected _setDomain(values: string[]): void;
        range(): [number, number];
        range(values: [number, number]): this;
        private static _convertToPlottableInnerPadding(d3InnerPadding);
        private static _convertToPlottableOuterPadding(d3OuterPadding, d3InnerPadding);
        /**
         * Returns the width of the range band.
         *
         * @returns {number} The range band width
         */
        rangeBand(): number;
        /**
         * Returns the step width of the scale.
         *
         * The step width is the pixel distance between adjacent values in the domain.
         *
         * @returns {number}
         */
        stepWidth(): number;
        /**
         * Gets the inner padding.
         *
         * The inner padding is defined as the padding in between bands on the scale,
         * expressed as a multiple of the rangeBand().
         *
         * @returns {number}
         */
        innerPadding(): number;
        /**
         * Sets the inner padding.
         *
         * The inner padding is defined as the padding in between bands on the scale,
         * expressed as a multiple of the rangeBand().
         *
         * @returns {Category} The calling Category Scale.
         */
        innerPadding(innerPadding: number): this;
        /**
         * Gets the outer padding.
         *
         * The outer padding is the padding in between the outer bands and the edges of the range,
         * expressed as a multiple of the rangeBand().
         *
         * @returns {number}
         */
        outerPadding(): number;
        /**
         * Sets the outer padding.
         *
         * The outer padding is the padding in between the outer bands and the edges of the range,
         * expressed as a multiple of the rangeBand().
         *
         * @returns {Category} The calling Category Scale.
         */
        outerPadding(outerPadding: number): this;
        scale(value: string): number;
        protected _getDomain(): string[];
        protected _setBackingScaleDomain(values: string[]): void;
        protected _getRange(): number[];
        protected _setRange(values: number[]): void;
    }
}
