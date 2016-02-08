declare module Plottable.Plots {
    class StackedBar<X, Y> extends Bar<X, Y> {
        private _stackingResult;
        private _stackedExtent;
        /**
         * A StackedBar Plot stacks bars across Datasets based on the primary value of the bars.
         *   On a vertical StackedBar Plot, the bars with the same X value are stacked.
         *   On a horizontal StackedBar Plot, the bars with the same Y value are stacked.
         *
         * @constructor
         * @param {Scale} xScale
         * @param {Scale} yScale
         * @param {string} [orientation="vertical"] One of "vertical"/"horizontal".
         */
        constructor(orientation?: string);
        x(): Plots.AccessorScaleBinding<X, number>;
        x(x: number | Accessor<number>): this;
        x(x: X | Accessor<X>, xScale: Scale<X, number>): this;
        y(): Plots.AccessorScaleBinding<Y, number>;
        y(y: number | Accessor<number>): this;
        y(y: Y | Accessor<Y>, yScale: Scale<Y, number>): this;
        protected _generateAttrToProjector(): {
            [attr: string]: (datum: any, index: number, dataset: Dataset) => any;
        };
        protected _onDatasetUpdate(): this;
        protected _updateExtentsForProperty(property: string): void;
        protected _extentsForProperty(attr: string): any[];
        private _updateStackExtentsAndOffsets();
    }
}
