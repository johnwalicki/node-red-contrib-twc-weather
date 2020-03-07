module.exports = function(RED) {
  function weatherTWCDailyForecastNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var units = n.units;
    var name = n.name;
    var locationtype = n.locationtype;
    var location= n.location;
    var lang = n.lang;
    var range = n.range;
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
    if (!range) {
      range = '5day';
    }

    node.on('input', function (msg) {
      msg.twcparams = msg.twcparams || {};

      if( typeof msg.twcparams.units == 'undefined' ) {
        msg.twcparams.units = units; // take the default or the node setting
      } else if( "emhEMH".indexOf(msg.twcparams.units) >= 0 ) {
        // passed in param is valid, override default or node setting
        msg.twcparams.units = msg.twcparams.units.toLowerCase();
      } else {
        msg.twcparams.units = units; // take the default or the node setting
      }

      if( typeof msg.twcparams.lang == 'undefined' ) {
        msg.twcparams.lang = lang;
      }

      if( typeof msg.twcparams.range == 'undefined' ) {
        msg.twcparams.range = range;
      }

      if( typeof msg.twcparams.location == 'undefined' ) {
        msg.twcparams.location = location;
      }

      if( typeof msg.twcparams.locationtype == 'undefined' ) {
        msg.twcparams.locationtype = locationtype;
      }

      request('https://api.weather.com/v3/wx/forecast/daily/'+msg.twcparams.range+'?'+ msg.twcparams.locationtype + '='+ msg.twcparams.location +'&format=json&language='+msg.twcparams.lang+'&units='+msg.twcparams.units+'&apiKey='+apiKey)
        .then(function (response) {
          msg.payload = JSON.parse(response);
          node.send(msg);
        })
        .catch(function (error) {
          node.send(msg);
        });
    });
  }
  RED.nodes.registerType("twc-daily-forecast",weatherTWCDailyForecastNode);
}
