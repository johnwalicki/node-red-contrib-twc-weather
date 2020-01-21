module.exports = function(RED) {
  function weatherPWS7DaySummaryNode( n ) {
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
        request('https://api.weather.com/v2/pws/dailysummary/7day?stationId=' + StationId +'&format=json&units='+units+'&apiKey='+apiKey)
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
  RED.nodes.registerType("pws-7day-summary",weatherPWS7DaySummaryNode);

  ///
  function weatherPWS7DayHourlyNode( n ) {
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
      if( msg.StationID ) {
        StationId = msg.StationID ;
      }
      if( !StationId ) {
        // No StationID is set. Abort with error
        msg.payload = "Error: No StationID provided.";
        node.send(msg);
      } else {
        request('https://api.weather.com/v2/pws/observations/hourly/7day?stationId=' + StationId +'&format=json&units='+units+'&apiKey='+apiKey)
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
  RED.nodes.registerType("pws-7day-hourly",weatherPWS7DayHourlyNode);

  /// 
  function weatherPWS1DayRapidNode( n ) {
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
      if( msg.StationID ) {
        StationId = msg.StationID ;
      }
      if( !StationId ) {
        // No StationID is set. Abort with error
        msg.payload = "Error: No StationID provided.";
        node.send(msg);
      } else {
        request('https://api.weather.com/v2/pws/observations/all/1day?stationId=' + StationId +'&format=json&units='+units+'&apiKey='+apiKey)
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
  RED.nodes.registerType("pws-1day-all",weatherPWS1DayRapidNode);
}
