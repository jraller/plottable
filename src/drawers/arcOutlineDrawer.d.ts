declare module Plottable.Drawers {
    class ArcOutline extends Drawer {
        constructor(dataset: Dataset);
        protected _applyDefaultAttributes(selection: d3.Selection<any>): void;
    }
}
