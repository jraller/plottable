var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Interactions;
    (function (Interactions) {
        var PanZoom = (function (_super) {
            __extends(PanZoom, _super);
            /**
             * A PanZoom Interaction updates the domains of an x-scale and/or a y-scale
             * in response to the user panning or zooming.
             *
             * @constructor
             * @param {QuantitativeScale} [xScale] The x-scale to update on panning/zooming.
             * @param {QuantitativeScale} [yScale] The y-scale to update on panning/zooming.
             */
            function PanZoom(xScale, yScale) {
                var _this = this;
                _super.call(this);
                this._wheelCallback = function (p, e) { return _this._handleWheelEvent(p, e); };
                this._touchStartCallback = function (ids, idToPoint, e) { return _this._handleTouchStart(ids, idToPoint, e); };
                this._touchMoveCallback = function (ids, idToPoint, e) { return _this._handlePinch(ids, idToPoint, e); };
                this._touchEndCallback = function (ids, idToPoint, e) { return _this._handleTouchEnd(ids, idToPoint, e); };
                this._touchCancelCallback = function (ids, idToPoint, e) { return _this._handleTouchEnd(ids, idToPoint, e); };
                this._xScales = new Plottable.Utils.Set();
                this._yScales = new Plottable.Utils.Set();
                this._dragInteraction = new Interactions.Drag();
                this._setupDragInteraction();
                this._touchIds = d3.map();
                this._minDomainExtents = new Plottable.Utils.Map();
                this._maxDomainExtents = new Plottable.Utils.Map();
                if (xScale != null) {
                    this.addXScale(xScale);
                }
                if (yScale != null) {
                    this.addYScale(yScale);
                }
            }
            PanZoom.prototype._anchor = function (component) {
                _super.prototype._anchor.call(this, component);
                this._dragInteraction.attachTo(component);
                this._mouseDispatcher = Plottable.Dispatchers.Mouse.getDispatcher(this._componentAttachedTo.content().node());
                this._mouseDispatcher.onWheel(this._wheelCallback);
                this._touchDispatcher = Plottable.Dispatchers.Touch.getDispatcher(this._componentAttachedTo.content().node());
                this._touchDispatcher.onTouchStart(this._touchStartCallback);
                this._touchDispatcher.onTouchMove(this._touchMoveCallback);
                this._touchDispatcher.onTouchEnd(this._touchEndCallback);
                this._touchDispatcher.onTouchCancel(this._touchCancelCallback);
            };
            PanZoom.prototype._unanchor = function () {
                _super.prototype._unanchor.call(this);
                this._mouseDispatcher.offWheel(this._wheelCallback);
                this._mouseDispatcher = null;
                this._touchDispatcher.offTouchStart(this._touchStartCallback);
                this._touchDispatcher.offTouchMove(this._touchMoveCallback);
                this._touchDispatcher.offTouchEnd(this._touchEndCallback);
                this._touchDispatcher.offTouchCancel(this._touchCancelCallback);
                this._touchDispatcher = null;
                this._dragInteraction.detachFrom(this._componentAttachedTo);
            };
            PanZoom.prototype._handleTouchStart = function (ids, idToPoint, e) {
                for (var i = 0; i < ids.length && this._touchIds.size() < 2; i++) {
                    var id = ids[i];
                    this._touchIds.set(id.toString(), this._translateToComponentSpace(idToPoint[id]));
                }
            };
            PanZoom.prototype._handlePinch = function (ids, idToPoint, e) {
                var _this = this;
                if (this._touchIds.size() < 2) {
                    return;
                }
                var oldPoints = this._touchIds.values();
                if (!this._isInsideComponent(this._translateToComponentSpace(oldPoints[0])) ||
                    !this._isInsideComponent(this._translateToComponentSpace(oldPoints[1]))) {
                    return;
                }
                var oldCornerDistance = PanZoom._pointDistance(oldPoints[0], oldPoints[1]);
                if (oldCornerDistance === 0) {
                    return;
                }
                ids.forEach(function (id) {
                    if (_this._touchIds.has(id.toString())) {
                        _this._touchIds.set(id.toString(), _this._translateToComponentSpace(idToPoint[id]));
                    }
                });
                var points = this._touchIds.values();
                var newCornerDistance = PanZoom._pointDistance(points[0], points[1]);
                if (newCornerDistance === 0) {
                    return;
                }
                var magnifyAmount = oldCornerDistance / newCornerDistance;
                var normalizedPointDiffs = points.map(function (point, i) {
                    return { x: (point.x - oldPoints[i].x) / magnifyAmount, y: (point.y - oldPoints[i].y) / magnifyAmount };
                });
                this.xScales().forEach(function (xScale) {
                    magnifyAmount = _this._constrainedZoomAmount(xScale, magnifyAmount);
                });
                this.yScales().forEach(function (yScale) {
                    magnifyAmount = _this._constrainedZoomAmount(yScale, magnifyAmount);
                });
                var constrainedPoints = oldPoints.map(function (oldPoint, i) {
                    return {
                        x: normalizedPointDiffs[i].x * magnifyAmount + oldPoint.x,
                        y: normalizedPointDiffs[i].y * magnifyAmount + oldPoint.y
                    };
                });
                var oldCenterPoint = PanZoom._centerPoint(oldPoints[0], oldPoints[1]);
                var translateAmountX = oldCenterPoint.x - ((constrainedPoints[0].x + constrainedPoints[1].x) / 2);
                this.xScales().forEach(function (xScale) {
                    _this._magnifyScale(xScale, magnifyAmount, oldCenterPoint.x);
                    _this._translateScale(xScale, translateAmountX);
                });
                var translateAmountY = oldCenterPoint.y - ((constrainedPoints[0].y + constrainedPoints[1].y) / 2);
                this.yScales().forEach(function (yScale) {
                    _this._magnifyScale(yScale, magnifyAmount, oldCenterPoint.y);
                    _this._translateScale(yScale, translateAmountY);
                });
            };
            PanZoom._centerPoint = function (point1, point2) {
                var leftX = Math.min(point1.x, point2.x);
                var rightX = Math.max(point1.x, point2.x);
                var topY = Math.min(point1.y, point2.y);
                var bottomY = Math.max(point1.y, point2.y);
                return { x: (leftX + rightX) / 2, y: (bottomY + topY) / 2 };
            };
            PanZoom._pointDistance = function (point1, point2) {
                var leftX = Math.min(point1.x, point2.x);
                var rightX = Math.max(point1.x, point2.x);
                var topY = Math.min(point1.y, point2.y);
                var bottomY = Math.max(point1.y, point2.y);
                return Math.sqrt(Math.pow(rightX - leftX, 2) + Math.pow(bottomY - topY, 2));
            };
            PanZoom.prototype._handleTouchEnd = function (ids, idToPoint, e) {
                var _this = this;
                ids.forEach(function (id) {
                    _this._touchIds.remove(id.toString());
                });
            };
            PanZoom.prototype._magnifyScale = function (scale, magnifyAmount, centerValue) {
                var magnifyTransform = function (rangeValue) { return scale.invert(centerValue - (centerValue - rangeValue) * magnifyAmount); };
                scale.domain(scale.range().map(magnifyTransform));
            };
            PanZoom.prototype._translateScale = function (scale, translateAmount) {
                var translateTransform = function (rangeValue) { return scale.invert(rangeValue + translateAmount); };
                scale.domain(scale.range().map(translateTransform));
            };
            PanZoom.prototype._handleWheelEvent = function (p, e) {
                var _this = this;
                var translatedP = this._translateToComponentSpace(p);
                if (this._isInsideComponent(translatedP)) {
                    e.preventDefault();
                    var deltaPixelAmount = e.deltaY * (e.deltaMode ? PanZoom._PIXELS_PER_LINE : 1);
                    var zoomAmount = Math.pow(2, deltaPixelAmount * .002);
                    this.xScales().forEach(function (xScale) {
                        zoomAmount = _this._constrainedZoomAmount(xScale, zoomAmount);
                    });
                    this.yScales().forEach(function (yScale) {
                        zoomAmount = _this._constrainedZoomAmount(yScale, zoomAmount);
                    });
                    this.xScales().forEach(function (xScale) {
                        _this._magnifyScale(xScale, zoomAmount, translatedP.x);
                    });
                    this.yScales().forEach(function (yScale) {
                        _this._magnifyScale(yScale, zoomAmount, translatedP.y);
                    });
                }
            };
            PanZoom.prototype._constrainedZoomAmount = function (scale, zoomAmount) {
                var extentIncreasing = zoomAmount > 1;
                var boundingDomainExtent = extentIncreasing ? this.maxDomainExtent(scale) : this.minDomainExtent(scale);
                if (boundingDomainExtent == null) {
                    return zoomAmount;
                }
                var scaleDomain = scale.domain();
                var domainExtent = Math.abs(scaleDomain[1] - scaleDomain[0]);
                var compareF = extentIncreasing ? Math.min : Math.max;
                return compareF(zoomAmount, boundingDomainExtent / domainExtent);
            };
            PanZoom.prototype._setupDragInteraction = function () {
                var _this = this;
                this._dragInteraction.constrainedToComponent(false);
                var lastDragPoint;
                this._dragInteraction.onDragStart(function () { return lastDragPoint = null; });
                this._dragInteraction.onDrag(function (startPoint, endPoint) {
                    if (_this._touchIds.size() >= 2) {
                        return;
                    }
                    var translateAmountX = (lastDragPoint == null ? startPoint.x : lastDragPoint.x) - endPoint.x;
                    _this.xScales().forEach(function (xScale) {
                        _this._translateScale(xScale, translateAmountX);
                    });
                    var translateAmountY = (lastDragPoint == null ? startPoint.y : lastDragPoint.y) - endPoint.y;
                    _this.yScales().forEach(function (yScale) {
                        _this._translateScale(yScale, translateAmountY);
                    });
                    lastDragPoint = endPoint;
                });
            };
            PanZoom.prototype._nonLinearScaleWithExtents = function (scale) {
                return this.minDomainExtent(scale) != null && this.maxDomainExtent(scale) != null &&
                    !(scale instanceof Plottable.Scales.Linear) && !(scale instanceof Plottable.Scales.Time);
            };
            PanZoom.prototype.xScales = function (xScales) {
                var _this = this;
                if (xScales == null) {
                    var scales = [];
                    this._xScales.forEach(function (xScale) {
                        scales.push(xScale);
                    });
                    return scales;
                }
                this._xScales = new Plottable.Utils.Set();
                xScales.forEach(function (xScale) {
                    _this.addXScale(xScale);
                });
                return this;
            };
            PanZoom.prototype.yScales = function (yScales) {
                var _this = this;
                if (yScales == null) {
                    var scales = [];
                    this._yScales.forEach(function (yScale) {
                        scales.push(yScale);
                    });
                    return scales;
                }
                this._yScales = new Plottable.Utils.Set();
                yScales.forEach(function (yScale) {
                    _this.addYScale(yScale);
                });
                return this;
            };
            /**
             * Adds an x scale to this PanZoom Interaction
             *
             * @param {QuantitativeScale<any>} An x scale to add
             * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
             */
            PanZoom.prototype.addXScale = function (xScale) {
                this._xScales.add(xScale);
                return this;
            };
            /**
             * Removes an x scale from this PanZoom Interaction
             *
             * @param {QuantitativeScale<any>} An x scale to remove
             * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
             */
            PanZoom.prototype.removeXScale = function (xScale) {
                this._xScales.delete(xScale);
                this._minDomainExtents.delete(xScale);
                this._maxDomainExtents.delete(xScale);
                return this;
            };
            /**
             * Adds a y scale to this PanZoom Interaction
             *
             * @param {QuantitativeScale<any>} A y scale to add
             * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
             */
            PanZoom.prototype.addYScale = function (yScale) {
                this._yScales.add(yScale);
                return this;
            };
            /**
             * Removes a y scale from this PanZoom Interaction
             *
             * @param {QuantitativeScale<any>} A y scale to remove
             * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
             */
            PanZoom.prototype.removeYScale = function (yScale) {
                this._yScales.delete(yScale);
                this._minDomainExtents.delete(yScale);
                this._maxDomainExtents.delete(yScale);
                return this;
            };
            PanZoom.prototype.minDomainExtent = function (quantitativeScale, minDomainExtent) {
                if (minDomainExtent == null) {
                    return this._minDomainExtents.get(quantitativeScale);
                }
                if (minDomainExtent.valueOf() < 0) {
                    throw new Error("extent must be non-negative");
                }
                var maxExtentForScale = this.maxDomainExtent(quantitativeScale);
                if (maxExtentForScale != null && maxExtentForScale.valueOf() < minDomainExtent.valueOf()) {
                    throw new Error("minDomainExtent must be smaller than maxDomainExtent for the same Scale");
                }
                if (this._nonLinearScaleWithExtents(quantitativeScale)) {
                    Plottable.Utils.Window.warn("Panning and zooming with extents on a nonlinear scale may have unintended behavior.");
                }
                this._minDomainExtents.set(quantitativeScale, minDomainExtent);
                return this;
            };
            PanZoom.prototype.maxDomainExtent = function (quantitativeScale, maxDomainExtent) {
                if (maxDomainExtent == null) {
                    return this._maxDomainExtents.get(quantitativeScale);
                }
                if (maxDomainExtent.valueOf() <= 0) {
                    throw new Error("extent must be positive");
                }
                var minExtentForScale = this.minDomainExtent(quantitativeScale);
                if (minExtentForScale != null && maxDomainExtent.valueOf() < minExtentForScale.valueOf()) {
                    throw new Error("maxDomainExtent must be larger than minDomainExtent for the same Scale");
                }
                if (this._nonLinearScaleWithExtents(quantitativeScale)) {
                    Plottable.Utils.Window.warn("Panning and zooming with extents on a nonlinear scale may have unintended behavior.");
                }
                this._maxDomainExtents.set(quantitativeScale, maxDomainExtent);
                return this;
            };
            /**
             * The number of pixels occupied in a line.
             */
            PanZoom._PIXELS_PER_LINE = 120;
            return PanZoom;
        })(Plottable.Interaction);
        Interactions.PanZoom = PanZoom;
    })(Interactions = Plottable.Interactions || (Plottable.Interactions = {}));
})(Plottable || (Plottable = {}));
