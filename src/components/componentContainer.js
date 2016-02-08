var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    /*
     * ComponentContainer class encapsulates Table and ComponentGroup's shared functionality.
     * It will not do anything if instantiated directly.
     */
    var ComponentContainer = (function (_super) {
        __extends(ComponentContainer, _super);
        function ComponentContainer() {
            var _this = this;
            _super.call(this);
            this._detachCallback = function (component) { return _this.remove(component); };
        }
        ComponentContainer.prototype.anchor = function (selection) {
            var _this = this;
            _super.prototype.anchor.call(this, selection);
            this._forEach(function (c) { return c.anchor(_this.content()); });
            return this;
        };
        ComponentContainer.prototype.render = function () {
            this._forEach(function (c) { return c.render(); });
            return this;
        };
        /**
         * Checks whether the specified Component is in the ComponentContainer.
         */
        ComponentContainer.prototype.has = function (component) {
            throw new Error("has() is not implemented on ComponentContainer");
        };
        ComponentContainer.prototype._adoptAndAnchor = function (component) {
            component.parent(this);
            component.onDetach(this._detachCallback);
            if (this._isAnchored) {
                component.anchor(this.content());
            }
        };
        /**
         * Removes the specified Component from the ComponentContainer.
         */
        ComponentContainer.prototype.remove = function (component) {
            if (this.has(component)) {
                component.offDetach(this._detachCallback);
                this._remove(component);
                component.detach();
                this.redraw();
            }
            return this;
        };
        /**
         * Carry out the actual removal of a Component.
         * Implementation dependent on the type of container.
         *
         * @return {boolean} true if the Component was successfully removed, false otherwise.
         */
        ComponentContainer.prototype._remove = function (component) {
            return false;
        };
        /**
         * Invokes a callback on each Component in the ComponentContainer.
         */
        ComponentContainer.prototype._forEach = function (callback) {
            throw new Error("_forEach() is not implemented on ComponentContainer");
        };
        /**
         * Destroys the ComponentContainer and all Components within it.
         */
        ComponentContainer.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._forEach(function (c) { return c.destroy(); });
        };
        return ComponentContainer;
    })(Plottable.Component);
    Plottable.ComponentContainer = ComponentContainer;
})(Plottable || (Plottable = {}));
