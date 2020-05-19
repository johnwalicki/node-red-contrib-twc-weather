module.exports = function(RED) {
  function weatherPWS7DaySummaryNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var StationId = n.stationid;
    var units = n.units;
    var name = n.name;
    var pwsConfigNode;
    var apiKey;
    const axios = require('axios');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!units) {
      units = 'm';
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

      var curStationId = StationId;
      if( typeof msg.twcparams.StationID != 'undefined' ) {
        curStationId = msg.twcparams.StationID.toUpperCase();
      }
      if( !curStationId ) {
        // No StationID is set. Abort with error
        msg.payload = "Error: No StationID provided.";
        node.send(msg);
      } else {
        msg.twcparams.StationID = curStationId;

        (async () => {
          try {
            const response = await axios.get('https://api.weather.com/v2/pws/dailysummary/7day?stationId=' + msg.twcparams.StationID +'&format=json&units='+msg.twcparams.units+'&apiKey='+apiKey);
            //console.log(response.data)
            msg.payload = response.data;
            node.send(msg);
          } catch (error) {
            console.log(error.response.data);
            //console.log(error.response.status);
            node.warn(error.response.data);
            node.send(msg);
          }
        })();
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
    const axios = require('axios');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!units) {
      units = 'm';
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

      var curStationId = StationId;
      if( typeof msg.twcparams.StationID != 'undefined' ) {
        curStationId = msg.twcparams.StationID.toUpperCase();
      }
      if( !curStationId ) {
        // No StationID is set. Abort with error
        msg.payload = "Error: No StationID provided.";
        node.send(msg);
      } else {
        msg.twcparams.StationID = curStationId;

        (async () => {
          try {
            const response = await axios.get('https://api.weather.com/v2/pws/observations/hourly/7day?stationId=' + msg.twcparams.StationID +'&format=json&units='+msg.twcparams.units+'&apiKey='+apiKey);
            //console.log(response.data)
            msg.payload = response.data;
            node.send(msg);
          } catch (error) {
            console.log(error.response.data);
            //console.log(error.response.status);
            node.warn(error.response.data);
            node.send(msg);
          }
        })();

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
    const axios = require('axios');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!units) {
      units = 'm';
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

      var curStationId = StationId;
      if( typeof msg.twcparams.StationID != 'undefined' ) {
        curStationId = msg.twcparams.StationID.toUpperCase();
      }
      if( !curStationId ) {
        // No StationID is set. Abort with error
        msg.payload = "Error: No StationID provided.";
        node.send(msg);
      } else {
        msg.twcparams.StationID = curStationId;

        (async () => {
          try {
            const response = await axios.get('https://api.weather.com/v2/pws/observations/all/1day?stationId=' + msg.twcparams.StationID +'&format=json&units='+msg.twcparams.units+'&apiKey='+apiKey);
            //console.log(response.data)
            msg.payload = response.data;
            node.send(msg);
          } catch (error) {
            console.log(error.response.data);
            //console.log(error.response.status);
            node.warn(error.response.data);
            node.send(msg);
          }
        })();
      }
    });
  }
  RED.nodes.registerType("pws-1day-all",weatherPWS1DayRapidNode);
}
