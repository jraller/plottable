var Plottable;
(function (Plottable) {
    var Utils;
    (function (Utils) {
        var Stacking;
        (function (Stacking) {
            var nativeMath = window.Math;
            /**
             * Computes the StackingResult (value and offset) for each data point in each Dataset.
             *
             * @param {Dataset[]} datasets The Datasets to be stacked on top of each other in the order of stacking
             * @param {Accessor<any>} keyAccessor Accessor for the key of the data
             * @param {Accessor<number>} valueAccessor Accessor for the value of the data
             * @return {StackingResult} value and offset for each datapoint in each Dataset
             */
            function stack(datasets, keyAccessor, valueAccessor) {
                var positiveOffsets = d3.map();
                var negativeOffsets = d3.map();
                var datasetToKeyToStackedDatum = new Utils.Map();
                datasets.forEach(function (dataset) {
                    var keyToStackedDatum = new Utils.Map();
                    dataset.data().forEach(function (datum, index) {
                        var key = normalizeKey(keyAccessor(datum, index, dataset));
                        var value = +valueAccessor(datum, index, dataset);
                        var offset;
                        var offsetMap = (value >= 0) ? positiveOffsets : negativeOffsets;
                        if (offsetMap.has(key)) {
                            offset = offsetMap.get(key);
                            offsetMap.set(key, offset + value);
                        }
                        else {
                            offset = 0;
                            offsetMap.set(key, value);
                        }
                        keyToStackedDatum.set(key, {
                            value: value,
                            offset: offset
                        });
                    });
                    datasetToKeyToStackedDatum.set(dataset, keyToStackedDatum);
                });
                return datasetToKeyToStackedDatum;
            }
            Stacking.stack = stack;
            /**
             * Computes the total extent over all data points in all Datasets, taking stacking into consideration.
             *
             * @param {StackingResult} stackingResult The value and offset information for each datapoint in each dataset
             * @oaram {Accessor<any>} keyAccessor Accessor for the key of the data existent in the stackingResult
             * @param {Accessor<boolean>} filter A filter for data to be considered when computing the total extent
             * @return {[number, number]} The total extent
             */
            function stackedExtent(stackingResult, keyAccessor, filter) {
                var extents = [];
                stackingResult.forEach(function (stackedDatumMap, dataset) {
                    dataset.data().forEach(function (datum, index) {
                        if (filter != null && !filter(datum, index, dataset)) {
                            return;
                        }
                        var stackedDatum = stackedDatumMap.get(normalizeKey(keyAccessor(datum, index, dataset)));
                        extents.push(stackedDatum.value + stackedDatum.offset);
                    });
                });
                var maxStackExtent = Utils.Math.max(extents, 0);
                var minStackExtent = Utils.Math.min(extents, 0);
                return [nativeMath.min(minStackExtent, 0), nativeMath.max(0, maxStackExtent)];
            }
            Stacking.stackedExtent = stackedExtent;
            /**
             * Normalizes a key used for stacking
             *
             * @param {any} key The key to be normalized
             * @return {string} The stringified key
             */
            function normalizeKey(key) {
                return String(key);
            }
            Stacking.normalizeKey = normalizeKey;
        })(Stacking = Utils.Stacking || (Utils.Stacking = {}));
    })(Utils = Plottable.Utils || (Plottable.Utils = {}));
})(Plottable || (Plottable = {}));
