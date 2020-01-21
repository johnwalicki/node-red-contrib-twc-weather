module.exports = function(RED) {
function weatherPWSHistoricalDataNode( n ) {
	RED.nodes.createNode(this,n );
	var node = this;
	var StationId = n.stationid;
	var units = n.units;
	var name = n.name;
	var range = n.range;
	var date = n.date;
	var pwsConfigNode;
	var apiKey;
	var request = require('request-promise');

	// Retrieve the config node
	pwsConfigNode = RED.nodes.getNode(n.apikey);
	apiKey = pwsConfigNode.credentials.apikey;

	if (!units) {
		units = 'm';
	}

	function datevalidation( v ) {
		var datestr =""+v // cast from number to string
		if (!/^\d{8}/.test(datestr)) { return false; }
		var year = datestr.substring(0,4);
		var month = datestr.substring(4,6);
		var day = datestr.substring(6,8);
		// Date.parse will return NaN if this isn't a valid date
		var time = Date.parse(year+"-"+month+"-"+day);
		return !isNaN(time);
	}

  function dateparser( msg ) {
		// Date validation and reformatting
		var teststr;
		if( msg.date ) {
			// The pws date to query was passed in as a msg key value pair
			// override any value specified in the edit panel
			var time = new Date(msg.date);
			if( !isNaN(time) ) {
				// msg.date contains a timestamp
				// Grab the date 2020-01-01 from the ISO format
				teststr = time.toISOString().substr(0,10);
			} else {
				// cast from number to string in case it was a number
				teststr = ""+msg.date;
			}
		} else {
			// Use the date provided in the edit panel
			teststr = date ;
		}
		var datestr;
		// reformat 2020-01-01 or 2020/01/01 to 20200101 required yyyymmdd format
		datestr = teststr.replace( /(\d{4})[\-/](\d{1,2})[\-/](\d{1,2})/, '$1$2$3' );

		if( !datestr || !datevalidation(datestr) ) {
			msg.payload = "Error: No or incorrect date format provided. yyyymmdd required.";
			node.send(msg);
			return null;
		}
		return datestr;
	}


	node.on('input', function (msg) {
    var datestr = dateparser( msg );
		if( !datestr ) {
			return;
		}

		var WhichStationId = "";
		if( msg.StationID ) {
			WhichStationId = msg.StationID.toUpperCase() ;
		} else {
			WhichStationId = StationId.toUpperCase()
		}
		if( !WhichStationId ) {
			// No StationID is set. Abort with error
			msg.payload = "Error: No StationID provided.";
			node.send(msg);
		} else {
			request('https://api.weather.com/v2/pws/history/'+ range + '?stationId='+ WhichStationId +'&format=json&date='+datestr+'&units='+units+'&apiKey='+apiKey)
					.then(function (response) {
							msg.payload = JSON.parse(response);
							node.send(msg);
					})
					.catch(function (error) {
							node.send(msg);
					});
		}
	});
}
RED.nodes.registerType("pws-historical",weatherPWSHistoricalDataNode);
}
