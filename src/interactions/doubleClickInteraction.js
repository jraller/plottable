var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Interactions;
    (function (Interactions) {
        var ClickState;
        (function (ClickState) {
            ClickState[ClickState["NotClicked"] = 0] = "NotClicked";
            ClickState[ClickState["SingleClicked"] = 1] = "SingleClicked";
            ClickState[ClickState["DoubleClicked"] = 2] = "DoubleClicked";
        })(ClickState || (ClickState = {}));
        ;
        var DoubleClick = (function (_super) {
            __extends(DoubleClick, _super);
            function DoubleClick() {
                var _this = this;
                _super.apply(this, arguments);
                this._clickState = ClickState.NotClicked;
                this._clickedDown = false;
                this._onDoubleClickCallbacks = new Plottable.Utils.CallbackSet();
                this._mouseDownCallback = function (p) { return _this._handleClickDown(p); };
                this._mouseUpCallback = function (p) { return _this._handleClickUp(p); };
                this._dblClickCallback = function (p) { return _this._handleDblClick(); };
                this._touchStartCallback = function (ids, idToPoint) { return _this._handleClickDown(idToPoint[ids[0]]); };
                this._touchEndCallback = function (ids, idToPoint) { return _this._handleClickUp(idToPoint[ids[0]]); };
                this._touchCancelCallback = function (ids, idToPoint) { return _this._handleClickCancel(); };
            }
            DoubleClick.prototype._anchor = function (component) {
                _super.prototype._anchor.call(this, component);
                this._mouseDispatcher = Plottable.Dispatchers.Mouse.getDispatcher(component.content().node());
                this._mouseDispatcher.onMouseDown(this._mouseDownCallback);
                this._mouseDispatcher.onMouseUp(this._mouseUpCallback);
                this._mouseDispatcher.onDblClick(this._dblClickCallback);
                this._touchDispatcher = Plottable.Dispatchers.Touch.getDispatcher(component.content().node());
                this._touchDispatcher.onTouchStart(this._touchStartCallback);
                this._touchDispatcher.onTouchEnd(this._touchEndCallback);
                this._touchDispatcher.onTouchCancel(this._touchCancelCallback);
            };
            DoubleClick.prototype._unanchor = function () {
                _super.prototype._unanchor.call(this);
                this._mouseDispatcher.offMouseDown(this._mouseDownCallback);
                this._mouseDispatcher.offMouseUp(this._mouseUpCallback);
                this._mouseDispatcher.offDblClick(this._dblClickCallback);
                this._mouseDispatcher = null;
                this._touchDispatcher.offTouchStart(this._touchStartCallback);
                this._touchDispatcher.offTouchEnd(this._touchEndCallback);
                this._touchDispatcher.offTouchCancel(this._touchCancelCallback);
                this._touchDispatcher = null;
            };
            DoubleClick.prototype._handleClickDown = function (p) {
                var translatedP = this._translateToComponentSpace(p);
                if (this._isInsideComponent(translatedP)) {
                    if (!(this._clickState === ClickState.SingleClicked) || !DoubleClick._pointsEqual(translatedP, this._clickedPoint)) {
                        this._clickState = ClickState.NotClicked;
                    }
                    this._clickedPoint = translatedP;
                    this._clickedDown = true;
                }
            };
            DoubleClick.prototype._handleClickUp = function (p) {
                var translatedP = this._translateToComponentSpace(p);
                if (this._clickedDown && DoubleClick._pointsEqual(translatedP, this._clickedPoint)) {
                    this._clickState = this._clickState === ClickState.NotClicked ? ClickState.SingleClicked : ClickState.DoubleClicked;
                }
                else {
                    this._clickState = ClickState.NotClicked;
                }
                this._clickedDown = false;
            };
            DoubleClick.prototype._handleDblClick = function () {
                if (this._clickState === ClickState.DoubleClicked) {
                    this._onDoubleClickCallbacks.callCallbacks(this._clickedPoint);
                    this._clickState = ClickState.NotClicked;
                }
            };
            DoubleClick.prototype._handleClickCancel = function () {
                this._clickState = ClickState.NotClicked;
                this._clickedDown = false;
            };
            DoubleClick._pointsEqual = function (p1, p2) {
                return p1.x === p2.x && p1.y === p2.y;
            };
            /**
             * Adds a callback to be called when the Component is double-clicked.
             *
             * @param {ClickCallback} callback
             * @return {Interactions.DoubleClick} The calling DoubleClick Interaction.
             */
            DoubleClick.prototype.onDoubleClick = function (callback) {
                this._onDoubleClickCallbacks.add(callback);
                return this;
            };
            /**
             * Removes a callback that would be called when the Component is double-clicked.
             *
             * @param {ClickCallback} callback
             * @return {Interactions.DoubleClick} The calling DoubleClick Interaction.
             */
            DoubleClick.prototype.offDoubleClick = function (callback) {
                this._onDoubleClickCallbacks.delete(callback);
                return this;
            };
            return DoubleClick;
        })(Plottable.Interaction);
        Interactions.DoubleClick = DoubleClick;
    })(Interactions = Plottable.Interactions || (Plottable.Interactions = {}));
})(Plottable || (Plottable = {}));
