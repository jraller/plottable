declare module Plottable.Plots {
    class Pie extends Plot {
        private static _INNER_RADIUS_KEY;
        private static _OUTER_RADIUS_KEY;
        private static _SECTOR_VALUE_KEY;
        private _startAngles;
        private _endAngles;
        private _labelFormatter;
        private _labelsEnabled;
        private _strokeDrawers;
        /**
         * @constructor
         */
        constructor();
        protected _setup(): void;
        computeLayout(origin?: Point, availableWidth?: number, availableHeight?: number): this;
        addDataset(dataset: Dataset): this;
        protected _addDataset(dataset: Dataset): this;
        removeDataset(dataset: Dataset): this;
        protected _removeDatasetNodes(dataset: Dataset): void;
        protected _removeDataset(dataset: Dataset): this;
        selections(datasets?: Dataset[]): d3.Selection<any>;
        protected _onDatasetUpdate(): void;
        protected _createDrawer(dataset: Dataset): Drawers.Arc;
        entities(datasets?: Dataset[]): PlotEntity[];
        /**
         * Gets the AccessorScaleBinding for the sector value.
         */
        sectorValue<S>(): AccessorScaleBinding<S, number>;
        /**
         * Sets the sector value to a constant number or the result of an Accessor<number>.
         *
         * @param {number|Accessor<number>} sectorValue
         * @returns {Pie} The calling Pie Plot.
         */
        sectorValue(sectorValue: number | Accessor<number>): this;
        /**
         * Sets the sector value to a scaled constant value or scaled result of an Accessor.
         * The provided Scale will account for the values when autoDomain()-ing.
         *
         * @param {S|Accessor<S>} sectorValue
         * @param {Scale<S, number>} scale
         * @returns {Pie} The calling Pie Plot.
         */
        sectorValue<S>(sectorValue: S | Accessor<S>, scale: Scale<S, number>): this;
        /**
         * Gets the AccessorScaleBinding for the inner radius.
         */
        innerRadius<R>(): AccessorScaleBinding<R, number>;
        /**
         * Sets the inner radius to a constant number or the result of an Accessor<number>.
         *
         * @param {number|Accessor<number>} innerRadius
         * @returns {Pie} The calling Pie Plot.
         */
        innerRadius(innerRadius: number | Accessor<number>): any;
        /**
         * Sets the inner radius to a scaled constant value or scaled result of an Accessor.
         * The provided Scale will account for the values when autoDomain()-ing.
         *
         * @param {R|Accessor<R>} innerRadius
         * @param {Scale<R, number>} scale
         * @returns {Pie} The calling Pie Plot.
         */
        innerRadius<R>(innerRadius: R | Accessor<R>, scale: Scale<R, number>): any;
        /**
         * Gets the AccessorScaleBinding for the outer radius.
         */
        outerRadius<R>(): AccessorScaleBinding<R, number>;
        /**
         * Sets the outer radius to a constant number or the result of an Accessor<number>.
         *
         * @param {number|Accessor<number>} outerRadius
         * @returns {Pie} The calling Pie Plot.
         */
        outerRadius(outerRadius: number | Accessor<number>): this;
        /**
         * Sets the outer radius to a scaled constant value or scaled result of an Accessor.
         * The provided Scale will account for the values when autoDomain()-ing.
         *
         * @param {R|Accessor<R>} outerRadius
         * @param {Scale<R, number>} scale
         * @returns {Pie} The calling Pie Plot.
         */
        outerRadius<R>(outerRadius: R | Accessor<R>, scale: Scale<R, number>): this;
        /**
         * Get whether slice labels are enabled.
         *
         * @returns {boolean} Whether slices should display labels or not.
         */
        labelsEnabled(): boolean;
        /**
         * Sets whether labels are enabled.
         *
         * @param {boolean} labelsEnabled
         * @returns {Pie} The calling Pie Plot.
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
         * @returns {Pie} The calling Pie Plot.
         */
        labelFormatter(formatter: Formatter): this;
        entitiesAt(queryPoint: Point): PlotEntity[];
        protected _propertyProjectors(): AttributeToProjector;
        private _updatePieAngles();
        protected _getDataToDraw(): Utils.Map<Dataset, any[]>;
        protected static _isValidData(value: any): boolean;
        protected _pixelPoint(datum: any, index: number, dataset: Dataset): {
            x: number;
            y: number;
        };
        protected _additionalPaint(time: number): void;
        private _generateStrokeDrawSteps();
        private _sliceIndexForPoint(p);
        private _drawLabels();
    }
}
