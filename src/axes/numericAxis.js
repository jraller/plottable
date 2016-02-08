var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Axes;
    (function (Axes) {
        var Numeric = (function (_super) {
            __extends(Numeric, _super);
            /**
             * Constructs a Numeric Axis.
             *
             * A Numeric Axis is a visual representation of a QuantitativeScale.
             *
             * @constructor
             * @param {QuantitativeScale} scale
             * @param {string} orientation One of "top"/"bottom"/"left"/"right".
             */
            function Numeric(scale, orientation) {
                _super.call(this, scale, orientation);
                this._tickLabelPositioning = "center";
                this._usesTextWidthApproximation = false;
                this.formatter(Plottable.Formatters.general());
            }
            Numeric.prototype._setup = function () {
                _super.prototype._setup.call(this);
                this._measurer = new SVGTypewriter.Measurers.Measurer(this._tickLabelContainer, Plottable.Axis.TICK_LABEL_CLASS);
                this._wrapper = new SVGTypewriter.Wrappers.Wrapper().maxLines(1);
            };
            Numeric.prototype._computeWidth = function () {
                var maxTextWidth = this._usesTextWidthApproximation ? this._computeApproximateTextWidth() : this._computeExactTextWidth();
                if (this._tickLabelPositioning === "center") {
                    return this._maxLabelTickLength() + this.tickLabelPadding() + maxTextWidth;
                }
                else {
                    return Math.max(this._maxLabelTickLength(), this.tickLabelPadding() + maxTextWidth);
                }
            };
            Numeric.prototype._computeExactTextWidth = function () {
                var _this = this;
                var tickValues = this._getTickValues();
                var textLengths = tickValues.map(function (v) {
                    var formattedValue = _this.formatter()(v);
                    return _this._measurer.measure(formattedValue).width;
                });
                return Plottable.Utils.Math.max(textLengths, 0);
            };
            Numeric.prototype._computeApproximateTextWidth = function () {
                var _this = this;
                var tickValues = this._getTickValues();
                var mWidth = this._measurer.measure("M").width;
                var textLengths = tickValues.map(function (v) {
                    var formattedValue = _this.formatter()(v);
                    return formattedValue.length * mWidth;
                });
                return Plottable.Utils.Math.max(textLengths, 0);
            };
            Numeric.prototype._computeHeight = function () {
                var textHeight = this._measurer.measure().height;
                if (this._tickLabelPositioning === "center") {
                    return this._maxLabelTickLength() + this.tickLabelPadding() + textHeight;
                }
                else {
                    return Math.max(this._maxLabelTickLength(), this.tickLabelPadding() + textHeight);
                }
            };
            Numeric.prototype._getTickValues = function () {
                var scale = this._scale;
                var domain = scale.domain();
                var min = domain[0] <= domain[1] ? domain[0] : domain[1];
                var max = domain[0] >= domain[1] ? domain[0] : domain[1];
                if (min === domain[0]) {
                    return scale.ticks().filter(function (i) { return i >= min && i <= max; });
                }
                else {
                    return scale.ticks().filter(function (i) { return i >= min && i <= max; }).reverse();
                }
            };
            Numeric.prototype._rescale = function () {
                if (!this._isSetup) {
                    return;
                }
                if (!this._isHorizontal()) {
                    var reComputedWidth = this._computeWidth();
                    if (reComputedWidth > this.width() || reComputedWidth < (this.width() - this.margin())) {
                        this.redraw();
                        return;
                    }
                }
                this.render();
            };
            Numeric.prototype.renderImmediately = function () {
                var _this = this;
                _super.prototype.renderImmediately.call(this);
                var tickLabelAttrHash = {
                    x: 0,
                    y: 0,
                    dx: "0em",
                    dy: "0.3em"
                };
                var tickMarkLength = this._maxLabelTickLength();
                var tickLabelPadding = this.tickLabelPadding();
                var tickLabelTextAnchor = "middle";
                var labelGroupTransformX = 0;
                var labelGroupTransformY = 0;
                var labelGroupShiftX = 0;
                var labelGroupShiftY = 0;
                if (this._isHorizontal()) {
                    switch (this._tickLabelPositioning) {
                        case "left":
                            tickLabelTextAnchor = "end";
                            labelGroupTransformX = -tickLabelPadding;
                            labelGroupShiftY = tickLabelPadding;
                            break;
                        case "center":
                            labelGroupShiftY = tickMarkLength + tickLabelPadding;
                            break;
                        case "right":
                            tickLabelTextAnchor = "start";
                            labelGroupTransformX = tickLabelPadding;
                            labelGroupShiftY = tickLabelPadding;
                            break;
                    }
                }
                else {
                    switch (this._tickLabelPositioning) {
                        case "top":
                            tickLabelAttrHash["dy"] = "-0.3em";
                            labelGroupShiftX = tickLabelPadding;
                            labelGroupTransformY = -tickLabelPadding;
                            break;
                        case "center":
                            labelGroupShiftX = tickMarkLength + tickLabelPadding;
                            break;
                        case "bottom":
                            tickLabelAttrHash["dy"] = "1em";
                            labelGroupShiftX = tickLabelPadding;
                            labelGroupTransformY = tickLabelPadding;
                            break;
                    }
                }
                var tickMarkAttrHash = this._generateTickMarkAttrHash();
                switch (this.orientation()) {
                    case "bottom":
                        tickLabelAttrHash["x"] = tickMarkAttrHash["x1"];
                        tickLabelAttrHash["dy"] = "0.95em";
                        labelGroupTransformY = tickMarkAttrHash["y1"] + labelGroupShiftY;
                        break;
                    case "top":
                        tickLabelAttrHash["x"] = tickMarkAttrHash["x1"];
                        tickLabelAttrHash["dy"] = "-.25em";
                        labelGroupTransformY = tickMarkAttrHash["y1"] - labelGroupShiftY;
                        break;
                    case "left":
                        tickLabelTextAnchor = "end";
                        labelGroupTransformX = tickMarkAttrHash["x1"] - labelGroupShiftX;
                        tickLabelAttrHash["y"] = tickMarkAttrHash["y1"];
                        break;
                    case "right":
                        tickLabelTextAnchor = "start";
                        labelGroupTransformX = tickMarkAttrHash["x1"] + labelGroupShiftX;
                        tickLabelAttrHash["y"] = tickMarkAttrHash["y1"];
                        break;
                }
                var tickLabelValues = this._getTickValues();
                var tickLabels = this._tickLabelContainer
                    .selectAll("." + Plottable.Axis.TICK_LABEL_CLASS)
                    .data(tickLabelValues);
                tickLabels.enter().append("text").classed(Plottable.Axis.TICK_LABEL_CLASS, true);
                tickLabels.exit().remove();
                tickLabels.style("text-anchor", tickLabelTextAnchor)
                    .style("visibility", "inherit")
                    .attr(tickLabelAttrHash)
                    .text(function (s) { return _this.formatter()(s); });
                var labelGroupTransform = "translate(" + labelGroupTransformX + ", " + labelGroupTransformY + ")";
                this._tickLabelContainer.attr("transform", labelGroupTransform);
                this._showAllTickMarks();
                if (!this.showEndTickLabels()) {
                    this._hideEndTickLabels();
                }
                this._hideOverflowingTickLabels();
                this._hideOverlappingTickLabels();
                if (this._tickLabelPositioning === "bottom" ||
                    this._tickLabelPositioning === "top" ||
                    this._tickLabelPositioning === "left" ||
                    this._tickLabelPositioning === "right") {
                    this._hideTickMarksWithoutLabel();
                }
                return this;
            };
            Numeric.prototype._showAllTickMarks = function () {
                this._tickMarkContainer.selectAll("." + Plottable.Axis.TICK_MARK_CLASS)
                    .each(function () {
                    d3.select(this).style("visibility", "inherit");
                });
            };
            /**
             * Hides the Tick Marks which have no corresponding Tick Labels
             */
            Numeric.prototype._hideTickMarksWithoutLabel = function () {
                var visibleTickMarks = this._tickMarkContainer.selectAll("." + Plottable.Axis.TICK_MARK_CLASS);
                var visibleTickLabels = this._tickLabelContainer
                    .selectAll("." + Plottable.Axis.TICK_LABEL_CLASS)
                    .filter(function (d, i) {
                    var visibility = d3.select(this).style("visibility");
                    return (visibility === "inherit") || (visibility === "visible");
                });
                var labelNumbersShown = [];
                visibleTickLabels.each(function (labelNumber) { return labelNumbersShown.push(labelNumber); });
                visibleTickMarks.each(function (e, i) {
                    if (labelNumbersShown.indexOf(e) === -1) {
                        d3.select(this).style("visibility", "hidden");
                    }
                });
            };
            Numeric.prototype.tickLabelPosition = function (position) {
                if (position == null) {
                    return this._tickLabelPositioning;
                }
                else {
                    var positionLC = position.toLowerCase();
                    if (this._isHorizontal()) {
                        if (!(positionLC === "left" || positionLC === "center" || positionLC === "right")) {
                            throw new Error(positionLC + " is not a valid tick label position for a horizontal NumericAxis");
                        }
                    }
                    else {
                        if (!(positionLC === "top" || positionLC === "center" || positionLC === "bottom")) {
                            throw new Error(positionLC + " is not a valid tick label position for a vertical NumericAxis");
                        }
                    }
                    this._tickLabelPositioning = positionLC;
                    this.redraw();
                    return this;
                }
            };
            Numeric.prototype.usesTextWidthApproximation = function (enable) {
                if (enable == null) {
                    return this._usesTextWidthApproximation;
                }
                else {
                    this._usesTextWidthApproximation = enable;
                    return this;
                }
            };
            Numeric.prototype._hideEndTickLabels = function () {
                var boundingBox = this._boundingBox.node().getBoundingClientRect();
                var tickLabels = this._tickLabelContainer.selectAll("." + Plottable.Axis.TICK_LABEL_CLASS);
                if (tickLabels[0].length === 0) {
                    return;
                }
                var firstTickLabel = tickLabels[0][0];
                if (!Plottable.Utils.DOM.clientRectInside(firstTickLabel.getBoundingClientRect(), boundingBox)) {
                    d3.select(firstTickLabel).style("visibility", "hidden");
                }
                var lastTickLabel = tickLabels[0][tickLabels[0].length - 1];
                if (!Plottable.Utils.DOM.clientRectInside(lastTickLabel.getBoundingClientRect(), boundingBox)) {
                    d3.select(lastTickLabel).style("visibility", "hidden");
                }
            };
            // Responsible for hiding any tick labels that break out of the bounding container
            Numeric.prototype._hideOverflowingTickLabels = function () {
                var boundingBox = this._boundingBox.node().getBoundingClientRect();
                var tickLabels = this._tickLabelContainer.selectAll("." + Plottable.Axis.TICK_LABEL_CLASS);
                if (tickLabels.empty()) {
                    return;
                }
                tickLabels.each(function (d, i) {
                    if (!Plottable.Utils.DOM.clientRectInside(this.getBoundingClientRect(), boundingBox)) {
                        d3.select(this).style("visibility", "hidden");
                    }
                });
            };
            Numeric.prototype._hideOverlappingTickLabels = function () {
                var visibleTickLabels = this._tickLabelContainer
                    .selectAll("." + Plottable.Axis.TICK_LABEL_CLASS)
                    .filter(function (d, i) {
                    var visibility = d3.select(this).style("visibility");
                    return (visibility === "inherit") || (visibility === "visible");
                });
                var visibleTickLabelRects = visibleTickLabels[0].map(function (label) { return label.getBoundingClientRect(); });
                var interval = 1;
                while (!this._hasOverlapWithInterval(interval, visibleTickLabelRects) && interval < visibleTickLabelRects.length) {
                    interval += 1;
                }
                visibleTickLabels.each(function (d, i) {
                    var tickLabel = d3.select(this);
                    if (i % interval !== 0) {
                        tickLabel.style("visibility", "hidden");
                    }
                });
            };
            /**
             * The method is responsible for evenly spacing the labels on the axis.
             * @return test to see if taking every `interval` recrangle from `rects`
             *         will result in labels not overlapping
             *
             * For top, bottom, left, right positioning of the thicks, we want the padding
             * between the labels to be 3x, such that the label will be  `padding` distance
             * from the tick and 2 * `padding` distance (or more) from the next tick
             *
             */
            Numeric.prototype._hasOverlapWithInterval = function (interval, rects) {
                var padding = this.tickLabelPadding();
                if (this._tickLabelPositioning === "bottom" ||
                    this._tickLabelPositioning === "top" ||
                    this._tickLabelPositioning === "left" ||
                    this._tickLabelPositioning === "right") {
                    padding *= 3;
                }
                for (var i = 0; i < rects.length - (interval); i += interval) {
                    var currRect = rects[i];
                    var nextRect = rects[i + interval];
                    if (this._isHorizontal()) {
                        if (currRect.right + padding >= nextRect.left) {
                            return false;
                        }
                    }
                    else {
                        if (currRect.top - padding <= nextRect.bottom) {
                            return false;
                        }
                    }
                }
                return true;
            };
            return Numeric;
        })(Plottable.Axis);
        Axes.Numeric = Numeric;
    })(Axes = Plottable.Axes || (Plottable.Axes = {}));
})(Plottable || (Plottable = {}));
