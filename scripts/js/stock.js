
console.log("stock.js");

var g_data;

var data_offline;
var data_csv;

$( document ).ready(function() {
	
	var dim = {
	        width: 960, height: 450,
	        margin: { top: 20, right: 50, bottom: 30, left: 50 },
	        ohlc: { height: 305 },
	        indicator: { height: 65, padding: 5 }
    };
    dim.plot = {
        width: dim.width - dim.margin.left - dim.margin.right,
        height: dim.height - dim.margin.top - dim.margin.bottom
    };
    dim.indicator.top = dim.ohlc.height+dim.indicator.padding;
    dim.indicator.bottom = dim.indicator.top+dim.indicator.height+dim.indicator.padding;

    var indicatorTop = d3.scaleLinear()
            .range([dim.indicator.top, dim.indicator.bottom]);

    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
    
    var zoom = d3.zoom().on("zoom", zoomed);

    var x = techan.scale.financetime().range([0, dim.plot.width]);

    var y = d3.scaleLinear().range([dim.ohlc.height, 0]);

    var yPercent = y.copy();   // Same as y at this stage, will get a different domain later

    var yInit, yPercentInit, zoomableInit;

    var yVolume = d3.scaleLinear()
            .range([y(0), y(0.2)]);

    var candlestick = techan.plot.candlestick().xScale(x).yScale(y);

    var volume = techan.plot.volume()
            .accessor(candlestick.accessor())   // Set the accessor to a ohlc accessor so we get highlighted bars
            .xScale(x)
            .yScale(yVolume);


    var xAxis = d3.axisBottom(x);

    var timeAnnotation = techan.plot.axisannotation()
            .axis(xAxis)
            .orient('bottom')
            .format(d3.timeFormat('%Y-%m-%d'))
            .width(65)
            .translate([0, dim.plot.height]);

    var yAxis = d3.axisRight(y);

    var ohlcAnnotation = techan.plot.axisannotation()
            .axis(yAxis)
            .orient('right')
            .format(d3.format(',.2f'))
            .translate([x(1), 0]);

    var percentAxis = d3.axisLeft(yPercent)
            .tickFormat(d3.format('+.1%'));

    var percentAnnotation = techan.plot.axisannotation()
            .axis(percentAxis)
            .orient('left');

    var volumeAxis = d3.axisRight(yVolume)
            .ticks(3)
            .tickFormat(d3.format(",.3s"));

    var volumeAnnotation = techan.plot.axisannotation()
            .axis(volumeAxis)
            .orient("right")
            .width(35);

    var rsiScale = d3.scaleLinear()
            .range([indicatorTop(0)+dim.indicator.height, indicatorTop(0)]);


    var rsi = techan.plot.rsi()
            .xScale(x)
            .yScale(rsiScale);

    var rsiAxis = d3.axisRight(rsiScale)
            .ticks(3);

    var rsiAnnotation = techan.plot.axisannotation()
            .axis(rsiAxis)
            .orient("right")
            .format(d3.format(',.2f'))
            .translate([x(1), 0]);

    var rsiAxisLeft = d3.axisLeft(rsiScale)
            .ticks(3);

    var rsiAnnotationLeft = techan.plot.axisannotation()
            .axis(rsiAxisLeft)
            .orient("left")
            .format(d3.format(',.2f'));

    var ohlcCrosshair = techan.plot.crosshair()
            .xScale(timeAnnotation.axis().scale())
            .yScale(ohlcAnnotation.axis().scale())
            .xAnnotation(timeAnnotation)
            .yAnnotation([ohlcAnnotation, percentAnnotation, volumeAnnotation])
            .verticalWireRange([0, dim.plot.height]);

  

    var rsiCrosshair = techan.plot.crosshair()
            .xScale(timeAnnotation.axis().scale())
            .yScale(rsiAnnotation.axis().scale())
            .xAnnotation(timeAnnotation)
            .yAnnotation([rsiAnnotation, rsiAnnotationLeft])
            .verticalWireRange([0, dim.plot.height]);

    var svg = d3.select("body").append("svg")
            .attr("width", dim.width)
            .attr("height", dim.height);

    var defs = svg.append("defs");

    defs.append("clipPath")
            .attr("id", "ohlcClip")
        .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", dim.plot.width)
            .attr("height", dim.ohlc.height);

    defs.selectAll("indicatorClip").data([0, 1])
        .enter()
            .append("clipPath")
            .attr("id", function(d, i) { return "indicatorClip-" + i; })
        .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i) { return indicatorTop(i); })
            .attr("width", dim.plot.width)
            .attr("height", dim.indicator.height);

    svg = svg.append("g")
            .attr("transform", "translate(" + dim.margin.left + "," + dim.margin.top + ")");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + dim.plot.height + ")");

    var ohlcSelection = svg.append("g")
            .attr("class", "ohlc")
            .attr("transform", "translate(0,0)");

    ohlcSelection.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + x(1) + ",0)")
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -12)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

    ohlcSelection.append("g")
            .attr("class", "close annotation up");

    ohlcSelection.append("g")
            .attr("class", "volume")
            .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
            .attr("class", "candlestick")
            .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
            .attr("class", "indicator sma ma-0")
            .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
            .attr("class", "indicator sma ma-1")
            .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
            .attr("class", "indicator ema ma-2")
            .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
            .attr("class", "percent axis");

    ohlcSelection.append("g")
            .attr("class", "volume axis");

    var indicatorSelection = svg.selectAll("svg > g.indicator").data(["rsi"]).enter()
             .append("g")
                .attr("class", function(d) { return d + " indicator"; });

    indicatorSelection.append("g")
            .attr("class", "axis right")
            .attr("transform", "translate(" + x(1) + ",0)");

    indicatorSelection.append("g")
            .attr("class", "axis left")
            .attr("transform", "translate(" + x(0) + ",0)");

    indicatorSelection.append("g")
            .attr("class", "indicator-plot")
            .attr("clip-path", function(d, i) { return "url(#indicatorClip-" + i + ")"; });

    // Add interactions last to be above zoom pane
    svg.append('g')
            .attr("class", "crosshair ohlc");


    svg.append('g')
            .attr("class", "crosshair rsi");

    var accessor = candlestick.accessor(),
		indicatorPreRoll = 33;  // Don't show where indicators don't have data

    
    
    d3.json("offline", function(error, data){
    	g_data = data;
    	console.log(data);
    	
    	data_offline = data;
    	
    	var metadata = data["Meta Data"];
    	var timeseries = data["Time Series (5min)"];
    	
    	var newArray = [];
    	
    	for (key in timeseries) {
    		var timestamp = key;
    		var ohlcv = timeseries[key];
    		var obj = {
    				date: parseDate(key),
    				open: +ohlcv["1. open"],
    				high: +ohlcv["2. high"],
    				low: +ohlcv["3. low"],
    				close: +ohlcv["4. close"],
    				volume: +ohlcv["5. volume"]
    		}
    		console.log(obj);
    		newArray.push(obj);
    		
    	}
	     data = newArray.sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
	     drawData (data);
    });
    
//    d3.csv("scripts/js/data.csv", function(error, data) {
//        var accessor = candlestick.accessor(),
//            indicatorPreRoll = 33;  // Don't show where indicators don't have data
//
//        data = data.map(function(d) {
//            return {
//                date: parseDate(d.Date),
//                open: +d.Open,
//                high: +d.High,
//                low: +d.Low,
//                close: +d.Close,
//                volume: +d.Volume
//            };
//        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
//
//        drawData (data);
//    });
    
    function drawData (data) {
    	console.log(data);
		  x.domain(techan.scale.plot.time(data).domain());
		  y.domain(techan.scale.plot.ohlc(data.slice(indicatorPreRoll)).domain());
		  yPercent.domain(techan.scale.plot.percent(y, accessor(data[indicatorPreRoll])).domain());
		  yVolume.domain(techan.scale.plot.volume(data).domain());
		
		  var rsiData = techan.indicator.rsi()(data);
		  rsiScale.domain(techan.scale.plot.rsi(rsiData).domain());
		
		  svg.select("g.candlestick").datum(data).call(candlestick);
		//  svg.select("g.volume").datum(data).call(volume);
		//  svg.select("g.rsi .indicator-plot").datum(rsiData).call(rsi);
		
		  svg.select("g.crosshair.ohlc").call(ohlcCrosshair).call(zoom);
		  svg.select("g.crosshair.rsi").call(rsiCrosshair).call(zoom);
		
		  // Stash for zooming
		  zoomableInit = x.zoomable().domain([indicatorPreRoll, data.length]).copy(); // Zoom in a little to hide indicator preroll
		  yInit = y.copy();
		  yPercentInit = yPercent.copy();
		
		  draw();
    }

    function zoomed() {
        x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
        y.domain(d3.event.transform.rescaleY(yInit).domain());
        yPercent.domain(d3.event.transform.rescaleY(yPercentInit).domain());

        draw();
    }

    function draw() {
        svg.select("g.x.axis").call(xAxis);
        svg.select("g.ohlc .axis").call(yAxis);
        svg.select("g.percent.axis").call(percentAxis);
        svg.select("g.rsi .axis.right").call(rsiAxis);
        svg.select("g.rsi .axis.left").call(rsiAxisLeft);

        // We know the data does not change, a simple refresh that does not perform data joins will suffice.
        svg.select("g.candlestick").call(candlestick.refresh);
        svg.select("g.volume").call(volume.refresh);
        svg.select("g.rsi .indicator-plot").call(rsi.refresh);
        svg.select("g.crosshair.ohlc").call(ohlcCrosshair.refresh);
        svg.select("g.crosshair.rsi").call(rsiCrosshair.refresh);
        
    }

});



