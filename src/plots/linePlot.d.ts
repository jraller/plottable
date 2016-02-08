declare module Plottable.Plots {
    class Line<X> extends XYPlot<X, number> {
        private _interpolator;
        private _autorangeSmooth;
        private _croppedRenderingEnabled;
        private _downsamplingEnabled;
        /**
         * A Line Plot draws line segments starting from the first data point to the next.
         *
         * @constructor
         */
        constructor();
        x(): Plots.AccessorScaleBinding<X, number>;
        x(x: number | Accessor<number>): this;
        x(x: X | Accessor<X>, xScale: Scale<X, number>): this;
        y(): Plots.AccessorScaleBinding<number, number>;
        y(y: number | Accessor<number>): this;
        y(y: number | Accessor<number>, yScale: Scale<number, number>): this;
        autorangeMode(): string;
        autorangeMode(autorangeMode: string): this;
        /**
         * Gets whether or not the autoranging is done smoothly.
         */
        autorangeSmooth(): boolean;
        /**
         * Sets whether or not the autorange is done smoothly.
         *
         * Smooth autoranging is done by making sure lines always exit on the left / right side of the plot
         * and deactivating the nice domain feature on the scales
         */
        autorangeSmooth(autorangeSmooth: boolean): this;
        private _setScaleSnapping();
        /**
         * Gets the interpolation function associated with the plot.
         *
         * @return {string | (points: Array<[number, number]>) => string)}
         */
        interpolator(): string | ((points: Array<[number, number]>) => string);
        /**
         * Sets the interpolation function associated with the plot.
         *
         * @param {string | points: Array<[number, number]>) => string} interpolator Interpolation function
         * @return Plots.Line
         */
        interpolator(interpolator: string | ((points: Array<[number, number]>) => string)): this;
        interpolator(interpolator: "linear"): this;
        interpolator(interpolator: "linear-closed"): this;
        interpolator(interpolator: "step"): this;
        interpolator(interpolator: "step-before"): this;
        interpolator(interpolator: "step-after"): this;
        interpolator(interpolator: "basis"): this;
        interpolator(interpolator: "basis-open"): this;
        interpolator(interpolator: "basis-closed"): this;
        interpolator(interpolator: "bundle"): this;
        interpolator(interpolator: "cardinal"): this;
        interpolator(interpolator: "cardinal-open"): this;
        interpolator(interpolator: "cardinal-closed"): this;
        interpolator(interpolator: "monotone"): this;
        /**
         * Gets if downsampling is enabled
         *
         * When downsampling is enabled, two consecutive lines with the same slope will be merged to one line.
         */
        downsamplingEnabled(): boolean;
        /**
         * Sets if downsampling is enabled
         *
         * @returns {Plots.Line} The calling Plots.Line
         */
        downsamplingEnabled(downsampling: boolean): this;
        /**
         * Gets if croppedRendering is enabled
         *
         * When croppedRendering is enabled, lines that will not be visible in the viewport will not be drawn.
         */
        croppedRenderingEnabled(): boolean;
        /**
         * Sets if croppedRendering is enabled
         *
         * @returns {Plots.Line} The calling Plots.Line
         */
        croppedRenderingEnabled(croppedRendering: boolean): this;
        protected _createDrawer(dataset: Dataset): Drawer;
        protected _extentsForProperty(property: string): any[];
        private _getEdgeIntersectionPoints();
        protected _getResetYFunction(): (d: any, i: number, dataset: Dataset) => number;
        protected _generateDrawSteps(): Drawers.DrawStep[];
        protected _generateAttrToProjector(): {
            [attr: string]: (datum: any, index: number, dataset: Dataset) => any;
        };
        /**
         * Returns the PlotEntity nearest to the query point by X then by Y, or undefined if no PlotEntity can be found.
         *
         * @param {Point} queryPoint
         * @returns {PlotEntity} The nearest PlotEntity, or undefined if no PlotEntity can be found.
         */
        entityNearest(queryPoint: Point): PlotEntity;
        protected _propertyProjectors(): AttributeToProjector;
        protected _constructLineProjector(xProjector: Projector, yProjector: Projector): (datum: any, index: number, dataset: Dataset) => string;
        protected _getDataToDraw(): Utils.Map<Dataset, any[]>;
        private _filterCroppedRendering(dataset, indices);
        private _filterDownsampling(dataset, indices);
    }
}
