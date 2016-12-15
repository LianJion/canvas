//koch曲线
function Koch(canvas){
    this.canvas = document.getElementById('canvas');
    this.canvas.ctx = this.canvas.getContext('2d');
    this.canvas.ctx.strokeStyle = 'black';
    this.canvas.ctx.lineCap = 'round';
    var i;
    this.min_lw = 0.5;
    this.max_lw = 5;
    
    this.base_width = this.canvas.width*0.15;
    
    this.max_order = 5;
    this.min_order = 0;
    this.desired_order = 3;
    
    this.order_colors = Gradient("#6B92B9","#EAF0F0",this.max_order+1);
    
    this.ratio = 1/3;
    
    this.ratios = [];
    this.widths = [];
    this.peak_xs = [];
    this.peak_ys = [];
    for(i=this.min_order; i<=this.max_order; i++){
        this.ratios[i] = Math.pow(this.ratio,i);
        this.widths[i] = this.base_width*this.ratios[i];
        this.peak_xs[i] = this.widths[i]/2;
        this.peak_ys[i] = -Math.sqrt(3)*this.peak_xs[i]*this.ratio;
    }
    

    this.circle = {
        x: 100, 
        y: 100, 
        velocityX: 3*Math.random(), 
        velocityY: 3*Math.random(), 
        radius: 50*Math.random(),
    }
    
    this.min_angle = 0;
    this.max_angle = Math.PI/3;
    this.angle = Math.PI;

    //这里的参数可以修改,没什么用了，我自己替换成传参数了
    this.x_offset = (this.canvas.width-this.base_width)/2 - 63;
    this.y_offset = (this.canvas.height-( Math.sqrt(3)*(this.base_width*this.ratio)/1.2 )) +15;
    console.log(this.y_offset);
}

Koch.prototype = {
    update: function(pos,x,y){
        this.updateOrder(pos,x);
        this.init(x,y);
    },
    updateOrder: function(pos,m){
        var x = Math.min((pos.x - m)/this.base_width,1);
        x = (x<0)?0:x;
        this.desired_order = (this.max_order*x)+this.min_order;
    },
    init: function(x,y){
        var whole = Math.floor(this.desired_order),
            frac = this.desired_order - whole;
        
        //based on desired order calculate the line width
        this.canvas.ctx.lineWidth = ((this.max_lw-this.min_lw)*( (this.max_order-this.desired_order)/(this.max_order-this.min_order) ))+this.min_lw; 
        
        //we can also calculate stuff for the final triangle
        this.final_angle = (frac*this.max_angle) || this.max_angle;
        this.final_peak_y = -Math.tan(this.final_angle)*this.widths[whole+((frac==0)?0:1)]/2;
        this.final_side_width = (this.widths[whole+((frac==0)?0:1)]/2)/Math.cos(this.final_angle);
        
        this.canvas.ctx.save();
            this.canvas.ctx.strokeStyle = this.order_colors[whole];
            console.log(whole);
            //当达到最大值的时候，直接将透明度设置为0
            if(whole == this.max_order){
                this.canvas.ctx.globalAlpha = 0;
            }
            // this.canvas.ctx.translate(this.x_offset,this.y_offset);
            this.canvas.ctx.translate(x,y);
            //因为这里进行了旋转变化，所以传入的x不再是koch曲线的坐标。而是koch取消右边点的坐标
            this.canvas.ctx.rotate(this.angle);
            this.draw(0);

        this.canvas.ctx.restore();
    },
    drawLine: function(length){
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(0,0);
        this.canvas.ctx.lineTo(length,0);
        this.canvas.ctx.stroke();
    },
    draw: function(current_order){
        var next_order = current_order+1,
            angle = this.max_angle,
            peak_x = this.peak_xs[current_order],
            peak_y = this.peak_ys[current_order],
            side_width = this.widths[current_order];
        
        if((next_order) >= this.desired_order){
            //set a new angle.
            angle = this.final_angle;
            
            //reset the peak height;
            peak_y = this.final_peak_y;
            
            //reset the side width;
            side_width = this.final_side_width;
            
        }
        
        if(this.desired_order == 0){
            this.drawLine(this.widths[0]);
            return;
        }
        
        //draw the left side
        if((next_order) >= this.desired_order){
            this.drawLine(this.widths[next_order]);
        }else{
            this.draw(next_order);
        }
        
        //draw the left side of the triangle
        this.canvas.ctx.save();
            this.canvas.ctx.translate(this.widths[next_order],0);
            this.canvas.ctx.rotate(-angle);
            if((next_order) >= this.desired_order){
                this.drawLine(side_width);
            }else{
                this.draw(next_order);
            }
        this.canvas.ctx.restore();
        
        
        // draw the right side of the triangle
        this.canvas.ctx.save();
            this.canvas.ctx.translate(peak_x,peak_y);
            this.canvas.ctx.rotate(angle);
            if((next_order) >= this.desired_order){
                this.drawLine(side_width);
            }else{
                this.draw(next_order);
            }
        this.canvas.ctx.restore();
        
        
        
        //draw the right side
        this.canvas.ctx.save();
            this.canvas.ctx.translate(this.widths[next_order]*2,0);
            if((next_order) >= this.desired_order){
                this.drawLine(this.widths[next_order]);
            }else{
                this.draw(next_order);
            }
        this.canvas.ctx.restore();

      
        return false;
    }
}
