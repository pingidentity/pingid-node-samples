#!/usr/bin/env node

/*           
 * editUser - edit PingID User
 *
 * Note: This software is open sourced by Ping Identity but not supported commercially
 * as such. Any questions/issues should go to the Github issues tracker or discuss on
 * the Ping Identity developer communities.
 *
 * See also the DISCLAIMER file in this directory.
 *
 */

var pingid = require("./pingid");

if (process.argv.length !== 6) {
	console.log("Usage: " + __filename + " <username> <firstname> <lastname> <email>");
	process.exit(-1);
}

var userName = process.argv[2];
var firstName = process.argv[3];
var lastName = process.argv[4];
var email = process.argv[5];


function pingid_edit_user(pingid_username, pingid_fname, pingid_lname, pingid_email, callback) {

	var operationEndpoint = "edituser/do";
	var payload = {
		"userName" : pingid_username,
		"fName" : pingid_fname,
		"lName" : pingid_lname,
		"email" : pingid_email,
		"role" : "REGULAR",
		"activateUser" : true,
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_edit_user(userName, firstName, lastName, email, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
