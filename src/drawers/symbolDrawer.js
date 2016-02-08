var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Drawers;
    (function (Drawers) {
        var Symbol = (function (_super) {
            __extends(Symbol, _super);
            function Symbol(dataset) {
                _super.call(this, dataset);
                this._svgElementName = "path";
                this._className = "symbol";
            }
            return Symbol;
        })(Plottable.Drawer);
        Drawers.Symbol = Symbol;
    })(Drawers = Plottable.Drawers || (Plottable.Drawers = {}));
})(Plottable || (Plottable = {}));
