function initMap() {
// Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false,
		center: {lat: -34.397, lng: 150.644},
		scrollwheel: true,
		zoom: 8
	});

	var origin = document.getElementById("origin");
	var originSearchBox = new google.maps.places.SearchBox(origin);

	var destination = document.getElementById("destination");
	var destinationSearchBox = new google.maps.places.SearchBox(destination);

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination);

    var updateSearch = function(markers, searchBox) {
    	var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

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

			markers.push(new google.maps.Marker({
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

    var originMarkers = [], destinationMarkers = [];
    originSearchBox.addListener('places_changed', function() {
    	updateSearch(originMarkers, this);
    });
    destinationSearchBox.addListener('places_changed', function() {
    	updateSearch(destinationMarkers, this);
    });
}