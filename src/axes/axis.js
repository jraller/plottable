var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Axis = (function (_super) {
        __extends(Axis, _super);
        /**
         * Constructs an Axis.
         * An Axis is a visual representation of a Scale.
         *
         * @constructor
         * @param {Scale} scale
         * @param {string} orientation One of "top"/"bottom"/"left"/"right".
         */
        function Axis(scale, orientation) {
            var _this = this;
            _super.call(this);
            this._endTickLength = 5;
            this._innerTickLength = 5;
            this._tickLabelPadding = 10;
            this._margin = 15;
            this._showEndTickLabels = false;
            this._annotationsEnabled = false;
            this._annotationTierCount = 1;
            if (scale == null || orientation == null) {
                throw new Error("Axis requires a scale and orientation");
            }
            this._scale = scale;
            this.orientation(orientation);
            this._setDefaultAlignment();
            this.addClass("axis");
            if (this._isHorizontal()) {
                this.addClass("x-axis");
            }
            else {
                this.addClass("y-axis");
            }
            this.formatter(Plottable.Formatters.identity());
            this._rescaleCallback = function (newScale) { return _this._rescale(); };
            this._scale.onUpdate(this._rescaleCallback);
            this._annotatedTicks = [];
            this._annotationFormatter = Plottable.Formatters.identity();
        }
        Axis.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._scale.offUpdate(this._rescaleCallback);
        };
        Axis.prototype._isHorizontal = function () {
            return this._orientation === "top" || this._orientation === "bottom";
        };
        Axis.prototype._computeWidth = function () {
            // to be overridden by subclass logic
            return this._maxLabelTickLength();
        };
        Axis.prototype._computeHeight = function () {
            // to be overridden by subclass logic
            return this._maxLabelTickLength();
        };
        Axis.prototype.requestedSpace = function (offeredWidth, offeredHeight) {
            var requestedWidth = 0;
            var requestedHeight = 0;
            if (this._isHorizontal()) {
                requestedHeight = this._computeHeight() + this._margin;
                if (this.annotationsEnabled()) {
                    var tierHeight = this._annotationMeasurer.measure().height + 2 * Axis._ANNOTATION_LABEL_PADDING;
                    requestedHeight += tierHeight * this.annotationTierCount();
                }
            }
            else {
                requestedWidth = this._computeWidth() + this._margin;
                if (this.annotationsEnabled()) {
                    var tierHeight = this._annotationMeasurer.measure().height + 2 * Axis._ANNOTATION_LABEL_PADDING;
                    requestedWidth += tierHeight * this.annotationTierCount();
                }
            }
            return {
                minWidth: requestedWidth,
                minHeight: requestedHeight
            };
        };
        Axis.prototype.fixedHeight = function () {
            return this._isHorizontal();
        };
        Axis.prototype.fixedWidth = function () {
            return !this._isHorizontal();
        };
        Axis.prototype._rescale = function () {
            // default implementation; subclasses may call redraw() here
            this.render();
        };
        Axis.prototype.computeLayout = function (origin, availableWidth, availableHeight) {
            _super.prototype.computeLayout.call(this, origin, availableWidth, availableHeight);
            if (this._isHorizontal()) {
                this._scale.range([0, this.width()]);
            }
            else {
                this._scale.range([this.height(), 0]);
            }
            return this;
        };
        Axis.prototype._setup = function () {
            _super.prototype._setup.call(this);
            this._tickMarkContainer = this.content().append("g")
                .classed(Axis.TICK_MARK_CLASS + "-container", true);
            this._tickLabelContainer = this.content().append("g")
                .classed(Axis.TICK_LABEL_CLASS + "-container", true);
            this._baseline = this.content().append("line").classed("baseline", true);
            this._annotationContainer = this.content().append("g")
                .classed("annotation-container", true);
            this._annotationContainer.append("g").classed("annotation-line-container", true);
            this._annotationContainer.append("g").classed("annotation-circle-container", true);
            this._annotationContainer.append("g").classed("annotation-rect-container", true);
            var annotationLabelContainer = this._annotationContainer.append("g").classed("annotation-label-container", true);
            this._annotationMeasurer = new SVGTypewriter.Measurers.Measurer(annotationLabelContainer);
            this._annotationWriter = new SVGTypewriter.Writers.Writer(this._annotationMeasurer);
        };
        /*
         * Function for generating tick values in data-space (as opposed to pixel values).
         * To be implemented by subclasses.
         */
        Axis.prototype._getTickValues = function () {
            return [];
        };
        Axis.prototype.renderImmediately = function () {
            var tickMarkValues = this._getTickValues();
            var tickMarks = this._tickMarkContainer.selectAll("." + Axis.TICK_MARK_CLASS).data(tickMarkValues);
            tickMarks.enter().append("line").classed(Axis.TICK_MARK_CLASS, true);
            tickMarks.attr(this._generateTickMarkAttrHash());
            d3.select(tickMarks[0][0]).classed(Axis.END_TICK_MARK_CLASS, true)
                .attr(this._generateTickMarkAttrHash(true));
            d3.select(tickMarks[0][tickMarkValues.length - 1]).classed(Axis.END_TICK_MARK_CLASS, true)
                .attr(this._generateTickMarkAttrHash(true));
            tickMarks.exit().remove();
            this._baseline.attr(this._generateBaselineAttrHash());
            if (this.annotationsEnabled()) {
                this._drawAnnotations();
            }
            else {
                this._removeAnnotations();
            }
            return this;
        };
        Axis.prototype.annotatedTicks = function (annotatedTicks) {
            if (annotatedTicks == null) {
                return this._annotatedTicks;
            }
            this._annotatedTicks = annotatedTicks;
            this.render();
            return this;
        };
        Axis.prototype.annotationFormatter = function (annotationFormatter) {
            if (annotationFormatter == null) {
                return this._annotationFormatter;
            }
            this._annotationFormatter = annotationFormatter;
            this.render();
            return this;
        };
        Axis.prototype.annotationsEnabled = function (annotationsEnabled) {
            if (annotationsEnabled == null) {
                return this._annotationsEnabled;
            }
            this._annotationsEnabled = annotationsEnabled;
            this.redraw();
            return this;
        };
        Axis.prototype.annotationTierCount = function (annotationTierCount) {
            if (annotationTierCount == null) {
                return this._annotationTierCount;
            }
            if (annotationTierCount < 0) {
                throw new Error("annotationTierCount cannot be negative");
            }
            this._annotationTierCount = annotationTierCount;
            this.redraw();
            return this;
        };
        Axis.prototype._drawAnnotations = function () {
            var _this = this;
            var labelPadding = Axis._ANNOTATION_LABEL_PADDING;
            var measurements = new Plottable.Utils.Map();
            var annotatedTicks = this._annotatedTicksToRender();
            annotatedTicks.forEach(function (annotatedTick) {
                var measurement = _this._annotationMeasurer.measure(_this.annotationFormatter()(annotatedTick));
                var paddedMeasurement = { width: measurement.width + 2 * labelPadding, height: measurement.height + 2 * labelPadding };
                measurements.set(annotatedTick, paddedMeasurement);
            });
            var tierHeight = this._annotationMeasurer.measure().height + 2 * labelPadding;
            var annotationToTier = this._annotationToTier(measurements);
            var hiddenAnnotations = new Plottable.Utils.Set();
            var axisHeight = this._isHorizontal() ? this.height() : this.width();
            var axisHeightWithoutMarginAndAnnotations = this._coreSize();
            var numTiers = Math.min(this.annotationTierCount(), Math.floor((axisHeight - axisHeightWithoutMarginAndAnnotations) / tierHeight));
            annotationToTier.forEach(function (tier, annotation) {
                if (tier === -1 || tier >= numTiers) {
                    hiddenAnnotations.add(annotation);
                }
            });
            var bindElements = function (selection, elementName, className) {
                var elements = selection.selectAll("." + className).data(annotatedTicks);
                elements.enter().append(elementName).classed(className, true);
                elements.exit().remove();
                return elements;
            };
            var offsetF = function (d) {
                switch (_this.orientation()) {
                    case "bottom":
                    case "right":
                        return annotationToTier.get(d) * tierHeight + axisHeightWithoutMarginAndAnnotations;
                    case "top":
                    case "left":
                        return axisHeight - axisHeightWithoutMarginAndAnnotations - annotationToTier.get(d) * tierHeight;
                }
            };
            var positionF = function (d) { return _this._scale.scale(d); };
            var visibilityF = function (d) { return hiddenAnnotations.has(d) ? "hidden" : "visible"; };
            var secondaryPosition;
            switch (this.orientation()) {
                case "bottom":
                case "right":
                    secondaryPosition = 0;
                    break;
                case "top":
                    secondaryPosition = this.height();
                    break;
                case "left":
                    secondaryPosition = this.width();
                    break;
            }
            var isHorizontal = this._isHorizontal();
            bindElements(this._annotationContainer.select(".annotation-line-container"), "line", Axis.ANNOTATION_LINE_CLASS)
                .attr({
                x1: isHorizontal ? positionF : secondaryPosition,
                x2: isHorizontal ? positionF : offsetF,
                y1: isHorizontal ? secondaryPosition : positionF,
                y2: isHorizontal ? offsetF : positionF,
                visibility: visibilityF
            });
            bindElements(this._annotationContainer.select(".annotation-circle-container"), "circle", Axis.ANNOTATION_CIRCLE_CLASS)
                .attr({
                cx: isHorizontal ? positionF : secondaryPosition,
                cy: isHorizontal ? secondaryPosition : positionF,
                r: 3
            });
            var rectangleOffsetF = function (d) {
                switch (_this.orientation()) {
                    case "bottom":
                    case "right":
                        return offsetF(d);
                    case "top":
                    case "left":
                        return offsetF(d) - measurements.get(d).height;
                }
            };
            bindElements(this._annotationContainer.select(".annotation-rect-container"), "rect", Axis.ANNOTATION_RECT_CLASS)
                .attr({
                x: isHorizontal ? positionF : rectangleOffsetF,
                y: isHorizontal ? rectangleOffsetF : positionF,
                width: isHorizontal ? function (d) { return measurements.get(d).width; } : function (d) { return measurements.get(d).height; },
                height: isHorizontal ? function (d) { return measurements.get(d).height; } : function (d) { return measurements.get(d).width; },
                visibility: visibilityF
            });
            var annotationWriter = this._annotationWriter;
            var annotationFormatter = this.annotationFormatter();
            var annotationLabels = bindElements(this._annotationContainer.select(".annotation-label-container"), "g", Axis.ANNOTATION_LABEL_CLASS);
            annotationLabels.selectAll(".text-container").remove();
            annotationLabels.attr({
                transform: function (d) {
                    var xTranslate = isHorizontal ? positionF(d) : rectangleOffsetF(d);
                    var yTranslate = isHorizontal ? rectangleOffsetF(d) : positionF(d);
                    return "translate(" + xTranslate + "," + yTranslate + ")";
                },
                visibility: visibilityF
            })
                .each(function (annotationLabel) {
                var writeOptions = {
                    selection: d3.select(this),
                    xAlign: "center",
                    yAlign: "center",
                    textRotation: isHorizontal ? 0 : 90
                };
                annotationWriter.write(annotationFormatter(annotationLabel), isHorizontal ? measurements.get(annotationLabel).width : measurements.get(annotationLabel).height, isHorizontal ? measurements.get(annotationLabel).height : measurements.get(annotationLabel).width, writeOptions);
            });
        };
        Axis.prototype._annotatedTicksToRender = function () {
            var _this = this;
            var scaleRange = this._scale.range();
            return Plottable.Utils.Array.uniq(this.annotatedTicks().filter(function (tick) {
                if (tick == null) {
                    return false;
                }
                return Plottable.Utils.Math.inRange(_this._scale.scale(tick), scaleRange[0], scaleRange[1]);
            }));
        };
        /**
         * Retrieves the size of the core pieces.
         *
         * The core pieces include the labels, the end tick marks, the inner tick marks, and the tick label padding.
         */
        Axis.prototype._coreSize = function () {
            var relevantDimension = this._isHorizontal() ? this.height() : this.width();
            var axisHeightWithoutMargin = this._isHorizontal() ? this._computeHeight() : this._computeWidth();
            return Math.min(axisHeightWithoutMargin, relevantDimension);
        };
        Axis.prototype._annotationTierHeight = function () {
            return this._annotationMeasurer.measure().height + 2 * Axis._ANNOTATION_LABEL_PADDING;
        };
        Axis.prototype._annotationToTier = function (measurements) {
            var _this = this;
            var annotationTiers = [[]];
            var annotationToTier = new Plottable.Utils.Map();
            var dimension = this._isHorizontal() ? this.width() : this.height();
            this._annotatedTicksToRender().forEach(function (annotatedTick) {
                var position = _this._scale.scale(annotatedTick);
                var length = measurements.get(annotatedTick).width;
                if (position < 0 || position + length > dimension) {
                    annotationToTier.set(annotatedTick, -1);
                    return;
                }
                var tierHasCollision = function (testTier) { return annotationTiers[testTier].some(function (testTick) {
                    var testPosition = _this._scale.scale(testTick);
                    var testLength = measurements.get(testTick).width;
                    return position + length >= testPosition && position <= testPosition + testLength;
                }); };
                var tier = 0;
                while (tierHasCollision(tier)) {
                    tier++;
                    if (annotationTiers.length === tier) {
                        annotationTiers.push([]);
                    }
                }
                annotationTiers[tier].push(annotatedTick);
                annotationToTier.set(annotatedTick, tier);
            });
            return annotationToTier;
        };
        Axis.prototype._removeAnnotations = function () {
            this._annotationContainer.selectAll(".annotation-line").remove();
            this._annotationContainer.selectAll(".annotation-circle").remove();
            this._annotationContainer.selectAll(".annotation-rect").remove();
            this._annotationContainer.selectAll(".annotation-label").remove();
        };
        Axis.prototype._generateBaselineAttrHash = function () {
            var baselineAttrHash = {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
            };
            switch (this._orientation) {
                case "bottom":
                    baselineAttrHash["x2"] = this.width();
                    break;
                case "top":
                    baselineAttrHash["x2"] = this.width();
                    baselineAttrHash["y1"] = this.height();
                    baselineAttrHash["y2"] = this.height();
                    break;
                case "left":
                    baselineAttrHash["x1"] = this.width();
                    baselineAttrHash["x2"] = this.width();
                    baselineAttrHash["y2"] = this.height();
                    break;
                case "right":
                    baselineAttrHash["y2"] = this.height();
                    break;
            }
            return baselineAttrHash;
        };
        Axis.prototype._generateTickMarkAttrHash = function (isEndTickMark) {
            var _this = this;
            if (isEndTickMark === void 0) { isEndTickMark = false; }
            var tickMarkAttrHash = {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
            };
            var scalingFunction = function (d) { return _this._scale.scale(d); };
            if (this._isHorizontal()) {
                tickMarkAttrHash["x1"] = scalingFunction;
                tickMarkAttrHash["x2"] = scalingFunction;
            }
            else {
                tickMarkAttrHash["y1"] = scalingFunction;
                tickMarkAttrHash["y2"] = scalingFunction;
            }
            var tickLength = isEndTickMark ? this._endTickLength : this._innerTickLength;
            switch (this._orientation) {
                case "bottom":
                    tickMarkAttrHash["y2"] = tickLength;
                    break;
                case "top":
                    tickMarkAttrHash["y1"] = this.height();
                    tickMarkAttrHash["y2"] = this.height() - tickLength;
                    break;
                case "left":
                    tickMarkAttrHash["x1"] = this.width();
                    tickMarkAttrHash["x2"] = this.width() - tickLength;
                    break;
                case "right":
                    tickMarkAttrHash["x2"] = tickLength;
                    break;
            }
            return tickMarkAttrHash;
        };
        Axis.prototype._setDefaultAlignment = function () {
            switch (this._orientation) {
                case "bottom":
                    this.yAlignment("top");
                    break;
                case "top":
                    this.yAlignment("bottom");
                    break;
                case "left":
                    this.xAlignment("right");
                    break;
                case "right":
                    this.xAlignment("left");
                    break;
            }
        };
        Axis.prototype.formatter = function (formatter) {
            if (formatter == null) {
                return this._formatter;
            }
            this._formatter = formatter;
            this.redraw();
            return this;
        };
        Axis.prototype.innerTickLength = function (length) {
            if (length == null) {
                return this._innerTickLength;
            }
            else {
                if (length < 0) {
                    throw new Error("inner tick length must be positive");
                }
                this._innerTickLength = length;
                this.redraw();
                return this;
            }
        };
        Axis.prototype.endTickLength = function (length) {
            if (length == null) {
                return this._endTickLength;
            }
            else {
                if (length < 0) {
                    throw new Error("end tick length must be positive");
                }
                this._endTickLength = length;
                this.redraw();
                return this;
            }
        };
        Axis.prototype._maxLabelTickLength = function () {
            if (this.showEndTickLabels()) {
                return Math.max(this.innerTickLength(), this.endTickLength());
            }
            else {
                return this.innerTickLength();
            }
        };
        Axis.prototype.tickLabelPadding = function (padding) {
            if (padding == null) {
                return this._tickLabelPadding;
            }
            else {
                if (padding < 0) {
                    throw new Error("tick label padding must be positive");
                }
                this._tickLabelPadding = padding;
                this.redraw();
                return this;
            }
        };
        Axis.prototype.margin = function (size) {
            if (size == null) {
                return this._margin;
            }
            else {
                if (size < 0) {
                    throw new Error("margin size must be positive");
                }
                this._margin = size;
                this.redraw();
                return this;
            }
        };
        Axis.prototype.orientation = function (orientation) {
            if (orientation == null) {
                return this._orientation;
            }
            else {
                var newOrientationLC = orientation.toLowerCase();
                if (newOrientationLC !== "top" &&
                    newOrientationLC !== "bottom" &&
                    newOrientationLC !== "left" &&
                    newOrientationLC !== "right") {
                    throw new Error("unsupported orientation");
                }
                this._orientation = newOrientationLC;
                this.redraw();
                return this;
            }
        };
        Axis.prototype.showEndTickLabels = function (show) {
            if (show == null) {
                return this._showEndTickLabels;
            }
            this._showEndTickLabels = show;
            this.render();
            return this;
        };
        /**
         * The css class applied to each end tick mark (the line on the end tick).
         */
        Axis.END_TICK_MARK_CLASS = "end-tick-mark";
        /**
         * The css class applied to each tick mark (the line on the tick).
         */
        Axis.TICK_MARK_CLASS = "tick-mark";
        /**
         * The css class applied to each tick label (the text associated with the tick).
         */
        Axis.TICK_LABEL_CLASS = "tick-label";
        /**
         * The css class applied to each annotation line, which extends from the axis to the rect.
         */
        Axis.ANNOTATION_LINE_CLASS = "annotation-line";
        /**
         * The css class applied to each annotation rect, which surrounds the annotation label.
         */
        Axis.ANNOTATION_RECT_CLASS = "annotation-rect";
        /**
         * The css class applied to each annotation circle, which denotes which tick is being annotated.
         */
        Axis.ANNOTATION_CIRCLE_CLASS = "annotation-circle";
        /**
         * The css class applied to each annotation label, which shows the formatted annotation text.
         */
        Axis.ANNOTATION_LABEL_CLASS = "annotation-label";
        Axis._ANNOTATION_LABEL_PADDING = 4;
        return Axis;
    })(Plottable.Component);
    Plottable.Axis = Axis;
})(Plottable || (Plottable = {}));
