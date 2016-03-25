#!/usr/bin/env node

/*           
 * startOfflinePairing - start offline pairing
 *
 * Note: This software is open sourced by Ping Identity but not supported commercially
 * as such. Any questions/issues should go to the Github issues tracker or discuss on
 * the Ping Identity developer communities.
 *
 * See also the DISCLAIMER file in this directory.
 *
 */

var pingid = require("./pingid");

if (process.argv.length !== 5) {
	console.log("Usage: " + __filename + " <username> <method SMS|EMAIL|VOICE> <pairing data (phone # or email)>");
	process.exit(-1);
}

var userName = process.argv[2];
var method = process.argv[3];
var data = process.argv[4];


function pingid_start_offline_pairing(pingid_username, pingid_method, pingid_data, callback) {

	var operationEndpoint = "startofflinepairing/do";
	var payload = {
		"username" : pingid_username,
		"type" : pingid_method,
		"pairingData" : pingid_data,
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_start_offline_pairing(userName, method, data, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
