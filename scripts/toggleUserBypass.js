#!/usr/bin/env node

/*           
 * toggleUserBypass - toggle bypass PingID
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
	console.log("Usage: " + __filename + " <username> <# mins to bypass>");
	process.exit(-1);
}

var userName = process.argv[2];
var mins = process.argv[3];


function pingid_toggle_user_bypass(pingid_username, pingid_bypass_mins, callback) {

    var bypassUntil = new Date().getTime();
    var addMinutes = parseInt(pingid_bypass_mins);
	var addMillis = (addMinutes * 60) * 1000

	var operationEndpoint = "userbypass/do";
	var payload = {
		"userName" : pingid_username,
		"bypassUntil" : (addMinutes != 0) ? bypassUntil + addMillis : null,
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_toggle_user_bypass(userName, mins, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
