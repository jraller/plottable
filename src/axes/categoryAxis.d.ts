declare module Plottable.Axes {
    class Category extends Axis<string> {
        private _tickLabelAngle;
        private _measurer;
        private _wrapper;
        private _writer;
        /**
         * Constructs a Category Axis.
         *
         * A Category Axis is a visual representation of a Category Scale.
         *
         * @constructor
         * @param {Scales.Category} scale
         * @param {string} [orientation="bottom"] One of "top"/"bottom"/"left"/"right".
         */
        constructor(scale: Scales.Category, orientation: string);
        protected _setup(): void;
        protected _rescale(): this;
        requestedSpace(offeredWidth: number, offeredHeight: number): SpaceRequest;
        protected _coreSize(): number;
        protected _getTickValues(): string[];
        /**
         * Gets the tick label angle in degrees.
         */
        tickLabelAngle(): number;
        /**
         * Sets the tick label angle in degrees.
         * Right now only -90/0/90 are supported. 0 is horizontal.
         *
         * @param {number} angle
         * @returns {Category} The calling Category Axis.
         */
        tickLabelAngle(angle: number): this;
        /**
         * Measures the size of the ticks while also writing them to the DOM.
         * @param {d3.Selection} ticks The tick elements to be written to.
         */
        private _drawTicks(axisWidth, axisHeight, scale, ticks);
        /**
         * Measures the size of the ticks without making any (permanent) DOM
         * changes.
         *
         * @param {string[]} ticks The strings that will be printed on the ticks.
         */
        private _measureTicks(axisWidth, axisHeight, scale, ticks);
        renderImmediately(): this;
        computeLayout(origin?: Point, availableWidth?: number, availableHeight?: number): this;
    }
}
