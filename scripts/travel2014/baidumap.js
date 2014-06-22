var map;


function initialize() {  
	map = new BMap.Map('map');  
	map.centerAndZoom(new BMap.Point(113,37), 7); 
	map.enableScrollWheelZoom(); // enable scroll wheel
	map.addControl(new BMap.NavigationControl()); // use default navigator
	
	// Beijing Locations
	var beijingXiTrainPosition = new BMap.Point(116.327841,39.900676); // Beijing Xizhan Train station
	
	// Luoyang Locations
	var luoyangLongmenTrainPosition = new BMap.Point(112.464761,34.599765); // Luoyang Longmen Train station
	var luoyangCoachPosition = new BMap.Point(112.480496,34.616278); // 洛阳市洛龙区关林汽车站
	var longmenPosition = new BMap.Point(112.479566,34.564212);// 龙门石窟
	var luoyangLongmenHantingHotelPosition = new BMap.Point(112.469242,34.611137);
	
	// dengfeng locations
	var dengfengPosition = new BMap.Point(113.060429,34.451627);// may not need
	var dengfengCoachPosition = new BMap.Point(113.036567,34.466264); // 登封汽车站
	var hotelDengfengPosition = new BMap.Point(113.060429,34.451627); // TODO change location, hotel d1,d2,d3
	var songshanTaishishanPosition = new BMap.Point(113.048014,34.498639);
	var songshanShaoshishanPosition = new BMap.Point(112.948099,34.511597);
	
	// xi'an locations
	var xianNorthTrainPosition = new BMap.Point(108.945731,34.381176);// 西安北站
	var xianTrainPosition = new BMap.Point(108.969196,34.283885);
	var hotelXianPosition = new BMap.Point(108.982847,34.283533);// 汉庭 西安火车站东店
	
	var zhonglouPosition = new BMap.Point(108.95344,34.265657);//西安钟楼
	var gulouPosition = new BMap.Point(108.950122,34.26641);//西安鼓楼
	var huiminjiePosition = new BMap.Point(108.949881,34.267932);//西安回民街
	var chengqiangPosition = new BMap.Point(108.932542,34.265448);// 古城墙
	
	var bingmayongPosition = new BMap.Point(109.291934,34.39444);// 兵马俑
	var huaqingchiPosition = new BMap.Point(109.22009,34.370398);// 华清池
	
	var dayantaPosition = new BMap.Point(108.970561,34.223954);// 西安 大雁塔
	
	
//	var beijingMarker = new BMap.Marker(beijingPosition);        // 创建标注    
//	map.addOverlay(beijingMarker);
	
	
	// TODO group icons
	
	addMarker(beijingXiTrainPosition, "number_1", "Day 1", str_d1_beijing);// D1 Beijing Train Departure
	addMarker(luoyangLongmenTrainPosition, "number_1", "Day 1, 3", str_d1_luoyang);// D1 Luoyang Train Arrival
	addMarker(luoyangCoachPosition, "number_1", "Day 1, 3", str_d1_luoyangCoach);// D1 Luoyang Coach Departure
	
	addMarker(dengfengCoachPosition, "number_2", "Day 2", str_d1_dengfeng);// D1 Dengfeng Coach Arrival
	addMarker(hotelDengfengPosition, "hotel", "Day 1 Night", str_d1_hotel);// d1,d2,d3 hotel same.
	
	// 6.10 Tue day 2
	addMarker(songshanShaoshishanPosition, "hiker", "Day 2", str_d2_shaoshishan);// D3
	addMarker(luoyangLongmenHantingHotelPosition, "hotel", "Day 2 Night", str_d2_hotel);// D3
	
	// 6.11 Wed day 3
	addMarker(longmenPosition, "number_3", "Day 3", str_longmen);// D3
	addMarker(xianNorthTrainPosition, "number_3", "Day 3 Night", str_xian_arrival);// D3
	addMarker(hotelXianPosition, "hotel", "Day 3 Night", str_xian_hotel);// D3
	
	
	// 6.12 Thu day 4
	addMarker(huiminjiePosition, "number_4", "Day 4", str_huiminjie);// D4
	addMarker(zhonglouPosition, "number_4", "Day 4", str_zhonglou);// D4
	addMarker(gulouPosition, "number_4", "Day 4", str_gulou);// D4
	addMarker(chengqiangPosition, "number_4", "Day 4", str_chengqiang);// D4
	
	// 6.13 Fri day 5
	addMarker(huaqingchiPosition, "number_5", "Day 5", str_huaqingchi);// D5
	addMarker(bingmayongPosition, "number_5", "Day 5", str_bingmayong);// D5
	
	// 6.14 Sat day 6
	addMarker(dayantaPosition, "number_6", "Day 6", str_dayanta);// D6
	addMarker(xianTrainPosition, "number_6", "Day 6", str_d6_return);// D6
	
	// To remove a marker, run the following. 
//	map.removeOverlay(beijingMarker);   

	// 北京 - 洛阳
	var pointsBJtoLY = [beijingXiTrainPosition, luoyangLongmenTrainPosition];
	var curveBJtoLY = new BMapLib.CurveLine(pointsBJtoLY, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
	map.addOverlay(curveBJtoLY); //添加到地图中
	
	// 洛阳 - 登封
	var pointsLYtoDF = [luoyangCoachPosition, dengfengCoachPosition];
	var curveLYtoDF = new BMapLib.CurveLine(pointsLYtoDF, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
	map.addOverlay(curveLYtoDF); //添加到地图中
	
	// 洛阳 - 西安
	var pointsLYtoXA = [luoyangLongmenTrainPosition, xianNorthTrainPosition];
	var curveLYtoXA = new BMapLib.CurveLine(pointsLYtoXA, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
	map.addOverlay(curveLYtoXA); //添加到地图中
	
	// 西安 - 华清池
	var pointsXAtoHQC = [xianTrainPosition, huaqingchiPosition];
	var curveXAtoHQC = new BMapLib.CurveLine(pointsXAtoHQC, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
	map.addOverlay(curveXAtoHQC); //添加到地图中
	
	// 华清池 - 兵马俑
	var pointsHQCtoBMY = [huaqingchiPosition, bingmayongPosition];
	var curveHQCtoBMY = new BMapLib.CurveLine(pointsHQCtoBMY, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
	map.addOverlay(curveHQCtoBMY); //添加到地图中
	
	
	// 西安 - 北京
	var pointsXAtoBJ = [xianTrainPosition, beijingXiTrainPosition];
	var curveXAtoBJ = new BMapLib.CurveLine(pointsXAtoBJ, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
	map.addOverlay(curveXAtoBJ); //添加到地图中
	
	
	
	
//	var pointsDFtoLY = [dengfengPosition, luoyangPosition];
//	var curveDFtoLY = new BMapLib.CurveLine(pointsDFtoLY, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
//	map.addOverlay(curveDFtoLY); //添加到地图中
	
	

}  
   
function bm_loadScript() {  
  var script = document.createElement("script");  
  script.src = "http://api.map.baidu.com/api?v=1.5&ak=G8ZmCp52CefWE6bPnekx0CzA&callback=initialize";//此为v1.5版本的引用方式  
  // http://api.map.baidu.com/api?v=1.5&ak=您的密钥&callback=initialize"; //此为v1.4版本及以前版本的引用方式  
  document.body.appendChild(script);  
}  
   

function addMarker(point, index, title, description){  // 创建图标对象   
	var myIcon = new BMap.Icon("./scripts/travel2014/markers/" + index + ".png", new BMap.Size(32, 37), {    
		// move icon into position    
		anchor: new BMap.Size(16, 36),    
	});      
	
	var marker = new BMap.Marker(point, {icon: myIcon});    
	map.addOverlay(marker);    
	
	addMyEventListener (marker, title, description) ;
}    

var marker;
function addMyEventListener (obj, title, description) { // obj should be marker.
	var sContent =
		"<h4 class='mapInfoWindowTitle'>" + title + "</h4>" + 
		"<p class='mapInfoWindowP'>" + description + "</p>";
	
	obj.addEventListener("click", function(){    
		var windowOpts = {
				width : 250,
				height: 200
		}
		var infoWindow = new BMap.InfoWindow(sContent, windowOpts);  // 创建信息窗口对象    
		this.openInfoWindow(infoWindow); 
		marker = this;
		console.log(this);
		console.log(obj);
		var mapCurrZoom = map.getZoom();
		
		if (mapCurrZoom <= 7) {
			mapCurrZoom = 10;
		}
		map.centerAndZoom(this.getPosition(), mapCurrZoom);

	});
	
	
	
}

window.onload = bm_loadScript;  