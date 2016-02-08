var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Components;
    (function (Components) {
        var Legend = (function (_super) {
            __extends(Legend, _super);
            /**
             * The Legend consists of a series of entries, each with a color and label taken from the Color Scale.
             *
             * @constructor
             * @param {Scale.Color} scale
             */
            function Legend(colorScale) {
                var _this = this;
                _super.call(this);
                this._padding = 5;
                this.addClass("legend");
                this.maxEntriesPerRow(1);
                if (colorScale == null) {
                    throw new Error("Legend requires a colorScale");
                }
                this._colorScale = colorScale;
                this._redrawCallback = function (scale) { return _this.redraw(); };
                this._colorScale.onUpdate(this._redrawCallback);
                this._formatter = Plottable.Formatters.identity();
                this.xAlignment("right").yAlignment("top");
                this.comparator(function (a, b) {
                    var formattedText = _this._colorScale.domain().slice().map(function (d) { return _this._formatter(d); });
                    return formattedText.indexOf(a) - formattedText.indexOf(b);
                });
                this._symbolFactoryAccessor = function () { return Plottable.SymbolFactories.circle(); };
                this._symbolOpacityAccessor = function () { return 1; };
            }
            Legend.prototype._setup = function () {
                _super.prototype._setup.call(this);
                var fakeLegendRow = this.content().append("g").classed(Legend.LEGEND_ROW_CLASS, true);
                var fakeLegendEntry = fakeLegendRow.append("g").classed(Legend.LEGEND_ENTRY_CLASS, true);
                fakeLegendEntry.append("text");
                this._measurer = new SVGTypewriter.Measurers.Measurer(fakeLegendRow);
                this._wrapper = new SVGTypewriter.Wrappers.Wrapper().maxLines(1);
                this._writer = new SVGTypewriter.Writers.Writer(this._measurer, this._wrapper).addTitleElement(Plottable.Configs.ADD_TITLE_ELEMENTS);
            };
            Legend.prototype.formatter = function (formatter) {
                if (formatter == null) {
                    return this._formatter;
                }
                this._formatter = formatter;
                this.redraw();
                return this;
            };
            Legend.prototype.maxEntriesPerRow = function (maxEntriesPerRow) {
                if (maxEntriesPerRow == null) {
                    return this._maxEntriesPerRow;
                }
                else {
                    this._maxEntriesPerRow = maxEntriesPerRow;
                    this.redraw();
                    return this;
                }
            };
            Legend.prototype.comparator = function (comparator) {
                if (comparator == null) {
                    return this._comparator;
                }
                else {
                    this._comparator = comparator;
                    this.redraw();
                    return this;
                }
            };
            Legend.prototype.colorScale = function (colorScale) {
                if (colorScale != null) {
                    this._colorScale.offUpdate(this._redrawCallback);
                    this._colorScale = colorScale;
                    this._colorScale.onUpdate(this._redrawCallback);
                    this.redraw();
                    return this;
                }
                else {
                    return this._colorScale;
                }
            };
            Legend.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                this._colorScale.offUpdate(this._redrawCallback);
            };
            Legend.prototype._calculateLayoutInfo = function (availableWidth, availableHeight) {
                var _this = this;
                var textHeight = this._measurer.measure().height;
                var availableWidthForEntries = Math.max(0, (availableWidth - this._padding));
                var entryNames = this._colorScale.domain().slice().sort(function (a, b) { return _this._comparator(_this._formatter(a), _this._formatter(b)); });
                var entryLengths = d3.map();
                var untruncatedEntryLengths = d3.map();
                entryNames.forEach(function (entryName) {
                    var untruncatedEntryLength = textHeight + _this._measurer.measure(_this._formatter(entryName)).width + _this._padding;
                    var entryLength = Math.min(untruncatedEntryLength, availableWidthForEntries);
                    entryLengths.set(entryName, entryLength);
                    untruncatedEntryLengths.set(entryName, untruncatedEntryLength);
                });
                var rows = this._packRows(availableWidthForEntries, entryNames, entryLengths);
                var rowsAvailable = Math.floor((availableHeight - 2 * this._padding) / textHeight);
                if (rowsAvailable !== rowsAvailable) {
                    rowsAvailable = 0;
                }
                return {
                    textHeight: textHeight,
                    entryLengths: entryLengths,
                    untruncatedEntryLengths: untruncatedEntryLengths,
                    rows: rows,
                    numRowsToDraw: Math.max(Math.min(rowsAvailable, rows.length), 0)
                };
            };
            Legend.prototype.requestedSpace = function (offeredWidth, offeredHeight) {
                var estimatedLayout = this._calculateLayoutInfo(offeredWidth, offeredHeight);
                var untruncatedRowLengths = estimatedLayout.rows.map(function (row) {
                    return d3.sum(row, function (entry) { return estimatedLayout.untruncatedEntryLengths.get(entry); });
                });
                var longestUntruncatedRowLength = Plottable.Utils.Math.max(untruncatedRowLengths, 0);
                return {
                    minWidth: this._padding + longestUntruncatedRowLength,
                    minHeight: estimatedLayout.rows.length * estimatedLayout.textHeight + 2 * this._padding
                };
            };
            Legend.prototype._packRows = function (availableWidth, entries, entryLengths) {
                var _this = this;
                var rows = [];
                var currentRow = [];
                var spaceLeft = availableWidth;
                entries.forEach(function (e) {
                    var entryLength = entryLengths.get(e);
                    if (entryLength > spaceLeft || currentRow.length === _this._maxEntriesPerRow) {
                        rows.push(currentRow);
                        currentRow = [];
                        spaceLeft = availableWidth;
                    }
                    currentRow.push(e);
                    spaceLeft -= entryLength;
                });
                if (currentRow.length !== 0) {
                    rows.push(currentRow);
                }
                return rows;
            };
            /**
             * Gets the Entities (representing Legend entries) at a particular point.
             * Returns an empty array if no Entities are present at that location.
             *
             * @param {Point} p
             * @returns {Entity<Legend>[]}
             */
            Legend.prototype.entitiesAt = function (p) {
                if (!this._isSetup) {
                    return [];
                }
                var entities = [];
                var layout = this._calculateLayoutInfo(this.width(), this.height());
                var legendPadding = this._padding;
                var legend = this;
                this.content().selectAll("g." + Legend.LEGEND_ROW_CLASS).each(function (d, i) {
                    var lowY = i * layout.textHeight + legendPadding;
                    var highY = (i + 1) * layout.textHeight + legendPadding;
                    var symbolY = (lowY + highY) / 2;
                    var lowX = legendPadding;
                    var highX = legendPadding;
                    d3.select(this).selectAll("g." + Legend.LEGEND_ENTRY_CLASS).each(function (value) {
                        highX += layout.entryLengths.get(value);
                        var symbolX = lowX + layout.textHeight / 2;
                        if (highX >= p.x && lowX <= p.x &&
                            highY >= p.y && lowY <= p.y) {
                            var entrySelection = d3.select(this);
                            var datum = entrySelection.datum();
                            entities.push({
                                datum: datum,
                                position: { x: symbolX, y: symbolY },
                                selection: entrySelection,
                                component: legend
                            });
                        }
                        lowX += layout.entryLengths.get(value);
                    });
                });
                return entities;
            };
            Legend.prototype.renderImmediately = function () {
                var _this = this;
                _super.prototype.renderImmediately.call(this);
                var layout = this._calculateLayoutInfo(this.width(), this.height());
                var rowsToDraw = layout.rows.slice(0, layout.numRowsToDraw);
                var rows = this.content().selectAll("g." + Legend.LEGEND_ROW_CLASS).data(rowsToDraw);
                rows.enter().append("g").classed(Legend.LEGEND_ROW_CLASS, true);
                rows.exit().remove();
                rows.attr("transform", function (d, i) { return "translate(0, " + (i * layout.textHeight + _this._padding) + ")"; });
                var entries = rows.selectAll("g." + Legend.LEGEND_ENTRY_CLASS).data(function (d) { return d; });
                var entriesEnter = entries.enter().append("g").classed(Legend.LEGEND_ENTRY_CLASS, true);
                entriesEnter.append("path");
                entriesEnter.append("g").classed("text-container", true);
                entries.exit().remove();
                var legendPadding = this._padding;
                rows.each(function (values) {
                    var xShift = legendPadding;
                    var entriesInRow = d3.select(this).selectAll("g." + Legend.LEGEND_ENTRY_CLASS);
                    entriesInRow.attr("transform", function (value, i) {
                        var translateString = "translate(" + xShift + ", 0)";
                        xShift += layout.entryLengths.get(value);
                        return translateString;
                    });
                });
                entries.select("path").attr("d", function (d, i, j) { return _this.symbol()(d, j)(layout.textHeight * 0.6); })
                    .attr("transform", "translate(" + (layout.textHeight / 2) + "," + layout.textHeight / 2 + ")")
                    .attr("fill", function (value) { return _this._colorScale.scale(value); })
                    .attr("opacity", function (d, i, j) { return _this.symbolOpacity()(d, j); })
                    .classed(Legend.LEGEND_SYMBOL_CLASS, true);
                var padding = this._padding;
                var textContainers = entries.select("g.text-container");
                textContainers.text(""); // clear out previous results
                var self = this;
                textContainers.attr("transform", "translate(" + layout.textHeight + ", 0)")
                    .each(function (value) {
                    var container = d3.select(this);
                    var maxTextLength = layout.entryLengths.get(value) - layout.textHeight - padding;
                    var writeOptions = {
                        selection: container,
                        xAlign: "left",
                        yAlign: "top",
                        textRotation: 0
                    };
                    self._writer.write(self._formatter(value), maxTextLength, self.height(), writeOptions);
                });
                return this;
            };
            Legend.prototype.symbol = function (symbol) {
                if (symbol == null) {
                    return this._symbolFactoryAccessor;
                }
                else {
                    this._symbolFactoryAccessor = symbol;
                    this.render();
                    return this;
                }
            };
            Legend.prototype.symbolOpacity = function (symbolOpacity) {
                if (symbolOpacity == null) {
                    return this._symbolOpacityAccessor;
                }
                else if (typeof symbolOpacity === "number") {
                    this._symbolOpacityAccessor = function () { return symbolOpacity; };
                }
                else {
                    this._symbolOpacityAccessor = symbolOpacity;
                }
                this.render();
                return this;
            };
            Legend.prototype.fixedWidth = function () {
                return true;
            };
            Legend.prototype.fixedHeight = function () {
                return true;
            };
            /**
             * The css class applied to each legend row
             */
            Legend.LEGEND_ROW_CLASS = "legend-row";
            /**
             * The css class applied to each legend entry
             */
            Legend.LEGEND_ENTRY_CLASS = "legend-entry";
            /**
             * The css class applied to each legend symbol
             */
            Legend.LEGEND_SYMBOL_CLASS = "legend-symbol";
            return Legend;
        })(Plottable.Component);
        Components.Legend = Legend;
    })(Components = Plottable.Components || (Plottable.Components = {}));
})(Plottable || (Plottable = {}));
