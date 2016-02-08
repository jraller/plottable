declare module Plottable {
    module TimeInterval {
        var second: string;
        var minute: string;
        var hour: string;
        var day: string;
        var week: string;
        var month: string;
        var year: string;
    }
}
declare module Plottable.Axes {
    /**
     * Defines a configuration for a Time Axis tier.
     * For details on how ticks are generated see: https://github.com/mbostock/d3/wiki/Time-Scales#ticks
     * interval - A time unit associated with this configuration (seconds, minutes, hours, etc).
     * step - number of intervals between each tick.
     * formatter - formatter used to format tick labels.
     */
    type TimeAxisTierConfiguration = {
        interval: string;
        step: number;
        formatter: Formatter;
    };
    /**
     * An array of linked TimeAxisTierConfigurations.
     * Each configuration will be shown on a different tier.
     * Currently, up to two tiers are supported.
     */
    type TimeAxisConfiguration = TimeAxisTierConfiguration[];
    class Time extends Axis<Date> {
        /**
         * The CSS class applied to each Time Axis tier
         */
        static TIME_AXIS_TIER_CLASS: string;
        private static _DEFAULT_TIME_AXIS_CONFIGURATIONS;
        private _tierLabelContainers;
        private _tierMarkContainers;
        private _tierBaselines;
        private _tierHeights;
        private _possibleTimeAxisConfigurations;
        private _numTiers;
        private _measurer;
        private _mostPreciseConfigIndex;
        private _tierLabelPositions;
        private static _LONG_DATE;
        /**
         * Constructs a Time Axis.
         *
         * A Time Axis is a visual representation of a Time Scale.
         *
         * @constructor
         * @param {Scales.Time} scale
         * @param {string} orientation One of "top"/"bottom".
         */
        constructor(scale: Scales.Time, orientation: string);
        /**
         * Gets the label positions for each tier.
         */
        tierLabelPositions(): string[];
        /**
         * Sets the label positions for each tier.
         *
         * @param {string[]} newPositions The positions for each tier. "bottom" and "center" are the only supported values.
         * @returns {Axes.Time} The calling Time Axis.
         */
        tierLabelPositions(newPositions: string[]): this;
        /**
         * Gets the possible TimeAxisConfigurations.
         */
        axisConfigurations(): TimeAxisConfiguration[];
        /**
         * Sets the possible TimeAxisConfigurations.
         * The Time Axis will choose the most precise configuration that will display in the available space.
         *
         * @param {TimeAxisConfiguration[]} configurations
         * @returns {Axes.Time} The calling Time Axis.
         */
        axisConfigurations(configurations: TimeAxisConfiguration[]): this;
        /**
         * Gets the index of the most precise TimeAxisConfiguration that will fit in the current width.
         */
        private _getMostPreciseConfigurationIndex();
        orientation(): string;
        orientation(orientation: string): this;
        protected _computeHeight(): number;
        private _getIntervalLength(config);
        private _maxWidthForInterval(config);
        /**
         * Check if tier configuration fits in the current width.
         */
        private _checkTimeAxisTierConfigurationWidth(config);
        protected _sizeFromOffer(availableWidth: number, availableHeight: number): {
            width: number;
            height: number;
        };
        protected _setup(): void;
        private _setupDomElements();
        private _getTickIntervalValues(config);
        protected _getTickValues(): any[];
        private _cleanTiers();
        private _getTickValuesForConfiguration(config);
        private _renderTierLabels(container, config, index);
        private _renderTickMarks(tickValues, index);
        private _renderLabellessTickMarks(tickValues);
        private _generateLabellessTicks();
        renderImmediately(): this;
        private _hideOverflowingTiers();
        private _hideOverlappingAndCutOffLabels(index);
    }
}
