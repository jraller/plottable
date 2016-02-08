var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Interactions;
    (function (Interactions) {
        var Click = (function (_super) {
            __extends(Click, _super);
            function Click() {
                var _this = this;
                _super.apply(this, arguments);
                this._clickedDown = false;
                this._onClickCallbacks = new Plottable.Utils.CallbackSet();
                this._mouseDownCallback = function (p) { return _this._handleClickDown(p); };
                this._mouseUpCallback = function (p) { return _this._handleClickUp(p); };
                this._touchStartCallback = function (ids, idToPoint) { return _this._handleClickDown(idToPoint[ids[0]]); };
                this._touchEndCallback = function (ids, idToPoint) { return _this._handleClickUp(idToPoint[ids[0]]); };
                this._touchCancelCallback = function (ids, idToPoint) { return _this._clickedDown = false; };
            }
            Click.prototype._anchor = function (component) {
                _super.prototype._anchor.call(this, component);
                this._mouseDispatcher = Plottable.Dispatchers.Mouse.getDispatcher(component.content().node());
                this._mouseDispatcher.onMouseDown(this._mouseDownCallback);
                this._mouseDispatcher.onMouseUp(this._mouseUpCallback);
                this._touchDispatcher = Plottable.Dispatchers.Touch.getDispatcher(component.content().node());
                this._touchDispatcher.onTouchStart(this._touchStartCallback);
                this._touchDispatcher.onTouchEnd(this._touchEndCallback);
                this._touchDispatcher.onTouchCancel(this._touchCancelCallback);
            };
            Click.prototype._unanchor = function () {
                _super.prototype._unanchor.call(this);
                this._mouseDispatcher.offMouseDown(this._mouseDownCallback);
                this._mouseDispatcher.offMouseUp(this._mouseUpCallback);
                this._mouseDispatcher = null;
                this._touchDispatcher.offTouchStart(this._touchStartCallback);
                this._touchDispatcher.offTouchEnd(this._touchEndCallback);
                this._touchDispatcher.offTouchCancel(this._touchCancelCallback);
                this._touchDispatcher = null;
            };
            Click.prototype._handleClickDown = function (p) {
                var translatedPoint = this._translateToComponentSpace(p);
                if (this._isInsideComponent(translatedPoint)) {
                    this._clickedDown = true;
                }
            };
            Click.prototype._handleClickUp = function (p) {
                var translatedPoint = this._translateToComponentSpace(p);
                if (this._clickedDown && this._isInsideComponent(translatedPoint)) {
                    this._onClickCallbacks.callCallbacks(translatedPoint);
                }
                this._clickedDown = false;
            };
            /**
             * Adds a callback to be called when the Component is clicked.
             *
             * @param {ClickCallback} callback
             * @return {Interactions.Click} The calling Click Interaction.
             */
            Click.prototype.onClick = function (callback) {
                this._onClickCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when the Component is clicked.
             *
             * @param {ClickCallback} callback
             * @return {Interactions.Click} The calling Click Interaction.
             */
            Click.prototype.offClick = function (callback) {
                this._onClickCallbacks.delete(callback);
                return this;
            };
            return Click;
        })(Plottable.Interaction);
        Interactions.Click = Click;
    })(Interactions = Plottable.Interactions || (Plottable.Interactions = {}));
})(Plottable || (Plottable = {}));
