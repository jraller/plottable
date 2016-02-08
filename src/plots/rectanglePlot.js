var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var Rectangle = (function (_super) {
            __extends(Rectangle, _super);
            /**
             * A Rectangle Plot displays rectangles based on the data.
             * The left and right edges of each rectangle can be set with x() and x2().
             *   If only x() is set the Rectangle Plot will attempt to compute the correct left and right edge positions.
             * The top and bottom edges of each rectangle can be set with y() and y2().
             *   If only y() is set the Rectangle Plot will attempt to compute the correct top and bottom edge positions.
             *
             * @constructor
             * @param {Scale.Scale} xScale
             * @param {Scale.Scale} yScale
             */
            function Rectangle() {
                _super.call(this);
                this._labelsEnabled = false;
                this._label = null;
                this.animator("rectangles", new Plottable.Animators.Null());
                this.addClass("rectangle-plot");
                this.attr("fill", new Plottable.Scales.Color().range()[0]);
            }
            Rectangle.prototype._createDrawer = function (dataset) {
                return new Plottable.Drawers.Rectangle(dataset);
            };
            Rectangle.prototype._generateAttrToProjector = function () {
                var _this = this;
                var attrToProjector = _super.prototype._generateAttrToProjector.call(this);
                // Copy each of the different projectors.
                var xAttr = Plottable.Plot._scaledAccessor(this.x());
                var x2Attr = attrToProjector[Rectangle._X2_KEY];
                var yAttr = Plottable.Plot._scaledAccessor(this.y());
                var y2Attr = attrToProjector[Rectangle._Y2_KEY];
                var xScale = this.x().scale;
                var yScale = this.y().scale;
                if (x2Attr != null) {
                    attrToProjector["width"] = function (d, i, dataset) { return Math.abs(x2Attr(d, i, dataset) - xAttr(d, i, dataset)); };
                    attrToProjector["x"] = function (d, i, dataset) { return Math.min(x2Attr(d, i, dataset), xAttr(d, i, dataset)); };
                }
                else {
                    attrToProjector["width"] = function (d, i, dataset) { return _this._rectangleWidth(xScale); };
                    attrToProjector["x"] = function (d, i, dataset) { return xAttr(d, i, dataset) - 0.5 * attrToProjector["width"](d, i, dataset); };
                }
                if (y2Attr != null) {
                    attrToProjector["height"] = function (d, i, dataset) { return Math.abs(y2Attr(d, i, dataset) - yAttr(d, i, dataset)); };
                    attrToProjector["y"] = function (d, i, dataset) {
                        return Math.max(y2Attr(d, i, dataset), yAttr(d, i, dataset)) - attrToProjector["height"](d, i, dataset);
                    };
                }
                else {
                    attrToProjector["height"] = function (d, i, dataset) { return _this._rectangleWidth(yScale); };
                    attrToProjector["y"] = function (d, i, dataset) { return yAttr(d, i, dataset) - 0.5 * attrToProjector["height"](d, i, dataset); };
                }
                // Clean up the attributes projected onto the SVG elements
                delete attrToProjector[Rectangle._X2_KEY];
                delete attrToProjector[Rectangle._Y2_KEY];
                return attrToProjector;
            };
            Rectangle.prototype._generateDrawSteps = function () {
                return [{ attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator("rectangles") }];
            };
            Rectangle.prototype._updateExtentsForProperty = function (property) {
                _super.prototype._updateExtentsForProperty.call(this, property);
                if (property === "x") {
                    _super.prototype._updateExtentsForProperty.call(this, "x2");
                }
                else if (property === "y") {
                    _super.prototype._updateExtentsForProperty.call(this, "y2");
                }
            };
            Rectangle.prototype._filterForProperty = function (property) {
                if (property === "x2") {
                    return _super.prototype._filterForProperty.call(this, "x");
                }
                else if (property === "y2") {
                    return _super.prototype._filterForProperty.call(this, "y");
                }
                return _super.prototype._filterForProperty.call(this, property);
            };
            Rectangle.prototype.x = function (x, xScale) {
                if (x == null) {
                    return _super.prototype.x.call(this);
                }
                if (xScale == null) {
                    _super.prototype.x.call(this, x);
                }
                else {
                    _super.prototype.x.call(this, x, xScale);
                }
                if (xScale != null) {
                    var x2Binding = this.x2();
                    var x2 = x2Binding && x2Binding.accessor;
                    if (x2 != null) {
                        this._bindProperty(Rectangle._X2_KEY, x2, xScale);
                    }
                }
                // The x and y scales should render in bands with no padding for category scales
                if (xScale instanceof Plottable.Scales.Category) {
                    xScale.innerPadding(0).outerPadding(0);
                }
                return this;
            };
            Rectangle.prototype.x2 = function (x2) {
                if (x2 == null) {
                    return this._propertyBindings.get(Rectangle._X2_KEY);
                }
                var xBinding = this.x();
                var xScale = xBinding && xBinding.scale;
                this._bindProperty(Rectangle._X2_KEY, x2, xScale);
                this.render();
                return this;
            };
            Rectangle.prototype.y = function (y, yScale) {
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
                    var y2Binding = this.y2();
                    var y2 = y2Binding && y2Binding.accessor;
                    if (y2 != null) {
                        this._bindProperty(Rectangle._Y2_KEY, y2, yScale);
                    }
                }
                // The x and y scales should render in bands with no padding for category scales
                if (yScale instanceof Plottable.Scales.Category) {
                    yScale.innerPadding(0).outerPadding(0);
                }
                return this;
            };
            Rectangle.prototype.y2 = function (y2) {
                if (y2 == null) {
                    return this._propertyBindings.get(Rectangle._Y2_KEY);
                }
                var yBinding = this.y();
                var yScale = yBinding && yBinding.scale;
                this._bindProperty(Rectangle._Y2_KEY, y2, yScale);
                this.render();
                return this;
            };
            /**
             * Gets the PlotEntities at a particular Point.
             *
             * @param {Point} point The point to query.
             * @returns {PlotEntity[]} The PlotEntities at the particular point
             */
            Rectangle.prototype.entitiesAt = function (point) {
                var attrToProjector = this._generateAttrToProjector();
                return this.entities().filter(function (entity) {
                    var datum = entity.datum;
                    var index = entity.index;
                    var dataset = entity.dataset;
                    var x = attrToProjector["x"](datum, index, dataset);
                    var y = attrToProjector["y"](datum, index, dataset);
                    var width = attrToProjector["width"](datum, index, dataset);
                    var height = attrToProjector["height"](datum, index, dataset);
                    return x <= point.x && point.x <= x + width && y <= point.y && point.y <= y + height;
                });
            };
            Rectangle.prototype.entitiesIn = function (xRangeOrBounds, yRange) {
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
                return this._entitiesIntersecting(dataXRange, dataYRange);
            };
            Rectangle.prototype._entityBBox = function (datum, index, dataset, attrToProjector) {
                return {
                    x: attrToProjector["x"](datum, index, dataset),
                    y: attrToProjector["y"](datum, index, dataset),
                    width: attrToProjector["width"](datum, index, dataset),
                    height: attrToProjector["height"](datum, index, dataset)
                };
            };
            Rectangle.prototype._entitiesIntersecting = function (xValOrRange, yValOrRange) {
                var _this = this;
                var intersected = [];
                var attrToProjector = this._generateAttrToProjector();
                this.entities().forEach(function (entity) {
                    if (Plottable.Utils.DOM.intersectsBBox(xValOrRange, yValOrRange, _this._entityBBox(entity.datum, entity.index, entity.dataset, attrToProjector))) {
                        intersected.push(entity);
                    }
                });
                return intersected;
            };
            Rectangle.prototype.label = function (label) {
                if (label == null) {
                    return this._label;
                }
                this._label = label;
                this.render();
                return this;
            };
            Rectangle.prototype.labelsEnabled = function (enabled) {
                if (enabled == null) {
                    return this._labelsEnabled;
                }
                else {
                    this._labelsEnabled = enabled;
                    this.render();
                    return this;
                }
            };
            Rectangle.prototype._propertyProjectors = function () {
                var attrToProjector = _super.prototype._propertyProjectors.call(this);
                if (this.x2() != null) {
                    attrToProjector["x2"] = Plottable.Plot._scaledAccessor(this.x2());
                }
                if (this.y2() != null) {
                    attrToProjector["y2"] = Plottable.Plot._scaledAccessor(this.y2());
                }
                return attrToProjector;
            };
            Rectangle.prototype._pixelPoint = function (datum, index, dataset) {
                var attrToProjector = this._generateAttrToProjector();
                var rectX = attrToProjector["x"](datum, index, dataset);
                var rectY = attrToProjector["y"](datum, index, dataset);
                var rectWidth = attrToProjector["width"](datum, index, dataset);
                var rectHeight = attrToProjector["height"](datum, index, dataset);
                var x = rectX + rectWidth / 2;
                var y = rectY + rectHeight / 2;
                return { x: x, y: y };
            };
            Rectangle.prototype._rectangleWidth = function (scale) {
                if (scale instanceof Plottable.Scales.Category) {
                    return scale.rangeBand();
                }
                else {
                    var accessor = scale === this.x().scale ? this.x().accessor : this.y().accessor;
                    var accessorData = d3.set(Plottable.Utils.Array.flatten(this.datasets().map(function (dataset) {
                        return dataset.data().map(function (d, i) { return accessor(d, i, dataset).valueOf(); });
                    }))).values().map(function (value) { return +value; });
                    // Get the absolute difference between min and max
                    var min = Plottable.Utils.Math.min(accessorData, 0);
                    var max = Plottable.Utils.Math.max(accessorData, 0);
                    var scaledMin = scale.scale(min);
                    var scaledMax = scale.scale(max);
                    return (scaledMax - scaledMin) / Math.abs(max - min);
                }
            };
            Rectangle.prototype._getDataToDraw = function () {
                var dataToDraw = new Plottable.Utils.Map();
                var attrToProjector = this._generateAttrToProjector();
                this.datasets().forEach(function (dataset) {
                    var data = dataset.data().filter(function (d, i) { return Plottable.Utils.Math.isValidNumber(attrToProjector["x"](d, i, dataset)) &&
                        Plottable.Utils.Math.isValidNumber(attrToProjector["y"](d, i, dataset)) &&
                        Plottable.Utils.Math.isValidNumber(attrToProjector["width"](d, i, dataset)) &&
                        Plottable.Utils.Math.isValidNumber(attrToProjector["height"](d, i, dataset)); });
                    dataToDraw.set(dataset, data);
                });
                return dataToDraw;
            };
            Rectangle.prototype._additionalPaint = function (time) {
                var _this = this;
                this._renderArea.selectAll(".label-area").remove();
                if (this._labelsEnabled && this.label() != null) {
                    Plottable.Utils.Window.setTimeout(function () { return _this._drawLabels(); }, time);
                }
            };
            Rectangle.prototype._drawLabels = function () {
                var _this = this;
                var dataToDraw = this._getDataToDraw();
                this.datasets().forEach(function (dataset, i) { return _this._drawLabel(dataToDraw, dataset, i); });
            };
            Rectangle.prototype._drawLabel = function (dataToDraw, dataset, datasetIndex) {
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
                    var width = attrToProjector["width"](datum, datumIndex, dataset);
                    var height = attrToProjector["height"](datum, datumIndex, dataset);
                    if (measurement.height <= height && measurement.width <= width) {
                        var horizontalOffset = (width - measurement.width) / 2;
                        var verticalOffset = (height - measurement.height) / 2;
                        x += horizontalOffset;
                        y += verticalOffset;
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
                    }
                });
            };
            Rectangle.prototype._overlayLabel = function (labelXRange, labelYRange, datumIndex, datasetIndex, dataToDraw) {
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
            Rectangle._X2_KEY = "x2";
            Rectangle._Y2_KEY = "y2";
            return Rectangle;
        })(Plottable.XYPlot);
        Plots.Rectangle = Rectangle;
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
