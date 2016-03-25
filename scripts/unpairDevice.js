#!/usr/bin/env node

/*           
 * unpairDevice - unpair PingID device
 *
 * Note: This software is open sourced by Ping Identity but not supported commercially
 * as such. Any questions/issues should go to the Github issues tracker or discuss on
 * the Ping Identity developer communities.
 *
 * See also the DISCLAIMER file in this directory.
 *
 */

var pingid = require("./pingid");

if (process.argv.length < 3) {
	console.log("Usage: " + __filename + " <username> [deviceId]");
	process.exit(-1);
}

var userName = process.argv[2];
var deviceId = null;

if (process.argv.length == 4) {
	deviceId = process.argv[3];
}


function pingid_unpair_device(pingid_username, pingid_deviceid, callback) {

	var operationEndpoint = "unpairdevice/do";
	var payload = {
		"userName" : pingid_username,
		"deviceId" : (pingid_deviceid == null) ? null : parseInt(pingid_deviceid),
		"clientData" : null
	};

	pingid.send_pingid_request(operationEndpoint, payload, function(apiResponse) {
		callback(apiResponse);
	});
}


/**********[ MAIN LOOP ]**********/

pingid_unpair_device(userName, deviceId, function(apiResponse) {
	pingid.parse_pingid_response(apiResponse);
});
