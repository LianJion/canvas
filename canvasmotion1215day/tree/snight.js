//grass originally by Roman Taraban

var canvas   = document.getElementById("canapea"),
    ctx      = canvas.getContext('2d'),
    stack    = [],
    pausedGrass = false,
    w        = window.innerWidth,
    h        = window.innerHeight;

canvas.width = w;
canvas.height = h;



var drawer = function(){
  //originally made background white
  //ctx.fillStyle="#222";
  if (!pausedGrass) {
    ctx.clearRect(0,0,w,h);
    //开始遍历stack里面的anim函数
    stack.forEach(function(el){
      el();  
    })
  }
 
  requestAnimationFrame(drawer);
}


var anim = function(){
  //设置x,y的参数
  var x = 0, y = 0;
  //tallness of blades * variable + min 
  var maxTall = Math.random()*(h/8)+(h/8);
  //thickness of bladess
  var maxSize = Math.random()*(h/100)+5;
  //speed of blade growth
  var speed = Math.random()*1;  
  var position = Math.random()*w-w/2;
  //获取绿颜色的随机值
  var c = function(l,u){return Math.round(Math.random()*(u||255)+l||0);}
  
  //color of grass   
  var color = 'rgb('+c(125,50)+','+c(225,80)+','+c(80,50)+')';
  return function(){
    
    //how fast + far the blades bend  deviation背离
    var deviation = Math.cos(x/50)*Math.min(x/4,50),
        tall = Math.min(x/2,maxTall),
        size = Math.min(x/50,maxSize);
    //x值进行变化
    x+=speed;
    ctx.save();
    
      ctx.strokeWidth=10;
      ctx.translate(w/2+position, h)
      ctx.fillStyle=color;
      
      ctx.beginPath();
      ctx.lineTo(-size,0);
      //一个控制点，一个描点
      //哈哈哈哈哈，这个草好看多了，三次贝塞尔曲线太给力！
      ctx.bezierCurveTo(-size,0, -size-1,-tall-tall/4, deviation,-tall)
      ctx.bezierCurveTo(deviation,-tall, -size-1, -tall-1-tall/4, -size+3,0 );

      // ctx.quadraticCurveTo(-size,-tall/2,deviation,-tall);
      // ctx.quadraticCurveTo(size,-tall/2,size,0);
      //使用路径显示不了，要用fill()
      ctx.fill();
    
    ctx.restore()
  }    
};

         
         
 // //以(px, py)为起点，绘制二维贝塞尔曲线
 // ctx.quadraticCurveTo(c[4], c[5], c[6], c[7]);

//number of blades it makes，绘制多少草
for(var x = 0; x<(w/7);x++) {
  //把anim()都放到stack里了
  stack.push(anim());
}

//控制草长停的按钮
// var animateGrassButton = document.getElementById('animateGrassButton');
// animateGrassButton.onclick = function (e) {
//   pausedGrass = pausedGrass ? false : true;

//   // requestNextAnimationFrame(draw);
//   if (pausedGrass) {
//     animateGrassButton.value = '长';
//   }
//   else {
//     animateGrassButton.value = '停';
//   }
// };


// 粒子不用看
/*
Bouncing Balls orignally by Rob Glazebrook
Added glow, changed size, color and speed
*/

  // drawer();


// var particles = [],
//     //number of particles
//     particleCount = 200;
//     Particle = function(x,y) {     
//       this.x = x;
//       this.y = y;
      
      
      
//       //size of particles 
//       this.radius = random(1,5);
      
//       //colors red,green,blue,transparancy 
//       this.rgba = 'rgba('+floor(random(240,245))+','+floor(random(219,245))+','+floor(random(140,144))+','+random(.2,.8)+')';
      
//       //changes speed of particle
//       this.vx = random(-.5,.5);
//       this.vy = random(-.5,.5);
      
//       // Draw our particle to the canvas.
//       this.draw = function(ctx) {
//         ctx.fillStyle = this.rgba;
//         ctx.beginPath();
//         ctx.arc(this.x,this.y,this.radius,0,TWO_PI);
//         ctx.fill();
        
//         //adds blinking glow
//         ctx.shadowBlur = random(15,30);
//         //glow color
//         ctx.shadowColor = "white";
//       };
      
//       // Update our position. 
//       this.update = function(ctx) {
      
//         this.x += this.vx;
//         this.y += this.vy;
//         // Bounce off edges.
//         if(this.x + this.radius > ctx.width) {
//           this.vx *= -1;
//           this.x = ctx.width - this.radius;
//         }
//         if(this.x - this.radius < 0) {
//           this.vx *= -1;
//           this.x = this.radius;
//         }
//         if(this.y + this.radius > ctx.height) {
//           this.vy *= -1;
//           this.y = ctx.height - this.radius;
//         }
//         if(this.y - this.radius < 0) {
//           this.vy *= -1;
//           this.y = this.radius;
//         }        
//       }
//     };

// var sketch = Sketch.create({
//   setup: function() {
//     var i = particleCount;
//     while(i--) {
//       var p = new Particle(random(0, this.width),random(0, this.height));
//       particles.push(p);
//     }
//   },
//   update: function() {
//     var i = particleCount;
//     while(i--) { 
//       particles[i].update(this);
//     }
//   },
//   draw: function() {
//     var i = particleCount;
//     while(i--) {
//       particles[i].draw(this);
//     }
//   }
// });



