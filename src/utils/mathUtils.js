var Plottable;
(function (Plottable) {
    var Utils;
    (function (Utils) {
        var Math;
        (function (Math) {
            var nativeMath = window.Math;
            /**
             * Checks if x is between a and b.
             *
             * @param {number} x The value to test if in range
             * @param {number} a The beginning of the (inclusive) range
             * @param {number} b The ending of the (inclusive) range
             * @return {boolean} Whether x is in [a, b]
             */
            function inRange(x, a, b) {
                return (nativeMath.min(a, b) <= x && x <= nativeMath.max(a, b));
            }
            Math.inRange = inRange;
            /**
             * Clamps x to the range [min, max].
             *
             * @param {number} x The value to be clamped.
             * @param {number} min The minimum value.
             * @param {number} max The maximum value.
             * @return {number} A clamped value in the range [min, max].
             */
            function clamp(x, min, max) {
                return nativeMath.min(nativeMath.max(min, x), max);
            }
            Math.clamp = clamp;
            function max(array, firstArg, secondArg) {
                var accessor = typeof (firstArg) === "function" ? firstArg : null;
                var defaultValue = accessor == null ? firstArg : secondArg;
                /* tslint:disable:ban */
                var maxValue = accessor == null ? d3.max(array) : d3.max(array, accessor);
                /* tslint:enable:ban */
                return maxValue !== undefined ? maxValue : defaultValue;
            }
            Math.max = max;
            function min(array, firstArg, secondArg) {
                var accessor = typeof (firstArg) === "function" ? firstArg : null;
                var defaultValue = accessor == null ? firstArg : secondArg;
                /* tslint:disable:ban */
                var minValue = accessor == null ? d3.min(array) : d3.min(array, accessor);
                /* tslint:enable:ban */
                return minValue !== undefined ? minValue : defaultValue;
            }
            Math.min = min;
            /**
             * Returns true **only** if x is NaN
             */
            function isNaN(n) {
                return n !== n;
            }
            Math.isNaN = isNaN;
            /**
             * Returns true if the argument is a number, which is not NaN
             * Numbers represented as strings do not pass this function
             */
            function isValidNumber(n) {
                return typeof n === "number" && !Plottable.Utils.Math.isNaN(n) && isFinite(n);
            }
            Math.isValidNumber = isValidNumber;
            /**
             * Generates an array of consecutive, strictly increasing numbers
             * in the range [start, stop) separeted by step
             */
            function range(start, stop, step) {
                if (step === void 0) { step = 1; }
                if (step === 0) {
                    throw new Error("step cannot be 0");
                }
                var length = nativeMath.max(nativeMath.ceil((stop - start) / step), 0);
                var range = [];
                for (var i = 0; i < length; ++i) {
                    range[i] = start + step * i;
                }
                return range;
            }
            Math.range = range;
            /**
             * Returns the square of the distance between two points
             *
             * @param {Point} p1
             * @param {Point} p2
             * @return {number} dist(p1, p2)^2
             */
            function distanceSquared(p1, p2) {
                return nativeMath.pow(p2.y - p1.y, 2) + nativeMath.pow(p2.x - p1.x, 2);
            }
            Math.distanceSquared = distanceSquared;
            function degreesToRadians(degree) {
                return degree / 360 * nativeMath.PI * 2;
            }
            Math.degreesToRadians = degreesToRadians;
        })(Math = Utils.Math || (Utils.Math = {}));
    })(Utils = Plottable.Utils || (Plottable.Utils = {}));
})(Plottable || (Plottable = {}));
