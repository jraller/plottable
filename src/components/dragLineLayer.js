var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    ;
})(Plottable || (Plottable = {}));
var Plottable;
(function (Plottable) {
    var Components;
    (function (Components) {
        var DragLineLayer = (function (_super) {
            __extends(DragLineLayer, _super);
            function DragLineLayer(orientation) {
                var _this = this;
                _super.call(this, orientation);
                this._detectionRadius = 3;
                this._enabled = true;
                this.addClass("drag-line-layer");
                this.addClass("enabled");
                this._dragInteraction = new Plottable.Interactions.Drag();
                this._dragInteraction.attachTo(this);
                var onLine = function (p) {
                    return (_this._isVertical() &&
                        _this.pixelPosition() - _this.detectionRadius() <= p.x &&
                        p.x <= _this.pixelPosition() + _this.detectionRadius()) ||
                        (!_this._isVertical() &&
                            _this.pixelPosition() - _this.detectionRadius() <= p.y &&
                            p.y <= _this.pixelPosition() + _this.detectionRadius());
                };
                var dragging = false;
                var interactionDragStartCallback = function (start) {
                    if (onLine(start)) {
                        dragging = true;
                        _this._dragStartCallbacks.callCallbacks(_this);
                    }
                };
                this._dragInteraction.onDragStart(interactionDragStartCallback);
                var interactionDragCallback = function (start, end) {
                    if (dragging) {
                        _this._setPixelPositionWithoutChangingMode(_this._isVertical() ? end.x : end.y);
                        _this._dragCallbacks.callCallbacks(_this);
                    }
                };
                this._dragInteraction.onDrag(interactionDragCallback);
                var interactionDragEndCallback = function (start, end) {
                    if (dragging) {
                        dragging = false;
                        _this._dragEndCallbacks.callCallbacks(_this);
                    }
                };
                this._dragInteraction.onDragEnd(interactionDragEndCallback);
                this._disconnectInteraction = function () {
                    _this._dragInteraction.offDragStart(interactionDragStartCallback);
                    _this._dragInteraction.offDrag(interactionDragCallback);
                    _this._dragInteraction.offDragEnd(interactionDragEndCallback);
                    _this._dragInteraction.detachFrom(_this);
                };
                this._dragStartCallbacks = new Plottable.Utils.CallbackSet();
                this._dragCallbacks = new Plottable.Utils.CallbackSet();
                this._dragEndCallbacks = new Plottable.Utils.CallbackSet();
            }
            DragLineLayer.prototype._setup = function () {
                _super.prototype._setup.call(this);
                this._detectionEdge = this.content().append("line").style({
                    "opacity": 0,
                    "stroke": "pink",
                    "pointer-events": "visibleStroke"
                }).classed("drag-edge", true);
            };
            DragLineLayer.prototype.renderImmediately = function () {
                _super.prototype.renderImmediately.call(this);
                this._detectionEdge.attr({
                    x1: this._isVertical() ? this.pixelPosition() : 0,
                    y1: this._isVertical() ? 0 : this.pixelPosition(),
                    x2: this._isVertical() ? this.pixelPosition() : this.width(),
                    y2: this._isVertical() ? this.height() : this.pixelPosition(),
                    "stroke-width": this._detectionRadius * 2
                });
                return this;
            };
            DragLineLayer.prototype.detectionRadius = function (detectionRadius) {
                if (detectionRadius == null) {
                    return this._detectionRadius;
                }
                if (detectionRadius < 0) {
                    throw new Error("detection radius cannot be negative.");
                }
                this._detectionRadius = detectionRadius;
                this.render();
                return this;
            };
            DragLineLayer.prototype.enabled = function (enabled) {
                if (enabled == null) {
                    return this._enabled;
                }
                this._enabled = enabled;
                if (enabled) {
                    this.addClass("enabled");
                }
                else {
                    this.removeClass("enabled");
                }
                this._dragInteraction.enabled(enabled);
                return this;
            };
            /**
             * Sets the callback to be called when dragging starts.
             * The callback will be passed the calling DragLineLayer.
             *
             * @param {DragLineCallback<D>} callback
             * @returns {DragLineLayer<D>} The calling DragLineLayer.
             */
            DragLineLayer.prototype.onDragStart = function (callback) {
                this._dragStartCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when dragging starts.
             *
             * @param {DragLineCallback<D>} callback
             * @returns {DragLineLayer<D>} The calling DragLineLayer.
             */
            DragLineLayer.prototype.offDragStart = function (callback) {
                this._dragStartCallbacks.delete(callback);
                return this;
            };
            /**
             * Sets a callback to be called during dragging.
             * The callback will be passed the calling DragLineLayer.
             *
             * @param {DragLineCallback<D>} callback
             * @returns {DragLineLayer<D>} The calling DragLineLayer.
             */
            DragLineLayer.prototype.onDrag = function (callback) {
                this._dragCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called during dragging.
             *
             * @param {DragLineCallback<D>} callback
             * @returns {DragLineLayer<D>} The calling DragLineLayer.
             */
            DragLineLayer.prototype.offDrag = function (callback) {
                this._dragCallbacks.delete(callback);
                return this;
            };
            /**
             * Sets a callback to be called when dragging ends.
             * The callback will be passed the calling DragLineLayer.
             *
             * @param {DragLineCallback<D>} callback
             * @returns {DragLineLayer<D>} The calling DragLineLayer.
             */
            DragLineLayer.prototype.onDragEnd = function (callback) {
                this._dragEndCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when dragging ends.
             *
             * @param {DragLineCallback<D>} callback
             * @returns {DragLineLayer<D>} The calling DragLineLayer.
             */
            DragLineLayer.prototype.offDragEnd = function (callback) {
                this._dragEndCallbacks.delete(callback);
                return this;
            };
            DragLineLayer.prototype.destroy = function () {
                var _this = this;
                _super.prototype.destroy.call(this);
                this._dragStartCallbacks.forEach(function (callback) { return _this._dragStartCallbacks.delete(callback); });
                this._dragCallbacks.forEach(function (callback) { return _this._dragCallbacks.delete(callback); });
                this._dragEndCallbacks.forEach(function (callback) { return _this._dragEndCallbacks.delete(callback); });
                this._disconnectInteraction();
            };
            return DragLineLayer;
        })(Components.GuideLineLayer);
        Components.DragLineLayer = DragLineLayer;
    })(Components = Plottable.Components || (Plottable.Components = {}));
})(Plottable || (Plottable = {}));
