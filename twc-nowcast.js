module.exports = function(RED) {
  function weather6HrNowCastNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var units = n.units;
    var name = n.name;
    var locationtype = n.locationtype;
    var location= n.location;
    var lang = n.lang;
    var pwsConfigNode;
    var apiKey;
    const axios = require('axios');

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

      if( typeof msg.twcparams.location == 'undefined' ) {
        msg.twcparams.location = location;
      }

      if( typeof msg.twcparams.locationtype == 'undefined' ) {
        msg.twcparams.locationtype = locationtype;
      }

      var TWCendpoint ;
      if( msg.twcparams.locationtype == 'geocode' ) {
        const latlong = msg.twcparams.location.split(',')
        var latitude  = parseFloat(latlong[0]);
        var longitude = parseFloat(latlong[1]);
        if( isNaN(latitude) || isNaN(longitude) ) {
          node.warn("Not a valid geocode");
          return;
        }
        TWCendpoint = 'https://api.weather.com/v1/geocode/'+latitude+'/'+longitude+'/forecast/nowcast.json?language='+msg.twcparams.lang+'&units='+msg.twcparams.units+'&apiKey='+apiKey
      } else if( msg.twcparams.locationtype == 'postalKey' ) {
        // The Postal Code has a TWC proprietary location type (4) with the following format:
        // location/<postal code>:<location type>:<country code>
        const postal = msg.twcparams.location.split(':')
        if( typeof postal[1] == 'undefined' ) {
          node.warn("Missing Country. Not a valid postalKey");
          return;
        }
        TWCendpoint = 'https://api.weather.com/v1/location/'+postal[0]+':4:'+postal[1]+'/forecast/nowcast.json?language='+msg.twcparams.lang+'&units='+msg.twcparams.units+'&apiKey='+apiKey
      }

      (async () => {
        try {
          const response = await axios.get( TWCendpoint );
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
    });
  }
  RED.nodes.registerType("twc-nowcast",weather6HrNowCastNode);
}
