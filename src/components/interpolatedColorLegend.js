var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Components;
    (function (Components) {
        var InterpolatedColorLegend = (function (_super) {
            __extends(InterpolatedColorLegend, _super);
            /**
             * Creates an InterpolatedColorLegend.
             *
             * The InterpolatedColorLegend consists of a sequence of swatches that show the
             * associated InterpolatedColor Scale sampled at various points.
             * Two labels show the maximum and minimum values of the InterpolatedColor Scale.
             *
             * @constructor
             * @param {Scales.InterpolatedColor} interpolatedColorScale
             */
            function InterpolatedColorLegend(interpolatedColorScale) {
                var _this = this;
                _super.call(this);
                this._textPadding = 5;
                if (interpolatedColorScale == null) {
                    throw new Error("InterpolatedColorLegend requires a interpolatedColorScale");
                }
                this._scale = interpolatedColorScale;
                this._redrawCallback = function (scale) { return _this.redraw(); };
                this._scale.onUpdate(this._redrawCallback);
                this._formatter = Plottable.Formatters.general();
                this._orientation = "horizontal";
                this._expands = false;
                this.addClass("legend");
                this.addClass("interpolated-color-legend");
            }
            InterpolatedColorLegend.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                this._scale.offUpdate(this._redrawCallback);
            };
            InterpolatedColorLegend.prototype.formatter = function (formatter) {
                if (formatter === undefined) {
                    return this._formatter;
                }
                this._formatter = formatter;
                this.redraw();
                return this;
            };
            InterpolatedColorLegend.prototype.expands = function (expands) {
                if (expands == null) {
                    return this._expands;
                }
                this._expands = expands;
                this.redraw();
                return this;
            };
            InterpolatedColorLegend._ensureOrientation = function (orientation) {
                orientation = orientation.toLowerCase();
                if (orientation === "horizontal" || orientation === "left" || orientation === "right") {
                    return orientation;
                }
                else {
                    throw new Error("\"" + orientation + "\" is not a valid orientation for InterpolatedColorLegend");
                }
            };
            InterpolatedColorLegend.prototype.orientation = function (orientation) {
                if (orientation == null) {
                    return this._orientation;
                }
                else {
                    this._orientation = InterpolatedColorLegend._ensureOrientation(orientation);
                    this.redraw();
                    return this;
                }
            };
            InterpolatedColorLegend.prototype.fixedWidth = function () {
                return !this.expands() || this._isVertical();
            };
            InterpolatedColorLegend.prototype.fixedHeight = function () {
                return !this.expands() || !this._isVertical();
            };
            InterpolatedColorLegend.prototype._generateTicks = function (numSwatches) {
                if (numSwatches === void 0) { numSwatches = InterpolatedColorLegend._DEFAULT_NUM_SWATCHES; }
                var domain = this._scale.domain();
                if (numSwatches === 1) {
                    return [domain[0]];
                }
                var slope = (domain[1] - domain[0]) / (numSwatches - 1);
                var ticks = [];
                for (var i = 0; i < numSwatches; i++) {
                    ticks.push(domain[0] + slope * i);
                }
                return ticks;
            };
            InterpolatedColorLegend.prototype._setup = function () {
                _super.prototype._setup.call(this);
                this._swatchContainer = this.content().append("g").classed("swatch-container", true);
                this._swatchBoundingBox = this.content().append("rect").classed("swatch-bounding-box", true);
                this._lowerLabel = this.content().append("g").classed(InterpolatedColorLegend.LEGEND_LABEL_CLASS, true);
                this._upperLabel = this.content().append("g").classed(InterpolatedColorLegend.LEGEND_LABEL_CLASS, true);
                this._measurer = new SVGTypewriter.Measurers.Measurer(this.content());
                this._wrapper = new SVGTypewriter.Wrappers.Wrapper();
                this._writer = new SVGTypewriter.Writers.Writer(this._measurer, this._wrapper);
            };
            InterpolatedColorLegend.prototype.requestedSpace = function (offeredWidth, offeredHeight) {
                var _this = this;
                var textHeight = this._measurer.measure().height;
                var padding = textHeight;
                var domain = this._scale.domain();
                var labelWidths = domain.map(function (d) { return _this._measurer.measure(_this._formatter(d)).width; });
                var desiredHeight;
                var desiredWidth;
                var numSwatches = InterpolatedColorLegend._DEFAULT_NUM_SWATCHES;
                if (this._isVertical()) {
                    var longestWidth = Plottable.Utils.Math.max(labelWidths, 0);
                    desiredWidth = padding + textHeight + this._textPadding + longestWidth + this._textPadding;
                    desiredHeight = numSwatches * textHeight;
                }
                else {
                    desiredHeight = padding + textHeight + padding;
                    desiredWidth = this._textPadding + labelWidths[0] + numSwatches * textHeight
                        + labelWidths[1] + this._textPadding;
                }
                return {
                    minWidth: desiredWidth,
                    minHeight: desiredHeight
                };
            };
            InterpolatedColorLegend.prototype._isVertical = function () {
                return this._orientation !== "horizontal";
            };
            InterpolatedColorLegend.prototype.renderImmediately = function () {
                var _this = this;
                _super.prototype.renderImmediately.call(this);
                var domain = this._scale.domain();
                var text0 = this._formatter(domain[0]);
                var text0Width = this._measurer.measure(text0).width;
                var text1 = this._formatter(domain[1]);
                var text1Width = this._measurer.measure(text1).width;
                var textHeight = this._measurer.measure().height;
                var textPadding = this._textPadding;
                var upperLabelShift = { x: 0, y: 0 };
                var lowerLabelShift = { x: 0, y: 0 };
                var lowerWriteOptions = {
                    selection: this._lowerLabel,
                    xAlign: "center",
                    yAlign: "center",
                    textRotation: 0
                };
                var upperWriteOptions = {
                    selection: this._upperLabel,
                    xAlign: "center",
                    yAlign: "center",
                    textRotation: 0
                };
                var swatchWidth;
                var swatchHeight;
                var swatchX;
                var swatchY;
                var boundingBoxAttr = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
                var padding;
                var numSwatches;
                if (this._isVertical()) {
                    numSwatches = Math.floor(this.height());
                    var longestTextWidth = Math.max(text0Width, text1Width);
                    padding = (this.width() - longestTextWidth - 2 * this._textPadding) / 2;
                    swatchWidth = Math.max(this.width() - padding - 2 * textPadding - longestTextWidth, 0);
                    swatchHeight = 1;
                    swatchY = function (d, i) { return _this.height() - (i + 1); };
                    upperWriteOptions.yAlign = "top";
                    upperLabelShift.y = 0;
                    lowerWriteOptions.yAlign = "bottom";
                    lowerLabelShift.y = 0;
                    if (this._orientation === "left") {
                        swatchX = function (d, i) { return textPadding + longestTextWidth + textPadding; };
                        upperWriteOptions.xAlign = "right";
                        upperLabelShift.x = -(padding + swatchWidth + textPadding);
                        lowerWriteOptions.xAlign = "right";
                        lowerLabelShift.x = -(padding + swatchWidth + textPadding);
                    }
                    else {
                        swatchX = function (d, i) { return padding; };
                        upperWriteOptions.xAlign = "left";
                        upperLabelShift.x = padding + swatchWidth + textPadding;
                        lowerWriteOptions.xAlign = "left";
                        lowerLabelShift.x = padding + swatchWidth + textPadding;
                    }
                    boundingBoxAttr["width"] = swatchWidth;
                    boundingBoxAttr["height"] = numSwatches * swatchHeight;
                }
                else {
                    padding = Math.max(textPadding, (this.height() - textHeight) / 2);
                    numSwatches = Math.max(Math.floor(this.width() - textPadding * 4 - text0Width - text1Width), 0);
                    swatchWidth = 1;
                    swatchHeight = Math.max((this.height() - 2 * padding), 0);
                    swatchX = function (d, i) { return Math.floor(text0Width + 2 * textPadding) + i; };
                    swatchY = function (d, i) { return padding; };
                    upperWriteOptions.xAlign = "right";
                    upperLabelShift.x = -textPadding;
                    lowerWriteOptions.xAlign = "left";
                    lowerLabelShift.x = textPadding;
                    boundingBoxAttr["y"] = padding;
                    boundingBoxAttr["width"] = numSwatches * swatchWidth;
                    boundingBoxAttr["height"] = swatchHeight;
                }
                boundingBoxAttr["x"] = swatchX(null, 0); // position of the first swatch
                this._upperLabel.text(""); // clear the upper label
                this._writer.write(text1, this.width(), this.height(), upperWriteOptions);
                var upperTranslateString = "translate(" + upperLabelShift.x + ", " + upperLabelShift.y + ")";
                this._upperLabel.attr("transform", upperTranslateString);
                this._lowerLabel.text(""); // clear the lower label
                this._writer.write(text0, this.width(), this.height(), lowerWriteOptions);
                var lowerTranslateString = "translate(" + lowerLabelShift.x + ", " + lowerLabelShift.y + ")";
                this._lowerLabel.attr("transform", lowerTranslateString);
                this._swatchBoundingBox.attr(boundingBoxAttr);
                var ticks = this._generateTicks(numSwatches);
                var swatches = this._swatchContainer.selectAll("rect.swatch").data(ticks);
                var rects = swatches.enter().append("rect").classed("swatch", true);
                swatches.exit().remove();
                swatches.attr({
                    "fill": function (d, i) { return _this._scale.scale(d); },
                    "width": swatchWidth,
                    "height": swatchHeight,
                    "x": swatchX,
                    "y": swatchY,
                    "shape-rendering": "crispEdges"
                });
                if (Plottable.Configs.ADD_TITLE_ELEMENTS) {
                    rects.append("title").text(function (d) { return _this._formatter(d); });
                }
                return this;
            };
            InterpolatedColorLegend._DEFAULT_NUM_SWATCHES = 11;
            /**
             * The css class applied to the legend labels.
             */
            InterpolatedColorLegend.LEGEND_LABEL_CLASS = "legend-label";
            return InterpolatedColorLegend;
        })(Plottable.Component);
        Components.InterpolatedColorLegend = InterpolatedColorLegend;
    })(Components = Plottable.Components || (Plottable.Components = {}));
})(Plottable || (Plottable = {}));
