var express = require('express');
var fs = require('fs');
var app = express();

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


var port = process.env.PORT || 3000;
app.listen(port);
