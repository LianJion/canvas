$(document).ready(function() {
    bezierMotion1();
});
 
function bezierMotion1(){
   
  var breadcrumbs = new Array();
  var crumbRadius=1;
  var canvas=jQuery("#bezier_motion1");
  var context = canvas.get(0).getContext("2d");
  var parentWidth=jQuery(canvas).parent().width();
  var canvasWidth = context.canvas.width  = parentWidth;
  var canvasHeight = context.canvas.height  = 288;
  var p0 = {x:canvasWidth-50, y:30};
  var p1 = {x:50, y:30};
  var p2 = {x:50, y:258};
  var p3 = {x:canvasWidth-50, y:258};
  //function Ball(x,y,radius,color,strokeColor,lineWidth) in ball.js
  var ball_4 = new Ball(0,0,12,'#f16529','#000',7);
  var speed;
  var t;
  ball_4.t=0;
  ball_4.speed=.01;
   
  if (!checkForCanvasSupport) {
  return;
  }
   
  (function drawFrame() {
  window.requestAnimationFrame(drawFrame, canvas);
  context.clearRect(0,0,canvasWidth,canvasHeight); // clear canvas
   
  t=ball_4.t;
  
  var cx = 3 * (p1.x - p0.x)
  var bx = 3 * (p2.x - p1.x) - cx;
  var ax = p3.x - p0.x - cx - bx;
   
  var cy = 3 * (p1.y - p0.y);
  var by = 3 * (p2.y - p1.y) - cy;
  var ay = p3.y - p0.y - cy - by;
  
  var xt = ax*(t*t*t) + bx*(t*t) + cx*t + p0.x;
  var yt = ay*(t*t*t) + by*(t*t) + cy*t + p0.y;
   
  ball_4.t += ball_4.speed;
 if (ball_4.t > 1) {
  ball_4.t = 1;
  }
   
  ball_4.x=xt;
  ball_4.y=yt;
   
  //Draw the moving ball
  ball_4.draw(context);
   
  //Draw the context point
  context.font ="10px Verdana";
  context.fillStyle = "#f16529";
  context.beginPath();
  context.arc(p0.x,p0.y,8,0,Math.PI*2,true);
  context.closePath();
  context.fill();
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#FFFFFF";
  context.fillText("0",p0.x-3,p0.y+3);
   
  //Draw the first control point
  context.fillStyle = "#f16529";
  context.beginPath();
  context.arc(p1.x,p1.y,8,0,Math.PI*2,true);
  context.closePath();
  context.fill();
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#FFFFFF";
  context.fillText("1",p1.x-3,p1.y+3);
   
  //Draw the second controlpoint
  context.fillStyle = "#f16529";
  context.beginPath();
  context.arc(p2.x,p2.y,8,0,Math.PI*2,true);
  context.closePath();
  context.fill();
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#FFFFFF";
  context.fillText("2",p2.x-3, p2.y+3);
   
//Draw the end point
  context.fillStyle = "#f16529";
  context.beginPath();
  context.arc(p3.x,p3.y,8,0,Math.PI*2,true);
  context.closePath();
  context.fill();
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#FFFFFF";
  context.fillText("3",p3.x-3, p3.y+3);
   
  //draw the breadcrumbs
  //add an breadcrumb to the breadcrumbs array
  breadcrumbs.push({x:xt,y:yt});
  //draw the breadcrumbs that show the track of the movement
  context.globalCompositeOperation = "destination-over";
  showBreadcrumbs(breadcrumbs);
 }());//end drawFrame
  
  function showBreadcrumbs(breadcrumbs){
  for (var i = 0; i< breadcrumbs.length; i++) {
  context.beginPath();
  context.arc(breadcrumbs[i].x,breadcrumbs[i].y,crumbRadius,0, 2*Math.PI,false);
  context.closePath();
  context.fillStyle="#999";
  context.fill();
  }
  }//end showBreadcrumb
}//end bezierMotion1