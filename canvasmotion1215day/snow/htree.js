//H-tree
function Htree(canvas){
    this.canvas = document.getElementById('canvas');
    this.canvas.ctx = this.canvas.getContext('2d');
    this.canvas.ctx.strokeStyle = 'black';
    this.canvas.ctx.lineCap = 'round';
    // ratio比率
    this.max_ratio = 3;
    this.min_ratio = 1.41;
    this.ratio = (this.min_ratio);
    
    // PI：180°
    this.max_angle = Math.PI/2;
    this.angle = Math.PI/5;
    
    this.max_order = 10;
    this.order_colors = Gradient("#D4E576","#126845",this.max_order+1);
    // this.start_length = this.canvas.height/3.25;  //144.6
    this.start_length = this.canvas.height/3.25;
    this.start_width = 15;        
    
    this.previous = {x:0,y:0};
}

Htree.prototype = {
    // update的参数是canvas页面传进来的
    update: function(pos,x,y){
        this.updateAngle(pos);
        this.updateRatio(pos);
        // 调用了更新后的角度和比值，再进行绘制
        this.draw(x,y);
    },
    updateAngle: function(pos){

        var x = -Math.abs(pos.x - (this.canvas.width/2)),
            y = pos.y - (this.canvas.height-this.start_length);
            // atan返回正切值为指定数字的角度,然后算出偏移角度
        this.angle = (Math.PI/2) - Math.atan(y/x);
    },
    updateRatio: function(pos){
        var x = pos.x - (this.canvas.width/2),
            y = pos.y - (this.canvas.height-this.start_length),
            // sqrt开根号，this.min_ratio=1.41，this.max_ratio=3 ,this.max_ratio-this.min_ratio=1.59
            //当绘制主躯干的适合Math.sqrt((x*x)+(y*y))/(this.canvas.width/2)>1
            d = Math.min(1,Math.sqrt((x*x)+(y*y))/(this.canvas.width/2));
        this.ratio = ((this.max_ratio-this.min_ratio)*(1-d)) + this.min_ratio;
        //不明白为啥要这样写
        // console.log(this.ratio);
    },
    draw: function(x,y){
        
        // draw the trunk of the tree.画出树的躯干
        this.canvas.ctx.save();

            //把原点（0，0）移动到底部中点
            // this.canvas.ctx.translate(this.canvas.width/2,this.canvas.height-55);
            
            this.canvas.ctx.translate(x,y);
            // (325,470)

              //actually draw the trunk.
              this.canvas.ctx.strokeStyle = this.order_colors[0];
              this.drawBranch(this.start_length,this.start_width);
              // (144.6,15)        
            
            this.canvas.ctx.save();
                this.canvas.ctx.translate(0,-this.start_length);
                // (0,-144.6)
                this.drawBranches(1);
            this.canvas.ctx.restore();     
            
        this.canvas.ctx.restore();
    },
    drawBranch: function(length, width){
        this.canvas.ctx.lineWidth = (!width || width<1)?1:width;
        this.canvas.ctx.beginPath();  
        this.canvas.ctx.moveTo(0,0);
        this.canvas.ctx.lineTo(0,-length);
        this.canvas.ctx.stroke();
    },
    // 按照次序来绘制分叉，递归函数
    drawBranches: function(order){

      // 设置this.ratio的默认最小值是1.41
      var ratio = Math.pow(this.ratio,order),
          // this.start_length=144.6，this.start_width=15
          new_length = this.start_length/ratio,
          new_width = this.start_width/ratio;
      
      
      if(new_length < 3 || order > this.max_order){
          return;
      }
      
      this.canvas.ctx.strokeStyle = this.order_colors[Math.floor(order)];
      //this.canvas.ctx.strokeStyle = this.order_colors[8];
      
      //draw the right branch
      this.canvas.ctx.save();
          // 起初旋转角度Math.PI/5 ，36°
          this.canvas.ctx.rotate(this.angle);
      
          this.drawBranch(new_length,new_width);
      
          this.canvas.ctx.save();
              this.canvas.ctx.translate(0,-new_length);
              // order逐渐增加
              this.drawBranches(order+1);
          this.canvas.ctx.restore();
          
      this.canvas.ctx.restore();
        
      //draw the left branch
      this.canvas.ctx.save();
          this.canvas.ctx.rotate(-this.angle);
      
          this.drawBranch(new_length,new_width);
      
          this.canvas.ctx.save();
              this.canvas.ctx.translate(0,-new_length);
              this.drawBranches(order+1)
          this.canvas.ctx.restore();
      
      this.canvas.ctx.restore();
    }
};
