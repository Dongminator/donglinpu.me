$(document).ready(function(){
	populateNavigation();
	home();
});
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
	
	// Populate navigation #nyu-proj-nav.
	for (var i = 0; i < projects.length; i++) {
		var project_id = projects[i].getElementsByTagName('id')[0].textContent;
		var project_alias = projects[i].getElementsByTagName('shortened')[0].textContent;
		var a = $('<a></a>').attr('href', '/projects?proj=' + project_id).text(project_alias);
		var li = $('<li></li>').append(a).appendTo("#proj_dropdown");
		
//		<li>
//			<a href="a.com">a</a>
//		</li>
	}
	
}

function home () {
	$('.content').empty();
	var homepage = pages[0];
	appendH1(homepage);
	
	// Append news
	var news = homepage.getElementsByTagName('content');
	var table = $('<table></table>').attr('id','news_table');
	var tr = $('<tr></tr>');
	var td = $('<td></td>');
	for (var i = 0; i < news.length; i++) {
		var text = news[i].getElementsByTagName('text')[0];
		if (news[i].getElementsByTagName('links').length) {
			var links = news[i].getElementsByTagName('links')[0].getElementsByTagName('a');
		} else {
			links = [];
		}
		
		var date = news[i].getElementsByTagName('date')[0];
		
		var finalText = text.textContent + " (" + date.textContent + ")";
		
		// italic
		if (news[i].getElementsByTagName('i').length) {
			finalText = addStyle(finalText, 'i', news[i]);
		}
		
		for (var j = 0; j < links.length; j++) {
			finalText = subLink (links[j], finalText);
		}
		
		// Check if it is the most recent post.
		if ( i === 0 ) {
			var string = '(' + date.textContent + ')';
			var font = document.createElement('font');
			font.color='red';
			font.innerHTML = string;
			var tmp = document.createElement("div");
			tmp.appendChild(font);
			date.textContent
			finalText = finalText.replace(string, tmp.innerHTML);
		}
		
		var paragraph = $('<p></p>').append(finalText);
		if (news[i].getElementsByTagName('image').length) {
			var image = news[i].getElementsByTagName('image')[0];
			var src = image.getAttribute('src');
			
			var imgTag = $('<img>'); // tag name is img, not image!
			imgTag.attr('src', src);
			
			var childNodes = image.childNodes;
			for (var j = 0; j < childNodes.length; j++){
				if (childNodes[j].nodeName !== '#text') {
					var nodeName = childNodes[j].nodeName;
					var nodeValue = childNodes[j].textContent;
					imgTag.attr(nodeName, nodeValue);
				}
			}
			paragraph.append(imgTag);
		}
		td.append(paragraph);
	}
	table.append(tr.append(td));
	$('.content').append(table);
}

function projects (pageNav) {
	$('.content').empty();
	var projects = pages[1];
	appendH1(projects);
	
	// Append news
	var projects = projects.getElementsByTagName('project');
	for (var i = 0; i < projects.length; i++) {
		var title = projects[i].getElementsByTagName('title')[0].textContent;
		var url;
		if (projects[i].getElementsByTagName('url')[0]) url = projects[i].getElementsByTagName('url')[0].textContent;
		var id = projects[i].getElementsByTagName('id')[0].textContent;
		var descriptions = projects[i].getElementsByTagName('description')[0].getElementsByTagName('text');
		if (projects[i].getElementsByTagName('description')[0].getElementsByTagName('links').length) {
			var links = projects[i].getElementsByTagName('description')[0].getElementsByTagName('links')[0].getElementsByTagName('a');
		} else {
			var links = [];
		}
		
		
		$('<h2></h2>').append($('<a></a>').attr('href', url).attr('target', '_blank').attr('id', id).text(title)).appendTo($('.content'));
		
		for (var j = 0; j < descriptions.length; j++) {
			var paragraph = descriptions[j].textContent;
			
			for (var k = 0; k < links.length; k++) {
				paragraph = subLink (links[k], paragraph);
			}
			$('.content').append($('<p></p>').append(paragraph));
		}
	}
	if (pageNav) 
		window.location = String(window.location).replace(/\#.*$/, "") + pageNav;
}

function about () {
	$('.content').empty();
	var about = pages[2];
	appendH1(about);
}

function contact () {
	$('.content').empty();
	var contact = pages[2];
	console.log('cccc');
	console.log(contact);
	appendH1(contact);
	
	// Append news
	var items = contact.getElementsByTagName('content');
	for (var i = 0; i < items.length; i++) {
		if (items[i].getElementsByTagName('text').length) {
			var text = items[i].getElementsByTagName('text')[0];
			var links = items[i].getElementsByTagName('links')[0].getElementsByTagName('a');
			var finalText = text.textContent;
			for (var j = 0; j < links.length; j++) {
				finalText = subLink (links[j], finalText);
			}
			
			// bold
			if (items[i].getElementsByTagName('b').length) {
				finalText = addStyle(finalText, 'b', items[i]);
			}
			var toAppend = $('<p></p>').append(finalText);
		} else if (items[i].getElementsByTagName('image').length) {
			var image = items[i].getElementsByTagName('image')[0];
			var imgTag = $('<image>');
			imgTag.attr('src', image.getElementsByTagName('url')[0].textContent);
			imgTag.attr('width', image.getElementsByTagName('width')[0].textContent);
			imgTag.attr('height', image.getElementsByTagName('height')[0].textContent);
			imgTag.attr('alt', image.getElementsByTagName('alt')[0].textContent);
			var toAppend = imgTag;
		}
		
		$('.content').append(toAppend);
	}
}

function appendH1 (page) {
	if (page.getElementsByTagName('h1').length) {
		var h1text = page.getElementsByTagName('h1')[0].textContent;
		var h1 = $('<h1></h1>').text(h1text);
		$('.content').append(h1);
	} else {
//		console.log("no h1");
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