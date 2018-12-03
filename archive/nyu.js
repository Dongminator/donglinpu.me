var pages;
var projects;

var proj_id; // get proj_id from GET request
var proj_ids = new Array();

$(document).ready(function(){
	proj_id = window.location.search;
	
	populateNavigation();
	
	// display project. proj_id = "?proj=3rd"
	if (proj_id != "") { 
		proj_id = proj_id.substring(6);

		// if proj_id exist in content.xml
		// display project description
		// return -1 if proj_id is not in proj_ids
		
		var order = $.inArray(proj_id, proj_ids);
		if ( order > -1 ) {
			displayProject(order);
			
			// highlight selected project name in navigation
			$('#nyu-proj-nav').children().children()[order].className += " active"
		} else {
			// do nothing. home page still being displayed.
		}
		
		// else display nyu application home page. 
		// Add Home page here so when going to project pages, they do not load hometext first, then remove, then add project description.
	} else { // display home page
		var hometext = "<p><b>Area of Interest:</b> Software Engineering</p>"
		+ "<p><b>Goals and Objectives:</b> to master software engineering techniques. Be able to produce high quality software and applications individually or in a team.</p>"
		+ "<p>My past projects and coursework are listed on the left.</p>";
		
		$('#nyu-main').html(hometext);
		
	}
	
	// fancybox thunbnail
	$(".fancybox-thumb").fancybox({
		prevEffect	: 'none',
		nextEffect	: 'none',
		helpers	: {
			title	: {
				type: 'outside'
			},
			thumbs	: {
				width	: 50,
				height	: 50
			}
		}
	});
	
//	populateContent();
//	home();
});


function populateNavigation () {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET","scripts/content.xml",false);
	xmlhttp.send();
	var xmlDoc=xmlhttp.responseXML;
	
	pages = xmlDoc.getElementsByTagName('page');
	
	projects = pages[1].getElementsByTagName('project');
	
	// Populate navigation #nyu-proj-nav.
	for (var i = 0; i < projects.length; i++) {
		var project_id = projects[i].getElementsByTagName('id')[0].textContent;
		proj_ids.push(project_id);
		var project_alias = projects[i].getElementsByTagName('shortened')[0].textContent;
		var a = $('<a></a>').attr('href', '/nyu?proj=' + project_id).attr("class","list-group-item").text(project_alias);
		$("#nyu-proj-nav").children().append(a);
//		<a href="#" class="list-group-item active">Proj1</a>
	}
	
}


function populateContent () {
	
}


function displayProject (order) {
	$('#nyu-main').empty();
	var project = projects[order];
	
	var proj_title = project.getElementsByTagName('title')[0].textContent;
	var proj_url;
	if (project.getElementsByTagName('url')[0]) proj_url = project.getElementsByTagName('url')[0].textContent;
	var proj_id = project.getElementsByTagName('id')[0].textContent;
	appendH1(proj_title, proj_url, proj_id);
	
	var proj_descriptions = project.getElementsByTagName('description')[0].getElementsByTagName('text');
	
	var links = [];
	if (project.getElementsByTagName('description')[0].getElementsByTagName('links').length) {
		links = project.getElementsByTagName('description')[0].getElementsByTagName('links')[0].getElementsByTagName('a');
	}
	
	for (var i = 0; i < proj_descriptions.length; i++) {
		var paragraph = proj_descriptions[i].textContent;
		
		for (var j = 0; j < links.length; j++) {
			paragraph = subLink (links[j], paragraph);
		}
		$('#nyu-main').append($('<p></p>').append(paragraph));
	}
	
	
	var proj_photos = project.getElementsByTagName('description')[0].getElementsByTagName('image');
	
	var fancyBoxPara = $('<p></p>').attr('id','fancyBoxPara').css('display', 'block').appendTo('#nyu-main');
	
	
	for (var i = 0; i < proj_photos.length; i++) {
		var proj_image_url = proj_photos[i].textContent;
		
		$('<a></a>').addClass('fancybox-thumb').attr('rel','3yp').attr('href',proj_image_url).append( $('<img></img>').attr('src', proj_image_url).attr('alt',"").css('width',parseInt($('#nyu-main').width())/proj_photos.length + "px").css('border', '1px solid white') ).appendTo('#fancyBoxPara');
	}
	
	
	
}


function appendH1 (proj_title, proj_url, proj_id) {
	var h1 = $('<h1></h1>').append( $('<a></a>').attr('href', proj_url).attr('target', '_blank').attr('id', proj_id).text(proj_title) ).css('display','inline-block').appendTo('#nyu-main'); // Make it inline so the width of h1 is the width of text
	
	// adjuest h1 width. So it does not exceed one line. 
	var hi1width = h1.width();
	var nyuMainWidth = $('#nyu-main').width();
	
	var h1FontSize = $("h1").css("font-size");
	var h1FontSizeInt = h1FontSize.substring(0, h1FontSize.length - 2); /*remove unit from integer*/
	
	while ( hi1width >= nyuMainWidth){
		h1FontSize = $("h1").css("font-size");
		h1FontSizeInt = h1FontSize.substring(0, h1FontSize.length - 2); /*remove unit from integer*/
		h1FontSizeInt = h1FontSizeInt - 1;
		
	    $("h1").css("font-size", h1FontSizeInt + "px");
	    hi1width = h1.width();
	    nyuMainWidth = $('#nyu-main').width();
	}
}

// Add bold or italic to originalStr base on i, b in item (a <content> tag)
function addStyle (originalStr, type, item) {
	for (var j = 0; j < item.getElementsByTagName(type).length; j++) {
		var string = item.getElementsByTagName(type)[j].textContent;
		var italic = document.createElement(type);
		italic.innerHTML = string;
		var tmp = document.createElement("div");
		tmp.appendChild(italic);
		toReturn = originalStr.replace(string, tmp.innerHTML);
	}
	return toReturn;
}

function subLink (link, text) {
	var href = link.getElementsByTagName('href')[0].textContent;
	var string = link.getAttribute('string');
	var a = document.createElement('a');
	a.href = href;
	a.innerHTML = string;
	if (link.getElementsByTagName('onclick').length) {
		var onclick = link.getElementsByTagName('onclick')[0].textContent;
		a.setAttribute('onclick', onclick);
	}
	if (link.getElementsByTagName('target').length) {
		var target = link.getElementsByTagName('target')[0].textContent;
		a.target = target;
	}
	var tmp = document.createElement("div");
	tmp.appendChild(a);
	return text.replace(string, tmp.innerHTML);
}