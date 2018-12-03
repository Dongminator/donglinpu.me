var pages;
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
	
	console.log(projects);
	// Populate navigation #nyu-proj-nav.
	
	// <a class="dropdown-item" href="#">Action</a>
	for (var i = 0; i < projects.length; i++) {
		var project_id = projects[i].getElementsByTagName('id')[0].textContent;
		var project_alias = projects[i].getElementsByTagName('shortened')[0].textContent;
		var a = $('<a></a>').addClass("dropdown-item").attr('href', '/projects?proj=' + project_id).text(project_alias).appendTo("#proj_dropdown");
	}
}