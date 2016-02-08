/**
 * The RenderController is responsible for enqueueing and synchronizing
 * layout and render calls for Components.
 *
 * Layout and render calls occur inside an animation callback
 * (window.requestAnimationFrame if available).
 *
 * RenderController.flush() immediately lays out and renders all Components currently enqueued.
 *
 * To always have immediate rendering (useful for debugging), call
 * ```typescript
 * Plottable.RenderController.setRenderPolicy(
 *   new Plottable.RenderPolicies.Immediate()
 * );
 * ```
 */
declare module Plottable.RenderController {
    module Policy {
        var IMMEDIATE: string;
        var ANIMATION_FRAME: string;
        var TIMEOUT: string;
    }
    function renderPolicy(): RenderPolicies.RenderPolicy;
    function renderPolicy(renderPolicy: string): void;
    /**
     * Enqueues the Component for rendering.
     *
     * @param {Component} component
     */
    function registerToRender(component: Component): void;
    /**
     * Enqueues the Component for layout and rendering.
     *
     * @param {Component} component
     */
    function registerToComputeLayout(component: Component): void;
    /**
     * Renders all Components waiting to be rendered immediately
     * instead of waiting until the next frame.
     *
     * Useful to call when debugging.
     */
    function flush(): void;
}
