var en_us_script_url = "./scripts/travel2014/en_US.js";
var zh_cn_script_url = "./scripts/travel2014/zh_CN.js";


$(document).ready(function(){
	var cookie = document.cookie;
	if (cookie) {
		var cookieParam = cookie.split(";");
		var lang = getCookie("lang");
		
		if (lang == "EN") {
			loadScript(en_us_script_url);
			setCookie("lang","EN",30);
		} else {
			loadScript(zh_cn_script_url);
			setCookie("lang","ZH",30);
		}
	} else {
		loadScript(zh_cn_script_url);
		setCookie("lang","ZH",30);
	}
	
	$("#changeLanguage").click(function() {
        // load new language js
        if (lang == "EN") {
        	loadScript(zh_cn_script_url);
            setCookie("lang","ZH",30);
        } else {
        	loadScript(en_us_script_url);
            setCookie("lang","EN",30);
        }
		
        // refresh current page
        location.reload();
    });
	
	populateNavigation();
});


/*
 * after language file is loaded, execute the rest.
 */
function langFileReady () {
	
//	page(); // render page-specific content
	
	// language file has been loaded
	
	$("<h2>").text(str_note).appendTo($("#note"));
	$("#intro").text(str_intro);
	$("#changeLanguage").text(str_langChangeTo);
	
}

function loadScript(url, callback){
	callback = langFileReady;
    var script = document.createElement("script")
    script.type = "text/javascript";
    script.charset="utf-8"; // important for displaying Chinese characters

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
    	script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}

function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}



