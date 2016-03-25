#!/usr/bin/env node

/*           
 * deleteUser - Delete PingID User
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


function pingid_delete_user(pingid_username, callback) {

	var operationEndpoint = "deleteuser/do";
	var payload = {
		"userName" : pingid_username,
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_delete_user(userName, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
