class JSChart {
  constructor (options) {
    this.width = options.width;
    this.height = options.height;
    this.margin = options.margin;
    this.data = options.data;
    this.rowCount = options.rowCount;
    this.elQuery = options.elQuery;
    
    // Information
    this.xScale = this.createXScale();
    this.xAxis = this.createXAxis();
    this.barHeight = 50;


    new JSHeader({
      ...options,
      margin: 50,
      width: 1800,
      height: 50,
      xScale: this.xScale,
      xAxis: this.xAxis,
      elQuery: '#x_axis',
    })

    new JSTable({
      ...options,
      margin: 0,
      xScale: this.xScale,
      xAxis: this.xAxis,
      barHeight: this.barHeight,
      elQuery: '#table',
    })
  }

  /**
   * Information
   */
  createXScale () {
    // const xMax = d3.max(this.data, d => d.x);
    return d3.scaleLinear()
      .range([VIEW_BOX.margin, VIEW_BOX.width - VIEW_BOX.margin])
      .domain([0, 100]);
  }

  createXAxis () {
    return d3
      .axisTop(this.xScale)
      .ticks(this.width / 40);
  }
}
