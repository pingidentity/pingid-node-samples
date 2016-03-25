#!/usr/bin/env node

/*           
 * getActivationCode - get PingID activation code
 *
 * Note: This software is open sourced by Ping Identity but not supported commercially
 * as such. Any questions/issues should go to the Github issues tracker or discuss on
 * the Ping Identity developer communities.
 *
 * See also the DISCLAIMER file in this directory.
 *
 */

var pingid = require("./pingid");

if (process.argv.length !== 3) {
	console.log("Usage: " + __filename + " <username>");
	process.exit(-1);
}

var userName = process.argv[2];


function pingid_get_activation_code(pingid_username, callback) {

	var operationEndpoint = "getactivationcode/do";
	var payload = {
		"userName" : pingid_username,
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_get_activation_code(userName, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
