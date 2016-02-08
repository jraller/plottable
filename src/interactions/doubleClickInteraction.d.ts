declare module Plottable.Interactions {
    class DoubleClick extends Interaction {
        private _mouseDispatcher;
        private _touchDispatcher;
        private _clickState;
        private _clickedDown;
        private _clickedPoint;
        private _onDoubleClickCallbacks;
        private _mouseDownCallback;
        private _mouseUpCallback;
        private _dblClickCallback;
        private _touchStartCallback;
        private _touchEndCallback;
        private _touchCancelCallback;
        protected _anchor(component: Component): void;
        protected _unanchor(): void;
        private _handleClickDown(p);
        private _handleClickUp(p);
        private _handleDblClick();
        private _handleClickCancel();
        private static _pointsEqual(p1, p2);
        /**
         * Adds a callback to be called when the Component is double-clicked.
         *
         * @param {ClickCallback} callback
         * @return {Interactions.DoubleClick} The calling DoubleClick Interaction.
         */
        onDoubleClick(callback: ClickCallback): this;
        /**
         * Removes a callback that would be called when the Component is double-clicked.
         *
         * @param {ClickCallback} callback
         * @return {Interactions.DoubleClick} The calling DoubleClick Interaction.
         */
        offDoubleClick(callback: ClickCallback): this;
    }
}
