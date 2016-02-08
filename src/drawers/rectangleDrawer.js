var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Drawers;
    (function (Drawers) {
        var Rectangle = (function (_super) {
            __extends(Rectangle, _super);
            function Rectangle(dataset) {
                _super.call(this, dataset);
                this._svgElementName = "rect";
            }
            return Rectangle;
        })(Plottable.Drawer);
        Drawers.Rectangle = Rectangle;
    })(Drawers = Plottable.Drawers || (Plottable.Drawers = {}));
})(Plottable || (Plottable = {}));
