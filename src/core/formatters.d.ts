declare module Plottable {
    type Formatter = (d: any) => string;
}
declare module Plottable.Formatters {
    /**
     * Creates a formatter for currency values.
     *
     * @param {number} [precision] The number of decimal places to show (default 2).
     * @param {string} [symbol] The currency symbol to use (default "$").
     * @param {boolean} [prefix] Whether to prepend or append the currency symbol (default true).
     *
     * @returns {Formatter} A formatter for currency values.
     */
    function currency(precision?: number, symbol?: string, prefix?: boolean): (d: any) => string;
    /**
     * Creates a formatter that displays exactly [precision] decimal places.
     *
     * @param {number} [precision] The number of decimal places to show (default 3).
     *
     * @returns {Formatter} A formatter that displays exactly [precision] decimal places.
     */
    function fixed(precision?: number): (d: any) => string;
    /**
     * Creates a formatter that formats numbers to show no more than
     * [maxNumberOfDecimalPlaces] decimal places. All other values are stringified.
     *
     * @param {number} [maxNumberOfDecimalPlaces] The number of decimal places to show (default 3).
     *
     * @returns {Formatter} A formatter for general values.
     */
    function general(maxNumberOfDecimalPlaces?: number): (d: any) => string;
    /**
     * Creates a formatter that stringifies its input.
     *
     * @returns {Formatter} A formatter that stringifies its input.
     */
    function identity(): (d: any) => string;
    /**
     * Creates a formatter for percentage values.
     * Multiplies the input by 100 and appends "%".
     *
     * @param {number} [precision] The number of decimal places to show (default 0).
     *
     * @returns {Formatter} A formatter for percentage values.
     */
    function percentage(precision?: number): (d: any) => string;
    /**
     * Creates a formatter for values that displays [numberOfSignificantFigures] significant figures
     * and puts SI notation.
     *
     * @param {number} [numberOfSignificantFigures] The number of significant figures to show (default 3).
     *
     * @returns {Formatter} A formatter for SI values.
     */
    function siSuffix(numberOfSignificantFigures?: number): (d: any) => string;
    /**
     * Creates a formatter for values that displays abbreviated values
     * and uses standard short scale suffixes
     * - K - thousands - 10 ^ 3
     * - M - millions - 10 ^ 6
     * - B - billions - 10 ^ 9
     * - T - trillions - 10 ^ 12
     * - Q - quadrillions - 10 ^ 15
     *
     * Numbers with a magnitude outside of (10 ^ (-precision), 10 ^ 15) are shown using
     * scientific notation to avoid creating extremely long decimal strings.
     *
     * @param {number} [precision] the number of decimal places to show (default 3)
     * @returns {Formatter} A formatter with short scale formatting
     */
    function shortScale(precision?: number): (num: number) => string;
    /**
     * Creates a multi time formatter that displays dates.
     *
     * @returns {Formatter} A formatter for time/date values.
     */
    function multiTime(): (d: any) => string;
    /**
     * Creates a time formatter that displays time/date using given specifier.
     *
     * List of directives can be found on: https://github.com/mbostock/d3/wiki/Time-Formatting#format
     *
     * @param {string} [specifier] The specifier for the formatter.
     *
     * @returns {Formatter} A formatter for time/date values.
     */
    function time(specifier: string): Formatter;
}
