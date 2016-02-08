var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Drawers;
    (function (Drawers) {
        var ArcOutline = (function (_super) {
            __extends(ArcOutline, _super);
            function ArcOutline(dataset) {
                _super.call(this, dataset);
                this._className = "arc outline";
                this._svgElementName = "path";
            }
            ArcOutline.prototype._applyDefaultAttributes = function (selection) {
                _super.prototype._applyDefaultAttributes.call(this, selection);
                selection.style("fill", "none");
            };
            return ArcOutline;
        })(Plottable.Drawer);
        Drawers.ArcOutline = ArcOutline;
    })(Drawers = Plottable.Drawers || (Plottable.Drawers = {}));
})(Plottable || (Plottable = {}));
