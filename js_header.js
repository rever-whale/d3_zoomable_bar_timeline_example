class JSHeader {
  constructor (options) {
    this.width = options.width;
    this.height = options.height;
    this.margin = options.margin;
    this.data = options.data;
    this.rowCount = options.rowCount;
    this.elQuery = options.elQuery;
    
    // Information
    this.xScale = options.xScale;
    this.xAxis = options.xAxis;

    // Element
    this.svgElement = this.createSvgElement();
    this.xAxisElement = this.createXAxisElement();
    
    // handler
    this.bindZoomHandler();
  }

  /**
   * Element
   */
  createSvgElement () {
    return d3
      .select(this.elQuery)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('overflow', 'scroll')
  }

  createXAxisElement () {
    return this.svgElement
      .append('g')
        .attr('class', 'axis_x')
        .attr('transform', `translate(0,${this.margin})`)
        .call(this.xAxis);
  }


  /**
   * handler
   */
  bindZoomHandler () {
    const zoomExtent = [
      [0, 0], 
      [this.width, this.height]
    ];

    this.svgElement.call(
      d3
        .zoom()
        .scaleExtent([1, 10])
        .translateExtent(zoomExtent)
        .extent(zoomExtent)
        .on("zoom", this.zoomHandler.bind(this))
    )
  }

  zoomHandler (event) {    
    this.xScale.range([0, this.width - 0].map(d => event.transform.applyX(d)));

    // update axis tick
    this.xAxis.ticks(this.xAxisElement.node().getBBox().width / 40);
    this.xAxisElement.call(this.xAxis);
  }
}
