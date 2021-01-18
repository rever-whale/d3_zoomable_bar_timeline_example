import JSTable from './js_table';
import JSHeader from './js_header';
import JSAxis from './js_axis';

export default class JSChart {
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
      width: this.width,
      height: 50,
      xScale: this.xScale,
      xAxis: this.xAxis,
      elQuery: '#x_axis',
    })

    new JSTable({
      ...options,
      margin: 0,
      height: this.height + 50,
      scrollWrapperEl: '#app',
      xScale: this.xScale,
      xAxis: this.xAxis,
      barHeight: this.barHeight,
      elQuery: '#table',
    })

    new JSAxis({
      ...options,
      height: this.height + 50,
      width: 100,
      barHeight: this.barHeight,
      margin: 50,
      elQuery: '#axis'
    })
  }

  /**
   * Information
   */
  createXScale () {
    const [today, tomorrow] = this.getTodayAndTomorrowTimestamp();

    return d3.scaleTime()
      .range([this.margin, this.width - this.margin])
      .domain([today, tomorrow]);
  }

  createXAxis () {
    return d3
      .axisTop(this.xScale)
      .ticks(d3.timeHour)
      .tickFormat(d3.timeFormat('%H:%M'));
  }

  /**
   * utils
   */

  getTodayAndTomorrowTimestamp () {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)

    return [new Date(), tomorrow]
  }

  getTimestamp (date) {
    return Math.floor(+date / 1000);
  }
}
