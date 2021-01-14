class JSChart {
  constructor (options) {
    this.width = options.width;
    this.height = options.height;
    this.margin = options.margin;
    this.data = options.data;
    
    // Information
    this.xScale = this.createXScale();
    this.xAxis = this.createXAxis();

    // Element
    this.svgElement = this.createSvgElement();
    this.xAxisElement = this.createXAxisElement();
    this.tableElement = this.createTableElement();
    
    // handler
    this.bindZoomHandler();
  }

  /**
   * Information
   */
  createXScale () {
    const xExtent = d3.extent(this.data, d => d.x);

    return d3.scaleLinear()
      .range([VIEW_BOX.margin, VIEW_BOX.width - VIEW_BOX.margin])
      .domain(xExtent);
  }

  createXAxis () {
    return d3
      .axisTop(this.xScale)
      .ticks(this.width / 40);
  }

  /**
   * Element
   */
  createSvgElement () {
    return d3
      .select('body')
      .append('svg')
      .attr('width', VIEW_BOX.width)
      .attr('height', VIEW_BOX.height)
  }

  createXAxisElement () {
    return this.svgElement
      .append('g')
        .attr('class', 'axis_x')
        .attr('transform', `translate(0,${this.margin})`)
        .call(this.xAxis);
  }

  createTableElement () {
    const table = this.svgElement
      .append('g')
      .attr('class', 'table');
    
    return table
      .selectAll('rect')
      .data(this.data)
      .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('x', d => this.xScale(d.x))
        .attr('y', this.margin)
        .attr('width', d => d.y)
        .attr('height', d => d.y ? 100 : 0);
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
        .scaleExtent([1, 5])
        .translateExtent(zoomExtent)
        .extent(zoomExtent)
        .on("zoom", this.zoomHandler.bind(this))
    )
  }

  zoomHandler (event) {
    const rescaleX = this.getRescaleHandler(
      this.xScale,
      event.transform.rescaleX(this.xScale)
    );
    
    this.xScale.range([this.margin, this.width - this.margin].map(d => event.transform.applyX(d)));
    this.svgElement.selectAll("rect.bars")
      .attr("x", d => this.xScale(d.x))
      .attr("width", d => rescaleX(d.y));

    // update axis tick
    this.xAxis.ticks(this.xAxisElement.node().getBBox().width / 40);
    this.xAxisElement.call(this.xAxis);
  }

  getRescaleHandler (originScale, targetScale) {
    const [min1, max1] = originScale.domain();
    const [min2, max2] = targetScale.domain();
    const scaleRate = (max1 - min1) / (max2 - min2);

    return value =>  Math.floor(value * scaleRate)
  }
}
