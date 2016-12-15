var rays = new Object({
   canvas: false,
   context: false,
   interval: false,
   offset: 0,
   init: function(id, colour1, colour2){
      this.canvas = document.getElementById(id);
      this.context = this.canvas.getContext('2d');
      this.canvas.style.background = colour1;
      this.context.fillStyle = colour2;
      clearInterval(this.interval);
      this.interval = setInterval(function(){
         rays.offset += 0.005;
         rays.draw();
      }, 100);
      this.draw();
   },
   getXY: function(x, y, d, a){
      return {
         x: x + d * Math.cos(a),
         y: y + d * Math.sin(a)
      };
   },
   draw: function(){
      c = this.canvas;
      this.context.clearRect(0, 0, c.width, c.height);
      length = Math.max(c.width, c.height);
      midx = c.width / 2, midy = c.height / 2;

      var d = 12;
      for(i = 0;i < d;i++){
         angle = (Math.PI * 2 / d) * i + this.offset;
         this.context.moveTo(midx, midy);
         c1 = this.getXY(midx, midy, length, angle + d / 100);
         this.context.lineTo(c1.x, c1.y);
         c2 = this.getXY(midx, midy, length, angle - d / 100);
         this.context.lineTo(c2.x, c2.y);
         this.context.lineTo(midx, midy);
         this.context.fill();
      };
      
      this.context.beginPath();
      this.context.arc(midx, midy, c.width * c.height / 20000,
	     0, Math.PI * 2, true);
      this.context.closePath();
      this.context.fill();
   }
});