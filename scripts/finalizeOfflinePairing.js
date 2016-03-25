#!/usr/bin/env node

/*           
 * finalizeOfflinePairing - finalize offline pairing session
 *
 * Note: This software is open sourced by Ping Identity but not supported commercially
 * as such. Any questions/issues should go to the Github issues tracker or discuss on
 * the Ping Identity developer communities.
 *
 * See also the DISCLAIMER file in this directory.
 *
 */

var pingid = require("./pingid");

if (process.argv.length !== 4) {
	console.log("Usage: " + __filename + " <session id> <otp>");
	process.exit(-1);
}

var sessionId = process.argv[2];
var otp = process.argv[3];


function pingid_finalize_offline_pairing(pingid_sessionid, pingid_otp, callback) {

	var operationEndpoint = "finalizeofflinepairing/do";
	var payload = {
		"sessionId" : pingid_sessionid,
		"otp" : pingid_otp,
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_finalize_offline_pairing(sessionId, otp, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
