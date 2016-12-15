/* jquery.js */
/* jquery.velocity.js */
/* velocity.ui.js */

$("#snow")
  // Blast the text apart by letter.
  .blast({ delimiter: "word" })
  // Slide the letters into view
  .velocity("transition.shrinkIn",
             { 
               display: null,
               stagger: 35,
               duration: 500,
               complete: function() {
                 // Reverse blast
                 // $("div").blast(false);
               } 
             }
  );


// $("p").blast({ delimiter:"word", customClass:"myClass" });
$("p").blast({ delimiter:"word", generateValueClass: true, tag: "div"});
$("p").blast(false);


var message = "瑞雪兆丰年，雷雨发庄稼！";

// $("#test").html("瑞雪兆丰年！").blast({ delimiter: "word"}).css("opacity", 0).velocity({ opacity: 1},{duration:3000,delay:2000});
$("#test").html(message).blast({ delimiter: "letter"}).css({opacity: 0, display: "inline-block"})
.velocity("transition.perspectiveDownIn",{ stagger:50 });

$("#test .blast").velocity( "transition.perspectiveDownOut", {
  stagger: 500,
  backwards: true,
  complete: function(){
    $("#test").html(message)
    .blast({ delimiter: "letter"}).css({opacity: 0, display: "inline-block"}).velocity("transition.perspectiveDownIn", { stagger: 500});
  }
})


$("#weather").blast({ delimiter: "word"}).eq(5).velocity({opacity: 0}, {duration: 5000, complete:function() {$(this).text("sunshine");}}).velocity({opacity: 1});

$("#hello").blast({delimiter:"letter"}).each(function(i,element){
  var adjustedOpacity = 1 - i/10;
  element.style.opacity = adjustedOpacity;
  var adjustedBlue = i*20;
  element.style.opacity = "rgb(0,0,"+adjustedBlue+")";
});