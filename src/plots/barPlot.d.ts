declare module Plottable.Plots {
    class Bar<X, Y> extends XYPlot<X, Y> {
        static ORIENTATION_VERTICAL: string;
        static ORIENTATION_HORIZONTAL: string;
        private static _BAR_WIDTH_RATIO;
        private static _SINGLE_BAR_DIMENSION_RATIO;
        private static _BAR_AREA_CLASS;
        private static _LABEL_AREA_CLASS;
        private static _LABEL_VERTICAL_PADDING;
        private static _LABEL_HORIZONTAL_PADDING;
        private _baseline;
        private _baselineValue;
        protected _isVertical: boolean;
        private _labelFormatter;
        private _labelsEnabled;
        private _hideBarsIfAnyAreTooWide;
        private _labelConfig;
        private _baselineValueProvider;
        private _barPixelWidth;
        private _updateBarPixelWidthCallback;
        /**
         * A Bar Plot draws bars growing out from a baseline to some value
         *
         * @constructor
         * @param {string} [orientation="vertical"] One of "vertical"/"horizontal".
         */
        constructor(orientation?: string);
        x(): Plots.AccessorScaleBinding<X, number>;
        x(x: number | Accessor<number>): this;
        x(x: X | Accessor<X>, xScale: Scale<X, number>): this;
        y(): Plots.AccessorScaleBinding<Y, number>;
        y(y: number | Accessor<number>): this;
        y(y: Y | Accessor<Y>, yScale: Scale<Y, number>): this;
        /**
         * Gets the orientation of the plot
         *
         * @return "vertical" | "horizontal"
         */
        orientation(): string;
        render(): this;
        protected _createDrawer(dataset: Dataset): Drawers.Rectangle;
        protected _setup(): void;
        /**
         * Gets the baseline value.
         * The baseline is the line that the bars are drawn from.
         *
         * @returns {X|Y}
         */
        baselineValue(): X | Y;
        /**
         * Sets the baseline value.
         * The baseline is the line that the bars are drawn from.
         *
         * @param {X|Y} value
         * @returns {Bar} The calling Bar Plot.
         */
        baselineValue(value: X | Y): this;
        addDataset(dataset: Dataset): this;
        protected _addDataset(dataset: Dataset): this;
        removeDataset(dataset: Dataset): this;
        protected _removeDataset(dataset: Dataset): this;
        datasets(): Dataset[];
        datasets(datasets: Dataset[]): this;
        /**
         * Get whether bar labels are enabled.
         *
         * @returns {boolean} Whether bars should display labels or not.
         */
        labelsEnabled(): boolean;
        /**
         * Sets whether labels are enabled.
         *
         * @param {boolean} labelsEnabled
         * @returns {Bar} The calling Bar Plot.
         */
        labelsEnabled(enabled: boolean): this;
        /**
         * Gets the Formatter for the labels.
         */
        labelFormatter(): Formatter;
        /**
         * Sets the Formatter for the labels.
         *
         * @param {Formatter} formatter
         * @returns {Bar} The calling Bar Plot.
         */
        labelFormatter(formatter: Formatter): this;
        protected _createNodesForDataset(dataset: Dataset): Drawer;
        protected _removeDatasetNodes(dataset: Dataset): void;
        /**
         * Returns the PlotEntity nearest to the query point according to the following algorithm:
         *   - If the query point is inside a bar, returns the PlotEntity for that bar.
         *   - Otherwise, gets the nearest PlotEntity by the primary direction (X for vertical, Y for horizontal),
         *     breaking ties with the secondary direction.
         * Returns undefined if no PlotEntity can be found.
         *
         * @param {Point} queryPoint
         * @returns {PlotEntity} The nearest PlotEntity, or undefined if no PlotEntity can be found.
         */
        entityNearest(queryPoint: Point): PlotEntity;
        protected _entityVisibleOnPlot(pixelPoint: Point, datum: any, index: number, dataset: Dataset): boolean;
        /**
         * Gets the Entities at a particular Point.
         *
         * @param {Point} p
         * @returns {PlotEntity[]}
         */
        entitiesAt(p: Point): PlotEntity[];
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
        private _entitiesIntersecting(xValOrRange, yValOrRange);
        private _updateValueScale();
        protected _additionalPaint(time: number): void;
        /**
         * Makes sure the extent takes into account the widths of the bars
         */
        protected _extentsForProperty(property: string): any[];
        private _drawLabels();
        private _drawLabel(data, dataset);
        protected _generateDrawSteps(): Drawers.DrawStep[];
        protected _generateAttrToProjector(): {
            [attr: string]: (datum: any, index: number, dataset: Dataset) => any;
        };
        /**
         * Computes the barPixelWidth of all the bars in the plot.
         *
         * If the position scale of the plot is a CategoryScale and in bands mode, then the rangeBands function will be used.
         * If the position scale of the plot is a QuantitativeScale, then the bar width is equal to the smallest distance between
         * two adjacent data points, padded for visualisation.
         */
        protected _getBarPixelWidth(): number;
        private _updateBarPixelWidth();
        entities(datasets?: Dataset[]): PlotEntity[];
        protected _pixelPoint(datum: any, index: number, dataset: Dataset): Point;
        protected _uninstallScaleForKey(scale: Scale<any, number>, key: string): void;
        protected _getDataToDraw(): Utils.Map<Dataset, any[]>;
    }
}
