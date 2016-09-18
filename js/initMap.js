var map;
var passenger = true;
function renderLocationSearchBox() {
	var origin = document.getElementById("origin");
	var originSearchBox = new google.maps.places.SearchBox(origin);

	var destination = document.getElementById("destination");
	var destinationSearchBox = new google.maps.places.SearchBox(destination);

	var capacityList = $("#capacity")
	for(var i = 1; i <= 10; ++i) {
		capacityList.append('<option value="' + i + '">' + i + '</option>')
	}

	  $('#startTime').datetimepicker();
    $('#endTime').datetimepicker();

	$(".driver").hide();
	$('#passengerType').addClass("active");

	$('#passengerType').on("click", function() {
		$('#passengerType').addClass("active");
		$('#driverType').removeClass("active");
		$('#search').text('Search')
		$(".driver").hide();
		passenger = true;
	});
	$('#driverType').on("click", function() {
		$('#driverType').addClass("active");
		$('#passengerType').removeClass("active");
		$('#search').text('Offer a Ride')
		$(".driver").show();
		passenger = false;
	});

	originSearchBox.markers = [];
	destinationSearchBox.markers = [];

    var updateSearch = function(searchBox) {
    	var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		searchBox.markers.forEach(function(marker) {
			marker.setMap(null);
		});

		searchBox.markers = [];

		var bounds = new google.maps.LatLngBounds();

    map.addListener('bounds_changed', function() {
      originSearchBox.setBounds(map.getBounds());
      destinationSearchBox.setBounds(map.getBounds());
    });

		places.forEach(function(place) {
			if (!place.geometry) {
				return;
			}
		
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			searchBox.markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			}));

			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		})
        map.fitBounds(bounds);
	};

    originSearchBox.addListener('places_changed', function() {
    	updateSearch(originSearchBox);
    });
    destinationSearchBox.addListener('places_changed', function() {
    	updateSearch(destinationSearchBox);
    });
}

function initMap() {
// Create a map object and specify the DOM element for display.   

	map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false,
		center: {lat: -34.397, lng: 150.644},
		scrollwheel: true,
		zoom: 8
	});

	renderLocationSearchBox();

	setTimeout(function () {       
            google.maps.event.trigger(map, 'resize');
	}, 100);
}