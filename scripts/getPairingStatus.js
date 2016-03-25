#!/usr/bin/env node

/*           
 * getPairingStatus - get pairing status of a device
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
	console.log("Usage: " + __filename + " <activation code>");
	process.exit(-1);
}

var activationCode = process.argv[2];


function pingid_get_pairing_status(pingid_activation_code, callback) {

	var operationEndpoint = "pairingstatus/do";
	var payload = {
		"activationCode" : pingid_activation_code,
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_get_pairing_status(activationCode, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
