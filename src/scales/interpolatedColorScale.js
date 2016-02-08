var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Scales;
    (function (Scales) {
        var InterpolatedColor = (function (_super) {
            __extends(InterpolatedColor, _super);
            /**
             * An InterpolatedColor Scale maps numbers to color hex values, expressed as strings.
             *
             * @param {string} [scaleType="linear"] One of "linear"/"log"/"sqrt"/"pow".
             */
            function InterpolatedColor(scaleType) {
                if (scaleType === void 0) { scaleType = "linear"; }
                _super.call(this);
                switch (scaleType) {
                    case "linear":
                        this._colorScale = d3.scale.linear();
                        break;
                    case "log":
                        this._colorScale = d3.scale.log();
                        break;
                    case "sqrt":
                        this._colorScale = d3.scale.sqrt();
                        break;
                    case "pow":
                        this._colorScale = d3.scale.pow();
                        break;
                }
                if (this._colorScale == null) {
                    throw new Error("unknown QuantitativeScale scale type " + scaleType);
                }
                this.range(InterpolatedColor.REDS);
            }
            InterpolatedColor.prototype.extentOfValues = function (values) {
                var extent = d3.extent(values);
                if (extent[0] == null || extent[1] == null) {
                    return [];
                }
                else {
                    return extent;
                }
            };
            /**
             * Generates the converted QuantitativeScale.
             */
            InterpolatedColor.prototype._d3InterpolatedScale = function () {
                return this._colorScale.range([0, 1]).interpolate(this._interpolateColors());
            };
            /**
             * Generates the d3 interpolator for colors.
             */
            InterpolatedColor.prototype._interpolateColors = function () {
                var colors = this._colorRange;
                if (colors.length < 2) {
                    throw new Error("Color scale arrays must have at least two elements.");
                }
                ;
                return function (a, b) {
                    return function (t) {
                        // Clamp t parameter to [0,1]
                        t = Math.max(0, Math.min(1, t));
                        // Determine indices for colors
                        var tScaled = t * (colors.length - 1);
                        var i0 = Math.floor(tScaled);
                        var i1 = Math.ceil(tScaled);
                        var frac = (tScaled - i0);
                        // Interpolate in the L*a*b color space
                        return d3.interpolateLab(colors[i0], colors[i1])(frac);
                    };
                };
            };
            InterpolatedColor.prototype._resetScale = function () {
                this._d3Scale = this._d3InterpolatedScale();
                this._autoDomainIfAutomaticMode();
                this._dispatchUpdate();
            };
            InterpolatedColor.prototype.autoDomain = function () {
                // InterpolatedColorScales do not pad
                var includedValues = this._getAllIncludedValues();
                if (includedValues.length > 0) {
                    this._setDomain([Plottable.Utils.Math.min(includedValues, 0), Plottable.Utils.Math.max(includedValues, 0)]);
                }
                return this;
            };
            InterpolatedColor.prototype.scale = function (value) {
                return this._d3Scale(value);
            };
            InterpolatedColor.prototype._getDomain = function () {
                return this._d3Scale.domain();
            };
            InterpolatedColor.prototype._setBackingScaleDomain = function (values) {
                this._d3Scale.domain(values);
            };
            InterpolatedColor.prototype._getRange = function () {
                return this._colorRange;
            };
            InterpolatedColor.prototype._setRange = function (range) {
                this._colorRange = range;
                this._resetScale();
            };
            InterpolatedColor.REDS = [
                "#FFFFFF",
                "#FFF6E1",
                "#FEF4C0",
                "#FED976",
                "#FEB24C",
                "#FD8D3C",
                "#FC4E2A",
                "#E31A1C",
                "#B10026" // red
            ];
            InterpolatedColor.BLUES = [
                "#FFFFFF",
                "#CCFFFF",
                "#A5FFFD",
                "#85F7FB",
                "#6ED3EF",
                "#55A7E0",
                "#417FD0",
                "#2545D3",
                "#0B02E1" // blue
            ];
            InterpolatedColor.POSNEG = [
                "#0B02E1",
                "#2545D3",
                "#417FD0",
                "#55A7E0",
                "#6ED3EF",
                "#85F7FB",
                "#A5FFFD",
                "#CCFFFF",
                "#FFFFFF",
                "#FFF6E1",
                "#FEF4C0",
                "#FED976",
                "#FEB24C",
                "#FD8D3C",
                "#FC4E2A",
                "#E31A1C",
                "#B10026" // red
            ];
            return InterpolatedColor;
        })(Plottable.Scale);
        Scales.InterpolatedColor = InterpolatedColor;
    })(Scales = Plottable.Scales || (Plottable.Scales = {}));
})(Plottable || (Plottable = {}));
