declare module Plottable.RenderPolicies {
    /**
     * A policy for rendering Components.
     */
    interface RenderPolicy {
        render(): any;
    }
    /**
     * Renders Components immediately after they are enqueued.
     * Useful for debugging, horrible for performance.
     */
    class Immediate implements RenderPolicy {
        render(): void;
    }
    /**
     * The default way to render, which only tries to render every frame
     * (usually, 1/60th of a second).
     */
    class AnimationFrame implements RenderPolicy {
        render(): void;
    }
    /**
     * Renders with `setTimeout()`.
     * Generally an inferior way to render compared to `requestAnimationFrame`,
     * but useful for browsers that don't suppoort `requestAnimationFrame`.
     */
    class Timeout implements RenderPolicy {
        private _timeoutMsec;
        render(): void;
    }
}
