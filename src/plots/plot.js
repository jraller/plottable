var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var Animator;
        (function (Animator) {
            Animator.MAIN = "main";
            Animator.RESET = "reset";
        })(Animator = Plots.Animator || (Plots.Animator = {}));
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
var Plottable;
(function (Plottable) {
    var Plot = (function (_super) {
        __extends(Plot, _super);
        /**
         * A Plot draws some visualization of the inputted Datasets.
         *
         * @constructor
         */
        function Plot() {
            var _this = this;
            _super.call(this);
            this._dataChanged = false;
            this._animate = false;
            this._animators = {};
            this._clipPathEnabled = true;
            this.addClass("plot");
            this._datasetToDrawer = new Plottable.Utils.Map();
            this._attrBindings = d3.map();
            this._attrExtents = d3.map();
            this._includedValuesProvider = function (scale) { return _this._includedValuesForScale(scale); };
            this._renderCallback = function (scale) { return _this.render(); };
            this._onDatasetUpdateCallback = function () { return _this._onDatasetUpdate(); };
            this._propertyBindings = d3.map();
            this._propertyExtents = d3.map();
            var mainAnimator = new Plottable.Animators.Easing().maxTotalDuration(Plot._ANIMATION_MAX_DURATION);
            this.animator(Plottable.Plots.Animator.MAIN, mainAnimator);
            this.animator(Plottable.Plots.Animator.RESET, new Plottable.Animators.Null());
        }
        Plot.prototype.anchor = function (selection) {
            _super.prototype.anchor.call(this, selection);
            this._dataChanged = true;
            this._updateExtents();
            return this;
        };
        Plot.prototype._setup = function () {
            var _this = this;
            _super.prototype._setup.call(this);
            this._renderArea = this.content().append("g").classed("render-area", true);
            this.datasets().forEach(function (dataset) { return _this._createNodesForDataset(dataset); });
        };
        Plot.prototype.destroy = function () {
            var _this = this;
            _super.prototype.destroy.call(this);
            this._scales().forEach(function (scale) { return scale.offUpdate(_this._renderCallback); });
            this.datasets([]);
        };
        Plot.prototype._createNodesForDataset = function (dataset) {
            var drawer = this._datasetToDrawer.get(dataset);
            drawer.renderArea(this._renderArea.append("g"));
            return drawer;
        };
        Plot.prototype._createDrawer = function (dataset) {
            return new Plottable.Drawer(dataset);
        };
        Plot.prototype._getAnimator = function (key) {
            if (this._animateOnNextRender()) {
                return this._animators[key] || new Plottable.Animators.Null();
            }
            else {
                return new Plottable.Animators.Null();
            }
        };
        Plot.prototype._onDatasetUpdate = function () {
            this._updateExtents();
            this._dataChanged = true;
            this.render();
        };
        Plot.prototype.attr = function (attr, attrValue, scale) {
            if (attrValue == null) {
                return this._attrBindings.get(attr);
            }
            this._bindAttr(attr, attrValue, scale);
            this.render(); // queue a re-render upon changing projector
            return this;
        };
        Plot.prototype._bindProperty = function (property, value, scale) {
            var binding = this._propertyBindings.get(property);
            var oldScale = binding != null ? binding.scale : null;
            this._propertyBindings.set(property, { accessor: d3.functor(value), scale: scale });
            this._updateExtentsForProperty(property);
            if (oldScale != null) {
                this._uninstallScaleForKey(oldScale, property);
            }
            if (scale != null) {
                this._installScaleForKey(scale, property);
            }
        };
        Plot.prototype._bindAttr = function (attr, value, scale) {
            var binding = this._attrBindings.get(attr);
            var oldScale = binding != null ? binding.scale : null;
            this._attrBindings.set(attr, { accessor: d3.functor(value), scale: scale });
            this._updateExtentsForAttr(attr);
            if (oldScale != null) {
                this._uninstallScaleForKey(oldScale, attr);
            }
            if (scale != null) {
                this._installScaleForKey(scale, attr);
            }
        };
        Plot.prototype._generateAttrToProjector = function () {
            var h = {};
            this._attrBindings.forEach(function (attr, binding) {
                var accessor = binding.accessor;
                var scale = binding.scale;
                var fn = scale ? function (d, i, dataset) { return scale.scale(accessor(d, i, dataset)); } : accessor;
                h[attr] = fn;
            });
            var propertyProjectors = this._propertyProjectors();
            Object.keys(propertyProjectors).forEach(function (key) {
                if (h[key] == null) {
                    h[key] = propertyProjectors[key];
                }
            });
            return h;
        };
        Plot.prototype.renderImmediately = function () {
            _super.prototype.renderImmediately.call(this);
            if (this._isAnchored) {
                this._paint();
                this._dataChanged = false;
            }
            return this;
        };
        Plot.prototype.animated = function (willAnimate) {
            if (willAnimate == null) {
                return this._animate;
            }
            this._animate = willAnimate;
            return this;
        };
        Plot.prototype.detach = function () {
            _super.prototype.detach.call(this);
            // make the domain resize
            this._updateExtents();
            return this;
        };
        /**
         * @returns {Scale[]} A unique array of all scales currently used by the Plot.
         */
        Plot.prototype._scales = function () {
            var scales = [];
            this._attrBindings.forEach(function (attr, binding) {
                var scale = binding.scale;
                if (scale != null && scales.indexOf(scale) === -1) {
                    scales.push(scale);
                }
            });
            this._propertyBindings.forEach(function (property, binding) {
                var scale = binding.scale;
                if (scale != null && scales.indexOf(scale) === -1) {
                    scales.push(scale);
                }
            });
            return scales;
        };
        /**
         * Updates the extents associated with each attribute, then autodomains all scales the Plot uses.
         */
        Plot.prototype._updateExtents = function () {
            var _this = this;
            this._attrBindings.forEach(function (attr) { return _this._updateExtentsForAttr(attr); });
            this._propertyExtents.forEach(function (property) { return _this._updateExtentsForProperty(property); });
            this._scales().forEach(function (scale) { return scale.addIncludedValuesProvider(_this._includedValuesProvider); });
        };
        Plot.prototype._updateExtentsForAttr = function (attr) {
            // Filters should never be applied to attributes
            this._updateExtentsForKey(attr, this._attrBindings, this._attrExtents, null);
        };
        Plot.prototype._updateExtentsForProperty = function (property) {
            this._updateExtentsForKey(property, this._propertyBindings, this._propertyExtents, this._filterForProperty(property));
        };
        Plot.prototype._filterForProperty = function (property) {
            return null;
        };
        Plot.prototype._updateExtentsForKey = function (key, bindings, extents, filter) {
            var _this = this;
            var accScaleBinding = bindings.get(key);
            if (accScaleBinding == null || accScaleBinding.accessor == null) {
                return;
            }
            extents.set(key, this.datasets().map(function (dataset) { return _this._computeExtent(dataset, accScaleBinding, filter); }));
        };
        Plot.prototype._computeExtent = function (dataset, accScaleBinding, filter) {
            var accessor = accScaleBinding.accessor;
            var scale = accScaleBinding.scale;
            if (scale == null) {
                return [];
            }
            var data = dataset.data();
            if (filter != null) {
                data = data.filter(function (d, i) { return filter(d, i, dataset); });
            }
            var appliedAccessor = function (d, i) { return accessor(d, i, dataset); };
            var mappedData = data.map(appliedAccessor);
            return scale.extentOfValues(mappedData);
        };
        /**
         * Override in subclass to add special extents, such as included values
         */
        Plot.prototype._extentsForProperty = function (property) {
            return this._propertyExtents.get(property);
        };
        Plot.prototype._includedValuesForScale = function (scale) {
            var _this = this;
            if (!this._isAnchored) {
                return [];
            }
            var includedValues = [];
            this._attrBindings.forEach(function (attr, binding) {
                if (binding.scale === scale) {
                    var extents = _this._attrExtents.get(attr);
                    if (extents != null) {
                        includedValues = includedValues.concat(d3.merge(extents));
                    }
                }
            });
            this._propertyBindings.forEach(function (property, binding) {
                if (binding.scale === scale) {
                    var extents = _this._extentsForProperty(property);
                    if (extents != null) {
                        includedValues = includedValues.concat(d3.merge(extents));
                    }
                }
            });
            return includedValues;
        };
        Plot.prototype.animator = function (animatorKey, animator) {
            if (animator === undefined) {
                return this._animators[animatorKey];
            }
            else {
                this._animators[animatorKey] = animator;
                return this;
            }
        };
        /**
         * Adds a Dataset to the Plot.
         *
         * @param {Dataset} dataset
         * @returns {Plot} The calling Plot.
         */
        Plot.prototype.addDataset = function (dataset) {
            this._addDataset(dataset);
            this._onDatasetUpdate();
            return this;
        };
        Plot.prototype._addDataset = function (dataset) {
            this._removeDataset(dataset);
            var drawer = this._createDrawer(dataset);
            this._datasetToDrawer.set(dataset, drawer);
            if (this._isSetup) {
                this._createNodesForDataset(dataset);
            }
            dataset.onUpdate(this._onDatasetUpdateCallback);
            return this;
        };
        /**
         * Removes a Dataset from the Plot.
         *
         * @param {Dataset} dataset
         * @returns {Plot} The calling Plot.
         */
        Plot.prototype.removeDataset = function (dataset) {
            this._removeDataset(dataset);
            this._onDatasetUpdate();
            return this;
        };
        Plot.prototype._removeDataset = function (dataset) {
            if (this.datasets().indexOf(dataset) === -1) {
                return this;
            }
            this._removeDatasetNodes(dataset);
            dataset.offUpdate(this._onDatasetUpdateCallback);
            this._datasetToDrawer.delete(dataset);
            return this;
        };
        Plot.prototype._removeDatasetNodes = function (dataset) {
            var drawer = this._datasetToDrawer.get(dataset);
            drawer.remove();
        };
        Plot.prototype.datasets = function (datasets) {
            var _this = this;
            var currentDatasets = [];
            this._datasetToDrawer.forEach(function (drawer, dataset) { return currentDatasets.push(dataset); });
            if (datasets == null) {
                return currentDatasets;
            }
            currentDatasets.forEach(function (dataset) { return _this._removeDataset(dataset); });
            datasets.forEach(function (dataset) { return _this._addDataset(dataset); });
            this._onDatasetUpdate();
            return this;
        };
        Plot.prototype._getDrawersInOrder = function () {
            var _this = this;
            return this.datasets().map(function (dataset) { return _this._datasetToDrawer.get(dataset); });
        };
        Plot.prototype._generateDrawSteps = function () {
            return [{ attrToProjector: this._generateAttrToProjector(), animator: new Plottable.Animators.Null() }];
        };
        Plot.prototype._additionalPaint = function (time) {
            // no-op
        };
        Plot.prototype._getDataToDraw = function () {
            var dataToDraw = new Plottable.Utils.Map();
            this.datasets().forEach(function (dataset) { return dataToDraw.set(dataset, dataset.data()); });
            return dataToDraw;
        };
        Plot.prototype._paint = function () {
            var drawSteps = this._generateDrawSteps();
            var dataToDraw = this._getDataToDraw();
            var drawers = this._getDrawersInOrder();
            this.datasets().forEach(function (ds, i) { return drawers[i].draw(dataToDraw.get(ds), drawSteps); });
            var times = this.datasets().map(function (ds, i) { return drawers[i].totalDrawTime(dataToDraw.get(ds), drawSteps); });
            var maxTime = Plottable.Utils.Math.max(times, 0);
            this._additionalPaint(maxTime);
        };
        /**
         * Retrieves Selections of this Plot for the specified Datasets.
         *
         * @param {Dataset[]} [datasets] The Datasets to retrieve the Selections for.
         *   If not provided, Selections will be retrieved for all Datasets on the Plot.
         * @returns {d3.Selection}
         */
        Plot.prototype.selections = function (datasets) {
            var _this = this;
            if (datasets === void 0) { datasets = this.datasets(); }
            var selections = [];
            datasets.forEach(function (dataset) {
                var drawer = _this._datasetToDrawer.get(dataset);
                if (drawer == null) {
                    return;
                }
                drawer.renderArea().selectAll(drawer.selector()).each(function () {
                    selections.push(this);
                });
            });
            return d3.selectAll(selections);
        };
        /**
         * Gets the Entities associated with the specified Datasets.
         *
         * @param {dataset[]} datasets The Datasets to retrieve the Entities for.
         *   If not provided, returns defaults to all Datasets on the Plot.
         * @return {Plots.PlotEntity[]}
         */
        Plot.prototype.entities = function (datasets) {
            var _this = this;
            if (datasets === void 0) { datasets = this.datasets(); }
            return this._lightweightEntities(datasets).map(function (entity) { return _this._lightweightPlotEntityToPlotEntity(entity); });
        };
        Plot.prototype._lightweightEntities = function (datasets) {
            var _this = this;
            if (datasets === void 0) { datasets = this.datasets(); }
            var lightweightEntities = [];
            datasets.forEach(function (dataset) {
                var drawer = _this._datasetToDrawer.get(dataset);
                var validDatumIndex = 0;
                dataset.data().forEach(function (datum, datasetIndex) {
                    var position = _this._pixelPoint(datum, datasetIndex, dataset);
                    if (Plottable.Utils.Math.isNaN(position.x) || Plottable.Utils.Math.isNaN(position.y)) {
                        return;
                    }
                    lightweightEntities.push({
                        datum: datum,
                        index: datasetIndex,
                        dataset: dataset,
                        position: position,
                        component: _this,
                        drawer: drawer,
                        validDatumIndex: validDatumIndex
                    });
                    validDatumIndex++;
                });
            });
            return lightweightEntities;
        };
        Plot.prototype._lightweightPlotEntityToPlotEntity = function (entity) {
            var plotEntity = {
                datum: entity.datum,
                position: entity.position,
                dataset: entity.dataset,
                index: entity.index,
                component: entity.component,
                selection: entity.drawer.selectionForIndex(entity.validDatumIndex)
            };
            return plotEntity;
        };
        /**
         * Returns the PlotEntity nearest to the query point by the Euclidian norm, or undefined if no PlotEntity can be found.
         *
         * @param {Point} queryPoint
         * @returns {Plots.PlotEntity} The nearest PlotEntity, or undefined if no PlotEntity can be found.
         */
        Plot.prototype.entityNearest = function (queryPoint) {
            var _this = this;
            var closestDistanceSquared = Infinity;
            var closestPointEntity;
            var entities = this._lightweightEntities();
            entities.forEach(function (entity) {
                if (!_this._entityVisibleOnPlot(entity.position, entity.datum, entity.index, entity.dataset)) {
                    return;
                }
                var distanceSquared = Plottable.Utils.Math.distanceSquared(entity.position, queryPoint);
                if (distanceSquared < closestDistanceSquared) {
                    closestDistanceSquared = distanceSquared;
                    closestPointEntity = entity;
                }
            });
            if (closestPointEntity === undefined) {
                return undefined;
            }
            return this._lightweightPlotEntityToPlotEntity(closestPointEntity);
        };
        Plot.prototype._entityVisibleOnPlot = function (pixelPoint, datum, index, dataset) {
            return !(pixelPoint.x < 0 || pixelPoint.y < 0 ||
                pixelPoint.x > this.width() || pixelPoint.y > this.height());
        };
        Plot.prototype._uninstallScaleForKey = function (scale, key) {
            scale.offUpdate(this._renderCallback);
            scale.removeIncludedValuesProvider(this._includedValuesProvider);
        };
        Plot.prototype._installScaleForKey = function (scale, key) {
            scale.onUpdate(this._renderCallback);
            scale.addIncludedValuesProvider(this._includedValuesProvider);
        };
        Plot.prototype._propertyProjectors = function () {
            return {};
        };
        Plot._scaledAccessor = function (binding) {
            return binding.scale == null ?
                binding.accessor :
                function (d, i, ds) { return binding.scale.scale(binding.accessor(d, i, ds)); };
        };
        Plot.prototype._pixelPoint = function (datum, index, dataset) {
            return { x: 0, y: 0 };
        };
        Plot.prototype._animateOnNextRender = function () {
            return this._animate && this._dataChanged;
        };
        Plot._ANIMATION_MAX_DURATION = 600;
        return Plot;
    })(Plottable.Component);
    Plottable.Plot = Plot;
})(Plottable || (Plottable = {}));
