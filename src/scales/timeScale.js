var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Scales;
    (function (Scales) {
        var Time = (function (_super) {
            __extends(Time, _super);
            /**
             * A Time Scale maps Date objects to numbers.
             *
             * @constructor
             */
            function Time() {
                _super.call(this);
                this._d3Scale = d3.time.scale();
                this.autoDomain();
            }
            /**
             * Returns an array of ticks values separated by the specified interval.
             *
             * @param {string} interval A string specifying the interval unit.
             * @param {number?} [step] The number of multiples of the interval between consecutive ticks.
             * @return {Date[]}
             */
            Time.prototype.tickInterval = function (interval, step) {
                // temporarily creats a time scale from our linear scale into a time scale so we can get access to its api
                var tempScale = d3.time.scale();
                var d3Interval = Time.timeIntervalToD3Time(interval);
                tempScale.domain(this.domain());
                tempScale.range(this.range());
                return tempScale.ticks(d3Interval, step);
            };
            Time.prototype._setDomain = function (values) {
                if (values[1] < values[0]) {
                    throw new Error("Scale.Time domain values must be in chronological order");
                }
                return _super.prototype._setDomain.call(this, values);
            };
            Time.prototype._defaultExtent = function () {
                return [new Date("1970-01-01"), new Date("1970-01-02")];
            };
            Time.prototype._expandSingleValueDomain = function (singleValueDomain) {
                var startTime = singleValueDomain[0].getTime();
                var endTime = singleValueDomain[1].getTime();
                if (startTime === endTime) {
                    var startDate = new Date(startTime);
                    startDate.setDate(startDate.getDate() - 1);
                    var endDate = new Date(endTime);
                    endDate.setDate(endDate.getDate() + 1);
                    return [startDate, endDate];
                }
                return singleValueDomain;
            };
            Time.prototype.scale = function (value) {
                return this._d3Scale(value);
            };
            Time.prototype._getDomain = function () {
                return this._d3Scale.domain();
            };
            Time.prototype._setBackingScaleDomain = function (values) {
                this._d3Scale.domain(values);
            };
            Time.prototype._getRange = function () {
                return this._d3Scale.range();
            };
            Time.prototype._setRange = function (values) {
                this._d3Scale.range(values);
            };
            Time.prototype.invert = function (value) {
                return this._d3Scale.invert(value);
            };
            Time.prototype.defaultTicks = function () {
                return this._d3Scale.ticks(Scales.Time._DEFAULT_NUM_TICKS);
            };
            Time.prototype._niceDomain = function (domain) {
                return this._d3Scale.copy().domain(domain).nice().domain();
            };
            /**
             * Transforms the Plottable TimeInterval string into a d3 time interval equivalent.
             * If the provided TimeInterval is incorrect, the default is d3.time.year
             */
            Time.timeIntervalToD3Time = function (timeInterval) {
                switch (timeInterval) {
                    case Plottable.TimeInterval.second:
                        return d3.time.second;
                    case Plottable.TimeInterval.minute:
                        return d3.time.minute;
                    case Plottable.TimeInterval.hour:
                        return d3.time.hour;
                    case Plottable.TimeInterval.day:
                        return d3.time.day;
                    case Plottable.TimeInterval.week:
                        return d3.time.week;
                    case Plottable.TimeInterval.month:
                        return d3.time.month;
                    case Plottable.TimeInterval.year:
                        return d3.time.year;
                    default:
                        throw Error("TimeInterval specified does not exist: " + timeInterval);
                }
            };
            return Time;
        })(Plottable.QuantitativeScale);
        Scales.Time = Time;
    })(Scales = Plottable.Scales || (Plottable.Scales = {}));
})(Plottable || (Plottable = {}));
