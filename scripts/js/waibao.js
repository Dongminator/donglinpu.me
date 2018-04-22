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
	var screenWidth = $(window).width();
	
	var topSpace = $("nav").outerHeight();
	var imgMargin = $("#carousel-home img").outerHeight(true) - $("#carousel-home img").outerHeight();
	
	var allowedHeight = screenHeight - topSpace - imgMargin;
	
	$('#carousel-home img').height(allowedHeight);
	$('#carousel-home img').width("auto");
	
	if ($("#section1").hasClass("active")) {
		$('.carousel-indicators').offset({ top: screenHeight - 10 });
	}
	
	// check width
	var carouselWidth = $("#carousel-home").width()
	if (carouselWidth > screenWidth) {
		$('#carousel-home img').width("100%");
		$('#carousel-home img').height("auto");
	}
	
	
//	$('.carousel').carousel();
//    var deviceHeight = $( window ).height();
//    var navbarHeight = $(".navbar").height();
//    var imgHeight = deviceHeight - navbarHeight - 25;
//    $('.carousel-inner img').css("max-height",imgHeight+"px");
	
}