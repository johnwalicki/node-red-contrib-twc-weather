module.exports = function(RED) {
  function weatherTWCHealthForecastNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var name = n.name;
    var locationtype = n.locationtype;
    var location= n.location;
    var lang = n.lang;
    var conditiontype = n.conditiontype;
    var range = n.range;
    var pwsConfigNode;
    var apiKey;
    var request = require('request-promise');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!lang) {
      lang = 'en-US';
    }

    node.on('input', function (msg) {
      msg.twcparams = msg.twcparams || {};

      if( typeof msg.twcparams.range == 'undefined' ) {
        msg.twcparams.range = range;
      }

      if( typeof msg.twcparams.conditiontype == 'undefined' ) {
        msg.twcparams.conditiontype = conditiontype;
      }

      if( typeof msg.twcparams.lang == 'undefined' ) {
        msg.twcparams.lang = lang;
      }

      if( typeof msg.twcparams.location == 'undefined' ) {
        msg.twcparams.location = location;
      }

      if( typeof msg.twcparams.locationtype == 'undefined' ) {
        msg.twcparams.locationtype = locationtype;
      }

      request('https://api.weather.com/v3/wx/forecast/daily/'+msg.twcparams.range+'/cognitiveHealth?'+ msg.twcparams.locationtype + '='+ msg.twcparams.location +'&conditionType='+msg.twcparams.conditiontype+'&format=json&language='+msg.twcparams.lang+'&apiKey='+apiKey)
        .then(function (response) {
          msg.payload = JSON.parse(response);
          node.send(msg);
        })
        .catch(function (error) {
          node.send(msg);
        });
    });
  }
  RED.nodes.registerType("twc-health-forecast",weatherTWCHealthForecastNode);
}
