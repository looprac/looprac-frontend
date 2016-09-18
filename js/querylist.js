var ori_lo, ori_lat, des_lo, des_lat, click=false, result, result_recieve=false, start, end, des, origin;
var loc_ok = false;

/*this is a hardcode result*/

$('#search').on("click", function() {
  click = true;
  console.log(click);
  des = document.getElementById('destination').value;
  origin = document.getElementById('origin').value;
  des = encodeURIComponent(des.trim());
  origin = encodeURIComponent(origin.trim());

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
                 if(loc_ok) {
                 	 if(passenger) {
                 	 	 searchTrip(function(data) {console.log(JSON.stringify(data))})
                 	 }
                 } else {
                 	loc_ok = true;
                 }
               });
  httpGetAsync('https://maps.googleapis.com/maps/api/geocode/json?address=' + des + '&key=AIzaSyB0_-PA2JTjsuiRyFrg67h26CVRAGsZMG0',
               function(e) {
                 var re = JSON.parse(e);
                 des_lo = re["results"][0]["geometry"]["location"]["lng"];
                 des_lat = re["results"][0]["geometry"]["location"]["lat"];
                 if(loc_ok) {
                 	 if(passenger) {
                 	 	 searchTrip(function(data) {console.log(JSON.stringify(data))})
                 	 }
                 } else {
                 	loc_ok = true;
                 }
               });
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
  console.log(result);
  result = JSON.parse(result);
  var len = result.length;
  var list = document.getElementById('lists');
  for (i = 0; i < len; i ++ ) {
    var lat = result[i]["origin_lat"];
    var lng = result[i]["origin_lng"];
    var origin = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    lat = result[i]["destin_lat"];
    lng = result[i]["destin_lng"];
    var destin = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    var step = result[i]["steps"]
    var lenth = step.length;
    var tmploc;
    for (j = 0; j < lenth; j ++) {
      lat = result[i]["steps"][j]["latitude"];
      lng = result[i]["steps"][j]["longitude"];
      console.log("tmp" + (i*j).toString() + " is " + "(" + lat.toString() + "&&&" + lng.toString() + ")");
      var tmp = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
      if(j == 0) {
        display(origin, tmp);
      }
      else {
        display(tmploc, tmp);
      }
      tmploc = tmp
    }
    display(tmploc, destin);
    var pl1 = new google.maps.LatLng(parseFloat(43.4643), parseFloat(-80.5204));
    var pl2 = new google.maps.LatLng(parseFloat(43.3452), parseFloat(-79.5324));
    display(pl1, pl2);
  }
//  display(origin, pl1);
//  display(pl1, pl2);
//  display(pl1, des);
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

function searchTrip(callback) {
	if(isEmpty(des)) {
		setFooterMessage("You need to choose your <b>desitination</b>", "error");
		return;
	}
	if(isEmpty(origin)) {
		setFooterMessage("You need to choose your <b>origin</b>", "error");
		return;
	}
	if(!inputValidation('#startTime', "")) { return; }
	if(!inputValidation('#endTime',"")) {return; }
	
	var params = $.param({
		origin_lat: ori_lat.toFixed(4),
		origin_lng: ori_lo.toFixed(4),
		destin_lat: des_lat.toFixed(4),
		destin_lng: des_lo.toFixed(4),
		leave_after: start,
		arrive_by: end
	})

	$.ajax({
		type: "get",
		crossDomain: true,
		cache: false,
		url: apiConst + "/search_trip?" + params,
		dataType: "json",
		error: function (xhr, status, error) {
			setFooterMessage("Sorry something wrong happened, please try again", "error");
		},
		success: function(data) {
			console.log(data);
		}
	})
}
