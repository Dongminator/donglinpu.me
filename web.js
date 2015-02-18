var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var app = express();

var server = http.createServer(app);


app.use('/files', express.static('files'));
app.use('/scripts', express.static('scripts'));
app.use('/blog', express.static('blog'));


app.get('/', function(req, res){
	fs.readFile('index.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//Projects page
app.get('/projects', function(req, res){
	fs.readFile('projects.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//Travel 2014 page
app.get('/travel2014', function(req, res){
	fs.readFile('travel2014.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//Travel 2014 page
app.get('/ditu', function(req, res){
	fs.readFile('ditu.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//Routes CN
app.get('/routes-cn', function(req, res){
	fs.readFile('routes-cn.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//NYU application 
app.get('/nyu', function(req, res){
	fs.readFile('nyu.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//app.get('/nyu/:projID', function(req, res){
//	console.log(req.params.projID);
//	fs.readFile('nyu.html', function(err, file) {
//		res.setHeader('Content-Type', 'text/html');
//		res.setHeader('Content-Length', file.length);
//		res.end(file);
//	});
//});

//shortened url
app.get('/q', function(req, res){
	res.writeHead(302, {
		'Location': 'https://docs.google.com/forms/d/13EQuWjsa8E_IK2ANUcFHLqawFrJypFJlKwzQR89R-6s/viewform'
			//add other headers here...
	});
	res.end();
});

app.get('/t', function(req, res){
	res.writeHead(302, {
		'Location': 'https://docs.google.com/forms/d/1w_WATNgPNyMX8YWS6XIxVQ3ZMYezo9yu8JxtOYn6JH4/viewform'
			//add other headers here...
	});
	res.end();
});

app.get('/msopenhack2015', function(req, res){
	res.writeHead(302, {
		'Location': 'http://ftd.herokuapp.com'
			//add other headers here...
	});
	res.end();
});







// The following routes are for the USC Web Registration Mobile App competition

/*
 * 1. Courses (and Sections) - http://petri.esd.usc.edu/socAPI/Courses/[TERM]/[OPTIONS]
 * http://petri.esd.usc.edu/socAPI/Courses/20143/ - list all courses in 2014 fall -> /webreg/Courses/20143/
 * http://petri.esd.usc.edu/socAPI/Courses/20143/ALL - list all courses and sections -> /webreg/Courses/20143/all
 * http://petri.esd.usc.edu/socAPI/Courses/20143/ENGR - all courses for 20143, ENGR department -> /webreg/Courses/20143/ENGR
 * http://petri.esd.usc.edu/socAPI/Courses/20143/10334 -> http://localhost:3000/webreg/Courses/20143/10334
 * 
 */
app.get('/webreg/Courses/:term/*', function(request, response) {
	var term = request.params.term;
	var queryString = request.url;
	var queryStringArray = queryString.split("/");
	var option = queryStringArray[queryStringArray.length-1];
	
	var hostname = "petri.esd.usc.edu";
	var path = "/socAPI/Courses/" + term + "/" + option;
	
	var options = {
			hostname: hostname,
			path: path,
			method: 'GET'
	};
	
	sendRequest (options, response);
});

/*
 * 5. School - http://petri.esd.usc.edu/socAPI/Schools/  - > http://localhost:3000/webreg/Schools
 * 6. Department - http://petri.esd.usc.edu/socAPI/Schools/[DEPARTMENT_CODE] -> http://localhost:3000/webreg/Schools/BUAD
 */
app.get('/webreg/Schools/:dept', function(request, response) {
	var dept = request.params.dept;
	
	var options = {
			hostname: 'petri.esd.usc.edu',
			path: '/socAPI/Schools/' + dept,
			method: 'GET'
	};
	
	sendRequest(options, response);
});

/*
 * 2. Section (Individual) - http://petri.esd.usc.edu/socAPI/Sections/[SECTION_ID] -> http://localhost:3000/webreg/Sections/6780
 * 3. Term - http://petri.esd.usc.edu/socAPI/Terms/[TERM_CODE] - > http://localhost:3000/webreg/Terms/20143
 * 4. Session - http://petri.esd.usc.edu/socAPI/Sessions/[RNR_SESSION_ID] - > http://localhost:3000/webreg/Sessions/27
 */
app.get('/webreg/:arg1/:arg2', function(request, response) {
	console.log("using arg1, arg2 route: arg1:" + arg1 + " arg2:" + arg2);
	var arg1 = request.params.arg1;
	var arg2 = request.params.arg2;
	
	var hostname = "petri.esd.usc.edu";
	var path = "/socAPI/" + arg1 + "/" + arg2;
	
	var options = {
			hostname: hostname,
			path: path,
			method: 'GET'
	};
	
	sendRequest (options, response);
});

function sendRequest (options, response) {
	var body = "";
	var req = http.request(options, function(res) { // res is IncomingMessage help: http://nodejs.org/api/http.html#http_http_incomingmessage
		// res.statusCode
		res.setEncoding("utf8");
		res.on('data', function (chunk) {// this happens multiple times! So need to use 'body' to collect all data
			body += chunk;
		});
		
		var data="";
		res.on('end', function () { // when we have full 'body', convert to JSON and send back to client.
			try {
				data = JSON.parse(body);
		    } catch (er) {
		    	// something wrong with JSON
		    	response.statusCode = 400;
		    	return response.end('error: ' + er.message);
		    }

		    // redirect to app home	   
		    response.setHeader("Access-Control-Allow-Origin", '*');
		    response.send(data);
		    response.end();
		  });
	});
	req.end();
}

var port = process.env.PORT || 3000;
server.listen(port);
