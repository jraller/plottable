var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Components;
    (function (Components) {
        var YDragBoxLayer = (function (_super) {
            __extends(YDragBoxLayer, _super);
            /**
             * A YDragBoxLayer is a DragBoxLayer whose size can only be set in the Y-direction.
             * The x-values of the bounds() are always set to 0 and the width() of the YDragBoxLayer.
             *
             * @constructor
             */
            function YDragBoxLayer() {
                _super.call(this);
                this.addClass("y-drag-box-layer");
                this._hasCorners = false;
            }
            YDragBoxLayer.prototype.computeLayout = function (origin, availableWidth, availableHeight) {
                _super.prototype.computeLayout.call(this, origin, availableWidth, availableHeight);
                // set correct bounds when width/height changes
                this._setBounds(this.bounds());
                return this;
            };
            YDragBoxLayer.prototype._setBounds = function (newBounds) {
                _super.prototype._setBounds.call(this, {
                    topLeft: { x: 0, y: newBounds.topLeft.y },
                    bottomRight: { x: this.width(), y: newBounds.bottomRight.y }
                });
            };
            YDragBoxLayer.prototype._setResizableClasses = function (canResize) {
                if (canResize && this.enabled()) {
                    this.addClass("y-resizable");
                }
                else {
                    this.removeClass("y-resizable");
                }
            };
            YDragBoxLayer.prototype.xScale = function (xScale) {
                if (xScale == null) {
                    return _super.prototype.xScale.call(this);
                }
                throw new Error("xScales cannot be set on an YDragBoxLayer");
            };
            YDragBoxLayer.prototype.xExtent = function (xExtent) {
                if (xExtent == null) {
                    return _super.prototype.xExtent.call(this);
                }
                throw new Error("YDragBoxLayer has no xExtent");
            };
            return YDragBoxLayer;
        })(Components.DragBoxLayer);
        Components.YDragBoxLayer = YDragBoxLayer;
    })(Components = Plottable.Components || (Plottable.Components = {}));
})(Plottable || (Plottable = {}));
