var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Scales;
    (function (Scales) {
        var Linear = (function (_super) {
            __extends(Linear, _super);
            /**
             * @constructor
             */
            function Linear() {
                _super.call(this);
                this._d3Scale = d3.scale.linear();
            }
            Linear.prototype._defaultExtent = function () {
                return [0, 1];
            };
            Linear.prototype._expandSingleValueDomain = function (singleValueDomain) {
                if (singleValueDomain[0] === singleValueDomain[1]) {
                    return [singleValueDomain[0] - 1, singleValueDomain[1] + 1];
                }
                return singleValueDomain;
            };
            Linear.prototype.scale = function (value) {
                return this._d3Scale(value);
            };
            Linear.prototype._getDomain = function () {
                return this._d3Scale.domain();
            };
            Linear.prototype._setBackingScaleDomain = function (values) {
                this._d3Scale.domain(values);
            };
            Linear.prototype._getRange = function () {
                return this._d3Scale.range();
            };
            Linear.prototype._setRange = function (values) {
                this._d3Scale.range(values);
            };
            Linear.prototype.invert = function (value) {
                return this._d3Scale.invert(value);
            };
            Linear.prototype.defaultTicks = function () {
                return this._d3Scale.ticks(Scales.Linear._DEFAULT_NUM_TICKS);
            };
            Linear.prototype._niceDomain = function (domain, count) {
                return this._d3Scale.copy().domain(domain).nice(count).domain();
            };
            return Linear;
        })(Plottable.QuantitativeScale);
        Scales.Linear = Linear;
    })(Scales = Plottable.Scales || (Plottable.Scales = {}));
})(Plottable || (Plottable = {}));
