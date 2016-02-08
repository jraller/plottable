var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var StackedBar = (function (_super) {
            __extends(StackedBar, _super);
            /**
             * A StackedBar Plot stacks bars across Datasets based on the primary value of the bars.
             *   On a vertical StackedBar Plot, the bars with the same X value are stacked.
             *   On a horizontal StackedBar Plot, the bars with the same Y value are stacked.
             *
             * @constructor
             * @param {Scale} xScale
             * @param {Scale} yScale
             * @param {string} [orientation="vertical"] One of "vertical"/"horizontal".
             */
            function StackedBar(orientation) {
                if (orientation === void 0) { orientation = Plots.Bar.ORIENTATION_VERTICAL; }
                _super.call(this, orientation);
                this.addClass("stacked-bar-plot");
                this._stackingResult = new Plottable.Utils.Map();
                this._stackedExtent = [];
            }
            StackedBar.prototype.x = function (x, xScale) {
                if (x == null) {
                    return _super.prototype.x.call(this);
                }
                if (xScale == null) {
                    _super.prototype.x.call(this, x);
                }
                else {
                    _super.prototype.x.call(this, x, xScale);
                }
                this._updateStackExtentsAndOffsets();
                return this;
            };
            StackedBar.prototype.y = function (y, yScale) {
                if (y == null) {
                    return _super.prototype.y.call(this);
                }
                if (yScale == null) {
                    _super.prototype.y.call(this, y);
                }
                else {
                    _super.prototype.y.call(this, y, yScale);
                }
                this._updateStackExtentsAndOffsets();
                return this;
            };
            StackedBar.prototype._generateAttrToProjector = function () {
                var _this = this;
                var attrToProjector = _super.prototype._generateAttrToProjector.call(this);
                var valueAttr = this._isVertical ? "y" : "x";
                var keyAttr = this._isVertical ? "x" : "y";
                var primaryScale = this._isVertical ? this.y().scale : this.x().scale;
                var primaryAccessor = this._propertyBindings.get(valueAttr).accessor;
                var keyAccessor = this._propertyBindings.get(keyAttr).accessor;
                var normalizedKeyAccessor = function (datum, index, dataset) {
                    return Plottable.Utils.Stacking.normalizeKey(keyAccessor(datum, index, dataset));
                };
                var getStart = function (d, i, dataset) {
                    return primaryScale.scale(_this._stackingResult.get(dataset).get(normalizedKeyAccessor(d, i, dataset)).offset);
                };
                var getEnd = function (d, i, dataset) {
                    return primaryScale.scale(+primaryAccessor(d, i, dataset) +
                        _this._stackingResult.get(dataset).get(normalizedKeyAccessor(d, i, dataset)).offset);
                };
                var heightF = function (d, i, dataset) {
                    return Math.abs(getEnd(d, i, dataset) - getStart(d, i, dataset));
                };
                attrToProjector[this._isVertical ? "height" : "width"] = heightF;
                var attrFunction = function (d, i, dataset) {
                    return +primaryAccessor(d, i, dataset) < 0 ? getStart(d, i, dataset) : getEnd(d, i, dataset);
                };
                attrToProjector[valueAttr] = function (d, i, dataset) {
                    return _this._isVertical ? attrFunction(d, i, dataset) : attrFunction(d, i, dataset) - heightF(d, i, dataset);
                };
                return attrToProjector;
            };
            StackedBar.prototype._onDatasetUpdate = function () {
                this._updateStackExtentsAndOffsets();
                _super.prototype._onDatasetUpdate.call(this);
                return this;
            };
            StackedBar.prototype._updateExtentsForProperty = function (property) {
                _super.prototype._updateExtentsForProperty.call(this, property);
                if ((property === "x" || property === "y") && this._projectorsReady()) {
                    this._updateStackExtentsAndOffsets();
                }
            };
            StackedBar.prototype._extentsForProperty = function (attr) {
                var primaryAttr = this._isVertical ? "y" : "x";
                if (attr === primaryAttr) {
                    return [this._stackedExtent];
                }
                else {
                    return _super.prototype._extentsForProperty.call(this, attr);
                }
            };
            StackedBar.prototype._updateStackExtentsAndOffsets = function () {
                if (!this._projectorsReady()) {
                    return;
                }
                var datasets = this.datasets();
                var keyAccessor = this._isVertical ? this.x().accessor : this.y().accessor;
                var valueAccessor = this._isVertical ? this.y().accessor : this.x().accessor;
                var filter = this._filterForProperty(this._isVertical ? "y" : "x");
                this._stackingResult = Plottable.Utils.Stacking.stack(datasets, keyAccessor, valueAccessor);
                this._stackedExtent = Plottable.Utils.Stacking.stackedExtent(this._stackingResult, keyAccessor, filter);
            };
            return StackedBar;
        })(Plots.Bar);
        Plots.StackedBar = StackedBar;
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
