#!/usr/bin/env node

/*           
 * pairYubiKey - pair YubiKey to user
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
	console.log("Usage: " + __filename + " <username> <YubiKey OTP>");
	process.exit(-1);
}

var userName = process.argv[2];
var otp = process.argv[3];


function pingid_pair_yubikey(pingid_username, pingid_otp, callback) {

	var operationEndpoint = "pairyubikey/do";
	var payload = {
		"username" : pingid_username,
		"otp" : pingid_otp,
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_pair_yubikey(userName, otp, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
