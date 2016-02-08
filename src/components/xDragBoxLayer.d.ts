declare module Plottable.Components {
    class XDragBoxLayer extends DragBoxLayer {
        /**
         * An XDragBoxLayer is a DragBoxLayer whose size can only be set in the X-direction.
         * The y-values of the bounds() are always set to 0 and the height() of the XDragBoxLayer.
         *
         * @constructor
         */
        constructor();
        computeLayout(origin?: Point, availableWidth?: number, availableHeight?: number): this;
        protected _setBounds(newBounds: Bounds): void;
        protected _setResizableClasses(canResize: boolean): void;
        yScale<D extends number | {
            valueOf(): number;
        }>(): QuantitativeScale<D>;
        yScale<D extends number | {
            valueOf(): number;
        }>(yScale: QuantitativeScale<D>): this;
        yExtent(): (number | {
            valueOf(): number;
        })[];
        yExtent(yExtent: (number | {
            valueOf(): number;
        })[]): this;
    }
}
