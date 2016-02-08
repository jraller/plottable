declare module Plottable.Plots {
    class Scatter<X, Y> extends XYPlot<X, Y> {
        private static _SIZE_KEY;
        private static _SYMBOL_KEY;
        private _labelsEnabled;
        private _label;
        /**
         * A Scatter Plot draws a symbol at each data point.
         *
         * @constructor
         */
        constructor();
        protected _createDrawer(dataset: Dataset): Drawers.Symbol;
        /**
         * Gets the AccessorScaleBinding for the size property of the plot.
         * The size property corresponds to the area of the symbol.
         */
        size<S>(): AccessorScaleBinding<S, number>;
        /**
         * Sets the size property to a constant number or the result of an Accessor<number>.
         *
         * @param {number|Accessor<number>} size
         * @returns {Plots.Scatter} The calling Scatter Plot.
         */
        size(size: number | Accessor<number>): this;
        /**
         * Sets the size property to a scaled constant value or scaled result of an Accessor.
         * The provided Scale will account for the values when autoDomain()-ing.
         *
         * @param {S|Accessor<S>} sectorValue
         * @param {Scale<S, number>} scale
         * @returns {Plots.Scatter} The calling Scatter Plot.
         */
        size<S>(size: S | Accessor<S>, scale: Scale<S, number>): this;
        /**
         * Gets the AccessorScaleBinding for the symbol property of the plot.
         * The symbol property corresponds to how the symbol will be drawn.
         */
        symbol(): AccessorScaleBinding<any, any>;
        /**
         * Sets the symbol property to an Accessor<SymbolFactory>.
         *
         * @param {Accessor<SymbolFactory>} symbol
         * @returns {Plots.Scatter} The calling Scatter Plot.
         */
        symbol(symbol: Accessor<SymbolFactory>): this;
        protected _generateAttrToProjector(): {
            [attr: string]: (datum: any, index: number, dataset: Dataset) => any;
        };
        protected _generateDrawSteps(): Drawers.DrawStep[];
        protected _entityVisibleOnPlot(pixelPoint: Point, datum: any, index: number, dataset: Dataset): boolean;
        protected _propertyProjectors(): AttributeToProjector;
        /**
         * Gets the Entities that intersect the Bounds.
         *
         * @param {Bounds} bounds
         * @returns {PlotEntity[]}
         */
        entitiesIn(bounds: Bounds): PlotEntity[];
        /**
         * Gets the Entities that intersect the area defined by the ranges.
         *
         * @param {Range} xRange
         * @param {Range} yRange
         * @returns {PlotEntity[]}
         */
        entitiesIn(xRange: Range, yRange: Range): PlotEntity[];
        private _entityBBox(datum, index, dataset, attrToProjector);
        /**
         * Gets the Entities at a particular Point.
         *
         * @param {Point} p
         * @returns {PlotEntity[]}
         */
        entitiesAt(p: Point): PlotEntity[];
        /**
         * Gets the accessor for labels.
         *
         * @returns {Accessor<string>}
         */
        label(): Accessor<string>;
        /**
         * Sets the text of labels to the result of an Accessor.
         *
         * @param {Accessor<string>} label
         * @returns {Plots.Rectangle} The calling Rectangle Plot.
         */
        label(label: Accessor<string>): Plots.Rectangle<X, Y>;
        /**
         * Gets whether labels are enabled.
         *
         * @returns {boolean}
         */
        labelsEnabled(): boolean;
        /**
         * Sets whether labels are enabled.
         * Labels too big to be contained in the rectangle, cut off by edges, or blocked by other rectangles will not be shown.
         *
         * @param {boolean} labelsEnabled
         * @returns {Rectangle} The calling Rectangle Plot.
         */
        labelsEnabled(enabled: boolean): Plots.Rectangle<X, Y>;
        protected _additionalPaint(time: number): void;
        private _drawLabels();
        private _drawLabel(dataToDraw, dataset, datasetIndex);
        private _overlayLabel(labelXRange, labelYRange, datumIndex, datasetIndex, dataToDraw);
    }
}
