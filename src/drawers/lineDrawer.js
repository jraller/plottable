var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Drawers;
    (function (Drawers) {
        var Line = (function (_super) {
            __extends(Line, _super);
            function Line(dataset) {
                _super.call(this, dataset);
                this._className = "line";
                this._svgElementName = "path";
            }
            Line.prototype._applyDefaultAttributes = function (selection) {
                _super.prototype._applyDefaultAttributes.call(this, selection);
                selection.style("fill", "none");
            };
            Line.prototype.selectionForIndex = function (index) {
                return d3.select(this.selection()[0][0]);
            };
            return Line;
        })(Plottable.Drawer);
        Drawers.Line = Line;
    })(Drawers = Plottable.Drawers || (Plottable.Drawers = {}));
})(Plottable || (Plottable = {}));
