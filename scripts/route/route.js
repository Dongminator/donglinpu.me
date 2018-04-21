$(document).ready(function(){
//	populateNavigation();
});

var map;
var markers = [];

var Routes = [];
// routes.push()
var CurrSearchResults;
var DirectionsService;
var DirectionsDisplay;

function initMap() {
	var uluru = {lat: -25.363, lng: 131.044};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: uluru	
	});
	var marker = new google.maps.Marker({
		position: uluru,
		map: map
	});	
	DirectionsService = new google.maps.DirectionsService();
	DirectionsDisplay = new google.maps.DirectionsRenderer();
	DirectionsDisplay.setMap(map);
}



function initAutocomplete() {
	initMap();
	
	// Create the search box and link it to the UI element.
	var input = document.getElementById('searchBox');
	var addBtn = document.getElementById('addBtn');
	var routeBtn = document.getElementById('routeBtn');
	var searchBox = new google.maps.places.SearchBox(input);
	
	addAddBtnListener(addBtn);
	addRouteBtnListener(routeBtn);
	
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(addBtn);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(routeBtn);
	
	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		console.log(places);
		CurrSearchResults = places;
		
		if (places.length == 0) {
			return;
		}

		clearMarkers();

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
				cconsole.log("Returned place contains no geometry");
				return;	
			}

			var icon = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
			};
			
			// Create a marker for each place.
			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
				
			}));
			
			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}	
		});
		map.fitBounds(bounds);	
	});	
}



function clearMarkers () {
	// Clear out the old markers.
	markers.forEach(function(marker) {
		marker.setMap(null);
	});
	markers = [];
}

function addAddBtnListener (btn) {
	btn.onclick = function(){
		console.log("add clikcked");
		Routes.push(CurrSearchResults);
	};
	
}

function addRouteBtnListener (btn) {
	btn.onclick = function(){
		console.log("btn clikcked");
		// use google DirectionService to calculate route
		var start;
		var end;
		var waypoints;
		var request;
		
		if (Routes.length == 0) {
			// alert: no point
			
			return 0;
		} else if (Routes.length == 1) {
			// display marker 1
			
			return 0;
			
		} else if (Routes.length == 2) {
			request = {
					origin: { placeId: Routes[0][0].place_id },
					destination: { placeId: Routes[1][0].place_id },
					travelMode: 'DRIVING'			
			};
		} else {
			// find waypoints
			
			request = {
					origin: { placeId: Routes[0][0].place_id },
					destination: { placeId: Routes[1][0].place_id },
					travelMode: 'DRIVING'			
			};
			
			
		}
		
		DirectionsService.route(request, function(result, status) {
			if (status == 'OK') {
				DirectionsDisplay.setDirections(result);	
			}
		});
	};
	
}




// user search points


// use add points

// 



