var express = require('express');
var fs = require('fs');
var bodyParser  = require("body-parser");
var http = require('http');
var https = require('https');
var app = express();
var less = require('less');
var aws = require('aws-sdk');

require('dotenv').config();

//Connection URL
const url = process.env.list_db_url;

//Database Name
const dbName = process.env.list_db_name;

//Collection Name
const dbCollectionName = process.env.list_db_collection;

//Run separate https server if on localhost
var privateKey = fs.readFileSync('localhost/localhost.key').toString();
var certificate = fs.readFileSync('localhost/localhost.crt').toString();

var options = {
  key : privateKey
, cert : certificate
}

var port = process.env.PORT || 3000;
process.env['PORT'] = process.env.PORT || 4000; // Used by https on localhost


var FB_APP_ID = process.env.list_fb_app_id;

console.log(port);
console.log(process.env['PORT']);

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

var server = http.createServer(app);

server.listen(port, function () {
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

if (process.env.NODE_ENV != 'production') {
	https.createServer(options, app).listen(process.env.PORT, function () {
		console.log("Express server listening with https on port %d in %s mode", this.address().port, app.settings.env);
	});
};


// if (process.env.NODE_ENV === 'production') {
// 	// Force redirect of HTTP to HTTPS
// 	var forceSsl = function (req, res, next) {
// 		if (req.headers['x-forwarded-proto'] !== 'https') {
// 			return res.redirect(['https://', req.get('Host'), req.url].join(''));
// 		}
// 		return next();
// 	};
// 	app.use(forceSsl);
// }
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('static'));
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

app.get('/less', function(req, res){
	fs.readFile('less.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

app.get('/lessDemo', function(req, res){
	fs.readFile('scripts/css/lessDemo.less', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		
		less.render(data, function(error, output){
			fs.writeFile("scripts/css/lessDemo.css", output.css, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    
			    // After CSS is compiled, output less.html
			    fs.readFile('lessDemo.html', function(err, file) {
					res.setHeader('Content-Type', 'text/html');
					res.setHeader('Content-Length', file.length);
					res.end(file);
				});
			    
			}); 
		});
	});
});


//Referral page
app.get('/referral', function(req, res){
	fs.readFile('referral.html', function(err, file) {
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

//privary
app.get('/privacy', function(req, res){
	fs.readFile('privacy-policy.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//privary
app.get('/tos', function(req, res){
	fs.readFile('terms-of-service.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});


app.get('/waibao', function(req, res){
	fs.readFile('waibao.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});


//EasyReg project page
app.get('/easyreg', function(req, res){
	fs.readFile('easyreg.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//EasyReg Nan Ke
app.get('/easyreg/nanke', function(req, res){
	fs.readFile('easyreg-team.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//EasyReg Zeyu Luo
app.get('/easyreg/zeyuluo', function(req, res){
	fs.readFile('easyreg-team.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//EasyReg Zhiqi Liang
app.get('/easyreg/zhiqiliang', function(req, res){
	fs.readFile('easyreg-team.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//EasyReg Junyan Jiang
app.get('/easyreg/junyanjiang', function(req, res){
	fs.readFile('easyreg-team.html', function(err, file) {
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

//Route
app.get('/route', function(req, res){
	fs.readFile('route.html', function(err, file) {
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



// CSCI572 HW1 test page
app.get('/csci572', function(req, res){
	fs.readFile('csci572/csci572.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

// CSCI572 test page
app.get('/csci572/:testDocId', function(req, res){
	fs.readFile('csci572/' + req.params.testDocId + '.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

//NYU application 
app.get('/nyu', function(req, res){
//	fs.readFile('nyu.html', function(err, file) {
//		res.setHeader('Content-Type', 'text/html');
//		res.setHeader('Content-Length', file.length);
//		res.end(file);
//	});
	res.redirect("/");
});

app.get('/webregTest', function(req, res) {
	fs.readFile('webregTest.html', function(err, file) {
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
//	res.writeHead(302, {
//		'Location': 'https://docs.google.com/forms/d/13EQuWjsa8E_IK2ANUcFHLqawFrJypFJlKwzQR89R-6s/viewform'
//			//add other headers here...
//	});
//	res.end();
	res.redirect("/");
});

app.get('/t', function(req, res){
//	res.writeHead(302, {
//		'Location': 'https://docs.google.com/forms/d/1w_WATNgPNyMX8YWS6XIxVQ3ZMYezo9yu8JxtOYn6JH4/viewform'
//			//add other headers here...
//	});
//	res.end();
	res.redirect("/");
});

app.get('/msopenhack2015', function(req, res){
	res.writeHead(302, {
		'Location': 'http://ftd.herokuapp.com'
			//add other headers here...
	});
	res.end();
});



// Get GPS information of photos uploaded on iPhone
app.get('/photoGps', function(req, res){
	console.log(AWS_ACCESS_KEY);
	console.log(AWS_SECRET_KEY);
	console.log(S3_BUCKET);
	
	fs.readFile('photoGps.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

app.get('/sign_s3', function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
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
	
	var path = "/socAPI/Courses/" + term + "/" + option;
	console.log(path);
	var options = {
			hostname: petri.esd.usc.edu,
			path: path,
			method: 'GET'
	};
	
	sendRequest (options, response);
});

/*
 * 5. School - http://petri.esd.usc.edu/socAPI/Schools/  - > http://localhost:3000/webreg/Schools/
 * 6. Department - http://petri.esd.usc.edu/socAPI/Schools/[DEPARTMENT_CODE] -> http://localhost:3000/webreg/Schools/BUAD
 */
app.get('/webreg/Schools/*', function(request, response) {
	var queryString = request.url;
	var queryStringArray = queryString.split("/");
	var dept = queryStringArray[queryStringArray.length-1];

	var path = "/socAPI/Schools/" + dept;
	console.log(path);
	var options = {
			hostname: "petri.esd.usc.edu",
			path: path,
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
	var arg1 = request.params.arg1;
	var arg2 = request.params.arg2;
	console.log("using arg1, arg2 route: arg1:" + arg1 + " arg2:" + arg2);
	
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


//Projects page
app.get('/stock', function(req, res){
	fs.readFile('stock.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});


/*
 * JSON template
 * 
Date,		Open,	High,	Low,	Close,Volume
9-Jun-14,	62.40,	63.34,	61.79,	62.88,37617413
 
[{"Date":"9-Jun-14","Open":62.40,"High":63.34,"Low":61.79,"close":"62.88","Volume":37617413},
{"Date":"9-Jun-14","Open":62.40,"High":63.34,"Low":61.79,"close":"62.88","Volume":37617413},
{"Date":"9-Jun-14","Open":62.40,"High":63.34,"Low":61.79,"close":"62.88","Volume":37617413},
{"Date":"9-Jun-14","Open":62.40,"High":63.34,"Low":61.79,"close":"62.88","Volume":37617413},
{"Date":"9-Jun-14","Open":62.40,"High":63.34,"Low":61.79,"close":"62.88","Volume":37617413}
]

 */

app.get('/offline', function(request, response){
	var obj = JSON.parse(fs.readFileSync('scripts/css/offline.json', 'utf8'));
	response.send(obj);
    response.end();
});

var AlphaVantageAPI = "IJHVVYK24IE8R6SR";
var AlphaVantageBasePath = "/query?apikey=" + AlphaVantageAPI + "&function=";
app.get('/stock/:arg1/:arg2?', function(request, response){
	var ticker = request.params.arg1;
	var interval = request.params.arg2;
	console.log(ticker);
	console.log(interval);
	
	if (typeof interval == 'undefined' || interval.length < 4) {
		interval = "1min"
	}
	
	var path = AlphaVantageBasePath + "TIME_SERIES_INTRADAY" 
			+ "&symbol=" + ticker
			+ "&interval=" + interval;
	console.log(path);
	var body = "";
	var options = {
			hostname: "www.alphavantage.co",
			port: 443,
			path: path,
			method: 'GET'
	};
	
	var req = https.request(options, function(res) { // res is IncomingMessage help: http://nodejs.org/api/http.html#http_http_incomingmessage
//		console.log('statusCode:', res.statusCode);
//		console.log('headers:', res.headers);
		
		res.on('data', function (chunk) {// this happens multiple times! So need to use 'body' to collect all data
			body += chunk;
		});
		
		res.on('end', function(){
//			console.log(body);
			response.send(body);
		    response.end();
		});
		
		
		// res.statusCode
//		res.setEncoding("utf8");
//		res.on('end', function () { // when we have full 'body', convert to JSON and send back to client.
//			try {
//				data = JSON.parse(body);
//		    } catch (er) {
//		    	// something wrong with JSON
//		    	response.statusCode = 400;
//		    	return response.end('error: ' + er.message);
//		    }
//
//		    // redirect to app home	   
//		    response.setHeader("Access-Control-Allow-Origin", '*');
//		    response.send(data);
//		    response.end();
//		  });
	});
	
	req.on('error', function (e) {
		  console.error(e);	  
	});
	req.end();
});


// list
app.get('/list', function(req, res){
	res.redirect("https://www.zhelist.com");
});

app.get('/fi*', async function(req, res){
	await delay(5000);
	res.send();
});
app.post('/fi*', async function(req, res){
	await delay(5000);
	res.send();
});
app.put('/fi*', async function(req, res){
	await delay(5000);
	res.send();
});

function delay (x) {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			try {
				resolve({
					resp: "timeout after 5s"
				});
			} catch (e) {
				return reject(e);
			}
		}, x ?? 5000)
	});
}