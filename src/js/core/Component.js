class Component {
  constructor () {
    this.render();
    this.bindEvent();
  }

  render () {
    throw new Error('Please override render function');
  }

  bindEvent () {
    throw new Error('Please override bindEvent function');
  }
}
