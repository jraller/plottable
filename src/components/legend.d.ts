declare module Plottable.Components {
    class Legend extends Component {
        /**
         * The css class applied to each legend row
         */
        static LEGEND_ROW_CLASS: string;
        /**
         * The css class applied to each legend entry
         */
        static LEGEND_ENTRY_CLASS: string;
        /**
         * The css class applied to each legend symbol
         */
        static LEGEND_SYMBOL_CLASS: string;
        private _padding;
        private _colorScale;
        private _formatter;
        private _maxEntriesPerRow;
        private _comparator;
        private _measurer;
        private _wrapper;
        private _writer;
        private _symbolFactoryAccessor;
        private _symbolOpacityAccessor;
        private _redrawCallback;
        /**
         * The Legend consists of a series of entries, each with a color and label taken from the Color Scale.
         *
         * @constructor
         * @param {Scale.Color} scale
         */
        constructor(colorScale: Scales.Color);
        protected _setup(): void;
        /**
         * Gets the Formatter for the entry texts.
         */
        formatter(): Formatter;
        /**
         * Sets the Formatter for the entry texts.
         *
         * @param {Formatter} formatter
         * @returns {Legend} The calling Legend.
         */
        formatter(formatter: Formatter): this;
        /**
         * Gets the maximum number of entries per row.
         *
         * @returns {number}
         */
        maxEntriesPerRow(): number;
        /**
         * Sets the maximum number of entries perrow.
         *
         * @param {number} maxEntriesPerRow
         * @returns {Legend} The calling Legend.
         */
        maxEntriesPerRow(maxEntriesPerRow: number): this;
        /**
         * Gets the current comparator for the Legend's entries.
         *
         * @returns {(a: string, b: string) => number}
         */
        comparator(): (a: string, b: string) => number;
        /**
         * Sets a new comparator for the Legend's entries.
         * The comparator is used to set the display order of the entries.
         *
         * @param {(a: string, b: string) => number} comparator
         * @returns {Legend} The calling Legend.
         */
        comparator(comparator: (a: string, b: string) => number): this;
        /**
         * Gets the Color Scale.
         *
         * @returns {Scales.Color}
         */
        colorScale(): Scales.Color;
        /**
         * Sets the Color Scale.
         *
         * @param {Scales.Color} scale
         * @returns {Legend} The calling Legend.
         */
        colorScale(colorScale: Scales.Color): this;
        destroy(): void;
        private _calculateLayoutInfo(availableWidth, availableHeight);
        requestedSpace(offeredWidth: number, offeredHeight: number): SpaceRequest;
        private _packRows(availableWidth, entries, entryLengths);
        /**
         * Gets the Entities (representing Legend entries) at a particular point.
         * Returns an empty array if no Entities are present at that location.
         *
         * @param {Point} p
         * @returns {Entity<Legend>[]}
         */
        entitiesAt(p: Point): Entity<Legend>[];
        renderImmediately(): this;
        /**
         * Gets the function determining the symbols of the Legend.
         *
         * @returns {(datum: any, index: number) => symbolFactory}
         */
        symbol(): (datum: any, index: number) => SymbolFactory;
        /**
         * Sets the function determining the symbols of the Legend.
         *
         * @param {(datum: any, index: number) => SymbolFactory} symbol
         * @returns {Legend} The calling Legend
         */
        symbol(symbol: (datum: any, index: number) => SymbolFactory): this;
        /**
         * Gets the opacity of the symbols of the Legend.
         *
         * @returns {(datum: any, index: number) => number}
         */
        symbolOpacity(): (datum: any, index: number) => number;
        /**
         * Sets the opacity of the symbols of the Legend.
         *
         * @param {number | ((datum: any, index: number) => number)} symbolOpacity
         * @returns {Legend} The calling Legend
         */
        symbolOpacity(symbolOpacity: number | ((datum: any, index: number) => number)): this;
        fixedWidth(): boolean;
        fixedHeight(): boolean;
    }
}
