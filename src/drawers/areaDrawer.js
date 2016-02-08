var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Drawers;
    (function (Drawers) {
        var Area = (function (_super) {
            __extends(Area, _super);
            function Area(dataset) {
                _super.call(this, dataset);
                this._className = "area";
                this._svgElementName = "path";
            }
            Area.prototype._applyDefaultAttributes = function (selection) {
                _super.prototype._applyDefaultAttributes.call(this, selection);
                selection.style("stroke", "none");
            };
            Area.prototype.selectionForIndex = function (index) {
                return d3.select(this.selection()[0][0]);
            };
            return Area;
        })(Plottable.Drawer);
        Drawers.Area = Area;
    })(Drawers = Plottable.Drawers || (Plottable.Drawers = {}));
})(Plottable || (Plottable = {}));
