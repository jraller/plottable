var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Plottable;
(function (Plottable) {
    var Components;
    (function (Components) {
        var Group = (function (_super) {
            __extends(Group, _super);
            /**
             * Constructs a Group.
             *
             * A Group contains Components that will be rendered on top of each other.
             * Components added later will be rendered above Components already in the Group.
             *
             * @constructor
             * @param {Component[]} [components=[]] Components to be added to the Group.
             */
            function Group(components) {
                var _this = this;
                if (components === void 0) { components = []; }
                _super.call(this);
                this._components = [];
                this.addClass("component-group");
                components.forEach(function (c) { return _this.append(c); });
            }
            Group.prototype._forEach = function (callback) {
                this.components().forEach(callback);
            };
            /**
             * Checks whether the specified Component is in the Group.
             */
            Group.prototype.has = function (component) {
                return this._components.indexOf(component) >= 0;
            };
            Group.prototype.requestedSpace = function (offeredWidth, offeredHeight) {
                var requests = this._components.map(function (c) { return c.requestedSpace(offeredWidth, offeredHeight); });
                return {
                    minWidth: Plottable.Utils.Math.max(requests, function (request) { return request.minWidth; }, 0),
                    minHeight: Plottable.Utils.Math.max(requests, function (request) { return request.minHeight; }, 0)
                };
            };
            Group.prototype.computeLayout = function (origin, availableWidth, availableHeight) {
                var _this = this;
                _super.prototype.computeLayout.call(this, origin, availableWidth, availableHeight);
                this._forEach(function (component) {
                    component.computeLayout({ x: 0, y: 0 }, _this.width(), _this.height());
                });
                return this;
            };
            Group.prototype._sizeFromOffer = function (availableWidth, availableHeight) {
                return {
                    width: availableWidth,
                    height: availableHeight
                };
            };
            Group.prototype.fixedWidth = function () {
                return this._components.every(function (c) { return c.fixedWidth(); });
            };
            Group.prototype.fixedHeight = function () {
                return this._components.every(function (c) { return c.fixedHeight(); });
            };
            /**
             * @return {Component[]} The Components in this Group.
             */
            Group.prototype.components = function () {
                return this._components.slice();
            };
            /**
             * Adds a Component to this Group.
             * The added Component will be rendered above Components already in the Group.
             */
            Group.prototype.append = function (component) {
                if (component != null && !this.has(component)) {
                    component.detach();
                    this._components.push(component);
                    this._adoptAndAnchor(component);
                    this.redraw();
                }
                return this;
            };
            Group.prototype._remove = function (component) {
                var removeIndex = this._components.indexOf(component);
                if (removeIndex >= 0) {
                    this._components.splice(removeIndex, 1);
                    return true;
                }
                return false;
            };
            return Group;
        })(Plottable.ComponentContainer);
        Components.Group = Group;
    })(Components = Plottable.Components || (Plottable.Components = {}));
})(Plottable || (Plottable = {}));
