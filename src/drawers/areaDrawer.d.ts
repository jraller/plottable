declare module Plottable.Drawers {
    class Area extends Drawer {
        constructor(dataset: Dataset);
        protected _applyDefaultAttributes(selection: d3.Selection<any>): void;
        selectionForIndex(index: number): d3.Selection<any>;
    }
}