var ori_lo, ori_lat, des_lo, des_lat, click=false, result, result_recieve=false, start, end;


/*this is a hardcode result*/
result = '[{"id":3,"origin_lat":43.4643,"origin_lng":-80.5204,"destin_lat":43.6532,"destin_lng":-79.3832,"leave_after":0,"arrive_by":1000000,"seats":4,"driver_uuid":"lsj1","steps":[{"time":26654,"latitude":55.000000,"longitude":80.000000,"action":"D lsj1"}]},{"id":4,"origin_lat":60,"origin_lng":80,"destin_lat":35.5,"destin_lng":80,"leave_after":0,"arrive_by":1000000,"seats":4,"driver_uuid":"lsj1","steps":[{"time":0,"latitude":40.000000,"longitude":-80.000000,"action":"P lsj1"},{"time":24426,"latitude":35.500000,"longitude":80.000000,"action":"D lsj1"}]}]'


$('#search').on("click", function() {
  click = true;
  console.log(click);
	loginInterface("You need to login to try further functionality. If you don't have an account yet, please <a>sign up</a> at first.")
  var des = document.getElementById('destination').value;
  var origin = document.getElementById('origin').value;
  var des = encodeURIComponent(des.trim());
  var origin = encodeURIComponent(origin.trim());

  start = document.getElementById('start_time').value;
  end = document.getElementById('end_time').value;
  var start_date = new Date(start);
  var end_date = new Date(end);
  start = new Date(start_date.toUTCString());
  end = new Date(end_date.toUTCString());
  start = start.getTime();
  end = end.getTime();

  httpGetAsync('https://maps.googleapis.com/maps/api/geocode/json?address=' + origin + '&key=AIzaSyB0_-PA2JTjsuiRyFrg67h26CVRAGsZMG0', 
               function(e) {
                 var re = JSON.parse(e);
                 ori_lo = re["results"][0]["geometry"]["location"]["lng"];
                 ori_lat = re["results"][0]["geometry"]["location"]["lat"]; 
               });
  httpGetAsync('https://maps.googleapis.com/maps/api/geocode/json?address=' + des + '&key=AIzaSyB0_-PA2JTjsuiRyFrg67h26CVRAGsZMG0',
               function(e) {
                 var re = JSON.parse(e);
                 des_lo = re["results"][0]["geometry"]["location"]["lng"];
                 des_lat = re["results"][0]["geometry"]["location"]["lat"];
               });
/*  $.post(url,
         {
           passenger_type: passenger,
           origin_log: ori_lo,
           origin_lat: ori_lat,
           destin_log: des_lo,
           destin_lat: des_lat,
           start_time: start,
           end_time: end,


         },
         function(e) {
           result = e;
         });*/
});


function click_detector() {
  if (typeof ori_lo === 'undefined' || typeof des_lo === 'undefined' || click == false) {
    return;
  }
  else { 
    listener();
    click = false; 
  }
}

function result_detector() {
  if (typeof result == 'undefined' || result == '') return;
  else {
    result_recieve = true;
  }
}

function listener() {
  console.log("fire listener");
  var context = document.getElementById('search').innerText;
  if (context == 'Search') {
    $('#querylist').removeClass('hide');
    $('#querylist').fadeIn("fast");
    /*alert("Information need to be sent:\n" + 
          "origin: (" + ori_lat + ", " + ori_lo + ")\n" + 
          "destination: (" + des_lat + ", " + des_lo + ")\n" +
          "start time: " + start.toString() + "\n" + 
          "end time: " + end.toString() + "\n");*/
    var seat = document.getElementById('capacity').value;
    console.log(seat);
    result_parse(result);

  }
  else {
    var seat = document.getElementById('capacity').value;
    console.log(seat);
    $('#querylist').removeClass('hide');
    $('#querylist').fadeIn("fast");
  }
}

$(document).ready(function() {
  setInterval(function(){
    click_detector();
    result_detector();
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




function result_parse(result) {
  $('#loading').addClass('hide');
  result = JSON.parse(result);
  var len = result.length;
  var list = document.getElementById('lists');
  var lat = result[0]["origin_lat"];
  var lng = result[0]["origin_lng"];
  var origin = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
  lat = result[0]["destin_lat"];
  lng = result[0]["destin_lng"];
  var destin = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
  var step = result[0]["steps"]
  var lenth = step.length;
  lat = result[0]["steps"][0]["latitude"];
  lng = result[0]["steps"][0]["longitude"];
  var pl1 = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
  display(origin, destin);
  display(origin, pl1);
  var num = 1;
  list.innerHTML = list.innerHTML + 
    '<li><div><p>Route ' + num.toString() + '</p><button>Book</button></div></li>';
}


function display(origin, destin) { 
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  var request = {
    origin: origin,
    destination: destin,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
      console.log(result)
    }
    else {
      console.log(result)
      console.log("fail");
    }
  });
}


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
