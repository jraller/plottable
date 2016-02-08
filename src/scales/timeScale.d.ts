declare module Plottable.Scales {
    class Time extends QuantitativeScale<Date> {
        private _d3Scale;
        /**
         * A Time Scale maps Date objects to numbers.
         *
         * @constructor
         */
        constructor();
        /**
         * Returns an array of ticks values separated by the specified interval.
         *
         * @param {string} interval A string specifying the interval unit.
         * @param {number?} [step] The number of multiples of the interval between consecutive ticks.
         * @return {Date[]}
         */
        tickInterval(interval: string, step?: number): Date[];
        protected _setDomain(values: Date[]): void;
        protected _defaultExtent(): Date[];
        protected _expandSingleValueDomain(singleValueDomain: Date[]): Date[];
        scale(value: Date): number;
        protected _getDomain(): Date[];
        protected _setBackingScaleDomain(values: Date[]): void;
        protected _getRange(): number[];
        protected _setRange(values: number[]): void;
        invert(value: number): Date;
        defaultTicks(): Date[];
        protected _niceDomain(domain: Date[]): Date[];
        /**
         * Transforms the Plottable TimeInterval string into a d3 time interval equivalent.
         * If the provided TimeInterval is incorrect, the default is d3.time.year
         */
        static timeIntervalToD3Time(timeInterval: string): d3.time.Interval;
    }
}
