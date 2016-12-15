// jquery.lightning plugin homepage: http://www.binpress.com/app/jquery-lightning/3357
var l = $('.lightning');
l.lightning('start', {
  points: [
    {
      x: 20+Math.random()*l.width(),
      y: 10+Math.random()*l.height()
    },
    {
      x: l.width() - 50,
      y: l.height() - 50
    }
  ],
  behavior: 'fade',
  fadeDelay: 2000,
  fadeRebirth: true,
  lineWidth: 5,
  minSegmentLength: 10*Math.random(),
  branchProbability: 1,
  branchProbabilityReduceRate: 0.1,
  branchMaxAngle: 30,
  opacityReduceRate: 0.3,
  maxSegmentOffset: 50,
  minSegmentOffset: 30,
  numBolts: 1,
  addBoltsInterval: 0,
  width: l.width(),
  height: l.height(),
  canvasStyle: {
    zIndex: 0
  }
});