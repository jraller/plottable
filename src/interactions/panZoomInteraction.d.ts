declare module Plottable.Interactions {
    class PanZoom extends Interaction {
        /**
         * The number of pixels occupied in a line.
         */
        private static _PIXELS_PER_LINE;
        private _xScales;
        private _yScales;
        private _dragInteraction;
        private _mouseDispatcher;
        private _touchDispatcher;
        private _touchIds;
        private _wheelCallback;
        private _touchStartCallback;
        private _touchMoveCallback;
        private _touchEndCallback;
        private _touchCancelCallback;
        private _minDomainExtents;
        private _maxDomainExtents;
        /**
         * A PanZoom Interaction updates the domains of an x-scale and/or a y-scale
         * in response to the user panning or zooming.
         *
         * @constructor
         * @param {QuantitativeScale} [xScale] The x-scale to update on panning/zooming.
         * @param {QuantitativeScale} [yScale] The y-scale to update on panning/zooming.
         */
        constructor(xScale?: QuantitativeScale<any>, yScale?: QuantitativeScale<any>);
        protected _anchor(component: Component): void;
        protected _unanchor(): void;
        private _handleTouchStart(ids, idToPoint, e);
        private _handlePinch(ids, idToPoint, e);
        private static _centerPoint(point1, point2);
        private static _pointDistance(point1, point2);
        private _handleTouchEnd(ids, idToPoint, e);
        private _magnifyScale<D>(scale, magnifyAmount, centerValue);
        private _translateScale<D>(scale, translateAmount);
        private _handleWheelEvent(p, e);
        private _constrainedZoomAmount(scale, zoomAmount);
        private _setupDragInteraction();
        private _nonLinearScaleWithExtents(scale);
        /**
         * Gets the x scales for this PanZoom Interaction.
         */
        xScales(): QuantitativeScale<any>[];
        /**
         * Sets the x scales for this PanZoom Interaction.
         *
         * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
         */
        xScales(xScales: QuantitativeScale<any>[]): this;
        /**
         * Gets the y scales for this PanZoom Interaction.
         */
        yScales(): QuantitativeScale<any>[];
        /**
         * Sets the y scales for this PanZoom Interaction.
         *
         * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
         */
        yScales(yScales: QuantitativeScale<any>[]): this;
        /**
         * Adds an x scale to this PanZoom Interaction
         *
         * @param {QuantitativeScale<any>} An x scale to add
         * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
         */
        addXScale(xScale: QuantitativeScale<any>): this;
        /**
         * Removes an x scale from this PanZoom Interaction
         *
         * @param {QuantitativeScale<any>} An x scale to remove
         * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
         */
        removeXScale(xScale: QuantitativeScale<any>): this;
        /**
         * Adds a y scale to this PanZoom Interaction
         *
         * @param {QuantitativeScale<any>} A y scale to add
         * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
         */
        addYScale(yScale: QuantitativeScale<any>): this;
        /**
         * Removes a y scale from this PanZoom Interaction
         *
         * @param {QuantitativeScale<any>} A y scale to remove
         * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
         */
        removeYScale(yScale: QuantitativeScale<any>): this;
        /**
         * Gets the minimum domain extent for the scale, specifying the minimum allowable amount
         * between the ends of the domain.
         *
         * Note that extents will mainly work on scales that work linearly like Linear Scale and Time Scale
         *
         * @param {QuantitativeScale<any>} quantitativeScale The scale to query
         * @returns {D} The minimum domain extent for the scale.
         */
        minDomainExtent<D>(quantitativeScale: QuantitativeScale<D>): D;
        /**
         * Sets the minimum domain extent for the scale, specifying the minimum allowable amount
         * between the ends of the domain.
         *
         * Note that extents will mainly work on scales that work linearly like Linear Scale and Time Scale
         *
         * @param {QuantitativeScale<any>} quantitativeScale The scale to query
         * @param {D} minDomainExtent The minimum domain extent for the scale.
         * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
         */
        minDomainExtent<D>(quantitativeScale: QuantitativeScale<D>, minDomainExtent: D): this;
        /**
         * Gets the maximum domain extent for the scale, specifying the maximum allowable amount
         * between the ends of the domain.
         *
         * Note that extents will mainly work on scales that work linearly like Linear Scale and Time Scale
         *
         * @param {QuantitativeScale<any>} quantitativeScale The scale to query
         * @returns {D} The maximum domain extent for the scale.
         */
        maxDomainExtent<D>(quantitativeScale: QuantitativeScale<D>): D;
        /**
         * Sets the maximum domain extent for the scale, specifying the maximum allowable amount
         * between the ends of the domain.
         *
         * Note that extents will mainly work on scales that work linearly like Linear Scale and Time Scale
         *
         * @param {QuantitativeScale<any>} quantitativeScale The scale to query
         * @param {D} minDomainExtent The maximum domain extent for the scale.
         * @returns {Interactions.PanZoom} The calling PanZoom Interaction.
         */
        maxDomainExtent<D>(quantitativeScale: QuantitativeScale<D>, maxDomainExtent: D): this;
    }
}
