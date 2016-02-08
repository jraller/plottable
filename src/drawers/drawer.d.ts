declare module Plottable {
    module Drawers {
        /**
         * A step for the drawer to draw.
         *
         * Specifies how AttributeToProjector needs to be animated.
         */
        type DrawStep = {
            attrToProjector: AttributeToProjector;
            animator: Animator;
        };
        /**
         * A DrawStep that carries an AttributeToAppliedProjector map.
         */
        type AppliedDrawStep = {
            attrToAppliedProjector: AttributeToAppliedProjector;
            animator: Animator;
        };
    }
    class Drawer {
        private _renderArea;
        protected _svgElementName: string;
        protected _className: string;
        private _dataset;
        private _cachedSelectionValid;
        private _cachedSelection;
        /**
         * A Drawer draws svg elements based on the input Dataset.
         *
         * @constructor
         * @param {Dataset} dataset The dataset associated with this Drawer
         */
        constructor(dataset: Dataset);
        /**
         * Retrieves the renderArea selection for the Drawer.
         */
        renderArea(): d3.Selection<void>;
        /**
         * Sets the renderArea selection for the Drawer.
         *
         * @param {d3.Selection} Selection containing the <g> to render to.
         * @returns {Drawer} The calling Drawer.
         */
        renderArea(area: d3.Selection<void>): this;
        /**
         * Removes the Drawer and its renderArea
         */
        remove(): void;
        /**
         * Binds data to selection
         *
         * @param{any[]} data The data to be drawn
         */
        private _bindSelectionData(data);
        protected _applyDefaultAttributes(selection: d3.Selection<any>): void;
        /**
         * Draws data using one step
         *
         * @param{AppliedDrawStep} step The step, how data should be drawn.
         */
        private _drawStep(step);
        private _appliedProjectors(attrToProjector);
        /**
         * Calculates the total time it takes to use the input drawSteps to draw the input data
         *
         * @param {any[]} data The data that would have been drawn
         * @param {Drawers.DrawStep[]} drawSteps The DrawSteps to use
         * @returns {number} The total time it takes to draw
         */
        totalDrawTime(data: any[], drawSteps: Drawers.DrawStep[]): number;
        /**
         * Draws the data into the renderArea using the spefic steps and metadata
         *
         * @param{any[]} data The data to be drawn
         * @param{DrawStep[]} drawSteps The list of steps, which needs to be drawn
         */
        draw(data: any[], drawSteps: Drawers.DrawStep[]): this;
        selection(): d3.Selection<any>;
        /**
         * Returns the CSS selector for this Drawer's visual elements.
         */
        selector(): string;
        /**
         * Returns the D3 selection corresponding to the datum with the specified index.
         */
        selectionForIndex(index: number): d3.Selection<any>;
    }
}
