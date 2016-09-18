var ori_lo, ori_lat, des_lo, des_lat


$('#search').on("click", function() {
	loginInterface("You need to login to try further functionality. If you don't have an account yet, please <a>sign up</a> at first.")
  var context = $('#search').innerText;
  var des = document.getElementById('destination').value;
  var origin = document.getElementById('origin').value;
  var des = encodeURIComponent(des.trim());
  var origin = encodeURIComponent(origin.trim());
  httpGetAsync('https://maps.googleapis.com/maps/api/geocode/json?address=' + origin + '&key=AIzaSyBsLVrWMv6hvF24cX2ux4htbI1ngi9QyLQ', 
               function(e) {
                 var re = JSON.parse(e);
                 ori_lo = re["results"][0]["geometry"]["location"]["lng"];
                 ori_lat = re["results"][0]["geometry"]["location"]["lat"]; 
               });
  httpGetAsync('https://maps.googleapis.com/maps/api/geocode/json?address=' + des + '&key=AIzaSyBsLVrWMv6hvF24cX2ux4htbI1ngi9QyLQ',
               function(e) {
                 var re = JSON.parse(e);
                 des_lo = re["results"][0]["geometry"]["location"]["lng"];
                 des_lat = re["results"][0]["geometry"]["location"]["lat"];
               });
});

window.setTimeout(detector, 1000);
function detector() {
  if (typeof ori_lo === 'undefined' || typeof des_lo === 'undefined') {
    window.setTimeout(detector, 1000);
  }
  else { listener(); }
}

function listener() {
  console.log("fire listener");
  var context = document.getElementById('search').innerText;

  if (context == 'Search') {
    alert('destination info: ' + des_lat + " " + des_lo);
    $('#querylist').removeClass('hide');
    $('#querylist').fadeIn("fast");
  }
  else {
    var seat = document.getElementById('capacity').seletedIndex;
    console.log(seat);
    $('#querylist').removeClass('hide');
    $('#querylist').fadeIn("fast");
  }
}

$(document).ready(function() {
  setInterval(function(){
    var w = window.innerWidth;
    if (w < 1000) {
      $('#querylist').removeClass("vertical");
      $('#querylist').addClass("horizontal");
    }
    else {
      $('#querylist').removeClass("horizontal");
      $('#querylist').addClass("vertical");
    }
  });
});


function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);

}
