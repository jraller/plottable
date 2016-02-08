var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var Area = (function (_super) {
            __extends(Area, _super);
            /**
             * An Area Plot draws a filled region (area) between Y and Y0.
             *
             * @constructor
             */
            function Area() {
                _super.call(this);
                this.addClass("area-plot");
                this.y0(0); // default
                this.attr("fill-opacity", 0.25);
                this.attr("fill", new Plottable.Scales.Color().range()[0]);
                this._lineDrawers = new Plottable.Utils.Map();
            }
            Area.prototype._setup = function () {
                var _this = this;
                _super.prototype._setup.call(this);
                this._lineDrawers.forEach(function (d) { return d.renderArea(_this._renderArea.append("g")); });
            };
            Area.prototype.y = function (y, yScale) {
                if (y == null) {
                    return _super.prototype.y.call(this);
                }
                if (yScale == null) {
                    _super.prototype.y.call(this, y);
                }
                else {
                    _super.prototype.y.call(this, y, yScale);
                }
                if (yScale != null) {
                    var y0 = this.y0().accessor;
                    if (y0 != null) {
                        this._bindProperty(Area._Y0_KEY, y0, yScale);
                    }
                    this._updateYScale();
                }
                return this;
            };
            Area.prototype.y0 = function (y0) {
                if (y0 == null) {
                    return this._propertyBindings.get(Area._Y0_KEY);
                }
                var yBinding = this.y();
                var yScale = yBinding && yBinding.scale;
                this._bindProperty(Area._Y0_KEY, y0, yScale);
                this._updateYScale();
                this.render();
                return this;
            };
            Area.prototype._onDatasetUpdate = function () {
                _super.prototype._onDatasetUpdate.call(this);
                this._updateYScale();
            };
            Area.prototype.addDataset = function (dataset) {
                _super.prototype.addDataset.call(this, dataset);
                return this;
            };
            Area.prototype._addDataset = function (dataset) {
                var lineDrawer = new Plottable.Drawers.Line(dataset);
                if (this._isSetup) {
                    lineDrawer.renderArea(this._renderArea.append("g"));
                }
                this._lineDrawers.set(dataset, lineDrawer);
                _super.prototype._addDataset.call(this, dataset);
                return this;
            };
            Area.prototype._removeDatasetNodes = function (dataset) {
                _super.prototype._removeDatasetNodes.call(this, dataset);
                this._lineDrawers.get(dataset).remove();
            };
            Area.prototype._additionalPaint = function () {
                var _this = this;
                var drawSteps = this._generateLineDrawSteps();
                var dataToDraw = this._getDataToDraw();
                this.datasets().forEach(function (dataset) { return _this._lineDrawers.get(dataset).draw(dataToDraw.get(dataset), drawSteps); });
            };
            Area.prototype._generateLineDrawSteps = function () {
                var drawSteps = [];
                if (this._animateOnNextRender()) {
                    var attrToProjector = this._generateLineAttrToProjector();
                    attrToProjector["d"] = this._constructLineProjector(Plottable.Plot._scaledAccessor(this.x()), this._getResetYFunction());
                    drawSteps.push({ attrToProjector: attrToProjector, animator: this._getAnimator(Plots.Animator.RESET) });
                }
                drawSteps.push({ attrToProjector: this._generateLineAttrToProjector(), animator: this._getAnimator(Plots.Animator.MAIN) });
                return drawSteps;
            };
            Area.prototype._generateLineAttrToProjector = function () {
                var lineAttrToProjector = this._generateAttrToProjector();
                lineAttrToProjector["d"] = this._constructLineProjector(Plottable.Plot._scaledAccessor(this.x()), Plottable.Plot._scaledAccessor(this.y()));
                return lineAttrToProjector;
            };
            Area.prototype._createDrawer = function (dataset) {
                return new Plottable.Drawers.Area(dataset);
            };
            Area.prototype._generateDrawSteps = function () {
                var drawSteps = [];
                if (this._animateOnNextRender()) {
                    var attrToProjector = this._generateAttrToProjector();
                    attrToProjector["d"] = this._constructAreaProjector(Plottable.Plot._scaledAccessor(this.x()), this._getResetYFunction(), Plottable.Plot._scaledAccessor(this.y0()));
                    drawSteps.push({ attrToProjector: attrToProjector, animator: this._getAnimator(Plots.Animator.RESET) });
                }
                drawSteps.push({ attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator(Plots.Animator.MAIN) });
                return drawSteps;
            };
            Area.prototype._updateYScale = function () {
                var extents = this._propertyExtents.get("y0");
                var extent = Plottable.Utils.Array.flatten(extents);
                var uniqExtentVals = Plottable.Utils.Array.uniq(extent);
                var constantBaseline = uniqExtentVals.length === 1 ? uniqExtentVals[0] : null;
                var yBinding = this.y();
                var yScale = (yBinding && yBinding.scale);
                if (yScale == null) {
                    return;
                }
                if (this._constantBaselineValueProvider != null) {
                    yScale.removePaddingExceptionsProvider(this._constantBaselineValueProvider);
                    this._constantBaselineValueProvider = null;
                }
                if (constantBaseline != null) {
                    this._constantBaselineValueProvider = function () { return [constantBaseline]; };
                    yScale.addPaddingExceptionsProvider(this._constantBaselineValueProvider);
                }
            };
            Area.prototype._getResetYFunction = function () {
                return Plottable.Plot._scaledAccessor(this.y0());
            };
            Area.prototype._propertyProjectors = function () {
                var propertyToProjectors = _super.prototype._propertyProjectors.call(this);
                propertyToProjectors["d"] = this._constructAreaProjector(Plottable.Plot._scaledAccessor(this.x()), Plottable.Plot._scaledAccessor(this.y()), Plottable.Plot._scaledAccessor(this.y0()));
                return propertyToProjectors;
            };
            Area.prototype.selections = function (datasets) {
                var _this = this;
                if (datasets === void 0) { datasets = this.datasets(); }
                var allSelections = _super.prototype.selections.call(this, datasets)[0];
                var lineDrawers = datasets.map(function (dataset) { return _this._lineDrawers.get(dataset); })
                    .filter(function (drawer) { return drawer != null; });
                lineDrawers.forEach(function (ld, i) { return allSelections.push(ld.selectionForIndex(i).node()); });
                return d3.selectAll(allSelections);
            };
            Area.prototype._constructAreaProjector = function (xProjector, yProjector, y0Projector) {
                var _this = this;
                var definedProjector = function (d, i, dataset) {
                    var positionX = Plottable.Plot._scaledAccessor(_this.x())(d, i, dataset);
                    var positionY = Plottable.Plot._scaledAccessor(_this.y())(d, i, dataset);
                    return Plottable.Utils.Math.isValidNumber(positionX) && Plottable.Utils.Math.isValidNumber(positionY);
                };
                return function (datum, index, dataset) {
                    var areaGenerator = d3.svg.area()
                        .x(function (innerDatum, innerIndex) { return xProjector(innerDatum, innerIndex, dataset); })
                        .y1(function (innerDatum, innerIndex) { return yProjector(innerDatum, innerIndex, dataset); })
                        .y0(function (innerDatum, innerIndex) { return y0Projector(innerDatum, innerIndex, dataset); })
                        .interpolate(_this.interpolator())
                        .defined(function (innerDatum, innerIndex) { return definedProjector(innerDatum, innerIndex, dataset); });
                    return areaGenerator(datum);
                };
            };
            Area._Y0_KEY = "y0";
            return Area;
        })(Plots.Line);
        Plots.Area = Area;
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
