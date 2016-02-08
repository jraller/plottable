declare module Plottable.Utils.Stacking {
    type StackedDatum = {
        value: number;
        offset: number;
    };
    type StackingResult = Utils.Map<Dataset, Utils.Map<string, StackedDatum>>;
    /**
     * Computes the StackingResult (value and offset) for each data point in each Dataset.
     *
     * @param {Dataset[]} datasets The Datasets to be stacked on top of each other in the order of stacking
     * @param {Accessor<any>} keyAccessor Accessor for the key of the data
     * @param {Accessor<number>} valueAccessor Accessor for the value of the data
     * @return {StackingResult} value and offset for each datapoint in each Dataset
     */
    function stack(datasets: Dataset[], keyAccessor: Accessor<any>, valueAccessor: Accessor<number>): StackingResult;
    /**
     * Computes the total extent over all data points in all Datasets, taking stacking into consideration.
     *
     * @param {StackingResult} stackingResult The value and offset information for each datapoint in each dataset
     * @oaram {Accessor<any>} keyAccessor Accessor for the key of the data existent in the stackingResult
     * @param {Accessor<boolean>} filter A filter for data to be considered when computing the total extent
     * @return {[number, number]} The total extent
     */
    function stackedExtent(stackingResult: StackingResult, keyAccessor: Accessor<any>, filter: Accessor<boolean>): number[];
    /**
     * Normalizes a key used for stacking
     *
     * @param {any} key The key to be normalized
     * @return {string} The stringified key
     */
    function normalizeKey(key: any): string;
}
