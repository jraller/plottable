declare module Plottable.Plots {
    interface PlotEntity extends Entity<Plot> {
        dataset: Dataset;
        index: number;
        component: Plot;
    }
    interface AccessorScaleBinding<D, R> {
        accessor: Accessor<any>;
        scale?: Scale<D, R>;
    }
    module Animator {
        var MAIN: string;
        var RESET: string;
    }
}
declare module Plottable {
    class Plot extends Component {
        protected static _ANIMATION_MAX_DURATION: number;
        private _dataChanged;
        private _datasetToDrawer;
        protected _renderArea: d3.Selection<void>;
        private _attrBindings;
        private _attrExtents;
        private _includedValuesProvider;
        private _animate;
        private _animators;
        protected _renderCallback: ScaleCallback<Scale<any, any>>;
        private _onDatasetUpdateCallback;
        protected _propertyExtents: d3.Map<any[]>;
        protected _propertyBindings: d3.Map<Plots.AccessorScaleBinding<any, any>>;
        /**
         * A Plot draws some visualization of the inputted Datasets.
         *
         * @constructor
         */
        constructor();
        anchor(selection: d3.Selection<void>): this;
        protected _setup(): void;
        destroy(): void;
        protected _createNodesForDataset(dataset: Dataset): Drawer;
        protected _createDrawer(dataset: Dataset): Drawer;
        protected _getAnimator(key: string): Animator;
        protected _onDatasetUpdate(): void;
        /**
         * Gets the AccessorScaleBinding for a particular attribute.
         *
         * @param {string} attr
         */
        attr<A>(attr: string): Plots.AccessorScaleBinding<A, number | string>;
        /**
         * Sets a particular attribute to a constant value or the result of an Accessor.
         *
         * @param {string} attr
         * @param {number|string|Accessor<number>|Accessor<string>} attrValue
         * @returns {Plot} The calling Plot.
         */
        attr(attr: string, attrValue: number | string | Accessor<number> | Accessor<string>): this;
        /**
         * Sets a particular attribute to a scaled constant value or scaled result of an Accessor.
         * The provided Scale will account for the attribute values when autoDomain()-ing.
         *
         * @param {string} attr
         * @param {A|Accessor<A>} attrValue
         * @param {Scale<A, number | string>} scale The Scale used to scale the attrValue.
         * @returns {Plot} The calling Plot.
         */
        attr<A>(attr: string, attrValue: A | Accessor<A>, scale: Scale<A, number | string>): this;
        protected _bindProperty(property: string, value: any, scale: Scale<any, any>): void;
        private _bindAttr(attr, value, scale);
        protected _generateAttrToProjector(): AttributeToProjector;
        renderImmediately(): this;
        /**
         * Returns whether the plot will be animated.
         */
        animated(): boolean;
        /**
         * Enables or disables animation.
         */
        animated(willAnimate: boolean): this;
        detach(): this;
        /**
         * @returns {Scale[]} A unique array of all scales currently used by the Plot.
         */
        private _scales();
        /**
         * Updates the extents associated with each attribute, then autodomains all scales the Plot uses.
         */
        protected _updateExtents(): void;
        private _updateExtentsForAttr(attr);
        protected _updateExtentsForProperty(property: string): void;
        protected _filterForProperty(property: string): Accessor<boolean>;
        private _updateExtentsForKey(key, bindings, extents, filter);
        private _computeExtent(dataset, accScaleBinding, filter);
        /**
         * Override in subclass to add special extents, such as included values
         */
        protected _extentsForProperty(property: string): any[];
        private _includedValuesForScale<D>(scale);
        /**
         * Get the Animator associated with the specified Animator key.
         *
         * @return {Animator}
         */
        animator(animatorKey: string): Animator;
        /**
         * Set the Animator associated with the specified Animator key.
         *
         * @param {string} animatorKey
         * @param {Animator} animator
         * @returns {Plot} The calling Plot.
         */
        animator(animatorKey: string, animator: Animator): this;
        /**
         * Adds a Dataset to the Plot.
         *
         * @param {Dataset} dataset
         * @returns {Plot} The calling Plot.
         */
        addDataset(dataset: Dataset): this;
        protected _addDataset(dataset: Dataset): this;
        /**
         * Removes a Dataset from the Plot.
         *
         * @param {Dataset} dataset
         * @returns {Plot} The calling Plot.
         */
        removeDataset(dataset: Dataset): this;
        protected _removeDataset(dataset: Dataset): this;
        protected _removeDatasetNodes(dataset: Dataset): void;
        datasets(): Dataset[];
        datasets(datasets: Dataset[]): this;
        protected _getDrawersInOrder(): Drawer[];
        protected _generateDrawSteps(): Drawers.DrawStep[];
        protected _additionalPaint(time: number): void;
        protected _getDataToDraw(): Utils.Map<Dataset, any[]>;
        private _paint();
        /**
         * Retrieves Selections of this Plot for the specified Datasets.
         *
         * @param {Dataset[]} [datasets] The Datasets to retrieve the Selections for.
         *   If not provided, Selections will be retrieved for all Datasets on the Plot.
         * @returns {d3.Selection}
         */
        selections(datasets?: Dataset[]): d3.Selection<any>;
        /**
         * Gets the Entities associated with the specified Datasets.
         *
         * @param {dataset[]} datasets The Datasets to retrieve the Entities for.
         *   If not provided, returns defaults to all Datasets on the Plot.
         * @return {Plots.PlotEntity[]}
         */
        entities(datasets?: Dataset[]): Plots.PlotEntity[];
        private _lightweightEntities(datasets?);
        private _lightweightPlotEntityToPlotEntity(entity);
        /**
         * Returns the PlotEntity nearest to the query point by the Euclidian norm, or undefined if no PlotEntity can be found.
         *
         * @param {Point} queryPoint
         * @returns {Plots.PlotEntity} The nearest PlotEntity, or undefined if no PlotEntity can be found.
         */
        entityNearest(queryPoint: Point): Plots.PlotEntity;
        protected _entityVisibleOnPlot(pixelPoint: Point, datum: any, index: number, dataset: Dataset): boolean;
        protected _uninstallScaleForKey(scale: Scale<any, any>, key: string): void;
        protected _installScaleForKey(scale: Scale<any, any>, key: string): void;
        protected _propertyProjectors(): AttributeToProjector;
        protected static _scaledAccessor<D, R>(binding: Plots.AccessorScaleBinding<D, R>): Accessor<any>;
        protected _pixelPoint(datum: any, index: number, dataset: Dataset): Point;
        protected _animateOnNextRender(): boolean;
    }
}
