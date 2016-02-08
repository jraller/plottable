var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Axes;
    (function (Axes) {
        var Category = (function (_super) {
            __extends(Category, _super);
            /**
             * Constructs a Category Axis.
             *
             * A Category Axis is a visual representation of a Category Scale.
             *
             * @constructor
             * @param {Scales.Category} scale
             * @param {string} [orientation="bottom"] One of "top"/"bottom"/"left"/"right".
             */
            function Category(scale, orientation) {
                _super.call(this, scale, orientation);
                this._tickLabelAngle = 0;
                this.addClass("category-axis");
            }
            Category.prototype._setup = function () {
                _super.prototype._setup.call(this);
                this._measurer = new SVGTypewriter.Measurers.CacheCharacterMeasurer(this._tickLabelContainer);
                this._wrapper = new SVGTypewriter.Wrappers.Wrapper();
                this._writer = new SVGTypewriter.Writers.Writer(this._measurer, this._wrapper);
            };
            Category.prototype._rescale = function () {
                return this.redraw();
            };
            Category.prototype.requestedSpace = function (offeredWidth, offeredHeight) {
                var widthRequiredByTicks = this._isHorizontal() ? 0 : this._maxLabelTickLength() + this.tickLabelPadding() + this.margin();
                var heightRequiredByTicks = this._isHorizontal() ? this._maxLabelTickLength() + this.tickLabelPadding() + this.margin() : 0;
                if (this._scale.domain().length === 0) {
                    return {
                        minWidth: 0,
                        minHeight: 0
                    };
                }
                if (this.annotationsEnabled()) {
                    var tierTotalHeight = this._annotationTierHeight() * this.annotationTierCount();
                    if (this._isHorizontal()) {
                        heightRequiredByTicks += tierTotalHeight;
                    }
                    else {
                        widthRequiredByTicks += tierTotalHeight;
                    }
                }
                var categoryScale = this._scale;
                var measureResult = this._measureTicks(offeredWidth, offeredHeight, categoryScale, categoryScale.domain());
                return {
                    minWidth: measureResult.usedWidth + widthRequiredByTicks,
                    minHeight: measureResult.usedHeight + heightRequiredByTicks
                };
            };
            Category.prototype._coreSize = function () {
                var relevantDimension = this._isHorizontal() ? this.height() : this.width();
                var relevantRequestedSpaceDimension = this._isHorizontal() ?
                    this.requestedSpace(this.width(), this.height()).minHeight :
                    this.requestedSpace(this.width(), this.height()).minWidth;
                var marginAndAnnotationSize = this.margin() + this._annotationTierHeight();
                var axisHeightWithoutMargin = relevantRequestedSpaceDimension - marginAndAnnotationSize;
                return Math.min(axisHeightWithoutMargin, relevantDimension);
            };
            Category.prototype._getTickValues = function () {
                return this._scale.domain();
            };
            Category.prototype.tickLabelAngle = function (angle) {
                if (angle == null) {
                    return this._tickLabelAngle;
                }
                if (angle !== 0 && angle !== 90 && angle !== -90) {
                    throw new Error("Angle " + angle + " not supported; only 0, 90, and -90 are valid values");
                }
                this._tickLabelAngle = angle;
                this.redraw();
                return this;
            };
            /**
             * Measures the size of the ticks while also writing them to the DOM.
             * @param {d3.Selection} ticks The tick elements to be written to.
             */
            Category.prototype._drawTicks = function (axisWidth, axisHeight, scale, ticks) {
                var self = this;
                var xAlign;
                var yAlign;
                switch (this.tickLabelAngle()) {
                    case 0:
                        xAlign = { left: "right", right: "left", top: "center", bottom: "center" };
                        yAlign = { left: "center", right: "center", top: "bottom", bottom: "top" };
                        break;
                    case 90:
                        xAlign = { left: "center", right: "center", top: "right", bottom: "left" };
                        yAlign = { left: "top", right: "bottom", top: "center", bottom: "center" };
                        break;
                    case -90:
                        xAlign = { left: "center", right: "center", top: "left", bottom: "right" };
                        yAlign = { left: "bottom", right: "top", top: "center", bottom: "center" };
                        break;
                }
                ticks.each(function (d) {
                    var bandWidth = scale.stepWidth();
                    var width = self._isHorizontal() ? bandWidth : axisWidth - self._maxLabelTickLength() - self.tickLabelPadding();
                    var height = self._isHorizontal() ? axisHeight - self._maxLabelTickLength() - self.tickLabelPadding() : bandWidth;
                    var writeOptions = {
                        selection: d3.select(this),
                        xAlign: xAlign[self.orientation()],
                        yAlign: yAlign[self.orientation()],
                        textRotation: self.tickLabelAngle()
                    };
                    self._writer.write(self.formatter()(d), width, height, writeOptions);
                });
            };
            /**
             * Measures the size of the ticks without making any (permanent) DOM
             * changes.
             *
             * @param {string[]} ticks The strings that will be printed on the ticks.
             */
            Category.prototype._measureTicks = function (axisWidth, axisHeight, scale, ticks) {
                var _this = this;
                var axisSpace = this._isHorizontal() ? axisWidth : axisHeight;
                var totalOuterPaddingRatio = 2 * scale.outerPadding();
                var totalInnerPaddingRatio = (ticks.length - 1) * scale.innerPadding();
                var expectedRangeBand = axisSpace / (totalOuterPaddingRatio + totalInnerPaddingRatio + ticks.length);
                var stepWidth = expectedRangeBand * (1 + scale.innerPadding());
                var wrappingResults = ticks.map(function (s) {
                    // HACKHACK: https://github.com/palantir/svg-typewriter/issues/25
                    var width = axisWidth - _this._maxLabelTickLength() - _this.tickLabelPadding(); // default for left/right
                    if (_this._isHorizontal()) {
                        width = stepWidth; // defaults to the band width
                        if (_this._tickLabelAngle !== 0) {
                            width = axisHeight - _this._maxLabelTickLength() - _this.tickLabelPadding(); // use the axis height
                        }
                        // HACKHACK: Wrapper fails under negative circumstances
                        width = Math.max(width, 0);
                    }
                    // HACKHACK: https://github.com/palantir/svg-typewriter/issues/25
                    var height = stepWidth; // default for left/right
                    if (_this._isHorizontal()) {
                        height = axisHeight - _this._maxLabelTickLength() - _this.tickLabelPadding();
                        if (_this._tickLabelAngle !== 0) {
                            height = axisWidth - _this._maxLabelTickLength() - _this.tickLabelPadding();
                        }
                        // HACKHACK: Wrapper fails under negative circumstances
                        height = Math.max(height, 0);
                    }
                    return _this._wrapper.wrap(_this.formatter()(s), _this._measurer, width, height);
                });
                // HACKHACK: https://github.com/palantir/svg-typewriter/issues/25
                var widthFn = (this._isHorizontal() && this._tickLabelAngle === 0) ? d3.sum : Plottable.Utils.Math.max;
                var heightFn = (this._isHorizontal() && this._tickLabelAngle === 0) ? Plottable.Utils.Math.max : d3.sum;
                var textFits = wrappingResults.every(function (t) {
                    return !SVGTypewriter.Utils.StringMethods.isNotEmptyString(t.truncatedText) && t.noLines === 1;
                });
                var usedWidth = widthFn(wrappingResults, function (t) { return _this._measurer.measure(t.wrappedText).width; }, 0);
                var usedHeight = heightFn(wrappingResults, function (t) { return _this._measurer.measure(t.wrappedText).height; }, 0);
                // If the tick labels are rotated, reverse usedWidth and usedHeight
                // HACKHACK: https://github.com/palantir/svg-typewriter/issues/25
                if (this._tickLabelAngle !== 0) {
                    var tempHeight = usedHeight;
                    usedHeight = usedWidth;
                    usedWidth = tempHeight;
                }
                return {
                    textFits: textFits,
                    usedWidth: usedWidth,
                    usedHeight: usedHeight
                };
            };
            Category.prototype.renderImmediately = function () {
                var _this = this;
                _super.prototype.renderImmediately.call(this);
                var catScale = this._scale;
                var tickLabels = this._tickLabelContainer.selectAll("." + Plottable.Axis.TICK_LABEL_CLASS).data(this._scale.domain(), function (d) { return d; });
                var getTickLabelTransform = function (d, i) {
                    var innerPaddingWidth = catScale.stepWidth() - catScale.rangeBand();
                    var scaledValue = catScale.scale(d) - catScale.rangeBand() / 2 - innerPaddingWidth / 2;
                    var x = _this._isHorizontal() ? scaledValue : 0;
                    var y = _this._isHorizontal() ? 0 : scaledValue;
                    return "translate(" + x + "," + y + ")";
                };
                tickLabels.enter().append("g").classed(Plottable.Axis.TICK_LABEL_CLASS, true);
                tickLabels.exit().remove();
                tickLabels.attr("transform", getTickLabelTransform);
                // erase all text first, then rewrite
                tickLabels.text("");
                this._drawTicks(this.width(), this.height(), catScale, tickLabels);
                var xTranslate = this.orientation() === "right" ? this._maxLabelTickLength() + this.tickLabelPadding() : 0;
                var yTranslate = this.orientation() === "bottom" ? this._maxLabelTickLength() + this.tickLabelPadding() : 0;
                Plottable.Utils.DOM.translate(this._tickLabelContainer, xTranslate, yTranslate);
                return this;
            };
            Category.prototype.computeLayout = function (origin, availableWidth, availableHeight) {
                // When anyone calls redraw(), computeLayout() will be called
                // on everyone, including this. Since CSS or something might have
                // affected the size of the characters, clear the cache.
                this._measurer.reset();
                _super.prototype.computeLayout.call(this, origin, availableWidth, availableHeight);
                if (!this._isHorizontal()) {
                    this._scale.range([0, this.height()]);
                }
                return this;
            };
            return Category;
        })(Plottable.Axis);
        Axes.Category = Category;
    })(Axes = Plottable.Axes || (Plottable.Axes = {}));
})(Plottable || (Plottable = {}));
