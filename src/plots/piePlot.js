var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Plots;
    (function (Plots) {
        var Pie = (function (_super) {
            __extends(Pie, _super);
            /**
             * @constructor
             */
            function Pie() {
                var _this = this;
                _super.call(this);
                this._labelFormatter = Plottable.Formatters.identity();
                this._labelsEnabled = false;
                this.innerRadius(0);
                this.outerRadius(function () { return Math.min(_this.width(), _this.height()) / 2; });
                this.addClass("pie-plot");
                this.attr("fill", function (d, i) { return String(i); }, new Plottable.Scales.Color());
                this._strokeDrawers = new Plottable.Utils.Map();
            }
            Pie.prototype._setup = function () {
                var _this = this;
                _super.prototype._setup.call(this);
                this._strokeDrawers.forEach(function (d) { return d.renderArea(_this._renderArea.append("g")); });
            };
            Pie.prototype.computeLayout = function (origin, availableWidth, availableHeight) {
                _super.prototype.computeLayout.call(this, origin, availableWidth, availableHeight);
                this._renderArea.attr("transform", "translate(" + this.width() / 2 + "," + this.height() / 2 + ")");
                var radiusLimit = Math.min(this.width(), this.height()) / 2;
                if (this.innerRadius().scale != null) {
                    this.innerRadius().scale.range([0, radiusLimit]);
                }
                if (this.outerRadius().scale != null) {
                    this.outerRadius().scale.range([0, radiusLimit]);
                }
                return this;
            };
            Pie.prototype.addDataset = function (dataset) {
                _super.prototype.addDataset.call(this, dataset);
                return this;
            };
            Pie.prototype._addDataset = function (dataset) {
                if (this.datasets().length === 1) {
                    Plottable.Utils.Window.warn("Only one dataset is supported in Pie plots");
                    return this;
                }
                this._updatePieAngles();
                var strokeDrawer = new Plottable.Drawers.ArcOutline(dataset);
                if (this._isSetup) {
                    strokeDrawer.renderArea(this._renderArea.append("g"));
                }
                this._strokeDrawers.set(dataset, strokeDrawer);
                _super.prototype._addDataset.call(this, dataset);
                return this;
            };
            Pie.prototype.removeDataset = function (dataset) {
                _super.prototype.removeDataset.call(this, dataset);
                return this;
            };
            Pie.prototype._removeDatasetNodes = function (dataset) {
                _super.prototype._removeDatasetNodes.call(this, dataset);
                this._strokeDrawers.get(dataset).remove();
            };
            Pie.prototype._removeDataset = function (dataset) {
                _super.prototype._removeDataset.call(this, dataset);
                this._startAngles = [];
                this._endAngles = [];
                return this;
            };
            Pie.prototype.selections = function (datasets) {
                var _this = this;
                if (datasets === void 0) { datasets = this.datasets(); }
                var allSelections = _super.prototype.selections.call(this, datasets)[0];
                datasets.forEach(function (dataset) {
                    var drawer = _this._strokeDrawers.get(dataset);
                    if (drawer == null) {
                        return;
                    }
                    drawer.renderArea().selectAll(drawer.selector()).each(function () {
                        allSelections.push(this);
                    });
                });
                return d3.selectAll(allSelections);
            };
            Pie.prototype._onDatasetUpdate = function () {
                this._updatePieAngles();
                _super.prototype._onDatasetUpdate.call(this);
            };
            Pie.prototype._createDrawer = function (dataset) {
                return new Plottable.Drawers.Arc(dataset);
            };
            Pie.prototype.entities = function (datasets) {
                var _this = this;
                if (datasets === void 0) { datasets = this.datasets(); }
                var entities = _super.prototype.entities.call(this, datasets);
                entities.forEach(function (entity) {
                    entity.position.x += _this.width() / 2;
                    entity.position.y += _this.height() / 2;
                    var stroke = _this._strokeDrawers.get(entity.dataset).selectionForIndex(entity.index);
                    entity.selection[0].push(stroke[0][0]);
                });
                return entities;
            };
            Pie.prototype.sectorValue = function (sectorValue, scale) {
                if (sectorValue == null) {
                    return this._propertyBindings.get(Pie._SECTOR_VALUE_KEY);
                }
                this._bindProperty(Pie._SECTOR_VALUE_KEY, sectorValue, scale);
                this._updatePieAngles();
                this.render();
                return this;
            };
            Pie.prototype.innerRadius = function (innerRadius, scale) {
                if (innerRadius == null) {
                    return this._propertyBindings.get(Pie._INNER_RADIUS_KEY);
                }
                this._bindProperty(Pie._INNER_RADIUS_KEY, innerRadius, scale);
                this.render();
                return this;
            };
            Pie.prototype.outerRadius = function (outerRadius, scale) {
                if (outerRadius == null) {
                    return this._propertyBindings.get(Pie._OUTER_RADIUS_KEY);
                }
                this._bindProperty(Pie._OUTER_RADIUS_KEY, outerRadius, scale);
                this.render();
                return this;
            };
            Pie.prototype.labelsEnabled = function (enabled) {
                if (enabled == null) {
                    return this._labelsEnabled;
                }
                else {
                    this._labelsEnabled = enabled;
                    this.render();
                    return this;
                }
            };
            Pie.prototype.labelFormatter = function (formatter) {
                if (formatter == null) {
                    return this._labelFormatter;
                }
                else {
                    this._labelFormatter = formatter;
                    this.render();
                    return this;
                }
            };
            /*
             * Gets the Entities at a particular Point.
             *
             * @param {Point} p
             * @param {PlotEntity[]}
             */
            Pie.prototype.entitiesAt = function (queryPoint) {
                var center = { x: this.width() / 2, y: this.height() / 2 };
                var adjustedQueryPoint = { x: queryPoint.x - center.x, y: queryPoint.y - center.y };
                var index = this._sliceIndexForPoint(adjustedQueryPoint);
                return index == null ? [] : [this.entities()[index]];
            };
            Pie.prototype._propertyProjectors = function () {
                var _this = this;
                var attrToProjector = _super.prototype._propertyProjectors.call(this);
                var innerRadiusAccessor = Plottable.Plot._scaledAccessor(this.innerRadius());
                var outerRadiusAccessor = Plottable.Plot._scaledAccessor(this.outerRadius());
                attrToProjector["d"] = function (datum, index, ds) {
                    return d3.svg.arc().innerRadius(innerRadiusAccessor(datum, index, ds))
                        .outerRadius(outerRadiusAccessor(datum, index, ds))
                        .startAngle(_this._startAngles[index])
                        .endAngle(_this._endAngles[index])(datum, index);
                };
                return attrToProjector;
            };
            Pie.prototype._updatePieAngles = function () {
                if (this.sectorValue() == null) {
                    return;
                }
                if (this.datasets().length === 0) {
                    return;
                }
                var sectorValueAccessor = Plottable.Plot._scaledAccessor(this.sectorValue());
                var dataset = this.datasets()[0];
                var data = this._getDataToDraw().get(dataset);
                var pie = d3.layout.pie().sort(null).value(function (d, i) { return sectorValueAccessor(d, i, dataset); })(data);
                this._startAngles = pie.map(function (slice) { return slice.startAngle; });
                this._endAngles = pie.map(function (slice) { return slice.endAngle; });
            };
            Pie.prototype._getDataToDraw = function () {
                var dataToDraw = _super.prototype._getDataToDraw.call(this);
                if (this.datasets().length === 0) {
                    return dataToDraw;
                }
                var sectorValueAccessor = Plottable.Plot._scaledAccessor(this.sectorValue());
                var ds = this.datasets()[0];
                var data = dataToDraw.get(ds);
                var filteredData = data.filter(function (d, i) { return Pie._isValidData(sectorValueAccessor(d, i, ds)); });
                dataToDraw.set(ds, filteredData);
                return dataToDraw;
            };
            Pie._isValidData = function (value) {
                return Plottable.Utils.Math.isValidNumber(value) && value >= 0;
            };
            Pie.prototype._pixelPoint = function (datum, index, dataset) {
                var scaledValueAccessor = Plottable.Plot._scaledAccessor(this.sectorValue());
                if (!Pie._isValidData(scaledValueAccessor(datum, index, dataset))) {
                    return { x: NaN, y: NaN };
                }
                var innerRadius = Plottable.Plot._scaledAccessor(this.innerRadius())(datum, index, dataset);
                var outerRadius = Plottable.Plot._scaledAccessor(this.outerRadius())(datum, index, dataset);
                var avgRadius = (innerRadius + outerRadius) / 2;
                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d, i) {
                    var value = scaledValueAccessor(d, i, dataset);
                    return Pie._isValidData(value) ? value : 0;
                })(dataset.data());
                var startAngle = pie[index].startAngle;
                var endAngle = pie[index].endAngle;
                var avgAngle = (startAngle + endAngle) / 2;
                return { x: avgRadius * Math.sin(avgAngle), y: -avgRadius * Math.cos(avgAngle) };
            };
            Pie.prototype._additionalPaint = function (time) {
                var _this = this;
                this._renderArea.select(".label-area").remove();
                if (this._labelsEnabled) {
                    Plottable.Utils.Window.setTimeout(function () { return _this._drawLabels(); }, time);
                }
                var drawSteps = this._generateStrokeDrawSteps();
                var dataToDraw = this._getDataToDraw();
                this.datasets().forEach(function (dataset) { return _this._strokeDrawers.get(dataset).draw(dataToDraw.get(dataset), drawSteps); });
            };
            Pie.prototype._generateStrokeDrawSteps = function () {
                var attrToProjector = this._generateAttrToProjector();
                return [{ attrToProjector: attrToProjector, animator: new Plottable.Animators.Null() }];
            };
            Pie.prototype._sliceIndexForPoint = function (p) {
                var pointRadius = Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
                var pointAngle = Math.acos(-p.y / pointRadius);
                if (p.x < 0) {
                    pointAngle = Math.PI * 2 - pointAngle;
                }
                var index;
                for (var i = 0; i < this._startAngles.length; i++) {
                    if (this._startAngles[i] < pointAngle && this._endAngles[i] > pointAngle) {
                        index = i;
                        break;
                    }
                }
                if (index !== undefined) {
                    var dataset = this.datasets()[0];
                    var datum = dataset.data()[index];
                    var innerRadius = this.innerRadius().accessor(datum, index, dataset);
                    var outerRadius = this.outerRadius().accessor(datum, index, dataset);
                    if (pointRadius > innerRadius && pointRadius < outerRadius) {
                        return index;
                    }
                }
                return null;
            };
            Pie.prototype._drawLabels = function () {
                var _this = this;
                var attrToProjector = this._generateAttrToProjector();
                var labelArea = this._renderArea.append("g").classed("label-area", true);
                var measurer = new SVGTypewriter.Measurers.Measurer(labelArea);
                var writer = new SVGTypewriter.Writers.Writer(measurer);
                var dataset = this.datasets()[0];
                var data = this._getDataToDraw().get(dataset);
                data.forEach(function (datum, datumIndex) {
                    var value = _this.sectorValue().accessor(datum, datumIndex, dataset);
                    if (!Plottable.Utils.Math.isValidNumber(value)) {
                        return;
                    }
                    value = _this._labelFormatter(value);
                    var measurement = measurer.measure(value);
                    var theta = (_this._endAngles[datumIndex] + _this._startAngles[datumIndex]) / 2;
                    var outerRadius = _this.outerRadius().accessor(datum, datumIndex, dataset);
                    if (_this.outerRadius().scale) {
                        outerRadius = _this.outerRadius().scale.scale(outerRadius);
                    }
                    var innerRadius = _this.innerRadius().accessor(datum, datumIndex, dataset);
                    if (_this.innerRadius().scale) {
                        innerRadius = _this.innerRadius().scale.scale(innerRadius);
                    }
                    var labelRadius = (outerRadius + innerRadius) / 2;
                    var x = Math.sin(theta) * labelRadius - measurement.width / 2;
                    var y = -Math.cos(theta) * labelRadius - measurement.height / 2;
                    var corners = [
                        { x: x, y: y },
                        { x: x, y: y + measurement.height },
                        { x: x + measurement.width, y: y },
                        { x: x + measurement.width, y: y + measurement.height }
                    ];
                    var showLabel = corners.every(function (corner) {
                        return Math.abs(corner.x) <= _this.width() / 2 && Math.abs(corner.y) <= _this.height() / 2;
                    });
                    if (showLabel) {
                        var sliceIndices = corners.map(function (corner) { return _this._sliceIndexForPoint(corner); });
                        showLabel = sliceIndices.every(function (index) { return index === datumIndex; });
                    }
                    var color = attrToProjector["fill"](datum, datumIndex, dataset);
                    var dark = Plottable.Utils.Color.contrast("white", color) * 1.6 < Plottable.Utils.Color.contrast("black", color);
                    var g = labelArea.append("g").attr("transform", "translate(" + x + "," + y + ")");
                    var className = dark ? "dark-label" : "light-label";
                    g.classed(className, true);
                    g.style("visibility", showLabel ? "inherit" : "hidden");
                    writer.write(value, measurement.width, measurement.height, {
                        selection: g,
                        xAlign: "center",
                        yAlign: "center",
                        textRotation: 0
                    });
                });
            };
            Pie._INNER_RADIUS_KEY = "inner-radius";
            Pie._OUTER_RADIUS_KEY = "outer-radius";
            Pie._SECTOR_VALUE_KEY = "sector-value";
            return Pie;
        })(Plottable.Plot);
        Plots.Pie = Pie;
    })(Plots = Plottable.Plots || (Plottable.Plots = {}));
})(Plottable || (Plottable = {}));
