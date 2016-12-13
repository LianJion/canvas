$(function(){

  var canvas = $("#paper")[0], 
      c = canvas.getContext("2d"), 
      size = canvas.width,
      halfSize = size / 2,
      trails = $("<canvas>")[0], 
      ct = trails.getContext("2d"),
      TWO_PI = Math.PI * 2,
      drawingThings = [new DrawingThing(200, 55), 
                       new DrawingThing(400, 55), 
                       new DrawingThing(200, 145), 
                       new DrawingThing(400, 145)];

  trails.width = trails.height = size;
  ct.fillStyle = "black";
  ct.fillRect(0, 0, size, size);

  function DrawingThing(x, y){
    this.x = x;
    this.y = y;
    this.num = 3;
    this.radii = [10 , 30, 40];
    this.thetas = [Math.random() * TWO_PI,
                   Math.random() * TWO_PI, 
                   Math.random() * TWO_PI];
    this.thetasInc = [Math.random() * 0.2 - 0.1, 
                      Math.random() * 0.2 - 0.1, 
                      Math.random() * 0.2 - 0.1];
  }
  DrawingThing.prototype.draw = function(){
    ct.strokeStyle = "rgba(255,255,255,0.1)";
    for (var i = 0; i < this.num; i++){
      var x = this.x + this.radii[i] * Math.cos(this.thetas[i]), 
          y = this.y + this.radii[i] * Math.sin(this.thetas[i]);

      if (i == 0){
        ct.beginPath();
        ct.moveTo(x, y);
      }else{
        ct.lineTo(x, y);
      }
      c.strokeStyle = "#";
      c.fillStyle = "#33FFDD"
      c.beginPath();
      c.arc(this.x, this.y, this.radii[i], 0, TWO_PI, false);
      c.stroke();

      c.beginPath();
      c.arc(x, 
            y,
            2, 0, TWO_PI, false);
      c.fill();
      this.thetas[i] += this.thetasInc[i];
    }
    ct.closePath();
    ct.stroke();
  };

  setInterval(function(){
    c.drawImage(trails, 0, 0);
    for (var i = 0; i < drawingThings.length; i++){
      drawingThings[i].draw();
    }

  }, 30);

});