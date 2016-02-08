var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var XYPlot = (function (_super) {
        __extends(XYPlot, _super);
        /**
         * An XYPlot is a Plot that displays data along two primary directions, X and Y.
         *
         * @constructor
         * @param {Scale} xScale The x scale to use.
         * @param {Scale} yScale The y scale to use.
         */
        function XYPlot() {
            var _this = this;
            _super.call(this);
            this._autoAdjustXScaleDomain = false;
            this._autoAdjustYScaleDomain = false;
            this._deferredRendering = false;
            this._cachedDomainX = [null, null];
            this._cachedDomainY = [null, null];
            this.addClass("xy-plot");
            this._adjustYDomainOnChangeFromXCallback = function (scale) { return _this._adjustYDomainOnChangeFromX(); };
            this._adjustXDomainOnChangeFromYCallback = function (scale) { return _this._adjustXDomainOnChangeFromY(); };
            var _deltaX = 0;
            var _deltaY = 0;
            var _scalingX = 1;
            var _scalingY = 1;
            var _lastSeenDomainX = [null, null];
            var _lastSeenDomainY = [null, null];
            var _timeoutReference = 0;
            var _deferredRenderingTimeout = 500;
            var _registerDeferredRendering = function () {
                if (_this._renderArea == null) {
                    return;
                }
                _this._renderArea.attr("transform", "translate(" + _deltaX + ", " + _deltaY + ")" +
                    "scale(" + _scalingX + ", " + _scalingY + ")");
                clearTimeout(_timeoutReference);
                _timeoutReference = setTimeout(function () {
                    _this._cachedDomainX = _lastSeenDomainX;
                    _this._cachedDomainY = _lastSeenDomainY;
                    _deltaX = 0;
                    _deltaY = 0;
                    _scalingX = 1;
                    _scalingY = 1;
                    _this.render();
                    _this._renderArea.attr("transform", "translate(0, 0) scale(1, 1)");
                }, _deferredRenderingTimeout);
            };
            var _lazyDomainChangeCallbackX = function (scale) {
                if (!_this._isAnchored) {
                    return;
                }
                _lastSeenDomainX = scale.domain();
                _scalingX = (scale.scale(_this._cachedDomainX[1]) - scale.scale(_this._cachedDomainX[0])) /
                    (scale.scale(_lastSeenDomainX[1]) - scale.scale(_lastSeenDomainX[0])) || 1;
                _deltaX = scale.scale(_this._cachedDomainX[0]) - scale.scale(_lastSeenDomainX[0]) || 0;
                _registerDeferredRendering();
            };
            var _lazyDomainChangeCallbackY = function (scale) {
                if (!_this._isAnchored) {
                    return;
                }
                _lastSeenDomainY = scale.domain();
                _scalingY = (scale.scale(_this._cachedDomainY[1]) - scale.scale(_this._cachedDomainY[0])) /
                    (scale.scale(_lastSeenDomainY[1]) - scale.scale(_lastSeenDomainY[0])) || 1;
                _deltaY = scale.scale(_this._cachedDomainY[0]) - scale.scale(_lastSeenDomainY[0]) * _scalingY || 0;
                _registerDeferredRendering();
            };
            this._renderCallback = function (scale) {
                if (_this.deferredRendering() && _this.x() && _this.x().scale === scale) {
                    _lazyDomainChangeCallbackX(scale);
                }
                else if (_this.deferredRendering() && _this.y() && _this.y().scale === scale) {
                    _lazyDomainChangeCallbackY(scale);
                }
                else {
                    _this.render();
                }
            };
        }
        XYPlot.prototype.deferredRendering = function (deferredRendering) {
            if (deferredRendering == null) {
                return this._deferredRendering;
            }
            if (deferredRendering && this._isAnchored) {
                if (this.x() && this.x().scale) {
                    this._cachedDomainX = this.x().scale.domain();
                }
                if (this.y() && this.y().scale) {
                    this._cachedDomainY = this.y().scale.domain();
                }
            }
            this._deferredRendering = deferredRendering;
            return this;
        };
        XYPlot.prototype.x = function (x, xScale) {
            if (x == null) {
                return this._propertyBindings.get(XYPlot._X_KEY);
            }
            this._bindProperty(XYPlot._X_KEY, x, xScale);
            var width = this.width();
            if (xScale != null && width != null) {
                xScale.range([0, width]);
            }
            if (this._autoAdjustYScaleDomain) {
                this._updateYExtentsAndAutodomain();
            }
            this.render();
            return this;
        };
        XYPlot.prototype.y = function (y, yScale) {
            if (y == null) {
                return this._propertyBindings.get(XYPlot._Y_KEY);
            }
            this._bindProperty(XYPlot._Y_KEY, y, yScale);
            var height = this.height();
            if (yScale != null && height != null) {
                if (yScale instanceof Plottable.Scales.Category) {
                    yScale.range([0, height]);
                }
                else {
                    yScale.range([height, 0]);
                }
            }
            if (this._autoAdjustXScaleDomain) {
                this._updateXExtentsAndAutodomain();
            }
            this.render();
            return this;
        };
        XYPlot.prototype._filterForProperty = function (property) {
            if (property === "x" && this._autoAdjustXScaleDomain) {
                return this._makeFilterByProperty("y");
            }
            else if (property === "y" && this._autoAdjustYScaleDomain) {
                return this._makeFilterByProperty("x");
            }
            return null;
        };
        XYPlot.prototype._makeFilterByProperty = function (property) {
            var binding = this._propertyBindings.get(property);
            if (binding != null) {
                var accessor = binding.accessor;
                var scale = binding.scale;
                if (scale != null) {
                    return function (datum, index, dataset) {
                        var range = scale.range();
                        return Plottable.Utils.Math.inRange(scale.scale(accessor(datum, index, dataset)), range[0], range[1]);
                    };
                }
            }
            return null;
        };
        XYPlot.prototype._uninstallScaleForKey = function (scale, key) {
            _super.prototype._uninstallScaleForKey.call(this, scale, key);
            var adjustCallback = key === XYPlot._X_KEY ? this._adjustYDomainOnChangeFromXCallback
                : this._adjustXDomainOnChangeFromYCallback;
            scale.offUpdate(adjustCallback);
        };
        XYPlot.prototype._installScaleForKey = function (scale, key) {
            _super.prototype._installScaleForKey.call(this, scale, key);
            var adjustCallback = key === XYPlot._X_KEY ? this._adjustYDomainOnChangeFromXCallback
                : this._adjustXDomainOnChangeFromYCallback;
            scale.onUpdate(adjustCallback);
        };
        XYPlot.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (this.x().scale) {
                this.x().scale.offUpdate(this._adjustYDomainOnChangeFromXCallback);
            }
            if (this.y().scale) {
                this.y().scale.offUpdate(this._adjustXDomainOnChangeFromYCallback);
            }
            return this;
        };
        XYPlot.prototype.autorangeMode = function (autorangeMode) {
            if (autorangeMode == null) {
                if (this._autoAdjustXScaleDomain) {
                    return "x";
                }
                if (this._autoAdjustYScaleDomain) {
                    return "y";
                }
                return "none";
            }
            switch (autorangeMode) {
                case "x":
                    this._autoAdjustXScaleDomain = true;
                    this._autoAdjustYScaleDomain = false;
                    this._adjustXDomainOnChangeFromY();
                    break;
                case "y":
                    this._autoAdjustXScaleDomain = false;
                    this._autoAdjustYScaleDomain = true;
                    this._adjustYDomainOnChangeFromX();
                    break;
                case "none":
                    this._autoAdjustXScaleDomain = false;
                    this._autoAdjustYScaleDomain = false;
                    break;
                default:
                    throw new Error("Invalid scale name '" + autorangeMode + "', must be 'x', 'y' or 'none'");
            }
            return this;
        };
        XYPlot.prototype.computeLayout = function (origin, availableWidth, availableHeight) {
            _super.prototype.computeLayout.call(this, origin, availableWidth, availableHeight);
            var xBinding = this.x();
            var xScale = xBinding && xBinding.scale;
            if (xScale != null) {
                xScale.range([0, this.width()]);
            }
            var yBinding = this.y();
            var yScale = yBinding && yBinding.scale;
            if (yScale != null) {
                if (yScale instanceof Plottable.Scales.Category) {
                    yScale.range([0, this.height()]);
                }
                else {
                    yScale.range([this.height(), 0]);
                }
            }
            return this;
        };
        XYPlot.prototype._updateXExtentsAndAutodomain = function () {
            this._updateExtentsForProperty("x");
            var xScale = this.x().scale;
            if (xScale != null) {
                xScale.autoDomain();
            }
        };
        XYPlot.prototype._updateYExtentsAndAutodomain = function () {
            this._updateExtentsForProperty("y");
            var yScale = this.y().scale;
            if (yScale != null) {
                yScale.autoDomain();
            }
        };
        /**
         * Adjusts the domains of both X and Y scales to show all data.
         * This call does not override the autorange() behavior.
         *
         * @returns {XYPlot} The calling XYPlot.
         */
        XYPlot.prototype.showAllData = function () {
            this._updateXExtentsAndAutodomain();
            this._updateYExtentsAndAutodomain();
            return this;
        };
        XYPlot.prototype._adjustYDomainOnChangeFromX = function () {
            if (!this._projectorsReady()) {
                return;
            }
            if (this._autoAdjustYScaleDomain) {
                this._updateYExtentsAndAutodomain();
            }
        };
        XYPlot.prototype._adjustXDomainOnChangeFromY = function () {
            if (!this._projectorsReady()) {
                return;
            }
            if (this._autoAdjustXScaleDomain) {
                this._updateXExtentsAndAutodomain();
            }
        };
        XYPlot.prototype._projectorsReady = function () {
            var xBinding = this.x();
            var yBinding = this.y();
            return xBinding != null &&
                xBinding.accessor != null &&
                yBinding != null &&
                yBinding.accessor != null;
        };
        XYPlot.prototype._pixelPoint = function (datum, index, dataset) {
            var xProjector = Plottable.Plot._scaledAccessor(this.x());
            var yProjector = Plottable.Plot._scaledAccessor(this.y());
            return { x: xProjector(datum, index, dataset), y: yProjector(datum, index, dataset) };
        };
        XYPlot.prototype._getDataToDraw = function () {
            var _this = this;
            var dataToDraw = _super.prototype._getDataToDraw.call(this);
            var definedFunction = function (d, i, dataset) {
                var positionX = Plottable.Plot._scaledAccessor(_this.x())(d, i, dataset);
                var positionY = Plottable.Plot._scaledAccessor(_this.y())(d, i, dataset);
                return Plottable.Utils.Math.isValidNumber(positionX) &&
                    Plottable.Utils.Math.isValidNumber(positionY);
            };
            this.datasets().forEach(function (dataset) {
                dataToDraw.set(dataset, dataToDraw.get(dataset).filter(function (d, i) { return definedFunction(d, i, dataset); }));
            });
            return dataToDraw;
        };
        XYPlot._X_KEY = "x";
        XYPlot._Y_KEY = "y";
        return XYPlot;
    })(Plottable.Plot);
    Plottable.XYPlot = XYPlot;
})(Plottable || (Plottable = {}));
