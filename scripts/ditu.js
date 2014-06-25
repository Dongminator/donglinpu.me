$(document).ready(function(){
	populateNavigation();
});

var map;


function initialize() {  
	
	var beijingP = new BMap.Point(116.403874,39.915996); // Luoyang Longmen Train station
	var centerPoint = beijingP;
	var zoomLevel = 12;
	
	map = new BMap.Map('map');  
	map.centerAndZoom(centerPoint, zoomLevel); 
	map.enableScrollWheelZoom(); // enable scroll wheel
	map.addControl(new BMap.NavigationControl()); // use default navigator
	
	
	// Beijing Locations
	var homeP = new BMap.Point(116.478647,40.002861);
	var cinemaP = new BMap.Point(116.360465,40.014328); // Jiahua Guoji Yingcheng
	
	var linyedaxueP = new BMap.Point(116.350596,40.006514); // zeng
	var ligongdaxueP = new BMap.Point(116.323205,39.966781); // mu
	var niaochaoP = new BMap.Point(116.413703,40.009216); // 第五大道 西瓜
	var fengtaiP = new BMap.Point(116.434919,39.852041); // 宋家庄
	var beidaxinanmenP = new BMap.Point(116.311991,39.993775); // 北大西南门
	
	addMarker(homeP, "BOSS!", "The boss is here!");// D6
	addMarker(cinemaP, "Cinema", "嘉华国际影城 <br>21:05 明日边缘 <br>00:00 变形金刚4", "cinema");// D6
	addMarker(linyedaxueP, "KID", "林业大学");// D6
	addMarker(ligongdaxueP, "KID", "理工大学");// D6
	addMarker(niaochaoP, "KID", "鸟巢");// D6
	addMarker(fengtaiP, "KID", "丰台区");// D6
	addMarker(beidaxinanmenP, "KID", "北大西南门");// D6 
	
}  
   
function bm_loadScript() {  
  var script = document.createElement("script");  
  script.src = "http://api.map.baidu.com/api?v=1.5&ak=G8ZmCp52CefWE6bPnekx0CzA&callback=initialize";//此为v1.5版本的引用方式  
  // http://api.map.baidu.com/api?v=1.5&ak=您的密钥&callback=initialize"; //此为v1.4版本及以前版本的引用方式  
  document.body.appendChild(script);  
}  
   

function addMarker(point, title, description, marker){  // 创建图标对象   
	var myICon;
	var marker;
	
	if (marker) {
		myIcon = new BMap.Icon("./scripts/travel2014/markers/" + marker + ".png", new BMap.Size(32, 37), {    
			// move icon into position    
			anchor: new BMap.Size(16, 36),    
		}); 
		marker = new BMap.Marker(point, {icon: myIcon});
	} else {
		marker = new BMap.Marker(point);    
	} 
	map.addOverlay(marker);    
	addMyEventListener (marker, title, description) ;
}    

function addMyEventListener (obj, title, description) { // obj should be marker.
	var sContent =
		"<h4 class='mapInfoWindowTitle'>" + title + "</h4>" + 
		"<p class='mapInfoWindowP'>" + description + "</p>";
	
	obj.addEventListener("click", function(){    
		var windowOpts = {
				width : 250,
				height: 100
		}
		var infoWindow = new BMap.InfoWindow(sContent, windowOpts);  // 创建信息窗口对象    
		this.openInfoWindow(infoWindow); 
		var mapCurrZoom = map.getZoom();
		
		if (mapCurrZoom <= 7) {
			mapCurrZoom = 10;
		}
		map.centerAndZoom(this.getPosition(), mapCurrZoom);

	});
}

window.onload = bm_loadScript;  