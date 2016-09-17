var map;

function renderLocationSearchBox() {
	var origin = document.getElementById("origin");
	var originSearchBox = new google.maps.places.SearchBox(origin);

	var destination = document.getElementById("destination");
	var destinationSearchBox = new google.maps.places.SearchBox(destination);

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination);
	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("startTime"));
	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("endTime"));

 //   $('#startTime').datetimepicker();

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

function renderDriverForm() {
	$(".passernger").detach();
	$("#searchForm").append('<select class="driver" id="capacity"></select>')
	var capacityList = $("#capacity")
	for(var i = 1; i <= 10; ++i) {
		capacityList.append('<option value="' + i + '">' + i + '</option>')
	}
	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("capacity"));
}

function renderPassengerForm()

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
	renderDriverForm();
	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("search"));
}