declare module Plottable.Scales {
    /**
     * A function that supplies domain values to be included into a Scale.
     *
     * @param {Scale} scale
     * @returns {D[]} An array of values that should be included in the Scale.
     */
    interface IncludedValuesProvider<D> {
        (scale: Scale<D, any>): D[];
    }
    /**
     * A function that supplies padding exception values for the Scale.
     * If one end of the domain is set to an excepted value as a result of autoDomain()-ing,
     * that end of the domain will not be padded.
     *
     * @param {QuantitativeScale} scale
     * @returns {D[]} An array of values that should not be padded.
     */
    interface PaddingExceptionsProvider<D> {
        (scale: QuantitativeScale<D>): D[];
    }
}
declare module Plottable {
    interface ScaleCallback<S extends Scale<any, any>> {
        (scale: S): any;
    }
    class Scale<D, R> {
        private _callbacks;
        private _autoDomainAutomatically;
        private _domainModificationInProgress;
        private _includedValuesProviders;
        /**
         * A Scale is a function (in the mathematical sense) that maps values from a domain to a range.
         *
         * @constructor
         */
        constructor();
        /**
         * Given an array of potential domain values, computes the extent of those values.
         *
         * @param {D[]} values
         * @returns {D[]} The extent of the input values.
         */
        extentOfValues(values: D[]): D[];
        protected _getAllIncludedValues(): D[];
        protected _getExtent(): D[];
        /**
         * Adds a callback to be called when the Scale updates.
         *
         * @param {ScaleCallback} callback.
         * @returns {Scale} The calling Scale.
         */
        onUpdate(callback: ScaleCallback<this>): this;
        /**
         * Removes a callback that would be called when the Scale updates.
         *
         * @param {ScaleCallback} callback.
         * @returns {Scale} The calling Scale.
         */
        offUpdate(callback: ScaleCallback<this>): this;
        protected _dispatchUpdate(): void;
        /**
         * Sets the Scale's domain so that it spans the Extents of all its ExtentsProviders.
         *
         * @returns {Scale} The calling Scale.
         */
        autoDomain(): this;
        protected _autoDomainIfAutomaticMode(): void;
        /**
         * Computes the range value corresponding to a given domain value.
         *
         * @param {D} value
         * @returns {R} The range value corresponding to the supplied domain value.
         */
        scale(value: D): R;
        /**
         * Gets the domain.
         *
         * @returns {D[]} The current domain.
         */
        domain(): D[];
        /**
         * Sets the domain.
         *
         * @param {D[]} values
         * @returns {Scale} The calling Scale.
         */
        domain(values: D[]): this;
        protected _getDomain(): D[];
        protected _setDomain(values: D[]): void;
        protected _setBackingScaleDomain(values: D[]): void;
        /**
         * Gets the range.
         *
         * @returns {R[]} The current range.
         */
        range(): R[];
        /**
         * Sets the range.
         *
         * @param {R[]} values
         * @returns {Scale} The calling Scale.
         */
        range(values: R[]): this;
        protected _getRange(): R[];
        protected _setRange(values: R[]): void;
        /**
         * Adds an IncludedValuesProvider to the Scale.
         *
         * @param {Scales.IncludedValuesProvider} provider
         * @returns {Scale} The calling Scale.
         */
        addIncludedValuesProvider(provider: Scales.IncludedValuesProvider<D>): this;
        /**
         * Removes the IncludedValuesProvider from the Scale.
         *
         * @param {Scales.IncludedValuesProvider} provider
         * @returns {Scale} The calling Scale.
         */
        removeIncludedValuesProvider(provider: Scales.IncludedValuesProvider<D>): this;
    }
}
