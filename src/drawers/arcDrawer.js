var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Drawers;
    (function (Drawers) {
        var Arc = (function (_super) {
            __extends(Arc, _super);
            function Arc(dataset) {
                _super.call(this, dataset);
                this._className = "arc fill";
                this._svgElementName = "path";
            }
            Arc.prototype._applyDefaultAttributes = function (selection) {
                _super.prototype._applyDefaultAttributes.call(this, selection);
                selection.style("stroke", "none");
            };
            return Arc;
        })(Plottable.Drawer);
        Drawers.Arc = Arc;
    })(Drawers = Plottable.Drawers || (Plottable.Drawers = {}));
})(Plottable || (Plottable = {}));
