/*=============================================================================*/  
/* Canvas Lightning v1
/*=============================================================================*/
var canvasLightning = function(c, cw, ch){
  
/*=============================================================================*/  
/* Initialize
/*=============================================================================*/
  this.init = function(){
    if (paused) {
      this.loop();
    } else {
      console.log("a");
    }
  };    
  
/*=============================================================================*/  
/* Variables
/*=============================================================================*/
  var _this = this;
  this.c = c;
  this.ctx = c.getContext('2d');
  this.cw = cw;
  this.ch = ch;
  this.mx = 0;
  this.my = 0;
  
  this.lightning = [];
  this.lightTimeCurrent = 0;
  this.lightTimeTotal = 50;
  
/*=============================================================================*/  
/* Utility Functions
/*=============================================================================*/        
this.rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);};
this.hitTest = function(x1, y1, w1, h1, x2, y2, w2, h2){return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);};
  
/*=============================================================================*/ 
/* Create Lightning
/*=============================================================================*/
  this.createL= function(x, y, canSpawn){         
    this.lightning.push({
      x: x,
      y: y,
      xRange: this.rand(5, 30),
      yRange: this.rand(5, 25),
      path: [{
        x: x,
        y: y  
      }],
      pathLimit: this.rand(10, 35),
      canSpawn: canSpawn,
      hasFired: false
    });
  };
  
/*=============================================================================*/ 
/* Update Lightning
/*=============================================================================*/
  this.updateL = function(){
    var i = this.lightning.length;
    while(i--){
      var light = this.lightning[i];            
      
      
      light.path.push({
        x: light.path[light.path.length-1].x + (this.rand(0, light.xRange)-(light.xRange/2)),
        y: light.path[light.path.length-1].y + (this.rand(0, light.yRange))
      });
      
      if(light.path.length > light.pathLimit){
        this.lightning.splice(i, 1)
      }
      light.hasFired = true;
    };
  };
  
/*=============================================================================*/ 
/* Render Lightning
/*=============================================================================*/
  this.renderL = function(){
    var i = this.lightning.length;
    while(i--){
      var light = this.lightning[i];
      
      this.ctx.strokeStyle = 'hsla(0, 100%, 100%, '+this.rand(10, 100)/100+')';
      this.ctx.lineWidth = 1;
      if(this.rand(0, 30) == 0){
        this.ctx.lineWidth = 2; 
      }
      if(this.rand(0, 60) == 0){
        this.ctx.lineWidth = 3; 
      }
      if(this.rand(0, 90) == 0){
        this.ctx.lineWidth = 4; 
      }
      if(this.rand(0, 120) == 0){
        this.ctx.lineWidth = 5; 
      }
      if(this.rand(0, 150) == 0){
        this.ctx.lineWidth = 6; 
      } 
      
      this.ctx.beginPath();
      
      var pathCount = light.path.length;
      this.ctx.moveTo(light.x, light.y);
      for(var pc = 0; pc < pathCount; pc++){  
        
        this.ctx.lineTo(light.path[pc].x, light.path[pc].y);
        
        if(light.canSpawn){
          if(this.rand(0, 100) == 0){
            light.canSpawn = false;
            this.createL(light.path[pc].x, light.path[pc].y, false);
          } 
        }
      }
      
      //闪屏颜色
      if(!light.hasFired){
        this.ctx.fillStyle = 'rgba(255, 255, 255, '+this.rand(4, 12)/100+')';
        this.ctx.fillRect(0, 0, this.cw, this.ch);  
      }
      
      if(this.rand(0, 30) == 0){
        this.ctx.fillStyle = 'rgba(255, 255, 255, '+this.rand(1, 3)/100+')';
        this.ctx.fillRect(0, 0, this.cw, this.ch);  
      } 
      
      this.ctx.stroke();
    };
  };
  
/*=============================================================================*/ 
/* Lightning Timer
/*=============================================================================*/
  this.lightningTimer = function(){
    this.lightTimeCurrent++;
    if(this.lightTimeCurrent >= this.lightTimeTotal){
      var newX = this.rand(100, cw - 100);
      var newY = this.rand(0, ch / 2); 
      var createCount = this.rand(1, 3);
      while(createCount--){             
        this.createL(newX, newY, true);
      }
      this.lightTimeCurrent = 0;
      this.lightTimeTotal = this.rand(30, 100);
    }
  }
    
/*=============================================================================*/ 
/* Clear Canvas
/*=============================================================================*/
  this.clearCanvas = function(){
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'rgba(0,0,0,'+this.rand(1, 30)/100+')';
    this.ctx.fillRect(0,0,this.cw,this.ch);
    this.ctx.globalCompositeOperation = 'source-over';
  };
  
/*=============================================================================*/ 
/* Resize on Canvas on Window Resize
/*=============================================================================*/
$(window).on('resize', function(){
  _this.cw = _this.c.width = window.innerWidth;
  _this.ch = _this.c.height = window.innerHeight;  
});
    
/*=============================================================================*/ 
/* Animation Loop
/*=============================================================================*/
  this.loop = function(){
    var loopIt = function(){
      if (paused) {
        requestAnimationFrame(loopIt, _this.c);
        _this.clearCanvas();
        _this.updateL();
        _this.lightningTimer();
        _this.renderL();  
      } else {
        console.log("a");
      }
     
  };
  loopIt();         
  };
  
};

/*=============================================================================*/ 
/* Check Canvas Support
/*=============================================================================*/
var isCanvasSupported = function(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
};

/*=============================================================================*/ 
/* Setup requestAnimationFrame
/*=============================================================================*/
var setupRAF = function(){
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  };
  
  if(!window.requestAnimationFrame){
    window.requestAnimationFrame = function(callback, element){
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  };
  
  if (!window.cancelAnimationFrame){
    window.cancelAnimationFrame = function(id){
      clearTimeout(id);
    };
  };
};      



function light() {
  if(isCanvasSupported){
    var c = document.getElementById('canvas');
    var cw = c.width = window.innerWidth;
    var ch = c.height = window.innerHeight; 
    var cl = new canvasLightning(c, cw, ch);  
    setupRAF();   
    cl.init();
  }
}


var paused = false;
var pausedRain = false;


var animateLightningButton = document.getElementById('animateLightningButton');
animateLightningButton.onclick = function (e) {
   paused = paused ? false : true;
   light();
   if (paused) {
      animateLightningButton.value = '电来';
   }
   else {
      animateLightningButton.value = '电离';
   }
};



//rain 
var animateRainButton = document.getElementById('animateRainButton');
animateRainButton.onclick = function (e) {
  pausedRain = pausedRain ? false : true;

  if (pausedRain) {
    animateRainButton.value = '雨来';
  }
  else {
    animateRainButton.value = '雨收';
  }
};


//rain的参数

var canvas = document.getElementById('canvas');
console.log(canvas);
var ctx = canvas.getContext('2d');
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight; 
console.log(h);
ctx.strokeStyle = 'rgba(255,255,255,0.5)';
ctx.lineWidth = 1;
ctx.lineCap = 'round';


var init = [];
var maxParts = 200;
for(var a = 0; a < maxParts; a++) {
  init.push({
    x: Math.random() * w,
    y: Math.random() * h,
    l: Math.random() * 1,
    xs: -4 + Math.random() * 4 + 2,
    ys: Math.random() * 10 + 10
  })
}

var particles = [];
for(var b = 0; b < maxParts; b++) {
  particles[b] = init[b];
}

function rand(rMi, rMa) {
  {return ~~((Math.random()*(rMa-rMi+1))+rMi);};
}

function clearScreen() {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,'+rand(1, 30)/100+')';
  ctx.fillRect(0,0,w,h);
  ctx.globalCompositeOperation = 'source-over';
}

function draw() {
  if(pausedRain) {
    console.log(pausedRain);

    ctx.clearRect(0, 0, w, h);
    // clearScreen;

    for(var a = 0; a < particles.length; a++) {
      var p = particles[a];
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      ctx.stroke();
    }
    move();
    //生长动画写到下雨里面，这样清屏一起清，但是顺序有点问题
    if (pausedGrass) {
      stack.forEach(function(el){
        el();  
      })
    }

    // drawer();

    
  } else {
    ctx.clearRect(0, 0, w, h);
  }
  requestNextAnimationFrame(draw);
}

function move() {
  for(var b = 0; b < particles.length; b++) {
    var p = particles[b];
    p.x += p.xs;
    p.y += p.ys;
    if(p.x > w || p.y > h) {
      p.x = Math.random() * w;
      p.y = -20;
    }
  }
}


//grass growing

var stack = [],
    pausedGrass = false;

var drawer = function(){
  //originally made background white
  //ctx.fillStyle="#222";
  if (pausedGrass) {
    ctx.clearRect(0, 0, w, h);
    stack.forEach(function(el){
      el();  
    })
  }
 
  requestAnimationFrame(drawer);
}
var anim = function(){
  var x = 0, y = 0;
  //tallness of blades * variable + min 
  var maxTall = Math.random()*(h/8)+(h/8);
  //thickness of bladess
  var maxSize = Math.random()*(h/60)+5;
  //speed of blade growth
  var speed = Math.random()*1;  
  var position = Math.random()*w-w/2;
  //获取绿颜色的随机值
  var c = function(l,u){return Math.round(Math.random()*(u||255)+l||0);}
  
  //color of grass   
  var color = 'rgb('+c(125,50)+','+c(225,80)+','+c(80,50)+')';
  return function(){
    
    //how fast + far the blades bend 
    var deviation=Math.cos(x/50)*Math.min(x/4,50),
        tall = Math.min(x/2,maxTall),
        size = Math.min(x/50,maxSize);
    x+=speed;
    ctx.save();
    
    ctx.strokeWidth=10;
    ctx.translate(w/2+position, h)
    ctx.fillStyle=color;
    
    ctx.beginPath();
    ctx.lineTo(-size,0);
    ctx.quadraticCurveTo(-size,-tall/2,deviation,-tall);
    ctx.quadraticCurveTo(size,-tall/2,size,0);
    //使用路径显示不了，要用fill()
    ctx.fill();
    
    ctx.restore()
  }    
};
//number of blades it makes
for(var x = 0; x<(w/7);x++){stack.push(anim());}
canvas.width = w;
canvas.height = h;



var animateGrassButton = document.getElementById('animateGrassButton');
animateGrassButton.onclick = function (e) {
  pausedGrass = pausedGrass ? false : true;
  
  // drawer();

  if (pausedGrass) {
    animateGrassButton.value = '长';
  }
  else {
    animateGrassButton.value = '停';
  }
};



  requestNextAnimationFrame(draw);


