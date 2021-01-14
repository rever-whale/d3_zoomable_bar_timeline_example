class JSTable {
  constructor (options) {
    this.width = options.width;
    this.height = options.height;
    this.margin = options.margin;
    this.data = options.data;
    this.rowCount = options.rowCount;
    this.elQuery = options.elQuery;
    this.scrollWrapperEl = options.scrollWrapperEl;
    this.y_axis_width = 100;
    this.cursor_width = 10;
    
    // Information
    this.xScale = options.xScale;
    this.xAxis = options.xAxis;
    this.barHeight = options.barHeight;
    this.preHoverRowIndex = -1;

    // Element
    this.svgElement = this.createSvgElement();
    this.tableElement = this.createTableElement();
    this.rowSeperator = this.createRowSeperators();
    this.hoverLineElement = null;
    
    // handler
    // this.bindZoomHandler();
    this.bindHoverHandler();
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
        .attr('y', d => (d.z * this.barHeight) + this.margin)
        .attr('width', d => d.y)
        .attr('height', d => d.y ? this.barHeight : 0);
  }

  createRowSeperators () {
    const dummy = Array(this.rowCount).fill(0);
    d3.select('g.table')
      .selectAll('rect.row')
      .data(dummy)
      .enter()
        .append('rect')
        .attr('class', 'row')
        .attr('data-idx', (_, i) => i)
        .attr('x', this.margin)
        .attr('y', (d, i) => i * this.barHeight + this.margin)
        .attr('width', this.width - this.margin * 2)
        .attr('height', this.barHeight)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 0.5)
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
    const rescaleX = this.getRescaleHandler(
      this.xScale,
      event.transform.rescaleX(this.xScale)
    );

    this.svgElement.selectAll("rect.bars")
      .attr("x", d => this.xScale(d.x))
      .attr("width", d => rescaleX(d.y));

    // update axis tick
    this.svgElement.selectAll('rect.row')
      .attr('x', () => this.xScale(0))
      .attr('width', () => rescaleX(this.width) - this.margin * 2);

    Observable.publish('zoom', event);
  }

  getRescaleHandler (originScale, targetScale) {
    const [min1, max1] = originScale.domain();
    const [min2, max2] = targetScale.domain();
    const scaleRate = (max1 - min1) / (max2 - min2);

    return value =>  Math.floor(value * scaleRate)
  }

  bindHoverHandler () {
    this.svgElement
      .on('mousemove', this.mouseMoveHandler.bind(this))
      .on('mouseover', this.mouseOverHandler.bind(this))
      .on('mouseout', this.mouseOutHandler.bind(this));
  }

  getLine (posArray) {
    return d3.line()(posArray);
  }

  mouseMoveHandler (event) {    
    this.hoverLineElement
      .attr('d', () => this.getLine([
        [event.x - this.cursor_width - this.y_axis_width, this.margin],
        [event.x - this.cursor_width - this.y_axis_width, (this.barHeight * this.rowCount) + this.margin]
      ]))

    const scrollTop = document.querySelector(this.scrollWrapperEl).scrollTop;
    console.log(scrollTop)
    const rowIndex = this.getRowIndexFromMousePos(event.x, event.y + scrollTop - 50);
    if (rowIndex === -1) {
        this.svgElement
          .selectAll('rect.row')
          .style('fill', 'none');
    } else if (this.preHoverRowIndex !== rowIndex) {
      this.svgElement
        .select(`rect.row[data-idx="${this.preHoverRowIndex}"]`)
        .style('fill', 'none');

      this.svgElement
        .select(`rect.row[data-idx="${rowIndex}"]`)
        .style('fill', 'rgba(0,0,0,.2)');

      this.preHoverRowIndex = rowIndex;
    } 
  }

  mouseOverHandler (event) {
    this.hoverLineElement = this.svgElement
      .append('path')
      .attr('class', 'hoverline')
      .attr('d', () => this.getLine([
        [event.x - this.cursor_width - this.y_axis_width, this.margin],
        [event.x - this.cursor_width - this.y_axis_width, (this.barHeight * this.rowCount) + this.margin]
      ]))
      .attr("stroke", "black");
  }

  mouseOutHandler () {
    this.hoverLineElement.remove();
  }

  getRowIndexFromMousePos (posX, posY) {
    const rowIndex = Math.floor((posY - this.margin) / this.barHeight);
    return (posX >= this.margin || posX < this.margin + this.width) ? rowIndex : -1;
  }
}
