declare module Plottable {
    type ClickCallback = (point: Point) => void;
}
declare module Plottable.Interactions {
    class Click extends Interaction {
        private _mouseDispatcher;
        private _touchDispatcher;
        private _clickedDown;
        private _onClickCallbacks;
        private _mouseDownCallback;
        private _mouseUpCallback;
        private _touchStartCallback;
        private _touchEndCallback;
        private _touchCancelCallback;
        protected _anchor(component: Component): void;
        protected _unanchor(): void;
        private _handleClickDown(p);
        private _handleClickUp(p);
        /**
         * Adds a callback to be called when the Component is clicked.
         *
         * @param {ClickCallback} callback
         * @return {Interactions.Click} The calling Click Interaction.
         */
        onClick(callback: ClickCallback): this;
        /**
         * Removes a callback that would be called when the Component is clicked.
         *
         * @param {ClickCallback} callback
         * @return {Interactions.Click} The calling Click Interaction.
         */
        offClick(callback: ClickCallback): this;
    }
}
