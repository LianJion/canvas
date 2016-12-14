 
var canvas= document.getElementById("s");
    ctx = canvas.getContext('2d');
    canvas.width= window.innerWidth;
    canvas.height=window.innerHeight;


 //立即执行函数 ,草
(function() {
  //Grass方法
  Grass = function() {
    return this;
  };
  
  Grass.prototype= {
      
    
    alto_hierba: 0,    // grass height 草的高度
    maxAngle:    0,    // maximum grass rotation angle (wind movement)
    angle:       0,    // construction angle. thus, every grass is different to others  
    coords:      null,  // quadric bezier curves coordinates 二次贝塞尔曲线，参数是一个控制点，一个描点
    color:       null,  // grass color. modified by ambient component. 周边的组件影响草的颜色
    offset_control_point:   3,    // grass base width. greater values, wider at the basement.

    //initialize函数的参数有canvasWidth, canvasHeight, minHeight, maxHeight, angleMax, initialMaxAngle
    initialize : function(canvasWidth, canvasHeight, minHeight, maxHeight, angleMax, initialMaxAngle)  {

      // grass start position
      var sx= Math.floor( Math.random()*canvasWidth );
      var sy= canvasHeight;
      
      // quadric curve middle control point. higher values means wider grass from base to peak.
      // try offset_control_x=10 for thicker grass.
      // var offset_control_x=1.5;  
      var offset_control_x=1.5;
      //亲测10和1.5没啥区别    
      
      //草的高度是 最小高度，最大高度随机值的和
      this.alto_hierba= minHeight+Math.random()*maxHeight;
      // 最大角度是 angleMax参数的随机值+10
      this.maxAngle= 10 + Math.random()*angleMax;
      //初始化最大角度
      // (Math.random()<0.5?1:-1)// 随机值如果小于0.5，那么就是1,大于0.5，就是-1）
      //(Math.PI/180)//转为弧度制
      this.angle= Math.random()*initialMaxAngle*(Math.random()<0.5?1:-1)*Math.PI/180;

      // hand crafted value. modify offset_control_x to play with grass curvature slope.
      var csx= sx-offset_control_x ;

      // grass curvature. greater values make grass bender. 
      // try with:  
      //        var csy= sy-this.alto_hierba;  -> much more bended grass.
      //        var csy= sy-1;                 -> totally unbended grass.
      //        var csy= sy-this.alto_hierba/2;-> original. good looking grass.
      var csy= 0;
      //随机值判断
      if ( Math.random()<0.1 ) {
        csy= sy-this.alto_hierba;
      } else {
        csy= sy-this.alto_hierba/2;
      }
          
      /**
       I determined that both bezier curves that conform each grass should have
       the same middle control point to be parallel.
       You can play with psx/psy adding or removing values to slightly modify grass
       geometry.
      **/
      //var csx= sx-offset_control_x ; 前面有写
      var psx= csx;
      // changed var psy= csy; to
      var psy= csy-offset_control_x;
          
      // the bigger offset_control_point, the wider on its basement.
      this.offset_control_point=3;
      var dx= sx+this.offset_control_point;
      var dy= sy;      
      
      //4个坐标
      this.coords= [sx,sy,csx,csy,psx,psy,dx,dy];
          
      // grass color.
      this.color= [16+Math.floor(Math.random()*32),
                   100+Math.floor(Math.random()*155),
                   16+Math.floor(Math.random()*32) ];
      
    },
    
    /**
     * paint every grass.
     * @param ctx is the canvas2drendering context
     * @param time for grass animation.
     * @param ambient parameter to dim or brighten every grass.
     * @returns nothing
     */
    paint : function(ctx,time,ambient) {

          ctx.save();
          
          // grass peak position. how much to rotate the peak.
          // less values (ie the .0005), will make as if there were a softer wind.
          var inc_punta_hierba= Math.sin(time*0.0005);
          
          // rotate the point, so grass curves are modified accordingly. If just moved horizontally, the curbe would
          // end by being unstable with undesired visuals. 
          var ang= this.angle + Math.PI/2 + inc_punta_hierba * Math.PI/180*(this.maxAngle*Math.cos(time*0.0002));


          var px= this.coords[0] + this.offset_control_point + this.alto_hierba*Math.cos(ang);
          var py= this.coords[1] - this.alto_hierba*Math.sin(ang);
    
          var c= this.coords;
      
          ctx.beginPath();
          ctx.moveTo( c[0], c[1] );
          //这不对吧？怎么是立方贝塞尔了？怪不得是三维效果，4个坐标，尼玛，（x,y,z,w）
          // ctx.bezierCurveTo(c[0], c[1], c[2], c[3], px, py);
       
          ctx.quadraticCurveTo(c[2], c[3], px, py);
          ctx.bezierCurveTo(px, py, c[4], c[5], c[6], c[7]);
          //以(px, py)为起点，绘制二维贝塞尔曲线
          // ctx.quadraticCurveTo(c[4], c[5], c[6], c[7]);

          ctx.closePath();
          ctx.fillStyle='rgb('+
              Math.floor(this.color[0]*ambient)+','+
              Math.floor(this.color[1]*ambient)+','+
              Math.floor(this.color[2]*ambient)+')';
          ctx.fill();

          ctx.restore();
            
    }  
  };
})();



(function() {
  Garden= function() {
    return this;
  };
  
  Garden.prototype= {
    //草的渐变，主要是时间的问题，没有这个Graden，画出来的草就一直闪一直闪
    grass:      null,
    ambient:    1,
    width:      0,
    height:      0,
    
    initialize : function(width, height, size)  {
      this.width= width;
      this.height= height;
      //这里有grass数组
      this.grass= [];
      
      for(var i=0; i<size; i++ ) {
        //g是对象
        var g= new Grass();
        g.initialize(
            width,
            height,
            50,      // min grass height 
            height*2/3, // max grass height
            20,     // grass max initial random angle 
            40      // max random angle for animation 
            );
        this.grass.push(g);
      }
      
    },
    
    paint : function(ctx, time){
      ctx.save();
        ctx.globalAlpha= 1;
        var i;
        //绘制草
        for(i=0; i<this.grass.length; i++ ) {
          this.grass[i].paint(ctx,time,this.ambient);
        }
      ctx.restore();
    }
  };
})();



function drawGrass(time) {

  var i;
  var grass= [];
  var grassnum = 30;

  for(var i=0; i < grassnum; i++ ) {
    //g是对象
    var g= new Grass();
    g.initialize(
      canvas.width,
      canvas.height,
      50,      // min grass height 
      canvas.height*2/3, // max grass height
      20,     // grass max initial random angle 
      40      // max random angle for animation 
      );
    grass.push(g);
  }
      
  for(i=0; i<grass.length; i++ ) {
    grass[i].paint(ctx,time,1);
  }
}


function init(images) {

  garden= new Garden();
  //第三个参数是草的数量 300
  garden.initialize(canvas.width, canvas.height, 300);
  time= new Date().getTime();
  //每隔30s执行一次_doit函数
  interval = setInterval(_doit, 30);
}


function _doit() {
 
  ctx.fillRect(0,0,canvas.width,canvas.height);
  var ntime= new Date().getTime();
  var elapsed= ntime-time;
  garden.paint( ctx, elapsed );
  //paint函数里绘制了草，所以这句一定要
  // drawGrass(elapsed);
}

window.addEventListener('load',init(null),false);