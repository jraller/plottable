var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Interactions;
    (function (Interactions) {
        var Pointer = (function (_super) {
            __extends(Pointer, _super);
            function Pointer() {
                var _this = this;
                _super.apply(this, arguments);
                this._overComponent = false;
                this._pointerEnterCallbacks = new Plottable.Utils.CallbackSet();
                this._pointerMoveCallbacks = new Plottable.Utils.CallbackSet();
                this._pointerExitCallbacks = new Plottable.Utils.CallbackSet();
                this._mouseMoveCallback = function (p, e) { return _this._handleMouseEvent(p, e); };
                this._touchStartCallback = function (ids, idToPoint, e) { return _this._handleTouchEvent(idToPoint[ids[0]], e); };
            }
            Pointer.prototype._anchor = function (component) {
                _super.prototype._anchor.call(this, component);
                this._mouseDispatcher = Plottable.Dispatchers.Mouse.getDispatcher(this._componentAttachedTo.content().node());
                this._mouseDispatcher.onMouseMove(this._mouseMoveCallback);
                this._touchDispatcher = Plottable.Dispatchers.Touch.getDispatcher(this._componentAttachedTo.content().node());
                this._touchDispatcher.onTouchStart(this._touchStartCallback);
            };
            Pointer.prototype._unanchor = function () {
                _super.prototype._unanchor.call(this);
                this._mouseDispatcher.offMouseMove(this._mouseMoveCallback);
                this._mouseDispatcher = null;
                this._touchDispatcher.offTouchStart(this._touchStartCallback);
                this._touchDispatcher = null;
            };
            Pointer.prototype._handleMouseEvent = function (p, e) {
                var insideSVG = this._mouseDispatcher.eventInsideSVG(e);
                this._handlePointerEvent(p, insideSVG);
            };
            Pointer.prototype._handleTouchEvent = function (p, e) {
                var insideSVG = this._touchDispatcher.eventInsideSVG(e);
                this._handlePointerEvent(p, insideSVG);
            };
            Pointer.prototype._handlePointerEvent = function (p, insideSVG) {
                var translatedP = this._translateToComponentSpace(p);
                var overComponent = this._isInsideComponent(translatedP);
                if (overComponent && insideSVG) {
                    if (!this._overComponent) {
                        this._pointerEnterCallbacks.callCallbacks(translatedP);
                    }
                    this._pointerMoveCallbacks.callCallbacks(translatedP);
                }
                else if (this._overComponent) {
                    this._pointerExitCallbacks.callCallbacks(translatedP);
                }
                this._overComponent = overComponent && insideSVG;
            };
            /**
             * Adds a callback to be called when the pointer enters the Component.
             *
             * @param {PointerCallback} callback
             * @return {Interactions.Pointer} The calling Pointer Interaction.
             */
            Pointer.prototype.onPointerEnter = function (callback) {
                this._pointerEnterCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when the pointer enters the Component.
             *
             * @param {PointerCallback} callback
             * @return {Interactions.Pointer} The calling Pointer Interaction.
             */
            Pointer.prototype.offPointerEnter = function (callback) {
                this._pointerEnterCallbacks.delete(callback);
                return this;
            };
            /**
             * Adds a callback to be called when the pointer moves within the Component.
             *
             * @param {PointerCallback} callback
             * @return {Interactions.Pointer} The calling Pointer Interaction.
             */
            Pointer.prototype.onPointerMove = function (callback) {
                this._pointerMoveCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when the pointer moves within the Component.
             *
             * @param {PointerCallback} callback
             * @return {Interactions.Pointer} The calling Pointer Interaction.
             */
            Pointer.prototype.offPointerMove = function (callback) {
                this._pointerMoveCallbacks.delete(callback);
                return this;
            };
            /**
             * Adds a callback to be called when the pointer exits the Component.
             *
             * @param {PointerCallback} callback
             * @return {Interactions.Pointer} The calling Pointer Interaction.
             */
            Pointer.prototype.onPointerExit = function (callback) {
                this._pointerExitCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when the pointer exits the Component.
             *
             * @param {PointerCallback} callback
             * @return {Interactions.Pointer} The calling Pointer Interaction.
             */
            Pointer.prototype.offPointerExit = function (callback) {
                this._pointerExitCallbacks.delete(callback);
                return this;
            };
            return Pointer;
        })(Plottable.Interaction);
        Interactions.Pointer = Pointer;
    })(Interactions = Plottable.Interactions || (Plottable.Interactions = {}));
})(Plottable || (Plottable = {}));
