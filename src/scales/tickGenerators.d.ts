declare module Plottable.Scales.TickGenerators {
    /**
     * Generates an array of tick values for the specified scale.
     *
     * @param {QuantitativeScale} scale
     * @returns {D[]}
     */
    interface TickGenerator<D> {
        (scale: Plottable.QuantitativeScale<D>): D[];
    }
    /**
     * Creates a TickGenerator using the specified interval.
     *
     * Generates ticks at multiples of the interval while also including the domain boundaries.
     *
     * @param {number} interval
     * @returns {TickGenerator}
     */
    function intervalTickGenerator(interval: number): TickGenerator<number>;
    /**
     * Creates a TickGenerator returns only integer tick values.
     *
     * @returns {TickGenerator}
     */
    function integerTickGenerator(): TickGenerator<number>;
}
