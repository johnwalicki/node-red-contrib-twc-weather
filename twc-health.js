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
      request('https://api.weather.com/v3/wx/forecast/daily/'+range+'/cognitiveHealth?'+ locationtype + '='+ location +'&conditionType='+conditiontype+'&format=json&language='+lang+'&apiKey='+apiKey)
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
