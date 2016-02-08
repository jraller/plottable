var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Drawers;
    (function (Drawers) {
        var Segment = (function (_super) {
            __extends(Segment, _super);
            function Segment(dataset) {
                _super.call(this, dataset);
                this._svgElementName = "line";
            }
            return Segment;
        })(Plottable.Drawer);
        Drawers.Segment = Segment;
    })(Drawers = Plottable.Drawers || (Plottable.Drawers = {}));
})(Plottable || (Plottable = {}));
