var Plottable;
(function (Plottable) {
    var Drawer = (function () {
        /**
         * A Drawer draws svg elements based on the input Dataset.
         *
         * @constructor
         * @param {Dataset} dataset The dataset associated with this Drawer
         */
        function Drawer(dataset) {
            this._cachedSelectionValid = false;
            this._dataset = dataset;
        }
        Drawer.prototype.renderArea = function (area) {
            if (area == null) {
                return this._renderArea;
            }
            this._renderArea = area;
            this._cachedSelectionValid = false;
            return this;
        };
        /**
         * Removes the Drawer and its renderArea
         */
        Drawer.prototype.remove = function () {
            if (this.renderArea() != null) {
                this.renderArea().remove();
            }
        };
        /**
         * Binds data to selection
         *
         * @param{any[]} data The data to be drawn
         */
        Drawer.prototype._bindSelectionData = function (data) {
            var dataElements = this.selection().data(data);
            dataElements.enter().append(this._svgElementName);
            dataElements.exit().remove();
            this._applyDefaultAttributes(dataElements);
        };
        Drawer.prototype._applyDefaultAttributes = function (selection) {
            if (this._className != null) {
                selection.classed(this._className, true);
            }
        };
        /**
         * Draws data using one step
         *
         * @param{AppliedDrawStep} step The step, how data should be drawn.
         */
        Drawer.prototype._drawStep = function (step) {
            var selection = this.selection();
            var colorAttributes = ["fill", "stroke"];
            colorAttributes.forEach(function (colorAttribute) {
                if (step.attrToAppliedProjector[colorAttribute] != null) {
                    selection.attr(colorAttribute, step.attrToAppliedProjector[colorAttribute]);
                }
            });
            step.animator.animate(selection, step.attrToAppliedProjector);
            if (this._className != null) {
                this.selection().classed(this._className, true);
            }
        };
        Drawer.prototype._appliedProjectors = function (attrToProjector) {
            var _this = this;
            var modifiedAttrToProjector = {};
            Object.keys(attrToProjector).forEach(function (attr) {
                modifiedAttrToProjector[attr] =
                    function (datum, index) { return attrToProjector[attr](datum, index, _this._dataset); };
            });
            return modifiedAttrToProjector;
        };
        /**
         * Calculates the total time it takes to use the input drawSteps to draw the input data
         *
         * @param {any[]} data The data that would have been drawn
         * @param {Drawers.DrawStep[]} drawSteps The DrawSteps to use
         * @returns {number} The total time it takes to draw
         */
        Drawer.prototype.totalDrawTime = function (data, drawSteps) {
            var delay = 0;
            drawSteps.forEach(function (drawStep, i) {
                delay += drawStep.animator.totalTime(data.length);
            });
            return delay;
        };
        /**
         * Draws the data into the renderArea using the spefic steps and metadata
         *
         * @param{any[]} data The data to be drawn
         * @param{DrawStep[]} drawSteps The list of steps, which needs to be drawn
         */
        Drawer.prototype.draw = function (data, drawSteps) {
            var _this = this;
            var appliedDrawSteps = drawSteps.map(function (dr) {
                var attrToAppliedProjector = _this._appliedProjectors(dr.attrToProjector);
                return {
                    attrToAppliedProjector: attrToAppliedProjector,
                    animator: dr.animator
                };
            });
            this._bindSelectionData(data);
            this._cachedSelectionValid = false;
            var delay = 0;
            appliedDrawSteps.forEach(function (drawStep, i) {
                Plottable.Utils.Window.setTimeout(function () { return _this._drawStep(drawStep); }, delay);
                delay += drawStep.animator.totalTime(data.length);
            });
            return this;
        };
        Drawer.prototype.selection = function () {
            if (!this._cachedSelectionValid) {
                this._cachedSelection = this.renderArea().selectAll(this.selector());
                this._cachedSelectionValid = true;
            }
            return this._cachedSelection;
        };
        /**
         * Returns the CSS selector for this Drawer's visual elements.
         */
        Drawer.prototype.selector = function () {
            return this._svgElementName;
        };
        /**
         * Returns the D3 selection corresponding to the datum with the specified index.
         */
        Drawer.prototype.selectionForIndex = function (index) {
            return d3.select(this.selection()[0][index]);
        };
        return Drawer;
    })();
    Plottable.Drawer = Drawer;
})(Plottable || (Plottable = {}));
