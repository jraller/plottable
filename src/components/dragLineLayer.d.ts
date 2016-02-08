declare module Plottable {
    interface DragLineCallback<D> {
        (dragLineLayer: Components.DragLineLayer<D>): void;
    }
}
declare module Plottable.Components {
    class DragLineLayer<D> extends GuideLineLayer<D> {
        private _dragInteraction;
        private _detectionRadius;
        private _detectionEdge;
        private _enabled;
        private _dragStartCallbacks;
        private _dragCallbacks;
        private _dragEndCallbacks;
        private _disconnectInteraction;
        constructor(orientation: string);
        protected _setup(): void;
        renderImmediately(): this;
        /**
         * Gets the detection radius of the drag line in pixels.
         */
        detectionRadius(): number;
        /**
         * Sets the detection radius of the drag line in pixels.
         *
         * @param {number} detectionRadius
         * @return {DragLineLayer<D>} The calling DragLineLayer.
         */
        detectionRadius(detectionRadius: number): this;
        /**
         * Gets whether the DragLineLayer is enabled.
         */
        enabled(): boolean;
        /**
         * Enables or disables the DragLineLayer.
         *
         * @param {boolean} enabled
         * @return {DragLineLayer<D>} The calling DragLineLayer.
         */
        enabled(enabled: boolean): this;
        /**
         * Sets the callback to be called when dragging starts.
         * The callback will be passed the calling DragLineLayer.
         *
         * @param {DragLineCallback<D>} callback
         * @returns {DragLineLayer<D>} The calling DragLineLayer.
         */
        onDragStart(callback: DragLineCallback<D>): this;
        /**
         * Removes a callback that would be called when dragging starts.
         *
         * @param {DragLineCallback<D>} callback
         * @returns {DragLineLayer<D>} The calling DragLineLayer.
         */
        offDragStart(callback: DragLineCallback<D>): this;
        /**
         * Sets a callback to be called during dragging.
         * The callback will be passed the calling DragLineLayer.
         *
         * @param {DragLineCallback<D>} callback
         * @returns {DragLineLayer<D>} The calling DragLineLayer.
         */
        onDrag(callback: DragLineCallback<D>): this;
        /**
         * Removes a callback that would be called during dragging.
         *
         * @param {DragLineCallback<D>} callback
         * @returns {DragLineLayer<D>} The calling DragLineLayer.
         */
        offDrag(callback: DragLineCallback<D>): this;
        /**
         * Sets a callback to be called when dragging ends.
         * The callback will be passed the calling DragLineLayer.
         *
         * @param {DragLineCallback<D>} callback
         * @returns {DragLineLayer<D>} The calling DragLineLayer.
         */
        onDragEnd(callback: DragLineCallback<D>): this;
        /**
         * Removes a callback that would be called when dragging ends.
         *
         * @param {DragLineCallback<D>} callback
         * @returns {DragLineLayer<D>} The calling DragLineLayer.
         */
        offDragEnd(callback: DragLineCallback<D>): this;
        destroy(): void;
    }
}
