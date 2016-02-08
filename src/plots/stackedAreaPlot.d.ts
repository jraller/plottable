declare module Plottable.Plots {
    class StackedArea<X> extends Area<X> {
        private _stackingResult;
        private _stackedExtent;
        private _baseline;
        private _baselineValue;
        private _baselineValueProvider;
        /**
         * @constructor
         */
        constructor();
        croppedRenderingEnabled(): boolean;
        croppedRenderingEnabled(croppedRendering: boolean): this;
        protected _getAnimator(key: string): Animator;
        protected _setup(): void;
        x(): Plots.AccessorScaleBinding<X, number>;
        x(x: number | Accessor<number>): this;
        x(x: X | Accessor<X>, xScale: Scale<X, number>): this;
        y(): Plots.AccessorScaleBinding<number, number>;
        y(y: number | Accessor<number>): this;
        y(y: number | Accessor<number>, yScale: QuantitativeScale<number>): this;
        /**
         * Gets if downsampling is enabled
         *
         * When downsampling is enabled, two consecutive lines with the same slope will be merged to one line.
         */
        downsamplingEnabled(): boolean;
        /**
         * Sets if downsampling is enabled
         *
         * For now, downsampling is always disabled in stacked area plot
         * @returns {Plots.StackedArea} The calling Plots.StackedArea
         */
        downsamplingEnabled(downsampling: boolean): this;
        protected _additionalPaint(): void;
        protected _updateYScale(): void;
        protected _onDatasetUpdate(): this;
        protected _updateExtentsForProperty(property: string): void;
        protected _extentsForProperty(attr: string): any[];
        private _updateStackExtentsAndOffsets();
        private _checkSameDomain(datasets, keyAccessor);
        /**
         * Given an array of Datasets and the accessor function for the key, computes the
         * set reunion (no duplicates) of the domain of each Dataset. The keys are stringified
         * before being returned.
         *
         * @param {Dataset[]} datasets The Datasets for which we extract the domain keys
         * @param {Accessor<any>} keyAccessor The accessor for the key of the data
         * @return {string[]} An array of stringified keys
         */
        private static _domainKeys(datasets, keyAccessor);
        protected _propertyProjectors(): AttributeToProjector;
        protected _pixelPoint(datum: any, index: number, dataset: Dataset): Point;
    }
}
