declare module Plottable.Plots {
    class Segment<X, Y> extends XYPlot<X, Y> {
        private static _X2_KEY;
        private static _Y2_KEY;
        /**
         * A Segment Plot displays line segments based on the data.
         *
         * @constructor
         */
        constructor();
        protected _createDrawer(dataset: Dataset): Drawers.Segment;
        protected _generateDrawSteps(): Drawers.DrawStep[];
        protected _updateExtentsForProperty(property: string): void;
        protected _filterForProperty(property: string): (datum: any, index: number, dataset: Dataset) => boolean;
        /**
         * Gets the AccessorScaleBinding for X
         */
        x(): AccessorScaleBinding<X, number>;
        /**
         * Sets X to a constant value or the result of an Accessor.
         *
         * @param {X|Accessor<X>} x
         * @returns {Plots.Segment} The calling Segment Plot.
         */
        x(x: number | Accessor<number>): this;
        /**
         * Sets X to a scaled constant value or scaled result of an Accessor.
         * The provided Scale will account for the values when autoDomain()-ing.
         *
         * @param {X|Accessor<X>} x
         * @param {Scale<X, number>} xScale
         * @returns {Plots.Segment} The calling Segment Plot.
         */
        x(x: X | Accessor<X>, xScale: Scale<X, number>): this;
        /**
         * Gets the AccessorScaleBinding for X2
         */
        x2(): AccessorScaleBinding<X, number>;
        /**
         * Sets X2 to a constant number or the result of an Accessor.
         * If a Scale has been set for X, it will also be used to scale X2.
         *
         * @param {number|Accessor<number>|Y|Accessor<Y>} y2
         * @returns {Plots.Segment} The calling Segment Plot
         */
        x2(x2: number | Accessor<number> | X | Accessor<X>): this;
        /**
         * Gets the AccessorScaleBinding for Y
         */
        y(): AccessorScaleBinding<Y, number>;
        /**
         * Sets Y to a constant value or the result of an Accessor.
         *
         * @param {Y|Accessor<Y>} y
         * @returns {Plots.Segment} The calling Segment Plot.
         */
        y(y: number | Accessor<number>): this;
        /**
         * Sets Y to a scaled constant value or scaled result of an Accessor.
         * The provided Scale will account for the values when autoDomain()-ing.
         *
         * @param {Y|Accessor<Y>} y
         * @param {Scale<Y, number>} yScale
         * @returns {Plots.Segment} The calling Segment Plot.
         */
        y(y: Y | Accessor<Y>, yScale: Scale<Y, number>): this;
        /**
         * Gets the AccessorScaleBinding for Y2.
         */
        y2(): AccessorScaleBinding<Y, number>;
        /**
         * Sets Y2 to a constant number or the result of an Accessor.
         * If a Scale has been set for Y, it will also be used to scale Y2.
         *
         * @param {number|Accessor<number>|Y|Accessor<Y>} y2
         * @returns {Plots.Segment} The calling Segment Plot.
         */
        y2(y2: number | Accessor<number> | Y | Accessor<Y>): this;
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
        private _entitiesIntersecting(xRange, yRange);
        private _lineIntersectsBox(entity, xRange, yRange, attrToProjector);
        private _lineIntersectsSegment(point1, point2, point3, point4);
    }
}
