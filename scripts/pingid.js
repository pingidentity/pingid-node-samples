#!/usr/bin/env node

/*           
 * pingid - PingID API node module
 *
 * Note: This software is open sourced by Ping Identity but not supported commercially
 * as such. Any questions/issues should go to the Github issues tracker or discuss on
 * the Ping Identity developer communities.
 *
 * See also the DISCLAIMER file in this directory.
 *
 */

var jsrsasign = require("jsrsasign");
var fs = require("fs");
var readline = require("readline");
var https = require("https");

var JWS = jsrsasign.jws.JWS;

var pingidPropertiesFile = "pingid.properties";

var config = {
	"api_version" : "4.9",
	"use_base64_key" : "",
	"token" : "",
	"org_alias" : ""
}

module.exports  = {

	send_pingid_request: function(endpoint, requestBody, callback) {

		read_pingid_config(pingidPropertiesFile, function(response) {
	
			var apiEndpoint = config.base_url + endpoint;
	
			var jwtHeader = get_jwt_header(config);
			var jwtPayload = {
				"reqHeader" : {
					"orgAlias" : config.org_alias,
					"secretKey" : config.token,
					"timestamp" : get_pingid_timestamp(),
					"version" : config.api_version,
					"locale" : "en"
				},
				"reqBody" : requestBody
			}
	
			var pass = { "b64" : config.use_base64_key };
			var jws = JWS.sign("HS256", jwtHeader, jwtPayload, pass);
		
			send_http_request(endpoint, jws, function(response) {
				callback(response);
			});
		});
	},

	parse_pingid_response: function(apiResponse) {

		console.log("\nReceived API Response:");
		console.log(apiResponse);
	
		var pass = { "b64" : config.use_base64_key };
		var isSignatureValid = JWS.verify(apiResponse, pass, [ "HS256" ]); 
	
		if (isSignatureValid) {
			var jwtComponents = apiResponse.split('.');
			var jsonResponse = JSON.parse(new Buffer(jwtComponents[1], 'base64'));
		
			console.log("\nParsed API Response:");
			console.log(JSON.stringify(jsonResponse, null, 4));
		} else {
			console.log("\nERROR: Digital signature is invalid!");
		}
	}

}

function read_pingid_config(propertiesFile, callback) {

	var props = readline.createInterface({
		input: fs.createReadStream(propertiesFile),
		terminal: false
	});
	
	props.on('line', function(line) {
		if (line.indexOf('=') > -1) {

			var property = line.split('=');
		
			if (property[0] === "use_base64_key") {
				config.use_base64_key = property[1].replace('\\', '=');
			}
		
			if (property[0] === "token") {
				config.token = property[1];
			}

			if (property[0] === "org_alias") {
				config.org_alias = property[1];
			}
		}
	});

	props.on('close', function(resp) {
		callback(true);
	});
}

function get_jwt_header() {

	var jwtHeader = {
		"alg" : "HS256",
		"org_alias" : config.org_alias,
		"token" : config.token
	}
	
	return jwtHeader;
}

function get_pingid_timestamp() {
	return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

function send_http_request(endpoint, body, callback) {

	var httpHeaders = {
		"Content-Type" : "application/json",
		"Content-Length" : Buffer.byteLength(body, 'utf8'),
		"User-Agent" : "nodejs",
		"Accept" : "*/*"
	};
	
	var httpRequestOptions = {
		"host" : "idpxnyl3m.pingidentity.com",
		"port" : 443,
		"path" : "/pingid/rest/4/" + endpoint,
		"method" : "POST",
		"headers" : httpHeaders
	};
	
	var httpResponseData = "";
	
	var httpRequest = https.request(httpRequestOptions, function(response) {
	
		response.on('data', function(data) {
			httpResponseData += data;
		});
		
		response.on('end', function() {
			callback(httpResponseData);
		});
	});

	httpRequest.on('error', function(error) {
		throw error;
	});		
	
	console.log("\nSending JWS to PingID API: ");
	console.log(body);
	
	httpRequest.write(body);
	httpRequest.end();
}

