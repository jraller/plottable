declare module Plottable.Dispatchers {
    type TouchCallback = (ids: number[], idToPoint: {
        [id: number]: Point;
    }, event: TouchEvent) => void;
    class Touch extends Dispatcher {
        private static _DISPATCHER_KEY;
        private static _TOUCHSTART_EVENT_NAME;
        private static _TOUCHMOVE_EVENT_NAME;
        private static _TOUCHEND_EVENT_NAME;
        private static _TOUCHCANCEL_EVENT_NAME;
        private _translator;
        /**
         * Gets a Touch Dispatcher for the <svg> containing elem.
         * If one already exists on that <svg>, it will be returned; otherwise, a new one will be created.
         *
         * @param {SVGElement} elem
         * @return {Dispatchers.Touch}
         */
        static getDispatcher(elem: SVGElement): Dispatchers.Touch;
        /**
         * This constructor should not be invoked directly.
         *
         * @constructor
         * @param {SVGElement} svg The root <svg> to attach to.
         */
        constructor(svg: SVGElement);
        /**
         * Registers a callback to be called when a touch starts.
         *
         * @param {TouchCallback} callback
         * @return {Dispatchers.Touch} The calling Touch Dispatcher.
         */
        onTouchStart(callback: TouchCallback): this;
        /**
         * Removes a callback that would be called when a touch starts.
         *
         * @param {TouchCallback} callback
         * @return {Dispatchers.Touch} The calling Touch Dispatcher.
         */
        offTouchStart(callback: TouchCallback): this;
        /**
         * Registers a callback to be called when the touch position changes.
         *
         * @param {TouchCallback} callback
         * @return {Dispatchers.Touch} The calling Touch Dispatcher.
         */
        onTouchMove(callback: TouchCallback): this;
        /**
         * Removes a callback that would be called when the touch position changes.
         *
         * @param {TouchCallback} callback
         * @return {Dispatchers.Touch} The calling Touch Dispatcher.
         */
        offTouchMove(callback: TouchCallback): this;
        /**
         * Registers a callback to be called when a touch ends.
         *
         * @param {TouchCallback} callback
         * @return {Dispatchers.Touch} The calling Touch Dispatcher.
         */
        onTouchEnd(callback: TouchCallback): this;
        /**
         * Removes a callback that would be called when a touch ends.
         *
         * @param {TouchCallback} callback
         * @return {Dispatchers.Touch} The calling Touch Dispatcher.
         */
        offTouchEnd(callback: TouchCallback): this;
        /**
         * Registers a callback to be called when a touch is cancelled.
         *
         * @param {TouchCallback} callback
         * @return {Dispatchers.Touch} The calling Touch Dispatcher.
         */
        onTouchCancel(callback: TouchCallback): this;
        /**
         * Removes a callback that would be called when a touch is cancelled.
         *
         * @param {TouchCallback} callback
         * @return {Dispatchers.Touch} The calling Touch Dispatcher.
         */
        offTouchCancel(callback: TouchCallback): this;
        /**
         * Computes the Touch position from the given event, and if successful
         * calls all the callbacks in the provided callbackSet.
         */
        private _measureAndDispatch(event, eventName, scope?);
        eventInsideSVG(event: TouchEvent): boolean;
    }
}
