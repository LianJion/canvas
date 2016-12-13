// window.onload = function(){
//   //canvas init
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var pausedSnow = false;
  var pausedSun = false;
  var pausedTree = false;
  var isMelt = false;

  //canvas dimensions
  var W = window.innerWidth;
  var H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  var snowheight = 0;

  //这也是够了，比较慢，但是还不错啊
  var dx = 0.01;
  // var dv = dx*Math.sin()
  
  //snowflake particles
  var mp = 50; //max particles
  var particles = [];
  for(var i = 0; i < mp; i++)
  {
      particles.push({
        x: Math.random()*W, //x-coordinate
        y: Math.random()*H, //y-coordinate
        r: Math.random()*4+1, //radius
        d: Math.random()*mp //density
      })
  }
  
  //Lets draw the flakes
  function draw()
  {
    if(pausedSnow){
      ctx.clearRect(0, 0, W, H);



      if(snowheight <= 61 && !isMelt){

        snowheight += dx;
      }

      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fillRect(0, H-snowheight, W, snowheight);

      console.log(snowheight);

      if(isMelt) {
        console.log("a");
        snowheight -= dx;
        if(snowheight == 0){
          snowheight = 0;
        }

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, H-snowheight, W, snowheight);
      }

      console.log(snowheight);

      
      if(pausedSun) {


        updateKochPos();
        koch.update(kochmv, 100 + canvas.width*0.15, canvas.height - 62);
        if(pausedTree){
          upadteHtreePos();
          htree.update(htreemv, canvas.width/2, canvas.height+70);
        }
       

      }
      
      if(!pausedSun) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        for(var i = 0; i < mp; i++)
        {
         var p = particles[i];
         ctx.moveTo(p.x, p.y);
         ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
        }
        ctx.fill();
        update();
      }
     

      
    }


    
    requestNextAnimationFrame(draw);
  }

function clearKoch(){
  ctx.clearRect(100, canvas.height - 60, canvas.width*0.15, 62);
}
 


  //Function to move the snowflakes
  //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
  var angle = 0;
  function update()
  {
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
      if(p.x > W+5 || p.x < -5 || p.y > H)
      {
          if(i%3 > 0) //66.67% of the flakes
          {
            particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
            
          }
          else
          {
              //If the flake is exitting from the right
              if(Math.sin(angle) > 0)
              {
                  //Enter from the left
                  particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
              }
              else
              {
                  //Enter from the right
                  particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
              }
          }
      }
    }
  }
  


var animateSnowButton = document.getElementById('animateSnowButton');
animateSnowButton.onclick = function (e) {
  pausedSnow = pausedSnow ? false : true;
  console.log(pausedSnow);
  if (pausedSnow) {
    animateSnowButton.value = '雪莱';
  }
  else {
    animateSnowButton.value = '雪婷';
    //就剩下积雪了。
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillRect(0, H-snowheight, W, snowheight);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    htree.update(htreemvcopy, canvas.width/2, canvas.height+70);
    // koch.update(kochmvcopy, 100 + canvas.width*0.15, canvas.height - 60);

  }
};

var animateSunButton = document.getElementById('button');
animateSunButton.onclick = function (e) {
  pausedSun = pausedSun ? false : true;
  console.log(pausedSun);
  if (pausedSun) {
    animateSunButton.value = '消雪';


  }
  else {
    animateSunButton.value = '初霁';
    htree.update(htreemvcopy, canvas.width/2, canvas.height+70);
  }
};


var animateTreeButton = document.getElementById('animateTreeButton');
animateTreeButton.onclick = function (e) {
  pausedTree = pausedTree ? false : true;
  console.log(pausedTree);
  if (pausedTree) {
    animateTreeButton.value = '树停';
  }
  else {
    animateTreeButton.value = '树长';
  }
};




requestNextAnimationFrame(draw);



// }



//htree
var treeinitY = canvas.height - canvas.height/3.25 +100;
var exptest = 2;
var exp = 1;
var htreemvcopy = {
   x: canvas.width -200,
   y: 0,
};

var htreemv = {
   x: canvas.width/2,
   y: treeinitY,
};

//400~600
var kochmvcopy = {
  x: 600,
  y: 0
};

var kochmv = {
  x: 200,
  y: 0
};

var kochsnowflakemv = {
  x: 200,
  y: 0
};

var kochsnowflakemvcopy = {
  x: 400,
  y: 0
};




//Htree通过(x,y)坐标控制动画
function upadteHtreePos () {
  htreemv.y -= exptest;
  if(htreemv.y <= 0) {

    htreemv.y = 0
  }

  htreemv.x += exptest/2;
  if(htreemv.x >= canvas.width -200){
    htreemv.x = canvas.width -200;
  } 

  // if(htreemv.y == 0 && htreemv.x == canvas.width -200){
  //   isMelt = true;
  // }
  
}


function updateKochPos () {
  
  if (kochmv.x >= 600) {
    kochmv.x = 600;
    isMelt = true;
  }

  kochmv.x += exp;
  
}


var htree = new Htree(canvas);
var koch =  new Koch(canvas);

// 冷化雪






