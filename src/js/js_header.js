import Observable from './Observable';

export default class JSHeader {
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

    Observable.subscribe('zoom', this.zoomHandler.bind(this));
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
  zoomHandler (event) {    
    this.xScale.range([0, this.width - 0].map(d => event.transform.applyX(d)));
    
    const {k:zoomScale} = event.transform;
    if (zoomScale > 5) {
      this.xAxis.ticks(d3.timeMinute.every(10));
    } else if (zoomScale > 4) {
      this.xAxis.ticks(d3.timeMinute.every(15));
    } else if (zoomScale > 2) {
      this.xAxis.ticks(d3.timeMinute.every(30));
    } else {
      this.xAxis.ticks(d3.timeHour);
    }
    
    this.xAxisElement.call(this.xAxis);
  }
}
