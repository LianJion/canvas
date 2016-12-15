  var desen = CreateCanvas('canapea');
  // 实例化一个canvas对象
  var paused = false;
  var one;
  var two;
  var three;
  var four;
  var five;
  var grass;
  var isSnow = false;
  var isSun = false;
  var isGrow = false;
  //我觉得是树干的意思
  function nod(){
    this.x = 0;
    this.y = 0;
    this.length = 0;
    this.parent = null;
    this.left = null;
    this.right = null;
  }

  //树叶
  function frunza(){
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.momx = 0;
    this.momy = 0;
  }

    var copac = new Array;
    //父子容器关系？
    copac[0] = new nod;
    copac[1] = new nod;
    copac[1].parent = copac[0];
    //nod[0]是nod[1]的父容器
    
    
    //vantul,randomizarea si armonica
    var center = 0;
    var momentum = 0;
    var curent = 0;
    //谐波风？
    function armonic_wind(){
      momentum -= (curent-center) * 0.0008 * Math.random();
      curent += momentum;
      momentum *= 0.997;
    }

    //随机风
    function randomized_wind(){
        center = (Math.random() - 1/2);
    }

    //每隔1ms，和30ms执行
    // setInterval(armonic_wind, 1);
    // setInterval(randomized_wind, 30);

    //特征
    //traits.................................................................................................
    var gamma = 0.86;
    var wind = 0;
    var wind_dev = (Math.random()-0.5)*0.1;
    var wind_strength = 0.1;
    //给copay[0].x初始化
    copac[0].x = 800;
    copac[0].y = 500;
    copac[1].x = 800;
    copac[1].y = 490;

    //鼠标点击生成树的位置
    onmousedown = function (event){
      
        var loc = getMousePos(desen.canvas, event);
        // console.log(loc.x);
        // console.log(loc.y);

        copac[0].x = loc.x;
        copac[0].y = loc.y;
        copac[1].x = loc.x;
        copac[1].y = loc.y-10;
    
    }

    onmousemove =  huricane;

    
    
    function recalculate(){
      // console.log(copac[0]);
      //遍历一波copac
      for(x in copac){
        if(!(copac[x].parent == null)){
          //还没有父亲
          if(copac[x].length > 10){
            //长度大于10
            if((copac[x].left == null) && (copac[x].right == null)){
              //左边右边都为空
              copac[x].left = new nod;
              copac[x].right = new nod;
              //左边的长度是 长度-2的随机值向下取整然后加1
              copac[x].left.length = Math.floor(Math.random()*(copac[x].length-2))+1;
              //右边的长度是总长度减去左边的长度
              copac[x].right.length = copac[x].length-copac[x].left.length;
              
              //copac[x]是他左边右边的长度的父亲容器
              copac[x].left.parent = copac[x];
              copac[x].right.parent = copac[x];
              
              copac.push(copac[x].left);
              copac.push(copac[x].right);
            }
          }
        }
      }
        
      // stack的用法我碰到第二次了
      var stack = new Array;
      stack.push(copac[1]);
      //第一个元素是copac[1]
      while(stack.length > 0){
        var temp = stack.pop();
        // console.log(temp);
        //很多nod对象
        if(!(temp.left == null)){
          // atan2() 方法可返回从 x 轴到点 (y,x) 之间的角度
          var angle = Math.atan2(temp.parent.y-temp.y, temp.x-temp.parent.x) + gamma*(temp.length-temp.left.length)/temp.length;
          //abs取绝对值，大于90°
          if(Math.abs(angle) > Math.PI/2){
            angle += (Math.PI-Math.abs(angle))*angle/Math.abs(angle)*wind;
          }else{
            angle += angle*wind;
          }
          
          
          var len=1;
          if((!(temp.left.left == null))&&(!(temp.left.right == null))){
            //左边都有值的情况下
            len = Math.sqrt(2*(temp.left.left.length*temp.left.right.length)/(temp.left.left.length+temp.left.right.length));
          }
          
          temp.left.x = temp.x + len*Math.cos(angle);
          temp.left.y = temp.y - len*Math.sin(angle);
          //将temp.leftpush到stack里
          stack.push(temp.left);
        }
        
        if(!(temp.right == null)){
          var angle = Math.atan2(temp.parent.y-temp.y,temp.x-temp.parent.x)-gamma*(temp.length-temp.right.length)/temp.length;
            
          if(Math.abs(angle) > Math.PI/2){
            angle += (Math.PI-Math.abs(angle))*angle/Math.abs(angle)*wind;
          }else{
            angle += angle*wind;
          }
            
          var len=1;
          if((!(temp.right.left == null))&&(!(temp.right.right == null))){
            len = Math.sqrt(2*(temp.right.left.length*temp.right.right.length)/(temp.right.left.length+temp.right.right.length));
          }
          temp.right.x = temp.x + len*Math.cos(angle);
          temp.right.y = temp.y - len*Math.sin(angle);
          //将temp.rightpush到stack里
          stack.push(temp.right);
        }
      }
    }
    

    //add(x,to) 
    function add(x,to){
      //参数to的父元素 不为空
      while(!(to.parent == null)){
        to.length += x;
        to = to.parent;
      }
      to.length += x;
    }
    
    var run_interval = null;

    //运行函数
    function run(){

      wind = curent + wind_dev;
      //遍历copac数组的left和right是否为空
      for(i in copac){
        if((copac[i].left == null)&&(copac[i].right == null)){
          // 随机值<0.07
          if(Math.random() < 0.07){
            //add() copac[i].length随机增加（0,3）
            add(Math.random()*3,copac[i]);
          }
        }
      }
      // 重新计算，重新压入栈
      recalculate();
      // console.log(copac.length);
      if(copac.length > 2000) clearInterval(run_interval);
    }
    
    //debri碎片的意思
    var debri = new Array;

    function new_debri(){
      //如果随机产生一（0，1）之间的数，大于0.8
      if(Math.random() > 0.8){
        var temp = copac[Math.floor(Math.random()*copac.length)];
        //新的树叶？
        var leaf = new frunza;
        // console.log("aa");
        //出现黄点
        leaf.size = Math.random() * 10;
        leaf.x = temp.x;
        leaf.y = temp.y;
        debri.push(leaf);
      }
    }

    var debri_gen = null;
    //这句功能是让第一次树生长的时候就出现黄色的碎片点
    // setTimeout("debri_gen = setInterval(new_debri,30);",2000);
    // setInterval(run_debri,30);
    //让黄色的碎片点运动起来

    function run_debri(){
      // 遍历数组或者对象的属性
      for(i in debri){
        debri[i].momx += (-wind * 3 * Math.random());
        debri[i].momy += (Math.random()-6/13) * 40 * (Math.abs(wind));
        debri[i].x += debri[i].momx - wind * 30 * (Math.random()+1);
        debri[i].y += debri[i].momy;
        if(debri[i].y > 600){
          // splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目，这里是删除
          //是黄色的那些粒子
          // console.log(debri[i].y);
          debri.splice(i,1);
        }
      }
    }
    

    //seasons:
    
    var color = "rgba(0,255,0,1)";
    var s_size = 1;
    var seasons_frame = 0;
    var  grassColor;

    function seasons(){
      seasons_frame++;
      if (seasons_frame <= 1000) {
        isSun = true;
        isGrow = true;
        //从绿色到黄色
        color = "rgba(" + Math.floor(seasons_frame*200/1050) + ",200,0,1)";
        grassColor = "rgba(" + Math.floor(seasons_frame*200/1050) + ",200,0,1)";
      } else if(seasons_frame > 1000 &&seasons_frame < 1050){
        //表示开始脱落树叶
        isSun = false;
        for(x in copac){
          // console.log(seasons_frame);
          if(copac[x].length < 10 && Math.random() < 0.015*((1050-seasons_frame)/50)){
            var temp = copac[x];
            var leaf = new frunza;
            leaf.size = temp.length;
            leaf.x = temp.x;
            leaf.y = temp.y;
            debri.push(leaf);
          }
        }
        color = "rgba("+Math.floor(seasons_frame*200/1050)+",200,0,"+((1050-seasons_frame)/50)+")";
        grassColor = "rgba("+Math.floor(seasons_frame*200/1050)+",200,0,1)";
        //透明度渐渐减低
      }else if(seasons_frame == 1050){
        // clearInterval() 方法可取消由 setInterval() 设置的 timeout。
        clearInterval(debri_gen);
      }else if(seasons_frame > 1050 && seasons_frame <= 1800){
        isSnow = true;
        //红梅花的效果好看
        color = "rgba(251,9,10,"+((1800-seasons_frame)/650)+" )";
        // console.log(Math.floor(seasons_frame*200/1800));
        var test = 316-Math.floor(seasons_frame*200/1800);
        var test2 = test - 20;
        // var test2 = 200-Math.floor(1800-seasons_frame)/4;
        //你妹要经过好好计算
        grassColor = "rgba("+test+","+test2+",0,1)";
        // grassColor = "rgba("+test+","+test2+",5,1)";
        // "rgba("+Math.floor(seasons_frame*200/1050)+",200,0,1)";
        console.log("red:" + grassColor);
        // 可以作为下雪的空档
        // s_size = 1;
        s_size = (seasons_frame-1050)/400;

      }else if(seasons_frame > 1800 && seasons_frame <= 1976){
        isSnow = false;
        color = "rgba(0,200,0,1)";
        var test3 = 116-(seasons_frame-1800) ;
        var test4 = 96+(seasons_frame-1800) ;
        grassColor = "rgba("+test3+","+test4+",0,1)";
        // 绿色
        s_size = (seasons_frame-1800)/200;
      }else if(seasons_frame > 1976){
        seasons_frame = 0;
        debri_gen = setInterval(new_debri,30);
      }
    }

    
    function draw(){

      //绘制分叉
      for(x=2; x<copac.length; x++){
        desen.context.beginPath();
        desen.context.moveTo(copac[x].x,copac[x].y);
        //二次贝塞尔曲线，parent所在位置作为控制点，parent.parent的所住位置作为终点

        desen.context.quadraticCurveTo(copac[x].parent.x,copac[x].parent.y,copac[x].parent.parent.x,copac[x].parent.parent.y);
        desen.context.moveTo(copac[x].parent.parent.x,copac[x].parent.parent.y);
        //移动到新的点开始绘制
        desen.context.closePath();
        //自动变细
        desen.context.lineWidth = Math.sqrt(copac[x].length)*0.1;
        // lineCap 属性设置或返回线条末端线帽的样式 ,"round" 和 "square" 会使线条略微变长
        desen.context.lineCap = "square";
        desen.context.stroke(); 
      }
      
      desen.context.fillStyle = color;
      for(x in copac){
        if(copac[x].length < 10){
          //当生长时候的长度小于10的时候,开始绘制椭圆 就是树叶
          // console.log("a");
          desen.context.beginPath();

          desen.context.ellipse(copac[x].x,copac[x].y, copac[x].length/6*s_size, copac[x].length/4*s_size, Math.PI/180,0, Math.PI*2, true); 
          // desen.context.fillRect(copac[x].x,copac[x].y, copac[x].length/5*s_size, copac[x].length/5*s_size ); 
          desen.context.closePath();
          desen.context.fill();
        }
      }
        
      desen.context.fillStyle = "yellow";
      for(i in debri){
        desen.context.beginPath();
        // desen.context.arc(debri[i].x,debri[i].y, debri[i].size/5, 0, Math.PI*2, true);
        //绘制掉落的叶子
        desen.context.ellipse(debri[i].x,debri[i].y, debri[i].size/6, debri[i].size/4, Math.PI/180,0, Math.PI*2, true); 
        desen.context.closePath();
        desen.context.fill();
      }
      
      desen.context.lineWidth=0.4;


    }
    
    //相当于清屏功能函数，还给它加了背景渐变效果
    function arata(){
      //绘制背景框
      //直接基于背景框绘制
      desen.context.fillStyle="#666ECA";
      desen.context.fillStyle = gradient;
      desen.context.fillRect(0, 0, desen.width, desen.height);

        //获取绿颜色的随机值
      
      // if(isGrow) {
      //   drawergrass();
      //   // console.log(color);
      // }
     

      var ntime = new Date().getTime();
      var elapsed = ntime-time;
      //绘制草
      

      if ( elapsed > nextLerpTime ) {
        lerpindex = Math.floor((elapsed-nextLerpTime)/nextLerpTime);
        if ( (elapsed-nextLerpTime)%nextLerpTime < lerpTime ) {
          lerp( (elapsed-nextLerpTime)%nextLerpTime, lerpTime );
        }
      } 

 
     

      wind = curent*wind_strength + wind_dev;
      recalculate();
      
      // console.log(isSnow);
      if(isSnow){

        drawsnow();
      }

     
      if(isSun) {
         drawSun();
      }
     
      
      //树干的颜色
      desen.context.strokeStyle = "#4A2A16";
      
      desen.context.save();
      desen.context.translate(-200,-270);
      desen.context.scale(1.5,1.5);
      desen.context.translate(0,-60);
      
      draw();
      drawergrass();
      desen.context.restore();
    }
    
    
//鼠标移动动画
function huricane(event){
  //当鼠标点击在离窗口高度不足100时，鼠标往下，风力越小

  if(window.innerHeight - event.clientY < 300 || window.innerWidth -event.clientX < 200){
    // console.log(event.clientY);
    wind_dev =- ((event.clientX/window.innerWidth)-1/2)*0.2;
    // console.log(wind_dev);
  }

}
 
//鼠标点击交互
function getMousePos(canvas, evt) { 
   var rect = canvas.getBoundingClientRect(); 
   return { 
     x: evt.clientX - rect.left * (canvas.width / rect.width),
     y: evt.clientY - rect.top * (canvas.height / rect.height)
   }
}

var animateButton = document.getElementById('animateButton');
animateButton.onclick = function (e) {
  // console.log(paused);
  paused = paused ? false : true;

  if (paused) {
    
    // console.log(desen.width);
      init();
   
    animateButton.value = '长';
  }
  else {
    animateButton.value = '停';
    //通过这个控制树的生长。

    clearInterval(run_interval);
    clearInterval(one);
    clearInterval(two);
    clearInterval(three);
    clearInterval(four);
    clearInterval(five);
    // clearInterval(grass);
    // console.log(grass);
  }
};




//绘制草
var stackGrass  = [],
    pausedGrass = false,
    w = window.innerWidth,
    h = window.innerHeight;
    desen.width = w;
    desen.height = h;

    var grassframe = 0;


function anim(){

  grassframe++;
  //设置x,y的参数
  var x = 0, y = 0;
  //tallness of blades * variable + min 
  var maxTall = Math.random()*(h/8)+(h/8);
  //thickness of bladess
  var maxSize = Math.random()*(h/100)+5;
  //speed of blade growth
  var speed = Math.random()*1;  
  var position = Math.random()*w-w/2;


  return function(){
    
    //how fast + far the blades bend  deviation背离
    var deviation = Math.cos(x/50)*Math.min(x/4,50),
        tall = Math.min(x/2,maxTall),
        size = Math.min(x/50,maxSize);
    //x值进行变化
    x += speed;
    desen.context.save();
    
      desen.context.strokeWidth=10;
      desen.context.translate(w/2+position, h+40);
      // var c = function(l,u){return Math.round(Math.random()*(u||255)+l||0);}
      // var grasscolor;
    
      // if ( grassframe <= 1000) {
      //   //从绿色到黄色
      //   grasscolor = "rgba(" + Math.floor(grassframe*200/1050) + ",200,0,1)";  
      //   console.log(grasscolor); 

      // } else if( grassframe >= 1050 && grassframe <= 1800){
      //   console.log(grassframe);
      //   grasscolor = "rgba(251,9,10,"+((1800-grassframe)/650)+")";

      // }else if(grassframe > 1800 && grassframe <= 2000){
        
      //   grasscolor = "rgba(0,200,0,1)";
      //   // 绿色
    
      // }else if( grassframe > 2000){

      //   grassframe = 0;
      // }

      //草的颜色基本能够和树同步起来
      desen.context.fillStyle = grassColor;
      // console.log(color);
      
      desen.context.beginPath();
      desen.context.lineTo(-size,0);
      //一个控制点，一个描点
      //哈哈哈哈哈，这个草好看多了，三次贝塞尔曲线太给力！
      desen.context.bezierCurveTo(-size,0, -size-1,-tall-tall/4, deviation,-tall)
      desen.context.bezierCurveTo(deviation,-tall, -size-1, -tall-1-tall/4, -size+3,0 );

      // desen.context.quadraticCurveTo(-size,-tall/2,deviation,-tall);
      // desen.context.quadraticCurveTo(size,-tall/2,size,0);
      //使用路径显示不了，要用fill()
      desen.context.fill();
    
    desen.context.restore();

  }    
};



for(var x = 0; x<(w/7);x++) {
  //把anim()都放到stack里了
  stackGrass.push(anim());
}


function drawergrass () {
  //开始遍历stack里面的anim函数
  stackGrass.forEach(function(el){
    el();  
  })
}



//绘制下雪效果  
//snowflake particles
var mp = 50; //max particles
var particles = [];
for(var i = 0; i < mp; i++)
{
    particles.push({
      x: Math.random()*desen.width, //x-coordinate
      y: Math.random()*desen.height, //y-coordinate
      r: Math.random()*4+1, //radius
      d: Math.random()*mp //density
    })
}

var angle = 0;

function update() {
  angle += 0.01;
  for(var i = 0; i < mp; i++)
  {
    var p = particles[i];
    //Updating X and Y coordinates
    //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
    //Every particle has its own density which can be used to make the downward movement different for each flake
    //Lets make it more random by adding in the radius
    p.y += Math.cos(angle+p.d) + 1 + p.r/2;
    p.x += Math.sin(angle) * 2;
    
    //Sending flakes back from the top when it exits
    //Lets make it a bit more organic and let flakes enter from the left and right also.
    if(p.x > desen.width+5 || p.x < -5 || p.y > desen.height)
    {
        if(i%3 > 0) //66.67% of the flakes
        {
          particles[i] = {x: Math.random()*desen.width, y: -10, r: p.r, d: p.d};
          
        }
        else
        {
            //If the flake is exitting from the right
            if(Math.sin(angle) > 0)
            {
                //Enter from the left
                particles[i] = {x: -5, y: Math.random()*desen.height, r: p.r, d: p.d};
            }
            else
            {
                //Enter from the right
                particles[i] = {x: desen.width+5, y: Math.random()*desen.height, r: p.r, d: p.d};
            }
        }
    }
  }
}

function drawsnow() {
  
  desen.context.fillStyle = "rgba(255, 255, 255, 0.8)";
  desen.context.beginPath();
  for(var i = 0; i < mp; i++) {
    var p = particles[i];
    // desen.context.moveTo(p.x, p.y);
    // desen.context.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
    //绘制雪花，平常雪花，不是科赫
    desen.context.font = p.r*5 + 'px Arial, sans serif';
    // console.log(p.r);
    desen.context.fillText("❄", p.x, p.y);
  }
  desen.context.fill();
  update();
}


//绘制太阳,还是用曲线arc？
// var sun = new Image();
// sun.src = "sun.png";
var sunexp = 10;
var sun = {
  x: -50,
  y: 300,
  r: 50
}

function drawSun() {
  sun.x += sunexp;
  sun.y -= sunexp;
  console.log(sun.x);
  console.log(sun.y);
  if (sun.x >= 200) {
    sun.x = 200;
    sun.y = 50; 
  }
  // desen.context.drawImage(sun, sun.x, sun.y, sun.width, sun.height);
    desen.context.fillStyle = "#F18D4B";
    desen.context.beginPath();
    desen.context.arc(sun.x, sun.y, sun.r, 0, Math.PI*2, false);    
    desen.context.fill();

    drawPath();

}

function drawPath() {
  console.log("x");
  desen.context.fillStyle = "#F18D4B";
  desen.context.beginPath();
  desen.context.strokeStyle = "#fff";
  desen.context.lineTo(-50,300);
  desen.context.quadraticCurveTo(100,50,200,50);
  desen.context.stroke();
}



//绘制渐变背景

var lerpTime = 10000;    // time taken to fade sky colors
var nextLerpTime = 15000;  // after fading, how much time to wait to fade colors again.
var interval = null;
var gradient;
var time;
var lerpindex = 0;
// 设置草的渐变
// ambient intensities for each sky color
var ambient ;
var ambients= [ 1, 0.35, 0.05, 0.5 ];
//颜色替换
var colors = [ 
          [ 0x00, 0x00, 0x3f, 
            0x00, 0x3f, 0x7f,
            0x1f, 0x5f, 0xc0,
            0x3f, 0xa0, 0xff ],

          [ 0x00, 0x3f, 0x7f, 
            0xa0, 0x5f, 0x7f,
            0xff, 0x90, 0xe0,
            0xff, 0x90, 0x00 ],
            
          [ 0x00, 0x00, 0x00,
            0x00, 0x2f, 0x7f,
            0x00, 0x28, 0x50,
            0x00, 0x1f, 0x3f ],
            
          [ 0x1f, 0x00, 0x5f,
            0x3f, 0x2f, 0xa0,
            0xa0, 0x1f, 0x1f,
            0xff, 0x7f, 0x00 ] 
        ];




function lerp( time, last ) {
  gradient= desen.context.createLinearGradient(0,0,0,desen.height);
  
  var i0= lerpindex%colors.length;
  var i1= (lerpindex+1)%colors.length;
  
  for( var i=0; i<4; i++ )  {
    var rgb='rgb(';
    for( var j=0; j<3; j++ ) {
      rgb+= Math.floor( (colors[i1][i*3+j]-colors[i0][i*3+j])*time/last + colors[i0][i*3+j]);
      if ( j<2 ) rgb+=',';
    }
    rgb+=')';
    gradient.addColorStop( i/3, rgb );
  }
  ambient = (ambients[i1]-ambients[i0])*time/last + ambients[i0];
}





function init(){
    console.log(desen.context);

    // requestAnimationFrame(clear);
    // setInterval(armonic_wind, 1);
    one = setInterval(armonic_wind, 1);
    // setInterval(drawergrass,30);
    // grass = setInterval(drawergrass,30);

    // setInterval(randomized_wind, 30);
    two = setInterval(randomized_wind, 30);

    // setInterval(seasons,10);
    three = setInterval(seasons,10);
    setTimeout("debri_gen = setInterval(new_debri,30);",2000);
    setInterval(run_debri,30);
    four =  setInterval(run_debri,30);
    run_interval = setInterval(run,1);
    // setInterval(arata,60);
    time= new Date().getTime();
    //每隔60s执行一次five函数
    five = setInterval(arata,60);

}
   