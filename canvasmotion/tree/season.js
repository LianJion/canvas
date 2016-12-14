  var desen = CreateCanvas('canapea');
  // 实例化一个canvas对象
  var paused = false;
  var one;
  var two;
  var three;
  var four;
  var five;
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
    copac[0].x = 400;
    copac[0].y = 550;
    copac[1].x = 400;
    copac[1].y = 540;
    
    
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

    function seasons(){
      seasons_frame++;
      if (seasons_frame <= 1000) {
        //从绿色到黄色
        color = "rgba(" + Math.floor(seasons_frame*200/1050) + ",200,0,1)";
      } else if(seasons_frame > 1000 &&seasons_frame < 1050){
        //表示开始脱落树叶
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
        //透明度渐渐减低
      }else if(seasons_frame == 1050){
        // clearInterval() 方法可取消由 setInterval() 设置的 timeout。
        clearInterval(debri_gen);
      }else if(seasons_frame > 1050 && seasons_frame <= 1400){
        console.log("red");
        color = "rgba(255,255,255,"+((1400-seasons_frame)/250)+")";
        // 可以作为下雪的空档
        s_size = 1;
      }else if(seasons_frame > 1400 && seasons_frame <= 1600){
        color = "rgba(0,200,0,1)";
        // 绿色
        s_size = (seasons_frame-1400)/200;
      }else if(seasons_frame > 1600){
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
        
      desen.context.fillStyle="yellow";
      for(i in debri){
        desen.context.beginPath();
        // desen.context.arc(debri[i].x,debri[i].y, debri[i].size/5, 0, Math.PI*2, true);
        //绘制叶子 
        desen.context.ellipse(debri[i].x,debri[i].y, debri[i].size/6, debri[i].size/4, Math.PI/180,0, Math.PI*2, true); 
        desen.context.closePath();
        desen.context.fill();
      }
      
      desen.context.lineWidth=0.4;


    }
    
    
    function arata(){
      //绘制背景框
      desen.context.fillStyle="black";
      desen.context.fillRect(0,0,1366,643);
      wind = curent*wind_strength + wind_dev;
      recalculate();

      //树干的颜色
      desen.context.strokeStyle = "white";
      
      desen.context.save();
      desen.context.translate(-200,-270);
      desen.context.scale(1.5,1.5);
      desen.context.translate(0,-60);
      
      draw();
      desen.context.restore();
    }
    
    
    
    function huricane(event){
      //当鼠标点击在离窗口高度不足100时，鼠标往下，风力越小

      if(window.innerHeight - event.clientY < 100){
        // console.log(event.clientY);
        wind_dev =- ((event.clientX/window.innerWidth)-1/2)*0.2;
        console.log(wind_dev);
      }

    }
    onmousedown = huricane;

    var animateButton = document.getElementById('animateButton');
    animateButton.onclick = function (e) {
      console.log(paused);
      paused = paused ? false : true;

      if (paused) {
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
      }
    };



function init(){

    // setInterval(armonic_wind, 1);
    one = setInterval(armonic_wind, 1);
    // setInterval(randomized_wind, 30);
    two = setInterval(randomized_wind, 30);

    // setInterval(seasons,10);
    three = setInterval(seasons,10);
    setTimeout("debri_gen = setInterval(new_debri,30);",2000);
    setInterval(run_debri,30);
    four =  setInterval(run_debri,30);
    run_interval = setInterval(run,1);
    // setInterval(arata,60);
    five = setInterval(arata,60);

}
   
 
    