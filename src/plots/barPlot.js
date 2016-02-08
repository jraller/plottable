var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var Bar = (function (_super) {
            __extends(Bar, _super);
            /**
             * A Bar Plot draws bars growing out from a baseline to some value
             *
             * @constructor
             * @param {string} [orientation="vertical"] One of "vertical"/"horizontal".
             */
            function Bar(orientation) {
                var _this = this;
                if (orientation === void 0) { orientation = Bar.ORIENTATION_VERTICAL; }
                _super.call(this);
                this._labelFormatter = Plottable.Formatters.identity();
                this._labelsEnabled = false;
                this._hideBarsIfAnyAreTooWide = true;
                this._barPixelWidth = 0;
                this.addClass("bar-plot");
                if (orientation !== Bar.ORIENTATION_VERTICAL && orientation !== Bar.ORIENTATION_HORIZONTAL) {
                    throw new Error(orientation + " is not a valid orientation for Plots.Bar");
                }
                this._isVertical = orientation === Bar.ORIENTATION_VERTICAL;
                this.animator("baseline", new Plottable.Animators.Null());
                this.attr("fill", new Plottable.Scales.Color().range()[0]);
                this.attr("width", function () { return _this._barPixelWidth; });
                this._labelConfig = new Plottable.Utils.Map();
                this._baselineValueProvider = function () { return [_this.baselineValue()]; };
                this._updateBarPixelWidthCallback = function () { return _this._updateBarPixelWidth(); };
            }
            Bar.prototype.x = function (x, xScale) {
                if (x == null) {
                    return _super.prototype.x.call(this);
                }
                if (xScale == null) {
                    _super.prototype.x.call(this, x);
                }
                else {
                    _super.prototype.x.call(this, x, xScale);
                    xScale.onUpdate(this._updateBarPixelWidthCallback);
                }
                this._updateValueScale();
                return this;
            };
            Bar.prototype.y = function (y, yScale) {
                if (y == null) {
                    return _super.prototype.y.call(this);
                }
                if (yScale == null) {
                    _super.prototype.y.call(this, y);
                }
                else {
                    _super.prototype.y.call(this, y, yScale);
                    yScale.onUpdate(this._updateBarPixelWidthCallback);
                }
                this._updateValueScale();
                return this;
            };
            /**
             * Gets the orientation of the plot
             *
             * @return "vertical" | "horizontal"
             */
            Bar.prototype.orientation = function () {
                return this._isVertical ? Bar.ORIENTATION_VERTICAL : Bar.ORIENTATION_HORIZONTAL;
            };
            Bar.prototype.render = function () {
                this._updateBarPixelWidth();
                this._updateExtents();
                _super.prototype.render.call(this);
                return this;
            };
            Bar.prototype._createDrawer = function (dataset) {
                return new Plottable.Drawers.Rectangle(dataset);
            };
            Bar.prototype._setup = function () {
                _super.prototype._setup.call(this);
                this._baseline = this._renderArea.append("line").classed("baseline", true);
            };
            Bar.prototype.baselineValue = function (value) {
                if (value == null) {
                    if (this._baselineValue != null) {
                        return this._baselineValue;
                    }
                    if (!this._projectorsReady()) {
                        return 0;
                    }
                    var valueScale = this._isVertical ? this.y().scale : this.x().scale;
                    if (!valueScale) {
                        return 0;
                    }
                    if (valueScale instanceof Plottable.Scales.Time) {
                        return new Date(0);
                    }
                    return 0;
                }
                this._baselineValue = value;
                this._updateValueScale();
                this.render();
                return this;
            };
            Bar.prototype.addDataset = function (dataset) {
                _super.prototype.addDataset.call(this, dataset);
                this._updateBarPixelWidth();
                return this;
            };
            Bar.prototype._addDataset = function (dataset) {
                dataset.onUpdate(this._updateBarPixelWidthCallback);
                _super.prototype._addDataset.call(this, dataset);
                return this;
            };
            Bar.prototype.removeDataset = function (dataset) {
                dataset.offUpdate(this._updateBarPixelWidthCallback);
                _super.prototype.removeDataset.call(this, dataset);
                this._updateBarPixelWidth();
                return this;
            };
            Bar.prototype._removeDataset = function (dataset) {
                dataset.offUpdate(this._updateBarPixelWidthCallback);
                _super.prototype._removeDataset.call(this, dataset);
                return this;
            };
            Bar.prototype.datasets = function (datasets) {
                if (datasets == null) {
                    return _super.prototype.datasets.call(this);
                }
                _super.prototype.datasets.call(this, datasets);
                this._updateBarPixelWidth();
                return this;
            };
            Bar.prototype.labelsEnabled = function (enabled) {
                if (enabled == null) {
                    return this._labelsEnabled;
                }
                else {
                    this._labelsEnabled = enabled;
                    this.render();
                    return this;
                }
            };
            Bar.prototype.labelFormatter = function (formatter) {
                if (formatter == null) {
                    return this._labelFormatter;
                }
                else {
                    this._labelFormatter = formatter;
                    this.render();
                    return this;
                }
            };
            Bar.prototype._createNodesForDataset = function (dataset) {
                var drawer = _super.prototype._createNodesForDataset.call(this, dataset);
                drawer.renderArea().classed(Bar._BAR_AREA_CLASS, true);
                var labelArea = this._renderArea.append("g").classed(Bar._LABEL_AREA_CLASS, true);
                var measurer = new SVGTypewriter.Measurers.CacheCharacterMeasurer(labelArea);
                var writer = new SVGTypewriter.Writers.Writer(measurer);
                this._labelConfig.set(dataset, { labelArea: labelArea, measurer: measurer, writer: writer });
                return drawer;
            };
            Bar.prototype._removeDatasetNodes = function (dataset) {
                _super.prototype._removeDatasetNodes.call(this, dataset);
                var labelConfig = this._labelConfig.get(dataset);
                if (labelConfig != null) {
                    labelConfig.labelArea.remove();
                    this._labelConfig.delete(dataset);
                }
            };
            /**
             * Returns the PlotEntity nearest to the query point according to the following algorithm:
             *   - If the query point is inside a bar, returns the PlotEntity for that bar.
             *   - Otherwise, gets the nearest PlotEntity by the primary direction (X for vertical, Y for horizontal),
             *     breaking ties with the secondary direction.
             * Returns undefined if no PlotEntity can be found.
             *
             * @param {Point} queryPoint
             * @returns {PlotEntity} The nearest PlotEntity, or undefined if no PlotEntity can be found.
             */
            Bar.prototype.entityNearest = function (queryPoint) {
                var _this = this;
                var minPrimaryDist = Infinity;
                var minSecondaryDist = Infinity;
                var queryPtPrimary = this._isVertical ? queryPoint.x : queryPoint.y;
                var queryPtSecondary = this._isVertical ? queryPoint.y : queryPoint.x;
                // SVGRects are positioned with sub-pixel accuracy (the default unit
                // for the x, y, height & width attributes), but user selections (e.g. via
                // mouse events) usually have pixel accuracy. We add a tolerance of 0.5 pixels.
                var tolerance = 0.5;
                var closest;
                this.entities().forEach(function (entity) {
                    if (!_this._entityVisibleOnPlot(entity.position, entity.datum, entity.index, entity.dataset)) {
                        return;
                    }
                    var primaryDist = 0;
                    var secondaryDist = 0;
                    var plotPt = entity.position;
                    // if we're inside a bar, distance in both directions should stay 0
                    var barBBox = Plottable.Utils.DOM.elementBBox(entity.selection);
                    if (!Plottable.Utils.DOM.intersectsBBox(queryPoint.x, queryPoint.y, barBBox, tolerance)) {
                        var plotPtPrimary = _this._isVertical ? plotPt.x : plotPt.y;
                        primaryDist = Math.abs(queryPtPrimary - plotPtPrimary);
                        // compute this bar's min and max along the secondary axis
                        var barMinSecondary = _this._isVertical ? barBBox.y : barBBox.x;
                        var barMaxSecondary = barMinSecondary + (_this._isVertical ? barBBox.height : barBBox.width);
                        if (queryPtSecondary >= barMinSecondary - tolerance && queryPtSecondary <= barMaxSecondary + tolerance) {
                            // if we're within a bar's secondary axis span, it is closest in that direction
                            secondaryDist = 0;
                        }
                        else {
                            var plotPtSecondary = _this._isVertical ? plotPt.y : plotPt.x;
                            secondaryDist = Math.abs(queryPtSecondary - plotPtSecondary);
                        }
                    }
                    // if we find a closer bar, record its distance and start new closest lists
                    if (primaryDist < minPrimaryDist
                        || primaryDist === minPrimaryDist && secondaryDist < minSecondaryDist) {
                        closest = entity;
                        minPrimaryDist = primaryDist;
                        minSecondaryDist = secondaryDist;
                    }
                });
                return closest;
            };
            Bar.prototype._entityVisibleOnPlot = function (pixelPoint, datum, index, dataset) {
                var xRange = { min: 0, max: this.width() };
                var yRange = { min: 0, max: this.height() };
                var attrToProjector = this._generateAttrToProjector();
                var barBBox = {
                    x: attrToProjector["x"](datum, index, dataset),
                    y: attrToProjector["y"](datum, index, dataset),
                    width: attrToProjector["width"](datum, index, dataset),
                    height: attrToProjector["height"](datum, index, dataset)
                };
                return Plottable.Utils.DOM.intersectsBBox(xRange, yRange, barBBox);
            };
            /**
             * Gets the Entities at a particular Point.
             *
             * @param {Point} p
             * @returns {PlotEntity[]}
             */
            Bar.prototype.entitiesAt = function (p) {
                return this._entitiesIntersecting(p.x, p.y);
            };
            Bar.prototype.entitiesIn = function (xRangeOrBounds, yRange) {
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
            Bar.prototype._entitiesIntersecting = function (xValOrRange, yValOrRange) {
                var intersected = [];
                this.entities().forEach(function (entity) {
                    if (Plottable.Utils.DOM.intersectsBBox(xValOrRange, yValOrRange, Plottable.Utils.DOM.elementBBox(entity.selection))) {
                        intersected.push(entity);
                    }
                });
                return intersected;
            };
            Bar.prototype._updateValueScale = function () {
                if (!this._projectorsReady()) {
                    return;
                }
                var valueScale = this._isVertical ? this.y().scale : this.x().scale;
                if (valueScale instanceof Plottable.QuantitativeScale) {
                    var qscale = valueScale;
                    qscale.addPaddingExceptionsProvider(this._baselineValueProvider);
                    qscale.addIncludedValuesProvider(this._baselineValueProvider);
                }
            };
            Bar.prototype._additionalPaint = function (time) {
                var _this = this;
                var primaryScale = this._isVertical ? this.y().scale : this.x().scale;
                var scaledBaseline = primaryScale.scale(this.baselineValue());
                var baselineAttr = {
                    "x1": this._isVertical ? 0 : scaledBaseline,
                    "y1": this._isVertical ? scaledBaseline : 0,
                    "x2": this._isVertical ? this.width() : scaledBaseline,
                    "y2": this._isVertical ? scaledBaseline : this.height()
                };
                this._getAnimator("baseline").animate(this._baseline, baselineAttr);
                this.datasets().forEach(function (dataset) { return _this._labelConfig.get(dataset).labelArea.selectAll("g").remove(); });
                if (this._labelsEnabled) {
                    Plottable.Utils.Window.setTimeout(function () { return _this._drawLabels(); }, time);
                }
            };
            /**
             * Makes sure the extent takes into account the widths of the bars
             */
            Bar.prototype._extentsForProperty = function (property) {
                var _this = this;
                var extents = _super.prototype._extentsForProperty.call(this, property);
                var accScaleBinding;
                if (property === "x" && this._isVertical) {
                    accScaleBinding = this.x();
                }
                else if (property === "y" && !this._isVertical) {
                    accScaleBinding = this.y();
                }
                else {
                    return extents;
                }
                if (!(accScaleBinding && accScaleBinding.scale && accScaleBinding.scale instanceof Plottable.QuantitativeScale)) {
                    return extents;
                }
                var scale = accScaleBinding.scale;
                // To account for inverted domains
                extents = extents.map(function (extent) { return d3.extent([
                    scale.invert(scale.scale(extent[0]) - _this._barPixelWidth / 2),
                    scale.invert(scale.scale(extent[0]) + _this._barPixelWidth / 2),
                    scale.invert(scale.scale(extent[1]) - _this._barPixelWidth / 2),
                    scale.invert(scale.scale(extent[1]) + _this._barPixelWidth / 2)
                ]); });
                return extents;
            };
            Bar.prototype._drawLabels = function () {
                var _this = this;
                var dataToDraw = this._getDataToDraw();
                var labelsTooWide = false;
                this.datasets().forEach(function (dataset) { return labelsTooWide = labelsTooWide || _this._drawLabel(dataToDraw.get(dataset), dataset); });
                if (this._hideBarsIfAnyAreTooWide && labelsTooWide) {
                    this.datasets().forEach(function (dataset) { return _this._labelConfig.get(dataset).labelArea.selectAll("g").remove(); });
                }
            };
            Bar.prototype._drawLabel = function (data, dataset) {
                var _this = this;
                var attrToProjector = this._generateAttrToProjector();
                var labelConfig = this._labelConfig.get(dataset);
                var labelArea = labelConfig.labelArea;
                var measurer = labelConfig.measurer;
                var writer = labelConfig.writer;
                var drawLabel = function (d, i) {
                    var valueAccessor = _this._isVertical ? _this.y().accessor : _this.x().accessor;
                    var value = valueAccessor(d, i, dataset);
                    var valueScale = _this._isVertical ? _this.y().scale : _this.x().scale;
                    var scaledValue = valueScale != null ? valueScale.scale(value) : value;
                    var scaledBaseline = valueScale != null ? valueScale.scale(_this.baselineValue()) : _this.baselineValue();
                    var barWidth = attrToProjector["width"](d, i, dataset);
                    var barHeight = attrToProjector["height"](d, i, dataset);
                    var text = _this._labelFormatter(valueAccessor(d, i, dataset));
                    var measurement = measurer.measure(text);
                    var xAlignment = "center";
                    var yAlignment = "center";
                    var labelContainerOrigin = {
                        x: attrToProjector["x"](d, i, dataset),
                        y: attrToProjector["y"](d, i, dataset)
                    };
                    var containerWidth = barWidth;
                    var containerHeight = barHeight;
                    var labelOrigin = {
                        x: labelContainerOrigin.x,
                        y: labelContainerOrigin.y
                    };
                    var showLabelOnBar;
                    if (_this._isVertical) {
                        labelOrigin.x += containerWidth / 2 - measurement.width / 2;
                        var barY = attrToProjector["y"](d, i, dataset);
                        var effectiveBarHeight = barHeight;
                        if (barY + barHeight > _this.height()) {
                            effectiveBarHeight = _this.height() - barY;
                        }
                        else if (barY < 0) {
                            effectiveBarHeight = barY + barHeight;
                        }
                        var offset = Bar._LABEL_VERTICAL_PADDING;
                        showLabelOnBar = measurement.height + 2 * offset <= effectiveBarHeight;
                        if (showLabelOnBar) {
                            if (scaledValue < scaledBaseline) {
                                labelContainerOrigin.y += offset;
                                yAlignment = "top";
                                labelOrigin.y += offset;
                            }
                            else {
                                labelContainerOrigin.y -= offset;
                                yAlignment = "bottom";
                                labelOrigin.y += containerHeight - offset - measurement.height;
                            }
                        }
                        else {
                            containerHeight = barHeight + offset + measurement.height;
                            if (scaledValue <= scaledBaseline) {
                                labelContainerOrigin.y -= offset + measurement.height;
                                yAlignment = "top";
                                labelOrigin.y -= offset + measurement.height;
                            }
                            else {
                                yAlignment = "bottom";
                                labelOrigin.y += barHeight + offset;
                            }
                        }
                    }
                    else {
                        labelOrigin.y += containerHeight / 2 - measurement.height / 2;
                        var barX = attrToProjector["x"](d, i, dataset);
                        var effectiveBarWidth = barWidth;
                        if (barX + barWidth > _this.width()) {
                            effectiveBarWidth = _this.width() - barX;
                        }
                        else if (barX < 0) {
                            effectiveBarWidth = barX + barWidth;
                        }
                        var offset = Bar._LABEL_HORIZONTAL_PADDING;
                        showLabelOnBar = measurement.width + 2 * offset <= effectiveBarWidth;
                        if (showLabelOnBar) {
                            if (scaledValue < scaledBaseline) {
                                labelContainerOrigin.x += offset;
                                xAlignment = "left";
                                labelOrigin.x += offset;
                            }
                            else {
                                labelContainerOrigin.x -= offset;
                                xAlignment = "right";
                                labelOrigin.x += containerWidth - offset - measurement.width;
                            }
                        }
                        else {
                            containerWidth = barWidth + offset + measurement.width;
                            if (scaledValue < scaledBaseline) {
                                labelContainerOrigin.x -= offset + measurement.width;
                                xAlignment = "left";
                                labelOrigin.x -= offset + measurement.width;
                            }
                            else {
                                xAlignment = "right";
                                labelOrigin.x += barWidth + offset;
                            }
                        }
                    }
                    var labelContainer = labelArea.append("g").attr("transform", "translate(" + labelContainerOrigin.x + ", " + labelContainerOrigin.y + ")");
                    if (showLabelOnBar) {
                        labelContainer.classed("on-bar-label", true);
                        var color = attrToProjector["fill"](d, i, dataset);
                        var dark = Plottable.Utils.Color.contrast("white", color) * 1.6 < Plottable.Utils.Color.contrast("black", color);
                        labelContainer.classed(dark ? "dark-label" : "light-label", true);
                    }
                    else {
                        labelContainer.classed("off-bar-label", true);
                    }
                    var hideLabel = labelOrigin.x < 0 ||
                        labelOrigin.y < 0 ||
                        labelOrigin.x + measurement.width > _this.width() ||
                        labelOrigin.y + measurement.height > _this.height();
                    labelContainer.style("visibility", hideLabel ? "hidden" : "inherit");
                    var writeOptions = {
                        selection: labelContainer,
                        xAlign: xAlignment,
                        yAlign: yAlignment,
                        textRotation: 0
                    };
                    writer.write(text, containerWidth, containerHeight, writeOptions);
                    var tooWide = _this._isVertical ? barWidth < measurement.width : barHeight < measurement.height;
                    return tooWide;
                };
                var labelTooWide = data.map(drawLabel);
                return labelTooWide.some(function (d) { return d; });
            };
            Bar.prototype._generateDrawSteps = function () {
                var drawSteps = [];
                if (this._animateOnNextRender()) {
                    var resetAttrToProjector = this._generateAttrToProjector();
                    var primaryScale = this._isVertical ? this.y().scale : this.x().scale;
                    var scaledBaseline = primaryScale.scale(this.baselineValue());
                    var positionAttr = this._isVertical ? "y" : "x";
                    var dimensionAttr = this._isVertical ? "height" : "width";
                    resetAttrToProjector[positionAttr] = function () { return scaledBaseline; };
                    resetAttrToProjector[dimensionAttr] = function () { return 0; };
                    drawSteps.push({ attrToProjector: resetAttrToProjector, animator: this._getAnimator(Plots.Animator.RESET) });
                }
                drawSteps.push({ attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator(Plots.Animator.MAIN) });
                return drawSteps;
            };
            Bar.prototype._generateAttrToProjector = function () {
                // Primary scale/direction: the "length" of the bars
                // Secondary scale/direction: the "width" of the bars
                var attrToProjector = _super.prototype._generateAttrToProjector.call(this);
                var primaryScale = this._isVertical ? this.y().scale : this.x().scale;
                var primaryAttr = this._isVertical ? "y" : "x";
                var secondaryAttr = this._isVertical ? "x" : "y";
                var scaledBaseline = primaryScale.scale(this.baselineValue());
                var positionF = this._isVertical ? Plottable.Plot._scaledAccessor(this.x()) : Plottable.Plot._scaledAccessor(this.y());
                var widthF = attrToProjector["width"];
                var originalPositionFn = this._isVertical ? Plottable.Plot._scaledAccessor(this.y()) : Plottable.Plot._scaledAccessor(this.x());
                var heightF = function (d, i, dataset) {
                    return Math.abs(scaledBaseline - originalPositionFn(d, i, dataset));
                };
                attrToProjector["width"] = this._isVertical ? widthF : heightF;
                attrToProjector["height"] = this._isVertical ? heightF : widthF;
                attrToProjector[secondaryAttr] = function (d, i, dataset) {
                    return positionF(d, i, dataset) - widthF(d, i, dataset) / 2;
                };
                attrToProjector[primaryAttr] = function (d, i, dataset) {
                    var originalPos = originalPositionFn(d, i, dataset);
                    // If it is past the baseline, it should start at the baselin then width/height
                    // carries it over. If it's not past the baseline, leave it at original position and
                    // then width/height carries it to baseline
                    return (originalPos > scaledBaseline) ? scaledBaseline : originalPos;
                };
                return attrToProjector;
            };
            /**
             * Computes the barPixelWidth of all the bars in the plot.
             *
             * If the position scale of the plot is a CategoryScale and in bands mode, then the rangeBands function will be used.
             * If the position scale of the plot is a QuantitativeScale, then the bar width is equal to the smallest distance between
             * two adjacent data points, padded for visualisation.
             */
            Bar.prototype._getBarPixelWidth = function () {
                if (!this._projectorsReady()) {
                    return 0;
                }
                var barPixelWidth;
                var barScale = this._isVertical ? this.x().scale : this.y().scale;
                if (barScale instanceof Plottable.Scales.Category) {
                    barPixelWidth = barScale.rangeBand();
                }
                else {
                    var barAccessor = this._isVertical ? this.x().accessor : this.y().accessor;
                    var numberBarAccessorData = d3.set(Plottable.Utils.Array.flatten(this.datasets().map(function (dataset) {
                        return dataset.data().map(function (d, i) { return barAccessor(d, i, dataset); })
                            .filter(function (d) { return d != null; })
                            .map(function (d) { return d.valueOf(); });
                    }))).values().map(function (value) { return +value; });
                    numberBarAccessorData.sort(function (a, b) { return a - b; });
                    var scaledData = numberBarAccessorData.map(function (datum) { return barScale.scale(datum); });
                    var barAccessorDataPairs = d3.pairs(scaledData);
                    var barWidthDimension = this._isVertical ? this.width() : this.height();
                    barPixelWidth = Plottable.Utils.Math.min(barAccessorDataPairs, function (pair, i) {
                        return Math.abs(pair[1] - pair[0]);
                    }, barWidthDimension * Bar._SINGLE_BAR_DIMENSION_RATIO);
                    barPixelWidth *= Bar._BAR_WIDTH_RATIO;
                }
                return barPixelWidth;
            };
            Bar.prototype._updateBarPixelWidth = function () {
                this._barPixelWidth = this._getBarPixelWidth();
            };
            Bar.prototype.entities = function (datasets) {
                if (datasets === void 0) { datasets = this.datasets(); }
                if (!this._projectorsReady()) {
                    return [];
                }
                var entities = _super.prototype.entities.call(this, datasets);
                return entities;
            };
            Bar.prototype._pixelPoint = function (datum, index, dataset) {
                var attrToProjector = this._generateAttrToProjector();
                var rectX = attrToProjector["x"](datum, index, dataset);
                var rectY = attrToProjector["y"](datum, index, dataset);
                var rectWidth = attrToProjector["width"](datum, index, dataset);
                var rectHeight = attrToProjector["height"](datum, index, dataset);
                var x;
                var y;
                var originalPosition = (this._isVertical ? Plottable.Plot._scaledAccessor(this.y()) : Plottable.Plot._scaledAccessor(this.x()))(datum, index, dataset);
                var scaledBaseline = (this._isVertical ? this.y().scale : this.x().scale).scale(this.baselineValue());
                if (this._isVertical) {
                    x = rectX + rectWidth / 2;
                    y = originalPosition <= scaledBaseline ? rectY : rectY + rectHeight;
                }
                else {
                    x = originalPosition >= scaledBaseline ? rectX + rectWidth : rectX;
                    y = rectY + rectHeight / 2;
                }
                return { x: x, y: y };
            };
            Bar.prototype._uninstallScaleForKey = function (scale, key) {
                scale.offUpdate(this._updateBarPixelWidthCallback);
                _super.prototype._uninstallScaleForKey.call(this, scale, key);
            };
            Bar.prototype._getDataToDraw = function () {
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
            Bar.ORIENTATION_VERTICAL = "vertical";
            Bar.ORIENTATION_HORIZONTAL = "horizontal";
            Bar._BAR_WIDTH_RATIO = 0.95;
            Bar._SINGLE_BAR_DIMENSION_RATIO = 0.4;
            Bar._BAR_AREA_CLASS = "bar-area";
            Bar._LABEL_AREA_CLASS = "bar-label-text-area";
            Bar._LABEL_VERTICAL_PADDING = 5;
            Bar._LABEL_HORIZONTAL_PADDING = 5;
            return Bar;
        })(Plottable.XYPlot);
        Plots.Bar = Bar;
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
