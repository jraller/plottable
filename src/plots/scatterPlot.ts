module Plottable.Plots {
  export class Scatter<X, Y> extends XYPlot<X, Y> {
    private static _SIZE_KEY = "size";
    private static _SYMBOL_KEY = "symbol";
    private _labelsEnabled = false;
    private _label: Accessor<string> = null;

    /**
     * A Scatter Plot draws a symbol at each data point.
     *
     * @constructor
     */
    constructor() {
      super();
      this.addClass("scatter-plot");
      let animator = new Animators.Easing();
      animator.startDelay(5);
      animator.stepDuration(250);
      animator.maxTotalDuration(Plot._ANIMATION_MAX_DURATION);
      this.animator(Plots.Animator.MAIN, animator);
      this.attr("opacity", 0.6);
      this.attr("fill", new Scales.Color().range()[0]);
      this.size(6);
      let circleSymbolFactory = SymbolFactories.circle();
      this.symbol(() => circleSymbolFactory);
    }

    protected _createDrawer(dataset: Dataset) {
      return new Plottable.Drawers.Symbol(dataset);
    }

    /**
     * Gets the AccessorScaleBinding for the size property of the plot.
     * The size property corresponds to the area of the symbol.
     */
    public size<S>(): AccessorScaleBinding<S, number>;
    /**
     * Sets the size property to a constant number or the result of an Accessor<number>.
     *
     * @param {number|Accessor<number>} size
     * @returns {Plots.Scatter} The calling Scatter Plot.
     */
    public size(size: number | Accessor<number>): this;
    /**
     * Sets the size property to a scaled constant value or scaled result of an Accessor.
     * The provided Scale will account for the values when autoDomain()-ing.
     *
     * @param {S|Accessor<S>} sectorValue
     * @param {Scale<S, number>} scale
     * @returns {Plots.Scatter} The calling Scatter Plot.
     */
    public size<S>(size: S | Accessor<S>, scale: Scale<S, number>): this;
    public size<S>(size?: number | Accessor<number> | S | Accessor<S>, scale?: Scale<S, number>): any {
      if (size == null) {
        return this._propertyBindings.get(Scatter._SIZE_KEY);
      }
      this._bindProperty(Scatter._SIZE_KEY, size, scale);
      this.render();
      return this;
    }

    /**
     * Gets the AccessorScaleBinding for the symbol property of the plot.
     * The symbol property corresponds to how the symbol will be drawn.
     */
    public symbol(): AccessorScaleBinding<any, any>;
    /**
     * Sets the symbol property to an Accessor<SymbolFactory>.
     *
     * @param {Accessor<SymbolFactory>} symbol
     * @returns {Plots.Scatter} The calling Scatter Plot.
     */
    public symbol(symbol: Accessor<SymbolFactory>): this;
    public symbol(symbol?: Accessor<SymbolFactory>): any {
      if (symbol == null) {
        return this._propertyBindings.get(Scatter._SYMBOL_KEY);
      }
      this._propertyBindings.set(Scatter._SYMBOL_KEY, { accessor: symbol });
      this.render();
      return this;
    }

    protected _generateAttrToProjector() {
      let attrToProjector = super._generateAttrToProjector();

      // Copy each of the different projectors.
      let xAttr = Plot._scaledAccessor(this.x());
      let yAttr = Plot._scaledAccessor(this.y());
      let sizeAttr = Plot._scaledAccessor(this.size());

      let xScale = this.x().scale;
      let yScale = this.y().scale;
      let sizeScale = this.size().scale;

      attrToProjector["x"] = (d, i, dataset) => xAttr(d, i, dataset);

      attrToProjector["y"] = (d, i, dataset) => yAttr(d, i, dataset);

      attrToProjector["size"] = (d, i, dataset) => sizeAttr(d, i, dataset);

      // Clean up the attributes projected onto the SVG elements
      return attrToProjector;
    }


    protected _generateDrawSteps(): Drawers.DrawStep[] {
      let drawSteps: Drawers.DrawStep[] = [];
      if (this._animateOnNextRender()) {
        let resetAttrToProjector = this._generateAttrToProjector();

        let symbolProjector = Plot._scaledAccessor(this.symbol());
        resetAttrToProjector["d"] = (datum: any, index: number, dataset: Dataset) => symbolProjector(datum, index, dataset)(0);
        drawSteps.push({attrToProjector: resetAttrToProjector, animator: this._getAnimator(Plots.Animator.RESET)});
      }

      drawSteps.push({attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator(Plots.Animator.MAIN)});
      return drawSteps;
    }

    protected _entityVisibleOnPlot(pixelPoint: Point, datum: any, index: number, dataset: Dataset) {
      let xRange = { min: 0, max: this.width() };
      let yRange = { min: 0, max: this.height() };

      let diameter = Plot._scaledAccessor(this.size())(datum, index, dataset);
      let translatedBbox = {
        x: pixelPoint.x - diameter,
        y: pixelPoint.y - diameter,
        width: diameter,
        height: diameter
      };

      return Utils.DOM.intersectsBBox(xRange, yRange, translatedBbox);
    }

    protected _propertyProjectors(): AttributeToProjector {
      let propertyToProjectors = super._propertyProjectors();

      let xProjector = Plot._scaledAccessor(this.x());
      let yProjector = Plot._scaledAccessor(this.y());

      let sizeProjector = Plot._scaledAccessor(this.size());

      propertyToProjectors["transform"] = (datum: any, index: number, dataset: Dataset) =>
        "translate(" + xProjector(datum, index, dataset) + "," + yProjector(datum, index, dataset) + ")";

      let symbolProjector = Plot._scaledAccessor(this.symbol());

      propertyToProjectors["d"] = (datum: any, index: number, dataset: Dataset) =>
        symbolProjector(datum, index, dataset)(sizeProjector(datum, index, dataset));
      return propertyToProjectors;
    }

    /**
     * Gets the Entities that intersect the Bounds.
     *
     * @param {Bounds} bounds
     * @returns {PlotEntity[]}
     */
    public entitiesIn(bounds: Bounds): PlotEntity[];
    /**
     * Gets the Entities that intersect the area defined by the ranges.
     *
     * @param {Range} xRange
     * @param {Range} yRange
     * @returns {PlotEntity[]}
     */
    public entitiesIn(xRange: Range, yRange: Range): PlotEntity[];
    public entitiesIn(xRangeOrBounds: Range | Bounds, yRange?: Range): PlotEntity[] {
      let dataXRange: Range;
      let dataYRange: Range;
      if (yRange == null) {
        let bounds = (<Bounds> xRangeOrBounds);
        dataXRange = { min: bounds.topLeft.x, max: bounds.bottomRight.x };
        dataYRange = { min: bounds.topLeft.y, max: bounds.bottomRight.y };
      } else {
        dataXRange = (<Range> xRangeOrBounds);
        dataYRange = yRange;
      }
      let xProjector = Plot._scaledAccessor(this.x());
      let yProjector = Plot._scaledAccessor(this.y());
      return this.entities().filter((entity) => {
        let datum = entity.datum;
        let index = entity.index;
        let dataset = entity.dataset;
        let x = xProjector(datum, index, dataset);
        let y = yProjector(datum, index, dataset);
        return dataXRange.min <= x && x <= dataXRange.max && dataYRange.min <= y && y <= dataYRange.max;
      });
    }

    private _entityBBox(datum: any, index: number, dataset: Plottable.Dataset, attrToProjector: AttributeToProjector): SVGRect {
      return {
        x: attrToProjector["x"](datum, index, dataset),
        y: attrToProjector["y"](datum, index, dataset),
        width: 4,
        height: 4
      };
    }

    /**
     * Gets the Entities at a particular Point.
     *
     * @param {Point} p
     * @returns {PlotEntity[]}
     */
    public entitiesAt(p: Point) {
      let xProjector = Plot._scaledAccessor(this.x());
      let yProjector = Plot._scaledAccessor(this.y());
      let sizeProjector = Plot._scaledAccessor(this.size());
      return this.entities().filter((entity) => {
        let datum = entity.datum;
        let index = entity.index;
        let dataset = entity.dataset;
        let x = xProjector(datum, index, dataset);
        let y = yProjector(datum, index, dataset);
        let size = sizeProjector(datum, index, dataset);
        return x - size / 2  <= p.x && p.x <= x + size / 2 && y - size / 2 <= p.y && p.y <= y + size / 2;
      });
    }

    /**
     * Gets the accessor for labels.
     *
     * @returns {Accessor<string>}
     */
    public label(): Accessor<string>;
    /**
     * Sets the text of labels to the result of an Accessor.
     *
     * @param {Accessor<string>} label
     * @returns {Plots.Scatter} The calling Rectangle Plot.
     */
    public label(label: Accessor<string>): Plots.Scatter<X, Y>;
    public label(label?: Accessor<string>): any {
      if (label == null) {
        return this._label;
      }

      this._label = label;
      this.render();
      return this;
    }

    /**
     * Gets whether labels are enabled.
     *
     * @returns {boolean}
     */
    public labelsEnabled(): boolean;
    /**
     * Sets whether labels are enabled.
     * Labels too big to be contained in the rectangle, cut off by edges, or blocked by other rectangles will not be shown.
     *
     * @param {boolean} labelsEnabled
     * @returns {Scatter} The calling Scatter Plot.
     */
    public labelsEnabled(enabled: boolean): Plots.Scatter<X, Y>;
    public labelsEnabled(enabled?: boolean): any {
      if (enabled == null) {
        return this._labelsEnabled;
      } else {
        this._labelsEnabled = enabled;
        this.render();
        return this;
      }
    }

    protected _additionalPaint(time: number) {
      this._renderArea.selectAll(".label-area").remove();
      if (this._labelsEnabled && this.label() != null) {
        Utils.Window.setTimeout(() => this._drawLabels(), time);
      }
    }

    private _drawLabels() {
      let dataToDraw = this._getDataToDraw();
      this.datasets().forEach((dataset, i) => this._drawLabel(dataToDraw, dataset, i));
    }

    private _drawLabel(dataToDraw: Utils.Map<Dataset, any[]>, dataset: Dataset, datasetIndex: number) {
      let attrToProjector = this._generateAttrToProjector();
      let labelArea = this._renderArea.append("g").classed("label-area", true);
      let measurer = new SVGTypewriter.Measurers.Measurer(labelArea);
      let writer = new SVGTypewriter.Writers.Writer(measurer);
      let xRange = this.x().scale.range();
      let yRange = this.y().scale.range();
      let xMin = Math.min.apply(null, xRange);
      let xMax = Math.max.apply(null, xRange);
      let yMin = Math.min.apply(null, yRange);
      let yMax = Math.max.apply(null, yRange);
      let data = dataToDraw.get(dataset);
      data.forEach((datum, datumIndex) => {
//        console.log(datum, datumIndex);
        let label = "" + this.label()(datum, datumIndex, dataset);
        let x = attrToProjector["x"](datum, datumIndex, dataset);
        let y = attrToProjector["y"](datum, datumIndex, dataset);

        let notFit = true; // is label full length?
        let pass = 0; // how much have we altered the label
        let measurement = measurer.measure(label);

        while (notFit && label.length > 2) {
          let crossBorder = false; // is label reaching outside chart
          let overlap = false; // is label overlapping another?
          measurement = measurer.measure(label);
          let width = measurement.width;
          let height = measurement.height;
          let size = attrToProjector["size"](datum, datumIndex, dataset);

          // let horizontalOffset = (measurement.width) / 2;
          if (pass === 0) {
            let verticalOffset = (measurement.height) / 2;
            x += size / 2;
            y -= verticalOffset + (size / 2);
          }

          let xLabelRange = { min: x, max: x + measurement.width };
          let yLabelRange = { min: y, max: y + measurement.height };
          // do not show labels that would go outside the plot
          if (xLabelRange.min < xMin || xLabelRange.max > xMax || yLabelRange.min < yMin || yLabelRange.max > yMax) {
            // return;
            crossBorder = true;
          }
          // prevent label from obscuring another label
          if (this._overlayLabel(xLabelRange, yLabelRange, datumIndex, datasetIndex, dataToDraw, measurer)) {
            // return;
            overlap = true;
          }

//      console.log(label, crossBorder, overlap, width, xLabelRange, yLabelRange, xMin, xMax, yMin, yMax);

          if (crossBorder || overlap) {
              let final = label.slice(label.length - 1);
              let remove = 1;
              if (final === '\u2026') {
                remove = 2;
              }
              label = label.substring(0, label.length - remove).trim() + '\u2026';
          } else {
            notFit = false;
          }
          pass += 1;
        }

        let color = attrToProjector["fill"](datum, datumIndex, dataset);
        let dark = Utils.Color.contrast("white", color) * 1.6 < Utils.Color.contrast("black", color);
        let g = labelArea.append("g").attr("transform", "translate(" + x + "," + y + ")");
        let className = dark ? "dark-label" : "light-label";
        g.classed(className, true);
        writer.write(label, measurement.width, measurement.height, {
          selection: g,
          xAlign: "center",
          yAlign: "center",
          textRotation: 0
        });
      });
    }

    private _overlayLabel(labelXRange: Range, labelYRange: Range, datumIndex: number, datasetIndex: number,
                          dataToDraw: Utils.Map<Dataset, any[]>, measurer: any) {

      let attrToProjector = this._generateAttrToProjector();
      let datasets = this.datasets();
      for (let i = datasetIndex; i < datasets.length; i ++ ) {
        let dataset = datasets[i];
        let data = dataToDraw.get(dataset);
        for (let j = (i === datasetIndex ? datumIndex + 1 : 0); j < data.length ; j ++ ) {
          // get the comparison target
          let target = this._entityBBox(data[j], j, dataset, attrToProjector);
          // get its label
          let label = "" + this.label()(data[j], j, dataset);
          // measure its label
          let measurement = measurer.measure(label);

          // adjust the y pos
          target.y = target.y + target.height - measurement.height;
          // set the height
          target.height = Math.max(target.height, measurement.height);

          if (Utils.DOM.intersectsBBox(labelXRange, labelYRange, target)) {
            return true;
          }
        }
      }
      return false;
    }

  }
}
