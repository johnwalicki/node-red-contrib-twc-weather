module.exports = function(RED) {
  function weatherPWSapikeyNode(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    //node.apikey = n.apikey;
  }
  RED.nodes.registerType("pwsapikey", weatherPWSapikeyNode, {
    credentials: {
      apikey: {type: "password"}
    }
  });

  function weatherPWSCurrentObsNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var StationId = n.stationid;
    var units = n.units;
    var name = n.name;
    var pwsConfigNode;
    var apiKey;
    var request = require('request-promise');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!units) {
      units = 'm';
    }

    node.on('input', function (msg) {
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
        request('https://api.weather.com/v2/pws/observations/current?stationId=' + WhichStationId +'&format=json&units='+units+'&apiKey='+apiKey)
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
  RED.nodes.registerType("pws-observations",weatherPWSCurrentObsNode);
}
