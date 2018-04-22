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
	
	$('#carousel-home').carousel();
	
	$(window).resize(function () {
		resizeCarouselImage();
	});
	
	resizeCarouselImage();
	
});


function resizeCarouselImage () {
	var screenHeight = $(window).height();
	var topSpace = $("nav").outerHeight();
	
	var imgMargin = $("#carousel-home img").outerHeight(true) - $("#carousel-home img").outerHeight();
	
	var allowedHeight = screenHeight - topSpace - imgMargin;
	$('#carousel-home img').height(allowedHeight);
	$('.carousel-indicators').offset({ top: screenHeight - 10 });
}