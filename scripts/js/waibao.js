$(document).ready(function() {
	
	$('#pagepiling').pagepiling({
		menu: '#menu',
		anchors: ['home', 'about', 'case', 'pricing'],
	    sectionsColor: ['white', '#ee005a', '#2C3E50', '#39C'],
	    navigation: {
	    		'position': 'right',
	   		'tooltips': ['Page 1', 'Page 2', 'Page 3', 'Page 4']
	   	}
	});

	resizeHeightSet();
	
	$('#carousel-home').carousel();
	
	$(window).on('resize orientationchange', function() {
		resizeHeightSet();	
	});
	
	
});

function resizeHeightSet(){
	var screenHeight = $(window).height();
	var topSpace = $("nav").outerHeight();
	
	
	if ($("#section1").hasClass("active")) {
		var imgHeight = $('#carousel-home .active img').height();
		var neededTop = (screenHeight - topSpace - imgHeight)/2;
		console.log(screenHeight + " " + topSpace + " " + imgHeight + " = " + neededTop);
		$('#carousel-home .carousel-inner').css("top", neededTop);
		$('.carousel-indicators').offset({ top: screenHeight - 10 });
	}
}