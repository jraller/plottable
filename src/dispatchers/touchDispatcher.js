var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Dispatchers;
    (function (Dispatchers) {
        var Touch = (function (_super) {
            __extends(Touch, _super);
            /**
             * This constructor should not be invoked directly.
             *
             * @constructor
             * @param {SVGElement} svg The root <svg> to attach to.
             */
            function Touch(svg) {
                var _this = this;
                _super.call(this);
                this._translator = Plottable.Utils.ClientToSVGTranslator.getTranslator(svg);
                this._eventToProcessingFunction[Touch._TOUCHSTART_EVENT_NAME] =
                    function (e) { return _this._measureAndDispatch(e, Touch._TOUCHSTART_EVENT_NAME, "page"); };
                this._eventToProcessingFunction[Touch._TOUCHMOVE_EVENT_NAME] =
                    function (e) { return _this._measureAndDispatch(e, Touch._TOUCHMOVE_EVENT_NAME, "page"); };
                this._eventToProcessingFunction[Touch._TOUCHEND_EVENT_NAME] =
                    function (e) { return _this._measureAndDispatch(e, Touch._TOUCHEND_EVENT_NAME, "page"); };
                this._eventToProcessingFunction[Touch._TOUCHCANCEL_EVENT_NAME] =
                    function (e) { return _this._measureAndDispatch(e, Touch._TOUCHCANCEL_EVENT_NAME, "page"); };
            }
            /**
             * Gets a Touch Dispatcher for the <svg> containing elem.
             * If one already exists on that <svg>, it will be returned; otherwise, a new one will be created.
             *
             * @param {SVGElement} elem
             * @return {Dispatchers.Touch}
             */
            Touch.getDispatcher = function (elem) {
                var svg = Plottable.Utils.DOM.boundingSVG(elem);
                var dispatcher = svg[Touch._DISPATCHER_KEY];
                if (dispatcher == null) {
                    dispatcher = new Touch(svg);
                    svg[Touch._DISPATCHER_KEY] = dispatcher;
                }
                return dispatcher;
            };
            /**
             * Registers a callback to be called when a touch starts.
             *
             * @param {TouchCallback} callback
             * @return {Dispatchers.Touch} The calling Touch Dispatcher.
             */
            Touch.prototype.onTouchStart = function (callback) {
                this._addCallbackForEvent(Touch._TOUCHSTART_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when a touch starts.
             *
             * @param {TouchCallback} callback
             * @return {Dispatchers.Touch} The calling Touch Dispatcher.
             */
            Touch.prototype.offTouchStart = function (callback) {
                this._removeCallbackForEvent(Touch._TOUCHSTART_EVENT_NAME, callback);
                return this;
            };
            /**
             * Registers a callback to be called when the touch position changes.
             *
             * @param {TouchCallback} callback
             * @return {Dispatchers.Touch} The calling Touch Dispatcher.
             */
            Touch.prototype.onTouchMove = function (callback) {
                this._addCallbackForEvent(Touch._TOUCHMOVE_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when the touch position changes.
             *
             * @param {TouchCallback} callback
             * @return {Dispatchers.Touch} The calling Touch Dispatcher.
             */
            Touch.prototype.offTouchMove = function (callback) {
                this._removeCallbackForEvent(Touch._TOUCHMOVE_EVENT_NAME, callback);
                return this;
            };
            /**
             * Registers a callback to be called when a touch ends.
             *
             * @param {TouchCallback} callback
             * @return {Dispatchers.Touch} The calling Touch Dispatcher.
             */
            Touch.prototype.onTouchEnd = function (callback) {
                this._addCallbackForEvent(Touch._TOUCHEND_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when a touch ends.
             *
             * @param {TouchCallback} callback
             * @return {Dispatchers.Touch} The calling Touch Dispatcher.
             */
            Touch.prototype.offTouchEnd = function (callback) {
                this._removeCallbackForEvent(Touch._TOUCHEND_EVENT_NAME, callback);
                return this;
            };
            /**
             * Registers a callback to be called when a touch is cancelled.
             *
             * @param {TouchCallback} callback
             * @return {Dispatchers.Touch} The calling Touch Dispatcher.
             */
            Touch.prototype.onTouchCancel = function (callback) {
                this._addCallbackForEvent(Touch._TOUCHCANCEL_EVENT_NAME, callback);
                return this;
            };
            /**
             * Removes a callback that would be called when a touch is cancelled.
             *
             * @param {TouchCallback} callback
             * @return {Dispatchers.Touch} The calling Touch Dispatcher.
             */
            Touch.prototype.offTouchCancel = function (callback) {
                this._removeCallbackForEvent(Touch._TOUCHCANCEL_EVENT_NAME, callback);
                return this;
            };
            /**
             * Computes the Touch position from the given event, and if successful
             * calls all the callbacks in the provided callbackSet.
             */
            Touch.prototype._measureAndDispatch = function (event, eventName, scope) {
                if (scope === void 0) { scope = "element"; }
                if (scope !== "page" && scope !== "element") {
                    throw new Error("Invalid scope '" + scope + "', must be 'element' or 'page'");
                }
                if (scope === "element" && !this.eventInsideSVG(event)) {
                    return;
                }
                var touches = event.changedTouches;
                var touchPositions = {};
                var touchIdentifiers = [];
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var touchID = touch.identifier;
                    var newTouchPosition = this._translator.computePosition(touch.clientX, touch.clientY);
                    if (newTouchPosition != null) {
                        touchPositions[touchID] = newTouchPosition;
                        touchIdentifiers.push(touchID);
                    }
                }
                ;
                if (touchIdentifiers.length > 0) {
                    this._callCallbacksForEvent(eventName, touchIdentifiers, touchPositions, event);
                }
            };
            Touch.prototype.eventInsideSVG = function (event) {
                return this._translator.insideSVG(event);
            };
            Touch._DISPATCHER_KEY = "__Plottable_Dispatcher_Touch";
            Touch._TOUCHSTART_EVENT_NAME = "touchstart";
            Touch._TOUCHMOVE_EVENT_NAME = "touchmove";
            Touch._TOUCHEND_EVENT_NAME = "touchend";
            Touch._TOUCHCANCEL_EVENT_NAME = "touchcancel";
            return Touch;
        })(Plottable.Dispatcher);
        Dispatchers.Touch = Touch;
    })(Dispatchers = Plottable.Dispatchers || (Plottable.Dispatchers = {}));
})(Plottable || (Plottable = {}));
