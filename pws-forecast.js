module.exports = function(RED) {
function weatherPWS5DayForecastNode( n ) {
	RED.nodes.createNode(this,n );
	var node = this;
	var units = n.units;
	var name = n.name;
	var locationtype = n.locationtype;
	var location= n.location;
	var lang = n.lang;
	var pwsConfigNode;
	var apiKey;
	var request = require('request-promise');

	// Retrieve the config node
	pwsConfigNode = RED.nodes.getNode(n.apikey);
	apiKey = pwsConfigNode.credentials.apikey;

	if (!units) {
		units = 'm';
	}
	if (!lang) {
		lang = 'en-US';
	}

	node.on('input', function (msg) {
		  request('https://api.weather.com/v3/wx/forecast/daily/5day?'+ locationtype + '='+ location +'&format=json&language='+lang+'&units='+units+'&apiKey='+apiKey)
					.then(function (response) {
							msg.payload = JSON.parse(response);
							node.send(msg);
					})
					.catch(function (error) {
							node.send(msg);
					});
	});
}
RED.nodes.registerType("pws-forecast",weatherPWS5DayForecastNode);
}
