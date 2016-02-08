var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Dispatchers;
    (function (Dispatchers) {
        var Mouse = (function (_super) {
            __extends(Mouse, _super);
            /**
             * This constructor not be invoked directly.
             *
             * @constructor
             * @param {SVGElement} svg The root <svg> to attach to.
             */
            function Mouse(svg) {
                var _this = this;
                _super.call(this);
                this._translator = Plottable.Utils.ClientToSVGTranslator.getTranslator(svg);
                this._lastMousePosition = { x: -1, y: -1 };
                var processMoveCallback = function (e) { return _this._measureAndDispatch(e, Mouse._MOUSEMOVE_EVENT_NAME, "page"); };
                this._eventToProcessingFunction[Mouse._MOUSEOVER_EVENT_NAME] = processMoveCallback;
                this._eventToProcessingFunction[Mouse._MOUSEMOVE_EVENT_NAME] = processMoveCallback;
                this._eventToProcessingFunction[Mouse._MOUSEOUT_EVENT_NAME] = processMoveCallback;
                this._eventToProcessingFunction[Mouse._MOUSEDOWN_EVENT_NAME] =
                    function (e) { return _this._measureAndDispatch(e, Mouse._MOUSEDOWN_EVENT_NAME); };
                this._eventToProcessingFunction[Mouse._MOUSEUP_EVENT_NAME] =
                    function (e) { return _this._measureAndDispatch(e, Mouse._MOUSEUP_EVENT_NAME, "page"); };
                this._eventToProcessingFunction[Mouse._WHEEL_EVENT_NAME] =
                    function (e) { return _this._measureAndDispatch(e, Mouse._WHEEL_EVENT_NAME); };
                this._eventToProcessingFunction[Mouse._DBLCLICK_EVENT_NAME] =
                    function (e) { return _this._measureAndDispatch(e, Mouse._DBLCLICK_EVENT_NAME); };
            }
            /**
             * Get a Mouse Dispatcher for the <svg> containing elem.
             * If one already exists on that <svg>, it will be returned; otherwise, a new one will be created.
             *
             * @param {SVGElement} elem
             * @return {Dispatchers.Mouse}
             */
            Mouse.getDispatcher = function (elem) {
                var svg = Plottable.Utils.DOM.boundingSVG(elem);
                var dispatcher = svg[Mouse._DISPATCHER_KEY];
                if (dispatcher == null) {
                    dispatcher = new Mouse(svg);
                    svg[Mouse._DISPATCHER_KEY] = dispatcher;
                }
                return dispatcher;
            };
            /**
             * Registers a callback to be called when the mouse position changes.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.onMouseMove = function (callback) {
                this._addCallbackForEvent(Mouse._MOUSEMOVE_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when the mouse position changes.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.offMouseMove = function (callback) {
                this._removeCallbackForEvent(Mouse._MOUSEMOVE_EVENT_NAME, callback);
                return this;
            };
            /**
             * Registers a callback to be called when a mousedown occurs.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.onMouseDown = function (callback) {
                this._addCallbackForEvent(Mouse._MOUSEDOWN_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when a mousedown occurs.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.offMouseDown = function (callback) {
                this._removeCallbackForEvent(Mouse._MOUSEDOWN_EVENT_NAME, callback);
                return this;
            };
            /**
             * Registers a callback to be called when a mouseup occurs.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.onMouseUp = function (callback) {
                this._addCallbackForEvent(Mouse._MOUSEUP_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when a mouseup occurs.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.offMouseUp = function (callback) {
                this._removeCallbackForEvent(Mouse._MOUSEUP_EVENT_NAME, callback);
                return this;
            };
            /**
             * Registers a callback to be called when a wheel event occurs.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.onWheel = function (callback) {
                this._addCallbackForEvent(Mouse._WHEEL_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when a wheel event occurs.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.offWheel = function (callback) {
                this._removeCallbackForEvent(Mouse._WHEEL_EVENT_NAME, callback);
                return this;
            };
            /**
             * Registers a callback to be called when a dblClick occurs.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.onDblClick = function (callback) {
                this._addCallbackForEvent(Mouse._DBLCLICK_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when a dblClick occurs.
             *
             * @param {MouseCallback} callback
             * @return {Dispatchers.Mouse} The calling Mouse Dispatcher.
             */
            Mouse.prototype.offDblClick = function (callback) {
                this._removeCallbackForEvent(Mouse._DBLCLICK_EVENT_NAME, callback);
                return this;
            };
            /**
             * Computes the mouse position from the given event, and if successful
             * calls all the callbacks in the provided callbackSet.
             */
            Mouse.prototype._measureAndDispatch = function (event, eventName, scope) {
                if (scope === void 0) { scope = "element"; }
                if (scope !== "page" && scope !== "element") {
                    throw new Error("Invalid scope '" + scope + "', must be 'element' or 'page'");
                }
                if (scope === "page" || this.eventInsideSVG(event)) {
                    var newMousePosition = this._translator.computePosition(event.clientX, event.clientY);
                    if (newMousePosition != null) {
                        this._lastMousePosition = newMousePosition;
                        this._callCallbacksForEvent(eventName, this.lastMousePosition(), event);
                    }
                }
            };
            Mouse.prototype.eventInsideSVG = function (event) {
                return this._translator.insideSVG(event);
            };
            /**
             * Returns the last computed mouse position in <svg> coordinate space.
             *
             * @return {Point}
             */
            Mouse.prototype.lastMousePosition = function () {
                return this._lastMousePosition;
            };
            Mouse._DISPATCHER_KEY = "__Plottable_Dispatcher_Mouse";
            Mouse._MOUSEOVER_EVENT_NAME = "mouseover";
            Mouse._MOUSEMOVE_EVENT_NAME = "mousemove";
            Mouse._MOUSEOUT_EVENT_NAME = "mouseout";
            Mouse._MOUSEDOWN_EVENT_NAME = "mousedown";
            Mouse._MOUSEUP_EVENT_NAME = "mouseup";
            Mouse._WHEEL_EVENT_NAME = "wheel";
            Mouse._DBLCLICK_EVENT_NAME = "dblclick";
            return Mouse;
        })(Plottable.Dispatcher);
        Dispatchers.Mouse = Mouse;
    })(Dispatchers = Plottable.Dispatchers || (Plottable.Dispatchers = {}));
})(Plottable || (Plottable = {}));
