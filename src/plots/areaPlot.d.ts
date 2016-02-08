declare module Plottable.Plots {
    class Area<X> extends Line<X> {
        private static _Y0_KEY;
        private _lineDrawers;
        private _constantBaselineValueProvider;
        /**
         * An Area Plot draws a filled region (area) between Y and Y0.
         *
         * @constructor
         */
        constructor();
        protected _setup(): void;
        y(): Plots.AccessorScaleBinding<number, number>;
        y(y: number | Accessor<number>): this;
        y(y: number | Accessor<number>, yScale: QuantitativeScale<number>): this;
        /**
         * Gets the AccessorScaleBinding for Y0.
         */
        y0(): Plots.AccessorScaleBinding<number, number>;
        /**
         * Sets Y0 to a constant number or the result of an Accessor<number>.
         * If a Scale has been set for Y, it will also be used to scale Y0.
         *
         * @param {number|Accessor<number>} y0
         * @returns {Area} The calling Area Plot.
         */
        y0(y0: number | Accessor<number>): this;
        protected _onDatasetUpdate(): void;
        addDataset(dataset: Dataset): this;
        protected _addDataset(dataset: Dataset): this;
        protected _removeDatasetNodes(dataset: Dataset): void;
        protected _additionalPaint(): void;
        private _generateLineDrawSteps();
        private _generateLineAttrToProjector();
        protected _createDrawer(dataset: Dataset): Drawers.Area;
        protected _generateDrawSteps(): Drawers.DrawStep[];
        protected _updateYScale(): void;
        protected _getResetYFunction(): Accessor<any>;
        protected _propertyProjectors(): AttributeToProjector;
        selections(datasets?: Dataset[]): d3.Selection<any>;
        protected _constructAreaProjector(xProjector: Projector, yProjector: Projector, y0Projector: Projector): (datum: any[], index: number, dataset: Dataset) => string;
    }
}
