
// The following code is copied from
// https://devcenter.heroku.com/articles/s3-upload-node

(function() {
	console.log("loaded");
    document.getElementById("file_input").onchange = function(){
    	console.log("file changed");
        var files = document.getElementById("file_input").files;
        var file = files[0];
        if(file == null){
            alert("No file selected.");
        }
        else{
            get_signed_request(file);
        }
    };
})();



function get_signed_request(file){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sign_s3?file_name="+file.name+"&file_type="+file.type);
    console.log(xhr.readyState);
    xhr.onreadystatechange = function(){
    	console.log("xhr changed");
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                upload_file(file, response.signed_request, response.url);
            }
            else{
                alert("Could not get signed URL.");
            }
        }
    };
    xhr.send();
    console.log("end?");
}

function upload_file(file, signed_request, url){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
    	console.log(xhr.status);
        if (xhr.status === 200) {
        	console.log("success.");
        }
    };
    xhr.onerror = function() {
        alert("Could not upload file.");
    };
    xhr.send(file);
}


