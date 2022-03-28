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
    var precision = n.precision;
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
    if (!precision) {
      precision = 'i';
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

      if( typeof msg.twcparams.precision == 'undefined' ) {
        msg.twcparams.precision = precision;
      } else {
        msg.twcparams.precision = precision;
      }

      if ( msg.twcparams.precision == 'd') {
        var numericPrecision = '&numericPrecision=decimal';
      } else {
        var numericPrecision = '';
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
            const response = await axios.get('https://api.weather.com/v2/pws/observations/current?stationId=' + curStationId +'&format=json&units='+msg.twcparams.units+'&apiKey='+apiKey+numericPrecision);
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
  RED.nodes.registerType("pws-observations",weatherPWSCurrentObsNode);
}
