var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var ClusteredBar = (function (_super) {
            __extends(ClusteredBar, _super);
            /**
             * A ClusteredBar Plot groups bars across Datasets based on the primary value of the bars.
             *   On a vertical ClusteredBar Plot, the bars with the same X value are grouped.
             *   On a horizontal ClusteredBar Plot, the bars with the same Y value are grouped.
             *
             * @constructor
             * @param {string} [orientation="vertical"] One of "vertical"/"horizontal".
             */
            function ClusteredBar(orientation) {
                if (orientation === void 0) { orientation = Plots.Bar.ORIENTATION_VERTICAL; }
                _super.call(this, orientation);
                this._clusterOffsets = new Plottable.Utils.Map();
            }
            ClusteredBar.prototype._generateAttrToProjector = function () {
                var _this = this;
                var attrToProjector = _super.prototype._generateAttrToProjector.call(this);
                // the width is constant, so set the inner scale range to that
                var innerScale = this._makeInnerScale();
                var innerWidthF = function (d, i) { return innerScale.rangeBand(); };
                attrToProjector["width"] = this._isVertical ? innerWidthF : attrToProjector["width"];
                attrToProjector["height"] = !this._isVertical ? innerWidthF : attrToProjector["height"];
                var xAttr = attrToProjector["x"];
                var yAttr = attrToProjector["y"];
                attrToProjector["x"] = this._isVertical ?
                    function (d, i, ds) { return xAttr(d, i, ds) + _this._clusterOffsets.get(ds); } :
                    function (d, i, ds) { return xAttr(d, i, ds); };
                attrToProjector["y"] = this._isVertical ?
                    function (d, i, ds) { return yAttr(d, i, ds); } :
                    function (d, i, ds) { return yAttr(d, i, ds) + _this._clusterOffsets.get(ds); };
                return attrToProjector;
            };
            ClusteredBar.prototype._updateClusterPosition = function () {
                var _this = this;
                var innerScale = this._makeInnerScale();
                this.datasets().forEach(function (d, i) { return _this._clusterOffsets.set(d, innerScale.scale(String(i)) - innerScale.rangeBand() / 2); });
            };
            ClusteredBar.prototype._makeInnerScale = function () {
                var innerScale = new Plottable.Scales.Category();
                innerScale.domain(this.datasets().map(function (d, i) { return String(i); }));
                var widthProjector = Plottable.Plot._scaledAccessor(this.attr("width"));
                innerScale.range([0, widthProjector(null, 0, null)]);
                return innerScale;
            };
            ClusteredBar.prototype._getDataToDraw = function () {
                this._updateClusterPosition();
                return _super.prototype._getDataToDraw.call(this);
            };
            return ClusteredBar;
        })(Plots.Bar);
        Plots.ClusteredBar = ClusteredBar;
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
