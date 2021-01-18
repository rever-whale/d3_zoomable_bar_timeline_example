import JSChart from './js_chart';

const rowCount = 15;
const barHeight = 50;
const VIEW_BOX = {
  width: 1000,
  height: rowCount * barHeight,
  margin: 0,
}

function mockGenerator (length = 10) {
  return Array(length).fill(0).map(() => ({
    x: Date.now() + Math.floor(Math.random() * 1e8),
    y: Math.floor(Math.random() * 10),
    z: Math.floor(Math.random() * rowCount),
  }));
}

const data = mockGenerator(20);
console.log(data);
new JSChart({
  ...VIEW_BOX,
  data,
  rowCount,
  elQuery: '#table'
});
