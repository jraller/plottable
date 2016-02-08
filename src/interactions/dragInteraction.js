var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Interactions;
    (function (Interactions) {
        var Drag = (function (_super) {
            __extends(Drag, _super);
            function Drag() {
                var _this = this;
                _super.apply(this, arguments);
                this._dragging = false;
                this._constrainedToComponent = true;
                this._dragStartCallbacks = new Plottable.Utils.CallbackSet();
                this._dragCallbacks = new Plottable.Utils.CallbackSet();
                this._dragEndCallbacks = new Plottable.Utils.CallbackSet();
                this._mouseDownCallback = function (p, e) { return _this._startDrag(p, e); };
                this._mouseMoveCallback = function (p, e) { return _this._doDrag(p, e); };
                this._mouseUpCallback = function (p, e) { return _this._endDrag(p, e); };
                this._touchStartCallback = function (ids, idToPoint, e) { return _this._startDrag(idToPoint[ids[0]], e); };
                this._touchMoveCallback = function (ids, idToPoint, e) { return _this._doDrag(idToPoint[ids[0]], e); };
                this._touchEndCallback = function (ids, idToPoint, e) { return _this._endDrag(idToPoint[ids[0]], e); };
            }
            Drag.prototype._anchor = function (component) {
                _super.prototype._anchor.call(this, component);
                this._mouseDispatcher = Plottable.Dispatchers.Mouse.getDispatcher(this._componentAttachedTo.content().node());
                this._mouseDispatcher.onMouseDown(this._mouseDownCallback);
                this._mouseDispatcher.onMouseMove(this._mouseMoveCallback);
                this._mouseDispatcher.onMouseUp(this._mouseUpCallback);
                this._touchDispatcher = Plottable.Dispatchers.Touch.getDispatcher(this._componentAttachedTo.content().node());
                this._touchDispatcher.onTouchStart(this._touchStartCallback);
                this._touchDispatcher.onTouchMove(this._touchMoveCallback);
                this._touchDispatcher.onTouchEnd(this._touchEndCallback);
            };
            Drag.prototype._unanchor = function () {
                _super.prototype._unanchor.call(this);
                this._mouseDispatcher.offMouseDown(this._mouseDownCallback);
                this._mouseDispatcher.offMouseMove(this._mouseMoveCallback);
                this._mouseDispatcher.offMouseUp(this._mouseUpCallback);
                this._mouseDispatcher = null;
                this._touchDispatcher.offTouchStart(this._touchStartCallback);
                this._touchDispatcher.offTouchMove(this._touchMoveCallback);
                this._touchDispatcher.offTouchEnd(this._touchEndCallback);
                this._touchDispatcher = null;
            };
            Drag.prototype._translateAndConstrain = function (p) {
                var translatedP = this._translateToComponentSpace(p);
                if (!this._constrainedToComponent) {
                    return translatedP;
                }
                return {
                    x: Plottable.Utils.Math.clamp(translatedP.x, 0, this._componentAttachedTo.width()),
                    y: Plottable.Utils.Math.clamp(translatedP.y, 0, this._componentAttachedTo.height())
                };
            };
            Drag.prototype._startDrag = function (point, event) {
                if (event instanceof MouseEvent && event.button !== 0) {
                    return;
                }
                var translatedP = this._translateToComponentSpace(point);
                if (this._isInsideComponent(translatedP)) {
                    event.preventDefault();
                    this._dragging = true;
                    this._dragOrigin = translatedP;
                    this._dragStartCallbacks.callCallbacks(this._dragOrigin);
                }
            };
            Drag.prototype._doDrag = function (point, event) {
                if (this._dragging) {
                    this._dragCallbacks.callCallbacks(this._dragOrigin, this._translateAndConstrain(point));
                }
            };
            Drag.prototype._endDrag = function (point, event) {
                if (event instanceof MouseEvent && event.button !== 0) {
                    return;
                }
                if (this._dragging) {
                    this._dragging = false;
                    this._dragEndCallbacks.callCallbacks(this._dragOrigin, this._translateAndConstrain(point));
                }
            };
            Drag.prototype.constrainedToComponent = function (constrainedToComponent) {
                if (constrainedToComponent == null) {
                    return this._constrainedToComponent;
                }
                this._constrainedToComponent = constrainedToComponent;
                return this;
            };
            /**
             * Adds a callback to be called when dragging starts.
             *
             * @param {DragCallback} callback
             * @returns {Drag} The calling Drag Interaction.
             */
            Drag.prototype.onDragStart = function (callback) {
                this._dragStartCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when dragging starts.
             *
             * @param {DragCallback} callback
             * @returns {Drag} The calling Drag Interaction.
             */
            Drag.prototype.offDragStart = function (callback) {
                this._dragStartCallbacks.delete(callback);
                return this;
            };
            /**
             * Adds a callback to be called during dragging.
             *
             * @param {DragCallback} callback
             * @returns {Drag} The calling Drag Interaction.
             */
            Drag.prototype.onDrag = function (callback) {
                this._dragCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called during dragging.
             *
             * @param {DragCallback} callback
             * @returns {Drag} The calling Drag Interaction.
             */
            Drag.prototype.offDrag = function (callback) {
                this._dragCallbacks.delete(callback);
                return this;
            };
            /**
             * Adds a callback to be called when dragging ends.
             *
             * @param {DragCallback} callback
             * @returns {Drag} The calling Drag Interaction.
             */
            Drag.prototype.onDragEnd = function (callback) {
                this._dragEndCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when dragging ends.
             *
             * @param {DragCallback} callback
             * @returns {Drag} The calling Drag Interaction.
             */
            Drag.prototype.offDragEnd = function (callback) {
                this._dragEndCallbacks.delete(callback);
                return this;
            };
            return Drag;
        })(Plottable.Interaction);
        Interactions.Drag = Drag;
    })(Interactions = Plottable.Interactions || (Plottable.Interactions = {}));
})(Plottable || (Plottable = {}));
