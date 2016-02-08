var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Scales;
    (function (Scales) {
        var Category = (function (_super) {
            __extends(Category, _super);
            /**
             * A Category Scale maps strings to numbers.
             *
             * @constructor
             */
            function Category() {
                _super.call(this);
                this._range = [0, 1];
                this._d3Scale = d3.scale.ordinal();
                var d3InnerPadding = 0.3;
                this._innerPadding = Category._convertToPlottableInnerPadding(d3InnerPadding);
                this._outerPadding = Category._convertToPlottableOuterPadding(0.5, d3InnerPadding);
            }
            Category.prototype.extentOfValues = function (values) {
                return Plottable.Utils.Array.uniq(values);
            };
            Category.prototype._getExtent = function () {
                return Plottable.Utils.Array.uniq(this._getAllIncludedValues());
            };
            Category.prototype.domain = function (values) {
                return _super.prototype.domain.call(this, values);
            };
            Category.prototype._setDomain = function (values) {
                _super.prototype._setDomain.call(this, values);
                this.range(this.range()); // update range
            };
            Category.prototype.range = function (values) {
                if (values == null) {
                    return this._range;
                }
                else {
                    this._range = values;
                    var d3InnerPadding = 1 - 1 / (1 + this.innerPadding());
                    var d3OuterPadding = this.outerPadding() / (1 + this.innerPadding());
                    this._d3Scale.rangeBands(values, d3InnerPadding, d3OuterPadding);
                    return this;
                }
            };
            Category._convertToPlottableInnerPadding = function (d3InnerPadding) {
                return 1 / (1 - d3InnerPadding) - 1;
            };
            Category._convertToPlottableOuterPadding = function (d3OuterPadding, d3InnerPadding) {
                return d3OuterPadding / (1 - d3InnerPadding);
            };
            /**
             * Returns the width of the range band.
             *
             * @returns {number} The range band width
             */
            Category.prototype.rangeBand = function () {
                return this._d3Scale.rangeBand();
            };
            /**
             * Returns the step width of the scale.
             *
             * The step width is the pixel distance between adjacent values in the domain.
             *
             * @returns {number}
             */
            Category.prototype.stepWidth = function () {
                return this.rangeBand() * (1 + this.innerPadding());
            };
            Category.prototype.innerPadding = function (innerPadding) {
                if (innerPadding == null) {
                    return this._innerPadding;
                }
                this._innerPadding = innerPadding;
                this.range(this.range());
                this._dispatchUpdate();
                return this;
            };
            Category.prototype.outerPadding = function (outerPadding) {
                if (outerPadding == null) {
                    return this._outerPadding;
                }
                this._outerPadding = outerPadding;
                this.range(this.range());
                this._dispatchUpdate();
                return this;
            };
            Category.prototype.scale = function (value) {
                // scale it to the middle
                return this._d3Scale(value) + this.rangeBand() / 2;
            };
            Category.prototype._getDomain = function () {
                return this._d3Scale.domain();
            };
            Category.prototype._setBackingScaleDomain = function (values) {
                this._d3Scale.domain(values);
            };
            Category.prototype._getRange = function () {
                return this._d3Scale.range();
            };
            Category.prototype._setRange = function (values) {
                this._d3Scale.range(values);
            };
            return Category;
        })(Plottable.Scale);
        Scales.Category = Category;
    })(Scales = Plottable.Scales || (Plottable.Scales = {}));
})(Plottable || (Plottable = {}));
