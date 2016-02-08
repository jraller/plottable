var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var Line = (function (_super) {
            __extends(Line, _super);
            /**
             * A Line Plot draws line segments starting from the first data point to the next.
             *
             * @constructor
             */
            function Line() {
                _super.call(this);
                this._interpolator = "linear";
                this._autorangeSmooth = false;
                this._croppedRenderingEnabled = true;
                this._downsamplingEnabled = false;
                this.addClass("line-plot");
                var animator = new Plottable.Animators.Easing();
                animator.stepDuration(Plottable.Plot._ANIMATION_MAX_DURATION);
                animator.easingMode("exp-in-out");
                animator.maxTotalDuration(Plottable.Plot._ANIMATION_MAX_DURATION);
                this.animator(Plots.Animator.MAIN, animator);
                this.attr("stroke", new Plottable.Scales.Color().range()[0]);
                this.attr("stroke-width", "2px");
            }
            Line.prototype.x = function (x, xScale) {
                if (x == null) {
                    return _super.prototype.x.call(this);
                }
                else {
                    if (xScale == null) {
                        _super.prototype.x.call(this, x);
                    }
                    else {
                        _super.prototype.x.call(this, x, xScale);
                    }
                    this._setScaleSnapping();
                    return this;
                }
            };
            Line.prototype.y = function (y, yScale) {
                if (y == null) {
                    return _super.prototype.y.call(this);
                }
                else {
                    _super.prototype.y.call(this, y, yScale);
                    this._setScaleSnapping();
                    return this;
                }
            };
            Line.prototype.autorangeMode = function (autorangeMode) {
                if (autorangeMode == null) {
                    return _super.prototype.autorangeMode.call(this);
                }
                _super.prototype.autorangeMode.call(this, autorangeMode);
                this._setScaleSnapping();
                return this;
            };
            Line.prototype.autorangeSmooth = function (autorangeSmooth) {
                if (autorangeSmooth == null) {
                    return this._autorangeSmooth;
                }
                this._autorangeSmooth = autorangeSmooth;
                this._setScaleSnapping();
                return this;
            };
            Line.prototype._setScaleSnapping = function () {
                if (this.autorangeMode() === "x" && this.x() && this.x().scale && this.x().scale instanceof Plottable.QuantitativeScale) {
                    this.x().scale.snappingDomainEnabled(!this.autorangeSmooth());
                }
                if (this.autorangeMode() === "y" && this.y() && this.y().scale && this.y().scale instanceof Plottable.QuantitativeScale) {
                    this.y().scale.snappingDomainEnabled(!this.autorangeSmooth());
                }
            };
            Line.prototype.interpolator = function (interpolator) {
                if (interpolator == null) {
                    return this._interpolator;
                }
                this._interpolator = interpolator;
                this.render();
                return this;
            };
            Line.prototype.downsamplingEnabled = function (downsampling) {
                if (downsampling == null) {
                    return this._downsamplingEnabled;
                }
                this._downsamplingEnabled = downsampling;
                return this;
            };
            Line.prototype.croppedRenderingEnabled = function (croppedRendering) {
                if (croppedRendering == null) {
                    return this._croppedRenderingEnabled;
                }
                this._croppedRenderingEnabled = croppedRendering;
                this.render();
                return this;
            };
            Line.prototype._createDrawer = function (dataset) {
                return new Plottable.Drawers.Line(dataset);
            };
            Line.prototype._extentsForProperty = function (property) {
                var extents = _super.prototype._extentsForProperty.call(this, property);
                if (!this._autorangeSmooth) {
                    return extents;
                }
                if (this.autorangeMode() !== property) {
                    return extents;
                }
                if (this.autorangeMode() !== "x" && this.autorangeMode() !== "y") {
                    return extents;
                }
                var edgeIntersectionPoints = this._getEdgeIntersectionPoints();
                var includedValues;
                if (this.autorangeMode() === "y") {
                    includedValues = edgeIntersectionPoints.left.concat(edgeIntersectionPoints.right).map(function (point) { return point.y; });
                }
                else {
                    includedValues = edgeIntersectionPoints.top.concat(edgeIntersectionPoints.bottom).map(function (point) { return point.x; });
                }
                return extents.map(function (extent) { return d3.extent(d3.merge([extent, includedValues])); });
            };
            Line.prototype._getEdgeIntersectionPoints = function () {
                var _this = this;
                if (!(this.y().scale instanceof Plottable.QuantitativeScale && this.x().scale instanceof Plottable.QuantitativeScale)) {
                    return {
                        left: [],
                        right: [],
                        top: [],
                        bottom: []
                    };
                }
                var yScale = this.y().scale;
                var xScale = this.x().scale;
                var intersectionPoints = {
                    left: [],
                    right: [],
                    top: [],
                    bottom: []
                };
                var leftX = xScale.scale(xScale.domain()[0]);
                var rightX = xScale.scale(xScale.domain()[1]);
                var bottomY = yScale.scale(yScale.domain()[0]);
                var topY = yScale.scale(yScale.domain()[1]);
                this.datasets().forEach(function (dataset) {
                    var data = dataset.data();
                    var x1, x2, y1, y2;
                    var prevX, prevY, currX, currY;
                    for (var i = 1; i < data.length; i++) {
                        prevX = currX || xScale.scale(_this.x().accessor(data[i - 1], i - 1, dataset));
                        prevY = currY || yScale.scale(_this.y().accessor(data[i - 1], i - 1, dataset));
                        currX = xScale.scale(_this.x().accessor(data[i], i, dataset));
                        currY = yScale.scale(_this.y().accessor(data[i], i, dataset));
                        // If values crossed left edge
                        if ((prevX < leftX) === (leftX <= currX)) {
                            x1 = leftX - prevX;
                            x2 = currX - prevX;
                            y2 = currY - prevY;
                            y1 = x1 * y2 / x2;
                            intersectionPoints.left.push({
                                x: leftX,
                                y: yScale.invert(prevY + y1)
                            });
                        }
                        // If values crossed right edge
                        if ((prevX < rightX) === (rightX <= currX)) {
                            x1 = rightX - prevX;
                            x2 = currX - prevX;
                            y2 = currY - prevY;
                            y1 = x1 * y2 / x2;
                            intersectionPoints.right.push({
                                x: rightX,
                                y: yScale.invert(prevY + y1)
                            });
                        }
                        // If values crossed upper edge
                        if ((prevY < topY) === (topY <= currY)) {
                            x2 = currX - prevX;
                            y1 = topY - prevY;
                            y2 = currY - prevY;
                            x1 = y1 * x2 / y2;
                            intersectionPoints.top.push({
                                x: xScale.invert(prevX + x1),
                                y: topY
                            });
                        }
                        // If values crossed lower edge
                        if ((prevY < bottomY) === (bottomY <= currY)) {
                            x2 = currX - prevX;
                            y1 = bottomY - prevY;
                            y2 = currY - prevY;
                            x1 = y1 * x2 / y2;
                            intersectionPoints.bottom.push({
                                x: xScale.invert(prevX + x1),
                                y: bottomY
                            });
                        }
                    }
                    ;
                });
                return intersectionPoints;
            };
            Line.prototype._getResetYFunction = function () {
                // gets the y-value generator for the animation start point
                var yDomain = this.y().scale.domain();
                var domainMax = Math.max(yDomain[0], yDomain[1]);
                var domainMin = Math.min(yDomain[0], yDomain[1]);
                // start from zero, or the closest domain value to zero
                // avoids lines zooming on from offscreen.
                var startValue = (domainMax < 0 && domainMax) || (domainMin > 0 && domainMin) || 0;
                var scaledStartValue = this.y().scale.scale(startValue);
                return function (d, i, dataset) { return scaledStartValue; };
            };
            Line.prototype._generateDrawSteps = function () {
                var drawSteps = [];
                if (this._animateOnNextRender()) {
                    var attrToProjector = this._generateAttrToProjector();
                    attrToProjector["d"] = this._constructLineProjector(Plottable.Plot._scaledAccessor(this.x()), this._getResetYFunction());
                    drawSteps.push({ attrToProjector: attrToProjector, animator: this._getAnimator(Plots.Animator.RESET) });
                }
                drawSteps.push({ attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator(Plots.Animator.MAIN) });
                return drawSteps;
            };
            Line.prototype._generateAttrToProjector = function () {
                var attrToProjector = _super.prototype._generateAttrToProjector.call(this);
                Object.keys(attrToProjector).forEach(function (attribute) {
                    if (attribute === "d") {
                        return;
                    }
                    var projector = attrToProjector[attribute];
                    attrToProjector[attribute] = function (data, i, dataset) {
                        return data.length > 0 ? projector(data[0], i, dataset) : null;
                    };
                });
                return attrToProjector;
            };
            /**
             * Returns the PlotEntity nearest to the query point by X then by Y, or undefined if no PlotEntity can be found.
             *
             * @param {Point} queryPoint
             * @returns {PlotEntity} The nearest PlotEntity, or undefined if no PlotEntity can be found.
             */
            Line.prototype.entityNearest = function (queryPoint) {
                var _this = this;
                var minXDist = Infinity;
                var minYDist = Infinity;
                var closest;
                this.entities().forEach(function (entity) {
                    if (!_this._entityVisibleOnPlot(entity.position, entity.datum, entity.index, entity.dataset)) {
                        return;
                    }
                    var xDist = Math.abs(queryPoint.x - entity.position.x);
                    var yDist = Math.abs(queryPoint.y - entity.position.y);
                    if (xDist < minXDist || xDist === minXDist && yDist < minYDist) {
                        closest = entity;
                        minXDist = xDist;
                        minYDist = yDist;
                    }
                });
                return closest;
            };
            Line.prototype._propertyProjectors = function () {
                var propertyToProjectors = _super.prototype._propertyProjectors.call(this);
                propertyToProjectors["d"] = this._constructLineProjector(Plottable.Plot._scaledAccessor(this.x()), Plottable.Plot._scaledAccessor(this.y()));
                return propertyToProjectors;
            };
            Line.prototype._constructLineProjector = function (xProjector, yProjector) {
                var _this = this;
                var definedProjector = function (d, i, dataset) {
                    var positionX = Plottable.Plot._scaledAccessor(_this.x())(d, i, dataset);
                    var positionY = Plottable.Plot._scaledAccessor(_this.y())(d, i, dataset);
                    return positionX != null && !Plottable.Utils.Math.isNaN(positionX) &&
                        positionY != null && !Plottable.Utils.Math.isNaN(positionY);
                };
                return function (datum, index, dataset) {
                    return d3.svg.line()
                        .x(function (innerDatum, innerIndex) { return xProjector(innerDatum, innerIndex, dataset); })
                        .y(function (innerDatum, innerIndex) { return yProjector(innerDatum, innerIndex, dataset); })
                        .interpolate(_this.interpolator())
                        .defined(function (innerDatum, innerIndex) { return definedProjector(innerDatum, innerIndex, dataset); })(datum);
                };
            };
            Line.prototype._getDataToDraw = function () {
                var _this = this;
                var dataToDraw = new Plottable.Utils.Map();
                this.datasets().forEach(function (dataset) {
                    var data = dataset.data();
                    if (!_this._croppedRenderingEnabled && !_this._downsamplingEnabled) {
                        dataToDraw.set(dataset, [data]);
                        return;
                    }
                    var filteredDataIndices = data.map(function (d, i) { return i; });
                    if (_this._croppedRenderingEnabled) {
                        filteredDataIndices = _this._filterCroppedRendering(dataset, filteredDataIndices);
                    }
                    if (_this._downsamplingEnabled) {
                        filteredDataIndices = _this._filterDownsampling(dataset, filteredDataIndices);
                    }
                    dataToDraw.set(dataset, [filteredDataIndices.map(function (d, i) { return data[d]; })]);
                });
                return dataToDraw;
            };
            Line.prototype._filterCroppedRendering = function (dataset, indices) {
                var _this = this;
                var xProjector = Plottable.Plot._scaledAccessor(this.x());
                var yProjector = Plottable.Plot._scaledAccessor(this.y());
                var data = dataset.data();
                var filteredDataIndices = [];
                var pointInViewport = function (x, y) {
                    return Plottable.Utils.Math.inRange(x, 0, _this.width()) &&
                        Plottable.Utils.Math.inRange(y, 0, _this.height());
                };
                for (var i = 0; i < indices.length; i++) {
                    var currXPoint = xProjector(data[indices[i]], indices[i], dataset);
                    var currYPoint = yProjector(data[indices[i]], indices[i], dataset);
                    var shouldShow = pointInViewport(currXPoint, currYPoint);
                    if (!shouldShow && indices[i - 1] != null && data[indices[i - 1]] != null) {
                        var prevXPoint = xProjector(data[indices[i - 1]], indices[i - 1], dataset);
                        var prevYPoint = yProjector(data[indices[i - 1]], indices[i - 1], dataset);
                        shouldShow = shouldShow || pointInViewport(prevXPoint, prevYPoint);
                    }
                    if (!shouldShow && indices[i + 1] != null && data[indices[i + 1]] != null) {
                        var nextXPoint = xProjector(data[indices[i + 1]], indices[i + 1], dataset);
                        var nextYPoint = yProjector(data[indices[i + 1]], indices[i + 1], dataset);
                        shouldShow = shouldShow || pointInViewport(nextXPoint, nextYPoint);
                    }
                    if (shouldShow) {
                        filteredDataIndices.push(indices[i]);
                    }
                }
                return filteredDataIndices;
            };
            Line.prototype._filterDownsampling = function (dataset, indices) {
                if (indices.length === 0) {
                    return [];
                }
                var data = dataset.data();
                var scaledXAccessor = Plottable.Plot._scaledAccessor(this.x());
                var scaledYAccessor = Plottable.Plot._scaledAccessor(this.y());
                var filteredIndices = [indices[0]];
                var indexOnCurrentSlope = function (i, currentSlope) {
                    var p1x = scaledXAccessor(data[indices[i]], indices[i], dataset);
                    var p1y = scaledYAccessor(data[indices[i]], indices[i], dataset);
                    var p2x = scaledXAccessor(data[indices[i + 1]], indices[i + 1], dataset);
                    var p2y = scaledYAccessor(data[indices[i + 1]], indices[i + 1], dataset);
                    if (currentSlope === Infinity) {
                        return Math.floor(p1x) === Math.floor(p2x);
                    }
                    else {
                        var expectedP2y = p1y + (p2x - p1x) * currentSlope;
                        return Math.floor(p2y) === Math.floor(expectedP2y);
                    }
                };
                for (var i = 0; i < indices.length - 1;) {
                    var indexFirst = indices[i];
                    var p1x = scaledXAccessor(data[indices[i]], indices[i], dataset);
                    var p1y = scaledYAccessor(data[indices[i]], indices[i], dataset);
                    var p2x = scaledXAccessor(data[indices[i + 1]], indices[i + 1], dataset);
                    var p2y = scaledYAccessor(data[indices[i + 1]], indices[i + 1], dataset);
                    var currentSlope = (Math.floor(p1x) === Math.floor(p2x)) ? Infinity : (p2y - p1y) / (p2x - p1x);
                    var indexMin = indices[i];
                    var minScaledValue = (currentSlope === Infinity) ? p1y : p1x;
                    var indexMax = indexMin;
                    var maxScaledValue = minScaledValue;
                    var firstIndexOnCurrentSlope = true;
                    while (i < indices.length - 1 && (firstIndexOnCurrentSlope || indexOnCurrentSlope(i, currentSlope))) {
                        i++;
                        firstIndexOnCurrentSlope = false;
                        var currScaledValue = currentSlope === Infinity ? scaledYAccessor(data[indices[i]], indices[i], dataset) :
                            scaledXAccessor(data[indices[i]], indices[i], dataset);
                        if (currScaledValue > maxScaledValue) {
                            maxScaledValue = currScaledValue;
                            indexMax = indices[i];
                        }
                        if (currScaledValue < minScaledValue) {
                            minScaledValue = currScaledValue;
                            indexMin = indices[i];
                        }
                    }
                    var indexLast = indices[i];
                    if (indexMin !== indexFirst) {
                        filteredIndices.push(indexMin);
                    }
                    if (indexMax !== indexMin && indexMax !== indexFirst) {
                        filteredIndices.push(indexMax);
                    }
                    if (indexLast !== indexFirst && indexLast !== indexMin && indexLast !== indexMax) {
                        filteredIndices.push(indexLast);
                    }
                }
                return filteredIndices;
            };
            return Line;
        })(Plottable.XYPlot);
        Plots.Line = Line;
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
