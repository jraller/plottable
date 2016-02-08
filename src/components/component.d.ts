declare module Plottable {
    type ComponentCallback = (component: Component) => void;
    module Components {
        class Alignment {
            static TOP: string;
            static BOTTOM: string;
            static LEFT: string;
            static RIGHT: string;
            static CENTER: string;
        }
    }
    class Component {
        private _element;
        private _content;
        protected _boundingBox: d3.Selection<void>;
        private _backgroundContainer;
        private _foregroundContainer;
        protected _clipPathEnabled: boolean;
        private _origin;
        private _parent;
        private _xAlignment;
        private static _xAlignToProportion;
        private _yAlignment;
        private static _yAlignToProportion;
        protected _isSetup: boolean;
        protected _isAnchored: boolean;
        private _boxes;
        private _boxContainer;
        private _rootSVG;
        private _isTopLevelComponent;
        private _width;
        private _height;
        private _cssClasses;
        private _destroyed;
        private _clipPathID;
        private _onAnchorCallbacks;
        private _onDetachCallbacks;
        private static _SAFARI_EVENT_BACKING_CLASS;
        constructor();
        /**
         * Attaches the Component as a child of a given d3 Selection.
         *
         * @param {d3.Selection} selection.
         * @returns {Component} The calling Component.
         */
        anchor(selection: d3.Selection<void>): this;
        /**
         * Adds a callback to be called on anchoring the Component to the DOM.
         * If the Component is already anchored, the callback is called immediately.
         *
         * @param {ComponentCallback} callback
         * @return {Component}
         */
        onAnchor(callback: ComponentCallback): this;
        /**
         * Removes a callback that would be called on anchoring the Component to the DOM.
         * The callback is identified by reference equality.
         *
         * @param {ComponentCallback} callback
         * @return {Component}
         */
        offAnchor(callback: ComponentCallback): this;
        /**
         * Creates additional elements as necessary for the Component to function.
         * Called during anchor() if the Component's element has not been created yet.
         * Override in subclasses to provide additional functionality.
         */
        protected _setup(): void;
        /**
         * Given available space in pixels, returns the minimum width and height this Component will need.
         *
         * @param {number} availableWidth
         * @param {number} availableHeight
         * @returns {SpaceRequest}
         */
        requestedSpace(availableWidth: number, availableHeight: number): SpaceRequest;
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
        computeLayout(origin?: Point, availableWidth?: number, availableHeight?: number): this;
        protected _sizeFromOffer(availableWidth: number, availableHeight: number): {
            width: number;
            height: number;
        };
        /**
         * Queues the Component for rendering.
         *
         * @returns {Component} The calling Component.
         */
        render(): this;
        private _scheduleComputeLayout();
        /**
         * Renders the Component without waiting for the next frame.
         */
        renderImmediately(): this;
        /**
         * Causes the Component to re-layout and render.
         *
         * This function should be called when a CSS change has occured that could
         * influence the layout of the Component, such as changing the font size.
         *
         * @returns {Component} The calling Component.
         */
        redraw(): this;
        /**
         * Renders the Component to a given <svg>.
         *
         * @param {String|d3.Selection} element A selector-string for the <svg>, or a d3 selection containing an <svg>.
         * @returns {Component} The calling Component.
         */
        renderTo(element: String | Element | d3.Selection<void>): this;
        /**
         * Gets the x alignment of the Component.
         */
        xAlignment(): string;
        /**
         * Sets the x alignment of the Component.
         *
         * @param {string} xAlignment The x alignment of the Component ("left"/"center"/"right").
         * @returns {Component} The calling Component.
         */
        xAlignment(xAlignment: string): this;
        /**
         * Gets the y alignment of the Component.
         */
        yAlignment(): string;
        /**
         * Sets the y alignment of the Component.
         *
         * @param {string} yAlignment The y alignment of the Component ("top"/"center"/"bottom").
         * @returns {Component} The calling Component.
         */
        yAlignment(yAlignment: string): this;
        private _addBox(className?, parentElement?);
        private _generateClipPath();
        private _updateClipPath();
        /**
         * Checks if the Component has a given CSS class.
         *
         * @param {string} cssClass The CSS class to check for.
         */
        hasClass(cssClass: string): boolean;
        /**
         * Adds a given CSS class to the Component.
         *
         * @param {string} cssClass The CSS class to add.
         * @returns {Component} The calling Component.
         */
        addClass(cssClass: string): this;
        /**
         * Removes a given CSS class from the Component.
         *
         * @param {string} cssClass The CSS class to remove.
         * @returns {Component} The calling Component.
         */
        removeClass(cssClass: string): this;
        /**
         * Checks if the Component has a fixed width or if it grows to fill available space.
         * Returns false by default on the base Component class.
         */
        fixedWidth(): boolean;
        /**
         * Checks if the Component has a fixed height or if it grows to fill available space.
         * Returns false by default on the base Component class.
         */
        fixedHeight(): boolean;
        /**
         * Detaches a Component from the DOM. The Component can be reused.
         *
         * This should only be used if you plan on reusing the calling Component. Otherwise, use destroy().
         *
         * @returns The calling Component.
         */
        detach(): this;
        /**
         * Adds a callback to be called when the Component is detach()-ed.
         *
         * @param {ComponentCallback} callback
         * @return {Component} The calling Component.
         */
        onDetach(callback: ComponentCallback): this;
        /**
         * Removes a callback to be called when the Component is detach()-ed.
         * The callback is identified by reference equality.
         *
         * @param {ComponentCallback} callback
         * @return {Component} The calling Component.
         */
        offDetach(callback: ComponentCallback): this;
        /**
         * Gets the parent ComponentContainer for this Component.
         */
        parent(): ComponentContainer;
        /**
         * Sets the parent ComponentContainer for this Component.
         * An error will be thrown if the parent does not contain this Component.
         * Adding a Component to a ComponentContainer should be done
         * using the appropriate method on the ComponentContainer.
         */
        parent(parent: ComponentContainer): this;
        /**
         * Removes a Component from the DOM and disconnects all listeners.
         */
        destroy(): void;
        /**
         * Gets the width of the Component in pixels.
         */
        width(): number;
        /**
         * Gets the height of the Component in pixels.
         */
        height(): number;
        /**
         * Gets the origin of the Component relative to its parent.
         *
         * @return {Point}
         */
        origin(): Point;
        /**
         * Gets the origin of the Component relative to the root <svg>.
         *
         * @return {Point}
         */
        originToSVG(): Point;
        /**
         * Gets the Selection containing the <g> in front of the visual elements of the Component.
         *
         * Will return undefined if the Component has not been anchored.
         *
         * @return {d3.Selection}
         */
        foreground(): d3.Selection<void>;
        /**
         * Gets a Selection containing a <g> that holds the visual elements of the Component.
         *
         * Will return undefined if the Component has not been anchored.
         *
         * @return {d3.Selection} content selection for the Component
         */
        content(): d3.Selection<void>;
        /**
         * Gets the Selection containing the <g> behind the visual elements of the Component.
         *
         * Will return undefined if the Component has not been anchored.
         *
         * @return {d3.Selection} background selection for the Component
         */
        background(): d3.Selection<void>;
    }
}
