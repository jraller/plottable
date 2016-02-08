var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var Scatter = (function (_super) {
            __extends(Scatter, _super);
            /**
             * A Scatter Plot draws a symbol at each data point.
             *
             * @constructor
             */
            function Scatter() {
                _super.call(this);
                this._labelsEnabled = false;
                this._label = null;
                this.addClass("scatter-plot");
                var animator = new Plottable.Animators.Easing();
                animator.startDelay(5);
                animator.stepDuration(250);
                animator.maxTotalDuration(Plottable.Plot._ANIMATION_MAX_DURATION);
                this.animator(Plots.Animator.MAIN, animator);
                this.attr("opacity", 0.6);
                this.attr("fill", new Plottable.Scales.Color().range()[0]);
                this.size(6);
                var circleSymbolFactory = Plottable.SymbolFactories.circle();
                this.symbol(function () { return circleSymbolFactory; });
            }
            Scatter.prototype._createDrawer = function (dataset) {
                return new Plottable.Drawers.Symbol(dataset);
            };
            Scatter.prototype.size = function (size, scale) {
                if (size == null) {
                    return this._propertyBindings.get(Scatter._SIZE_KEY);
                }
                this._bindProperty(Scatter._SIZE_KEY, size, scale);
                this.render();
                return this;
            };
            Scatter.prototype.symbol = function (symbol) {
                if (symbol == null) {
                    return this._propertyBindings.get(Scatter._SYMBOL_KEY);
                }
                this._propertyBindings.set(Scatter._SYMBOL_KEY, { accessor: symbol });
                this.render();
                return this;
            };
            Scatter.prototype._generateAttrToProjector = function () {
                var attrToProjector = _super.prototype._generateAttrToProjector.call(this);
                // Copy each of the different projectors.
                var xAttr = Plottable.Plot._scaledAccessor(this.x());
                var yAttr = Plottable.Plot._scaledAccessor(this.y());
                var sizeAttr = Plottable.Plot._scaledAccessor(this.size());
                var xScale = this.x().scale;
                var yScale = this.y().scale;
                var sizeScale = this.size().scale;
                attrToProjector["x"] = function (d, i, dataset) { return xAttr(d, i, dataset); };
                attrToProjector["y"] = function (d, i, dataset) { return yAttr(d, i, dataset); };
                attrToProjector["size"] = function (d, i, dataset) { return sizeAttr(d, i, dataset); };
                // Clean up the attributes projected onto the SVG elements
                return attrToProjector;
            };
            Scatter.prototype._generateDrawSteps = function () {
                var drawSteps = [];
                if (this._animateOnNextRender()) {
                    var resetAttrToProjector = this._generateAttrToProjector();
                    var symbolProjector = Plottable.Plot._scaledAccessor(this.symbol());
                    resetAttrToProjector["d"] = function (datum, index, dataset) { return symbolProjector(datum, index, dataset)(0); };
                    drawSteps.push({ attrToProjector: resetAttrToProjector, animator: this._getAnimator(Plots.Animator.RESET) });
                }
                drawSteps.push({ attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator(Plots.Animator.MAIN) });
                return drawSteps;
            };
            Scatter.prototype._entityVisibleOnPlot = function (pixelPoint, datum, index, dataset) {
                var xRange = { min: 0, max: this.width() };
                var yRange = { min: 0, max: this.height() };
                var diameter = Plottable.Plot._scaledAccessor(this.size())(datum, index, dataset);
                var translatedBbox = {
                    x: pixelPoint.x - diameter,
                    y: pixelPoint.y - diameter,
                    width: diameter,
                    height: diameter
                };
                return Plottable.Utils.DOM.intersectsBBox(xRange, yRange, translatedBbox);
            };
            Scatter.prototype._propertyProjectors = function () {
                var propertyToProjectors = _super.prototype._propertyProjectors.call(this);
                var xProjector = Plottable.Plot._scaledAccessor(this.x());
                var yProjector = Plottable.Plot._scaledAccessor(this.y());
                var sizeProjector = Plottable.Plot._scaledAccessor(this.size());
                propertyToProjectors["transform"] = function (datum, index, dataset) {
                    return "translate(" + xProjector(datum, index, dataset) + "," + yProjector(datum, index, dataset) + ")";
                };
                var symbolProjector = Plottable.Plot._scaledAccessor(this.symbol());
                propertyToProjectors["d"] = function (datum, index, dataset) {
                    return symbolProjector(datum, index, dataset)(sizeProjector(datum, index, dataset));
                };
                return propertyToProjectors;
            };
            Scatter.prototype.entitiesIn = function (xRangeOrBounds, yRange) {
                var dataXRange;
                var dataYRange;
                if (yRange == null) {
                    var bounds = xRangeOrBounds;
                    dataXRange = { min: bounds.topLeft.x, max: bounds.bottomRight.x };
                    dataYRange = { min: bounds.topLeft.y, max: bounds.bottomRight.y };
                }
                else {
                    dataXRange = xRangeOrBounds;
                    dataYRange = yRange;
                }
                var xProjector = Plottable.Plot._scaledAccessor(this.x());
                var yProjector = Plottable.Plot._scaledAccessor(this.y());
                return this.entities().filter(function (entity) {
                    var datum = entity.datum;
                    var index = entity.index;
                    var dataset = entity.dataset;
                    var x = xProjector(datum, index, dataset);
                    var y = yProjector(datum, index, dataset);
                    return dataXRange.min <= x && x <= dataXRange.max && dataYRange.min <= y && y <= dataYRange.max;
                });
            };
            Scatter.prototype._entityBBox = function (datum, index, dataset, attrToProjector) {
                return {
                    x: attrToProjector["x"](datum, index, dataset),
                    y: attrToProjector["y"](datum, index, dataset),
                    width: 4,
                    height: 4
                };
            };
            /**
             * Gets the Entities at a particular Point.
             *
             * @param {Point} p
             * @returns {PlotEntity[]}
             */
            Scatter.prototype.entitiesAt = function (p) {
                var xProjector = Plottable.Plot._scaledAccessor(this.x());
                var yProjector = Plottable.Plot._scaledAccessor(this.y());
                var sizeProjector = Plottable.Plot._scaledAccessor(this.size());
                return this.entities().filter(function (entity) {
                    var datum = entity.datum;
                    var index = entity.index;
                    var dataset = entity.dataset;
                    var x = xProjector(datum, index, dataset);
                    var y = yProjector(datum, index, dataset);
                    var size = sizeProjector(datum, index, dataset);
                    return x - size / 2 <= p.x && p.x <= x + size / 2 && y - size / 2 <= p.y && p.y <= y + size / 2;
                });
            };
            Scatter.prototype.label = function (label) {
                if (label == null) {
                    return this._label;
                }
                this._label = label;
                this.render();
                return this;
            };
            Scatter.prototype.labelsEnabled = function (enabled) {
                if (enabled == null) {
                    return this._labelsEnabled;
                }
                else {
                    this._labelsEnabled = enabled;
                    this.render();
                    return this;
                }
            };
            Scatter.prototype._additionalPaint = function (time) {
                var _this = this;
                this._renderArea.selectAll(".label-area").remove();
                if (this._labelsEnabled && this.label() != null) {
                    Plottable.Utils.Window.setTimeout(function () { return _this._drawLabels(); }, time);
                }
            };
            Scatter.prototype._drawLabels = function () {
                var _this = this;
                var dataToDraw = this._getDataToDraw();
                this.datasets().forEach(function (dataset, i) { return _this._drawLabel(dataToDraw, dataset, i); });
            };
            Scatter.prototype._drawLabel = function (dataToDraw, dataset, datasetIndex) {
                var _this = this;
                var attrToProjector = this._generateAttrToProjector();
                var labelArea = this._renderArea.append("g").classed("label-area", true);
                var measurer = new SVGTypewriter.Measurers.Measurer(labelArea);
                var writer = new SVGTypewriter.Writers.Writer(measurer);
                var xRange = this.x().scale.range();
                var yRange = this.y().scale.range();
                var xMin = Math.min.apply(null, xRange);
                var xMax = Math.max.apply(null, xRange);
                var yMin = Math.min.apply(null, yRange);
                var yMax = Math.max.apply(null, yRange);
                var data = dataToDraw.get(dataset);
                data.forEach(function (datum, datumIndex) {
                    var label = "" + _this.label()(datum, datumIndex, dataset);
                    var measurement = measurer.measure(label);
                    var x = attrToProjector["x"](datum, datumIndex, dataset);
                    var y = attrToProjector["y"](datum, datumIndex, dataset);
                    var width = measurement.width;
                    var height = measurement.height;
                    var size = attrToProjector["size"](datum, datumIndex, dataset);
                    // let horizontalOffset = (measurement.width) / 2;
                    var verticalOffset = (measurement.height) / 2;
                    x += size / 2;
                    y -= verticalOffset + (size / 2);
                    var xLabelRange = { min: x, max: x + measurement.width };
                    var yLabelRange = { min: y, max: y + measurement.height };
                    if (xLabelRange.min < xMin || xLabelRange.max > xMax || yLabelRange.min < yMin || yLabelRange.max > yMax) {
                        return;
                    }
                    if (_this._overlayLabel(xLabelRange, yLabelRange, datumIndex, datasetIndex, dataToDraw)) {
                        return;
                    }
                    var color = attrToProjector["fill"](datum, datumIndex, dataset);
                    var dark = Plottable.Utils.Color.contrast("white", color) * 1.6 < Plottable.Utils.Color.contrast("black", color);
                    var g = labelArea.append("g").attr("transform", "translate(" + x + "," + y + ")");
                    var className = dark ? "dark-label" : "light-label";
                    g.classed(className, true);
                    writer.write(label, measurement.width, measurement.height, {
                        selection: g,
                        xAlign: "center",
                        yAlign: "center",
                        textRotation: 0
                    });
                });
            };
            Scatter.prototype._overlayLabel = function (labelXRange, labelYRange, datumIndex, datasetIndex, dataToDraw) {
                var attrToProjector = this._generateAttrToProjector();
                var datasets = this.datasets();
                for (var i = datasetIndex; i < datasets.length; i++) {
                    var dataset = datasets[i];
                    var data = dataToDraw.get(dataset);
                    for (var j = (i === datasetIndex ? datumIndex + 1 : 0); j < data.length; j++) {
                        if (Plottable.Utils.DOM.intersectsBBox(labelXRange, labelYRange, this._entityBBox(data[j], j, dataset, attrToProjector))) {
                            return true;
                        }
                    }
                }
                return false;
            };
            Scatter._SIZE_KEY = "size";
            Scatter._SYMBOL_KEY = "symbol";
            return Scatter;
        })(Plottable.XYPlot);
        Plots.Scatter = Scatter;
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
