var Plottable;
(function (Plottable) {
    var Components;
    (function (Components) {
        var Alignment = (function () {
            function Alignment() {
            }
            Alignment.TOP = "top";
            Alignment.BOTTOM = "bottom";
            Alignment.LEFT = "left";
            Alignment.RIGHT = "right";
            Alignment.CENTER = "center";
            return Alignment;
        })();
        Components.Alignment = Alignment;
    })(Components = Plottable.Components || (Plottable.Components = {}));
    var Component = (function () {
        function Component() {
            this._clipPathEnabled = false;
            this._origin = { x: 0, y: 0 }; // Origin of the coordinate space for the Component.
            this._xAlignment = "left";
            this._yAlignment = "top";
            this._isSetup = false;
            this._isAnchored = false;
            this._boxes = [];
            this._isTopLevelComponent = false;
            this._cssClasses = new Plottable.Utils.Set();
            this._destroyed = false;
            this._onAnchorCallbacks = new Plottable.Utils.CallbackSet();
            this._onDetachCallbacks = new Plottable.Utils.CallbackSet();
            this._cssClasses.add("component");
        }
        /**
         * Attaches the Component as a child of a given d3 Selection.
         *
         * @param {d3.Selection} selection.
         * @returns {Component} The calling Component.
         */
        Component.prototype.anchor = function (selection) {
            if (this._destroyed) {
                throw new Error("Can't reuse destroy()-ed Components!");
            }
            this._isTopLevelComponent = selection.node().nodeName.toLowerCase() === "svg";
            if (this._isTopLevelComponent) {
                // svg node gets the "plottable" CSS class
                this._rootSVG = selection;
                this._rootSVG.classed("plottable", true);
                // visible overflow for firefox https://stackoverflow.com/questions/5926986/why-does-firefox-appear-to-truncate-embedded-svgs
                this._rootSVG.style("overflow", "visible");
                // HACKHACK: Safari fails to register events on the <svg> itself
                var safariBacking = this._rootSVG.select("." + Component._SAFARI_EVENT_BACKING_CLASS);
                if (safariBacking.empty()) {
                    this._rootSVG.append("rect").classed(Component._SAFARI_EVENT_BACKING_CLASS, true).attr({
                        x: 0,
                        y: 0,
                        width: "100%",
                        height: "100%"
                    }).style("opacity", 0);
                }
            }
            if (this._element != null) {
                // reattach existing element
                selection.node().appendChild(this._element.node());
            }
            else {
                this._element = selection.append("g");
                this._setup();
            }
            this._isAnchored = true;
            this._onAnchorCallbacks.callCallbacks(this);
            return this;
        };
        /**
         * Adds a callback to be called on anchoring the Component to the DOM.
         * If the Component is already anchored, the callback is called immediately.
         *
         * @param {ComponentCallback} callback
         * @return {Component}
         */
        Component.prototype.onAnchor = function (callback) {
            if (this._isAnchored) {
                callback(this);
            }
            this._onAnchorCallbacks.add(callback);
            return this;
        };
        /**
         * Removes a callback that would be called on anchoring the Component to the DOM.
         * The callback is identified by reference equality.
         *
         * @param {ComponentCallback} callback
         * @return {Component}
         */
        Component.prototype.offAnchor = function (callback) {
            this._onAnchorCallbacks.delete(callback);
            return this;
        };
        /**
         * Creates additional elements as necessary for the Component to function.
         * Called during anchor() if the Component's element has not been created yet.
         * Override in subclasses to provide additional functionality.
         */
        Component.prototype._setup = function () {
            var _this = this;
            if (this._isSetup) {
                return;
            }
            this._cssClasses.forEach(function (cssClass) {
                _this._element.classed(cssClass, true);
            });
            this._cssClasses = new Plottable.Utils.Set();
            this._backgroundContainer = this._element.append("g").classed("background-container", true);
            this._addBox("background-fill", this._backgroundContainer);
            this._content = this._element.append("g").classed("content", true);
            this._foregroundContainer = this._element.append("g").classed("foreground-container", true);
            this._boxContainer = this._element.append("g").classed("box-container", true);
            if (this._clipPathEnabled) {
                this._generateClipPath();
            }
            ;
            this._boundingBox = this._addBox("bounding-box");
            this._isSetup = true;
        };
        /**
         * Given available space in pixels, returns the minimum width and height this Component will need.
         *
         * @param {number} availableWidth
         * @param {number} availableHeight
         * @returns {SpaceRequest}
         */
        Component.prototype.requestedSpace = function (availableWidth, availableHeight) {
            return {
                minWidth: 0,
                minHeight: 0
            };
        };
        /**
         * Computes and sets the size, position, and alignment of the Component from the specified values.
         * If no parameters are supplied and the Component is a root node,
         * they are inferred from the size of the Component's element.
         *
         * @param {Point} [origin] Origin of the space offered to the Component.
         * @param {number} [availableWidth] Available width in pixels.
         * @param {number} [availableHeight] Available height in pixels.
         * @returns {Component} The calling Component.
         */
        Component.prototype.computeLayout = function (origin, availableWidth, availableHeight) {
            var _this = this;
            if (origin == null || availableWidth == null || availableHeight == null) {
                if (this._element == null) {
                    throw new Error("anchor() must be called before computeLayout()");
                }
                else if (this._isTopLevelComponent) {
                    // we are the root node, retrieve height/width from root SVG
                    origin = { x: 0, y: 0 };
                    // Set width/height to 100% if not specified, to allow accurate size calculation
                    // see http://www.w3.org/TR/CSS21/visudet.html#block-replaced-width
                    // and http://www.w3.org/TR/CSS21/visudet.html#inline-replaced-height
                    if (this._rootSVG.attr("width") == null) {
                        this._rootSVG.attr("width", "100%");
                    }
                    if (this._rootSVG.attr("height") == null) {
                        this._rootSVG.attr("height", "100%");
                    }
                    var elem = this._rootSVG.node();
                    availableWidth = Plottable.Utils.DOM.elementWidth(elem);
                    availableHeight = Plottable.Utils.DOM.elementHeight(elem);
                }
                else {
                    throw new Error("null arguments cannot be passed to computeLayout() on a non-root node");
                }
            }
            var size = this._sizeFromOffer(availableWidth, availableHeight);
            this._width = size.width;
            this._height = size.height;
            var xAlignProportion = Component._xAlignToProportion[this._xAlignment];
            var yAlignProportion = Component._yAlignToProportion[this._yAlignment];
            this._origin = {
                x: origin.x + (availableWidth - this.width()) * xAlignProportion,
                y: origin.y + (availableHeight - this.height()) * yAlignProportion
            };
            this._element.attr("transform", "translate(" + this._origin.x + "," + this._origin.y + ")");
            this._boxes.forEach(function (b) { return b.attr("width", _this.width()).attr("height", _this.height()); });
            return this;
        };
        Component.prototype._sizeFromOffer = function (availableWidth, availableHeight) {
            var requestedSpace = this.requestedSpace(availableWidth, availableHeight);
            return {
                width: this.fixedWidth() ? Math.min(availableWidth, requestedSpace.minWidth) : availableWidth,
                height: this.fixedHeight() ? Math.min(availableHeight, requestedSpace.minHeight) : availableHeight
            };
        };
        /**
         * Queues the Component for rendering.
         *
         * @returns {Component} The calling Component.
         */
        Component.prototype.render = function () {
            if (this._isAnchored && this._isSetup && this.width() >= 0 && this.height() >= 0) {
                Plottable.RenderController.registerToRender(this);
            }
            return this;
        };
        Component.prototype._scheduleComputeLayout = function () {
            if (this._isAnchored && this._isSetup) {
                Plottable.RenderController.registerToComputeLayout(this);
            }
        };
        /**
         * Renders the Component without waiting for the next frame.
         */
        Component.prototype.renderImmediately = function () {
            if (this._clipPathEnabled) {
                this._updateClipPath();
            }
            return this;
        };
        /**
         * Causes the Component to re-layout and render.
         *
         * This function should be called when a CSS change has occured that could
         * influence the layout of the Component, such as changing the font size.
         *
         * @returns {Component} The calling Component.
         */
        Component.prototype.redraw = function () {
            if (this._isAnchored && this._isSetup) {
                if (this._isTopLevelComponent) {
                    this._scheduleComputeLayout();
                }
                else {
                    this.parent().redraw();
                }
            }
            return this;
        };
        /**
         * Renders the Component to a given <svg>.
         *
         * @param {String|d3.Selection} element A selector-string for the <svg>, or a d3 selection containing an <svg>.
         * @returns {Component} The calling Component.
         */
        Component.prototype.renderTo = function (element) {
            this.detach();
            if (element != null) {
                var selection;
                if (typeof (element) === "string") {
                    selection = d3.select(element);
                }
                else if (element instanceof Element) {
                    selection = d3.select(element);
                }
                else {
                    selection = element;
                }
                if (!selection.node() || selection.node().nodeName.toLowerCase() !== "svg") {
                    throw new Error("Plottable requires a valid SVG to renderTo");
                }
                this.anchor(selection);
            }
            if (this._element == null) {
                throw new Error("If a Component has never been rendered before, then renderTo must be given a node to render to, " +
                    "or a d3.Selection, or a selector string");
            }
            this.computeLayout();
            this.render();
            // flush so that consumers can immediately attach to stuff we create in the DOM
            Plottable.RenderController.flush();
            return this;
        };
        Component.prototype.xAlignment = function (xAlignment) {
            if (xAlignment == null) {
                return this._xAlignment;
            }
            xAlignment = xAlignment.toLowerCase();
            if (Component._xAlignToProportion[xAlignment] == null) {
                throw new Error("Unsupported alignment: " + xAlignment);
            }
            this._xAlignment = xAlignment;
            this.redraw();
            return this;
        };
        Component.prototype.yAlignment = function (yAlignment) {
            if (yAlignment == null) {
                return this._yAlignment;
            }
            yAlignment = yAlignment.toLowerCase();
            if (Component._yAlignToProportion[yAlignment] == null) {
                throw new Error("Unsupported alignment: " + yAlignment);
            }
            this._yAlignment = yAlignment;
            this.redraw();
            return this;
        };
        Component.prototype._addBox = function (className, parentElement) {
            if (this._element == null) {
                throw new Error("Adding boxes before anchoring is currently disallowed");
            }
            parentElement = parentElement == null ? this._boxContainer : parentElement;
            var box = parentElement.append("rect");
            if (className != null) {
                box.classed(className, true);
            }
            this._boxes.push(box);
            if (this.width() != null && this.height() != null) {
                box.attr("width", this.width()).attr("height", this.height());
            }
            return box;
        };
        Component.prototype._generateClipPath = function () {
            // The clip path will prevent content from overflowing its Component space.
            this._clipPathID = Plottable.Utils.DOM.generateUniqueClipPathId();
            var clipPathParent = this._boxContainer.append("clipPath").attr("id", this._clipPathID);
            this._addBox("clip-rect", clipPathParent);
            this._updateClipPath();
        };
        Component.prototype._updateClipPath = function () {
            // HACKHACK: IE <= 9 does not respect the HTML base element in SVG.
            // They don't need the current URL in the clip path reference.
            var prefix = /MSIE [5-9]/.test(navigator.userAgent) ? "" : document.location.href;
            prefix = prefix.split("#")[0]; // To fix cases where an anchor tag was used
            this._element.attr("clip-path", "url(\"" + prefix + "#" + this._clipPathID + "\")");
        };
        /**
         * Checks if the Component has a given CSS class.
         *
         * @param {string} cssClass The CSS class to check for.
         */
        Component.prototype.hasClass = function (cssClass) {
            if (cssClass == null) {
                return false;
            }
            if (this._element == null) {
                return this._cssClasses.has(cssClass);
            }
            else {
                return this._element.classed(cssClass);
            }
        };
        /**
         * Adds a given CSS class to the Component.
         *
         * @param {string} cssClass The CSS class to add.
         * @returns {Component} The calling Component.
         */
        Component.prototype.addClass = function (cssClass) {
            if (cssClass == null) {
                return this;
            }
            if (this._element == null) {
                this._cssClasses.add(cssClass);
            }
            else {
                this._element.classed(cssClass, true);
            }
            return this;
        };
        /**
         * Removes a given CSS class from the Component.
         *
         * @param {string} cssClass The CSS class to remove.
         * @returns {Component} The calling Component.
         */
        Component.prototype.removeClass = function (cssClass) {
            if (cssClass == null) {
                return this;
            }
            if (this._element == null) {
                this._cssClasses.delete(cssClass);
            }
            else {
                this._element.classed(cssClass, false);
            }
            return this;
        };
        /**
         * Checks if the Component has a fixed width or if it grows to fill available space.
         * Returns false by default on the base Component class.
         */
        Component.prototype.fixedWidth = function () {
            return false;
        };
        /**
         * Checks if the Component has a fixed height or if it grows to fill available space.
         * Returns false by default on the base Component class.
         */
        Component.prototype.fixedHeight = function () {
            return false;
        };
        /**
         * Detaches a Component from the DOM. The Component can be reused.
         *
         * This should only be used if you plan on reusing the calling Component. Otherwise, use destroy().
         *
         * @returns The calling Component.
         */
        Component.prototype.detach = function () {
            this.parent(null);
            if (this._isAnchored) {
                this._element.remove();
                if (this._isTopLevelComponent) {
                    this._rootSVG.select("." + Component._SAFARI_EVENT_BACKING_CLASS).remove();
                }
            }
            this._isAnchored = false;
            this._onDetachCallbacks.callCallbacks(this);
            return this;
        };
        /**
         * Adds a callback to be called when the Component is detach()-ed.
         *
         * @param {ComponentCallback} callback
         * @return {Component} The calling Component.
         */
        Component.prototype.onDetach = function (callback) {
            this._onDetachCallbacks.add(callback);
            return this;
        };
        /**
         * Removes a callback to be called when the Component is detach()-ed.
         * The callback is identified by reference equality.
         *
         * @param {ComponentCallback} callback
         * @return {Component} The calling Component.
         */
        Component.prototype.offDetach = function (callback) {
            this._onDetachCallbacks.delete(callback);
            return this;
        };
        Component.prototype.parent = function (parent) {
            if (parent === undefined) {
                return this._parent;
            }
            if (parent !== null && !parent.has(this)) {
                throw new Error("Passed invalid parent");
            }
            this._parent = parent;
            return this;
        };
        /**
         * Removes a Component from the DOM and disconnects all listeners.
         */
        Component.prototype.destroy = function () {
            this._destroyed = true;
            this.detach();
        };
        /**
         * Gets the width of the Component in pixels.
         */
        Component.prototype.width = function () {
            return this._width;
        };
        /**
         * Gets the height of the Component in pixels.
         */
        Component.prototype.height = function () {
            return this._height;
        };
        /**
         * Gets the origin of the Component relative to its parent.
         *
         * @return {Point}
         */
        Component.prototype.origin = function () {
            return {
                x: this._origin.x,
                y: this._origin.y
            };
        };
        /**
         * Gets the origin of the Component relative to the root <svg>.
         *
         * @return {Point}
         */
        Component.prototype.originToSVG = function () {
            var origin = this.origin();
            var ancestor = this.parent();
            while (ancestor != null) {
                var ancestorOrigin = ancestor.origin();
                origin.x += ancestorOrigin.x;
                origin.y += ancestorOrigin.y;
                ancestor = ancestor.parent();
            }
            return origin;
        };
        /**
         * Gets the Selection containing the <g> in front of the visual elements of the Component.
         *
         * Will return undefined if the Component has not been anchored.
         *
         * @return {d3.Selection}
         */
        Component.prototype.foreground = function () {
            return this._foregroundContainer;
        };
        /**
         * Gets a Selection containing a <g> that holds the visual elements of the Component.
         *
         * Will return undefined if the Component has not been anchored.
         *
         * @return {d3.Selection} content selection for the Component
         */
        Component.prototype.content = function () {
            return this._content;
        };
        /**
         * Gets the Selection containing the <g> behind the visual elements of the Component.
         *
         * Will return undefined if the Component has not been anchored.
         *
         * @return {d3.Selection} background selection for the Component
         */
        Component.prototype.background = function () {
            return this._backgroundContainer;
        };
        Component._xAlignToProportion = {
            "left": 0,
            "center": 0.5,
            "right": 1
        };
        Component._yAlignToProportion = {
            "top": 0,
            "center": 0.5,
            "bottom": 1
        };
        Component._SAFARI_EVENT_BACKING_CLASS = "safari-event-backing";
        return Component;
    })();
    Plottable.Component = Component;
})(Plottable || (Plottable = {}));
